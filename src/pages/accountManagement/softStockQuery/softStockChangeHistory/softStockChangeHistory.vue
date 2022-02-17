<template>
  <div>
    <div class="search-box">
      <el-row>
        <el-col :span="20">
          <el-form :inline="true" size="small" :model="form" label-width="85px" class="xdd-btn-block__w240">
            <el-form-item label="产品: ">
              <km-select-page multiple ref="productCodes" v-model="form.productCode" option-label="name" option-value="code" placeholder="全部" :data.sync="licensedProductData" :request="getProductByPage" :is-max-page.sync="isLicensedProductMaxPage" />
            </el-form-item>
            <el-form-item label="业务类型:">
              <el-select clearable class="address-select" multiple collapse-tags filterable placeholder="全部" size="small" style="width:100%" v-model="form.businessTypeList">
                <el-option :key="item.id" :label="item.name" :value="item.id" v-for="item in businessTypeList"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="业务日期:">
              <el-date-picker v-model="form.orderTime" :picker-options="pickerOptions" type="daterange" range-separator="至" start-placeholder="开始日期" value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']" end-placeholder="结束日期"></el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleCurrentChange(1)">查询</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
    <div class="data-box">
      <tableSummary :value.sync="tableSummaryObj"></tableSummary>
      <el-table row-key="id" :data="tableList" style="width: 100%" v-loading="tableLoading" ref="table">
        <el-table-column prop="organNo" label="产品">
          <template slot-scope="scope">
            <span>{{ '[' + scope.row.productCode + ']' + scope.row.productName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="agentName" label="业务类型">
          <template slot-scope="scope">
            <span>{{ getBusinessType(scope.row.businessType) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="changeAmount" label="变动库存" align="right" width="98px">
          <template slot="header">
            <div class="table-tr-design">
              <span style="margin-right: 5px">变动库存</span>
              <el-tooltip :hide-after="0" class="item" content="" effect="light" placement="top">
                <div slot="content" style="font-size: 14px">
                  变动通用库存+变动项目库存
                </div>
                <i class="el-icon-warning-outline tooltip-icon"></i>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="afterTotalAmount" label="期末库存" align="right" width="98px">
          <template slot="header">
            <div class="table-tr-design">
              <span style="margin-right: 5px">期末库存</span>
              <el-tooltip :hide-after="0" class="item" content="" effect="light" placement="top">
                <div slot="content" style="font-size: 14px">
                  期末通用库存+期末项目库存
                </div>
                <i class="el-icon-warning-outline tooltip-icon"></i>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="checkTime" label="业务时间" width="100px"></el-table-column>
        <el-table-column prop="checkPersonName" label="受理人"></el-table-column>
        <el-table-column prop="documentNumber" label="订单编码" width="160"></el-table-column>
        <el-table-column prop="changeAmount" label="变动项目库存" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.inventoryType === 2 ? scope.row.changeAmount : '0' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="afterProjectAmount" label="期末项目库存" align="right"></el-table-column>
        <el-table-column prop="changeAmount" label="变动限期库存" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.isLimit === 3 ? scope.row.changeAmount : '0' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="afterLimitAmount" label="期末限期库存" align="right"></el-table-column>
        <el-table-column prop="expireTime" label="限期库存有效期" width="130px">
          <template slot-scope="scope">
            <span>{{ scope.row.expireTime === '1970-01-01 00:00:00' ? '--' : scope.row.expireTime.split(' ')[0] }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div v-show="tableTotal > 0" class="km-page-block">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="thisPage" :page-sizes="[10, 30, 50]" :page-size.sync="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="tableTotal"></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import dayjs from 'dayjs'
import tableSummary from '@/components/table/tableSummary' // 表格上的汇总
import { productQueryByPage } from '@/api/product'
import { getInventoryWaterAndSummary } from '@/api/accountManagement/softStockQuery'
export default {
  name: 'softStockChangeHistory',
  components: { tableSummary },
  data () {
    return {
      licensedProductData: [],
      isLicensedProductMaxPage: false,
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > dayjs().endOf('day')
        }
      },
      tableLoading: false,
      tableList: [], // 表格数据
      tableTotal: 0, // 表格总页数
      thisPage: 1, // 当前页
      pageSize: 10, // 每页多少条
      businessTypeList: [
        {
          id: 1,
          name: '软件采购'
        }, {
          id: 2,
          name: '软件升级'
        }, {
          id: 3,
          name: '需求开发'
        }, {
          id: 4,
          name: '业绩调整'
        }
      ],
      tableSummaryObj: {
        commonAmountIncrease: { label: '期间增加通用库存', value: '', formatNumber: true },
        commonAmountDecrease: { label: '期间减少通用库存', value: '', formatNumber: true },
        projectAmountIncrease: { label: '期间增加项目库存', value: '', formatNumber: true },
        projectAmountDecrease: { label: '期间减少项目库存', value: '', formatNumber: true },
        limitAmountIncrease: { label: '期间增加限期库存', value: '', formatNumber: true },
        limitAmountDecrease: { label: '期间减少限期库存', value: '', formatNumber: true }
      }, // 表格汇总数据
      form: {
        orderTime: [],
        productCode: [],
        businessTypeList: []
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    next((vm) => {
      // 通过 `vm` 访问组件实例
      // 当从软件库存查询页面跳转过来时，将跳转的只赋值 再去请求列表
      const { productCode, productName } = vm.$route.query
      if (productCode) {
        vm.form.productCode = [productCode]
        vm.form.orderTime = []
        vm.getProductByPage({ query: productName, page: 1, row: 10 })
      } else {
        vm.form.orderTime = [dayjs((new Date()).getTime()).subtract(60, 'days').format('YYYY-MM-DD 00:00:00'), dayjs((new Date()).getTime()).format('YYYY-MM-DD 23:59:59')]
      }
      vm.handleCurrentChange(1)
    })
  },
  methods: {
    getBusinessType (value) {
      if (value) {
        let res = this.businessTypeList.filter(item => value === item.id)
        return res.length ? res[0].name : '--'
      } else {
        return '--'
      }
    },
    // 分页
    handleSizeChange (val) {
      this.thisPage = 1
      this.pageSize = val
      this.getPageList()
    },
    // 分页
    handleCurrentChange (val) {
      this.thisPage = val
      this.getPageList()
    },
    async getPageList () {
      try {
        this.tableLoading = true
        let subData = {
          productCodeList: this.form.productCode,
          businessTypeList: this.form.businessTypeList
        }
        if (this.form.orderTime && this.form.orderTime.length) {
          subData.startTime = this.form.orderTime[0]
          subData.endTime = this.form.orderTime[1]
        }
        const res = await getInventoryWaterAndSummary({
          ...subData,
          page: this.thisPage,
          rows: this.pageSize
        })
        this.detailCount(res)
        this.tableList = res.results
        this.tableTotal = res.totalCount
      } finally {
        this.tableLoading = false
      }
    },
    async getProductByPage ({ query = '', page = 1, row = 10 } = {}) {
      try {
        // productIndustry: this.form.industry, productTypeList: this.form.productType === '' ? [] : [this.form.productType]
        const res = await productQueryByPage({ info: query, page, row, })
        this.licensedProductData = this.licensedProductData.concat(res.results || [])
        this.isLicensedProductMaxPage = !res.results || (res.results && res.results.length < 10)
      } catch (error) { }
    },
    // 表单汇总
    async detailCount (res) {
      const keys = Object.keys(this.tableSummaryObj)
      keys.map(item => {
        this.tableSummaryObj[item].value = res[item] || 0
      })
    },
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