<template>
  <div class="app-container">
    <div class="search-box">
      <el-form :inline="true" :model="form" label-suffix=":" :rules="rules" label-width="120px" ref="form" size="small" class="xdd-btn-block__w240">
        <el-row>
          <el-form-item label="享钱商户名称">
            <el-input class="p-form-input_width" @clear="()=>{
                form.shopAdminName=''
                form.shopAdminId=''
                }" @focus="selectSeach('shopAdminName')" clearable placeholder="请输入享钱商户名称搜索" size="small" v-model.trim="form.shopAdminName"></el-input>
          </el-form-item>
          <el-form-item label="支付宝商户PID">
            <el-input class="p-form-input_width" clearable placeholder="请输入支付宝商户PID搜索" size="small" maxlength="30" v-model.trim="form.authPid"></el-input>
          </el-form-item>
          <el-form-item label="小程序名称" prop="miniProgramName">
            <el-input class="p-form-input_width" clearable placeholder="请输入小程序名称搜索" size="small" maxlength="20" v-model.trim="form.miniProgramName"></el-input>
          </el-form-item>
          <el-form-item label="小程序版本">
            <el-select class="p-form-input_width" clearable v-model="form.version" filterable placeholder="请输入小程序版本搜索">
              <el-option v-for="(item,index) in appVersionOption" :key="index" :label="item.version" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-select class="p-form-input_width" clearable v-model="form.status" filterable placeholder="请选择小程序状态搜索">
              <el-option v-for="(item,index) in queryAllStatusOption" :key="index" :label="item.statusTypeDesc" :value="item.statusType"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="小程序APPID">
            <el-input class="p-form-input_width" clearable placeholder="请输入小程序APPID搜索" size="small" maxlength="30" v-model.trim="form.miniProgramAppid"></el-input>
          </el-form-item>
          <el-form-item label="联系人" prop="name">
            <el-input class="p-form-input_width" clearable placeholder="请输入联系人/电话搜索" size="small" v-model.trim="form.name"></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-button @click="search" type="primary" size="small">搜索</el-button>
            <el-button @click="clearFrom" size="small">重置</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
    <div class="data-box">
      <el-button @click="selectSeach('orderApp')" v-permission="'MARKETINGMANAGEMENT_ORDER'" style="float:right;margin-bottom:16px" size="small" type="primary">订购小程序</el-button>
      <el-table :data="tableData" v-loading="tableLoading" style="width: 100%">
        <el-table-column prop="merchantName" label="享钱商户名称"></el-table-column>
        <el-table-column prop="authPid" label="支付宝商户PID"></el-table-column>
        <el-table-column prop="miniProgramName" label="小程序名称"></el-table-column>
        <el-table-column prop="miniProgramAppid" label="小程序APPID"></el-table-column>
        <el-table-column prop="createTime" width="110" align='center' label="订购时间"></el-table-column>
        <el-table-column prop="name" label="联系人"></el-table-column>
        <el-table-column prop="phone" label="联系电话"></el-table-column>
        <el-table-column prop="versionName" label="小程序版本"></el-table-column>
        <el-table-column prop="status" label="状态">
          <template scope="scope">
            <span>{{initQqueryAllStatus(scope.row.status)}}</span>
            <span v-if="[10,11].includes(scope.row.status)">({{scope.row.errorMsg}})</span>
          </template>
        </el-table-column>
        <el-table-column prop="miniDesc" label="备注"></el-table-column>
        <el-table-column label="基础资料维护">
          <template scope="scope">
            <el-button v-if="[1,2].includes(scope.row.status)" v-permission="'MARKETINGMANAGEMENTMAINNTEN'" @click="marketingDetile(scope.row,'add')" type="text">基础资料维护</el-button>
            <el-button v-if="[8,9,10,11].includes(scope.row.status)" v-permission="'MARKETINGMANAGEMENTMAINNTEN'" @click="marketingDetile(scope.row,'edit')" type="text">更改小程序资料</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width='220'>
          <template scope="scope">
            <el-button :loading="loadingField==`versionUpload${scope.$index}`" v-if="[3].includes(scope.row.status)" @click="versionUpload(scope)" v-permission="'MARKETINGMANAGEMENTBUILDIMMEDIATELY'" type="text">立即构建</el-button>
            <el-button :loading="loadingField==`versionReUpload${scope.$index}`" v-if="[10].includes(scope.row.status)" @click="versionReUpload(scope)" v-permission="'MARKETINGMANAGEMENTBUILDIMMEDIATELY'" type="text">重新构建</el-button>
            <el-button :loading="loadingField==`queryVersion${scope.$index}`" v-if="[4].includes(scope.row.status)" @click="queryVersion(scope)" v-permission="'MARKETINGMANAGEMENTSTATUSlOOK'" type="text">构建状态查询</el-button>
            <el-button :loading="loadingField==`auditApply${scope.$index}`" v-if="[5].includes(scope.row.status)" @click="auditApply(scope)" v-permission="'MARKETINGMANAGEMENTSUBBITSHENGHE'" type="text">提交审核</el-button>
            <el-button :loading="loadingField==`auditReApply${scope.$index}`" v-if="[11].includes(scope.row.status)" @click="auditReApply(scope)" v-permission="'MARKETINGMANAGEMENTSUBBITSHENGHE'" type="text">重新提交审核</el-button>
            <el-button :loading="loadingField==`queryAudit${scope.$index}`" v-if="[6].includes(scope.row.status)" @click="queryAudit(scope)" v-permission="'MARKETINGMANAGEMENTSUBBITSHENGHESTATUSlOOK'" type="text">审核状态查询</el-button>
            <el-button :loading="loadingField==`online${scope.$index}`" v-if="[7,9].includes(scope.row.status)" @click="online(scope)" v-permission="'MARKETINGMANAGEMENTSUBBITSHANGJIA'" type="text">上架</el-button>
            <el-button :loading="loadingField==`offline${scope.$index}`" v-if="[8].includes(scope.row.status)" @click="offline(scope)" v-permission="'MARKETINGMANAGEMENTSUBBITXIAJIA'" type="text">下架</el-button>
            <el-button :loading="loadingField==`qrcodeCreate${scope.$index}`" v-if="[8].includes(scope.row.status)" @click="qrcodeCreate(scope)" v-permission="'MARKETINGMANAGEMENTlOOKAPP'" type="text">查看小程序</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="km-page-block">
        <el-pagination :current-page="thisPage" :total="tableTotal" :page-size="pageSize" @size-change="handleSizeChange" @current-change="handleCurrentChange" background :page-sizes="[10, 15, 30]" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
      </div>
    </div>
    <selectPage @sureVal='sureVal' :listApi='queryShopListByPage' v-bind:dialogVisible.sync='dialogVisible' :placeholder='selectPageAttribute.placeholder' :title="selectPageAttribute.title"></selectPage>
    <el-dialog title="商户小程序订购" :visible.sync="zfbDialogVisible" width="820px">
      <iframe :src="iframeSrc" align='middle' frameborder='0' height='600' width='800'></iframe>
    </el-dialog>
    <el-dialog title="扫码进入小程序" :visible.sync="xcxDialogVisible" width="820px">
      <div ref="code" style="text-align: center;width:300px;margin:auto;padding:10px;">
        <img style="width:100%;" :src="qrcodeUrl">
        <div style="margin:16px auto;font-weight: bold;">{{qrcodeName}}</div>
      </div>
      <div slot="footer" style=" text-align: center;" class="dialog-footer">
        <el-button @click="xcxDialogVisible=false" size="small">关 闭</el-button>
        <el-button @click="codeImgDown(qrcodeName)" type="primary" size="small">下 载</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import selectPage from './components/selectPage.vue'
