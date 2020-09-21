<template>
  <div class="app-container">
    <div class="action-box">
      <el-form :model="formData" @submit.native.prevent label-width="110px" ref="form" size="small">
        <el-form-item label="交易时间">
          <el-date-picker
            :clearable="false"
            :default-time="['00:00:00', '23:59:59']"
            :picker-options="pickerOptions"
            end-placeholder="结束日期"
            range-separator="至"
            start-placeholder="开始日期"
            type="datetimerange"
            v-model="formData.transactionTime"
            value-format="timestamp"
          ></el-date-picker>
          <el-button :disabled="isSubtract" @click="setSearchTime('subtract')" class="pure-btn_space" size="small" type="default">前一天</el-button>
          <el-button :disabled="isAdd" @click="setSearchTime('add')" size="small" type="default">后一天</el-button>
        </el-form-item>
        <el-row>
          <el-col :span="8">
            <el-form-item label="商户名称" prop="businessName">
              <el-input @clear="chooseMerchantsList={}" @focus="handleChooseDia('商户名称', '商户ID/商户名称', 1)" clearable placeholder="请选择商户" size="small" v-model="formData.businessName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="门店名称" prop="storeName">
              <el-input @clear="chooseStoreList={}" @focus="handleChooseDia('门店名称', '门店ID/门店名称', 2)" clearable placeholder="请选择门店" size="small" v-model="formData.storeName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="交易渠道" prop="tradingChanneCode">
              <el-select v-model="formData.tradingChanneCode">
                <el-option :key="item.code" :label="item.name" :value="item.code" v-for="item in tradingChannelData"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="交易类型" prop="tradingTypeCode">
              <el-select v-model="formData.tradingTypeCode">
                <el-option :key="item.code" :label="item.name" :value="item.code" v-for="item in tradingTypeData"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="支付方式" prop="paymentCode">
              <el-select @change="getPaymentScenario" v-model="formData.paymentCode">
                <el-option :key="item.code" :label="item.name" :value="item.code" v-for="item in paymentData"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="交易场景" prop="paymentScenarioCode">
              <el-select v-model="formData.paymentScenarioCode">
                <el-option :key="item.code" :label="item.name" :value="item.code" v-for="item in paymentScenarioData"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="交易状态" prop="tradingStatusCode">
              <el-select collapse-tags multiple v-model="formData.tradingStatusCode">
                <el-option :key="item.codes" :label="item.name" :value="item.codes" v-for="item in tradingStatusData"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item style="margin-left:-60px">
              <el-button :loading="searchLock" @click="handleSearch" size="small" type="primary">查询</el-button>
              <el-button @click="handleReset" plain size="small" type="primary">重置</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="8" style="text-align:right">
            <el-form-item>
              <el-button @click="handleExport" size="small" v-if="permissonCheckMenus('TRANSACTION_MERCHANT_EXPORT')">导出</el-button>
              <el-button @click="exportRecord" size="small" v-if="permissonCheckMenus('TRANSACTION_MERCHANT_EXPORTRECORD')">导出记录</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <chooseDialog
        :chooseDiaTotal="chooseDiaTotal"
        :columnObj="chooseBaseData.columnObj"
        :isChooseStatus.sync="isChooseStatus"
        :searchPlaceHolder="chooseBaseData.placeHolder"
        :tabData="chooseDiaData"
        :titleName="chooseBaseData.titleName"
        @chooseList="setChooseLise"
        @search="handleChooseSearch"
        ref="choose"
      ></chooseDialog>
    </div>
    <!-- 内容展示区域 -->
    <div class="data-box" v-loading="tabLock">
      <el-table :data="tabData" ref="table">
        <el-table-column label="交易时间" prop="createDate"></el-table-column>
        <el-table-column label="支付订单号" prop="orders"></el-table-column>
        <el-table-column label="商户名称" prop="shopName"></el-table-column>
        <el-table-column label="门店名称" prop="storeName"></el-table-column>
        <el-table-column label="支付通道" prop="aisleName"></el-table-column>
        <el-table-column label="交易渠道" prop="payChannelType"></el-table-column>
        <el-table-column label="支付方式" prop="methodPluginName"></el-table-column>
        <el-table-column label="交易状态" prop="orderStatusName"></el-table-column>
        <el-table-column label="交易金额" prop="amount"></el-table-column>
        <el-table-column label="申请退款金额" prop="refundAmount"></el-table-column>
        <el-table-column label="操作" width="140px">
          <template slot-scope="scope">
            <el-button @click="handleDetails(scope.row)" size="small" type="text" v-if="permissonCheckMenus('TRANSACTION_MERCHANT_DETAIL')">详情</el-button>
            <el-button
              @click="handleDelRow(scope.row)"
              size="small"
              type="text"
              v-if="(scope.row.paymentStatus === 3 || scope.row.paymentStatus === 4) && permissonCheckMenus('TRANSACTION_MERCHANT_REFUNDDETAIL')"
            >退款详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="el-pagination-box">
        <el-pagination
          :current-page="pageNo"
          :page-size="pageSize"
          :page-sizes="[10, 15, 20, 25]"
          :total="pageTotal"
          @current-change="handleTabCurrent"
          @size-change="handleTabSize"
          background
          layout="total, sizes, prev, pager, next, jumper"
        ></el-pagination>
      </div>
    </div>
    <el-dialog :visible.sync="centerDialogVisible" right title="导出记录">
      <el-table :data="exportList" style="width: 100%" v-loading="exportLoading">
        <el-table-column label="文件名称">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column label="导出时间" prop="downloadTime"></el-table-column>
        <el-table-column label="操作人" prop="operator">
          <template slot-scope="scope">
            <div>{{scope.row.operator}}</div>
            <div>{{scope.row.loginName}}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-link :disabled="scope.row.status !== 1" :href="scope.row.url" :underline="false" target="_blank">
              <el-button :disabled="scope.row.status !== 1" size="small" type="text" v-if="permissonCheckMenus('TRANSACTION_MERCHANT_EXPORT_DOWNLOAD')">下载</el-button>
            </el-link>
            <el-button @click="deleteExprot(scope.row)" size="small" style="margin-left:5px;" type="text" v-if="permissonCheckMenus('TRANSACTION_MERCHANT_EXPORT_DEL')">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="page-box">
        <el-pagination
          :current-page="exportPage"
          :page-size="exportPageSize"
          :page-sizes="[10, 15, 20, 25]"
          :total="exportPageTotal"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          background
          layout="total, sizes, prev, pager, next, jumper"
        ></el-pagination>
      </div>
    </el-dialog>
    <order-detail-dialog :dialogTitle="dialogTitle" :form="dialogForm" ref="orderDetailDialog" type="order" />
  </div>
