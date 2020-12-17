<template>
  <el-select
    :id="domID"
    @visible-change="visibleChange"
    v-model="selectValue"
    v-loadmore="selectLoadMore"
    filterable
    clearable
    remote
    :placeholder="placeholder"
    :remote-method="remoteMethod"
    @clear="clearSelectPage"
    @focus="clearSelectPage"
    @change="changeSelectPage"
  >
    <el-option v-for="item in options" :key="item[value]" :label="item[label]" :value="item[value]"></el-option>
    <div class="e-select-load">{{ isMaxPage ? '已全部加载完毕' : '正在加载下一页...' }}</div>
  </el-select>
</template>

<script>
export default {
  props: {
    placeholder: {
      type: String,
      default: ''
    },
    options: {
      type: [Array, Object],
      default: () => []
    },
    isMaxPage: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: 'name'
    },
    value: {
      type: String,
      default: 'id'
    },
    echoValue: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      domID: `domID${Math.floor(Math.random() * 100000000 + 1)}`, //随机生成一个唯一ID
      selectValue: ''
    }
  },
  directives: {
    loadmore: {
      bind: function(el, binding) {
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
    echoValue(val) {
      this.selectValue = val
    }
  },
  methods: {
    // 选项展开关闭回掉
    visibleChange(event) {
      if (event) {
        if (!this.options.length) {
          // 如果options为空，下面走没有意义所以return
          if (this.selectValue) {
            //筛选一下获取options
            this.remoteMethod(this.selectValue)
            setTimeout(() => {
              this.visibleChange(true)
            }, 500) //由于之前的人没有写回掉，所以先通过计时器自己回掉
          }
          return
        }
        // 如果展开
        let label = ''
        for (let i = 0; i < this.options.length; i++) {
          if (this.selectValue === this.options[i][this.value] || this.echoValue === this.options[i][this.label]) {
            label = this.options[i][this.label]
          }
        }
        setTimeout(() => {
          document.getElementById(this.domID).value = label || '' //通过ID原生绑定
        }, 200)
      }
    },
    remoteMethod(query) {
      if (query !== '') this.$emit('remoteMethod', query)
      else this.$emit('resetSelectPage')
    },
    selectLoadMore() {
      this.$emit('selectPageMore')
    },
    clearSelectPage() {
      this.$emit('resetSelectPage')
    },
    changeSelectPage() {
      this.$emit('changeSelectPage', this.selectValue)
    }
  }
}
</script>

<style lang="scss" scoped>
.e-select-load {
  margin: 5px 0;
  text-align: center;
  font-size: 10px;
}
</style>
