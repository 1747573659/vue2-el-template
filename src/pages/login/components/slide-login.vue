<template>
  <div class="km-slide-login__wrap">
    <!-- 刷新按钮 -->
    <i class="el-icon-refresh-right" @click="refresh"></i>
    <section class="km-slide-login__con">
      <div class="km-slide-login km-slide-login-main" :style="{ width: slideW + 38 + 'px' }">
        <div class="km-slide-login__title-group">
          <!-- 标题 -->
          <h3 class="km-slide-login__title">{{ title }}</h3>
          <!-- 关闭按钮 -->
          <i class="el-icon-close" @click="close"></i>
        </div>
        <!-- 背景滑块 -->
        <dir class="km-slide-login--inner" ref="kmSlideBlock">
          <div :style="{ width: slideW + 'px', height: slideH + 'px' }">
            <img :src="'data:image/jpeg;base64,' + slideBlockImgBg" alt="" ref="slideVerify" class="km-slide-login__bg" :width="slideW" :height="slideH" />
          </div>
          <!-- 图片 -->
          <div class="km-slide-login__img">
            <img
              v-if="slideBlockImg"
              class="km-slide-login__slide--img"
              ref="slideImgs"
              :src="'data:image/jpeg;base64,' + slideBlockImg"
              :width="(slideW / originalBgImgW) * originalSlideImgW"
              :height="slideH"
              :style="{ top: (slideW / originalBgImgW) * offsetY + 'px' }"
              @mousedown.prevent.stop="mouseDown"
              @touchstart.prevent.stop="touchStart"
              @touchmove.prevent.stop="mouseMove"
              @touchend.prevent.stop="mouseUp" />
            <p v-if="!slideBlockImg" class="km-slide-login__slide--img" ref="slideImgs"></p>
          </div>
          <!-- 遮罩 -->
          <div class="km-slide-login__mask" :style="{ height: slideH + 'px' }" v-if="status === 'success' || status === 'fail' || loading">
            <div class="km-slide-login__loading">
              <div class="sk-circle-fade">
                <div class="sk-circle-fade-dot"></div>
                <div class="sk-circle-fade-dot"></div>
                <div class="sk-circle-fade-dot"></div>
                <div class="sk-circle-fade-dot"></div>
                <div class="sk-circle-fade-dot"></div>
                <div class="sk-circle-fade-dot"></div>
                <div class="sk-circle-fade-dot"></div>
                <div class="sk-circle-fade-dot"></div>
              </div>
              <span>加载中···</span>
            </div>
          </div>
          <!-- 下面滑块部分 -->
          <div class="km-slide-login__line--wrap" ref="line" :style="{ width: slideW + 'px' }">
            <div class="km-slide-login__line bg-start" ref="bgStart" :style="{ width: slideW + 'px' }" :class="{ success: status === 'success', fail: status === 'fail' }">
              <div class="km-slide-login__line--bg" ref="bg"></div>
            </div>
            <div class="km-slide-login__btn--text" :style="{ width: slideW + 'px' }">
              <p v-if="status === 'pendding'">向右拖动滑块填充拼图</p>
              <p v-if="status === 'success'">验证成功</p>
              <p v-if="status === 'fail'">验证失败</p>
            </div>
            <div
              class="km-slide-login__btn"
              ref="btn"
              @mousedown.prevent.stop="mouseDown"
              @touchstart.prevent.stop="touchStart"
              @touchmove.prevent.stop="mouseMove"
              @touchend.prevent.stop="mouseUp"
              :class="{ info: loading, success: status === 'success', fail: status === 'fail' }">
              <i v-if="status === 'pendding'" class="el-icon-right"></i>
              <i v-if="status === 'fail'" class="el-icon-close"></i>
              <i v-if="status === 'success'" class="el-icon-check"></i>
            </div>
          </div>
        </dir>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'kmSlideLogin',
  props: {
    // 滑动成功失败状态：pendding, fail, success
    status: {
      type: String,
      default: 'pendding'
    },
    loading: {
      type: Boolean,
      default: false
    },
    // 滑块标题
    title: {
      type: String,
      default: ''
    },
    // 滑块图片背景宽度
    slideW: {
      type: Number,
      default: 280
    },
    slideH: {
      type: Number,
      default: 150
    },
    // 滑块背景图
    slideBlockImgBg: {
      type: String,
      required: true
    },
    // 滑块小图片地址
    slideBlockImg: {
      type: String,
      required: true
    },
    // 滑块小图片y值初始值偏移量
    offsetY: {
      type: Number,
      default: 0
    }
  },
  watch: {
    status(val) {
      // 失败时重新刷新
      if (val === 'fail') {
        this.$refs.bgStart.style.borderColor = '#f26666'
        this.$refs.bgStart.style.backgroundColor = '#f6e8e8'
        this.timer = setTimeout(() => {
          this.refresh()
        }, 500)
      } else if (val === 'success') {
        this.$refs.bgStart.style.borderColor = '#44c76b'
        this.$refs.bgStart.style.backgroundColor = '#e9f3ec'
      } else {
        this.$refs.bgStart.style.borderColor = '#1a92fd'
        this.$refs.bgStart.style.backgroundColor = '#ecf6ff'
      }
    }
  },
  data() {
    return {
      originalBgImgW: 590, // 原始背景图宽度（px）
      originalBgImgH: 360, // 原始背景图高度（px）
      originalSlideImgW: 93, // 原始滑块图片宽度（px）
      originalSlideImgH: 360, // 原始滑块图片高度（px）
      isDown: false, // 鼠标是否按下
      btnX: 0, // 鼠标点击的水平位置与滑块移动水平位置的差
      imgX: 0, // 图片的水平位置
      btnMovableDistance: 0, // 按钮可移动距离
      btnOffsetLeft: 0, // 按钮偏移
      timer: null
    }
  },
  methods: {
    mouseDown(e) {
      e.preventDefault()
      if (this.loading || this.status === 'success' || this.status === 'fail') return
      // 滑块按下去的时候，我们要设置isDown为true，为了确保是按下滑块滑动
      this.isDown = true
      // 点击滑块的位置，和滑块的左端相差的距离
      this.btnX = e.clientX - this.btnOffsetLeft
      document.querySelector('.km-slide-login__con').addEventListener('mousemove', this.mouseMove)
      document.querySelector('.km-slide-login__con').addEventListener('mouseup', this.mouseUp)
    },
    touchStart(e) {
      let touch
      if (e.touches) {
        // 有可能对象在e上也有可能对象在e.touches[0]上
        touch = e.touches[0]
      } else {
        touch = e
      }
      if (this.loading || this.status === 'success' || this.status === 'fail') return
      // 滑块按下去的时候，我们要设置isDown为true，为了确保是按下滑块滑动
      this.isDown = true
      // 点击滑块的位置，和滑块的左端相差的距离
      this.btnX = touch.clientX - this.btnOffsetLeft
    },
    mouseMove(e) {
      let touch
      if (e.touches) {
        // 有可能对象在e上也有可能对象在e.touches[0]上
        touch = e.touches[0]
      } else {
        touch = e
      }
      e.preventDefault()
      // 滑块左端向右边移动的距离
      let moveX = touch.clientX - this.btnX
      if (moveX > this.btnMovableDistance) {
        moveX = this.btnMovableDistance
      }
      if (moveX < 0) {
        moveX = 0
      }
      // 确认滑块是在按下时拖动
      if (!this.isDown) return
      // 滑块滑动的位置，不能超过最左端和最右端，就是不能让滑块滑出去
      if (this.$refs.btn && this.$refs.btn.offsetLeft <= this.btnMovableDistance && this.$refs.btn.offsetLeft >= 0) {
        // 滑块移动
        this.$refs.btn.style.left = `${moveX}px`

        // 小图移动
        this.$refs.slideImgs.style.left = `${moveX - this.imgX + 5}px`
        // 线条颜色
        this.$refs.bg.style.left = `${moveX + 5}px`
      } else {
        return false
      }
    },
    // mouseUp函数添加节流
    mouseUp(e) {
      e.preventDefault()
      e.stopPropagation()
      this.isDown = false
      document.removeEventListener('touchmove', this.mouseMove, false)
      document.removeEventListener('touchend', this.mouseUp, false)
      document.removeEventListener('mouseMove', this.mouseMove, false)
      document.removeEventListener('mouseUp', this.mouseUp, false)
      this.btnOffsetLeft = this.$refs.slideImgs && parseInt(this.$refs.slideImgs.style.left)
      this.$emit('update:status', 'pendding') // 重置status为pendding而不是success和fail,是因为如果每次请求的都是成功或者失败，那么是监听不到status的状态的
      if (this.btnOffsetLeft > 0) {
        this.$emit('getMouseUpData', Math.round((this.btnOffsetLeft * this.originalBgImgW) / this.slideW))
      }
    },
    // 刷新
    refresh() {
      this.$refs.btn.style.left = 0
      this.$refs.slideImgs.style.left = '5px'
      this.$refs.bg.style.left = 0
      this.btnOffsetLeft = 0
      this.$emit('update:status', 'pendding')
      this.$emit('refresh')
    },
    close() {
      this.$emit('close')
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.btnMovableDistance = this.$refs.line.offsetWidth - this.$refs.btn.offsetWidth // 可以滑动的距离
      this.btnOffsetLeft = this.$refs.btn.offsetLeft // 开始按钮偏移量
      this.$emit('update:status', 'pendding')
      // 将移动事件绑定在document上，绑定在dom元素上会导致滑块滑的太快触发不到鼠标移动事件
      // this.imageCanvas()
    })
  },
  destroyed() {
    this.timer = null
  }
}
</script>

