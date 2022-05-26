<template>
  <section class="p-information-con" style="padding-bottom: 72px" v-loading="checkBasicInformLoad">
    <el-card shadow="never" class="p-card">
      <div slot="header" class="p-card-head">
        <div class="p-card-reason">
          <span class="p-card-title">订单信息</span>
          <span class="p-card-back" v-if="$route.query.status !== 'add' && form.authOrderDTO.remark">（订单被退回，原因：{{ form.authOrderDTO.remark }}）</span>
        </div>
        <div class="p-card-state">
          <span>订单状态：</span>
          <span class="p-card-state_text">{{ currentOrderStatus }}</span>
        </div>
      </div>
      <el-form :model="form" size="small" :inline="true" label-suffix=":" label-width="110px">
        <el-form-item label="订单编码">
          <el-input :value="form.authOrderDTO.billNo" disabled placeholder="保存后自动生成"></el-input>
        </el-form-item>
        <el-form-item label="订单时间">
          <el-input :value="`${form.authOrderDTO.createOrderTime || baseOrderTime}`" disabled></el-input>
        </el-form-item>
        <el-form-item label="消耗库存">
          <el-input :value="form.authOrderDTO.inventoryAmount" disabled></el-input>
        </el-form-item>
        <el-form-item label="受理人">
          <el-input :value="form.authOrderDTO.handManName" disabled></el-input>
        </el-form-item>
        <template v-if="Number($route.query.productType) === 6">
          <el-form-item label="经销商">
            <el-input :value="`${userInfo.agentId ? '[' + userInfo.agentId + ']' : ''}${userInfo.name}`" disabled></el-input>
          </el-form-item>
          <el-form-item label="主产品" class="is-required">
            <km-select-page
              ref="productCode"
              v-model="form.authOrderDTO.productCode"
              :modelName="form.authOrderDTO.productCode"
              option-label="name"
              option-value="code"
              :data.sync="licensedProducts"
              :request="getProductByPage"
              :is-max-page.sync="isLicensedProductMaxPage"
              placeholder=""
              :disabled="$route.query.status === 'detail'" />
          </el-form-item>
        </template>
        <el-form-item label="备注">
          <el-input v-model="form.authOrderDTO.backRemark" :disabled="$route.query.status === 'detail'" type="text" maxlength="100" clearable></el-input>
        </el-form-item>
      </el-form>
    </el-card>
    <component ref="information" :is="activeName" :form="form" :userInfo="userInfo"></component>
    <div class="p-infomation-action">
      <el-button size="small" plain @click="handleCancel('softwareAuthorization')">{{ $route.query.status === 'detail' ? '关闭' : '取消' }}</el-button>
      <el-button size="small" @click="handleDelRow" v-if="$route.query.status === 'edit'">删除</el-button>
      <template v-if="['add', 'edit'].includes($route.query.status)">
        <el-button size="small" type="primary" plain :disabled="isWlsDisableStatus" :loading="checkSaveBtnLoad" @click="handleSave"> 保存 </el-button>
      </template>
      <template v-if="$route.query.status === 'edit'">
        <el-button size="small" type="primary" :disabled="isWlsDisableStatus" v-permission="'SOFTWARE_AUTHORIZATION_SUBMIT'" :loading="checkVerifyBtnLoad" @click="handleVerify">
          提交
        </el-button>
      </template>
    </div>
  </section>
</template>

<script>
import { mapActions } from 'vuex'
import dayjs from 'dayjs'
import { deepClone } from '@/utils'
import { orderStatus, formErpObj, formWlsOrWcyObj, formYsObj, formDongleObj } from '../data'
import erpInformation from './erpInformation.vue'
import retailInformation from './retailInformation.vue'
import repastInformation from './repastInformation.vue'
import cloundInformation from './cloundInformation.vue'
import dongleInformation from './dongleInformation.vue'

import { queryHandlerMan } from '@/api/orderCenter/orderManagement'
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
  authOrderYsSubmit,
  authOrderDogAdd,
  authOrderDogById,
  authOrderDogUpdate,
  authOrderDogSubmit,
  authOrderDelete,
  authOrderProductPage
} from '@/api/orderCenter/orderManagement/softwareAuthorization'

