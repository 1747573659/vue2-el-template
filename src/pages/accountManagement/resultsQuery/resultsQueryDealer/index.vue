<template>
  <div>
    <div class="search-box">
      <el-row>
        <el-col :span="20">
          <el-form :inline="true" size="small" :model="form" label-width="85px" class="xdd-btn-block__w240">
            <el-form-item label="订单日期:">
              <el-date-picker v-model="form.orderTime" :picker-options="pickerOptions" type="daterange" range-separator="至" start-placeholder="开始日期" value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']" end-placeholder="结束日期"></el-date-picker>
            </el-form-item>
            <el-form-item label="行业:">
              <el-select multiple clearable placeholder="全部" @change="industryChange" size="small" style="width:100%" v-model="form.industry">
                <el-option :key="index" :label="item.name" :value="item.id" v-for="(item,index) in industryList"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="产品类型: ">
              <el-select @change="productTypeChange" clearable placeholder="全部" size="small" style="width: 100%" v-model="form.productType">
                <el-option :key="item.id" :label="item.name" :value="item.id" v-for="item in productTypeList"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="产品: ">
              <km-select-page multiple ref="productCodes" v-model="form.productCode" option-label="name" option-value="code" placeholder="全部" :data.sync="licensedProductData" :request="getProductByPage" :is-max-page.sync="isLicensedProductMaxPage" />
            </el-form-item>
            <el-form-item label="业务类型:">
              <el-select clearable class="address-select" collapse-tags filterable placeholder="全部" size="small" style="width:100%" v-model="form.businessType">
                <el-option :key="item.id" :label="item.name" :value="item.id" v-for="item in businessTypeList"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="使用返利: ">
              <el-select clearable placeholder="全部" size="small" style="width: 100%" v-model="form.useRebate">
                <el-option label="是" :value="1"></el-option>
                <el-option label="否" :value="0"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="订单编码:">
              <el-input v-model.trim="form.billNo" maxlength='16' size="small" placeholder="请输入订单编码" clearable></el-input>
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
        <el-table-column prop="orderTime" width='110' label="订单日期"></el-table-column>
        <el-table-column prop="month" label="月份" width='80' align='right'></el-table-column>
        <el-table-column prop="quarter" label="季度" width='80' align='right'></el-table-column>
        <el-table-column prop="channelManangerName" label="渠道经理" width='100'></el-table-column>
        <el-table-column prop="industryName" label="行业" width='100'></el-table-column>
        <el-table-column prop="productCode" label="产品">
          <template slot-scope="scope">
            <div>{{ `${scope.row.productCode ? '[' + scope.row.productCode + ']' : ''}${scope.row.productName || ''}` }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="businessTypeName" label="业务类型" width='120'></el-table-column>
        <el-table-column prop="num" label="数量" width='140' align='right'>
          <template slot-scope="scope">
            <div>{{scope.row.num |formatNumberFilter}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="unitPrice" label="单价" width='140' align='right'>
          <template slot-scope="scope">
            <div>{{scope.row.unitPrice |toFixedFilter}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="orderAmount" label="订单金额" width='140' align='right'>
          <template slot-scope="scope">
            <div>{{scope.row.orderAmount|toFixedFilter}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="performanceAmount" label="业绩" width='140' align='right'>
          <template slot-scope="scope">
            <div>{{scope.row.performanceAmount|toFixedFilter}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="originAmount" label="本金" width='140' align='right'>
          <template slot-scope="scope">
            <div>{{scope.row.originAmount |toFixedFilter}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="bonusAmount" label="使用赠金" width='140' align='right'>
          <template slot-scope="scope">
            <div>{{scope.row.bonusAmount|toFixedFilter}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="useRebate" label="使用返利" width='100'>
          <template slot-scope="scope">
            <div>{{scope.row.useRebate==1?'是':'否'}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="depositAmount" label="使用担保金" width='140' align='right'>
          <template slot-scope="scope">
            <div>{{scope.row.depositAmount |toFixedFilter}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="depositName" label="担保人" width='120'></el-table-column>
        <el-table-column prop="couponName" label="订单优惠活动"></el-table-column>
        <el-table-column prop="billNo" label="订单编码" width='160'></el-table-column>
        <el-table-column prop="deductionOriginAmount" label="扣款后本额" width='140' align='right'>
          <template slot-scope="scope">
            <div>{{scope.row.deductionOriginAmount|toFixedFilter}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="deductionBonusAmount" label="扣款后赠金" width='140' align='right'>
          <template slot-scope="scope">
            <div>{{scope.row.deductionBonusAmount |toFixedFilter}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="noWriteAmount" label="未核销金额" width='140' align='right'>
          <template slot-scope="scope">
            <div>{{scope.row.noWriteAmount |toFixedFilter}}</div>
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
import { detailPage, detailCount } from '@/api/accountManagement/resultsQuery'
import { productQueryByPage, productQueryTypeList } from '@/api/product'
import { formatAmountDivide } from '@/filters'
export default {
  name: 'resultsQueryDealer',
  components: { tableSummary },
  data () {
    return {
      licensedProductData: [],
      isLicensedProductMaxPage: false,
      industryList: [{
        id: 1,
        name: '零售'
      }, {
        id: 2,
        name: '餐饮'
      }, {
        id: 3,
        name: '专卖'
      }, {
        id: 99,
        name: '硬件'
      }],
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
        performanceAmount: { label: '完成业绩', value: '', formatNumber: true, toFixed: 2 },
        originAmount: { label: '本金', value: '', formatNumber: true, toFixed: 2 },
        depositAmount: { label: '使用担保金', value: '', formatNumber: true, toFixed: 2 },
        performanceAdjustmentAmount: { label: '业绩调整', value: '', formatNumber: true, toFixed: 2 }
      }, // 表格汇总数据
      productTypeList: [],
      form: {
        orderTime: [dayjs((new Date()).getTime()).subtract(60, 'days').format('YYYY-MM-DD 00:00:00'), dayjs((new Date()).getTime()).format('YYYY-MM-DD 23:59:59')],
        industry: [],
        productType: '',
        productCode: [],
        businessType: '',
        useRebate: '',
        billNo: ''
      }
    }
  },
  created () {
    this.handleCurrentChange(1)
    this.queryTypeList()
  },
  methods: {
    productTypeChange () {
      this.form.productCode = []
      this.$refs.productCodes.selectVal = []
      this.licensedProductData = []
      this.isLicensedProductMaxPage = false
    },
    industryChange () {
      this.form.productCode = []
      this.$refs.productCodes.selectVal = []
      this.licensedProductData = []
      this.isLicensedProductMaxPage = false
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
          industrys: this.form.industry,
          productType: this.form.productType,
          productCodes: this.form.productCode,
          businessType: this.form.businessType,
          useRebate: this.form.useRebate,
          billNo: this.form.billNo
        }
        if (this.form.orderTime && this.form.orderTime.length) {
          subData.startOrderTime = this.form.orderTime[0]
          subData.endOrderTime = this.form.orderTime[1]
        }
        this.detailCount(subData)
        const res = await detailPage({
          ...subData,
          page: this.thisPage,
          rows: this.pageSize
        })
        this.tableList = res.results || []
        this.tableTotal = res.totalCount
      } finally {
        this.tableLoading = false
      }
    },
    async queryTypeList () {
      try {
        let res = await productQueryTypeList()
        this.productTypeList = []
        res.map((item) => {
          if (![6, 7].includes(item.id)) {
            this.productTypeList.push(item)
          }
        })
      } catch (error) { }
    },
    async getProductByPage ({ query = '', page = 1, row = 10 } = {}) {
      try {
        const res = await productQueryByPage({ info: query, page, row, productIndustryList: this.form.industry, productTypeList: this.form.productType === '' ? [] : [this.form.productType] })
        this.licensedProductData = this.licensedProductData.concat(res.results || [])
        this.isLicensedProductMaxPage = !res.results || (res.results && res.results.length < 10)
      } catch (error) { }
    },
    // 表单汇总
    async detailCount (subData) {
      const res = (await detailCount(subData)) || {}
      const keys = Object.keys(this.tableSummaryObj)
      keys.map(item => {
        this.tableSummaryObj[item].value = formatAmountDivide(res[item]) || 0
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