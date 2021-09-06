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
            <el-form-item label="订单状态">
              <el-select v-model="form.orderStatus" clearable>
                <el-option v-for="(item, index) in [{ label: '全部', value: '' }, ...orderStatus]" :key="index" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="付款状态">
              <el-select v-model="form.paymentStatus" clearable>
                <el-option v-for="(item, index) in [{ label: '全部', value: '' }, ...paymentStatus]" :key="index" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="发货状态">
              <el-select v-model="form.deliveryStatus" clearable>
                <el-option v-for="(item, index) in [{ label: '全部', value: '' }, ...deliveryStatus]" :key="index" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="下单人">
              <el-select v-model="form.orderer" clearable>
                <el-option v-for="(item, index) in [{ label: '全部', value: '' }, ...deliveryStatus]" :key="index" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="订单编码">
              <el-input v-model.trim="form.orderCode" clearable></el-input>
            </el-form-item>
            <el-form-item style="margin-left:80px">
              <el-button type="primary" size="small" @click="handleSearch">查询</el-button>
              <el-button size="small" v-permission="'HARDWARE_PURCHASE_ORDER_EXPORT'" :loading="exportLoad" @click="handleExport">导出</el-button>
              <km-export-view v-permission="'HARDWARE_PURCHASE_ORDER_EXPORT'" :request-export-log="handleExportRecord" :request-export-del="handleExportDel" />
            </el-form-item>
          </el-col>
          <el-col :xl="2" :lg="3" style="text-align:right">
            <el-form-item>
              <template v-permission="'HARDWARE_PURCHASE_ORDER_PLUS'">
                <el-button type="primary" size="small" plain icon="el-icon-plus" @click="handleHardWareDetail({ status: 'add' })">新增</el-button>
              </template>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="data-box" v-loading="checkTabLock">
      <el-table :data="tableData">
        <el-table-column prop="createTime" label="订单时间" width="110"></el-table-column>
        <el-table-column prop="code" label="单据编码" width="150"></el-table-column>
        <el-table-column label="订单状态" width="80">
          <template slot-scope="scope">{{ orderStatus[scope.row.status] ? orderStatus[scope.row.status].label : '--' }}</template>
        </el-table-column>
        <el-table-column prop="amount" label="订单金额" header-align="center" align="right" min-width="100"></el-table-column>
        <el-table-column label="付款状态">
          <template slot-scope="scope">{{ paymentStatus[scope.row.paymentStatus] ? paymentStatus[scope.row.paymentStatus].label : '--' }}</template>
        </el-table-column>
        <el-table-column label="发货状态">
          <template slot-scope="scope">{{ deliveryStatus[scope.row.deliveryStatus] ? deliveryStatus[scope.row.deliveryStatus].label : '--' }}</template>
        </el-table-column>
        <el-table-column prop="assignee" label="受理人"></el-table-column>
        <el-table-column prop="orderer" label="下单人"></el-table-column>
        <el-table-column prop="principal" label="使用本金" header-align="center" align="right" min-width="100"></el-table-column>
        <el-table-column prop="bonus" label="使用赠金" header-align="center" align="right" min-width="100"></el-table-column>
        <el-table-column prop="guaranteedAmount" label="担保金额" header-align="center" align="right" min-width="100"></el-table-column>
        <el-table-column label="担保人">
          <template slot-scope="scope">{{ scope.row.guarantor || '--' }}</template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="110">
          <template slot-scope="scope">
            <template v-if="scope.row.status === 0">
              <el-button v-permission="'HARDWARE_PURCHASE_ORDER_EDIT'" type="text" size="small" @click="handleHardWareDetail({ status: 'edit' }, scope.row)">编辑</el-button>
            </template>
            <el-button v-else type="text" size="small" @click="handleHardWareDetail({ status: 'detail' }, scope.row)">详情</el-button>
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
import { softwarePurchaseOrder } from '../data'
import { xftArchiveExport, xftArchiveExportLog, xftArchiveExportDel } from '@/api/xftArchive'
import { queryPage } from '@/api/wxArchive'

export default {
  name: 'hardwarePurchaseOrder',
  data() {
    return {
      orderStatus,
      paymentStatus,
      deliveryStatus,
      form: {
        createTime: '',
        orderStatus: '',
        paymentStatus: '',
        deliveryStatus: '',
        orderer: '',
        orderCode: ''
      },
      direAuditStatusOptions: [],
      tableData: [],
      checkTabLock: false,
      currentPage: 1,
      totalPage: 0,
      pageSize: 10,
      exportLoad: false,
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      }
    }
  },
  mounted() {
    this.form.createTime = [dayjs().subtract(7, 'days').format('YYYY-MM-DD 00:00:00'), dayjs().format('YYYY-MM-DD 23:59:59')]
    this.getQueryPage()
  },
  methods: {
    handleHardWareDetail(status) {
      this.$router.push({ name: 'hardwarePurchaseDetails', query: status })
    },
    handleQueryParams() {
      const { createTime, ...params } = this.form
      return Object.assign(params, {
        startTime: createTime?.[0] ?? '',
        endTime: createTime?.[1] ?? '',
        page: this.currentPage,
        rows: this.pageSize
      })
    },
    handleExport: async function() {
      this.exportLoad = true
      try {
        this.$message({ type: 'success', message: '数据文件生成中，请稍后在导出记录中下载' })
        await xftArchiveExport({ menu: this.$route.meta.title, params: this.handleQueryParams() })
      } catch (error) {
      } finally {
        this.exportLoad = false
      }
    },
    handleExportRecord: async function({ currentPage, pageSize } = { currentPage: 1, pageSize: 10 }) {
      const data = { exportType: 1, page: currentPage, rows: pageSize }
      return await xftArchiveExportLog(data)
    },
    handleExportDel: async function(row) {
      return await xftArchiveExportDel({ id: row.id })
    },
    handleSearch() {
      this.currentPage = 1
      this.getQueryPage()
    },
    getQueryPage: async function() {
      try {
        this.checkTabLock = true
        const res = await queryPage(this.handleQueryParams())
        // this.tableData = res?.results ?? []
        this.tableData = softwarePurchaseOrder
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
