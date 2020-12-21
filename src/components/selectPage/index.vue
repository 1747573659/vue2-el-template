<template>
  <div>
    <el-select
      class="select-page"
      v-model="bindValue"
      v-loadmore="loadMore"
      filterable
      clearable
      remote
      @focus="focus"
      @change="change"
      :disabled="disabled"
      @clear="clear"
      :placeholder="placeholder"
      :remote-method="remoteMethod"
      >
      <el-option
        v-for="item in options"
        :key="item.id"
        :label="item.name"
        :value="item.id">
      </el-option>
      <div class="loading-page">{{isMaxPage ? '已全部加载完毕' : '正在加载下一页'}}</div>
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
      bindValue: ''
    }
  },
  props:{
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
      bind: function (el, binding) {
        // 获取km-ui定义好的scroll盒子
        const SELECTWRAP_DOM = el.querySelector('.el-select-dropdown .el-select-dropdown__wrap')
        SELECTWRAP_DOM.addEventListener('scroll', function () {
          const CONDITION = this.scrollHeight - this.scrollTop <= this.clientHeight
          if (CONDITION) {
            binding.value()
          }
        })
      }
    }
  },
  computed: {
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
  },
}
</script>

<style lang="scss" scoped>
.select-page {
  width: 240px;
}
.loading-page {
  margin: 5px 0;
  text-align: center;
  // color: #212430;
  font-size: 10px;
}
</style>