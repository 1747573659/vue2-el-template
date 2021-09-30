<template>
  <el-dialog v-bind="$attrs" v-on="$listeners" :destroy-on-close="true" append-to-body title="选择产品" width="800px">
    <el-form :inline="true" label-suffix=":" label-width="100px" @submit.native.prevent>
      <el-form-item label="产品信息">
        <el-input v-model="productVal" maxlength="50" placeholder="请输入产品编码/名称" clearable></el-input>
      </el-form-item>
      <el-button type="primary" size="small" @click="getProductPage">查询</el-button>
    </el-form>
    <el-table :data="tableData" v-loading="checkProductTabLock">
      <el-table-column header-align="center" align="center" width="80">
        <template slot-scope="scope">
          <el-radio v-model="checkProductVal" :label="scope.$index"></el-radio>
        </template>
      </el-table-column>
      <el-table-column prop="userName" label="产品编码"></el-table-column>
      <el-table-column prop="productName" label="产品名称"></el-table-column>
    </el-table>
    <km-pagination :request="getProductPage" :current-page.sync="currentPage" :page-size.sync="pageSize" :total="totalPage" />
    <div slot="footer">
      <el-button @click="$emit('update:visible', false)" size="small">取消</el-button>
      <el-button type="primary" @click="handleGuarantor" size="small">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      productVal: '',
      checkProductVal: '',
      checkProductTabLock: false,
      tableData: [],
      currentPage: 1,
      totalPage: 0,
      pageSize: 10
    }
  },
  methods: {}
}
</script>

<style lang="scss" scoped>

</style>
