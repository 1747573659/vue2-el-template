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
      <el-form ref="orderForm" :model="form" :rules="rules" :disabled="$route.query.status === 'detail'" size="small" :inline="true" label-suffix=":" label-width="130px">
        <el-form-item label="订单编码">
          <el-input :value="form.billNo" disabledplaceholder="保存后自动生成" disabled></el-input>
        </el-form-item>
        <el-form-item label="订单时间">
          <el-input :value="`${form.createOrderTime || baseOrderTime}`" disabled></el-input>
        </el-form-item>
        <el-form-item label="受理人">
          <el-input :value="form.handUserName" disabled></el-input>
        </el-form-item>
        <el-form-item label="经销商">
          <el-input :value="`${userInfo.agentId ? '[' + userInfo.agentId + ']' : ''}${userInfo.name}`" disabled></el-input>
        </el-form-item>
        <el-form-item label="旧商户注册方式" prop="oldRegistType">
          <el-select v-model="form.oldRegistType" @change="handleOldRegistType" placeholder="旧商户注册方式" clearable>
            <el-option v-for="item in Array.from(oldRegistTypes).filter((item, index) => index > 0)" :key="item[1].value" :label="item[1].label" :value="item[1].value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card shadow="never" class="p-card">
      <div slot="header" class="p-card-head">
        <span class="p-card-title">旧商户信息</span>
      </div>
      <el-form ref="oldForm" :model="form" :rules="rules" :disabled="$route.query.status === 'detail'" size="small" :inline="true" label-suffix=":" label-width="110px">
        <template v-if="['', 0].includes(form.oldRegistType)">
          <el-form-item label="商户名称" prop="oldMerchantName" key="1">
            <km-select-page
              ref="oldMerchantSelect"
              v-model="form.oldMerchantName"
              option-label="custNameExpand"
              option-value="custId"
              :data.sync="oldShopPageData"
              :request="getOldShopPage"
              :is-max-page.sync="isOldShopMaxPage"
              @change="val => handleShopPage(val, 'old')"
              placeholder="请输入名称/商户号"
            />
          </el-form-item>
          <el-form-item label="商户号">
            <el-input :value="form.oldMerchantId" placeholder="请先选择商户" disabled></el-input>
          </el-form-item>
          <el-form-item label="授权状态">
            <el-input :value="form.oldMerchantAuthType !== '' ? form.oldMerchantAuthType ? '试用' : '正式' : ''" disabled></el-input>
          </el-form-item>
          <el-form-item label="产品">
            <el-input :value="`${form.oldMerchantProductCode ? '[' + form.oldMerchantProductCode + ']' : ''}${form.oldMerchantProductCodeName || ''}`" disabled></el-input>
          </el-form-item>
          <el-form-item label="地区">
            <el-input :value="form.oldAddress" disabled></el-input>
          </el-form-item>
          <el-form-item label="门店授权站点">
            <el-input :value="form.oldMerchantAuthCount" disabled></el-input>
          </el-form-item>
        </template>
        <template v-if="form.oldRegistType === 1">
          <el-form-item label="加密狗ID" prop="oldMerchantId" key="2">
            <el-input v-model="form.oldMerchantId" maxlength="30" placeholder="加密狗ID" clearable></el-input>
          </el-form-item>
          <el-form-item label="产品" prop="oldMerchantProductCode">
            <km-select-page
              ref="product"
              v-model="form.oldMerchantProductCode"
              option-label="name"
              option-value="code"
              :data.sync="productLists"
              :request="getProductByPage"
              :is-max-page.sync="isProductMaxPage"
              placeholder="全部"
            />
          </el-form-item>
        </template>
      </el-form>
    </el-card>
    <el-card shadow="never" class="p-card">
      <div slot="header" class="p-card-head">
        <span class="p-card-title">新商户信息</span>
      </div>
      <el-form ref="newForm" :model="form" :rules="rules" :disabled="$route.query.status === 'detail'" size="small" :inline="true" label-suffix=":" label-width="110px">
        <el-form-item label="商户名称" prop="newMerchantName">
          <km-select-page
            ref="newMerchantSelect"
            v-model="form.newMerchantName"
            option-label="custNameExpand"
            option-value="custId"
            :data.sync="newShopPageData"
            :request="getNewShopPage"
            :is-max-page.sync="isNewShopMaxPage"
            @change="val => handleShopPage(val, 'new')"
            placeholder="请输入名称/商户号"
          />
        </el-form-item>
        <el-form-item label="商户号">
          <el-input :value="form.newMerchantId" placeholder="请先选择商户" disabled></el-input>
        </el-form-item>
        <el-form-item label="授权状态">
          <el-input :value="form.newMerchantAuthType !== '' ? form.newMerchantAuthType ? '试用' : '正式' : ''" disabled></el-input>
        </el-form-item>
        <el-form-item label="产品">
          <el-input :value="`${form.newMerchantProductCode ? '[' + form.newMerchantProductCode + ']' : ''}${form.newMerchantProductCodeName || ''}`" disabled></el-input>
        </el-form-item>
        <el-form-item label="地区">
          <el-input :value="form.newAddress" disabled></el-input>
        </el-form-item>
        <el-form-item label="门店授权站点" prop="newMerchantAuthCount">
          <el-input v-model="form.newMerchantAuthCount"></el-input>
        </el-form-item>
      </el-form>
    </el-card>
    <div class="p-infomation-action">
      <el-button size="small" plain @click="handleCancel('erpAuthorizedTransfer')">{{ $route.query.status === 'detail' ? '关闭' : '取消' }}</el-button>
      <el-button size="small" plain v-if="$route.query.status === 'edit'" @click="handleDel('erpAuthorizedTransfer')">删除</el-button>
      <el-button size="small" type="primary" plain v-if="['add', 'edit'].includes($route.query.status)" :loading="checkSaveBtnLoad" @click="handleSave">保存</el-button>
      <template v-if="$route.query.status === 'edit'">
        <el-button size="small" type="primary" v-permission="'ERP_AUTHORIZED_TRANSFER_SUBMIT'" @click="handleVerify">提交</el-button>
      </template>
    </div>
  </section>
