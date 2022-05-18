<template>
  <div>
    <div class="search-box">
      <el-row>
        <el-form :model="form" :inline="true" size="small" label-width="100px" label-suffix=":">
          <el-form-item label="订单日期">
            <el-date-picker
              v-model="form.orderTime"
              :picker-options="pickerOptions"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              value-format="yyyy-MM-dd HH:mm:ss"
              :default-time="['00:00:00', '23:59:59']"
              end-placeholder="结束日期"></el-date-picker>
          </el-form-item>
          <el-form-item label="行业">
            <el-select multiple clearable placeholder="全部" @change="industryChange" size="small" style="width: 100%" v-model="form.industry">
              <el-option :key="index" :label="item.industryByOne" :value="item.industry" v-for="(item, index) in industryList"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="产品类型">
            <el-select @change="productTypeChange" clearable placeholder="全部" size="small" style="width: 100%" v-model="form.productType">
              <el-option :key="item.id" :label="item.name" :value="item.id" v-for="item in productTypeList"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="产品">
            <km-select-page
              ref="productCodes"
              multiple
              collapse-tags
              v-model="form.productCode"
              option-label="name"
              option-value="code"
              placeholder="全部"
              :data.sync="licensedProductData"
              :request="getProductByPage"
              :is-max-page.sync="isLicensedProductMaxPage" />
          </el-form-item>
          <el-form-item label="业务类型">
            <el-select clearable filterable placeholder="全部" size="small" style="width: 100%" v-model="form.businessType">
              <el-option :key="item.id" :label="item.name" :value="item.id" v-for="item in businessTypeList"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="使用返利">
            <el-select clearable placeholder="全部" size="small" style="width: 100%" v-model="form.useRebate">
              <el-option label="是" :value="1"></el-option>
              <el-option label="否" :value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="订单编码">
            <el-input v-model.trim="form.billNo" maxlength="16" size="small" placeholder="请输入订单编码" clearable></el-input>
          </el-form-item>
          <el-form-item style="margin-left: 100px">
            <el-button type="primary" @click="handleCurrentChange(1)">查询</el-button>
          </el-form-item>
        </el-form>
      </el-row>
    </div>
    <div class="data-box" v-loading="tableLoading">
      <tableSummary :value.sync="tableSummaryObj"></tableSummary>
      <el-table :data="tableList" :max-height="tabMaxHeight - 56">
        <el-table-column prop="orderTime" width="110" label="订单日期" fixed></el-table-column>
        <el-table-column prop="month" label="月份" width="80" align="right" fixed></el-table-column>
        <el-table-column prop="quarter" label="季度" width="80" align="right" fixed></el-table-column>
        <el-table-column prop="channelManangerName" label="渠道经理" width="100" fixed></el-table-column>
        <el-table-column prop="industryName" label="行业" width="100"></el-table-column>
        <el-table-column width="200" label="产品">
          <template slot-scope="scope">{{ `${scope.row.productCode ? '[' + scope.row.productCode + ']' : ''}${scope.row.productName || ''}` }}</template>
        </el-table-column>
        <el-table-column prop="businessTypeName" label="业务类型" width="120"></el-table-column>
        <el-table-column label="数量" width="140" align="right">
          <template slot-scope="scope">
            <div v-if="scope.row.num">{{ scope.row.num | formatNumberFilter }}</div>
          </template>
        </el-table-column>
        <el-table-column label="单价" width="140" align="right">
          <template slot-scope="scope">
            <div v-if="scope.row.unitPrice">{{ scope.row.unitPrice | toFixedFilter }}</div>
          </template>
        </el-table-column>
        <el-table-column label="订单金额" width="140" align="right">
          <template slot-scope="scope">{{ scope.row.orderAmount | toFixedFilter }}</template>
        </el-table-column>
        <el-table-column label="签约完成" width="140" align="right">
          <template slot-scope="scope">
            <div v-if="scope.row.industry !== 5">{{ scope.row.performanceAmount | toFixedFilter }}</div>
          </template>
        </el-table-column>
        <el-table-column label="扣减本金" width="140" align="right">
          <template slot-scope="scope">
            <div v-if="scope.row.industry !== 5">{{ scope.row.originAmount | toFixedFilter }}</div>
          </template>
        </el-table-column>
        <el-table-column label="扣减赠金" width="140" align="right">
          <template slot-scope="scope">
            <div v-if="scope.row.industry !== 5">{{ scope.row.bonusAmount | toFixedFilter }}</div>
          </template>
        </el-table-column>
        <el-table-column label="使用返利" width="100">
          <template slot-scope="scope">
            <div v-if="scope.row.industry !== 5">{{ scope.row.useRebate === 1 ? '是' : '否' }}</div>
          </template>
        </el-table-column>
        <el-table-column label="担保金额" width="140" align="right">
          <template slot-scope="scope">
            <div v-if="scope.row.industry !== 5">{{ scope.row.depositAmount | toFixedFilter }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="depositName" label="担保人" width="120"></el-table-column>
        <el-table-column prop="couponName" label="优惠活动" width="120"></el-table-column>
        <el-table-column prop="billNo" label="订单编码" width="160"></el-table-column>
        <el-table-column label="本金余额" width="140" align="right">
          <template slot-scope="scope">
            <div v-if="scope.row.industry !== 5">{{ scope.row.deductionOriginAmount | toFixedFilter }}</div>
          </template>
        </el-table-column>
        <el-table-column label="扣款后赠金" width="140" align="right">
          <template slot-scope="scope">
            <div v-if="scope.row.industry !== 5">{{ scope.row.deductionBonusAmount | toFixedFilter }}</div>
          </template>
        </el-table-column>
        <el-table-column label="未核销金额" width="140" align="right">
          <template slot-scope="scope">
            <div v-if="scope.row.industry !== 5">{{ scope.row.noWriteAmount | toFixedFilter }}</div>
          </template>
        </el-table-column>
      </el-table>
      <div class="km-page-block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="thisPage"
          :page-sizes="[10, 30, 50]"
          :page-size.sync="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tableTotal"></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { formatAmountDivide } from '@/filters'
import tableSummary from '@/components/table/tableSummary' // 表格上的汇总
import { tableMaxHeight } from '@/mixins/tableMaxHeight'

import { detailPage, detailCount, querySubIndustry } from '@/api/accountManagement/resultsQuery'
import { productQueryByPage, productQueryTypeList } from '@/api/product'

export default {
  name: 'resultsQueryDealer',
  mixins: [tableMaxHeight],
  components: { tableSummary },
  data() {
    return {
      licensedProductData: [],
      isLicensedProductMaxPage: false,
      industryList: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > dayjs().endOf('day')
        }
      },
      tableLoading: false,
      tableList: [], // 表格数据
      tableTotal: 0, // 表格总页数
      thisPage: 1, // 当前页
      pageSize: 10, // 每页多少条
      businessTypeList: [
        { id: 1, name: '软件采购' },
        { id: 2, name: '软件升级' },
        { id: 3, name: '需求开发' },
        { id: 4, name: '业绩调整' },
        { id: 5, name: '软件销售' }
      ],
      tableSummaryObj: {
        originAmount: { label: '本金', value: '', formatNumber: true, toFixed: 2 },
        depositAmount: { label: '使用担保金', value: '', formatNumber: true, toFixed: 2 },
        performanceAdjustmentAmount: { label: '业绩调整', value: '', formatNumber: true, toFixed: 2 },
        num: { label: '数量', value: '', formatNumber: true }
      },
      productTypeList: [],
      form: {
        orderTime: [dayjs().subtract(60, 'days').format('YYYY-MM-DD 00:00:00'), dayjs().format('YYYY-MM-DD 23:59:59')],
        industry: [],
        productType: '',
        productCode: [],
        businessType: '',
        useRebate: '',
        billNo: ''
      }
    }
  },
  created() {
    this.handleCurrentChange(1)
    this.queryTypeList()
    this.getSubIndustry()
  },
  methods: {
    productTypeChange() {
      this.form.productCode = []
      this.$refs.productCodes.selectVal = []
      this.licensedProductData = []
      this.isLicensedProductMaxPage = false
    },
    industryChange() {
      this.form.productCode = []
      this.$refs.productCodes.selectVal = []
      this.licensedProductData = []
      this.isLicensedProductMaxPage = false
    },
    handleSizeChange(val) {
      this.thisPage = 1
      this.pageSize = val
      this.getPageList()
    },
    handleCurrentChange(val) {
      this.thisPage = val
      this.getPageList()
    },
    async getPageList() {
      try {
        this.tableLoading = true
        let subData = {
          industrys: this.form.industry,
          productType: this.form.productType,
          productCodes: this.form.productCode,
          businessType: this.form.businessType,
          useRebate: this.form.useRebate,
          billNo: this.form.billNo
        }
        if (this.form.orderTime && this.form.orderTime.length) {
          subData.startOrderTime = this.form.orderTime[0]
          subData.endOrderTime = this.form.orderTime[1]
        }
        this.detailCount(subData)
        const res = await detailPage({ ...subData, page: this.thisPage, rows: this.pageSize })
        this.tableList = res.results || []
        this.tableTotal = res.totalCount
      } catch (err) {
      } finally {
        this.tableLoading = false
      }
    },
    async queryTypeList() {
      try {
        let res = await productQueryTypeList()
        this.productTypeList = []
        res.map(item => {
          if (![6, 7].includes(item.id)) {
            this.productTypeList.push(item)
          }
        })
      } catch (error) {}
    },
    async getProductByPage({ query = '', page = 1, row = 10 } = {}) {
      try {
        const res = await productQueryByPage({
          info: query,
          page,
          row,
          productIndustryList: this.form.industry,
          productTypeList: this.form.productType === '' ? [] : [this.form.productType]
        })
        this.licensedProductData = this.licensedProductData.concat(res.results || [])
        this.isLicensedProductMaxPage = !res.results || (res.results && res.results.length < 10)
      } catch (error) {}
    },
    async detailCount(subData) {
      const res = (await detailCount(subData)) || {}
      const keys = Object.keys(this.tableSummaryObj)
      keys.map(item => {
        if (item === 'num') this.tableSummaryObj[item].value = res[item] || 0
        else this.tableSummaryObj[item].value = formatAmountDivide(res[item]) || 0
      })
    },
    async getSubIndustry() {
      try {
        const res = await querySubIndustry({ enableContract: 0 })
        if (res.length > 0) {
          this.industryList = res.map(item => {
            return { industry: parseFloat(item.industry), industryByOne: item.industryByOne }
          })
        }
      } catch (error) {}
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
</style>
