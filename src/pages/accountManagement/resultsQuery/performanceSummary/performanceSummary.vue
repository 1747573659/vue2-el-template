<template>
  <div>
    <div class="search-box">
      <el-row>
        <el-col>
          <el-form :inline="true" :model="form" label-width="85px" label-suffix=":">
            <el-form-item label="行业">
              <el-select v-model="form.industry" placeholder="全部" size="small" style="width: 100%">
                <el-option v-for="(item, index) in industryList" :label="item.name" :value="item.id" :key="index"></el-option>
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
      <el-table :data="tableData" show-summary :summary-method="getStoreSummaries" v-loading="checkTabLock">
        <el-table-column prop="industryName" label="行业" width="110"></el-table-column>
        <el-table-column prop="year" label="年份"></el-table-column>
        <el-table-column prop="yearAmount" label="年度任务" width="120" align="right"></el-table-column>
        <el-table-column prop="yearCompletedAmount" label="年度销售" min-width="110" align="right"></el-table-column>
        <el-table-column prop="yearCompletedRate" label="年度完成率" align="right" width="110">
          <template slot-scope="scope">{{ scope.row.yearCompletedRate }}%</template>
        </el-table-column>
        <template v-for="(item, index) in quartersVO">
          <el-table-column
            :prop="`${item}QuarterAmount`"
            :label="`Q${index + 1}任务`"
            :key="`${item}QuarterAmount`"
            min-width="110"
            align="right"
          ></el-table-column>
          <el-table-column
            :prop="`${item}CompletedAmount`"
            :label="`Q${index + 1}销售`"
            :key="`${item}CompletedAmount`"
            min-width="110"
            align="right"
          ></el-table-column>
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
import NP from 'number-precision'

import { queryByPage } from '@/api/accountManagement/accountQuery/performanceSummary'

export default {
  name: 'resultsQueryDealer',
  data() {
    return {
      industryList: [
        { id: 1, name: '零售专卖' },
        { id: 2, name: '餐饮' },
        { id: 5, name: '有数' }
      ],
      searchIndustry: '',
      quartersVO: ['first', 'second', 'third', 'four'],
      yearList: [],
      form: { industry: 1, year: new Date().getFullYear() },
      checkTabLock: false,
      tableData: [], // 表格数据
      currentPage: 1,
      totalPage: 0,
      pageSize: 10
    }
  },
  created() {
    const thisYear = new Date().getFullYear()
    for (let i = thisYear; i >= 2021; i--) {
      this.yearList.push({ id: i, name: i })
    }
  },
  mounted() {
    this.getQueryPage()
  },
  methods: {
    handleSearch() {
      this.currentPage = 1
      this.getQueryPage()
    },
    async getQueryPage() {
      try {
        this.checkTabLock = true
        const res = await queryByPage(this.form)
        this.tableData = res?.results ?? []
        this.searchIndustry = this.form.industry
        if (this.tableData.length > 0 && this.searchIndustry !== 5) {
          this.tableData.forEach(item => {
            Object.keys(item).forEach(ele => {
              if (ele.slice(-6) === 'Amount') item[ele] = NP.divide(item[ele], 100).toFixed(2)
            })
          })
        }
        this.totalPage = res?.totalCount ?? 0
      } catch (error) {
      } finally {
        this.checkTabLock = false
      }
    },
    getStoreSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        const values = data.map(item => parseFloat(item[column.property]))
        sums[0] = '合计'
        sums[1] = ''
        if (index > 1) {
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) return this.searchIndustry === 5 ? NP.plus(prev, curr) : NP.round(NP.plus(prev, curr), 2).toFixed(2)
              else return prev
            }, 0)
            if (column.property.slice(-4) === 'Rate') {
              if (sums[index - 2] === 0 && sums[index - 1] !== 0) sums[index] = '100%'
              else {
                const completionRate = NP.divide(sums[index - 1], sums[index - 2])
                sums[index] = completionRate ? `${NP.times(NP.round(completionRate, 2), 100)}%` : '0%'
              }
            }
          }
        }
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
