<template>
  <section>
    <div class="search-box">
      <el-form size="small" :model="form" :inline="true" label-suffix=":" label-width="90px" @submit.native.prevent>
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
                clearable></el-date-picker>
            </el-form-item>
            <el-form-item label="申请经销商" v-if="userInfo.level === 1">
              <km-select-page
                v-model="form.agentId"
                :data.sync="agentData"
                option-label="name"
                option-value="id"
                :request="handleAgentPage"
                :is-max-page.sync="isAgentMaxPage"
                placeholder="请输入经销商ID/名称" />
            </el-form-item>
            <el-form-item label="订单状态">
              <el-select v-model="form.orderStatus" clearable>
                <template v-for="item in Array.from(orderStatus).filter(item => !(userInfo.level === 1 ? [0, 5] : [5]).includes(item[0]))">
                  <el-option :key="item[1].value" :label="item[1].label" :value="item[1].value"></el-option>
                </template>
              </el-select>
            </el-form-item>
            <el-form-item label="下单人" v-if="userInfo.level === 2">
              <km-select-page
                v-model="form.createUser"
                :data.sync="ordererData"
                option-label="userName"
                option-value="id"
                :request="handleOrderPage"
                :is-max-page.sync="isOrdererMaxPage"
                placeholder="下单人" />
            </el-form-item>
            <el-form-item label="订单编码">
              <el-input v-model.trim="form.billNo" maxlength="16" clearable></el-input>
            </el-form-item>
            <el-form-item style="margin-left: 90px">
              <el-button type="primary" size="small" @click="handleSearch">查询</el-button>
              <el-button size="small" v-permission="'SOFTWARE_INVENTORY_APPLY_EXPORT'" :loading="checkExportLoad" @click="handleExport">导出</el-button>
              <km-export-view width="900px" v-permission="'SOFTWARE_INVENTORY_APPLY_EXPORT'" :request-export-log="handleExportRecord" :request-export-del="handleExportDel" />
            </el-form-item>
          </el-col>
          <el-col :xl="2" :lg="3" style="text-align: right">
            <el-form-item v-permission="'SOFTWARE_INVENTORY_APPLY_PLUS'" v-if="userInfo.level === 2">
              <el-button type="primary" size="small" plain icon="el-icon-plus" @click="handleToDetail({ status: 'add' })">新增</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="data-box" v-loading="checkTabLock">
      <el-table :data="tableData">
        <el-table-column label="订单时间" width="165">
          <template slot-scope="scope">{{ scope.row.createTime | formatCreateTime }}</template>
        </el-table-column>
        <el-table-column prop="billNo" label="订单编码"></el-table-column>
        <el-table-column prop="agentName" label="申请经销商" v-if="userInfo.level === 1">
          <template slot-scope="scope">[{{ scope.row.agentId }}]{{ scope.row.agentName }}</template>
        </el-table-column>
        <el-table-column label="订单状态">
          <template slot-scope="scope">
            <span :class="{ 'p-mark-text': scope.row.orderStatus !== 20 }">{{ orderStatus.has(scope.row.orderStatus) ? orderStatus.get(scope.row.orderStatus).label : '--' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="useInventory" label="申请库存" align="right"></el-table-column>
        <el-table-column prop="handlerUserName" label="受理人" v-if="userInfo.level === 1"></el-table-column>
        <el-table-column prop="createUserName" label="下单人"></el-table-column>
        <el-table-column label="操作" fixed="right" width="150">
          <template slot-scope="scope">
            <template v-if="[0, 5].includes(scope.row.orderStatus)">
              <el-button v-permission="'SOFTWARE_INVENTORY_APPLY_EDIT'" type="text" size="small" @click="handleToDetail({ status: 'edit' }, scope.row)">编辑</el-button>
              <el-popconfirm class="el-button el-button--text" @confirm="handleDelRow(scope.row)" placement="top-start" title="确定删除所选数据吗？">
                <el-button type="text" size="small" slot="reference">删除</el-button>
              </el-popconfirm>
            </template>
            <template v-if="userInfo.level === 1 && scope.row.orderStatus === 10">
              <el-button type="text" size="small" v-permission="'SOFTWARE_INVENTORY_APPLY_AUDIT'" @click="handleToDetail({ status: 'audit' }, scope.row)">审核</el-button>
            </template>
            <template v-if="([10, 20].includes(scope.row.orderStatus) && userInfo.level === 2) || (userInfo.level === 1 && scope.row.orderStatus === 20)">
              <el-button type="text" size="small" @click="handleToDetail({ status: 'detail' }, scope.row)">详情</el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <km-pagination :request="getQueryPage" :current-page.sync="currentPage" :page-size.sync="pageSize" :total="totalPage" />
    </div>
  </section>
</template>

<script>
import dayjs from 'dayjs'
import { mapActions } from 'vuex'
import { orderStatus } from './data'

import { queryAgentAllUser } from '@/api/orderCenter/orderManagement'
import {
  queryByPage,
  applyExportExcelLevelOne,
  applyExportExcelLevelTwo,
  replaceOrderExportLog,
  replaceOrderExportDel,
  applyOrderDelete,
  queryAgentPage
} from '@/api/orderCenter/orderManagement/softwareInventoryApply'

export default {
  name: 'softwareInventoryReplace',
  data() {
    return {
      orderStatus,
      form: {
        createTime: '',
        orderStatus: '',
        createUser: '',
        billNo: '',
        agentId: ''
      },
      ordererData: [],
      isOrdererMaxPage: false,
      agentData: [],
      isAgentMaxPage: false,
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
      },
      cueerntAgentId: '',
      userInfo: JSON.parse(localStorage.userInfo)
    }
  },
  filters: {
    formatCreateTime(time) {
      return dayjs(time).format('YYYY-MM-DD HH:mm')
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      const StartTime = dayjs().subtract(7, 'days')
      vm.form.createTime = [StartTime.format('YYYY-MM-DD 00:00:00'), dayjs().format('YYYY-MM-DD 23:59:59')]
      vm.getQueryPage()
    })
  },
  methods: {
    ...mapActions(['delCachedView']),
    handleToDetail(status, row = {}) {
      this.delCachedView({ name: 'softwareInventoryApplyDetails' }).then(() => {
        this.$router.push({ name: 'softwareInventoryApplyDetails', query: { ...status, id: row.id, orderStatus: row.orderStatus } })
      })
    },
    async handleDelRow(row) {
      try {
        await applyOrderDelete(row.id)
        if (!--this.tableData.length) this.currentPage = Math.ceil((this.totalPage - 1) / this.pageSize) || 1
        this.getQueryPage()
      } catch (error) {}
    },
    handleQueryParams() {
      const { createTime, ...params } = this.form
      return Object.assign(params, {
        from: this.userInfo.level,
        startDate: createTime?.[0] ?? '',
        endDate: createTime?.[1] ?? '',
        page: this.currentPage,
        rows: this.pageSize
      })
    },
    async handleExport() {
      try {
        this.checkExportLoad = true
        this.userInfo.level === 1 ? await applyExportExcelLevelOne(this.handleQueryParams()) : await applyExportExcelLevelTwo(this.handleQueryParams())
        this.$message({ type: 'success', message: '数据文件生成中，请稍后在导出记录中下载' })
      } catch (error) {
      } finally {
        this.checkExportLoad = false
      }
    },
    handleExportRecord({ currentPage, pageSize } = { currentPage: 1, pageSize: 10 }) {
      return replaceOrderExportLog({ exportType: this.userInfo.level === 1 ? 33 : 32, page: currentPage, rows: pageSize, userId: this.userInfo.id })
    },
    handleExportDel: async function (row) {
      return await replaceOrderExportDel(row.id)
    },
    handleSearch() {
      this.currentPage = 1
      this.getQueryPage()
    },
    async getQueryPage() {
      try {
        this.checkTabLock = true
        const res = await queryByPage(this.handleQueryParams())
        this.tableData = res?.results ?? []
        this.totalPage = res?.totalCount ?? 0
      } catch (error) {
      } finally {
        this.checkTabLock = false
      }
    },
    async handleAgentPage({ query = '', page = 1, rows = 10 } = {}) {
      try {
        const res = await queryAgentPage({ id: query, page, rows })
        this.agentData = this.agentData.concat(res.results || [])
        this.isAgentMaxPage = !res.results || (res.results && res.results.length < 10)
      } catch (error) {}
    },
    async handleOrderPage({ query = '', page = 1, rows = 10 } = {}) {
      try {
        const res = await queryAgentAllUser({ agentId: this.userInfo.agentId, userName: query, page, rows })
        this.ordererData = this.ordererData.concat(res.results || [])
        this.isOrdererMaxPage = !res.results || (res.results && res.results.length < 10)
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
