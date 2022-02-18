<template>
  <div>
    <div class="search-box">
      <el-row>
        <el-col :span="20">
          <el-form :inline="true" size="small" :model="form" label-width="85px" class="xdd-btn-block__w240">
            <el-form-item label="业务类型:">
              <el-select clearable class="address-select" multiple collapse-tags filterable placeholder="请选择" size="small" style="width:100%" v-model="form.typeList">
                <el-option :key="item.id" :label="item.name" :value="item.id" v-for="item in businessTypeList"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="订单信息:">
              <el-input v-model.trim="form.billNo" maxlength='16' size="small" placeholder="请输入订单编码" clearable></el-input>
            </el-form-item>
            <el-form-item label="业务日期:">
              <el-date-picker v-model="form.createStartTime" type="date" placeholder="选择日期" value-format="yyyy-MM-dd 00:00:00"></el-date-picker>
              <span style="padding: 0 2px">—</span>
              <el-date-picker v-model="form.createEndTime" type="date" placeholder="选择日期" value-format="yyyy-MM-dd 23:59:59"></el-date-picker>
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
        <el-table-column prop="createTime" label="业务时间"></el-table-column>
        <el-table-column prop="businessTypeName" label="业务类型"></el-table-column>
        <el-table-column prop="changeMoney" label="变动余额" align='right'>
          <template slot-scope="scope">
            <div>{{ scope.row.changeMoney | toFixedFilter }}</div>
            <div v-if="scope.row.changeMoneyGift">赠金{{ scope.row.changeMoneyGift | toFixedFilter }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="paperMoney" label="账面余额" align='right'>
          <template slot-scope="scope">
            <div>{{ scope.row.paperMoney | toFixedFilter }}</div>
            <div v-if="scope.row.paperMoneyGift">赠金{{ scope.row.paperMoneyGift | toFixedFilter }}</div>
          </template>
        </el-table-column>
        <el-table-column label="变动担保金" align='right'>
          <template slot-scope="scope">{{ scope.row.changeGuaranteeMoney | toFixedFilter }}</template>
        </el-table-column>
        <el-table-column label="未核销担保金" align='right'>
          <template slot-scope="scope">{{ scope.row.noQualityGuaranteeMoney | toFixedFilter }}</template>
        </el-table-column>
        <el-table-column prop="currentMoney" label="可用金额" align='right'>
          <template slot-scope="scope">
            <div>{{ scope.row.currentMoney | toFixedFilter }}</div>
            <div v-if="scope.row.currentMoneyGift">赠金{{ scope.row.currentMoneyGift | toFixedFilter}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
        <el-table-column prop="billNo" label="订单编码" width="170"></el-table-column>
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
import { changePage, changeSumPage } from '@/api/accountManagement/accountQuery'
import { formatAmountDivide } from '@/filters'
export default {
  name: 'amountHistory',
  components: { tableSummary },
  data () {
    return {
      tableLoading: false,
      tableList: [], // 表格数据
      tableTotal: 0, // 表格总页数
      thisPage: 1, // 当前页
      pageSize: 10, // 每页多少条
      // 原产品列表
      businessTypeList: [
        { id: 1, name: '初始化' },
        { id: 2, name: '收款单' },
        { id: 3, name: '采购扣款' },
        { id: 4, name: '手工调整' },
        { id: 5, name: '活动过期' },
        { id: 6, name: '担保单变动' },
        { id: 8, name: '需求开发' },
        { id: 9, name: '软件升级' }
      ],
      tableSummaryObj: {
        increaseMoney: { label: '增加本金', value: '', formatNumber: true, toFixed: 2 },
        decreaseMoney: { label: '减少本金', value: '', formatNumber: true, toFixed: 2 },
        increaseGiftMoney: { label: '增加赠金', value: '', formatNumber: true, toFixed: 2 },
        decreaseGiftMoney: { label: '减少赠金', value: '', formatNumber: true, toFixed: 2 },
        useGuaranteeMoney: { label: '使用担保金', value: '', formatNumber: true, toFixed: 2 },
        verifyMoney: { label: '核销担保金', value: '', formatNumber: true, toFixed: 2 }
      }, // 表格汇总数据
      form: {
        typeList: [],
        billNo: '',
        createStartTime: dayjs((new Date()).getTime()).subtract(60, 'days').format('YYYY-MM-DD 00:00:00'),
        createEndTime: dayjs((new Date()).getTime()).format('YYYY-MM-DD 23:59:59')
      }
    }
  },
  created () {
    this.handleCurrentChange(1)
  },
  methods: {
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
          typeList: this.form.typeList,
          billNo: this.form.billNo,
          createStartTime: this.form.createStartTime || '',
          createEndTime: this.form.createEndTime || '',
        }
        this.detailCount(subData)
        const res = await changePage({
          ...subData,
          page: this.thisPage,
          rows: this.pageSize
        })
        this.tableList = res.results
        this.tableTotal = res.totalCount
      } finally {
        this.tableLoading = false
      }
    },
    // 表单汇总
    async detailCount (subData) {
      const res = (await changeSumPage(subData)) || {}
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