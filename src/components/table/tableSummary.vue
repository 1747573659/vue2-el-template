<template>
  <p v-if="list.length">
    <span :class="{ incorporate: item.incorporate, marginZerz: !index }" v-for="(item, index) of list" :key="index"
      >{{ item.label }}{{ item.hideValue ? '' : `${item.hideColon ? '' : ':'}${sorting(item)}` }}</span
    >
  </p>
</template>
<script>
import { formatNumber } from '@/utils'
export default {
  props: {
    value: {
      type: Object,
      required: true,
      default() {
        return {}
      }
    }
  },
  computed: {
    list: {
      get() {
        const arr = []
        const keys = Object.keys(this.value)
        for (let i = 0; i < keys.length; i++) {
          arr.push(this.value[keys[i]])
        }
        return arr
      },
      set() {}
    }
  },
  methods: {
    sorting(item) {
      if (item.value === '') {
        return ''
      }
      let value = item.value
      if (item.formatNumber && typeof value === 'number' && !isNaN(value)) {
        if (item.toFixed !== null) {
          value = formatNumber(value, item.toFixed)
        } else {
          value = formatNumber(value)
        }
      }
      if (item.sortingUp && Number(item.value) > 0) {
        // 如果有排序符号则排序
        value = `${item.sortingUp} ${item.value}`
      }
      if (item.sortingDown && Number(item.value) < 0 && item.sortingDown !== '-') {
        value = `${item.sortingDown} ${item.value}`
      }
      if (item.valueSpecial === '%') {
        value = `${value}%`
      }
      if (item.valueSpecial === '()') {
        value = `(${value})`
      }
      return value
    }
  }
}
</script>
<style lang="scss" scoped>
p {
  height: auto;
  line-height: 36px;
  padding: 0px 20px;
  background: #e5edfd;
  border: 1px solid #a6c4fe;
  margin-bottom: 20px;
  color: #3d4966;
  font-size: 14px;
  span {
    margin-left: 30px;
  }
}
.incorporate {
  margin-left: 10px;
}
.marginZerz {
  margin-left: 0px;
}
</style>
