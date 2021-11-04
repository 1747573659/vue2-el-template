<template>
  <section v-permission.page="'HARDWARE_PURCHASE_ORDER_PLUS,HARDWARE_PURCHASE_ORDER_EDIT'">
    <el-tabs v-model="activeName" class="p-hardware-tab" @tab-click="handleTabPane">
      <el-tab-pane label="基本信息" name="basicInformation"></el-tab-pane>
      <el-tab-pane label="操作记录" name="operationLog" v-if="['edit', 'detail'].includes($route.query.status)"></el-tab-pane>
    </el-tabs>
    <keep-alive>
      <component :is="activeName" :operateData="operateData"></component>
    </keep-alive>
  </section>
</template>

<script>
import { orderStatus } from '../index'
import operationLog from '../components/operationLog'
import basicInformation from './components/basicInformation.vue'

import { operateLog } from '@/api/orderCenter/orderManagement'

export default {
  name: 'hardwarePurchaseDetails',
  components: {
    basicInformation,
    operationLog
  },
  data() {
    return {
      activeName: 'basicInformation',
      operateData: []
    }
  },
  mounted() {
    this.getOperateLog()
    this.$nextTick(() => {
      const { orderStatus: orderStatusVal } = this.$route.query
      document.querySelector('.e-tag_active span').innerText = `硬件采购订单/${orderStatus.has(orderStatusVal) ? orderStatus.get(orderStatusVal).name : '新增'}`
    })
  },
  methods: {
    handleTabPane (tab) {
      if (tab.name === 'operationLog') this.getOperateLog()
    },
    async getOperateLog() {
      try {
        this.operateData = await operateLog({ orderType: 0, purchaseId: this.$route.query.id })
      } catch (error) {}
    }
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
