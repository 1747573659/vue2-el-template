<template>
  <el-cascader v-model="value" :props="props" @change="handleChange" placeholder="请选择品牌行业" clearable></el-cascader>
</template>

<script>
import { queryTradeById } from '@/api/customer/merchant'
export default {
  name: 'BrandSelect',
  model: {
    prop: 'brandValue',
    event: 'brandChange'
  },
  props: {
    brandValue: {
      type: [String, Array],
      required: true
    }
  },
  data() {
    return {
      value: this.brandValue,
      props: {
        lazy: true,
        async lazyLoad(node, resolve) {
          const { level } = node
          let res
          if (level === 0) {
            res = await queryTradeById({ id: 0 })
          } else {
            res = await queryTradeById({ id: node.value })
          }

          let nodes = res.map(item => ({
            value: item.id,
            label: item.name,
            leaf: level >= 1
          }))
          resolve(nodes)
        }
      }
    }
  },
  methods: {
    handleChange(value) {
      this.$emit('brandChange', value)
    }
  }
}
</script>

<style lang="scss" scoped></style>
