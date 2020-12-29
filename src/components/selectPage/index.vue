<template>
  <div>
    <el-select
      :id="domID"
      @visible-change="visibleChange"
      class="select-page"
      v-model="bindValue"
      v-loadmore="loadMore"
      filterable
      clearable
      remote
      @change="change"
      :disabled="disabled"
      @clear="clear"
      :placeholder="placeholder"
      :remote-method="remoteMethod"
    >
      <el-option v-for="(item, index) in options" :key="index" :label="item.name" :value="item.id"> </el-option>
      <div class="loading-page">{{ isMaxPage ? '已全部加载完毕' : '正在加载下一页' }}</div>
    </el-select>
  </div>
</template>

<script>
/**
 * 用法请参照xftArchiveAdd.vue,有注释进行说明
 * 技术有限，若觉得可以改进，可以联系我进行修改
 *
 */
export default {
  data() {
    return {
      domID: `domID${Math.floor(Math.random() * 100000000 + 1)}`, //随机生成一个唯一ID
      bindValue: ''
    }
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    isMaxPage: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: ''
    },
    options: {
      type: Array,
      default: () => []
    },
    id: {
      type: String,
      default: 'id'
    },
    name: {
      type: String,
      default: 'name'
    }
  },
  directives: {
    loadmore: {
      // 指令的定义
      bind: function(el, binding) {
        // 获取km-ui定义好的scroll盒子
        const SELECTWRAP_DOM = el.querySelector('.el-select-dropdown .el-select-dropdown__wrap')
        SELECTWRAP_DOM.addEventListener('scroll', function() {
          const CONDITION = this.scrollHeight - this.scrollTop <= this.clientHeight
          if (CONDITION) {
            binding.value()
          }
        })
      }
    }
  },
  watch: {
    value:{
      handler (val) {
        if (val) this.bindValue = this.value
      },
      immediate: true
    },
    options() {
      if (this.options?.length > 0) {
        if (this.id !== 'id') {
          this.options.forEach(item => {
            item.id = item[this.id]
          })
        }
        if (this.name !== 'name') {
          this.options.forEach(item => {
            item.name = item[this.name]
          })
        }
      }
    }
  },
  methods: {
    // 选项展开关闭回掉
    visibleChange(event) {
      if (event) {
        // 如果展开
        let label = ''
        if (!this.options.length) {
          // 如果options为空，下面走没有意义所以return
          if (this.bindValue) {
            //     //筛选一下获取options
            this.remoteMethod(this.bindValue)
            setTimeout(() => {
              this.visibleChange(true)
            }, 500) //由于之前的人没有写回掉，所以先通过计时器自己回掉
          }
          return
        }
        for (let i = 0; i < this.options.length; i++) {
          if (
            this.bindValue === this.options[i].id ||
            this.value === this.options[i].name //回写时候没有传ID进来，只能根据ID匹配
          ) {
            label = this.options[i].name
          }
        }
        setTimeout(() => {
          document.getElementById(this.domID).value = label || '' //通过ID原生绑定
        }, 200)
      }
    },
    remoteMethod(query) {
      this.$emit('remoteMethod', query)
    },
    loadMore() {
      this.$emit('loadMore')
    },
    change(value) {
      this.$emit('change', value)
    },
    clear() {
      this.$emit('clear')
    },
    focus() {
      this.$emit('focus')
    }
  }
}
</script>

<style lang="scss" scoped>
.select-page {
  width: 240px;
}
.loading-page {
  margin: 5px 0;
  text-align: center;
  font-size: 10px;
}
</style>
