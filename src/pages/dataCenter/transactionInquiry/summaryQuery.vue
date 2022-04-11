<template>
  <div class="app-container">
    <div class="action-box">
      <el-form :model="formData" @submit.native.prevent label-suffix=":" label-width="110px" size="small">
        <el-row>
          <el-col :span="24">
            <el-form-item label="交易时间">
              <el-date-picker
                :clearable="false"
                :picker-options="pickerOptions"
                placeholder="交易时间"
                type="date"
                v-model="formData.startDate"
                value-format="yyyy-MM-dd"></el-date-picker>
              <el-time-picker :clearable="false" format="HH:mm" v-model="formData.startTime" value-format="HH:mm"></el-time-picker>
              <span style="margin: 0 8px">至</span>
              <el-date-picker
                :clearable="false"
                :picker-options="pickerOptions"
                placeholder="交易时间"
                type="date"
                v-model="formData.endDate"
                value-format="yyyy-MM-dd"></el-date-picker>
              <el-time-picker :clearable="false" format="HH:mm" v-model="formData.endTime" value-format="HH:mm"></el-time-picker>
              <el-button :disabled="isSubtract" @click="setSearchTime('subtract')" class="pure-btn_space" size="small" type="default">前一天</el-button>
              <el-button :disabled="isAdd" @click="setSearchTime('add')" size="small" type="default">后一天</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="商户名称">
              <el-input
                @clear="shopClear"
                @focus="handleChooseDia('商户名称', '商户ID/商户名称', 1)"
                clearable
                placeholder="请选择商户"
                size="small"
                v-model="formData.businessName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="门店名称">
              <el-input
                @clear="storeClear"
                @focus="handleChooseDia('门店名称', '门店ID/门店名称', 2)"
                clearable
                placeholder="请选择门店"
                size="small"
                v-model="formData.storeName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="交易渠道">
              <el-select v-model="formData.tradingChanneCode">
                <el-option :key="item.code" :label="item.name" :value="item.code" v-for="item in tradingChannelData"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="交易类型">
              <el-select v-model="formData.tradingTypeCode">
                <el-option :key="item.code" :label="item.name" :value="item.code" v-for="item in tradingTypeData"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="支付方式">
              <el-select @change="getPaymentScenario" v-model="formData.paymentCode">
                <el-option :key="item.code" :label="item.name" :value="item.code" v-for="item in paymentData"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="支付场景">
              <el-select v-model="formData.paymentScenarioCode">
                <el-option :key="item.code" :label="item.name" :value="item.code" v-for="item in paymentScenarioData"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label-width="110px">
              <el-button :loading="searchLock" @click="handleSearch" size="small" type="primary">查询</el-button>
              <el-button @click="handleReset" plain size="small" type="primary">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <chooseDialog
        :chooseDiaTotal="chooseDiaTotal"
        :columnObj="chooseBaseData.columnObj"
        :isChooseStatus.sync="isChooseStatus"
        :searchPlaceHolder="chooseBaseData.placeHolder"
        :tabData="chooseDiaData"
        :titleName="chooseBaseData.titleName"
        @chooseList="setChooseLise"
        @search="handleChooseSearch"
        ref="choose"></chooseDialog>
    </div>
    <!-- 内容展示区域 -->
    <section class="pure-summaryCard-con" v-loading="tabLock">
      <el-row :gutter="20" style="margin-bottom: 30px">
        <el-col :span="6">
          <el-card class="pure-card" shadow="hover">
            <header class="pure-summaryCard-head">
              支付成功金额(¥)
              <el-tooltip class="item" effect="light" placement="top">
                <div class="pure-card_content" slot="content">
                  支付成功金额是扣除业务订单自身优惠后的订单净额，支付成功金额=订单金额-业务订单优惠金额，交易汇总不统计业务订单优惠金额。
                </div>
                <i class="el-icon-info" style="color: #1a92fd"></i>
              </el-tooltip>
            </header>
            <section class="pure-summaryCard-num">{{ pageData.totalAmount || 0 }}</section>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="pure-card" shadow="hover">
            <header class="pure-summaryCard-head">支付成功笔数</header>
            <section class="pure-summaryCard-num">{{ pageData.totalCount || 0 }}</section>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="pure-card" shadow="hover">
            <header class="pure-summaryCard-head">
              商家优惠金额(¥)
              <el-tooltip class="item" effect="light" placement="top">
                <div class="pure-card_content" slot="content">商家优惠包含商家自己创建的优惠券的核销，参加微信/支付宝/银联营销活动的优惠券核销金额，该部分费用由商家自己承担。</div>
                <i class="el-icon-info" style="color: #1a92fd"></i>
              </el-tooltip>
            </header>
            <section class="pure-summaryCard-num">{{ pageData.shopCouponAmount || 0 }}</section>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="pure-card" shadow="hover">
            <header class="pure-summaryCard-head">
              平台优惠金额(¥)
              <el-tooltip class="item" effect="light" placement="top">
                <div class="pure-card_content" slot="content">
                  平台优惠是指微信，支付宝，银联，银行发放给消费者的立减金，红包等，或商家预充值券，消费者付款核销的金额，这部分金额会结算给商家
                </div>
                <i class="el-icon-info" style="color: #1a92fd"></i>
              </el-tooltip>
            </header>
            <section class="pure-summaryCard-num">{{ pageData.platformCouponAmount || 0 }}</section>
          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin-bottom: 40px">
        <el-col :span="6">
          <el-card class="pure-card" shadow="hover">
            <header class="pure-summaryCard-head">
              申请退款金额(¥)
              <el-tooltip class="item" effect="light" placement="top">
                <div class="pure-card_content" slot="content">发起退款申请订单中，申请退款的金额之和</div>
                <i class="el-icon-info" style="color: #1a92fd"></i>
              </el-tooltip>
            </header>
            <section class="pure-summaryCard-num">{{ pageData.reqRefundAmount || 0 }}</section>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="pure-card" shadow="hover">
            <header class="pure-summaryCard-head">申请退款笔数</header>
            <section class="pure-summaryCard-num">{{ pageData.refundCount || 0 }}</section>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="pure-card" shadow="hover">
            <header class="pure-summaryCard-head">
              商家实退(¥)
              <el-tooltip class="item" effect="light" placement="top">
                <div class="pure-card_content" slot="content">商家实退金额=实际退还至用户银行卡或零钱账户的金额+平台优惠券退款金额（即预充值型优惠券退款金额）</div>
                <i class="el-icon-info" style="color: #1a92fd"></i>
              </el-tooltip>
            </header>
            <section class="pure-summaryCard-num">{{ pageData.refundAmount || 0 }}</section>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="pure-card" shadow="hover">
            <header class="pure-summaryCard-head">
              商家实收(¥)
              <el-tooltip class="item" effect="light" placement="top">
                <div class="pure-card_content" slot="content">商家实收=支付成功金额-商家优惠-商家实退</div>
                <i class="el-icon-info" style="color: #1a92fd"></i>
              </el-tooltip>
            </header>
            <section class="pure-summaryCard-num">{{ pageData.paymentAmout || 0 }}</section>
          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card class="pure-card" shadow="hover">
            <header class="pure-summaryCard-head">
              手续费(¥)
              <el-tooltip class="item" effect="light" placement="top">
                <div class="pure-card_content" slot="content">当日交易的手续费银行返回有延时，系统会在第三天汇总统计，请注意查询时间点</div>
                <i class="el-icon-info" style="color: #1a92fd"></i>
              </el-tooltip>
            </header>
            <section class="pure-summaryCard-num">{{ pageData.shopFeeAmount || 0 }}</section>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="pure-card" shadow="hover">
            <header class="pure-summaryCard-head">
              结算金额(¥)
              <el-tooltip class="item" effect="light" placement="top">
                <div class="pure-card_content" slot="content">结算金额=商家实收-手续费，因手续费有延迟，注意查询时间节点，部分银行分多笔划账，请汇总后核对</div>
                <i class="el-icon-info" style="color: #1a92fd"></i>
              </el-tooltip>
            </header>
            <section class="pure-summaryCard-num">{{ pageData.comeinAmount || 0 }}</section>
          </el-card>
        </el-col>
      </el-row>
    </section>
  </div>
