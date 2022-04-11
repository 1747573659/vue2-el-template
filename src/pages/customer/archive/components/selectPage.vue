<template>
  <el-select
    ref="selectPage"
    @focus="handleSelectFocus"
    @clear="handleSelectClear"
    :remote-method="handleSelectRemote"
    v-loadmore="handleSelectMore"
    v-bind="$attrs"
    v-on="$listeners"
    remote
    filterable
    clearable
    style="width: 100%">
    <el-option v-for="(item, index) in data" :label="item[optionLabel]" :value="item[optionValue]" :key="index"></el-option>
    <slot name="loadmore" v-if="showLoadMore">
      <div class="el-select-dropdown__empty">{{ isMaxPage ? '加载完毕' : '加载中' }}</div>
    </slot>
  </el-select>
</template>

<script>
export default {
  props: {
    data: {
      type: [Array, Object],
      require: true,
      default: () => []
    },
    optionLabel: String,
    optionValue: String,
    request: {
      type: Function,
      default: () => {}
    },
    isMaxPage: {
      type: Boolean,
      require: true,
      default: false
    },
    showLoadMore: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      selectPageNo: 1,
      searchStr: ''
    }
  },
  directives: {
    loadmore: {
      bind(el, binding) {
        const SELECTWRAP_DOM = el.querySelector('.el-select-dropdown .el-select-dropdown__wrap')
        let scrollListener = function () {
          const CONDITION = this.scrollHeight - Math.ceil(this.scrollTop) <= this.clientHeight
          if (CONDITION && this.scrollTop !== 0) binding.value()
        }
        el.unbindEventListener = () => {
          SELECTWRAP_DOM.removeEventListener('scroll', scrollListener)
        }
        SELECTWRAP_DOM.addEventListener('scroll', scrollListener)
      },
      unbind(el) {
        if (el.unbindEventListener) el.unbindEventListener()
      }
    }
  },
  mounted() {
    this.request()
  },
  methods: {
    handleSelectFocus() {
      if (!this.data.length) this.request()
    },
    handleSelectClear() {
      this.resetSelect()
      this.handleSelectRemote('')
    },
    handleSelectMore() {
      if (!this.showLoadMore || this.isMaxPage || this.handleSelectMore.intercept) return
      this.handleSelectMore.intercept = true
      this.selectPageNo++
      this.handleSelectRemote(this.searchStr).finally(() => {
        this.handleSelectMore.intercept = false
      })
    },
    handleSelectRemote: async function (query) {
      if (query !== this.searchStr) this.resetSelect()
      this.searchStr = query
      await this.request({ query, page: query !== this.searchStr ? 1 : this.selectPageNo })
    },
    resetSelect() {
      this.$refs.selectPage.$children[1].$children[0].wrap.scrollTop = 0
      this.selectPageNo = 1
      this.$emit('update:data', [])
      this.$emit('update:isMaxPage', false)
    }
  }
}
</script>
