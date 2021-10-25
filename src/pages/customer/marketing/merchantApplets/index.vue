<template>
  <div class="app-container">
    <div class="search-box">
      <el-form :inline="true" :model="form" label-suffix=":" @submit.native.prevent label-width="120px" ref="form" size="small" class="xdd-btn-block__w240">
        <el-row>
          <el-col :span="6">
            <el-form-item label="享钱商户名称">
              <el-input clearable placeholder="请输入享钱商户名称搜索" size="small" v-model.trim="form.sn"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="支付宝商户PID">
              <el-input clearable placeholder="请输入支付宝商户PID搜索" size="small" v-model.trim="form.sn"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="小程序名称">
              <el-input clearable placeholder="请输入小程序名称搜索" size="small" v-model.trim="form.sn"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="小程序版本">
              <el-input clearable placeholder="请输入小程序版本搜索" size="small" v-model.trim="form.sn"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态">
              <el-input clearable placeholder="请选择小程序状态搜索" size="small" v-model.trim="form.sn"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="小程序APPID">
              <el-input clearable placeholder="请输入小程序APPID搜索" size="small" v-model.trim="form.sn"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="联系人">
              <el-input clearable placeholder="请输入联系人/电话搜索" size="small" v-model.trim="form.sn"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="data-box">
      <el-button style="float:right" type="primary">订购小程序</el-button>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="date" label="钱商户名称" width="180"></el-table-column>
        <el-table-column prop="name" label="支付宝商户PID" width="180"></el-table-column>
        <el-table-column prop="address" label="小程序名称"></el-table-column>
        <el-table-column prop="address" label="小程序APPID"></el-table-column>
        <el-table-column prop="address" label="联系人"></el-table-column>
        <el-table-column prop="address" label="联系电话"></el-table-column>
        <el-table-column prop="address" label="小程序版本"></el-table-column>
        <el-table-column prop="address" label="状态"></el-table-column>
        <el-table-column prop="address" label="备注"></el-table-column>
        <el-table-column prop="address" label="基础资料维护"></el-table-column>
        <el-table-column prop="address" label="操作"></el-table-column>
      </el-table>
      <div class="km-page-block">
        <el-pagination :current-page="thisPage" :total="tableTotal" :page-size="pageSize" @size-change="handleSizeChange" @current-change="handleCurrentChange" background :page-sizes="[10, 15, 30]" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      form: {},
      tableLoading: false, // 表格加载
      tableTotal: 0, // 表格总页数
      thisPage: 1, // 当前页
      pageSize: 10, // 每页多少条
      tableData: []
    }
  },
  methods: {
    // 分页
    handleSizeChange (val) {
      this.thisPage = 1
      this.pageSize = val
      // this.authShopPage()
    },
    // 分页
    handleCurrentChange (val) {
      this.thisPage = val
      // this.authShopPage()
    },
  }
}
</script>
<style lang="scss" scoped>
.search-box {
  margin-left: -16px;
  margin-right: -16px;
  border-bottom: 16px solid #f7f8fa;
}
.el-pagination-box {
  text-align: right;
  margin-top: 20px;
  background: #fff;
  padding-bottom: 20px;
}
.search-form {
  /deep/.el-select {
    display: block;
  }
}
</style>