</template>

<script>
import dayjs from 'dayjs'
import { deepClone } from '@/utils'
import { orderStatus, formObj, oldRegistTypes } from '../data'

import { queryHandlerMan } from '@/api/orderCenter/orderManagement'
import {
  authShopPage,
  queryProductCode,
  channelErpTransferAdd,
  channelErpTransferUpdate,
  channelErpTransferById,
  channelErpTransferDel,
  channelErpTransferSubmit
} from '@/api/orderCenter/orderManagement/erpAuthorizedTransfer'

export default {
  data() {
    return {
      oldRegistTypes,
      baseOrderTime: dayjs().format('YYYY-MM-DD'),
      form: deepClone(formObj),
      isFormValidatePass: false,
      rules: {
        oldRegistType: [{ required: true, message: '请选择旧商户注册方式', trigger: ['blur', 'change'] }],
        oldMerchantName: [{ required: true, message: '请选择旧商户名称', trigger: ['blur', 'change'] }],
        oldMerchantId: [{ required: true, message: '请输入加密狗ID', trigger: ['blur', 'change'] }],
        oldMerchantProductCode: [{ required: true, message: '请选择产品', trigger: ['blur', 'change'] }],
        newMerchantName: [{ required: true, message: '请选择新商户名称', trigger: ['blur', 'change'] }],
        newMerchantAuthCount: [
          { required: true, message: '请输入新商户门店授权站点', trigger: ['blur', 'change'] },
          { pattern: /^\+?[1-9]{1}[0-9]{0,2}\d{0,0}$/, message: '门店授权站点范围为1-999', trigger: ['blur', 'change'] }
        ]
      },
      userInfo: JSON.parse(localStorage.userInfo),
      oldShopPageData: [],
      isOldShopMaxPage: false,
      newShopPageData: [],
      isNewShopMaxPage: false,
      productLists: [],
      isProductMaxPage: false,
      checkSaveBtnLoad: false,
      checkBasicInformLoad: false
    }
  },
  computed: {
    currentOrderStatus() {
      const { status, orderStatus: orderStatusVal } = this.$route.query
      if (status) {
        if (orderStatus.has(parseFloat(orderStatusVal))) return orderStatus.get(parseFloat(orderStatusVal)).label
        else return '未保存'
      } else return ''
    }
  },
  mounted() {
    if (this.$route.query.status === 'add') this.getHandlerMan()
    else this.getDetail()
  },
  methods: {
    handleOldRegistType(val) {
      if (val) {
        const { oldMerchantName, oldMerchantId, oldMerchantAuthType, oldMerchantProductCode, oldMerchantProductCodeName, oldAddress, oldMerchantAuthCount } = formObj
        this.form = Object.assign(this.form, {
          oldMerchantName,
          oldMerchantId,
          oldMerchantAuthType,
          oldMerchantProductCode,
          oldMerchantProductCodeName,
          oldAddress,
          oldMerchantAuthCount
        })
      }
    },
    handleShopPage(val, type) {
      if (val) {
        const { authCount, productId, productName, status, custId, companyProvince, companyCity } = this[`${type}ShopPageData`].find(item => item.custId === val)
        if (type === 'old') {
          this.form = Object.assign(this.form, {
            oldMerchantAuthCount: authCount && authCount.includes(';') ? authCount.split(';')[1] : authCount,
            oldMerchantProductCode: productId,
            oldMerchantProductCodeName: productName,
            oldMerchantAuthType: status === '2' ? 0 : 1,
            oldMerchantId: custId,
            oldAddress: companyProvince + companyCity
          })
          if (this.form.newMerchantId) this.form.newMerchantAuthCount = ['', 0].includes(this.form.oldRegistType) ? this.form.oldMerchantAuthCount : 1
        } else {
          this.form = Object.assign(this.form, {
            newMerchantAuthCount: ['', 0].includes(this.form.oldRegistType) ? this.form.oldMerchantAuthCount : 1,
            newMerchantProductCode: productId,
            newMerchantProductCodeName: productName,
            newMerchantAuthType: status === '2' ? 0 : 1,
            newMerchantId: custId,
            newAddress: companyProvince + companyCity
          })
        }
      } else {
        if (type === 'old') {
          const { oldMerchantAuthCount, oldMerchantProductCode, oldMerchantProductCodeName, oldMerchantAuthType, oldMerchantId } = formObj
          this.form = Object.assign(this.form, { oldMerchantAuthCount, oldMerchantProductCode, oldMerchantProductCodeName, oldMerchantAuthType, oldMerchantId })
        } else {
          const { newMerchantAuthCount, newMerchantProductCode, newMerchantProductCodeName, newMerchantAuthType, newMerchantId } = formObj
          this.form = Object.assign(this.form, { newMerchantAuthCount, newMerchantProductCode, newMerchantProductCodeName, newMerchantAuthType, newMerchantId })
        }
      }
    },
    handleVerify() {
      if (this.form.oldMerchantProductCode.toUpperCase() !== this.form.newMerchantProductCode.toUpperCase()) {
        this.$message({ type: 'warning', message: '新旧商户的产品不一致，请修改后再操作' })
      } else {
        this.$confirm('确定要提交吗？', '提示', {
          type: 'warning',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true
              this.setOrderSave()
                .then(async () => {
                  await channelErpTransferSubmit({ id: parseFloat(this.$route.query.id) })
                  this.getDetail().then(() => {
                    this.$router.replace({ name: this.$route.name, query: { id: this.$route.query.id, orderStatus: 10, status: 'detail' } })
                  })
                  this.$message({ type: 'success', message: '提交成功' })
                })
                .catch(() => {})
                .finally(() => {
                  instance.confirmButtonLoading = false
                  done()
                })
            } else done()
          }
        }).catch(() => {})
      }
    },
    handleSave() {
      this.checkSaveBtnLoad = true
      this.setOrderSave()
        .then(res => {
          if (this.$route.query.status === 'add') {
            this.$router.replace({ name: this.$route.name, query: { id: res.id, orderStatus: res.orderStatus, status: 'edit' } })
            document.querySelector('.e-tag_active span').innerText = 'erp授权转移单/编辑'
          }
          this.getDetail()
          this.$message({ type: 'success', message: '保存成功' })
        })
        .catch(() => {})
        .finally(() => {
          this.checkSaveBtnLoad = false
        })
    },
    setOrderSave() {
      return this.handleValidateForm().then(async () => {
        if (this.isFormValidatePass) {
          const { oldMerchantId, oldMerchantProductCode, oldRegistType, oldMerchantAuthType, oldMerchantAuthCount } = this.form
          const { handUser, id, newMerchantAuthCount, newMerchantAuthType, newMerchantId, newMerchantProductCode } = this.form
          let data = Object.assign(
            { agentId: this.userInfo.agentId, id, handUser },
            { newMerchantAuthCount, newMerchantAuthType, newMerchantId, newMerchantProductCode, oldMerchantId, oldMerchantProductCode, oldRegistType }
          )
          if (oldRegistType === 0) data = Object.assign(data, { oldMerchantAuthType, oldMerchantAuthCount })
          return this.$route.query.status === 'add' ? await channelErpTransferAdd(data) : await channelErpTransferUpdate(data)
        } else return new Promise((resolve, reject) => reject(new Error()))
      })
    },
    handleValidateForm() {
      const reFormArr = ['orderForm', 'oldForm', 'newForm']
      const validateFormFunc = () => {
        return reFormArr.map(item => {
          return new Promise((resolve, reject) => {
            this.$refs[item].validate(valid => {
              if (valid) resolve()
              else reject()
            })
          })
        })
      }
      return Promise.all(validateFormFunc())
        .then(() => {
          this.isFormValidatePass = true
        })
        .catch(() => {
          this.isFormValidatePass = false
        })
    },
    async getDetail() {
      try {
        this.checkBasicInformLoad = true
        const res = await channelErpTransferById(this.$route.query.id)
        this.form = res
        setTimeout(() => {
          if (this.form.oldRegistType !== 1) this.$refs.oldMerchantSelect.selectVal = res?.oldMerchantName ?? ''
          else this.$refs.product.selectVal = res?.oldMerchantProductCodeName ?? ''
          this.$refs.newMerchantSelect.selectVal = res?.newMerchantName ?? ''
        }, 500)
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
              await channelErpTransferDel(this.$route.query.id)
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
        const res = await queryProductCode({ info: query, page, rows, registType: Math.pow(0, this.form.oldRegistType), newOrderType: 36 })
        this.productLists = this.productLists.concat(res.results || [])
        this.isProductMaxPage = !res.results || (res.results && res.results.length < 10)
      } catch (error) {}
    },
    async getOldShopPage({ query = '', page = 1, rows = 10 } = {}) {
      await this.getShopPage({ query, page, rows, status: '2' }, 'oldShopPageData', 'isOldShopMaxPage')
    },
    async getNewShopPage({ query = '', page = 1, rows = 10 } = {}) {
      await this.getShopPage({ query, page, rows, status: '0' }, 'newShopPageData', 'isNewShopMaxPage')
    },
    async getShopPage({ query = '', page = 1, rows = 10, status = '' } = {}, dataObj, isMaxpage) {
      try {
        const isNum = new RegExp(/[\u4e00-\u9fa5]/).test(query)
        const res = await authShopPage({ custId: !isNum ? query : '', authShopMessage: isNum && query ? query : '', status, page, rows })
        res.results.forEach(item => (item.custNameExpand = `${item.custName ? item.custName : ''}（${item.custId}）`))
        this[dataObj] = this[dataObj].concat(res.results || [])
        this[isMaxpage] = !res.results || (res.results && res.results.length < 10)
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
.p-infomation-action {
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
