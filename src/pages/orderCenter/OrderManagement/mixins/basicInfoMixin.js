import dayjs from 'dayjs'
import NP from 'number-precision'
import { deepClone } from '@/utils'
import { orderStatus, formObj, paymentStatus } from '../index'
import purchaseProduct from '../components/purchaseProduct.vue'

import {
  queryAgentMoneyStream,
  queryHandlerMan,
  purchaseAdd,
  purchaseQueryById,
  purchaseSubmit,
  purchaseUpdate,
  deleteById,
  queryBaseInfo
} from '@/api/orderCenter/orderManagement'

export const basicInfoMixin = {
  components: {
    purchaseProduct
  },
  data() {
    return {
      paymentStatus,
      baseOrderTime: dayjs().format('YYYY-MM-DD'),
      checkBasicInformLoad: false,
      handUserInfo: {},
      form: deepClone(formObj),
      checkSaveBtnLoad: false,
      checkVerifyBtnLoad: false,
      checkProductVisible: false
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
      const agentPaperGiftMoney = this.form.purchaseOrderDTO.agentPaperGiftMoney
        ? '（另有赠金' + this.$options.filters['formatAmount'](this.form.purchaseOrderDTO.agentPaperGiftMoney) + '）'
        : ''
      return this.$options.filters['formatAmount'](this.form.purchaseOrderDTO.agentPaperMoney) + agentPaperGiftMoney
    },
    useAmount() {
      const useAmountGift = this.form.purchaseOrderDTO.useAmountGift
        ? '（另扣赠金' + this.$options.filters['formatAmount'](this.form.purchaseOrderDTO.useAmountGift) + '）'
        : ''
      return this.$options.filters['formatAmount'](this.form.purchaseOrderDTO.useAmount) + useAmountGift
    }
  },
  mounted() {
    if (this.$route.query.status === 'add') {
      this.getBaseInfo().then(() => {
        this.getHandlerMan()
        this.getAgentMoneyStream()
        if (this.$route.name === 'hardwarePurchaseDetails') {
          this.$refs.address.getReceiverAddress().then(() => {
            this.$refs.address.setInitAddress()
          })
        }
      })
    } else this.handleDetail()
  },
  methods: {
    handleSave() {
      const saveAction = async () => {
        if (this.form.orderItemList?.length === 0) {
          this.$message({ type: 'warning', message: '请选择采购的产品' })
        } else {
          try {
            this.form.purchaseOrderDTO.orderType = this.$route.name === 'hardwarePurchaseDetails' ? 0 : 1
            this.checkSaveBtnLoad = true
            const { orderItemList, ...params } = this.form
            const deepOrderItemList = deepClone(orderItemList)
            deepOrderItemList.forEach(item => {
              item.productPrice = NP.times(parseFloat(item.productPrice), 100)
              item.productAmount = NP.times(parseFloat(item.productAmount), 100)
            })
            const {
              purchaseOrderDTO: { id, orderStatus }
            } =
              this.$route.query.status === 'add'
                ? await purchaseAdd(Object.assign(params, { orderItemList: deepOrderItemList }))
                : await purchaseUpdate(Object.assign(params, { orderItemList: deepOrderItemList }))
            if (this.$route.query.status === 'add') {
              this.$router.replace({ name: this.$route.name, query: { id, orderStatus, status: 'edit' } })
              document.querySelector('.e-tag_active span').innerText = `${
                this.$route.name === 'hardwarePurchaseDetails' ? '硬件' : '软件'
              }采购订单/编辑`
            }
            this.handleDetail()
            this.$message({ type: 'success', message: '保存成功' })
          } catch (error) {
          } finally {
            this.checkSaveBtnLoad = false
          }
        }
      }
      if (this.$route.name === 'hardwarePurchaseDetails') {
        this.$refs.receiptForm.validate(async valid => {
          if (valid) saveAction()
        })
      } else saveAction()
    },
    async handleVerify() {
      try {
        this.form.purchaseOrderDTO.orderType = this.$route.name === 'hardwarePurchaseDetails' ? 0 : 1
        this.checkVerifyBtnLoad = true
        const { orderItemList, ...params } = this.form
        const deepOrderItemList = deepClone(orderItemList)
        deepOrderItemList.forEach(item => {
          item.productPrice = NP.times(parseFloat(item.productPrice), 100)
          item.productAmount = NP.times(parseFloat(item.productAmount), 100)
        })
        await purchaseSubmit(Object.assign(params, { orderItemList: deepOrderItemList }))
        this.handleDetail().then(() => {
          this.$router.replace({
            name: this.$route.name,
            query: { id: this.form.purchaseOrderDTO.id, orderStatus: this.form.purchaseOrderDTO.orderStatus, status: 'detail' }
          })
        })
        this.$message({ type: 'success', message: '提交成功' })
      } catch (error) {
      } finally {
        this.checkVerifyBtnLoad = false
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
              await deleteById({ id: parseFloat(this.$route.query.id) })
              this.$message({ type: 'success', message: '删除成功' })
              this.$store.dispatch('delTagView', this.$route).then(() => this.$router.push({ name }))
            } catch (error) {
            } finally {
              instance.confirmButtonLoading = false
              done()
            }
          } else done()
        }
      })
    },
    async handleDetail() {
      try {
        this.checkBasicInformLoad = true
        const { orderItemList = [], purchaseOrderDTO } = await purchaseQueryById({ from: false, id: parseFloat(this.$route.query.id) })
        this.form.id = purchaseOrderDTO.id
        this.form.purchaseOrderDTO = purchaseOrderDTO
        this.form.orderItemList = orderItemList.map(item => {
          item.productPrice = NP.divide(item.productPrice, 100)
          item.productAmount = NP.divide(item.productAmount, 100)
          return item
        })
        if (this.$route.name === 'hardwarePurchaseDetails') {
          this.areaList = [purchaseOrderDTO.province, purchaseOrderDTO.city, purchaseOrderDTO.area]
          this.areaKey = Symbol('areaKey')
        }
      } catch (error) {
      } finally {
        this.checkBasicInformLoad = false
      }
    },
    handleProductList(data) {
      if (data.length > 0) {
        data.forEach(item => {
          item.productPrice = NP.divide(item.productPrice, 100)
          item.productAmount = NP.divide(item.productAmount, 100)
        })
        this.form.orderItemList = this.form.orderItemList.concat(data)
      }
    },
    handleProductVisible() {
      this.checkProductVisible = true
      this.$refs.product.basicProductData = []
      this.$refs.product.getProductPage()
    },
    handleCountAmount(row, scope = '') {
      if (scope && scope === 99999 && !/^\+?[1-9]{1}[0-9]{0,4}\d{0,0}$/.test(row.productCount)) {
        this.$message({ type: 'warning', message: '有效采购数量范围为[1-99999]' })
        row.productCount = 1
      }
      if (!/^([0-9]\d{0,6}?)(\.\d{1,2})?$/.test(row.productPrice)) {
        this.$message({ type: 'warning', message: '有效单价范围为[0, 9999999.99]' })
        row.productPrice = 0
      }
      row.productPrice = NP.round(row.productPrice, 2)
      return (row.productAmount = NP.round(NP.times(row.productCount, parseFloat(row.productPrice)), 2))
    },
    handleAmount(row) {
      if (!/^([0-9]\d{0,9}?)(\.\d{1,2})?$/.test(row.productAmount)) {
        this.$message({ type: 'warning', message: '有效金额范围为[0, 9999999999.99]' })
        row.productAmount = 0
      }
      row.productAmount = NP.round(row.productAmount, 2)
      return (row.productPrice = NP.round(NP.divide(parseFloat(row.productAmount), parseFloat(row.productCount)), 2))
    },
    getHandlerMan: async function () {
      try {
        const { id = '', contactor = '', mobile = '' } = await queryHandlerMan({ area: this.handUserInfo.districtCode })
        this.form.purchaseOrderDTO.handUser = id
        this.form.purchaseOrderDTO.handUserName = `${contactor}${mobile ? '（' + mobile + '）' : ''}`
      } catch (error) {}
    },
    getAgentMoneyStream: async function () {
      try {
        const { paperMoney, paperMoneyGift, noQualityGuaranteeMoney } = await queryAgentMoneyStream({ agentId: this.handUserInfo.agentId })
        this.form.purchaseOrderDTO.agentPaperMoney = paperMoney
        this.form.purchaseOrderDTO.agentPaperGiftMoney = paperMoneyGift
        this.form.purchaseOrderDTO.agentGuaranteeMoney = noQualityGuaranteeMoney
      } catch (error) {}
    },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (['productCount', 'productAmount'].includes(column.property)) {
          const values = data.map(item => parseFloat(item[column.property]))
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                return column.property === 'productCount' || this.$route.query.status !== 'details'
                  ? NP.plus(prev, curr)
                  : this.$options.filters['formatAmount'](NP.plus(prev, curr))
              } else {
                return column.property === 'productCount' || this.$route.query.status !== 'details'
                  ? prev
                  : this.$options.filters['formatAmount'](prev)
              }
            }, 0)
            this.form.purchaseOrderDTO.orderAmount = sums[5] ? NP.times(sums[5], 100) : 0
          }
        }
      })
      return sums
    },
    async getBaseInfo() {
      try {
        const res = await queryBaseInfo()
        this.handUserInfo = res
        this.form.purchaseOrderDTO.agentId = res.agentId
        this.form.purchaseOrderDTO.agentName = res.name
      } catch (error) {}
    }
  }
}
