<template>
  <!-- 权限待修改 -->
  <section v-permission.page="'SOFTWARE_INVENTORY_REPLACE_PLUS,SOFTWARE_INVENTORY_REPLACE_EDIT'">
    <el-tabs v-model="activeName" class="p-detail-tab">
      <el-tab-pane label="基本信息" name="basicInformation"></el-tab-pane>
      <el-tab-pane label="操作记录" name="operationLog" v-if="['edit', 'detail'].includes($route.query.status)"></el-tab-pane>
    </el-tabs>
    <keep-alive>
      <component :is="activeName"></component>
    </keep-alive>
  </section>
</template>

<script>
import { orderStatus } from './data'
import operationLog from '../components/operationLog'
import basicInformation from './components/basicInformation'

export default {
  name: 'softwareAuthorizationDetails',
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
      const { orderStatus: orderStatusVal } = this.$route.query
      document.querySelector('.e-tag_active span').innerText = `软件授权订单/${orderStatus.has(orderStatusVal) ? orderStatus.get(orderStatusVal).name : '新增'}`
    })
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
