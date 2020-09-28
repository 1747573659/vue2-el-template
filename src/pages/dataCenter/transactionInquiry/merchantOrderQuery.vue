<template>
  <div class="app-container">
    <div class="search-box">
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
            <el-form-item label="商户名称" prop="shopId">
               <select-page
                :request="queryMerchantAdminPage"
                :bvalue.sync="formData.shopId"
                :name="'companyName'"
                searchName="id"
                id="id"
                :placeholder="'商户名称'"
              >
              </select-page>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item v-show="formData.shopId" label="门店名称" prop="storeName">
                <select-page
                  :request="getStorePage"
                  :bvalue.sync="formData.stores"
                  :name="'name'"
                  :isMultiple="true"
                  searchName="storeName"
                  :parame="{adminId:formData.shopId || ''}"
                  id="id"
                  :placeholder="'门店名称'"
                >
                </select-page>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item v-show="formData.stores[0]" label="收银员" prop="cashier">
              <select-page
                  :request="queryClerkPageByStore"
                  :bvalue.sync="formData.clerkInfos"
                  :name="'name'"
                  searchName="name"
                  :isMultiple="true"
                  :parame="{storeId:formData.stores[0] || ''}"
                  id="id"
                  :placeholder="'收银员'"
                >
                </select-page>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
         
          <el-col :span="8">
            <el-form-item label="支付方式" prop="paymentCode">
              <el-select @change="getPaymentScenario" filterable v-model="formData.paymentCode">
                <el-option :key="item.code" :label="item.name" :value="item.code" v-for="item in paymentData"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="支付场景" prop="paymentScenarioCode">
              <el-select v-model="formData.paymentScenarioCode" filterable>
                <el-option :key="item.code" :label="item.name" :value="item.code" v-for="item in paymentScenarioData"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
           <el-col :span="8">
            <el-form-item label="交易金额" prop="paymentScenarioCode">
              <el-input style="width:120px"  size="small" v-model="formData.startAmount" placeholder="请输入内容"></el-input>-
              <el-input style="width:120px" size="small" v-model="formData.endAmount" placeholder="请输入内容"></el-input>
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
          <!-- <el-col :span="8" style="text-align:right">
            <el-form-item>
              <el-button @click="handleExport" size="small" v-if="permissonCheckMenus('TRANSACTION_MERCHANT_EXPORT')">导出</el-button>
              <el-button @click="exportRecord" size="small" v-if="permissonCheckMenus('TRANSACTION_MERCHANT_EXPORTRECORD')">导出记录</el-button>
            </el-form-item>
          </el-col> -->
        </el-row>
      </el-form>
  
    </div>
    <!-- 内容展示区域 -->
    <div class="data-box" v-loading="tabLock">

      <el-table :max-height="750" :data="tabData" ref="table">
        
        <el-table-column label="商户名称" prop="shopName"></el-table-column>
        <el-table-column label="门店名称" prop="storeName"></el-table-column>
        <el-table-column label="交易时间" prop="createDate"></el-table-column>
        <el-table-column label="支付订单号" prop="orders"></el-table-column>
        <el-table-column label="确认码" prop="confirmCode"></el-table-column>
        <el-table-column label="收银员" prop="workerName"></el-table-column>
        <!-- <el-table-column label="支付通道" prop="aisleName"></el-table-column>
        <el-table-column label="交易渠道" prop="payChannelType"></el-table-column> -->
        <el-table-column label="支付方式" prop="methodPluginName"></el-table-column>
        <el-table-column label="交易状态" prop="orderStatusName"></el-table-column>
        <el-table-column label="交易金额" prop="amount"></el-table-column>
        <el-table-column label="申请退款金额" prop="refundAmount"></el-table-column>
        <el-table-column label="操作" width="140px">
          <template slot-scope="scope">
            <el-button @click="handleDetails(scope.row)" size="small" type="text" >详情</el-button>
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
          v-if="pageTotal"
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
    <order-detail-dialog :dialogTitle="dialogTitle" :form="dialogForm2" ref="orderDetailDialog2" type="refund" />
  </div>
</template>

