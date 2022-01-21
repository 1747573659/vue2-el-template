<template>
  <section class="p-information-con" v-loading="checkBasicInformLoad">
    <el-card shadow="never" class="p-card">
      <div slot="header" class="p-card-head">
        <div class="p-card-reason">
          <span class="p-card-title">订单信息</span>
          <span class="p-card-back" v-if="$route.query.status !== 'add' && form.remark">（订单被退回，原因：{{ form.remark }}）</span>
        </div>
        <div class="p-card-state">
          <span>订单状态：</span>
          <span class="p-card-state_text">{{ currentOrderStatus }}</span>
        </div>
      </div>
      <el-form ref="orderForm" :model="form" :rules="rules" :disabled="$route.query.status === 'detail'" size="small" :inline="true" label-suffix=":" label-width="110px">
        <el-form-item label="订单编码">
          <el-input :value="form.billNo" placeholder="保存后自动生成" disabled></el-input>
        </el-form-item>
        <el-form-item label="订单日期">
          <el-input :value="`${form.createOrderTime || baseOrderTime}`" disabled></el-input>
        </el-form-item>
        <el-form-item label="受理人">
          <el-input :value="form.handUserName" disabled></el-input>
        </el-form-item>
        <el-form-item label="产品" prop="productCode">
          <km-select-page
            ref="product"
            v-model="form.productCode"
            option-label="name"
            option-value="code"
            :data.sync="productLists"
            :request="getProductByPage"
            :is-max-page.sync="isProductMaxPage"
            placeholder=""
          />
        </el-form-item>
        <el-form-item label="开发人天" prop="developDay">
          <el-input v-model="form.developDay" clearable></el-input>
        </el-form-item>
        <el-form-item label="开发费用" prop="developAmount">
          <el-input v-model.trim="form.developAmount" clearable></el-input>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card shadow="never" class="p-card">
      <div slot="header" class="p-card-head">
        <span class="p-card-title">账款信息</span>
      </div>
      <el-form :model="form" size="small" disabled :inline="true" label-suffix=":" label-width="110px">
        <el-form-item label="账面余额">
          <el-input :value="agentPaperMoney"></el-input>
        </el-form-item>
        <el-form-item label="未核销担保金">
          <el-input :value="form.agentGuaranteeMoney | formatAmount"></el-input>
        </el-form-item>
        <el-form-item label="付款状态">
          <el-input :value="`${paymentStatus.has(form.payStatus) ? paymentStatus.get(form.payStatus).label : '未付款'}`"></el-input>
        </el-form-item>
        <el-form-item label="付款时间">
          <el-input :value="form.payTime"></el-input>
        </el-form-item>
        <el-form-item label="付款方式">
          <el-input :value="form.payMethod"></el-input>
        </el-form-item>
        <el-form-item label="收款人">
          <el-input :value="form.payManName"></el-input>
        </el-form-item>
        <el-form-item label="使用余额">
          <el-input :value="useAmount"></el-input>
        </el-form-item>
        <el-form-item label="使用担保金">
          <el-input :value="form.useGuarantee | formatAmount"></el-input>
        </el-form-item>
        <el-form-item label="经销商">
          <el-input :value="`${userInfo.agentId ? '[' + userInfo.agentId + ']' : ''}${userInfo.name}`"></el-input>
        </el-form-item>
      </el-form>
    </el-card>
    <div class="p-information-action">
      <el-button size="small" plain @click="handleCancel('demandDevelopmentFee')">{{ $route.query.status === 'detail' ? '关闭' : '取消' }}</el-button>
      <el-button size="small" plain v-if="$route.query.status === 'edit'" @click="handleDel('demandDevelopmentFee')">删除</el-button>
      <el-button size="small" type="primary" plain v-if="['add', 'edit'].includes($route.query.status)" :loading="checkSaveBtnLoad" @click="handleSave">保存</el-button>
      <template v-if="$route.query.status === 'edit'">
        <el-button size="small" type="primary" v-permission="'DEMAND_DEVELOPMENT_FEE_SUBMIT'" :loading="checkVerifyBtnLoad" @click="handleVerify">提交</el-button>
      </template>
    </div>
  </section>
