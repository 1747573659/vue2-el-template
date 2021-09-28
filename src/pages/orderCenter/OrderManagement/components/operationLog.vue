<template>
  <section class="p-operate-con">
    <div class="p-operate-tab">
      <el-table :data="tableData" v-loading="checkLogTabLock">
        <el-table-column prop="operateTypeName" label="操作类型"></el-table-column>
        <el-table-column prop="operateUserName" label="操作人"></el-table-column>
        <el-table-column prop="createTime" label="操作日期"></el-table-column>
        <el-table-column label="结论">
          <template slot-scope="scope">{{ ['通过', '不通过'][scope.row.result] || '--' }}</template>
        </el-table-column>
        <el-table-column prop="remark" label="意见"></el-table-column>
      </el-table>
    </div>
  </section>
</template>

<script>
import { operateLog } from '@/api/orderCenter/orderManagement'

export default {
  data() {
    return {
      checkLogTabLock: false,
      tableData: []
    }
  },
  mounted() {
    this.getOperateLog()
  },
  methods: {
    async getOperateLog() {
      try {
        const data = { orderType: this.$route.name === 'hardwarePurchaseDetails' ? 0 : 1, purchaseId: this.$route.query.id }
        this.tableData = await operateLog(data)
      } catch (error) {}
    }
  }
}
</script>

<style lang="scss" scoped>
.p-operate {
  &-con {
    border-top: 16px solid #f7f8fa;
  }
  &-tab {
    padding: 20px;
  }
}
</style>
