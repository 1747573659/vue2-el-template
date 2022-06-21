<template>
  <section>
    <div class="search-box">
      <el-form size="small" :model="form" :inline="true" label-suffix=":" label-width="80px" @submit.native.prevent>
        <el-form-item label="订单日期">
          <el-date-picker
            v-model="form.createTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd HH:mm:ss"
            :default-time="['00:00:00', '23:59:59']"
            :clearable="false"></el-date-picker>
        </el-form-item>
        <el-form-item label="订单编码">
          <el-input v-model.trim="form.thirdBillNo" clearable :maxlength="32"></el-input>
        </el-form-item>
        <el-form-item label="产品">
          <km-select-page
            multiple
            collapse-tags
            v-model="form.productCodes"
            option-label="name"
            option-value="code"
            placeholder="全部"
            :data.sync="licensedProductData"
            :request="getProductByPage"
            :is-max-page.sync="isLicensedProductMaxPage" />
        </el-form-item>
        <el-form-item label="分润状态">
          <el-select v-model="form.benefitStatusList" placeholder="全部" clearable>
            <el-option v-for="(item, index) in benefitStatusData" :key="index" :label="item.value" :value="item.key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="结算月份">
          <el-date-picker
            v-model="form.billingMonth"
            type="monthrange"
            :picker-options="pickerMonthOptions"
            range-separator="至"
            start-placeholder="开始月份"
            end-placeholder="结束月份"
            clearable></el-date-picker>
        </el-form-item>
        <el-button type="primary" size="small" @click="handleSearch" style="margin-left: 80px">查询</el-button>
      </el-form>
    </div>
    <div class="data-box" v-loading="checkTabLock">
      <el-table :data="tableData">
        <el-table-column label="订单日期" prop="orderTime" width="110"></el-table-column>
        <el-table-column label="订单编号" prop="thirdBillNo" width="160"></el-table-column>
        <el-table-column label="经销商" min-width="110">
          <template slot-scope="scope">{{ `${scope.row.agentId ? '[' + scope.row.agentId + ']' : ''}${scope.row.agentName || ''}` }}</template>
        </el-table-column>
        <el-table-column label="一级经销商" min-width="110">
          <template slot-scope="scope">{{ `${scope.row.firstAgentId ? '[' + scope.row.firstAgentId + ']' : ''}${scope.row.firstAgentName || ''}` }}</template>
        </el-table-column>
        <el-table-column label="结算状态" width="110">
          <template slot-scope="scope">
            <template v-if="scope.row.benefitStatus === 25"><span>待商务确认</span><span style="color: #ff0000">（被退回）</span></template>
            <span v-else>{{ scope.row.benefitStatusName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="行业" prop="industryName"></el-table-column>
        <el-table-column label="产品" prop="productName" width="150"></el-table-column>
        <el-table-column label="订单金额" align="right">
          <template slot-scope="scope">{{ scope.row.orderAmount | formatAmount }}</template>
        </el-table-column>
        <el-table-column label="分润比例" align="center">
          <template slot-scope="scope">{{ `${scope.row.benefitRatio}%` || '' }}</template>
        </el-table-column>
        <el-table-column label="分润金额" align="right">
          <template slot-scope="scope">{{ scope.row.benefitAmount | formatAmount }}</template>
        </el-table-column>
        <el-table-column label="结算月份" width="110">
          <template slot-scope="scope">{{ scope.row.benefitTime | formatBenefitTime(scope.row.benefitStatus) }}</template>
        </el-table-column>
        <el-table-column label="合同状态">
          <template slot-scope="scope">{{ scope.row.thirdContractStatus === 0 ? '已签约' : '未签约' }}</template>
        </el-table-column>
        <el-table-column label="填写发票">
          <template slot-scope="scope">{{ scope.row.thirdInvoiceStatus === 0 ? '已填写发票' : '未填写发票' }}</template>
        </el-table-column>
        <el-table-column label="受理人" prop="handlerUserName"></el-table-column>
      </el-table>
      <km-pagination :request="getQueryPage" :current-page.sync="currentPage" :page-size.sync="pageSize" :total="totalPage" />
    </div>
  </section>
</template>

<script>
import dayjs from 'dayjs'
import NP from 'number-precision'

import { productQueryByPage } from '@/api/product'
import { queryBenefitPage, getBenefitStatusMap } from '@/api/accountManagement/shareProfit/profitDetail'

export default {
  data() {
    return {
      licensedProductData: [],
      isLicensedProductMaxPage: false,
      benefitStatusData: [],
      form: { createTime: [], thirdBillNo: '', industry: '', productCodes: [], benefitStatusList: [], billingMonth: [], benefitCountOrder: '' },
      checkTabLock: false,
      tableData: [],
      currentPage: 1,
      totalPage: 0,
      pageSize: 10,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > dayjs().endOf('day').valueOf()
        }
      },
      pickerMonthOptions: {
        disabledDate(time) {
          return time.getTime() > dayjs().endOf('month').valueOf() || time.getTime() < dayjs().endOf('month').subtract(6, 'month').endOf('month').valueOf()
        }
      }
    }
  },
  filters: {
    formatAmount(val) {
      return val ? NP.round(NP.divide(val, 100), 2) : 0
    },
    formatBenefitTime(val, status) {
      return status ? dayjs(val).format('YYYY-MM') : ''
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (vm.$route.query.billingMonth) {
        const billingMonth = vm.$route.query.billingMonth
        vm.form.billingMonth = [dayjs(billingMonth).startOf('month').format('YYYY-MM-DD HH:mm:ss'), dayjs(billingMonth).endOf('month').format('YYYY-MM-DD HH:mm:ss')]
        vm.form.benefitCountOrder = vm.$route.query.benefitCountOrder
        vm.form.createTime = []
      } else {
        vm.form.billingMonth = []
      }
      vm.$nextTick(() => vm.getQueryPage())
    })
  },
  created() {
    this.getProductByPage()
    this.getBenefitStatusMap()
    const StartTime = dayjs().subtract(30, 'days')
    this.form.createTime = [StartTime.format('YYYY-MM-DD 00:00:00'), dayjs().endOf('day').format('YYYY-MM-DD HH:mm:ss')]
  },
  methods: {
    handleQueryParams() {
      let { createTime, billingMonth, benefitStatusList, ...params } = this.form
      return Object.assign(
        params,
        { page: this.currentPage, rows: this.pageSize },
        { benefitStatusList: benefitStatusList || [], minDate: createTime[0] || '', maxDate: createTime[1] || '' },
        {
          overMinDate: billingMonth && billingMonth[0] ? dayjs(billingMonth[0]).startOf('month').format('YYYY-MM-DD HH:mm:ss') : '',
          overMaxDate: billingMonth && billingMonth[1] ? dayjs(billingMonth[1]).endOf('month').format('YYYY-MM-DD HH:mm:ss') : ''
        }
      )
    },
    handleSearch() {
      this.currentPage = 1
      this.form.benefitCountOrder = ''
      this.getQueryPage()
    },
    async getQueryPage() {
      try {
        this.checkTabLock = true
        const res = await queryBenefitPage(this.handleQueryParams())
        this.tableData = res.results || []
        this.totalPage = res.totalCount || 0
      } catch (error) {
      } finally {
        this.checkTabLock = false
      }
    },
    async getProductByPage({ query = '', page = 1, row = 10 } = {}) {
      const res = await productQueryByPage({ info: query, page, row, notProductTypeList: [99] }).catch()
      this.licensedProductData = this.licensedProductData.concat(res.results || [])
      this.isLicensedProductMaxPage = !res.results || (res.results && res.results.length < 10)
    },
    async getBenefitStatusMap() {
      const res = await getBenefitStatusMap().catch()
      if (res.length > 0) this.benefitStatusData = res
    }
  }
}
</script>