</template>

<script>
import NP from 'number-precision'
import dayjs from 'dayjs'
import { deepClone } from '@/utils'
import { orderStatus, formObj, paymentStatus } from '../data'

import { queryHandlerMan, queryAgentMoneyStream } from '@/api/orderCenter/orderManagement'
import {
  queryProductCode,
  channelDevelopAdd,
  channelDevelopById,
  channelDevelopUpdate,
  channelDevelopSubmit,
  channelDevelopDelete
} from '@/api/orderCenter/orderManagement/demandDevelopmentFee'

export default {
  data() {
    return {
      paymentStatus,
      checkBasicInformLoad: false,
      baseOrderTime: dayjs().format('YYYY-MM-DD'),
      userInfo: JSON.parse(localStorage.userInfo),
      productLists: [],
      isProductMaxPage: false,
      form: deepClone(formObj),
      rules: {
        productCode: [{ required: true, message: '请选择产品', trigger: ['blur', 'change'] }],
        developDay: [
          { required: true, message: '请输入开发人天', trigger: ['blur', 'change'] },
          { pattern: /^\+?[1-9]{1}[0-9]{0,3}\d{0,0}$/, message: '开发人天范围为1-9999', trigger: 'blur' }
        ],
        developAmount: [
          { required: true, message: '请输入开发费用', trigger: ['blur', 'change'] },
          { pattern: /^([0-9]\d{0,10}?)(\.\d{1,2})?$/, message: '开发费用范围为[0, 99999999999.99]', trigger: 'blur' }
        ]
      },
      checkSaveBtnLoad: false,
      checkVerifyBtnLoad: false
    }
  },
  filters: {
    formatAmount(val) {
      return val ? NP.divide(val, 100) : 0
    }
  },
  computed: {
    currentOrderStatus() {
      const { status, orderStatus: orderStatusVal } = this.$route.query
      if (status) {
        if (orderStatus.has(parseFloat(orderStatusVal))) return orderStatus.get(parseFloat(orderStatusVal)).label
        else return '未保存'
      } else return ''
    },
    agentPaperMoney() {
      const agentPaperGiftMoney = this.form.agentPaperGiftMoney ? '（另有赠金' + this.$options.filters['formatAmount'](this.form.agentPaperGiftMoney) + '）' : ''
      return this.$options.filters['formatAmount'](this.form.agentPaperMoney) + agentPaperGiftMoney
    },
    useAmount() {
      const useAmountGift = this.form.useAmountGift ? '（另扣赠金' + this.$options.filters['formatAmount'](this.form.useAmountGift) + '）' : ''
      return this.$options.filters['formatAmount'](this.form.useAmount) + useAmountGift
    }
  },
  mounted() {
    if (this.$route.query.status === 'add') {
      this.getHandlerMan()
      this.getAgentMoneyStream()
    } else this.getDetail()
  },
  methods: {
    handleVerify() {
      this.checkVerifyBtnLoad = true
      this.setOrderSave()
        .then(async () => {
          await channelDevelopSubmit({ id: this.form.id })
          this.getDetail().then(() => {
            this.$router.replace({ name: this.$route.name, query: { id: this.form.id, orderStatus: this.form.orderStatus, status: 'detail' } })
          })
          this.$message({ type: 'success', message: '提交成功' })
        })
        .catch(() => {})
        .finally(() => {
          this.checkVerifyBtnLoad = false
        })
    },
    handleSave() {
      this.checkSaveBtnLoad = true
      this.setOrderSave()
        .then(res => {
          if (this.$route.query.status === 'add') {
            this.$router.replace({ name: this.$route.name, query: { id: res.id, orderStatus: res.orderStatus, status: 'edit' } })
            document.querySelector('.e-tag_active span').innerText = '需求开发收费单/编辑'
          }
          this.getDetail()
          this.$message({ type: 'success', message: '保存成功' })
        })
        .catch(() => {})
        .finally(() => {
          this.checkSaveBtnLoad = false
        })
    },
    async setOrderSave() {
      let isValidatePass = false
      await this.$refs.orderForm.validate(valid => (isValidatePass = !!valid))
      if (isValidatePass) {
        const { developDay, developAmount, productCode, handUser, id, ...params } = this.form
        const data = { agentId: this.userInfo.agentId, developAmount: NP.times(developAmount, 100), id, developDay, productCode, handUser }
        return this.$route.query.status === 'add' ? channelDevelopAdd(data) : channelDevelopUpdate(data)
      } else return new Promise((resolve, reject) => reject(new Error()))
    },
    async getDetail() {
      try {
        this.checkBasicInformLoad = true
        const res = await channelDevelopById(this.$route.query.id)
        res.developAmount = NP.divide(res.developAmount, 100)
        this.form = res
        setTimeout(() => {
          this.$refs.product.selectVal = res.productCodeName
        }, 300)
      } catch (error) {
      } finally {
        this.checkBasicInformLoad = false
      }
    },
    handleCancel(name) {
      this.$store.dispatch('delTagView', this.$route).then(() => this.$router.push({ name }))
    },
    handleDel(name) {
      this.$confirm('确定删除单据吗？', '提示', {
        type: 'warning',
        beforeClose: async (action, instance, done) => {
          if (action === 'confirm') {
            try {
              instance.confirmButtonLoading = true
              await channelDevelopDelete(this.$route.query.id)
              this.$message({ type: 'success', message: '删除成功' })
              this.handleCancel(name)
            } catch (error) {
            } finally {
              instance.confirmButtonLoading = false
              done()
            }
          } else done()
        }
      })
    },
    async getHandlerMan() {
      try {
        const { id = '', contactor = '', mobile = '' } = await queryHandlerMan({ area: this.userInfo.districtCode })
        this.form.handUser = id
        this.form.handUserName = `${contactor}${mobile ? '（' + mobile + '）' : ''}`
      } catch (error) {}
    },
    async getProductByPage({ query = '', page = 1, rows = 10 } = {}) {
      try {
        const res = await queryProductCode({ info: query, newOrderType: 35, page, rows })
        this.productLists = this.productLists.concat(res.results || [])
        this.isProductMaxPage = !res.results || (res.results && res.results.length < 10)
      } catch (error) {}
    },
    async getAgentMoneyStream() {
      try {
        const { paperMoney, paperMoneyGift, noQualityGuaranteeMoney } = await queryAgentMoneyStream({ agentId: this.userInfo.agentId })
        this.form.agentPaperMoney = paperMoney
        this.form.agentPaperGiftMoney = paperMoneyGift
        this.form.agentGuaranteeMoney = noQualityGuaranteeMoney
      } catch (error) {}
    }
  }
}
</script>

<style lang="scss" scoped>
.p-card {
  border-top: 16px solid #f7f8fa;
  &-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .p-card-reason {
      flex-basis: 80%;
    }
    /deep/ {
      .el-button {
        font-size: 16px;
      }
    }
  }
  &-state {
    font-size: 14px;
    &_text {
      background-color: #eff5ff;
      color: #3377ff;
      border-radius: 3px;
      padding: 5px 12px;
    }
  }
  &-title {
    color: #1f2e4d;
    font-weight: 500;
  }
  &-back {
    color: red;
  }
}
.p-information-action {
  width: calc(100% - 200px - 42px);
  height: 56px;
  position: fixed;
  bottom: 0;
  background-color: #fff;
  line-height: 56px;
  text-align: center;
  box-shadow: 0px -1px 2px 0px rgba(0, 0, 0, 0.03);
  z-index: 1000;
  /deep/ .el-button {
    padding: 8px 22px;
  }
}
</style>
