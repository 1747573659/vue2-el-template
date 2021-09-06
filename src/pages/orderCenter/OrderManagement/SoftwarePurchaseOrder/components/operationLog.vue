<template>
  <section class="p-operate-con">
    <div class="p-operate-tab">
      <el-table :data="tableData" v-loading="checkLogTabLock">
        <el-table-column prop="type" label="操作类型"></el-table-column>
        <el-table-column prop="operator" label="操作人"></el-table-column>
        <el-table-column prop="operationDate" label="操作日期"></el-table-column>
        <el-table-column prop="expiry" label="结论">
          <template slot-scope="scope">{{ scope.row.expiry || '--' }}</template>
        </el-table-column>
        <el-table-column prop="opinion" label="意见"></el-table-column>
      </el-table>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      checkLogTabLock: false,
      tableData: [
        { type: '创建', operator: '张三', operationDate: '2020-08-24  09:00:00', expiry: '不通过', opinion: '填写不规范' },
        { type: '创建', operator: '张三', operationDate: '2020-08-24  09:00:00', expiry: '不通过', opinion: '填写不规范' },
        { type: '创建', operator: '张三', operationDate: '2020-08-24  09:00:00', expiry: '不通过', opinion: '填写不规范' },
        { type: '创建', operator: '张三', operationDate: '2020-08-24  09:00:00', expiry: '不通过', opinion: '填写不规范' }
      ]
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
