<template>
  <div>
    <div class="search-box">
      <el-row>
        <el-col :span="20">
          <el-form :inline="true" size="small" :model="form" label-width="85px" class="xdd-btn-block__w240">
            <el-form-item label="产品:">
              <el-select clearable class="address-select" filterable placeholder="全部" size="small" style="width: 100%" v-model="form.productCode">
                <el-option :key="index" :label="item.name" :value="item.code" v-for="(item, index) in allProductList"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="库存状态:">
              <el-select clearable class="address-select" placeholder="全部" size="small" style="width: 100%" v-model="form.inventoryType">
                <el-option :key="index" :label="item.name" :value="item.id" v-for="(item, index) in inventoryTypeList"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleCurrentChange(1)">查询</el-button>
            </el-form-item>
            <el-form-item>
              <el-button v-permission="'SOFTWARE_STOCK_EXPORT'" @click="handleExport()" :loading="exportLoad">导出</el-button>
              <km-export-view v-permission="'SOFTWARE_STOCK_EXPORT'" :request-export-log="handleExportRecord" :request-export-del="handleExportDel" />
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
    <div class="data-box">
      <tableSummary :value.sync="tableSummaryObj"></tableSummary>
      <el-table row-key="id" :data="tableList" style="width: 100%" @sort-change="handleTabSort" v-loading="tableLoading" ref="table">
        <el-table-column prop="productName" label="产品">
          <template slot-scope="scope">
            <span>{{ '[' + scope.row.productCode + ']' + scope.row.productName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="totalAmount" label="总库存" sortable="custom" align="right">
          <template slot="header">
            <span class="table-tr-design">
              <span style="margin-right: 5px">总库存</span>
              <el-tooltip :hide-after="0" class="item" content="" effect="light" placement="top">
                <span slot="content" style="font-size: 14px"> 通用库存+项目库存 </span>
                <i class="el-icon-warning-outline tooltip-icon"></i>
              </el-tooltip>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="commonAmount" label="通用库存" sortable="custom" align="right"></el-table-column>
        <el-table-column prop="projectAmount" label="项目库存" sortable="custom" align="right"></el-table-column>
        <el-table-column prop="limitAmount" label="限期库存" sortable="custom" align="right">
          <template slot="header">
            <span class="table-tr-design">
              <span style="margin-right: 5px">限期库存</span>
              <el-tooltip :hide-after="0" class="item" content="" effect="light" placement="top">
                <span slot="content" style="font-size: 14px"> 通用库存、项目库存中有限期的库存 </span>
                <i class="el-icon-warning-outline tooltip-icon"></i>
              </el-tooltip>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140">
          <template slot-scope="scope">
            <el-button @click="detail(scope.row)" type="text" size="small" v-permission="'XDD_ACCMANAGEMENT_SOFTSTOCK_QUERY_DETILE'">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div v-show="tableTotal > 0" class="km-page-block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="thisPage"
          :page-sizes="[10, 30, 50]"
          :page-size.sync="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tableTotal"></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import tableSummary from '@/components/table/tableSummary' // 表格上的汇总
import { getInventoryAndSummary } from '@/api/accountManagement/softStockQuery'
import { productQueryByPage } from '@/api/product'
import { xftArchiveExportLog, xftArchiveExportDel, xftArchiveExport } from '@/api/xftArchive'
import { mapActions } from 'vuex'
export default {
  name: 'querySoftStock',
  components: { tableSummary },
  data() {
    return {
      inventoryTypeList: [
        { id: 1, name: '有通用库存' },
        { id: 2, name: '有项目库存' },
        { id: 3, name: '有限期库存' }
      ],
      tableLoading: false,
      tableList: [], // 表格数据
      tableTotal: 0, // 表格总页数
      thisPage: 1, // 当前页
      pageSize: 10, // 每页多少条
      // 原产品列表
      allProductList: [],
      tableSummaryObj: {
        allTotalAmount: { label: '总库存', value: '', formatNumber: true },
        commonTotalAmount: { label: '通用库存', value: '', formatNumber: true },
        projectTotalAmount: { label: '项目库存', value: '', formatNumber: true },
        limitTotalAmount: { label: '限期库存', value: '', formatNumber: true }
      }, // 表格汇总数据
      form: {
        orders: {},
        inventoryType: '',
        productCode: ''
      },
      exportLoad: false
    }
  },
  computed: {
    exportQueryParams() {
      return { productCode: this.form.productCode, inventoryType: this.form.inventoryType }
    }
  },
  created() {
    this.getAllProductList()
    this.handleCurrentChange(1)
  },
  methods: {
    ...mapActions(['delCachedView']),
    // 新页签打开“软件库存变动流水”，自动填充过滤条件：截止日期、经销商、产品
    detail(row) {
      const { productCode, productName, agentId } = row
      this.delCachedView({ name: 'softStockChangeHistory' }).then(() => {
        this.$router.push({
          name: 'softStockChangeHistory',
          query: {
            productCode,
            productName,
            agentId
          }
        })
      })
    },
    handleTabSort({ prop, order }) {
      this.form.orders = { [prop]: order ? order.substring(0, order.indexOf('ending')) : '' }
      this.getPageList()
    },
    // 获取所有产品列表
    async getAllProductList() {
      let data = {
        page: 1,
        rows: 500,
        // isOnSale: '1',
        type: '1',
        notProductTypeList: [99]
        // productTypeList: [1, 2]
      }
      try {
        const res = await productQueryByPage(data)
        this.allProductList = res.results
      } catch (error) {}
    },
    // 分页
    handleSizeChange(val) {
      this.thisPage = 1
      this.pageSize = val
      this.getPageList()
    },
    // 分页
    handleCurrentChange(val) {
      this.thisPage = val
      this.getPageList()
    },
    async getPageList() {
      try {
        this.tableLoading = true
        let subData = {
          orders: this.form.orders,
          productCode: this.form.productCode,
          inventoryType: this.form.inventoryType
        }
        const res = await getInventoryAndSummary({ ...subData, page: this.thisPage, rows: this.pageSize })
        this.detailCount(res)
        this.tableList = res.results || []
        this.tableTotal = res.totalCount || 0
      } finally {
        this.tableLoading = false
      }
    },
    // 表单汇总
    async detailCount(res) {
      if (res) {
        const keys = Object.keys(this.tableSummaryObj)
        keys.map(item => {
          this.tableSummaryObj[item].value = res[item] || 0
        })
      }
    },
    //处理导出
    async handleExport() {
      this.exportLoad = true
      try {
        this.$message({ type: 'success', message: '数据文件生成中，请稍后在导出记录中下载' })
        await xftArchiveExport({ menu: this.$route.meta.title, params: this.handleQueryParams() })
      } catch (error) {
      } finally {
        this.exportLoad = false
      }
    },
    async handleExportRecord({ currentPage, pageSize } = { currentPage: 1, pageSize: 10 }) {
      const data = { exportType: 1, page: currentPage, rows: pageSize }
      return await xftArchiveExportLog(data)
    },
    async handleExportDel(row) {
      return await xftArchiveExportDel({ id: row.id })
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
