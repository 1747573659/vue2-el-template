<template>
  <div>
    <el-select
      class="select-page"
      v-model="value"
      v-loadmore="loadMore"
      filterable
      clearable
      remote
      @focus="focus"
      @change="change"
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
export default {
  props:{
    isMaxPage: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: ''
    },
    options: {
      type: [Array, Object],
      default: () => []
    },
    label: {
      type: String,
      default: 'name'
    },
    value: {
      type: String,
      default: 'id'
    }
  },
  data() {
    return {
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
  methods: {
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
    changeSelectPage(){
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
