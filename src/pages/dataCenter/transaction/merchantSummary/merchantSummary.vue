<template>
  <div class="app-container">
    <div class="action-box">
      <km-form :inline="true" :model="formData" @submit.native.prevent>
        <km-form-item label="付款时间">
          <km-date-picker :picker-options="pickerOptions" @blur="handleResetTime" end-placeholder="结束日期" range-separator="至" start-placeholder="开始日期" type="datetimerange" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" v-model="formData.createTime"></km-date-picker>
        </km-form-item>
        <km-form-item label="商户名称">
          <km-select v-model="formData.businessName">
            <km-option :value="0" label="全部"></km-option>
          </km-select>
        </km-form-item>
        <km-form-item label="门店名称">
          <km-select v-model="formData.storeName">
            <km-option :value="0" label="全部"></km-option>
          </km-select>
        </km-form-item>
        <km-form-item label="交易渠道">
          <km-select v-model="formData.channel">
            <km-option :value="0" label="全部"></km-option>
          </km-select>
        </km-form-item>
        <km-form-item label="支付方式">
          <km-select v-model="formData.payment">
            <km-option :value="0" label="全部"></km-option>
          </km-select>
        </km-form-item>
        <km-form-item label="交易场景">
          <km-select v-model="formData.tradingStock">
            <km-option :value="0" label="全部"></km-option>
          </km-select>
        </km-form-item>
        <km-form-item label="交易状态">
          <km-select v-model="formData.tradingStatus">
            <km-option :value="0" label="全部"></km-option>
          </km-select>
        </km-form-item>
        <km-form-item>
          <km-button :loading="searchLock" @click="handleSearch" size="small" type="primary">查询</km-button>
          <km-button @click="handleReset" plain size="small" type="primary">重置</km-button>
        </km-form-item>
      </km-form>
    </div>
    <!-- 内容展示区域 -->
    <section class="pure-summaryCard-con" v-loading="tabLock">
      <km-row :gutter="20" style="margin-bottom:30px">
        <km-col :span="6">
          <km-card body-style="height:150px" shadow="hover">
            <header class="pure-summaryCard-head">订单总金额</header>
            <section class="pure-summaryCard-num">50</section>
          </km-card>
        </km-col>
        <km-col :span="6">
          <km-card body-style="height:150px" shadow="hover">
            <header class="pure-summaryCard-head">订单总笔数</header>
            <section class="pure-summaryCard-num">50</section>
          </km-card>
        </km-col>
        <km-col :span="6">
          <km-card body-style="height:150px" shadow="hover">
            <header class="pure-summaryCard-head">申请退款金额</header>
            <section class="pure-summaryCard-num">50</section>
          </km-card>
        </km-col>
        <km-col :span="6">
          <km-card body-style="height:150px" shadow="hover">
            <header class="pure-summaryCard-head">申请退款笔数</header>
            <section class="pure-summaryCard-num">50</section>
          </km-card>
        </km-col>
      </km-row>
      <km-row :gutter="20" style="margin-bottom:40px">
        <km-col :span="6">
          <km-card body-style="height:150px" shadow="hover">
            <header class="pure-summaryCard-head">商家优惠金额</header>
            <section class="pure-summaryCard-num">50</section>
          </km-card>
        </km-col>
        <km-col :span="6">
          <km-card body-style="height:150px" shadow="hover">
            <header class="pure-summaryCard-head">商家优惠笔数</header>
            <section class="pure-summaryCard-num">50</section>
          </km-card>
        </km-col>
        <km-col :span="6">
          <km-card body-style="height:150px" shadow="hover">
            <header class="pure-summaryCard-head">平台优惠金额</header>
            <section class="pure-summaryCard-num">50</section>
          </km-card>
        </km-col>
        <km-col :span="6">
          <km-card body-style="height:150px" shadow="hover">
            <header class="pure-summaryCard-head">平台优惠笔数</header>
            <section class="pure-summaryCard-num">50</section>
          </km-card>
        </km-col>
      </km-row>
      <km-row :gutter="20">
        <km-col :span="6">
          <km-card body-style="height:150px" shadow="hover">
            <header class="pure-summaryCard-head">商家实退金额</header>
            <section class="pure-summaryCard-num">50</section>
          </km-card>
        </km-col>
        <km-col :span="6">
          <km-card body-style="height:150px" shadow="hover">
            <header class="pure-summaryCard-head">商家实收金额</header>
            <section class="pure-summaryCard-num">50</section>
          </km-card>
        </km-col>
        <km-col :span="6">
          <km-card body-style="height:150px" shadow="hover">
            <header class="pure-summaryCard-head">净手续费</header>
            <section class="pure-summaryCard-num">50</section>
          </km-card>
        </km-col>
        <km-col :span="6">
          <km-card body-style="height:150px" shadow="hover">
            <header class="pure-summaryCard-head">划账金额</header>
            <section class="pure-summaryCard-num">50</section>
          </km-card>
        </km-col>
      </km-row>
    </section>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tabLock: false,
      searchLock: false,
      formData: {
        createTime: '',
        businessName: '',
        storeName: '',
        channel: '',
        payment: '',
        tradingStock: '',
        tradingStatus: ''
      },
      pickerOptions: {

      }
    }
  },
  methods: {
    handleSearch () {
    },
    handleReset () {}
  }
}
</script>

<style lang="scss" scoped>
.pure {
  &-summaryCard {
    &-con {
      margin: 20px;
    }
    &-head {
      font-size: 18px;
      color: #6d6d6d;
    }
    &-num {
      font-size: 36px;
      margin-top: 20px;
    }
  }
}
</style>
