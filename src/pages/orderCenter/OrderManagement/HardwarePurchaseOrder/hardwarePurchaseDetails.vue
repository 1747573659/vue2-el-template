<template>
  <section v-permission.page="'HARDWARE_PURCHASE_ORDER_PLUS,HARDWARE_PURCHASE_ORDER_EDIT'">
    <el-tabs v-model="activeName" class="p-hardware-tab">
      <el-tab-pane label="基本信息" name="basicInformation"></el-tab-pane>
      <el-tab-pane label="操作记录" name="operationLog" v-if="['edit', 'detail'].includes($route.query.status)"></el-tab-pane>
    </el-tabs>
    <keep-alive>
      <component :is="activeName"></component>
    </keep-alive>
  </section>
</template>

<script>
import basicInformation from './components/basicInformation'
import operationLog from './components/operationLog'

export default {
  name: 'hardwarePurchaseDetails',
  components: {
    basicInformation,
    operationLog
  },
  data() {
    return {
      activeName: 'basicInformation'
    }
  },
  mounted() {
    this.$nextTick(() => {
      const tags = { edit: '编辑', detail: '详情', add: '新增' }
      document.querySelector('.e-tag_active span').innerText = `硬件采购订单/${this.$route.query.status ? tags[this.$route.query.status] : '新增'}`
    })
  }
}
</script>

<style lang="scss" scoped>
.p-hardware-tab {
  margin-left: -16px;
  margin-right: -16px;
  background-color: #fff;
  padding-left: 16px;
  padding-right: 16px;
  /deep/ {
    .el-tabs__header {
      margin-bottom: 0;
    }
  }
}
</style>
