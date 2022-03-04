<template>
  <div>
    <div class="search-box">
      <el-row>
        <el-col>
          <el-form :inline="true" :model="form" label-width="85px" label-suffix=":">
            <el-form-item label="行业">
              <el-select v-model="form.industry" clearable placeholder="全部" size="small" style="width:100%">
                <el-option v-for="(item, index) in industryList" :label="item.name" :value="item.id" :key="index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="年份">
              <el-select v-model="form.year" filterable clearable placeholder="请选择" size="small" style="width:100%">
                <el-option :key="index" :label="item.name" :value="item.id" v-for="(item, index) in yearList"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="small" @click="handleCurrentChange(1)">查询</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
    <div class="data-box">
      <el-table :data="tableData" v-loading="checkTabLock">
        <el-table-column prop="orderTime" label="行业"></el-table-column>
        <el-table-column prop="month" label="年份" align="right"></el-table-column>
        <el-table-column prop="quarter" label="年度任务" align="right"></el-table-column>
        <el-table-column prop="channelManangerName" label="年度销售"></el-table-column>
        <el-table-column prop="industryName" label="年度完成率"></el-table-column>
        <el-table-column prop="productCode" label="Q1任务"></el-table-column>
        <el-table-column prop="businessTypeName" label="Q1销售"></el-table-column>
        <el-table-column prop="num" label="Q1完成率" align="right"></el-table-column>
        <el-table-column prop="unitPrice" label="Q2任务" align="right"></el-table-column>
        <el-table-column prop="orderAmount" label="Q2销售" align="right"></el-table-column>
        <el-table-column prop="performanceAmount" label="Q2完成率" align="right"></el-table-column>
        <el-table-column prop="originAmount" label="Q3任务" width="140" align="right"></el-table-column>
        <el-table-column prop="bonusAmount" label="Q3销售" width="140" align="right"></el-table-column>
        <el-table-column prop="useRebate" label="Q3完成率" width="100"></el-table-column>
        <el-table-column prop="depositAmount" label="Q4任务" width="140" align="right"></el-table-column>
        <el-table-column prop="depositName" label="Q4销售" width="120"></el-table-column>
        <el-table-column prop="couponName" label="Q4完成率"></el-table-column>
      </el-table>
      <km-pagination :request="getQueryPage" :current-page.sync="currentPage" :page-size.sync="pageSize" :total="totalPage" />
    </div>
  </div>
</template>
<script>
import dayjs from 'dayjs'
import { formatAmountDivide } from '@/filters'

import { productQueryByPage, productQueryTypeList } from '@/api/product'
import { detailPage, detailCount } from '@/api/accountManagement/resultsQuery'

export default {
  name: 'resultsQueryDealer',
  data() {
    return {
      industryList: [
        { id: 1, name: '零售' },
        { id: 2, name: '餐饮' },
        { id: 3, name: '专卖' },
        { id: 3, name: '有数' }
      ],
      checkTabLock: false,
      tableData: [], // 表格数据
      form: { industry: [], year: new Date().getFullYear() },
      yearList: []
    }
  },
  created() {
    const thisYear = new Date().getFullYear()
    for (let i = thisYear; i >= 2021; i--) {
      this.yearList.push({ id: i, name: i })
    }
    this.handleCurrentChange(1)
  },
  methods: {
    industryChange() {
      this.form.productCode = []
      this.$refs.productCodes.selectVal = []
      this.licensedProductData = []
      this.isLicensedProductMaxPage = false
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
        const res = await detailPage({
          ...subData,
          page: this.thisPage,
          rows: this.pageSize
        })
        this.tableList = res.results || []
        this.tableTotal = res.totalCount
      } finally {
        this.tableLoading = false
      }
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
