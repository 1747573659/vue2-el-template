<template>
  <el-select
    v-model="selectValue"
    v-loadmore="selectLoadMore"
    filterable
    clearable
    remote
    :placeholder="placeholder"
    :remote-method="remoteMethod"
    @clear="clearSelectPage"
    @focus="clearSelectPage"
    @change="remoteMethod"
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
    }
  },
  data() {
    return {
      selectValue: []
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
