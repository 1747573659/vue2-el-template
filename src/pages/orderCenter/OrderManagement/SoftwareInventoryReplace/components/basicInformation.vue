<template>
  <section class="p-information-con" style="padding-bottom: 72px" v-loading="checkBasicInformLoad">
    <el-card shadow="never" class="p-card">
      <div slot="header" class="p-card-head">
        <div class="p-card-title">订单信息</div>
        <div class="p-card-state">
          <span>订单状态：</span>
          <span class="p-card-state_text">{{ currentOrderStatus }}</span>
        </div>
      </div>
      <el-form :model="form" size="small" disabled :inline="true" label-suffix=":" label-width="110px">
        <el-form-item label="订单编码">
          <el-input :value="form.orderDTO.billNo" placeholder="保存后自动生成"></el-input>
        </el-form-item>
        <el-form-item label="订单时间">
          <el-input :value="`${form.orderDTO.createTime || baseOrderTime}`"></el-input>
        </el-form-item>
        <el-form-item label="消耗库存">
          <el-input :value="form.orderDTO.useInventory"></el-input>
        </el-form-item>
        <el-form-item label="受理人">
          <el-input :value="form.orderDTO.handUserName"></el-input>
        </el-form-item>
        <el-form-item label="经销商">
          <el-input :value="`${form.orderDTO.agentId ? '[' + form.orderDTO.agentId + ']' : ''}${form.orderDTO.agentName}`"></el-input>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card shadow="never" class="p-card">
      <div slot="header">订单明细 <span class="e-product-tip">(提示：每次只能置换一种产品，如要更换请先删除已选产品)</span></div>
      <div class="e-product-choose" v-if="['add', 'edit'].includes($route.query.status)">
        <el-button type="primary" size="small" plain :disabled="form.orderDetailDtos.length > 0" @click="handleProductVisible">选择产品</el-button>
      </div>
      <el-table :data="form.orderDetailDtos" show-summary :summary-method="getSummaries" class="p-information-tab">
        <el-table-column label="序号" width="100">
          <template slot-scope="scope">{{ scope.$index + 1 }}</template>
        </el-table-column>
        <el-table-column label="库存产品">
          <template slot-scope="scope">{{ `${scope.row.productCode ? '[' + scope.row.productCode + ']' : ''}${scope.row.productCodeName || ''}` }}</template>
        </el-table-column>
        <el-table-column prop="orderInventory" label="库存数量" align="right"></el-table-column>
        <el-table-column label="换购产品">
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.replaceProductId"
              :disabled="$route.query.status === 'detail'"
              @change="handleReplaceProductName"
              clearable
              size="small"
              class="e-select-con">
              <template v-for="(item, index) in replacedProducts">
                <el-option :key="index" :label="`[${item.replaceProductCode}] ${item.replaceProductName}`" :value="item.replaceProductCode"></el-option>
              </template>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="replaceNum" label="换购数量" align="right">
          <template slot-scope="scope">
            <el-input
              size="small"
              v-model.number.trim="scope.row.replaceNum"
              @change="handleReplaceNum(scope.row)"
              :disabled="$route.query.status === 'detail'"
              style="width: 100%"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="备注">
          <template slot-scope="scope">
            <el-input size="small" v-model="scope.row.remark" maxlength="100" :disabled="$route.query.status === 'detail'" clearable class="e-product_remark"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" v-if="$route.query.status !== 'detail'">
          <template slot-scope="scope">
            <el-popconfirm class="el-button el-button--text" @confirm="form.orderDetailDtos.splice(scope.$index, 1)" placement="top-start" title="确定删除所选数据吗？">
              <el-button type="text" size="small" slot="reference">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <div class="p-infomation-action">
      <el-button size="small" plain @click="handleCancel('softwareInventoryReplace')">{{ $route.query.status === 'detail' ? '关闭' : '取消' }}</el-button>
      <el-button size="small" type="primary" plain v-if="['add', 'edit'].includes($route.query.status)" :loading="checkSaveBtnLoad" @click="handleSave">保存</el-button>
      <template v-if="$route.query.status === 'edit'">
        <el-button size="small" type="primary" v-permission="'SOFTWARE_INVENTORY_REPLACE_SUBMIT'" :loading="checkVerifyBtnLoad" @click="handleVerify">提交</el-button>
      </template>
    </div>
    <template v-if="['add', 'edit'].includes($route.query.status)">
      <inventory-product ref="product" :visible.sync="checkProductVisible" @productData="handleProductList" />
    </template>
  </section>
