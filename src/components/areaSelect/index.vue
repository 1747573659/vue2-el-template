<template>
  <div>
    <el-cascader style="width: 240px" :props="props"></el-cascader>
  </div>
</template>

<script>
let id = 0;
export default {
  data() {
    return {
      // props: {
      //   lazy: true,
      //   lazyLoad (node, resolve) {
      //     console.log(node)
      //     console.log(resolve)
      //     const { level } = node;
      //     setTimeout(() => {
      //       const nodes = Array.from({ length: level + 1 })
      //         .map(item => ({
      //           value: ++id,
      //           label: `选项${id}`,
      //           leaf: level >= 2
      //         }));
      //       // 通过调用resolve将子节点数据返回，通知组件数据加载完成
      //       resolve(nodes);
      //     }, 1000);
      //   }
      // }
      provinceList: [],
      props: {
        lazy: true,
        lazyLoad (node, resolve) {
          console.log(node, resolve)
          const nodes = this.provinceList.map(item => ({
            value:  item.code,
            label: item.fullName,
            leaf: 1
          }))
          resolve(nodes)
        }
      }
    }
  },
  methods: {
    getProvinceList () {
      import('@/api/area').then(async module => {
        const res = await module.queryProvinceList()
        this.provinceList = res
      })
    }
  },
  created() {
    this.getProvinceList()
  }
}
</script>

<style lang="scss" scoped>
</style>