<style lang="scss" scoped>
.km-slide-login {
  position: relative;
  width: 318px;
  margin: 0 auto;
  padding: 10px 18px 26px;
  box-sizing: border-box;
  border: 1px solid #e3e3e3;
  border-radius: 4px;
  box-shadow: 0px 0px 5px #eee;
}

.km-slide-login__title-group {
  display: flex;
  height: 25px;
  line-height: 25px;
  margin-bottom: 21px;
  justify-content: space-between;
  align-items: center;
  .km-slide-login__title {
    display: inline-block;
    width: 250px;
    font-size: 18px;
    color: #212430;
    line-height: 25px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: normal;
  }
  .el-icon-close {
    font-size: 25px;
    padding: 5px;
  }
  .el-icon-close:before {
    color: #212430;
  }
  .el-icon-close:hover {
    &:before {
      color: #1a92fd;
    }
  }
}

.km-slide-login--inner {
  padding: 0;
  margin: 0;
  position: relative;
  background: #fff;
  overflow: hidden;
}

.km-slide-login__slide--img {
  position: absolute;
  left: 5px;
  top: 10px;
  cursor: pointer;
}
.el-icon-refresh-right {
  position: absolute;
  right: 25px;
  top: 75px;
  font-size: 25px;
  cursor: pointer;
  z-index: 5000;
  &::before {
    color: #fff;
    transform: rotate(90deg);
  }
  &:hover {
    transform: rotate(90deg);
  }
}

