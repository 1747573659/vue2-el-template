<template>
  <section>
    <div class="search-box">
      <el-form size="small" :model="form" :inline="true" label-suffix=":" label-width="80px" @submit.native.prevent>
        <el-row type="flex" align="bottom">
          <el-col :xl="22" :lg="21">
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
                clearable
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="行业">
              <el-select v-model="form.industry" @change="handleIndustryChange" clearable>
                <el-option v-for="item in industryTypes" :key="item[1].value" :label="item[1].label" :value="item[1].value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="产品">
              <km-select-page
                v-model="form.productCodeList"
                option-label="name"
                option-value="code"
                :data.sync="productLists"
                :request="getProductByPage"
                :is-max-page.sync="isProductMaxPage"
                placeholder="全部"
                multiple
                collapse-tags
              />
            </el-form-item>
            <el-form-item label="订单状态">
              <el-select v-model="form.orderStatus" clearable>
                <template v-for="item in Array.from(orderStatus).filter(item => ![5].includes(item[0]))">
                  <el-option :key="item[1].value" :label="item[1].label" :value="item[1].value"></el-option>
                </template>
              </el-select>
            </el-form-item>
            <el-form-item label="付款状态">
              <el-select v-model="form.payStatus" clearable>
                <el-option v-for="item in paymentStatus" :key="item[1].value" :label="item[1].label" :value="item[1].value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="下单人">
              <km-select-page
                ref="selectPage"
                v-model="form.createUser"
                :data.sync="ordererData"
                option-label="userName"
                option-value="id"
                :request="handleOrdererPage"
                :is-max-page.sync="isOrdererMaxPage"
                placeholder="全部"
              />
            </el-form-item>
            <el-form-item label="订单编码">
              <el-input v-model.trim="form.billNo" maxlength="16" clearable></el-input>
            </el-form-item>
            <el-form-item style="margin-left:80px">
              <el-button type="primary" size="small" @click="handleSearch">查询</el-button>
              <!-- <el-button size="small" v-permission="'DEMAND_DEVELOPMENT_FEE_EXPORT'" :loading="checkExportLoad" @click="handleExport">导出</el-button>
              <km-export-view v-permission="'DEMAND_DEVELOPMENT_FEE_EXPORT'" :request-export-log="handleExportRecord" :request-export-del="handleExportDel" /> -->
            </el-form-item>
          </el-col>
          <el-col :xl="2" :lg="3" style="text-align:right">
            <el-form-item v-permission="'DEMAND_DEVELOPMENT_FEE_PLUS'">
              <el-button type="primary" size="small" plain icon="el-icon-plus" @click="handleToDetail({ status: 'add' })">新增</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="data-box" v-loading="checkTabLock">
      <el-table :data="tableData">
        <el-table-column prop="createOrderTime" label="订单时间" width="110"></el-table-column>
        <el-table-column prop="billNo" label="订单编码"></el-table-column>
        <el-table-column prop="industryName" label="行业"></el-table-column>
        <el-table-column label="产品">
          <template slot-scope="scope">{{ `${scope.row.productCode ? '[' + scope.row.productCode + ']' : ''}${scope.row.productName || ''}` }}</template>
        </el-table-column>
        <el-table-column label="订单状态" width="90">
          <template slot-scope="scope">
            <span :class="{ 'p-mark-text': scope.row.orderStatus !== 30 }">{{ orderStatus.has(scope.row.orderStatus) ? orderStatus.get(scope.row.orderStatus).label : '--' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="developDay" label="开发人天" align="right" width="80"></el-table-column>
        <el-table-column prop="developAmount" label="开发费用" align="right"></el-table-column>
        <el-table-column label="付款状态" width="90">
          <template slot-scope="scope">
            <span :class="{ 'p-mark-text': scope.row.payStatus !== 2 }">{{ paymentStatus.has(scope.row.payStatus) ? paymentStatus.get(scope.row.payStatus).label : '' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="handUserName" label="受理人"></el-table-column>
        <el-table-column prop="createUserName" label="下单人"></el-table-column>
        <el-table-column label="使用本金" align="right">
          <template slot-scope="scope">{{ scope.row.useAmount | formatAmount }}</template>
        </el-table-column>
        <el-table-column label="担保金额" align="right">
          <template slot-scope="scope">{{ scope.row.useGuarantee | formatAmount }}</template>
        </el-table-column>
        <el-table-column prop="guaranteePeopleName" label="担保人"></el-table-column>
        <el-table-column label="操作" fixed="right" width="110">
          <template slot-scope="scope">
            <template v-if="[0, 5].includes(scope.row.orderStatus)">
              <el-button type="text" size="small" @click="handleToDetail({ status: 'edit' }, scope.row)">编辑</el-button>
            </template>
            <el-button v-else type="text" size="small" @click="handleToDetail({ status: 'detail' }, scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <km-pagination :request="getQueryPage" :current-page.sync="currentPage" :page-size.sync="pageSize" :total="totalPage" />
    </div>
  </section>
</template>

<script>
import dayjs from 'dayjs'
import NP from 'number-precision'
import { mapActions } from 'vuex'
import { industryTypes, orderStatus, paymentStatus } from './data'

import { queryAgentAllUser } from '@/api/orderCenter/orderManagement'
import { queryChannelDevelopPage, queryProductCode } from '@/api/orderCenter/orderManagement/demandDevelopmentFee'

export default {
  name: 'demandDevelopmentFee',
  data() {
    return {
      industryTypes,
      orderStatus,
      paymentStatus,
      productLists: [],
      isProductMaxPage: false,
      ordererData: [],
      isOrdererMaxPage: false,
      form: { createTime: '', industry: '', productCodeList: [], orderStatus: '', payStatus: '', createUser: '', billNo: '' },
      checkExportLoad: false,
      checkTabLock: false,
      tableData: [],
      currentPage: 1,
      totalPage: 0,
      pageSize: 10,
      userInfo: JSON.parse(localStorage.userInfo),
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > dayjs().endOf('day')
        }
      }
    }
  },
  filters: {
    formatAmount(val) {
      return val ? NP.divide(val, 100) : 0
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      const StartTime = dayjs().subtract(30, 'days')
      vm.form.createTime = [StartTime.format('YYYY-MM-DD 00:00:00'), dayjs().format('YYYY-MM-DD 23:59:59')]
      vm.getQueryPage()
    })
  },
  mounted() {
    this.getProductByPage()
    this.handleOrdererPage()
  },
  methods: {
    ...mapActions(['delCachedView']),
    handleToDetail(status, row = {}) {
      this.delCachedView({ name: 'demandDevelopmentFeeDetails' }).then(() => {
        this.$router.push({ name: 'demandDevelopmentFeeDetails', query: Object.assign({ ...status, id: row.id, orderStatus: row.orderStatus }) })
      })
    },
    handleQueryParams() {
      const { createTime, ...params } = this.form
      return Object.assign(params, {
        from: 0,
        createOrderTimeStart: createTime?.[0] ?? '',
        createOrderTimeEnd: createTime?.[1] ?? '',
        page: this.currentPage,
        rows: this.pageSize
      })
    },
    handleSearch() {
      this.currentPage = 1
      this.getQueryPage()
    },
    async getQueryPage() {
      try {
        this.checkTabLock = true
        const res = await queryChannelDevelopPage(this.handleQueryParams())
        this.tableData = res?.results ?? []
        this.totalPage = res?.totalCount ?? 0
      } catch (error) {
      } finally {
        this.checkTabLock = false
      }
    },
    // async handleExport() {
    //   try {
    //     this.checkExportLoad = true
    //     await authOrderExport({ menu: this.$route.meta.title, params: this.handleQueryParams() })
    //     this.$message({ type: 'success', message: '数据文件生成中，请稍后在导出记录中下载' })
    //   } catch (error) {
    //   } finally {
    //     this.checkExportLoad = false
    //   }
    // },
    // handleExportRecord: async function({ currentPage, pageSize } = { currentPage: 1, pageSize: 10 }) {
    //   return await authOrderExportLog({ exportType: 7, page: currentPage, rows: pageSize })
    // },
    // handleExportDel: async function(row) {
    //   return await authOrderExportDel(row.id)
    // },
    async handleOrdererPage({ query = '', page = 1, rows = 10 } = {}) {
      try {
        const res = await queryAgentAllUser({ agentId: this.userInfo.agentId, page, rows, userName: query })
        this.ordererData = this.ordererData.concat(res.results || [])
        this.isOrdererMaxPage = !res.results || (res.results && res.results.length < 10)
      } catch (error) {}
    },
    handleIndustryChange() {
      this.productLists = []
      this.isProductMaxPage = false
      this.form.productCodes = []
      this.$refs.productCode.selectVal = ''
      this.getProductByPage()
    },
    async getProductByPage({ query = '', page = 1, rows = 10 } = {}) {
      try {
        const res = await queryProductCode({ info: query, page, rows, productIndustry: this.form.industry })
        this.productLists = this.productLists.concat(res.results || [])
        this.isProductMaxPage = !res.results || (res.results && res.results.length < 10)
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
.p-mark-text {
  color: red;
}
</style>