</template>

<script>
import dayjs from 'dayjs'

import chooseDialog from './components/chooseDialog'
import { queryAllCondition, queryStorePage, queryMerchantAdminPage, queryPaySceneByType, querySummary } from '@/api/transtionManagement'

export default {
  name: 'SummaryQuery',
  data() {
    return {
      tabLock: false,
      searchLock: false,
      // 选择弹窗
      isChooseStatus: false,
      chooseBaseData: {},
      chooseDiaData: [],
      chooseDiaTotal: 0,
      chooseMerchantsList: {},
      chooseStoreList: {},
      chooseType: 1,
      chooseMerchantsObj: [
        { name: 'id', label: '商户ID' },
        { name: 'companyName', label: '商户名称' },
        { name: 'mobile', label: '手机号' }
      ],
      chooseStoreObj: [
        { name: 'id', label: '门店ID' },
        { name: 'name', label: '门店名称' }
      ],
      // 类型select
      tradingChannelData: [],
      tradingTypeData: [],
      paymentData: [],
      paymentScenarioData: [],
      formData: {
        startDate: dayjs().format('YYYY-MM-DD'),
        startTime: '00:00',
        endDate: dayjs().format('YYYY-MM-DD'),
        endTime: '23:59',
        businessName: '',
        storeName: '',
        tradingChanneCode: '',
        tradingTypeCode: '',
        paymentCode: '',
        paymentScenarioCode: ''
      },
      pageData: {
        totalAmount: 0, // 支付成功金额
        totalCount: 0, // 支付成功笔数
        shopCouponAmount: 0, // 商家优惠金额
        platformCouponAmount: 0, // 平台优惠金额
        reqRefundAmount: 0, // 申请退款金额
        refundCount: 0, // 申请退款笔数
        refundAmount: 0, // 商家实退
        paymentAmout: 0, // 商家实收
        shopFeeAmount: 0, // 手续费
        comeinAmount: 0 // 结算金额
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() || time.getTime() < dayjs().subtract(6, 'months').valueOf()
        }
      }
    }
  },
  components: {
    chooseDialog
  },
  computed: {
    isSubtract() {
      const chooseDate = dayjs(this.formData.startDate).subtract(1, 'days').valueOf()
      const emberDate = dayjs().startOf('day').subtract(6, 'months').valueOf()

      if (chooseDate === emberDate) return true
      else return false
    },
    isAdd() {
      if (dayjs(this.formData.endDate).valueOf() === dayjs().startOf('day').valueOf()) {
        return true
      } else {
        return false
      }
    }
  },
  created() {
    const conditionType = [
      { type: 1, name: 'tradingChannelData' },
      { type: 2, name: 'tradingTypeData' },
      { type: 3, name: 'paymentData' }
    ]
    conditionType.forEach(item => {
      this.getConditionType(item.type).then(res => {
        this[item.name] = [{ code: '', name: '全部' }, ...res]
      })
    })
  },
  methods: {
    shopClear() {
      this.chooseMerchantsList = []
    },
    storeClear() {
      this.chooseStoreList = []
    },
    async handleSearch() {
      if (!this.chooseMerchantsList.id) {
        this.$message.error('请先选择商户')
        return false
      }
      if (dayjs(`${this.formData.endDate} ${this.formData.endTime}:59`).valueOf() > dayjs(`${this.formData.startDate} ${this.formData.startTime}:00`).add(60, 'days').valueOf()) {
        this.$message.error('统计时间间隔不超过60天')
        return false
      }
      const data = {
        endDateTime: `${this.formData.endDate} ${this.formData.endTime}:59`,
        startDateTime: `${this.formData.startDate} ${this.formData.startTime}:00`,
        payChannelType: this.formData.tradingChanneCode, // 交易渠道
        paymentMethodIdList: this.formData.paymentCode !== '' ? [this.formData.paymentCode] : [], // 支付方式集合
        paymentPluginIdList: this.formData.paymentScenarioCode !== '' ? [this.formData.paymentScenarioCode] : [], // 支付场景集合
        shopId: this.chooseMerchantsList.id ? this.chooseMerchantsList.id : 0, // 商户ID
        storeIdList: this.chooseStoreList.id ? [this.chooseStoreList.id] : [], // 门店ID集合
        tradeTypeList: this.formData.tradingTypeCode ? [this.formData.tradingTypeCode] : [] // 交易类型集合
      }
      this.searchLock = true
      try {
        const res = await querySummary(data)
        this.pageData = res
      } catch (error) {
      } finally {
        this.searchLock = false
      }
    },
    handleReset() {
      this.formData = {
        startDate: dayjs().format('YYYY-MM-DD'),
        startTime: '00:00',
        endDate: dayjs().format('YYYY-MM-DD'),
        endTime: '23:59',
        businessName: '',
        storeName: '',
        tradingChanneCode: '',
        tradingTypeCode: '',
        paymentCode: '',
        paymentScenarioCode: ''
      }
      this.chooseMerchantsList = []
      this.chooseStoreList = []
      // this.handleSearch()
    },
    handleChooseDia(titleName, placeHolder, type) {
      let columnObj = {}
      this.chooseType = type
      this.chooseDiaData = []
      this.chooseDiaTotal = 0
      if (type === 1) {
        columnObj = this.chooseMerchantsObj
        this.getMerchantAdminPage()
      } else {
        columnObj = this.chooseStoreObj
        this.getStorePage()
      }
      this.isChooseStatus = true
      this.chooseBaseData = { titleName, placeHolder, columnObj }
    },
    handleChooseSearch({ id = '', name = '' } = {}) {
      if (this.chooseType === 1) {
        this.getMerchantAdminPage({ id, name })
      } else {
        this.getStorePage({ id, name })
      }
    },
    async getMerchantAdminPage({ id = '', name = '' } = {}) {
      const data = {
        page: this.$refs.choose.choosePage,
        rows: this.$refs.choose.chooseRow,
        merchantAdminId: id,
        merchantAdminName: name
      }
      this.$refs.choose.tabLoad = true
      try {
        const res = await queryMerchantAdminPage(data)
        const hasResults = res.results && res.results.length > 0
        this.chooseDiaData = hasResults ? res.results : []
        this.chooseDiaTotal = hasResults ? res.totalCount : 0
      } catch (error) {
      } finally {
        this.$refs.choose.tabLoad = false
      }
    },
    async getStorePage({ id = '', name = '' } = {}) {
      const data = {
        page: this.$refs.choose.choosePage,
        rows: this.$refs.choose.chooseRow,
        adminId: this.chooseMerchantsList.id || '',
        id: id,
        storeName: name
      }
      this.$refs.choose.tabLoad = true
      try {
        const res = await queryStorePage(data)
        const hasResults = res.results && res.results.length > 0
        this.chooseDiaData = hasResults ? res.results : []
        this.chooseDiaTotal = hasResults ? res.totalCount : 0
      } catch (error) {
      } finally {
        this.$refs.choose.tabLoad = false
      }
    },
    setChooseLise(obj) {
      if (this.chooseType === 1) {
        this.chooseMerchantsList = obj
        this.formData.businessName = obj.companyName
      } else {
        this.chooseStoreList = obj
        this.formData.storeName = obj.name
      }
    },

    async getPaymentScenario() {
      this.formData.paymentScenarioCode = ''
      this.paymentScenarioData = []
      if (this.formData.paymentCode) {
        const res = await queryPaySceneByType({
          payType: this.formData.paymentCode
        })
        this.paymentScenarioData = [{ code: '', name: '全部' }, ...res]
      }
    },
    getConditionType(type = 1) {
      const res = queryAllCondition({ conditionType: type })
      return res || []
    },
    setSearchTime(status) {
      let varyStartDate = dayjs(this.formData.startDate)
      let varyEndDate = dayjs(this.formData.endDate)
      if (status === 'add') {
        varyStartDate = varyStartDate.add(1, 'days')
        varyEndDate = varyEndDate.add(1, 'days')
      } else if (status === 'subtract') {
        varyStartDate = varyStartDate.subtract(1, 'days')
        varyEndDate = varyEndDate.subtract(1, 'days')
      }
      this.formData.startDate = varyStartDate.format('YYYY-MM-DD')
      this.formData.endDate = varyEndDate.format('YYYY-MM-DD')
      this.startTime = '00:00'
      this.endTime = '23:59'
    }
  }
}
</script>

<style lang="scss" scoped>
.action-box {
  ::v-deep .el-select {
    width: 100%;
  }
  ::v-deep .el-date-editor.el-input {
    width: 150px;
  }
}
.pure {
  &-btn {
    &_space {
      margin-left: 15px;
    }
  }
  &-card {
    height: 150px;
    &_content {
      width: 170px;
    }
  }
  &-summaryCard {
    &-con {
      margin: 20px;
    }
    &-head {
      font-size: 14px;
      color: #6d6d6d;
      .el-tooltip {
        vertical-align: middle;
      }
    }
    &-num {
      font-size: 30px;
      margin-top: 10px;
    }
  }
}
.item {
  ::v-deep i {
    color: #1a92fd;
  }
}
.tooltip-icon {
  font-size: 22px !important;
  position: absolute;
  float: right;
  right: 80px;
  margin-top: 5px;
  color: #1a92fd;
}
</style>
<style lang="scss">
.el-tooltip__popper.is-light {
  color: #1a92fd;
  border: 1px solid #1a92fd;
  background: #e6f6ff !important;
}
</style>