export default {
  components: {
    erpInformation,
    retailInformation,
    repastInformation,
    cloundInformation,
    dongleInformation
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
        ],
        [
          6,
          {
            componentName: 'dongleInformation',
            detailRequest: authOrderDogById,
            updateRequest: authOrderDogUpdate,
            verifyRequest: authOrderDogSubmit,
            addRequest: authOrderDogAdd,
            form: formDongleObj
          }
        ]
      ]),
      checkSaveBtnLoad: false,
      checkVerifyBtnLoad: false,
      userInfo: JSON.parse(localStorage.userInfo),
      productLists: JSON.parse(localStorage?.softWareProductList ?? '[]'),
      licensedProducts: [],
      isLicensedProductMaxPage: false
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
    isWlsDisableStatus() {
      return this.productType === 3 && this.form.merchantDTO.applicationModule === 2 && this.form.detailDTOList.length > 0 && this.form.detailDTOList[0].openCustAssistantApp === 1
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
    ...mapActions(['updateTagView']),
    handleDelRow() {
      this.$confirm('确定要删除吗？', '删除', {
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            authOrderDelete(this.form.authOrderDTO.id)
              .then(() => {
                this.$message({ type: 'success', message: '删除成功' })
                this.$store.dispatch('delTagView', this.$route).then(() => this.$router.push({ name: 'softwareAuthorization' }))
              })
              .finally(() => {
                instance.confirmButtonLoading = false
                done()
              })
          } else done()
        }
      }).catch(() => {})
    },
    handleVerify() {
      const erpHCMModule =
        this.productType === 1 &&
        ['HCMJK10', 'HCM', 'HCM11', 'KSH'].includes(this.form.erpAuthMerchantDTO.productCode) &&
        [0, 1].includes(parseFloat(this.form.erpAuthMerchantDTO.useModalInner))
      if (erpHCMModule) {
        if (!this.form.erpAuthOrderDetails.some(item => item.moduleCode === 'ZBMK')) {
          this.$message({ type: 'warning', message: '请选择"总部模块"后再提交' })
          return
        }
      }
      if (
        this.productType === 1 &&
        [0, 1].includes(parseFloat(this.form.erpAuthMerchantDTO.useModalInner)) &&
        this.$refs.information.shopPageData.length > 0 &&
        !this.$refs.information.shopPageData.find(item => item.custId === this.form.erpAuthMerchantDTO.merchantId).custName
      ) {
        if (!this.form.erpAuthOrderDetails.some(item => item.moduleCode === 'ZBMK')) {
          this.$message({ type: 'warning', message: '请在ERP完善营业执照后再操作' })
          return
        }
      }
      this.$confirm('请再次确认加点数量，一经提交不可撤回', '提示', {
        type: 'warning'
      })
        .then(() => {
          this.setOrderSave()
            .then(async () => {
              await this.baseInfoMap.get(this.productType).verifyRequest({ id: parseFloat(this.$route.query.id), result: 0 })
              this.getDetail().then(() => {
                this.$router.replace({
                  name: this.$route.name,
                  query: {
                    id: this.$route.query.id,
                    productType: this.productType,
                    orderStatus: this.form.authOrderDTO.orderStatus,
                    status: 'detail'
                  }
                })
                this.updateTagView({ tagRoute: this.$route, title: '软件授权订单/详情' })
              })
              this.$message({ type: 'success', message: this.productType === 6 ? '提交成功，请等待商务审核' : '提交成功' })
            })
            .catch(() => {})
        })
        .catch(() => {})
    },
    handleCancel(name) {
      this.$store.dispatch('delTagView', this.$route).then(() => this.$router.push({ name }))
    },
    getDogInformationObj() {
      if (!this.form.authOrderDTO.productCode) {
        this.$message({ type: 'warning', message: '请选择主产品' })
      } else if (!this.form.detailDTOList.length) {
        this.$message({ type: 'warning', message: '请选择授权产品' })
      } else if (this.form.detailDTOList.some(item => !item.authVersion)) {
        this.$message({ type: 'warning', message: '订单明细产品版本不能为空' })
      } else if (this.form.detailDTOList.some(item => !item.dogId)) {
        this.$message({ type: 'warning', message: '订单明细加密狗ID/序列号不能为空' })
      } else {
        const insufficientObj = this.form.detailDTOList.filter(item => item.authNum > item.orderInventory)
        if (insufficientObj.length > 0) {
          const confirmOptions = Object.assign(this.handleConfirmOption(), {
            beforeClose: (action, instance, done) => {
              if (action === 'confirm') this.$router.push({ name: 'softwarePurchaseDetails', query: { status: 'add', productCode: insufficientObj[0].productCode } })
              else this.$refs.information.getProductStock()
              done()
            }
          })
          this.$confirm(`[${insufficientObj[0].productCodeName}]的库存不足，当前库存: ${insufficientObj[0].orderInventory}`, confirmOptions).catch(() => {})
        } else {
          return {
            authOrderVO: Object.assign(this.handleQueryParams().authOrderVO, { productType: 6, merchantId: '', productCode: this.form.authOrderDTO.productCode }),
            orderDetailVos: this.handleQueryParams().orderDetailVos
          }
        }
      }
    },
    getYsInformationObj() {
      if (!this.form.merchantDTO.merchantNo) {
        this.$message({ type: 'warning', message: '请选择商户' })
      } else if (!this.form.merchantDTO.applicationSystem) {
        this.$message({ type: 'warning', message: '请选择应用系统' })
      } else if (!this.form.merchantDTO.delayHour) {
        this.$message({ type: 'warning', message: '请选择延期时长' })
      } else {
        const detailDTOList = this.form.addAuthOrderDetailDTOList.concat(this.form.renewAuthOrderDetailDTOList)
        const insufficientObj = detailDTOList.filter(item => {
          return item.useInventory > (item?.orderInventory ?? this.$refs.information.productStockObj?.totalAmount)
        })
        if (insufficientObj.length > 0) {
          const confirmOptions = Object.assign(this.handleConfirmOption(), {
            beforeClose: (action, instance, done) => {
              if (action === 'confirm') {
                this.$router.push({
                  name: 'softwarePurchaseDetails',
                  query: { status: 'add', productCode: this.$refs.information.appModuleObj.productCode }
                })
              } else this.$refs.information.getProductStock()
              done()
            }
          })
          const confirmTitleMsg = `[${this.$refs.information.appModuleObj.name}]的库存不足，当前库存: ${insufficientObj[0]?.orderInventory ?? 0}`
          this.$confirm(confirmTitleMsg, confirmOptions).catch(() => {})
        } else {
          const { merchantNo: merchantId, merchantName, delayHour: delayCount, applicationSystem: useModal } = this.form.merchantDTO
          const productCode = this.$refs.information.appModulesData.find(item => item.code === useModal).productCode
          const userLevelNum = this.$refs.information.modulesUserLevel.find(item => item.value === this.form.authOrderDTO.userLevel).num
          const { useModalInner, userLevel } = this.form.authOrderDTO
          return {
            authOrderVO: Object.assign(
              this.handleQueryParams().authOrderVO,
              { orderStatus: 0, productType: 5, merchantId, merchantName, useModal, delayCount, useModalInner },
              { productCode, userLevelNum, userLevel, longValidate: [201, 205].includes(useModal) ? 100 : 0 }
            ),
            addOrderDetailVos: this.form.addAuthOrderDetailDTOList,
            renewOrderDetailVos: this.form.renewAuthOrderDetailDTOList
          }
        }
      }
    },
    getWcyInformationObj() {
      if (this.form.detailDTOList.length === 0 || !this.form.merchantDTO.merchantNo) {
        this.$message({ type: 'warning', message: '请选择正确商户或产品模块信息' })
      } else {
        const insufficientObj = this.form.detailDTOList.filter(item => item.useInventory > item.orderInventory)
        if (insufficientObj.length > 0) {
          const confirmOptions = Object.assign(this.handleConfirmOption(), {
            beforeClose: (action, instance, done) => {
              if (action === 'confirm') {
                this.$router.push({
                  name: 'softwarePurchaseDetails',
                  query: { status: 'add', productCode: this.$refs.information.merchantInfo.productCode }
                })
              } else this.$refs.information.getProductStock()
              done()
            }
          })
          let productName = ''
          if (this.productLists?.length) {
            productName = this.productLists.find(item => item.code === this.$refs.information.merchantInfo.productCode).name
          } else productName = this.$refs.information.merchantInfo.productCode
          this.$confirm(`[${productName}]的库存不足，当前库存: ${insufficientObj[0].orderInventory}`, confirmOptions).catch(() => {})
        } else {
          const { productCode } = this.form.authOrderDTO
          const { merchantNo: merchantId, applicationModule: useModal, delayHour: delayCount } = this.form.merchantDTO
          return {
            authOrderVO: Object.assign(
              this.handleQueryParams().authOrderVO,
              { orderStatus: 0, productType: 4, merchantId, useModal, delayCount, useModalInner: -1 },
              { productCode: this.$refs.information.merchantInfo.productCode || productCode }
            ),
            orderDetailVos: this.handleQueryParams().orderDetailVos
          }
        }
      }
    },
    getWlsInformationObj() {
      const {
        merchantDTO: { merchantId, merchantVersion, applicationModule: useModal, delayHour: delayCount, productCode: dtoProductCode },
        detailDTOList
      } = this.form
      const { ProductionType, productCode } = this.$refs.information.merchantInfo
      if (detailDTOList.length === 0 || !merchantId) {
        this.$message({ type: 'warning', message: '请选择商户或产品模块信息' })
      } else if (merchantVersion === '3' && [1, 3, 28, 25, 33].includes(parseFloat(ProductionType))) {
        // 微平台专业版且ERP是（1御商、33御商+、3智赢、28智赢+、25智海鲸）不能续费
        this.$message({ type: 'warning', message: '该产品目前已不受理续费，请升级上线科脉·有数，详情咨询有数渠道经理。' })
      } else {
        const insufficientObj = detailDTOList.filter(item => item.useInventory > item.orderInventory)
        if (insufficientObj.length > 0) {
          const confirmOptions = Object.assign(this.handleConfirmOption(), {
            beforeClose: (action, instance, done) => {
              if (action === 'confirm') this.$router.push({ name: 'softwarePurchaseDetails', query: { status: 'add', productCode } })
              else this.$refs.information.getProductStock()
              done()
            }
          })
          let productName = ''
          if (this.productLists?.length) productName = this.productLists.find(item => item.code === productCode).name
          else productName = productCode

          this.$confirm(`[${productName}]的库存不足，当前库存: ${insufficientObj[0].orderInventory}`, confirmOptions).catch(() => {})
        } else {
          return {
            authOrderVO: Object.assign(
              this.handleQueryParams().authOrderVO,
              { orderStatus: 0, productType: 3, merchantId, useModal, delayCount, useModalInner: -1 },
              { productCode: productCode || dtoProductCode }
            ),
            orderDetailVos: this.handleQueryParams().orderDetailVos
          }
        }
      }
    },
    getErpInformationObj() {
      const {
        erpAuthMerchantDTO: { merchantId, productCode, useModalInner, authCountType },
        erpAuthOrderDetails,
        erpStoreOrderDetailList
      } = this.form
      if (erpAuthOrderDetails.length === 0 || !merchantId) {
        this.$message({ type: 'warning', message: '请选择商户或产品模块信息' })
      } else if (erpAuthOrderDetails.some(item => ['BNK', 'BNK1', 'BNK5'].includes(item.moduleCode) && item.unionChannel === '')) {
        this.$message({ type: 'warning', message: '模块是BNK、BNK1、BNK5时, 银联通道不能为空' })
      } else if (authCountType === '1' && productCode === 'HCM11' && erpAuthOrderDetails.some(item => ['MDZD'].includes(item.moduleCode))) {
        this.$message({ type: 'warning', message: '商户已使用站点授权，不支持门店授权，请联系商务。' })
      } else if (useModalInner !== 0 && !useModalInner) {
        this.$message({ type: 'warning', message: '授权状态不能为空，请联系运维人员处理' })
      } else if (
        [0, 1].includes(parseFloat(useModalInner)) &&
        this.$refs.information.basicProductData.some(item => item.moduleId === 'MDZD') &&
        !erpAuthOrderDetails.some(item => ['MDZD'].includes(item.moduleCode))
      ) {
        this.$message({ type: 'warning', message: '请选择"门店站点"后在提交。' })
      } else {
        // 采购单多单库存扣减有问题，暂时屏蔽此逻辑
        // if (this.form.erpAuthMerchantDTO.productCode === 'HCM11') {
        //   const hcmModuleCodes = this.form.erpAuthOrderDetails.filter(item => ['MDZD', 'ZBMK'].includes(item.moduleCode))
        //   if (hcmModuleCodes.length === 2) {
        //     const hcmModuleCodesCount = hcmModuleCodes.reduce((accumulator, currentValue) => {
        //       return accumulator + currentValue.authNum
        //     }, 0)
        //     if (hcmModuleCodesCount > hcmModuleCodes[0].orderInventory) {
        //       const confirmOptions = Object.assign(this.handleConfirmOption(), {
        //         beforeClose: (action, instance, done) => {
        //           if (action === 'confirm') this.$router.push({ name: 'softwarePurchaseDetails', query: { status: 'add', productCode: 'HCM11' } })
        //           else this.$refs.information.getProductStock()
        //           done()
        //         }
        //       })
        //       this.$confirm(`[${hcmModuleCodes[0].moduleName}]的库存不足，当前库存: ${hcmModuleCodes[0].orderInventory}`, confirmOptions).catch(() => {})
        //     }
        //   }
        // }
        const insufficientObj = erpAuthOrderDetails.filter(item => item.authNum > item.orderInventory)
        if (insufficientObj.length > 0) {
          const confirmOptions = Object.assign(this.handleConfirmOption(), {
            beforeClose: (action, instance, done) => {
              if (action === 'confirm') {
                this.$router.push({ name: 'softwarePurchaseDetails', query: { status: 'add', productCode: insufficientObj[0].productCode } })
              } else this.$refs.information.getProductStock()
              done()
            }
          })
          this.$confirm(`[${insufficientObj[0].moduleName}]的库存不足，当前库存: ${insufficientObj[0].orderInventory}`, confirmOptions).catch(() => {})
        } else {
          return {
            authOrderVO: Object.assign(
              this.handleQueryParams().authOrderVO,
              { merchantId, productCode, erpStore: erpStoreOrderDetailList && erpStoreOrderDetailList.length > 0 ? 1 : 0 },
              { orderStatus: 0, productType: 1, useModal: -1, useModalInner: parseFloat(useModalInner) }
            ),
            erpStoreList: erpStoreOrderDetailList,
            orderDetailVos: this.handleQueryParams().orderDetailVos
          }
        }
      }
    },
    handleConfirmOption() {
      const optionVo = { title: '系统提示', type: 'warning', cancelButtonText: '返回修改' }
      if (this.userInfo.level === 1) optionVo.confirmButtonText = '去采购'
      else optionVo.showConfirmButton = false
      return optionVo
    },
    handleQueryParams() {
      const { handMan, inventoryAmount, id, billNo, backRemark } = this.form.authOrderDTO
      return {
        authOrderVO: { handMan, inventoryAmount, backRemark, agentId: this.userInfo.agentId, createUser: this.userInfo.id, id, billNo },
        orderDetailVos: this.form[this.productType === 1 ? 'erpAuthOrderDetails' : 'detailDTOList']
      }
    },
    setOrderSave() {
      let data = {}
      const status = this.$route.query.status === 'add'
      if (this.productType === 1) data = this.getErpInformationObj()
      else if (this.productType === 3) data = this.getWlsInformationObj()
      else if (this.productType === 4) data = this.getWcyInformationObj()
      else if (this.productType === 5) data = this.getYsInformationObj()
      else if (this.productType === 6) data = this.getDogInformationObj()
      if (!data) return new Promise((resolve, reject) => reject(new Error()))
      return status ? this.baseInfoMap.get(this.productType).addRequest(data) : this.baseInfoMap.get(this.productType).updateRequest(data)
    },
    handleSave() {
      this.checkSaveBtnLoad = true
      this.setOrderSave()
        .then(res => {
          if (this.$route.query.status === 'add') {
            this.$router.replace({ name: this.$route.name, query: { id: res, productType: this.productType, orderStatus: 0, status: 'edit' } })
            this.updateTagView({ tagRoute: this.$route, title: '软件授权订单/编辑' })
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
        this.$nextTick(() => {
          if (this.productType !== 6) {
            const selectPageVal = this.productType === 1 ? res?.erpAuthMerchantDTO?.merchantName ?? '' : res?.merchantDTO?.merchantName ?? ''
            setTimeout(() => {
              this.$refs.information.$refs.selectPage.selectVal = selectPageVal
            }, 500)
          }
          if (this.productType === 3) {
            this.form.merchantDTO.applicationModule = res.authOrderDTO.useModal
            this.form.merchantDTO.merchantId = res.authOrderDTO.merchantId
            this.form.merchantDTO.productCode = res.authOrderDTO.productCode
          } else if (this.productType === 4) {
            this.form.merchantDTO.applicationModule = res.authOrderDTO.useModal
          } else if (this.productType === 5) {
            this.form.merchantDTO.applicationSystem = res.authOrderDTO.useModal
            if ([202, 204].includes(this.form.merchantDTO.applicationSystem)) {
              if (this.form?.addAuthOrderDetailDTOList?.length > 0) this.form.merchantDTO.operationType = 1
              else if (this.form?.renewAuthOrderDetailDTOList?.length > 0) this.form.merchantDTO.operationType = 2
            }
          } else if (this.productType === 6) {
            this.getProductByPage({ query: res.authOrderDTO.productCode })
            this.$refs.productCode.selectVal = res.authOrderDTO.productCode
          }
        })
        if (this.productType === 1) {
          if (!this.form.erpStoreOrderDetailList) this.form.erpStoreOrderDetailList = []
          this.form.erpAuthMerchantDTO.useModalInner = res.authOrderDTO.useModalInner
          setTimeout(() => {
            this.$refs.information.getShopPage({ query: this.form.erpAuthMerchantDTO.merchantId })
            res.erpAuthOrderDetails.forEach((item, index) => {
              const tableRow = document.querySelectorAll('.el-table__row')[index]
              if (tableRow && item.unionChannel) {
                tableRow.querySelectorAll('.js-unionChannel')[0].childNodes[0].childNodes[1].childNodes[1].value = item.unionChannelName
              }
            })
          }, 500)
        }
      } catch (error) {
      } finally {
        this.checkBasicInformLoad = false
      }
    },
    async getHandlerMan() {
      try {
        const { id = '', contactor = '', mobile = '' } = await queryHandlerMan({ area: this.userInfo.districtCode })
        this.form.authOrderDTO.handMan = id
        this.form.authOrderDTO.handManName = `${contactor}${mobile ? '（' + mobile + '）' : ''}`
      } catch (error) {}
    },
    async getProductByPage({ query = '', page = 1, rows = 10 } = {}) {
      try {
        const res = await authOrderProductPage({ info: query, page, rows, registerMethod: 2, productTypeList: [1], type: '1' })
        if (res.results) res.results.forEach(item => (item.name = `[${item.code}]${item.name}`))
        this.licensedProducts = this.licensedProducts.concat(res.results || [])
        this.isLicensedProductMaxPage = !res?.results || (res.results && res.results.length < 10)
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
    ::v-deep {
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
  background-color: #ffffff;
  line-height: 56px;
  text-align: center;
  box-shadow: 0 -1px 2px 0 rgb(0 0 0 / 3%);
  z-index: 1000;
  ::v-deep .el-button {
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
    ::v-deep .el-input__inner {
      text-align: left !important;
    }
  }
}
</style>
