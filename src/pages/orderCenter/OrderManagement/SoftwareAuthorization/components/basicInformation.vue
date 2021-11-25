<template>
  <section class="p-information-con" v-loading="checkBasicInformLoad">
    <el-card shadow="never" class="p-card">
      <div slot="header" class="p-card-head">
        <div>
          <span class="p-card-title">订单信息</span>
          <span class="p-card-back" v-if="$route.query.status !== 'add' && form.authOrderDTO.remark">（订单被退回，原因：{{ form.authOrderDTO.remark }}）</span>
        </div>
        <div class="p-card-state">
          <span>订单状态：</span>
          <span class="p-card-state_text">{{ currentOrderStatus }}</span>
        </div>
      </div>
      <el-form :model="form" size="small" disabled :inline="true" label-suffix=":" label-width="110px">
        <el-form-item label="单据编码">
          <el-input :value="form.authOrderDTO.billNo" placeholder="保存后自动生成"></el-input>
        </el-form-item>
        <el-form-item label="订单时间">
          <el-input :value="`${form.authOrderDTO.createOrderTime || baseOrderTime}`"></el-input>
        </el-form-item>
        <el-form-item label="消耗库存">
          <el-input :value="form.authOrderDTO.inventoryAmount"></el-input>
        </el-form-item>
        <el-form-item label="受理人">
          <el-input :value="form.authOrderDTO.handManName"></el-input>
        </el-form-item>
      </el-form>
    </el-card>
    <component ref="information" :is="activeName" :form="form" :userBaseInfo="userBaseInfo"></component>
    <div class="p-infomation-action">
      <el-button size="small" plain @click="handleCancel('softwareAuthorization')">{{ $route.query.status === 'detail' ? '关闭' : '取消' }}</el-button>
      <template v-if="['add', 'edit'].includes($route.query.status)">
        <el-button
          size="small"
          type="primary"
          plain
          :disabled="productType === 3 && form.merchantDTO.applicationModule === 2 && form.detailDTOList.length > 0 && form.detailDTOList[0].openCustAssistantApp === 1"
          :loading="checkSaveBtnLoad"
          @click="handleSave"
        >
          保存
        </el-button>
      </template>
      <el-button
        size="small"
        type="primary"
        v-if="$route.query.status === 'edit'"
        v-permission="'SOFTWARE_AUTHORIZATION_SUBMIT'"
        :loading="checkVerifyBtnLoad"
        @click="handleVerify"
        >提交</el-button
      >
    </div>
  </section>
</template>

<script>
import dayjs from 'dayjs'
import { deepClone } from '@/utils'
import { orderStatus, formErpObj, formWlsOrWcyObj, formYsObj } from '../data'
import erpInformation from './erpInformation'
import retailInformation from './retailInformation'
import repastInformation from './repastInformation'
import cloundInformation from './cloundInformation'

import { queryHandlerMan, queryBaseInfo } from '@/api/orderCenter/orderManagement'
import {
  authOrderErpDetail,
  authOrderWlsDetail,
  authOrderWcyDetail,
  authOrderYsDetail,
  authOrderErpUpdate,
  authOrderWlsUpdate,
  authOrderWcyUpdate,
  authOrderYsUpdate,
  authOrderErpAdd,
  authOrderWlsAdd,
  authOrderWcyAdd,
  authOrderYsAdd,
  authOrderErpSubmit,
  authOrderWlsSubmit,
  authOrderWcySubmit,
  authOrderYsSubmit
} from '@/api/orderCenter/orderManagement/softwareAuthorization'