</template>

<script>
import moment from 'moment'

import chooseDialog from './components/chooseDialog'
import orderDetailDialog from './components/orderDetailDialog'
import {
  queryAllCondition,
  queryStorePage,
  queryMerchantAdminPage,
  queryPaySceneByType,
  querySummary,
  queryAllTradeStatus,
  queryMerchantOrderPage,
  downloadExcel,
  queryExportRecord,
  deleteRecord,
  detail
} from '@/api/transtionManagement'
import { downloadBufferFile } from '@/utils/index'

export default {
  name: 'MerchantOrderQuery',
  components: {
    chooseDialog,
    orderDetailDialog
  },
  data () {
    return {
      exportPage: 1,
      exportPageSize: 10,
      exportPageTotal: 0,
      pageNo: 1,
      pageSize: 10,
      pageTotal: 0,
      searchLock: false,
      orderDetailVisible: false,
      centerDialogVisible: false,
      dialogTitle: '订单详情',
      exportLoading: true,
      dialogForm: {},
      tabLock: false,
      exportList: [],
      tabData: [],
      // 类型select
      tradingChannelData: [],
      tradingTypeData: [],
      paymentData: [],
      paymentScenarioData: [],
      tradingStatusData: [],
      formData: {
        transactionTime: [moment().startOf('day').valueOf(), moment().endOf('day').valueOf()],
        businessName: '',
        storeName: '',
        tradingChanneCode: '',
        tradingTypeCode: '',
        paymentCode: '',
        paymentScenarioCode: '',
        tradingStatusCode: []
      },
      // 选择弹窗
      isChooseStatus: false,
      chooseBaseData: {},
      chooseDiaData: [],
      chooseDiaTotal: 0,
      chooseMerchantsList: {},
      chooseStoreList: {},
      chooseType: 1,
      chooseMerchantsObj: [
        { name: 'id', label: '商户ID' },
        { name: 'companyName', label: '商户名称' },
        { name: 'mobile', label: '手机号' }
      ],
      chooseStoreObj: [
        { name: 'id', label: '门店ID' },
        { name: 'name', label: '门店名称' }
      ],
      pickerOptions: {
        disabledDate (time) {
          return (
            time.getTime() > moment().endOf('day').valueOf() ||
            time.getTime() < moment().subtract(6, 'months').valueOf()
          )
        }
      }
    }
  },
  computed: {
    isSubtract () {
      if (
        moment(this.formData.transactionTime[0]).startOf('day').subtract(1, 'days').valueOf() ===
        moment().startOf('day').subtract(6, 'months').valueOf()
      ) {
        return true
      } else {
        return false
      }
    },
    isAdd () {
      if (moment(this.formData.transactionTime[1]).startOf('day').valueOf() === moment().startOf('day').valueOf()) {
        return true
      } else {
        return false
      }
    }
  },
  created () {
    const conditionType = [
      { type: 1, name: 'tradingChannelData' },
      { type: 2, name: 'tradingTypeData' },
      { type: 3, name: 'paymentData' }
    ]
    conditionType.forEach((item) => {
      this.getConditionType(item.type).then((res) => {
        this[item.name] = [{ code: '', name: '全部' }, ...res]
      })
    })
    this.getAllTradeStatus()
    // this.getQueryPage()
  },
  methods: {
    async handleDetails (row) {
      this.dialogForm = {}
      const data = {
        orderId: row.id,
        // 'orderId': '9115882679906900459209030',
        shopId: row.shopId
      }
      try {
        const res = await detail(data)
        if (!res) {
          this.$message('暂无数据')
          return
        }
        this.dialogForm = res
        this.dialogForm.shopName = row.shopName
        this.$refs.orderDetailDialog.orderDetailVisible = true
      } catch {}
    },
    handleDelRow (row) {
      this.$router.push({ path: 'refundOrderQuery', query: { id: row.id } })
    },
    handleCurrentChange (val) {
      this.exportPage = val
      this.exportRecord()
    },
    handleSizeChange (val) {
      this.exportPage = 1
      this.exportPageSize = val
      this.exportRecord()
    },
    async deleteExprot (row) {
      this.$confirm('确定要删除这条导出记录吗？', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let data = {
            id: row.id
          }
          deleteRecord(data).then((res) => {
            this.$message.success('删除成功')
            this.exportRecord()
          })
        })
        .catch(() => {})
    },
    async handleExport () {
      let paymentStatus = []
      if (this.formData.tradingStatusCode.length > 0 && this.formData.tradingStatusCode.includes('')) {
        paymentStatus = JSON.parse(JSON.stringify(this.formData.tradingStatusCode.filter(item => item !== '')))
      } else {
        paymentStatus = JSON.parse(JSON.stringify(this.formData.tradingStatusCode))
      }
      const data = {
        page: this.pageNo,
        rows: this.pageSize,
        startDate: moment(this.formData.transactionTime[0]).format('YYYY-MM-DD HH:mm:ss'),
        endDate: moment(this.formData.transactionTime[1]).format('YYYY-MM-DD HH:mm:ss'),
        payChannelType: this.formData.tradingChanneCode ? this.formData.tradingChanneCode : '', // 交易渠道
        orderTypes: this.formData.tradingTypeCode !== '' ? [this.formData.tradingTypeCode] : [], // 交易类型集合
        paymentMethods: this.formData.paymentCode !== '' ? [this.formData.paymentCode] : [], // 支付方式集合
        paymentPlugins: this.formData.paymentScenarioCode !== '' ? [this.formData.paymentScenarioCode] : [], // 支付场景集合
        paymentStatus: paymentStatus.length > 0 ? paymentStatus.toString().split(',').map(Number) : [], // 交易状态集合
        shopId: this.chooseMerchantsList.id, // 商户ID
        stores: this.chooseStoreList.id ? [this.chooseStoreList.id] : [] // 门店ID集合
      }
      try {
        const res = await downloadExcel(data)
        this.$message.success('正在生成导出文件，请在导出记录中查看。')
      } catch {}
      // downloadBufferFile('/shopOrder/downloadExcel', data, 'POST', 'json', '商户订单列表.xlsx')
    },
    async exportRecord () {
      this.centerDialogVisible = true
      this.exportLoading = true
      const data = {
        page: this.exportPage,
        rows: this.exportPageSize
      }
      try {
        const res = await queryExportRecord(data)
        this.exportPageTotal = res.totalCount
        this.exportList = res.results
        this.exportLoading = false
      } catch {}
    },
    handleTabCurrent (val) {
      this.pageNo = val
      this.getQueryPage()
    },
    handleTabSize (val) {
      this.pageNo = 1
      this.pageSize = val
      this.getQueryPage()
    },
    handleReset () {
      this.chooseMerchantsList = []
      this.chooseStoreList = []
      this.tabData = []
      this.$refs.form.resetFields()
      this.$set(this.formData, 'transactionTime', [moment().startOf('day').valueOf(), moment().endOf('day').valueOf()])
    },
    handleSearch () {
      if (this.chooseMerchantsList.id) {
        this.pageNo = 1
        this.searchLock = true
        this.getQueryPage().catch(() => {}).finally(() => {
          this.searchLock = false
        })
      } else {
        this.$message.error('请先选择商户')
      }
    },
    async getQueryPage () {
      if (this.formData.tradingStatusCode.includes(0)) {
        this.formData.tradingStatusCode.push(5)
      }
      let paymentStatus = []
      if (this.formData.tradingStatusCode.length > 0 && this.formData.tradingStatusCode.includes('')) {
        paymentStatus = JSON.parse(JSON.stringify(this.formData.tradingStatusCode.filter(item => item !== '')))
      } else {
        paymentStatus = JSON.parse(JSON.stringify(this.formData.tradingStatusCode))
      }
      const data = {
        page: this.pageNo,
        rows: this.pageSize,
        startDate: moment(this.formData.transactionTime[0]).format('YYYY-MM-DD HH:mm:ss'),
        endDate: moment(this.formData.transactionTime[1]).format('YYYY-MM-DD HH:mm:ss'),
        payChannelType: this.formData.tradingChanneCode ? this.formData.tradingChanneCode : '', // 交易渠道
        orderTypes: this.formData.tradingTypeCode !== '' ? [this.formData.tradingTypeCode] : [], // 交易类型集合
        paymentMethods: this.formData.paymentCode !== '' ? [this.formData.paymentCode] : [], // 支付方式集合
        paymentPlugins: this.formData.paymentScenarioCode !== '' ? [this.formData.paymentScenarioCode] : [], // 支付场景集合
        paymentStatus: paymentStatus.length > 0 ? paymentStatus.toString().split(',').map(Number) : [], // 交易状态集合
        shopId: this.chooseMerchantsList.id, // 商户ID
        // shopId: 70, // 商户ID
        stores: this.chooseStoreList.id ? [this.chooseStoreList.id] : [] // 门店ID集合
      }
      this.tabLock = true
      try {
        const res = await queryMerchantOrderPage(data)
        this.tabData = res.results
        this.pageNo = res.page
        this.pageTotal = res.totalCount
      } catch (error) {} finally {
        this.tabLock = false
      }
    },

    handleChooseDia (titleName, placeHolder, type) {
      let columnObj = {}
      this.chooseType = type
      this.chooseDiaData = []
      this.chooseDiaTotal = 0
      if (type === 1) {
        columnObj = this.chooseMerchantsObj
        this.getMerchantAdminPage()
      } else {
        columnObj = this.chooseStoreObj
        this.getStorePage()
      }
      this.isChooseStatus = true
      this.chooseBaseData = { titleName, placeHolder, columnObj }
    },
    handleChooseSearch ({ id = '', name = '' } = {}) {
      if (this.chooseType === 1) {
        this.getMerchantAdminPage({ id, name })
      } else {
        this.getStorePage({ id, name })
      }
    },
    async getMerchantAdminPage ({ id = '', name = '' } = {}) {
      const data = {
        page: this.$refs.choose.choosePage,
        rows: this.$refs.choose.chooseRow,
        merchantAdminId: id,
        merchantAdminName: name
      }
      this.$refs.choose.tabLoad = true
      try {
        const res = await queryMerchantAdminPage(data)
        const hasResults = res.results && res.results.length > 0
        this.chooseDiaData = hasResults ? res.results : []
        this.chooseDiaTotal = hasResults ? res.totalCount : 0
      } catch (error) {} finally {
        this.$refs.choose.tabLoad = false
      }
    },
    async getStorePage ({ id = '', name = '' } = {}) {
      const data = {
        page: this.$refs.choose.choosePage,
        rows: this.$refs.choose.chooseRow,
        id: id,
        storeName: name,
        adminId: this.chooseMerchantsList.id || ''
      }
      this.$refs.choose.tabLoad = true
      try {
        const res = await queryStorePage(data)
        const hasResults = res.results && res.results.length > 0
        this.chooseDiaData = hasResults ? res.results : []
        this.chooseDiaTotal = hasResults ? res.totalCount : 0
      } catch (error) {} finally {
        this.$refs.choose.tabLoad = false
      }
    },
    setChooseLise (obj) {
      if (this.chooseType === 1) {
        this.chooseMerchantsList = obj
        this.formData.businessName = obj.companyName
      } else {
        this.chooseStoreList = obj
        this.formData.storeName = obj.name
      }
    },

    async getAllTradeStatus () {
      const res = await queryAllTradeStatus()
      this.tradingStatusData = [{ codes: '', name: '全部' }, ...res]
      this.formData.tradingStatusCode = ['']
    },
    async getPaymentScenario () {
      this.formData.paymentScenarioCode = ''
      this.paymentScenarioData = []
      if (this.formData.paymentCode) {
        const res = await queryPaySceneByType({
          payType: this.formData.paymentCode
        })
        this.paymentScenarioData = [{ code: '', name: '全部' }, ...res]
      }
    },
    getConditionType (type = 1) {
      const res = queryAllCondition({ conditionType: type })
      return res || []
    },

    setSearchTime (status) {
      let varyStartDate = moment(this.formData.transactionTime[0])
      let varyEndDate = moment(this.formData.transactionTime[1])
      if (status === 'add') {
        varyStartDate = varyStartDate.add(1, 'days')
        varyEndDate = varyEndDate.add(1, 'days')
      } else if (status === 'subtract') {
        varyStartDate = varyStartDate.subtract(1, 'days')
        varyEndDate = varyEndDate.subtract(1, 'days')
      }
      this.$set(this.formData, 'transactionTime', [varyStartDate.valueOf(), varyEndDate.valueOf()])
    }
  }
}
</script>

<style lang="scss" scoped>
.action-box {
  /deep/ .el-select {
    width: 100%;
  }
}
.el-pagination-box {
  text-align: right;
  margin-top: 20px;
}
.page-box {
  text-align: right;
  padding: 20px 0;
}
.pure {
  &-btn {
    &_space {
      margin-left: 15px;
    }
  }
  &-dialog {
    &-orderItem {
      display: flex;
      font-size: 15px;
      margin-bottom: 10px;
    }
    &-orderLeft {
      flex: 1;
    }
    &-orderRight {
      flex: 1;
    }
  }
}
</style>