import { codeImgDown } from '@/utils/codeImgDown'
import { queryShopListByPage } from '@/api/customer/merchant'
import { queryPage, auditApply, queryAllStatus, queryAllVersion, createLinkUrl, versionUpload, auditReApply, qrcodeCreate, queryVersion, queryAudit, online, offline, versionReUpload } from '@/api/alipay'
import { getLocal } from '@/utils/storage'
export default {
  name: 'marketingManagement',
  components: { selectPage },
  data () {
    var checkRegMiniName = (rule, value, callback) => {
      if (value) {
        let reg = /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/
        if (!reg.test(value)) {
          return callback(new Error('仅支持中文、数字、英文及下划线'))
        }
      }
      callback()
    }
    return {
      iframeSrc: '',//链接地址
      loadingField: '', // 加载的字段
      qrcodeUrl: '', // 小程序二维码
      qrcodeName: '', // 小程序二维码名称
      rules: {
        miniProgramName: [
          { required: false, min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' },
          { validator: checkRegMiniName, trigger: 'blur' }
        ],
        name: [
          { required: false, min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' },
          { validator: checkRegMiniName, trigger: 'blur' }
        ],
      },
      queryAllStatusOption: [],// 审核状态
      queryShopListByPage, // 享钱API
      xcxDialogVisible: false, // 小程序弹框
      zfbDialogVisible: false, // 支付宝弹框
      appVersionOption: [], // 小程序版本
      selectPageAttribute: {
        title: '',
        placeholder: '',
        ref: ''
      }, // 选择弹框参数
      dialogVisible: false,// 选择弹框
      form: {
        shopAdminName: '', // 享钱商户名称
        shopAdminId: '', // 享钱商户ID
        authPid: '', // 支付宝商户PID
        miniProgramName: '', // 小程序名称
        version: '', // 小程序版本
        status: '', // 状态
        miniProgramAppid: '', // 小程序APPID
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
    this.queryAllStatus()
    this.queryAllVersion()
  },
  methods: {
    // 立即构建
    async versionUpload (scope) {
      this.loadingField = `versionUpload${scope.$index}`
      try {
        await versionUpload({
          currentStatus: scope.row.status,
          id: scope.row.id
        })
        this.$message.success('构建成功')
        this.getTable()
      } catch (error) {
      } finally {
        this.loadingField = ''
      }
    },
    // 重新构建
    async versionReUpload (scope) {
      this.loadingField = `versionReUpload${scope.$index}`
      try {
        await versionReUpload({
          currentStatus: scope.row.status,
          id: scope.row.id
        })
        this.$message.success('构建成功')
        this.getTable()
      } catch (error) {
      } finally {
        this.loadingField = ''
      }
    },
    // 构建状态查询
    async queryVersion (scope) {
      this.loadingField = `queryVersion${scope.$index}`
      try {
        await queryVersion({
          currentStatus: scope.row.status,
          id: scope.row.id
        })
        this.getTable()
      } catch (error) {
      } finally {
        this.loadingField = ''
      }
    },
    // 提交审核
    async auditApply (scope) {
      this.loadingField = `auditApply${scope.$index}`
      try {
        await auditApply({
          currentStatus: scope.row.status,
          id: scope.row.id
        })
        this.$message.success('已提交')
        this.getTable()
      } catch (error) {
      } finally {
        this.loadingField = ''
      }
    },
    // 重新提交审核
    async auditReApply (scope) {
      this.loadingField = `auditReApply${scope.$index}`
      try {
        await auditReApply({
          currentStatus: scope.row.status,
          id: scope.row.id
        })
        this.$message.success('已提交')
        this.getTable()
      } catch (error) {
      } finally {
        this.loadingField = ''
      }
    },
    // 审核状态查询
    async queryAudit (scope) {
      this.loadingField = `queryAudit${scope.$index}`
      try {
        await queryAudit({
          currentStatus: scope.row.status,
          id: scope.row.id
        })
        this.getTable()
      } catch (error) {
      } finally {
        this.loadingField = ''
      }
    },
    // 上架
    async online (scope) {
      this.loadingField = `online${scope.$index}`
      try {
        await online({
          currentStatus: scope.row.status,
          id: scope.row.id
        })
        this.$message.success('上架成功')
        this.getTable()
      } catch (error) {
      } finally {
        this.loadingField = ''
      }
    },
    // 下架
    async offline (scope) {
      this.loadingField = `offline${scope.$index}`
      try {
        await offline({
          currentStatus: scope.row.status,
          id: scope.row.id
        })
        this.$message.success('下架成功')
        this.getTable()
      } catch (error) {
      } finally {
        this.loadingField = ''
      }
    },
    // 查看小程序
    async qrcodeCreate (scope) {
      this.loadingField = `qrcodeCreate${scope.$index}`
      try {
        const res = await qrcodeCreate({
          currentStatus: scope.row.status,
          id: scope.row.id
        })
        this.qrcodeUrl = res || ''
        this.qrcodeName = scope.row.miniProgramName
        this.xcxDialogVisible = true
      } catch (error) {
      } finally {
        this.loadingField = ''
      }
    },
    // 搜索
    search () {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.getTable()
        }
      })
    },
    // 小程序版本
    async queryAllVersion () {
      const res = await queryAllVersion()
      this.appVersionOption = [
        {
          "id": '',
          "version": "全部",
        },
        ...res
      ]
    },
    // 状态
    initQqueryAllStatus (status) {
      let value = ''
      for (let i = 0; i < this.queryAllStatusOption.length; i++) {
        if (status == this.queryAllStatusOption[i].statusType) {
          value = this.queryAllStatusOption[i].statusTypeDesc
        }
      }
      return value
    },
    // 状态查询
    async queryAllStatus () {
      const res = await queryAllStatus()
      this.queryAllStatusOption = [{
        statusTypeDesc: '全部',
        statusType: ''
      }, ...res]
    },
    // 下载
    async codeImgDown (qrcodeName) {
      codeImgDown(this.$refs.code, qrcodeName)
    },
    // 详情
    marketingDetile (row, operation) {
      this.$router.push({
        name: 'marketingDetile', query: {
          id: row.id || '',
          miniProgramAppid: row.miniProgramAppid,
          operation
        }
      })
    },
    // 重置
    clearFrom () {
      this.$refs.form.clearValidate()
      this.form = {
        shopAdminName: '', // 享钱商户名称
        shopAdminId: '', // 享钱商户ID
        authPid: '', // 支付宝商户PID
        miniProgramName: '', // 小程序名称
        version: '', // 小程序版本
        status: '', // 状态
        miniProgramAppid: '', // 小程序APPID
        name: '' // 联系人
      }
    },
    // 选择点击确定回调
    async sureVal (value) {
      const ref = this.selectPageAttribute.ref
      if (ref === 'shopAdminName') {
        this.form.shopAdminName = value.tableItem.companyName
        this.form.shopAdminId = value.tableItem.id
      }
      if (ref === 'orderApp') {
        const res = await createLinkUrl({
          agentId: value.tableItem.agentId || '',
          shopAdminId: value.tableItem.id,
          createId: JSON.parse(getLocal('userInfo')).id
        })
        this.iframeSrc = res.referralLink
        this.zfbDialogVisible = true
      }
    },
    // 出现选择框
    selectSeach (ref) {
      this.selectPageAttribute.ref = ref
      if (ref === 'shopAdminName') {
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
      try {
        const res = await queryPage(
          {
            page: this.thisPage,
            rows: this.pageSize,
            shopAdminId: this.form.shopAdminId,
            authPid: this.form.authPid,
            miniProgramName: this.form.miniProgramName,
            version: this.form.version,
            status: this.form.status,
            miniProgramAppid: this.form.miniProgramAppid,
            name: this.form.name,
            phone: this.form.phone
          }
        )
        this.tableData = res.results || []
        this.tableTotal = res.totalCount
      } catch (error) {
      } finally {
        this.tableLoading = false
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.p-form-input_width {
  width: 240px;
}
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