</template>

<script>
import { mapActions } from 'vuex'
import dayjs from 'dayjs'
import NP from 'number-precision'
import { deepClone } from '@/utils'
import { orderStatus, formObj } from '../data'
import inventoryProduct from './inventoryProduct'

import { queryHandlerMan, queryBaseInfo } from '@/api/orderCenter/orderManagement'
import {
  replaceOrderDetail,
  replaceOrderOriginalProduct,
  queryByAgentProduct,
  replaceOrderAdd,
  replaceOrderUpdate,
  replaceOrderSubmit
} from '@/api/orderCenter/orderManagement/softwareInventoryReplace'

export default {
  components: {
    inventoryProduct
  },
  data() {
    return {
      checkBasicInformLoad: false,
      baseOrderTime: dayjs().format('YYYY-MM-DD'),
      form: deepClone(formObj),
      checkSaveBtnLoad: false,
      checkVerifyBtnLoad: false,
      checkProductVisible: false,
      replacedProducts: [],
      generalInventory: 10,
      replaceProduct: {},
      agentProductList: {}
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
    if (this.$route.query.status === 'add') this.getBaseInfo()
    else this.getDetail()
  },
  methods: {
    ...mapActions(['updateTagView']),
    handleCancel(name) {
      this.$store.dispatch('delTagView', this.$route).then(() => this.$router.push({ name }))
    },
    async handleSave() {
      this.setOrderSave()
        .then(res => {
          this.checkSaveBtnLoad = true
          if (this.$route.query.status === 'add') {
            this.$router.replace({ name: this.$route.name, query: { id: res, orderStatus: 0, status: 'edit' } })
            this.updateTagView({ tagRoute: this.$route, title: '库存换购订单/编辑' })
          }
          this.getDetail()
          this.$message({ type: 'success', message: '保存成功' })
        })
        .catch(() => {})
        .finally(() => {
          this.checkSaveBtnLoad = false
        })
    },
    async setOrderSave(action = 1) {
      if (this.form.orderDetailDtos.length === 0) {
        this.$message({ type: 'warning', message: '请选择置换产品' })
        return new Promise((resolve, reject) => reject(new Error()))
      }
      if (!this.form.orderDetailDtos[0].replaceProductId) {
        this.$message({ type: 'warning', message: '换购产品不能为空' })
        return new Promise((resolve, reject) => reject(new Error()))
      }
      try {
        const agentProductObj = await queryByAgentProduct({ agentId: this.form.orderDTO.agentId, productCode: this.form.orderDetailDtos[0].productCode })
        if (agentProductObj) {
          if (this.form.orderDetailDtos[0].useInventory > agentProductObj.totalAmount) {
            this.form.orderDetailDtos[0].orderInventory = agentProductObj.totalAmount
            this.$message({ type: 'warning', message: `[${this.form.orderDetailDtos[0].productCodeName}]的库存不足，请修改后重试` })
            return new Promise((resolve, reject) => reject(new Error()))
          } else {
            const data = { orderVO: { ...this.form.orderDTO, orderType: 0, createUser: JSON.parse(localStorage.userInfo).id }, detailVos: this.form.orderDetailDtos }
            return this.$route.query.status === 'add' ? replaceOrderAdd(data) : replaceOrderUpdate(data, action)
          }
        } else {
          this.$message({ type: 'warning', message: '换购产品库存不足，请先下单' })
          return new Promise((resolve, reject) => reject(new Error()))
        }
      } catch (error) {}
    },
    handleVerify() {
      this.$confirm('确定要提交吗？', '提示', {
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            this.setOrderSave()
              .then(async () => {
                await replaceOrderSubmit({ id: parseFloat(this.$route.query.id) })
                this.getDetail().then(() => {
                  this.$router.replace({ name: this.$route.name, query: { id: this.$route.query.id, orderStatus: 30, status: 'detail' } })
                })
                this.$message({ type: 'success', message: '审核成功' })
              })
              .catch(() => {})
              .finally(() => {
                instance.confirmButtonLoading = false
                done()
              })
          } else done()
        }
      }).catch(() => {})
    },
    handleProductVisible() {
      this.checkProductVisible = true
      this.$refs.product.productVal = ''
      this.$refs.product.tableData = []
      this.$refs.product.getProductPage()
    },
    handleReplaceNum(row) {
      if (!row.replaceProductId) this.$message({ type: 'warning', message: '请选择换购产品' })
      else if (row.replaceableNum < row.replaceNum) {
        this.$message({ type: 'warning', message: '可换数量不能大于实换数量' })
        row.replaceNum = row.replaceableNum
      } else if (!/^\+?[1-9]{1}[0-9]{0,2}\d{0,0}$/.test(row.replaceNum)) {
        this.$message({ type: 'warning', message: '实换数量范围为[1-999]' })
        row.replaceNum = 1
      } else {
        const replaceNum = NP.times(parseFloat(row.replaceNum), this.replaceProduct.reduceInventory)
        this.form.orderDTO.useInventory = replaceNum
        return (row.useInventory = replaceNum)
      }
    },
    handleReplaceProductName(val) {
      let [replaceableNum, useInventory] = ['', '']
      if (val) {
        if (this.agentProductList) {
          this.replaceProduct = this.replacedProducts.filter(item => item.replaceProductCode === val)[0]
          replaceableNum = Math.floor(NP.divide(this.agentProductList?.commonAmount ?? 0, this.replaceProduct.reduceInventory))
          useInventory = NP.times(1, this.replaceProduct.reduceInventory)
        }
      }
      this.form.orderDetailDtos[0].replaceNum = 1
      this.form.orderDetailDtos[0].replaceableNum = replaceableNum || 0
      this.form.orderDetailDtos[0].useInventory = useInventory || 0
      this.form.orderDTO.useInventory = useInventory || 0
    },
    async handleProductList(data) {
      if (data) {
        this.agentProductList = await queryByAgentProduct({ agentId: this.form.orderDTO.agentId, productCode: data.productId })
        this.getOriginalProduct(data.productId).then(() => {
          this.form.orderDetailDtos = [
            {
              productCode: data.productId,
              productCodeName: data.productName,
              replaceNum: 1,
              replaceProductId: '',
              replaceProductName: '',
              orderInventory: NP.minus(this.agentProductList?.commonAmount ?? 0, this.agentProductList?.commonLimitAmount ?? 0),
              replaceableNum: 0,
              useInventory: 0,
              remark: ''
            }
          ]
          this.form.orderDTO.useInventory = 0
        })
      }
    },
    async getDetail() {
      try {
        this.checkBasicInformLoad = true
        const res = await replaceOrderDetail(this.$route.query.id)
        this.form.orderDTO = res?.orderDTO ?? {}
        this.form.orderDetailDtos = res?.orderDetailDtos ?? []
        this.getOriginalProduct(res.orderDetailDtos[0].productCode)
      } catch (error) {
      } finally {
        this.checkBasicInformLoad = false
      }
    },
    async getOriginalProduct(originalProductCode) {
      try {
        const res = await replaceOrderOriginalProduct(originalProductCode)
        this.replacedProducts =
          res.map(item => {
            item.replaceProductCode = item.replaceProductCode.toUpperCase()
            return item
          }) || []
      } catch (error) {}
    },
    async getBaseInfo() {
      try {
        const res = await queryBaseInfo()
        this.form.orderDTO.agentId = res.agentId
        this.form.orderDTO.agentName = res.name
        this.getHandlerMan(res.districtCode)
      } catch (error) {}
    },
    async getHandlerMan(area) {
      try {
        const { id = '', contactor = '', mobile = '' } = await queryHandlerMan({ area })
        this.form.orderDTO.handUser = id
        this.form.orderDTO.handUserName = `${contactor}${mobile ? '（' + mobile + '）' : ''}`
      } catch (error) {}
    },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (['replaceNum'].includes(column.property)) {
          const values = data.map(item => parseFloat(item[column.property]))
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                return NP.plus(prev, curr)
              } else {
                return prev
              }
            }, 0)
          }
        }
      })
      return sums
    }
  }
}
</script>

<style lang="scss" scoped>
.p-information {
  &-con {
    border-bottom: 72px solid #fff;
  }
  &-tab {
    ::v-deep {
      .el-input__inner {
        text-align: right;
      }
      .el-table__footer-wrapper tbody td {
        background-color: #fff;
      }
    }
    .e-select-con {
      ::v-deep .el-input {
        width: 100%;
        max-width: 240px;
        &__inner {
          text-align: left;
        }
      }
    }
  }
}
.p-card {
  border-top: 16px solid #f7f8fa;
  &-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
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
    max-width: 240px;
    ::v-deep .el-input__inner {
      text-align: left !important;
    }
  }
}
</style>
