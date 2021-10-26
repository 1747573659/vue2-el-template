<template>
  <div class="app-container">
    <div class="search-box">
      <el-form :inline="true" :model="form" label-suffix=":" label-width="120px" ref="form" size="small" class="xdd-btn-block__w240">
        <el-row>
          <el-col :span="6">
            <el-form-item label="享钱商户名称">
              <el-input @clear="()=>{
                form.shopName=''
                form.shopId=''
                }" @focus="selectSeach('shopName')" clearable placeholder="请输入享钱商户名称搜索" size="small" v-model.trim="form.shopName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="支付宝商户PID">
              <el-input clearable placeholder="请输入支付宝商户PID搜索" size="small" maxlength="30" v-model.trim="form.shopPID"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="小程序名称">
              <el-input clearable placeholder="请输入小程序名称搜索" size="small" maxlength="15" v-model.trim="form.appName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="小程序版本">
              <el-select clearable v-model="form.appVersion" filterable placeholder="请输入小程序版本搜索">
                <el-option v-for="(item,index) in appVersionOption" :key="index" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态">
              <el-select clearable v-model="form.status" filterable placeholder="请选择小程序状态搜索">
                <el-option v-for="(item,index) in appVersionOption" :key="index" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="小程序APPID">
              <el-input clearable placeholder="请输入小程序APPID搜索" size="small" maxlength="30" v-model.trim="form.appID"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="联系人">
              <el-input clearable placeholder="请输入联系人/电话搜索" maxlength="15" size="small" v-model.trim="form.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-button @click="getTable" type="primary" size="small">搜索</el-button>
            <el-button @click="clearFrom" size="small">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="data-box">
      <el-button @click="selectSeach('orderApp')" v-permission="'MARKETINGMANAGEMENT_ORDER'" style="float:right;margin-bottom:16px" size="small" type="primary">订购小程序</el-button>
      <el-table :data="tableData" v-loading="tableLoading" style="width: 100%">
        <el-table-column prop="date" label="享钱商户名称" width="180"></el-table-column>
        <el-table-column prop="name" label="支付宝商户PID" width="180"></el-table-column>
        <el-table-column prop="address" label="小程序名称"></el-table-column>
        <el-table-column prop="address" label="小程序APPID"></el-table-column>
        <el-table-column prop="address" label="联系人"></el-table-column>
        <el-table-column prop="address" label="联系电话"></el-table-column>
        <el-table-column prop="address" label="小程序版本"></el-table-column>
        <el-table-column prop="address" label="状态"></el-table-column>
        <el-table-column prop="address" label="备注"></el-table-column>
        <el-table-column prop="address" label="基础资料维护">
          <template scope="scope">
            <el-button v-permission="'MARKETINGMANAGEMENTMAINNTEN'" @click="marketingDetile(scope.row)" type="text">基础资料维护</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="操作">
          <template>
            <el-button @click="xcxDialogVisible=true" v-permission="'MARKETINGMANAGEMENTlOOKAPP'" type="text">查看小程序</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="km-page-block">
        <el-pagination :current-page="thisPage" :total="tableTotal" :page-size="pageSize" @size-change="handleSizeChange" @current-change="handleCurrentChange" background :page-sizes="[10, 15, 30]" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
      </div>
    </div>
    <selectPage @sureVal='sureVal' v-bind:dialogVisible.sync='dialogVisible' :placeholder='selectPageAttribute.placeholder' :title="selectPageAttribute.title"></selectPage>
    <el-dialog title="商户小程序订购" :visible.sync="zfbDialogVisible" width="820px">
      <iframe src="https://opendocs.alipay.com/mini/introduce/qrcode" align='middle' frameborder='0' height='600' width='800'></iframe>
    </el-dialog>
    <el-dialog title="扫码进入小程序" :visible.sync="xcxDialogVisible" width="820px">
      <div style="text-align: center;">
        <img style="width:300px;" src="https://img0.baidu.com/it/u=812185057,1528141080&fm=26&fmt=auto">
      </div>
      <div slot="footer" style=" text-align: center;" class="dialog-footer">
        <el-button @click="xcxDialogVisible=false" size="small">关 闭</el-button>
        <el-button type="primary" size="small">下 载</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import selectPage from './components/selectPage.vue'
export default {
  name: 'marketingManagement',
  components: { selectPage },
  data () {
    return {
      xcxDialogVisible: false,
      zfbDialogVisible: false,
      appVersionOption: [],
      selectPageAttribute: {
        title: '',
        placeholder: '',
        ref: ''
      },
      dialogVisible: false,
      form: {
        shopName: '', // 享钱商户名称
        shopId: '', // 享钱商户ID
        shopPID: '', // 支付宝商户PID
        appName: '', // 小程序名称
        appVersion: '', // 小程序版本
        status: '', // 状态
        appID: '', // 小程序APPID
        name: '' // 联系人
      },
      tableLoading: false, // 表格加载
      tableTotal: 0, // 表格总页数
      thisPage: 1, // 当前页
      pageSize: 10, // 每页多少条
      tableData: []
    }
  },
  created () {
    this.getTable()
  },
  methods: {
    marketingDetile (row) {
      this.$router.push({ name: 'marketingDetile' })
    },
    clearFrom () {
      this.form = {
        shopName: '', // 享钱商户名称
        shopId: '', // 享钱商户ID
        shopPID: '', // 支付宝商户PID
        appName: '', // 小程序名称
        appVersion: '', // 小程序版本
        status: '', // 状态
        appID: '', // 小程序APPID
        name: '' // 联系人
      }
    },
    sureVal (value) {
      const ref = this.selectPageAttribute.ref
      if (ref === 'shopName') {
        this.form.shopName = value.tableItem.name
        this.form.shopId = value.tableItem.id
      }
      if (ref === 'orderApp') {
        this.zfbDialogVisible = true
      }
    },
    selectSeach (ref) {
      this.selectPageAttribute.ref = ref
      if (ref === 'shopName') {
        this.selectPageAttribute.title = '享钱商户查询'
        this.selectPageAttribute.placeholder = '请输入享钱商户名称搜索'
      }
      if (ref === 'orderApp') {
        this.selectPageAttribute.title = '商户小程序订购'
        this.selectPageAttribute.placeholder = '请输入享钱商户名称搜索'
      }
      this.dialogVisible = true
    },
    // 分页
    handleSizeChange (val) {
      this.thisPage = 1
      this.pageSize = val
      this.getTable()
    },
    // 分页
    handleCurrentChange (val) {
      this.thisPage = val
      this.getTable()
    },
    async getTable () {
      this.tableLoading = true
      // const res = await authShopPage(subData)
      this.tableLoading = false
      // this.tableData = res.results
      // this.tableTotal = res.totalCount
      this.tableData = [{
        name: '支付宝商户PID'
      }]
      this.tableTotal = 1
    }
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
