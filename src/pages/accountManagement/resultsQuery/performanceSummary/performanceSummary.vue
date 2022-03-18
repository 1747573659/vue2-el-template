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
              <el-select v-model="form.year" filterable clearable placeholder="请选择" size="small" style="width: 100%">
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
        <el-table-column prop="yearCompletedAmount" label="年度销售" align="right"></el-table-column>
        <el-table-column prop="yearCompletedRate" label="年度完成率" align="right" width="110">
          <template slot-scope="scope">{{ scope.row.yearCompletedRate }}%</template>
        </el-table-column>
        <el-table-column prop="firstQuarterAmount" label="Q1任务" align="right"></el-table-column>
        <el-table-column prop="fourCompletedAmount" label="Q1销售" align="right"></el-table-column>
        <el-table-column prop="firstCompletedRate" label="Q1完成率" width="110" align="right">
          <template slot-scope="scope">{{ scope.row.firstCompletedRate }}%</template>
        </el-table-column>
        <el-table-column prop="secondQuarterAmount" label="Q2任务" align="right"></el-table-column>
        <el-table-column prop="secondCompletedAmount" label="Q2销售" align="right"></el-table-column>
        <el-table-column prop="secondCompletedRate" label="Q2完成率" width="110" align="right">
          <template slot-scope="scope">{{ scope.row.secondCompletedRate }}%</template>
        </el-table-column>
        <el-table-column prop="thirdQuarterAmount" label="Q3任务" align="right"></el-table-column>
        <el-table-column prop="thirdCompletedAmount" label="Q3销售" align="right"></el-table-column>
        <el-table-column prop="thirdCompletedRate" label="Q3完成率" align="right" width="110">
          <template slot-scope="scope">{{ scope.row.thirdCompletedRate }}%</template>
        </el-table-column>
        <el-table-column prop="fourQuarterAmount" label="Q4任务" align="right"></el-table-column>
        <el-table-column prop="fourCompletedAmount" label="Q4销售" align="right"></el-table-column>
        <el-table-column prop="fourCompletedRate" label="Q4完成率" align="right" width="110">
          <template slot-scope="scope">{{ scope.row.fourCompletedRate }}%</template>
        </el-table-column>
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
      yearList: [{ id: '', name: '全部' }],
      form: { industry: 1, year: new Date().getFullYear() },
      checkTabLock: false,
      tableData: [], // 表格数据
      currentPage: 1,
      totalPage: 0,
      pageSize: 10
    }
  },
  filters: {
    formatAmount(val) {
      return val ? NP.divide(val, 100) : 0
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
        if (this.form.industry !== 5) {
          this.tableData.forEach(item => {
            Object.keys(item).forEach(ele => {
              if (ele.slice(-6) === 'Amount') item[ele] = NP.divide(item[ele], 100)
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
        sums[0] = sums[1] = ''
        if (index > 1) {
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) return NP.plus(prev, curr)
              else return prev
            }, 0)
            if (column.property.slice(-4) === 'Rate') sums[index] = `${sums[index]}%`
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
