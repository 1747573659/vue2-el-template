<template>
  <div>
    <el-cascader style="width: 240px" :props="props" clearable @change="change"></el-cascader>
  </div>
</template>

<script>
import { queryProvinceList, queryCityList } from '@/api/area'
export default {
  data() {
    return {
      props: {
        lazy: true,
        lazyLoad: async function (node, resolve) {
          const { level } = node
          console.log(node)
          let nodes = []
          let res
          // level为0时去请求省的列表，否则根据node.value去请求市和区，leaf用来判断是否有子节点
          if (level === 0) {
            res = await queryProvinceList()
          } else {
            res = await queryCityList({code: node.value})
          }
          res.forEach(item => {
            nodes.push({
              value: item.code,
              label: item.name,
              leaf: level >= 2
            })
          })
          resolve(nodes)
        }
      },
      provinceList: []
    }
  },
  methods: {
    change(value) {
      this.$emit('change', value)
    }
  },
  mounted() {
  }
}
</script>

<style lang="scss" scoped>
</style>