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
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']"
                clearable
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="订单状态">
              <el-select v-model="form.orderStatus" clearable>
                <el-option v-for="item in orderStatus" :key="item[1].value" :label="item[1].label" :value="item[1].value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="付款状态">
              <el-select v-model="form.payStatus" clearable>
                <el-option v-for="item in paymentStatus" :key="item[1].value" :label="item[1].label" :value="item[1].value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="下单人">
              <km-select-page
                v-model="form.createUser"
                :data.sync="ordererData"
                dict-label="contactor"
                dict-value="id"
                :request="handleOrderPage"
                :is-max-page.sync="isOrdererMaxPage"
                placeholder="下单人"
              ></km-select-page>
            </el-form-item>
            <el-form-item label="订单编码">
              <el-input v-model.trim="form.billNo" clearable></el-input>
            </el-form-item>
            <el-form-item style="margin-left:80px">
              <el-button type="primary" size="small" @click="handleSearch">查询</el-button>
              <el-button size="small" v-permission="'SOFT_PURCHASE_ORDER_EXPORT'" :loading="checkExportLoad" @click="handleExport">导出</el-button>
              <km-export-view v-permission="'SOFT_PURCHASE_ORDER_EXPORT'" :request-export-log="handleExportRecord" :request-export-del="handleExportDel" />
            </el-form-item>
          </el-col>
          <el-col :xl="2" :lg="3" style="text-align:right">
            <el-form-item>
              <template v-permission="'SOFT_PURCHASE_ORDER_PLUS'">
                <el-button type="primary" size="small" plain icon="el-icon-plus" @click="handleSoftWareDetail({ status: 'add' })">新增</el-button>
              </template>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="data-box" v-loading="checkTabLock">
      <el-table :data="tableData">
        <el-table-column prop="createOrderTime" label="订单时间" width="110"></el-table-column>
        <el-table-column prop="billNo" label="单据编码" width="150"></el-table-column>
        <el-table-column label="订单状态" width="80">
          <template slot-scope="scope">{{ orderStatus.has(scope.row.orderStatus) ? orderStatus.get(scope.row.orderStatus).label : '--' }}</template>
        </el-table-column>
        <el-table-column prop="orderAmount" label="订单金额" align="right" min-width="100"></el-table-column>
        <el-table-column label="付款状态">
          <template slot-scope="scope">{{ paymentStatus.has(scope.row.payStatus) ? paymentStatus.get(scope.row.payStatus).label : '--' }}</template>
        </el-table-column>
        <el-table-column prop="handUserName" label="受理人"></el-table-column>
        <el-table-column prop="createUser" label="下单人"></el-table-column>
        <el-table-column prop="useAmount" label="使用本金" align="right" min-width="100"></el-table-column>
        <el-table-column prop="useAmountGift" label="使用赠金" align="right" min-width="100"></el-table-column>
        <el-table-column prop="useGuarantee" label="担保金额" align="right" min-width="100"></el-table-column>
        <el-table-column label="担保人">
          <template slot-scope="scope">{{ scope.row.guaranteePeopleName || '--' }}</template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="110">
          <template slot-scope="scope">
            <template v-if="scope.row.orderStatus === 0">
              <el-button v-permission="'SOFT_PURCHASE_ORDER_EDIT'" type="text" size="small" @click="handleSoftWareDetail({ status: 'edit' }, scope.row)">编辑</el-button>
            </template>
            <el-button v-else type="text" size="small" @click="handleSoftWareDetail({ status: 'detail' }, scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <km-pagination :request="getQueryPage" :current-page.sync="currentPage" :page-size.sync="pageSize" :total="totalPage" />
    </div>
  </section>
</template>

<script>
import dayjs from 'dayjs'
import { orderStatus, paymentStatus, deliveryStatus } from '../index'
import { queryByPage, queryOrderMan, exportOrder, exportRecordList, deleteExport } from '@/api/orderCenter/orderManagement'
import { getLocal } from '@/utils/storage'
import { mapActions } from 'vuex'

export default {
  name: 'softwarePurchaseOrder',
  data() {
    return {
      orderStatus,
      paymentStatus,
      deliveryStatus,
      form: {
        createTime: '',
        orderStatus: '',
        payStatus: '',
        createUser: '',
        billNo: ''
      },
      ordererData: [],
      isOrdererMaxPage: false,
      tableData: [],
      checkTabLock: false,
      currentPage: 1,
      totalPage: 0,
      pageSize: 10,
      checkExportLoad: false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > dayjs().endOf('day')
        }
      }
    }
  },
  activated() {
    this.getQueryPage()
  },
  mounted() {
    const StartTime = dayjs().subtract(7, 'days')
    this.form.createTime = [StartTime.format('YYYY-MM-DD 00:00:00'), dayjs().format('YYYY-MM-DD 23:59:59')]
    this.getQueryPage()
  },
  methods: {
    ...mapActions(['delCachedView']),
    handleSoftWareDetail(status, row = {}) {
      this.delCachedView({ name: 'softwarePurchaseDetails' }).then(() => {
        this.$router.push({ name: 'softwarePurchaseDetails', query: { ...status, orderStatus: row.orderStatus, id: row.id } })
      })
    },
    handleQueryParams() {
      const { createTime, ...params } = this.form
      return Object.assign(params, {
        from: false,
        orderType: 1,
        startTime: createTime?.[0] ?? '',
        endTime: createTime?.[1] ?? '',
        page: this.currentPage,
        rows: this.pageSize
      })
    },
    handleExport: async function() {
      try {
        this.checkExportLoad = true
        await exportOrder(this.handleQueryParams())
        this.$message({ type: 'success', message: '数据文件生成中，请稍后在导出记录中下载' })
      } catch (error) {
      } finally {
        this.checkExportLoad = false
      }
    },
    handleExportRecord: async function({ currentPage, pageSize } = { currentPage: 1, pageSize: 10 }) {
      const { page, rows, ...params } = this.handleQueryParams()
      return await exportRecordList(Object.assign(params, { page: currentPage, rows: pageSize }))
    },
    handleExportDel: async function(row) {
      return await deleteExport({ id: row.id })
    },
    handleOrderPage: async function({ query = '', page = 1, row = 10 } = {}) {
      try {
        const res = await queryOrderMan({ params: { agentId: JSON.parse(getLocal('userBaseInfo')).agentId }, page, rows: row })
        this.ordererData = this.ordererData.concat(res.results || [])
        this.isOrdererMaxPage = !res.results || (res.results && res.results.length < 10)
      } catch (error) {}
    },
    handleSearch() {
      this.currentPage = 1
      this.getQueryPage()
    },
    getQueryPage: async function() {
      try {
        this.checkTabLock = true
        const res = await queryByPage(this.handleQueryParams())
        this.tableData = res?.results ?? []
        this.totalPage = res?.totalCount ?? 0
      } catch (error) {
      } finally {
        this.checkTabLock = false
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