export default {
  components: {
    erpInformation,
    retailInformation,
    repastInformation,
    cloundInformation
  },
  data() {
    return {
      checkBasicInformLoad: false,
      baseOrderTime: dayjs().format('YYYY-MM-DD'),
      form: {},
      activeName: 'erpInformation',
      productType: parseFloat(this.$route.query.productType),
      baseInfoMap: new Map([
        [
          1,
          {
            componentName: 'erpInformation',
            detailRequest: authOrderErpDetail,
            updateRequest: authOrderErpUpdate,
            verifyRequest: authOrderErpSubmit,
            addRequest: authOrderErpAdd,
            form: formErpObj
          }
        ],
        [
          3,
          {
            componentName: 'retailInformation',
            detailRequest: authOrderWlsDetail,
            updateRequest: authOrderWlsUpdate,
            verifyRequest: authOrderWlsSubmit,
            addRequest: authOrderWlsAdd,
            form: formWlsOrWcyObj
          }
        ],
        [
          4,
          {
            componentName: 'repastInformation',
            detailRequest: authOrderWcyDetail,
            updateRequest: authOrderWcyUpdate,
            verifyRequest: authOrderWcySubmit,
            addRequest: authOrderWcyAdd,
            form: formWlsOrWcyObj
          }
        ],
        [
          5,
          {
            componentName: 'cloundInformation',
            detailRequest: authOrderYsDetail,
            updateRequest: authOrderYsUpdate,
            verifyRequest: authOrderYsSubmit,
            addRequest: authOrderYsAdd,
            form: formYsObj
          }
        ]
      ]),
      checkSaveBtnLoad: false,
      checkVerifyBtnLoad: false,
      userBaseInfo: JSON.parse(localStorage.userInfo)
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
  created() {
    this.activeName = this.baseInfoMap.get(this.productType).componentName
    this.form = deepClone(this.baseInfoMap.get(this.productType).form)
  },
  mounted() {
    if (this.$route.query.status === 'add') this.getHandlerMan()
    if ([3, 4].includes(this.productType)) this.$refs.information.getCustList()
    if (['edit', 'detail'].includes(this.$route.query.status)) {
      this.getDetail().then(() => {
        if (this.$route.query.status === 'edit') this.$refs.information.getProductStock()
      })
    }
  },
  methods: {
    handleVerify() {
      this.$confirm('确定要提交吗？', {
        title: '提示',
        type: 'warning'
      })
        .then(() => {
          this.setOrderSave()
            .then(async () => {
              await this.baseInfoMap.get(this.productType).verifyRequest({ id: parseFloat(this.$route.query.id), result: 0 })
              this.getDetail().then(() => {
                this.$router.replace({
                  name: this.$route.name,
                  query: { id: this.$route.query.id, productType: this.productType, orderStatus: this.form.authOrderDTO.orderStatus, status: 'detail' }
                })
              })
              this.$message({ type: 'success', message: '提交成功' })
            })
            .catch(() => {})
        })
        .catch(() => {})
    },
    handleCancel(name) {
      this.$store.dispatch('delTagView', this.$route).then(() => this.$router.push({ name }))
    },
    getYsInformationObj() {
      if (!this.form.merchantDTO.applicationSystem || !this.form.merchantDTO.merchantNo) {
        this.$message({ type: 'warning', message: '请先选择商户' })
      } else if (!this.$refs.information.showAddBit && !this.form.renewAuthOrderDetailDTOList?.length) {
        this.$message({ type: 'warning', message: '请选择授权对象' })
      } else {
        const a = this.form.addAuthOrderDetailDTOList.concat(this.form.renewAuthOrderDetailDTOList)
        const insufficientObj = a.filter(item => item.useInventory > item?.orderInventory ?? this.$refs.information.productStockObj?.totalAmount)
        if (insufficientObj.length > 0) {
          this.$confirm(`[${this.$refs.information.appModuleObj.productCode}]的库存不足，当前库存: ${insufficientObj[0].orderInventory}`, {
            title: '系统提示',
            type: 'warning',
            confirmButtonText: '去采购',
            cancelButtonText: '返回修改',
            beforeClose: (action, instance, done) => {
              if (action === 'confirm') {
                this.$router.push({ name: 'softwarePurchaseDetails', query: { status: 'add', productCode: this.$refs.information.appModuleObj.productCode } })
              } else this.$refs.information.getProductStock()
              done()
            }
          }).catch(() => {})
        } else {
          const { merchantNo: merchantId, merchantName, delayHour: delayCount, applicationSystem: useModal } = this.form.merchantDTO
          const productCode = this.$refs.information.appModulesData.find(item => item.code === useModal).productCode
          return {
            authOrderVO: Object.assign(
              this.handleQueryParams().authOrderVO,
              { orderStatus: 0, productType: 5, merchantId, merchantName, useModal, delayCount },
              { productCode }
            ),
            addOrderDetailVos: this.form.addAuthOrderDetailDTOList,
            renewOrderDetailVos: this.form.renewAuthOrderDetailDTOList
          }
        }
      }
    },
    getWcyInformationObj() {
      if (this.form.detailDTOList.length === 0 || !this.form.merchantDTO.merchantNo) {
        this.$message({ type: 'warning', message: '请先选择商户或产品模块信息' })
      } else {
        const insufficientObj = this.form.detailDTOList.filter(item => item.useInventory > item.orderInventory)
        if (insufficientObj.length > 0) {
          this.$confirm(`[${this.$refs.information.merchantInfo.productCode}]的库存不足，当前库存: ${insufficientObj[0].orderInventory}`, {
            title: '系统提示',
            type: 'warning',
            confirmButtonText: '去采购',
            cancelButtonText: '返回修改',
            beforeClose: (action, instance, done) => {
              if (action === 'confirm') {
                this.$router.push({ name: 'softwarePurchaseDetails', query: { status: 'add', productCode: this.$refs.information.merchantInfo.productCode } })
              } else this.$refs.information.getProductStock()
              done()
            }
          }).catch(() => {})
        } else {
          const { productCode } = this.form.authOrderDTO
          const { merchantNo: merchantId, applicationModule: useModal, delayHour: delayCount } = this.form.merchantDTO
          return {
            authOrderVO: Object.assign(
              this.handleQueryParams().authOrderVO,
              { orderStatus: 0, productType: 4, merchantId, useModal, delayCount },
              { productCode: this.$refs.information.merchantInfo.productCode || productCode }
            ),
            orderDetailVos: this.handleQueryParams().orderDetailVos
          }
        }
      }
    },
    getWlsInformationObj() {
      if (this.form.detailDTOList.length === 0 || !this.form.merchantDTO.merchantId) {
        this.$message({ type: 'warning', message: '请先选择商户或产品模块信息' })
      } else {
        const insufficientObj = this.form.detailDTOList.filter(item => item.useInventory > item.orderInventory)
        if (insufficientObj.length > 0) {
          this.$confirm(`[${this.$refs.information.merchantInfo.productCode}]的库存不足，当前库存: ${insufficientObj[0].orderInventory}`, {
            title: '系统提示',
            type: 'warning',
            confirmButtonText: '去采购',
            cancelButtonText: '返回修改',
            beforeClose: (action, instance, done) => {
              if (action === 'confirm') {
                this.$router.push({ name: 'softwarePurchaseDetails', query: { status: 'add', productCode: this.$refs.information.merchantInfo.productCode } })
              } else this.$refs.information.getProductStock()
              done()
            }
          }).catch(() => {})
        } else {
          const { merchantId, applicationModule: useModal, delayHour: delayCount, productCode } = this.form.merchantDTO
          return {
            authOrderVO: Object.assign(
              this.handleQueryParams().authOrderVO,
              { orderStatus: 0, productType: 3, merchantId, useModal, delayCount },
              { productCode: this.$refs.information.merchantInfo.productCode || productCode }
            ),
            orderDetailVos: this.handleQueryParams().orderDetailVos
          }
        }
      }
    },
    getErpInformationObj() {
      if (this.form.erpAuthOrderDetails.length === 0 || !this.form.erpAuthMerchantDTO.merchantId) {
        this.$message({ type: 'warning', message: '请先选择商户或产品模块信息' })
      } else if (this.form.erpAuthOrderDetails.some(item => ['BNK', 'BNK1', 'BNK5'].includes(item.moduleCode) && item.unionChannel === '')) {
        this.$message({ type: 'warning', message: '模块是BNK、BNK1、BNK5时, 银联通道不能为空' })
      } else {
        const insufficientObj = this.form.erpAuthOrderDetails.filter(item => item.authNum > item.orderInventory)
        if (insufficientObj.length > 0) {
          this.$confirm(`[${insufficientObj[0].moduleName}]的库存不足，当前库存: ${insufficientObj[0].orderInventory}`, {
            title: '系统提示',
            type: 'warning',
            confirmButtonText: '去采购',
            cancelButtonText: '返回修改',
            beforeClose: (action, instance, done) => {
              if (action === 'confirm') this.$router.push({ name: 'softwarePurchaseDetails', query: { status: 'add', productCode: insufficientObj[0].productCode } })
              else this.$refs.information.getProductStock()
              done()
            }
          }).catch(() => {})
        } else {
          const { merchantId, productCode } = this.form.erpAuthMerchantDTO
          return {
            authOrderVO: Object.assign(this.handleQueryParams().authOrderVO, { merchantId, productCode, orderStatus: 0, productType: 1, useModal: -1 }),
            orderDetailVos: this.handleQueryParams().orderDetailVos
          }
        }
      }
    },
    handleQueryParams() {
      const { handMan, inventoryAmount, id, billNo } = this.form.authOrderDTO
      return {
        authOrderVO: { handMan, inventoryAmount, agentId: this.userBaseInfo.agentId, createUser: this.userBaseInfo.id, id, billNo },
        orderDetailVos: this.form[this.productType === 1 ? 'erpAuthOrderDetails' : 'detailDTOList']
      }
    },
    setOrderSave(action = 1) {
      let data = {}
      const status = this.$route.query.status === 'add'
      if (this.productType === 1) data = this.getErpInformationObj()
      else if (this.productType === 3) data = this.getWlsInformationObj()
      else if (this.productType === 4) data = this.getWcyInformationObj()
      else if (this.productType === 5) data = this.getYsInformationObj()
      if (!data) return new Promise((resolve, reject) => reject(new Error()))
      return status ? this.baseInfoMap.get(this.productType).addRequest(data) : this.baseInfoMap.get(this.productType).updateRequest(data, action)
    },
    handleSave() {
      this.checkSaveBtnLoad = true
      this.setOrderSave()
        .then(res => {
          if (this.$route.query.status === 'add') {
            this.$router.replace({ name: this.$route.name, query: { id: res, productType: this.productType, orderStatus: 0, status: 'edit' } })
            document.querySelector('.e-tag_active span').innerText = `软件授权订单/编辑`
          }
          this.getDetail()
          this.$message({ type: 'success', message: '保存成功' })
        })
        .catch(() => {})
        .finally(() => {
          this.checkSaveBtnLoad = false
        })
    },
    async getDetail() {
      try {
        this.checkBasicInformLoad = true
        const res = await this.baseInfoMap.get(this.productType).detailRequest(this.$route.query.id)
        this.form = res
        setTimeout(() => {
          if (this.productType === 1) {
            this.$refs.information.$refs.selectPage.selectVal = res?.erpAuthMerchantDTO?.merchantName ?? ''
            console.info(document.querySelectorAll('.js-unionChannel'))
            if (res.erpAuthOrderDetails.length > 0) {
              res.erpAuthOrderDetails.forEach((item, index) => {
                if (item.unionChannel) document.querySelectorAll('.js-unionChannel')[index].childNodes[0].childNodes[1].childNodes[1].value = item.unionChannelName
              })
            }
          }
          if (this.productType === 5) this.$refs.information.$refs.selectPage.selectVal = res?.merchantDTO?.merchantName ?? ''
        }, 500)
        this.$nextTick(() => {
          if (this.productType === 3) {
            this.form.merchantDTO.applicationModule = res.authOrderDTO.useModal
            this.form.merchantDTO.merchantId = res.authOrderDTO.merchantId
            this.form.merchantDTO.productCode = res.authOrderDTO.productCode
          } else if (this.productType === 4) {
            this.form.merchantDTO.applicationModule = res.authOrderDTO.useModal
          } else if (this.productType === 5) {
            this.form.merchantDTO.applicationSystem = res.authOrderDTO.useModal
          }
        })
      } catch (error) {
      } finally {
        this.checkBasicInformLoad = false
      }
    },
    async getHandlerMan() {
      try {
        const { id = '', contactor = '', mobile = '' } = await queryHandlerMan({ area: this.userBaseInfo.districtCode })
        this.form.authOrderDTO.handMan = id
        this.form.authOrderDTO.handManName = `${contactor}${mobile ? '（' + mobile + '）' : ''}`
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
.e-product {
  &-choose {
    text-align: right;
    padding-bottom: 10px;
    margin-top: -10px;
  }
  &-tip {
    color: #8c919c;
    font-size: 14px;
  }
  &_remark {
    width: 100%;
    /deep/ .el-input__inner {
      text-align: left !important;
    }
  }
}
</style>
