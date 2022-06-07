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
          <el-input v-model.trim="form.thirdBillNo" clearable :maxlength="14"></el-input>
        </el-form-item>
        <el-form-item label="行业">
          <el-select v-model="form.industry" placeholder="全部" clearable>
            <el-option :key="item.contractIndustry" :label="item.contractIndustryName" :value="item.contractIndustry" v-for="item in industryLists"></el-option>
          </el-select>
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
            range-separator="至"
            start-placeholder="开始月份"
            end-placeholder="结束月份"
            :clearable="false"></el-date-picker>
        </el-form-item>
        <el-button type="primary" size="small" @click="handleSearch" style="margin-left: 80px">查询</el-button>
      </el-form>
    </div>
    <div class="data-box" v-loading="checkTabLock">
      <el-table :data="tableData">
        <el-table-column label="订单日期" prop="orderTime" width="110"></el-table-column>
        <el-table-column label="订单编号" prop="thirdBillNo"></el-table-column>
        <el-table-column label="经销商" min-width="110">
          <template slot-scope="scope">{{ `${scope.row.agentId ? '[' + scope.row.agentId + ']' : ''}${scope.row.agentName || ''}` }}</template>
        </el-table-column>
        <el-table-column label="一级经销商" min-width="110">
          <template slot-scope="scope">{{ `${scope.row.firstAgentId ? '[' + scope.row.firstAgentId + ']' : ''}${scope.row.firstAgentName || ''}` }}</template>
        </el-table-column>
        <el-table-column label="结算状态" width="110">
          <template slot-scope="scope">
            <template v-if="scope.row.benefitStatus === 25"><span>待商户确认</span><span style="color: #ff0000">（被退回）</span></template>
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
        <el-table-column label="分润月份" prop="benefitTime" width="110"></el-table-column>
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
import { queryBenefitPage, queryBenefitAccount, getBenefitStatusMap } from '@/api/accountManagement/shareProfit/profitDetail'

export default {
  data() {
    return {
      licensedProductData: [],
      isLicensedProductMaxPage: false,
      industryLists: [],
      benefitStatusData: [],
      form: { createTime: [], thirdBillNo: '', industry: '', productCodes: [], benefitStatusList: [], billingMonth: [] },
      checkTabLock: false,
      tableData: [],
      currentPage: 1,
      totalPage: 0,
      pageSize: 10,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > dayjs().endOf('day').valueOf()
        }
      }
    }
  },
  filters: {
    formatAmount(val) {
      return val ? NP.round(NP.divide(val, 100), 2) : 0
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (vm.$route.query.billingMonth) {
        // vm.getAgentPage({ query: vm.$route.query.agentId })
        const billingMonth = vm.$route.query.billingMonth
        vm.form.billingMonth = [dayjs(billingMonth).startOf('month').format('YYYY-MM-DD 00:00:00'), dayjs(billingMonth).endOf('month').format('YYYY-MM-DD 00:00:00')]
        // vm.form.agentId = vm.$route.query.agentId
        // setTimeout(() => {
        // vm.$refs.agentVO.selectVal = vm.$route.query.agentName
        // }, 800)
      } else {
        vm.form.billingMonth = []
      }
      vm.$nextTick(() => vm.getQueryPage())
    })
  },
  created() {
    this.getProductByPage()
    this.getBenefitStatusMap()
    this.getBenefitAccount()
    const StartTime = dayjs().subtract(30, 'days')
    this.form.createTime = [StartTime.format('YYYY-MM-DD 00:00:00'), dayjs().format('YYYY-MM-DD 23:59:59')]
  },
  methods: {
    handleQueryParams() {
      let { createTime, billingMonth, benefitStatusList, ...params } = this.form
      let benefitCountOrder = ''
      if (this.$route.query.billingMonth) benefitCountOrder = this.$route.query.benefitCountOrder
      return Object.assign(
        params,
        { benefitCountOrder, page: this.currentPage, rows: this.pageSize },
        { benefitStatusList: benefitStatusList || [], minDate: createTime[0] || '', maxDate: createTime[1] || '' },
        {
          overMinDate: billingMonth[0] ? dayjs(billingMonth[0]).startOf('month').format('YYYY-MM-DD 00:00:00') : '',
          overMaxDate: billingMonth[1] ? dayjs(billingMonth[1]).startOf('month').format('YYYY-MM-DD 00:00:00') : ''
        }
      )
    },
    handleSearch() {
      this.currentPage = 1
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
    async getBenefitAccount() {
      const res = await queryBenefitAccount({}).catch()
      this.industryLists = res.filter(item => item.contractIndustry === 5)
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