.km-slide-login__line--wrap {
  position: relative;
  height: 44px;
  margin: 16px 0 0;
}
.km-slide-login__line {
  overflow: hidden;
  height: 44px;
  background: #ecf6ff;
  border: 1px solid #1a92fd;
  box-sizing: border-box;
  border-radius: 2px;
}

.km-slide-login__line--bg {
  position: absolute;
  height: 44px;
  background: #f8f8f8;
  border: 1px solid #e8e8e8;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  box-sizing: border-box;
}
.km-slide-login__btn--text {
  position: absolute;
  height: 44px;
  width: 100%;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  box-sizing: border-box;
  p {
    color: #666;
    font-size: 14px;
    line-height: 44px;
    text-align: center;
  }
}
.text {
  position: absolute;
  width: 100%;
  height: 40px;
  text-align: center;
  line-height: 40px;
  margin: 0;
}
.text-success {
  color: white;
  z-index: 2;
}
.km-slide-login__btn {
  cursor: pointer;
  position: absolute;
  width: 48px;
  height: 44px;
  line-height: 44px;
  text-align: center;
  top: 0;
  z-index: 99;
  background: #1a92fd;
  border-radius: 2px;
  .el-icon-right {
    font-size: 25px;
  }
  .el-icon-right,
  .el-icon-close,
  .el-icon-check {
    display: inline-block;
    height: 44px;
    line-height: 44px;
    &::before {
      color: #fff;
    }
  }
}
.info {
  background: #bbb;
  cursor: no-drop;
}
.success {
  background: #2fc25b;
  cursor: no-drop;
}
.fail {
  background: #ed2525;
  cursor: no-drop;
}
.km-slide-login__text {
  width: 70%;
  float: left;
  font-size: 14px;
  height: 40px;
  line-height: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.km-slide-login__mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  background-color: #f6f6f6;
  // background-color:rgba(0,0,0,0.8);
  .km-slide-login__loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .sk-circle-fade {
      margin: 0 auto;
      margin-bottom: 10px;
    }
    span {
      font-size: 12px;
      color: #1a92fd;
    }
  }
}

