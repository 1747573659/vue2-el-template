<template>
  <div>
    <el-cascader style="width: 240px" :props="props" clearable @focus="focus" @change="change"></el-cascader>
  </div>
</template>

<script>
/**
 * 目前组件只支持二级或者三级地区联动,根据level传值进行区别，level为1则是省市联动,level为2则是省市区联动
 */
let areaLevel = 2
import { queryProvinceList, queryCityList } from '@/api/area'

export default {
  props: {
    level: {
      type: Number, 
      default: 2
    }
  },
  data() {
    return {
      props: {
        lazy: true,
        lazyLoad: async function (node, resolve) {
          const { level } = node
          let code = node?.data?.value
          if (code === '820000' || code === '810000') { // 由于澳门和香港只有两级联动，故做特殊处理
            areaLevel = 1
          }
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
              leaf: level >= areaLevel
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
    },
    focus() {
      areaLevel = this.level
    }
  },
  mounted() {
  }
}
</script>