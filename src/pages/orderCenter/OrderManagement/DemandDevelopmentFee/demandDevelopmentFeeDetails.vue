<template>
  <section>
    <el-tabs v-model="activeName" class="p-detail-tab" @tab-click="handleTabPane">
      <el-tab-pane label="基本信息" name="basicInformation"></el-tab-pane>
      <el-tab-pane label="操作记录" name="operationLog" v-if="['edit', 'detail'].includes($route.query.status)"></el-tab-pane>
    </el-tabs>
    <keep-alive>
      <component :is="activeName" :operateData="operateData"></component>
    </keep-alive>
  </section>
</template>

<script>
import { orderStatus } from './data'
import operationLog from '../components/operationLog.vue'
import basicInformation from './components/basicInformation.vue'

import { channelDevelopLog } from '@/api/orderCenter/orderManagement/demandDevelopmentFee'

export default {
  name: 'demandDevelopmentFeeDetails',
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
    this.$nextTick(() => {
      const { orderStatus: orderStatusVal } = this.$route.query
      document.querySelector('.e-tag_active span').innerText = `需求开发订单/${orderStatus.has(orderStatusVal) ? orderStatus.get(orderStatusVal).name : '新增'}`
    })
  },
  methods: {
    handleTabPane(tab) {
      if (tab.name === 'operationLog') this.getOperateLog()
      else this.operateData = []
    },
    async getOperateLog() {
      try {
        this.operateData = (await channelDevelopLog({ orderId: Number(this.$route.query.id), orderType: 1 })) || []
      } catch (error) {}
    }
  }
}
</script>

<style lang="scss" scoped>
.p-detail-tab {
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
