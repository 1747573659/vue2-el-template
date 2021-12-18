<template>
  <section>
    <div class="search-box">
      <el-form size="small" :model="form" :inline="true" label-suffix=":" label-width="80px" @submit.native.prevent>
        <el-row>
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
            <el-form-item label="授权产品">
              <km-select-page
                ref="productCode"
                v-model="form.productCodes"
                option-label="name"
                option-value="code"
                :data.sync="licensedProducts"
                :request="getProductByPage"
                :is-max-page.sync="isLicensedProductMaxPage"
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
            <el-form-item label="注册方式">
              <el-select v-model="form.registerStatus" clearable>
                <el-option v-for="item in registerStatus" :key="item[1].value" :label="item[1].label" :value="item[1].value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="下单人">
              <km-select-page
                ref="selectPage"
                v-model="form.createUser"
                :data.sync="ordererData"
                option-label="userName"
                option-value="id"
                :request="handleOrderPage"
                :is-max-page.sync="isOrdererMaxPage"
                placeholder="下单人"
              />
            </el-form-item>
            <el-form-item label="订单编码">
              <el-input v-model.trim="form.billNo" maxlength="16" clearable></el-input>
            </el-form-item>
            <el-form-item label="商户信息">
              <el-input v-model.trim="form.msg" maxlength="40" placeholder="请输入旧商户号/新商户号" clearable></el-input>
            </el-form-item>
            <el-form-item style="margin-left:80px">
              <el-button type="primary" size="small" @click="handleSearch">查询</el-button>
              <el-button size="small" v-permission="'ERP_AUTHORIZED_TRANSFER_EXPORT'" :loading="checkExportLoad" @click="handleExport">导出</el-button>
              <km-export-view v-permission="'ERP_AUTHORIZED_TRANSFER_EXPORT'" :request-export-log="handleExportRecord" :request-export-del="handleExportDel" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-col :xl="2" :lg="3" style="text-align:right">
          <el-form-item v-permission="'ERP_AUTHORIZED_TRANSFER_PLUS'">
            <el-button type="primary" size="small" plain icon="el-icon-plus" @click="handleSoftWareDetail({ status: 'add' })">新增</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </div>
    <div class="data-box" v-loading="checkTabLock">
      <el-table :data="tableData">
        <el-table-column prop="createOrderTime" label="订单时间"></el-table-column>
        <el-table-column prop="billNo" label="订单编码"></el-table-column>
        <el-table-column label="旧商户注册方式">
          <template slot-scope="scope">{{ registerStatus.has(scope.row.oldRegister) ? registerStatus.get(scope.row.oldRegister).label : '--' }}</template>
        </el-table-column>
        <el-table-column label="授权产品">
          <template slot-scope="scope">{{ `${scope.row.productCode ? '[' + scope.row.productCode + ']' : ''}${scope.row.productName || ''}` }}</template>
        </el-table-column>
        <el-table-column prop="oldMerchantNo" label="旧商户号"></el-table-column>
        <el-table-column prop="newMerchantNo" label="新商户号"></el-table-column>
        <el-table-column label="订单状态">
          <template slot-scope="scope">
            <span :class="{ 'p-mark-text': scope.row.orderStatus !== 30 }">{{ orderStatus.has(scope.row.orderStatus) ? orderStatus.get(scope.row.orderStatus).label : '--' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="handUserName" label="受理人"></el-table-column>
        <el-table-column prop="handManName" label="下单人"></el-table-column>
        <el-table-column label="操作" fixed="right" width="110">
          <template slot-scope="scope">
            <template v-if="[0, 5].includes(scope.row.orderStatus)">
              <el-button v-permission="'ERP_AUTHORIZED_TRANSFER_EDIT'" type="text" size="small" @click="handleToDetail({ status: 'edit' }, scope.row)">编辑</el-button>
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
import { mapActions } from 'vuex'
import { orderStatus, registerStatus } from './data'

import { queryAgentAllUser } from '@/api/orderCenter/orderManagement'
import { queryByPage, authOrderExport, authOrderExportLog, authOrderExportDel, authOrderProductPage } from '@/api/orderCenter/orderManagement/softwareAuthorization'

export default {
  name: 'erpAuthorizedTransfer',
  data() {
    return {
      orderStatus,
      registerStatus,
      licensedProducts: [],
      isLicensedProductMaxPage: false,
      ordererData: [],
      isOrdererMaxPage: false,
      checkExportLoad: false,
      form: { createTime: '', productCodes: [], orderStatus: '', registerStatus: '', createUser: '', billNo: '', msg: '' },
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
  beforeRouteEnter(to, from, next) {
    next(vm => {
      const StartTime = dayjs().subtract(30, 'days')
      vm.form.createTime = [StartTime.format('YYYY-MM-DD 00:00:00'), dayjs().format('YYYY-MM-DD 23:59:59')]
      vm.getQueryPage()
    })
  },
  mounted() {
    this.getProductByPage()
    this.handleOrderPage()
  },
  methods: {
    ...mapActions(['delCachedView']),
    handleToDetail(status, row = {}) {
      this.delCachedView({ name: 'softwareAuthorizationDetails' }).then(() => {
        this.$router.push({
          name: 'softwareAuthorizationDetails',
          query: Object.assign({ ...status, id: row.id, orderStatus: row.orderStatus }, status.productType ? {} : { productType: row.productType })
        })
      })
    },
    handleQueryParams() {
      const { createTime, ...params } = this.form
      return Object.assign(params, {
        sysSource: 1,
        agentId: this.userInfo.agentId,
        minDate: createTime?.[0] ?? '',
        maxDate: createTime?.[1] ?? '',
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
        const res = await queryByPage(this.handleQueryParams())
        this.tableData = res?.results ?? []
        this.totalPage = res?.totalCount ?? 0
      } catch (error) {
      } finally {
        this.checkTabLock = false
      }
    },
    async handleExport() {
      try {
        this.checkExportLoad = true
        await authOrderExport({ menu: this.$route.meta.title, params: this.handleQueryParams() })
        this.$message({ type: 'success', message: '数据文件生成中，请稍后在导出记录中下载' })
      } catch (error) {
      } finally {
        this.checkExportLoad = false
      }
    },
    handleExportRecord: async function({ currentPage, pageSize } = { currentPage: 1, pageSize: 10 }) {
      return await authOrderExportLog({ exportType: 7, page: currentPage, rows: pageSize })
    },
    handleExportDel: async function(row) {
      return await authOrderExportDel(row.id)
    },
    async handleOrderPage({ query = '', page = 1, rows = 10 } = {}) {
      try {
        const res = await queryAgentAllUser({ agentId: this.userInfo.agentId, page, rows, userName: query })
        this.ordererData = this.ordererData.concat(res.results || [])
        this.isOrdererMaxPage = !res.results || (res.results && res.results.length < 10)
      } catch (error) {}
    },
    async getProductByPage({ query = '', page = 1, rows = 10 } = {}) {
      try {
        const res = await authOrderProductPage({ info: query, page, rows, registerMethod: 1, productTypeList: this.form.productType === '' ? [] : [this.form.productType] })
        this.licensedProducts = this.licensedProducts.concat(res.results || [])
        this.isLicensedProductMaxPage = !res.results || (res.results && res.results.length < 10)
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
