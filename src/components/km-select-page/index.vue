<template>
  <section>
    <el-select
      ref="selectPage"
      v-model="selectVal"
      v-loadmore="handleLoadMore"
      v-bind="$attrs"
      v-on="$listeners"
      @focus="handleSelectFocus"
      @clear="handleSelectClear"
      :loading="checkSelectLoad"
      :remote-method="handleRemoteSearch"
      remote
      filterable
      clearable
      style="width:100%"
    >
      <slot>
        <el-option v-for="(item, index) in data" :key="index" :label="item[optionLabel]" :value="item[optionValue]"></el-option>
      </slot>
      <div class="el-select-dropdown__empty">{{ isMaxPage ? '加载完毕' : '加载中...' }}</div>
    </el-select>
  </section>
</template>

<script>
export default {
  props: {
    data: {
      type: [Array, Object],
      default: () => []
    },
    optionLabel: {
      type: String,
      default: 'label'
    },
    optionValue: {
      type: String,
      default: 'value'
    },
    request: {
      type: Function,
      default: () => {}
    },
    isMaxPage: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      selectVal: '',
      queryParams: '',
      checkSelectLoad: false,
      currentPage: 1
    }
  },
  directives: {
    loadmore: {
      bind(el, binding) {
        const SELECTWRAP_DOM = el.querySelector('.el-select-dropdown .el-select-dropdown__wrap')
        let scrollListener = function() {
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
  methods: {
    handleSelectFocus() {
      if (!this.data.length) {
        this.currentPage = 1
        this.request({ page: this.currentPage })
      }
    },
    handleSelectClear() {
      this.initSelect()
      this.queryParams = ''
      this.request({ page: this.currentPage })
    },
    handleRemoteSearch(query) {
      this.$emit('update:data', [])
      if (query !== this.queryParams) this.initSelect()
      this.checkSelectLoad = true
      this.queryParams = query
      this.request({ query, page: 1 }).finally(() => {
        this.checkSelectLoad = false
      })
    },
    handleLoadMore() {
      if (this.isMaxPage || this.handleLoadMore.intercept) return
      this.handleLoadMore.intercept = true
      this.currentPage++
      this.request({ query: this.queryParams, page: this.currentPage }).finally(() => {
        this.handleLoadMore.intercept = false
      })
    },
    initSelect() {
      this.currentPage = 1
      this.$emit('update:data', [])
      this.$emit('update:isMaxPage', false)
      this.$refs.selectPage.$children[1].$children[0].wrap.scrollTop = 0
    }
  }
}
</script>
