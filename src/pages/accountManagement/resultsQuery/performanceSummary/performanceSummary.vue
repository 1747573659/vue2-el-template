<template>
  <div>
    <div class="search-box">
      <el-row>
        <el-col>
          <el-form :inline="true" :model="form" label-width="85px" label-suffix=":">
            <el-form-item label="行业">
              <el-select v-model="form.industry" placeholder="全部" size="small" style="width: 100%">
                <el-option :key="index" :label="item.contractIndustryName" :value="item.contractIndustry" v-for="(item, index) in industryList"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="年份">
              <el-select v-model="form.year" filterable placeholder="请选择" size="small" style="width: 100%">
                <el-option :key="index" :label="item.name" :value="item.id" v-for="(item, index) in yearList"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="small" @click="handleSearch">查询</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
    <div class="data-box">
      <el-table :data="tableData" :max-height="tabMaxHeight" :show-summary="performanceCountVO !== ''" :summary-method="getStoreSummaries" v-loading="checkTabLock">
        <el-table-column prop="industryName" label="行业" width="110"></el-table-column>
        <el-table-column prop="year" label="年份"></el-table-column>
        <el-table-column prop="yearAmount" label="年度任务" width="120" align="right"></el-table-column>
        <el-table-column prop="yearCompletedAmount" label="年度销售" min-width="110" align="right"></el-table-column>
        <el-table-column prop="yearCompletedRate" label="年度完成率" align="right" width="110">
          <template slot-scope="scope">{{ scope.row.yearCompletedRate }}%</template>
        </el-table-column>
        <template v-for="(item, index) in quartersVO">
          <el-table-column :prop="`${item}QuarterAmount`" :label="`Q${index + 1}任务`" :key="`${item}QuarterAmount`" min-width="110" align="right"></el-table-column>
          <el-table-column :prop="`${item}CompletedAmount`" :label="`Q${index + 1}销售`" :key="`${item}CompletedAmount`" min-width="110" align="right"></el-table-column>
          <el-table-column :prop="`${item}CompletedRate`" :label="`Q${index + 1}完成率`" :key="`${item}CompletedRate`" width="110" align="right">
            <template slot-scope="scope">{{ scope.row[`${item}CompletedRate`] }}%</template>
          </el-table-column>
        </template>
      </el-table>
      <km-pagination :request="getQueryPage" :current-page.sync="currentPage" :page-size.sync="pageSize" :total="totalPage" />
    </div>
  </div>
</template>

<script>
import { toFixedFilter } from '@/filters'
import { tableMaxHeight } from '@/mixins/tableMaxHeight'

import { queryByPage, summaryCount, querySubIndustry } from '@/api/accountManagement/accountQuery/performanceSummary'

export default {
  name: 'performanceSummary',
  mixins: [tableMaxHeight],
  data() {
    return {
      industryList: [],
      quartersVO: ['first', 'second', 'third', 'four'],
      yearList: [],
      form: { industry: 1, year: new Date().getFullYear() },
      checkTabLock: false,
      tableData: [], // 表格数据
      currentPage: 1,
      totalPage: 0,
      pageSize: 10,
      performanceCountVO: ''
    }
  },
  created() {
    const thisYear = new Date().getFullYear()
    for (let i = thisYear; i >= 2021; i--) {
      this.yearList.push({ id: i, name: i })
    }
  },
  mounted() {
    this.getSubIndustry()
    this.getPerformanceCount()
    this.getQueryPage()
  },
  methods: {
    handleSearch() {
      this.currentPage = 1
      this.getQueryPage()
      this.getPerformanceCount()
    },
    async getPerformanceCount() {
      try {
        const res = await summaryCount(this.form)
        this.performanceCountVO = res || ''
        if (res) this.formatTableItemVO(this.performanceCountVO)
      } catch (error) {}
    },
    formatTableItemVO(tabItem) {
      Object.keys(tabItem).forEach(ele => {
        if (ele.slice(-6) === 'Amount' && this.form.industry !== 5) tabItem[ele] = toFixedFilter(tabItem[ele])
      })
    },
    async getQueryPage() {
      try {
        this.checkTabLock = true
        const res = await queryByPage(this.form)
        this.tableData = res?.results ?? []
        this.totalPage = res?.totalCount ?? 0
        if (this.tableData.length > 0) this.tableData.forEach(item => this.formatTableItemVO(item))
      } catch (error) {
      } finally {
        this.checkTabLock = false
      }
    },
    async getSubIndustry() {
      try {
        this.industryList = (await querySubIndustry()) || []
      } catch (error) {}
    },
    getStoreSummaries(param) {
      const { columns } = param
      const sums = []
      columns.forEach((column, index) => {
        sums[0] = '合计'
        if (index > 1) {
          sums[index] = this.performanceCountVO[column.property]
          if (column.property.slice(-4) === 'Rate') sums[index] = sums[index] + '%'
        } else return ''
      })
      return sums
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
