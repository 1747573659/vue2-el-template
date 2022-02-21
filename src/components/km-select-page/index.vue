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
    modelName:{
      type: String,
      default:''
    },
    data: {
      type: [Array, Object],
      default: () => []
    },
    interfaceParameters: {
      type: Object,
      default: () => {}
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
  watch: {
    data: {
      handler (newVal) {
        this.filterObj(newVal)
      },
      immediate: true,
      deep: true
    }
  },
  data () {
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
  mounted() {
    if (this.modelName) {
      this.handleRemoteSearch(this.modelName)
      this.selectVal=this.modelName
    }
  },
  methods: {
    filterObj (objcArray) {
      for (let i = 0; i < objcArray.length; i++) {
        for (let j = i + 1; j < objcArray.length;) {
          if (objcArray[i][this.optionValue] === objcArray[j][this.optionValue]) {
            objcArray.splice(j, 1) // 去除重复的对象；
          } else {
            j++
          }
        }
      }
      this.$emit('update:data', objcArray)
      return objcArray
    },
    handleEchoVal(val) {
      this.selectVal = val
    },
    handleSelectFocus() {
      if (!this.data.length) {
        this.currentPage = 1
        this.request({ page: this.currentPage, ...this.interfaceParameters })
      }
    },
    handleSelectClear() {
      this.initSelect()
      this.queryParams = ''
      this.request({ page: this.currentPage, ...this.interfaceParameters })
    },
    handleRemoteSearch (query) {
      let updateData = []
      // 解决远程搜索时候原来list 会被清空问题
      if (this.data.length) { // 有值才去
        this.data.map(item => {
          if (this.$refs.selectPage.multiple) { // 多选是数组。单选是字符串
            if (this.selectVal.length) { // 要有选中值
              this.selectVal.map(it => {
                if (it === item[this.optionValue]) {
                  updateData.push({
                    [this.optionLabel]: item[this.optionLabel],
                    [this.optionValue]: it
                  })
                }
              })
            }
          } else {
            if (this.selectVal === item[this.optionValue]) {
              updateData.push({
                [this.optionLabel]: item[this.optionLabel],
                [this.optionValue]: this.selectVal
              })
            }
          }
        })
      }
      this.$emit('update:data', updateData)
      if (query !== this.queryParams) this.initSelect(updateData)
      this.checkSelectLoad = true
      this.queryParams = query
      this.request({ query, page: 1, ...this.interfaceParameters }).finally(() => {
        this.checkSelectLoad = false
      })
    },
    handleLoadMore() {
      if (this.isMaxPage || this.handleLoadMore.intercept) return
      this.handleLoadMore.intercept = true
      this.currentPage++
      this.request({ query: this.queryParams, page: this.currentPage, ...this.interfaceParameters }).finally(() => {
        this.handleLoadMore.intercept = false
      })
    },
    initSelect(updateData = []) {
      this.currentPage = 1
      this.$emit('update:data', updateData)
      this.$emit('update:isMaxPage', false)
      if (this.$refs.selectPage.$children[1].$children[0]) this.$refs.selectPage.$children[1].$children[0].wrap.scrollTop = 0
    }
  }
}
</script>