<script>
import moment from 'moment'
import selectPage from '@/components/selectPage2'
import orderDetailDialog from './components/orderDetailDialog'
import {
  queryAllCondition,
  queryStorePage,
  queryMerchantAdminPage,
  queryClerkPageByStore,
  queryPaySceneByType,
  querySummary,
  queryAllTradeStatus,
  queryMerchantOrderPage,
  downloadExcel,
  queryExportRecord,
  deleteRecord,
  detail,
  refundOrderdetail
} from '@/api/transtionManagement'
import { downloadBufferFile } from '@/utils/index'

export default {
  name: 'MerchantOrderQuery',
  components: {
    orderDetailDialog,
    selectPage
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
      orderDetailVisible2: false,
      centerDialogVisible: false,
      dialogTitle: '订单详情',
      exportLoading: true,
      dialogForm: {},
      dialogForm2: {},
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
        shopId: '',
        stores: [],
        tradingChanneCode: '',
        tradingTypeCode: '',
        paymentCode: '',
        paymentScenarioCode: '',
        tradingStatusCode: [],
        clerkInfos:[],
        startAmount:0,
        endAmount:0
      },
      // 选择弹窗
   


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
  },
  methods: {
    remoteMethod(value) {
      // 当没有输入任何值或者输入新的值的时候，就把相关数据进行情况
      if (!value || (this.searchString !== '' && value !== this.searchString)) {
        this.selectPageNo = 1
        this.searchString = ''
        this.isMaxPage = false
        this.shopList = []
      }
      // 只有value有值的时候才去请求接口
      if (value) {
        let data = {
          'name': value,
          "page": this.selectPageNo,
          "rows": 10
        }
        import('@/api/setting/account').then(async module => {
          const res = await module.queryPage(data)
          // 如果分页返回有数据，就将数据加入list，如果接口返回数据长度不为10，则说明为最后一页
          if (res.results && res.results.length !== 0) {
            this.shopList = this.shopList.concat(res.results)
            this.searchString = value
            if (res.results?.length !== 10) {
              this.isMaxPage = true
            }
          }
        })
      }
    },
    loadMore() {
      // 如果不是最后一页就加载下一页
      if (!this.isMaxPage) {
        this.selectPageNo++
        this.remoteMethod(this.searchString)
      }
    },
     // 如果点击了清除按钮则将相关数据清空
    shopClear() {
      this.isMaxPage = false
      this.shopList = []
      this.searchString = ''
      this.selectPageNo = 1
    },
    // 每次focus都将相关数据清空
    shopFocus() {
      this.isMaxPage = false
      this.shopList = []
      this.searchString = ''
      this.selectPageNo = 1
    },
    shopChange(value) {
    },
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
    async handleDelRow (row) {
      this.dialogForm = {}
      const data = {
        dataSource: 1,
        paySn: row.id,
        // 'orderId': '9115882679906900459209030',
        shopId: row.shopId
      }
      try {
        const res = await refundOrderdetail(data)
        if (!res) {
          this.$message('暂无数据')
          return
        }
        res.shopName=row.shopName
        this.dialogForm2 = res
        this.dialogForm2.shopName = row.shopName
        this.$refs.orderDetailDialog2.orderDetailVisible = true
      } catch {}
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
      this.formData.stores=[]
      this.formData.clerkInfos=[]
      this.formData.shopId='shopId'
      this.tabData = []
      this.$refs.form.resetFields()
      this.$set(this.formData, 'transactionTime', [moment().startOf('day').valueOf(), moment().endOf('day').valueOf()])
    },
    handleSearch () {
      if (this.formData.shopId) {
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
        shopId: this.formData.shopId, // 商户ID
        // shopId: 70, // 商户ID
        stores: this.formData.stores, // 门店ID集合
        clerkInfos: this.formData.clerkInfos, // 门店ID集合
        startAmount: this.formData.startAmount, // 门店ID集合
        endAmount: this.formData.endAmount, // 门店ID集合
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

    queryMerchantAdminPage (e) {
      return queryMerchantAdminPage(e)
    },
    getStorePage (e) {
      return queryStorePage(e)
    },
     queryClerkPageByStore (e) {
      return queryClerkPageByStore(e)
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
  background: #fff;
  padding-bottom: 20px;
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
