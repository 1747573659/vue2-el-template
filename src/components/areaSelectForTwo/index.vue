<template>
  <div>
    <el-cascader v-bind="$attrs" style="width: 240px" v-model="value" :props="props" clearable @change="change"></el-cascader>
  </div>
</template>

<script>
/**
 * 省市两级选择组件
 */
import { queryProvinceList, queryCityList } from '@/api/area'

export default {
  props: {
    areaList: {
      // 用于回显传入数据
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      props: {
        lazy: true,
        lazyLoad: async function (node, resolve) {
          const { level } = node
          let nodes = []
          let res
          // level为0时去请求省的列表，否则根据node.value去请求市和区，leaf用来判断是否有子节点
          if (level === 0) {
            res = await queryProvinceList()
          } else {
            res = await queryCityList({ code: node.value })
          }
          res.forEach(item => {
            nodes.push({
              value: item.code,
              label: item.name,
              leaf: level >= 1
            })
          })
          resolve(nodes)
        }
      },
      provinceList: [],
      value: this.areaList
    }
  },
  methods: {
    // 用于输出数据
    change(value) {
      this.$emit('change', value)
    }
  }
}
</script>