.km-slide-login__tip--success,
.km-slide-login__tip--fail {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: #d6d6d6;
}
.el-icon-circle-check {
  color: #2fc25b;
  border-radius: 50%;
  font-size: 30px;
  width: 40px;
  height: 40px;
  text-align: center;
}
.el-icon-warning {
  color: #ed2525;
  border-radius: 50%;
  font-size: 30px;
  width: 40px;
  height: 40px;
  text-align: center;
}

// loading
.sk-circle-fade {
  width: 28px;
  height: 28px;
  position: relative;
}

.sk-circle-fade-dot {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
}

.sk-circle-fade-dot:before {
  content: '';
  display: block;
  width: 30%;
  height: 30%;
  background-color: #1a92fd;
  border-radius: 100%;
  animation: sk-circle-fade 1.2s infinite ease-in-out both;
}

.sk-circle-fade-dot:nth-child(1) {
  transform: rotate(45deg);
}
.sk-circle-fade-dot:nth-child(2) {
  transform: rotate(90deg);
}
.sk-circle-fade-dot:nth-child(3) {
  transform: rotate(135deg);
}
.sk-circle-fade-dot:nth-child(4) {
  transform: rotate(180deg);
}
.sk-circle-fade-dot:nth-child(5) {
  transform: rotate(225deg);
}
.sk-circle-fade-dot:nth-child(6) {
  transform: rotate(270deg);
}
.sk-circle-fade-dot:nth-child(7) {
  transform: rotate(315deg);
}
.sk-circle-fade-dot:nth-child(1):before {
  animation-delay: -1.02s;
}
.sk-circle-fade-dot:nth-child(2):before {
  animation-delay: -0.85s;
}
.sk-circle-fade-dot:nth-child(3):before {
  animation-delay: -0.68s;
}
.sk-circle-fade-dot:nth-child(4):before {
  animation-delay: -0.51s;
}
.sk-circle-fade-dot:nth-child(5):before {
  animation-delay: -0.34s;
}
.sk-circle-fade-dot:nth-child(6):before {
  animation-delay: -0.17s;
}
.sk-circle-fade-dot:nth-child(7):before {
  animation-delay: -0.1s;
}

@keyframes sk-circle-fade {
  0%,
  30%,
  100% {
    opacity: 0;
    transform: scale(0.4);
  }
  31% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
