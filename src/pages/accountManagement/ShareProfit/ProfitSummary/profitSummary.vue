<template>
  <section>
    <div class="search-box">
      <el-form size="small" :model="form" :inline="true" label-suffix=":" label-width="80px" @submit.native.prevent>
        <el-form-item label="结算月份">
          <el-date-picker
            v-model="form.billingMonth"
            type="monthrange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始月份"
            end-placeholder="结束月份"
            clearable></el-date-picker>
        </el-form-item>
        <el-form-item label="分润状态">
          <el-select v-model="form.benefitStatusList" placeholder="全部" clearable>
            <el-option v-for="(item, index) in benefitStatusData" :key="index" :label="item.value" :value="item.key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="handleSearch">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="data-box" v-loading="checkTabLock">
      <div class="e-profit-tips">
        <div class="e-profit-tips_step">
          有数分润按月结算： <br />①每月15日科脉开放上月分润账单。<br />
          ②科脉伙伴确认无误后向甲方提供对应分润金额6%的增值税专用发票，并在平台填写发票信息和发票邮寄信息。<br />
          ③科脉于每月30日截止收票并进行审核，逾期收到的发票进入下一个结算周期。<br />
          ④审核无误后科脉于次月15日完成付款
        </div>
        <p>科脉伙伴应及时结算分润，如长达6个月未结算则视为放弃分润权利，科脉不再追溯结算。</p>
      </div>
      <el-table :data="tableData">
        <el-table-column label="结算月份" prop="benefitTimeFormat" width="100"></el-table-column>
        <el-table-column label="经销商">
          <template slot-scope="scope">{{ `${scope.row.agentId ? '[' + scope.row.agentId + ']' : ''}${scope.row.agentName || ''}` }}</template>
        </el-table-column>
        <el-table-column label="结算状态" width="110">
          <template slot-scope="scope">
            <template v-if="scope.row.benefitStatus === 25"><span>待商务确认</span><span style="color: #ff0000">（被退回）</span></template>
            <span v-else>{{ scope.row.benefitStatusName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="行业" prop="industryName" width="110" align="center"></el-table-column>
        <el-table-column label="订单总金额" prop="orderAmountFormat" align="right"></el-table-column>
        <el-table-column label="分润总金额" prop="benefitTotalFormat" align="right"></el-table-column>
        <el-table-column label="发票号" prop="invoiceNo"></el-table-column>
        <el-table-column label="快递号" prop="trackingNo"></el-table-column>
        <el-table-column label="受理人" prop="handlerUserName"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <template v-if="scope.row.benefitStatus === 10">
              <el-button type="text" size="small" v-permission="'SHAREPROFIT_PROFITSUMMARY_CONFIRM'" @click="handleToConfirm(scope.row)">确认</el-button>
            </template>
            <el-button type="text" size="small" @click="handleToDetail(scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <km-pagination :request="getQueryPage" :current-page.sync="currentPage" :page-size.sync="pageSize" :total="totalPage" />
    </div>
    <el-dialog title="确认" width="500px" :visible.sync="checkProfitVisible">
      <el-form ref="profitForm" :model="profitForm" size="small" label-suffix=":" label-width="70px">
        <el-form-item label="发票号" prop="invoiceNo" :rules="{ required: true, message: '请输入发票号', trigger: ['blur', 'change'] }">
          <el-input v-model="profitForm.invoiceNo" clearable style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="快递号" prop="trackingNo" :rules="{ required: true, message: '请输入快递号', trigger: ['blur', 'change'] }">
          <el-input v-model="profitForm.trackingNo" clearable style="width: 100%"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button size="small" @click="checkProfitVisible = false">取消</el-button>
        <el-button size="small" type="primary" :loading="isProfitLoad" @click="handleProfit">确定</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import dayjs from 'dayjs'
import { queryBenefitSummaryPage, updateBenefitThirdInfo } from '@/api/accountManagement/shareProfit/profitSummary'
import { getBenefitStatusMap } from '@/api/accountManagement/shareProfit/profitDetail'

export default {
  data() {
    return {
      benefitStatusData: [],
      form: { benefitStatus: '', billingMonth: '' },
      checkProfitVisible: false,
      profitForm: { benefitCountOrder: '', invoiceNo: '', trackingNo: '' },
      isProfitLoad: false,
      checkTabLock: false,
      tableData: [],
      currentPage: 1,
      totalPage: 0,
      pageSize: 10,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > dayjs().endOf('month').valueOf() || time.getTime() < dayjs().endOf('month').subtract(6, 'month').endOf('month').valueOf()
        }
      }
    }
  },
  created() {
    this.getBenefitStatusMap()
    const StartTime = dayjs().subtract(30, 'days')
    this.form.billingMonth = [StartTime.format('YYYY-MM-DD 00:00:00'), dayjs().endOf('day').format('YYYY-MM-DD HH:mm:ss')]
  },
  mounted() {
    this.getQueryPage()
  },
  methods: {
    handleProfit() {
      this.$refs.profitForm.validate(async valid => {
        if (valid) {
          try {
            this.isProfitLoad = true
            const { id, benefitCountOrder, invoiceNo, trackingNo } = this.profitForm
            await updateBenefitThirdInfo({ id, benefitCountOrder, invoiceNo, trackingNo })
            this.$refs.profitForm.clearValidate()
            this.getQueryPage()
            this.checkProfitVisible = false
          } catch (error) {
          } finally {
            this.isProfitLoad = false
          }
        }
      })
    },
    handleToConfirm(row) {
      this.profitForm = { id: row.id, benefitCountOrder: row.benefitCountOrder, invoiceNo: '', trackingNo: '' }
      this.checkProfitVisible = true
    },
    handleToDetail(row) {
      this.$router.push({ name: 'profitDetail', query: { billingMonth: row.benefitTimeFormat, benefitCountOrder: row.benefitCountOrder } })
    },
    handleQueryParams() {
      const { billingMonth, benefitStatusList, ...params } = this.form
      return Object.assign(params, {
        benefitStatusList: benefitStatusList || [],
        overMinDate: billingMonth && billingMonth[0] ? dayjs(billingMonth[0]).startOf('month').format('YYYY-MM-DD HH:mm:ss') : '',
        overMaxDate: billingMonth && billingMonth[1] ? dayjs(billingMonth[1]).endOf('month').format('YYYY-MM-DD HH:mm:ss') : '',
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
        const res = await queryBenefitSummaryPage(this.handleQueryParams())
        this.tableData = res.results || []
        this.totalPage = res.totalCount || 0
      } catch (error) {
      } finally {
        this.checkTabLock = false
      }
    },
    async getBenefitStatusMap() {
      const res = await getBenefitStatusMap().catch()
      if (res.length > 0) this.benefitStatusData = res.filter(item => item.key.toString() !== [0].toString())
    }
  }
}
</script>

<style lang="scss">
.e-profit-tips {
  padding: 10px 20px;
  background: rgb(229, 237, 253);
  border: 1px solid rgb(166, 196, 254);
  margin-bottom: 20px;
  color: rgb(61, 73, 102);
  font-size: 14px;
  height: auto;
  &_step {
    line-height: 25px;
    margin-bottom: 20px;
  }
}
</style>
