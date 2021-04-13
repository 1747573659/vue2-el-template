<template>
  <el-select v-bind="$attrs" v-on="$listeners" v-loadmore="$listeners.loadmore" remote filterable clearable style="width: 100%;">
    <slot name="option">
      <el-option v-for="(item, index) in data" :label="item[optionLabel]" :value="item[optionValue]" :key="index"></el-option>
    </slot>
    <slot name="loadmore" v-if="showLoadMore">
      <div class="el-select-dropdown__empty">{{ isMaxPage ? '加载完毕' : '加载中' }}</div>
    </slot>
  </el-select>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    data: {
      type: [Array, Object],
      default: () => []
    },
    optionLabel: String,
    optionValue: String,
    isMaxPage: {
      type: Boolean,
      default: false
    },
    showLoadMore: {
      type: Boolean,
      default: true
    }
  },
  directives: {
    loadmore: {
      bind(el, binding) {
        const SELECTWRAP_DOM = el.querySelector('.el-select-dropdown .el-select-dropdown__wrap')
        SELECTWRAP_DOM.addEventListener('scroll', function() {
          const { scrollHeight, scrollTop, clientHeight } = this
          const CONDITION = scrollHeight - scrollTop <= clientHeight
          if (CONDITION) binding.value()
        })
      }
    }
  }
}
</script>
