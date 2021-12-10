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
            <el-form-item label="产品类型">
              <el-select v-model="form.productType" placeholder="产品类型" @change="handleProductTypeChange" clearable>
                <el-option v-for="item in productType" :key="item[1].value" :label="item[1].label" :value="item[1].value"></el-option>
              </el-select>
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
              <el-input v-model.trim="form.billNo" maxlength="14" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="space-between">
          <el-form-item style="margin-left:80px">
            <el-button type="primary" size="small" @click="handleSearch">查询</el-button>
            <el-button size="small" v-permission="'SOFTWARE_AUTHORIZATION_EXPORT'" :loading="checkExportLoad" @click="handleExport">导出</el-button>
            <km-export-view v-permission="'SOFTWARE_AUTHORIZATION_EXPORT'" :request-export-log="handleExportRecord" :request-export-del="handleExportDel" />
          </el-form-item>
          <el-form-item v-permission="'SOFTWARE_AUTHORIZATION_PLUS'">
            <el-button type="primary" size="small" plain @click="handleToDetail({ status: 'add', productType: 1 })">ERP产品</el-button>
            <el-button type="primary" size="small" plain @click="handleToDetail({ status: 'add', productType: 3 })">微零售</el-button>
            <el-button type="primary" size="small" plain @click="handleToDetail({ status: 'add', productType: 4 })">微餐饮</el-button>
            <el-button type="primary" size="small" plain @click="handleToDetail({ status: 'add', productType: 5 })">云商</el-button>
            <el-button type="primary" size="small" plain @click="handleToDetail({ status: 'add', productType: 6 })">加密狗</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
    <div class="data-box" v-loading="checkTabLock">
      <el-table :data="tableData">
        <el-table-column prop="createOrderTime" label="订单时间" width="165"></el-table-column>
        <el-table-column prop="billNo" label="订单编码" width="150"></el-table-column>
        <el-table-column prop="productType" label="产品类型">
          <template slot-scope="scope">{{ productType.has(scope.row.productType) ? productType.get(scope.row.productType).label : '' }}</template>
        </el-table-column>
        <el-table-column label="授权产品">
          <template slot-scope="scope">{{ `${scope.row.productCode ? '[' + scope.row.productCode + ']' : ''}${scope.row.productName || ''}` }}</template>
        </el-table-column>
        <el-table-column prop="inventoryAmount" label="消耗库存" align="right"></el-table-column>
        <el-table-column label="订单状态">
          <template slot-scope="scope">{{ orderStatus.has(scope.row.orderStatus) ? orderStatus.get(scope.row.orderStatus).label : '--' }}</template>
        </el-table-column>
        <el-table-column prop="handManName" label="受理人"></el-table-column>
        <el-table-column prop="createUserName" label="下单人"></el-table-column>
        <el-table-column label="操作" fixed="right" width="110">
          <template slot-scope="scope">
            <template v-if="[0, 5].includes(scope.row.orderStatus)">
              <el-button v-permission="'SOFTWARE_AUTHORIZATION_EDIT'" type="text" size="small" @click="handleToDetail({ status: 'edit' }, scope.row)">编辑</el-button>
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
import { mapActions } from 'vuex'
import { productType, orderStatus } from './data'

import { queryAgentAllUser } from '@/api/orderCenter/orderManagement'
import {
  queryByPage,
  authOrderExport,
  authOrderExportLog,
  authOrderExportDel,
  authOrderProductPage,
  authOrderDelete
} from '@/api/orderCenter/orderManagement/softwareAuthorization'

export default {
  name: 'softwareAuthorization',
  data() {
    return {
      productType,
      orderStatus,
      licensedProducts: [],
      isLicensedProductMaxPage: false,
      form: { createTime: '', productType: '', productCodes: [], orderStatus: '', createUser: '', billNo: '' },
      ordererData: [],
      isOrdererMaxPage: false,
      checkTabLock: false,
      tableData: [],
      currentPage: 1,
      totalPage: 0,
      pageSize: 10,
      checkExportLoad: false,
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
      vm.getQueryPage()
    })
  },
  mounted() {
    const StartTime = dayjs().subtract(7, 'days')
    this.form.createTime = [StartTime.format('YYYY-MM-DD 00:00:00'), dayjs().format('YYYY-MM-DD 23:59:59')]
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
    async handleDelRow(row) {
      try {
        await authOrderDelete(row.id)
        if (!--this.tableData.length) this.currentPage = Math.ceil((this.totalPage - 1) / this.pageSize) || 1
        this.getQueryPage()
      } catch (error) {}
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
      return await authOrderExportDel({ id: row.id })
    },
    async handleOrderPage({ query = '', page = 1, rows = 10 } = {}) {
      try {
        const res = await queryAgentAllUser({ agentId: this.userInfo.agentId, page, rows, userName: query })
        this.ordererData = this.ordererData.concat(res.results || [])
        this.isOrdererMaxPage = !res.results || (res.results && res.results.length < 10)
      } catch (error) {}
    },
    handleProductTypeChange() {
      this.licensedProducts = []
      this.form.productCodes = []
      this.$refs.productCode.selectVal = ''
      this.getProductByPage()
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
</style>
