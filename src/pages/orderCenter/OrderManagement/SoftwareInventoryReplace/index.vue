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
                <el-option v-for="item in orderStatus" :key="item[1].value" :label="item[1].label" :value="item[1].value"></el-option>
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
            <el-form-item label="单据编码">
              <el-input v-model.trim="form.billNo" clearable></el-input>
            </el-form-item>
            <el-form-item style="margin-left:80px">
              <el-button type="primary" size="small" @click="handleSearch">查询</el-button>
              <el-button size="small" v-permission="'SOFTWARE_INVENTORY_REPLACE_EXPORT'" :loading="checkExportLoad" @click="handleExport">导出</el-button>
              <km-export-view ref="export" v-permission="'SOFTWARE_INVENTORY_REPLACE_EXPORT'" :request-export-log="handleExportRecord" :request-export-del="handleExportDel">
                <el-table-column label="进度" width="100">
                  <template slot-scope="scope">{{ ['生成中', '已生成'][scope.row.status - 1] }}</template>
                </el-table-column>
                <el-table-column label="操作" width="100">
                  <template slot-scope="scope">
                    <template v-if="scope.row.status === 2">
                      <el-link :href="scope.row.fileUrl" :underline="false">
                        <el-button size="small" type="text">下载</el-button>
                      </el-link>
                      <el-button size="small" @click="$refs.export.handleExportDel(scope.row)" type="text" style="margin-left: 8px;">删除</el-button>
                    </template>
                    <span v-else>--</span>
                  </template>
                </el-table-column>
              </km-export-view>
            </el-form-item>
          </el-col>
          <el-col :xl="2" :lg="3" style="text-align:right">
            <el-form-item v-permission="'SOFTWARE_INVENTORY_REPLACE_PLUS'">
              <el-button type="primary" size="small" plain icon="el-icon-plus" @click="handleToDetail({ status: 'add' })">新增</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="data-box" v-loading="checkTabLock">
      <el-table :data="tableData">
        <el-table-column prop="createOrderTime" label="订单时间" width="165"></el-table-column>
        <el-table-column prop="billNo" label="单据编码"></el-table-column>
        <el-table-column prop="consumeInventory" label="消耗库存" align="right" width="150"></el-table-column>
        <el-table-column prop="upgradeFee" label="升级费用" align="right" width="150"></el-table-column>
        <el-table-column label="订单状态">
          <template slot-scope="scope">{{ orderStatus.has(scope.row.orderStatus) ? orderStatus.get(scope.row.orderStatus).label : '--' }}</template>
        </el-table-column>
        <el-table-column prop="handUserName" label="受理人"></el-table-column>
        <el-table-column prop="createUserName" label="下单人"></el-table-column>
        <el-table-column label="操作" fixed="right" width="150">
          <template slot-scope="scope">
            <template v-if="scope.row.orderStatus === 10">
              <el-button v-permission="'SOFTWARE_INVENTORY_REPLACE_EDIT'" type="text" size="small" @click="handleToDetail({ status: 'edit' }, scope.row)">编辑</el-button>
              <el-popconfirm class="el-button el-button--text" @confirm="handleDelRow(scope.row)" placement="top-start" title="确定删除所选数据吗？">
                <el-button type="text" size="small" slot="reference">删除</el-button>
              </el-popconfirm>
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
import { orderStatus } from './data'
import { mapActions } from 'vuex'

import { queryOrderMan, exportOrder, exportRecordList, deleteExport } from '@/api/orderCenter/orderManagement'
import { queryByPage } from '@/api/orderCenter/orderManagement/softwareInventoryReplace'

export default {
  name: 'softwareInventoryReplace',
  data() {
    return {
      orderStatus,
      form: {
        createTime: '',
        orderStatus: -1,
        createUser: -1,
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
  mounted() {
    const StartTime = dayjs().subtract(7, 'days')
    this.form.createTime = [StartTime.format('YYYY-MM-DD 00:00:00'), dayjs().format('YYYY-MM-DD 23:59:59')]
    this.getQueryPage()
  },
  methods: {
    ...mapActions(['delCachedView']),
    handleToDetail(status, row = {}) {
      this.delCachedView({ name: 'softwareInventoryReplaceDetails' }).then(() => {
        this.$router.push({ name: 'softwareInventoryReplaceDetails', query: { ...status, id: row.id } })
      })
    },
    async handleDelRow(row) {},
    handleQueryParams() {
      const { createTime, ...params } = this.form
      return Object.assign(params, {
        startTime: createTime?.[0] ?? '',
        endTime: createTime?.[1] ?? '',
        page: this.currentPage,
        rows: this.pageSize
      })
    },
    async handleExport() {
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
      return await exportRecordList({ ...params, page: currentPage, rows: pageSize })
    },
    handleExportDel: async function(row) {
      return await deleteExport({ id: row.id })
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
    async handleOrderPage({ query = '', page = 1, row = 10 } = {}) {
      try {
        const res = await queryOrderMan({ id: query, agentId: this.cueerntAgentId, page, rows: row })
        this.ordererData = this.ordererData.concat(res.results || [])
        if (this.ordererData.every(item => item.contactor !== '全部')) {
          this.ordererData = [{ contactor: '全部', id: -1 }].concat(this.ordererData)
        }
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
</style>
