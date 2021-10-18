<template>
  <section class="p-information-con">
    <el-card shadow="never" class="p-card">
      <div slot="header" class="p-card-head">
        <div class="p-card-title">订单信息</div>
        <div class="p-card-state">
          <span>订单状态：</span>
          <span class="p-card-state_text">{{ currentOrderStatus }}</span>
        </div>
      </div>
      <el-form :model="form" size="small" disabled :inline="true" label-suffix=":" label-width="110px">
        <el-form-item label="单据编码">
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
        <el-form-item label="升级费用">
          <el-input :value="form.orderDTO.upgradeFee"></el-input>
        </el-form-item>
        <el-form-item label="经销商">
          <el-input :value="`${form.orderDTO.agentId ? '[' + form.orderDTO.agentId + ']' : ''}${form.orderDTO.agentName}`"></el-input>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card shadow="never" class="p-card">
      <div slot="header">订单明细 <span class="e-product-tip">(提示：每次只能置换一种产品，如要更换请先删除已选产品)</span></div>
      <div class="e-product-choose" v-if="['add', 'edit'].includes($route.query.status)">
        <el-button type="primary" size="small" plain @click="handleProductVisible">选择产品</el-button>
        <!-- <el-button type="primary" size="small" plain :disabled="form.orderDetailDtos.length > 0" @click="handleProductVisible">选择产品</el-button> -->
      </div>
      <el-table :data="form.orderDetailDtos" show-summary :summary-method="getSummaries" class="p-information-tab">
        <el-table-column label="序号" width="100">
          <template slot-scope="scope">{{ scope.$index + 1 }}</template>
        </el-table-column>
        <el-table-column label="置换产品">
          <template slot-scope="scope">{{ `${scope.row.productCode ? '[' + scope.row.productCode + ']' : ''}${scope.row.productCodeName || ''}` }}</template>
        </el-table-column>
        <el-table-column label="置换数量" align="right">
          <template slot-scope="scope">
            <span v-if="$route.query.status === 'detail'">{{ scope.row.replaceNum }}</span>
            <el-input v-else size="small" v-model.number.trim="scope.row.replaceNum" @change="handleReplaceNum(scope.row)" style="width:100%"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="被换产品">
          <template slot-scope="scope">
            <span v-if="$route.query.status === 'detail'">{{ scope.row.replaceProductName }}</span>
            <el-select v-else v-model="scope.row.replaceProductId" @change="handleReplaceProductName" clearable size="small" class="e-select-con">
              <template v-for="(item, index) in replacedProducts">
                <el-option :key="index" :label="`[${item.replaceProductCode}] ${item.replaceProductName}`" :value="item.replaceProductCode"></el-option>
              </template>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="orderInventory" label="下单时库存" align="right"></el-table-column>
        <el-table-column prop="replaceableNum" label="可置换数量" align="right"></el-table-column>
        <el-table-column prop="useInventory" label="消耗库存" align="right"></el-table-column>
        <el-table-column label="备注">
          <template slot-scope="scope">
            <span v-if="$route.query.status === 'detail'">{{ scope.row.remark }}</span>
            <el-input v-else size="small" v-model="scope.row.remark" maxlength="100" clearable class="e-product_remark"></el-input>
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
      <el-button size="small" type="primary" v-if="$route.query.status === 'edit'" :loading="checkVerifyBtnLoad" @click="handleVerify">提交</el-button>
    </div>
    <template v-if="['add', 'edit'].includes($route.query.status)">
      <inventory-product ref="product" :visible.sync="checkProductVisible" @productData="handleProductList" />
    </template>
  </section>
</template>

<script>
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
  replaceOrderUpdate
} from '@/api/orderCenter/orderManagement/softwareInventoryReplace'

export default {
  components: {
    inventoryProduct
  },
  data() {
    return {
      baseOrderTime: dayjs().format('YYYY-MM-DD'),
      form: deepClone(formObj),
      checkSaveBtnLoad: false,
      checkVerifyBtnLoad: false,
      checkProductVisible: false,
      replacedProducts: [],
      generalInventory: 10,
      replaceProduct: {}
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
    handleCancel(name) {
      this.$store.dispatch('delTagView', this.$route).then(() => this.$router.push({ name }))
    },
    async handleSave() {
      try {
        this.checkSaveBtnLoad = true
        const agentProductObj = await queryByAgentProduct({ agentId: this.form.orderDTO.agentId, productCode: this.form.orderDetailDtos[0].productCode })
        if (this.form.orderDetailDtos[0].useInventory > agentProductObj.totalAmount) {
          this.$message({ type: 'warning', message: `[${this.form.orderDetailDtos[0].productCodeName}]的库存不足，请修改后重试` })
        } else {
          const data = { orderVO: { ...this.form.orderDTO, orderType: 0, createUser: JSON.parse(localStorage.userInfo).id }, detailVos: this.form.orderDetailDtos }
          const res = this.$route.query.status === 'add' ? await replaceOrderAdd(data) : await replaceOrderUpdate(data)
          if (this.$route.query.status === 'add') {
            this.$router.replace({ name: this.$route.name, query: { id: res, orderStatus: '', status: 'edit' } })
            document.querySelector('.e-tag_active span').innerText = `软件库存置换单/编辑`
          }
          this.getDetail()
          this.$message({ type: 'success', message: '保存成功' })
        }
      } catch (error) {
      } finally {
        this.checkSaveBtnLoad = false
      }
    },
    async setOrderSave() {
      try {
        const agentProductObj = await queryByAgentProduct({ agentId: this.form.orderDTO.agentId, productCode: this.form.orderDetailDtos[0].productCode })
        if (this.form.orderDetailDtos[0].useInventory > agentProductObj.totalAmount) {
          this.$message({ type: 'warning', message: `[${this.form.orderDetailDtos[0].productCodeName}]的库存不足，请修改后重试` })
        } else {
          if (this.$route.query.status === 'audit') {
            const data = Object.assign({ orderVO: { orderType: 0 } }, { detailVos: this.form.orderDetailDtos })
            return await replaceOrderAdd(data).then(() => this.$message({ type: 'success', message: '保存成功' }))
          }
          return await replaceOrderAdd({
            orderVO: { ...this.form.orderDTO, orderType: 0, createUser: JSON.parse(localStorage.userInfo).id },
            detailVos: this.form.orderDetailDtos
          }).then(() => this.$message({ type: 'success', message: '保存成功' }))
        }
      } catch (error) {}
    },
    handleVerify() {
      this.$confirm('确定要提交吗？', '提示', {
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            this.$message({ type: 'success', message: '审核成功' })
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
      if (!this.replaceProduct.reduceInventory) this.$message({ type: 'warning', message: '请选择被换产品' })
      else return (row.useInventory = NP.divide(NP.times(parseFloat(row.replaceNum), this.replaceProduct.reduceInventory), this.replaceProduct.addInventory))
    },
    async handleReplaceProductName(val) {
      const res = await queryByAgentProduct({ agentId: this.form.orderDTO.agentId, productCode: this.form.orderDetailDtos[0].productCode })
      this.replaceProduct = this.replacedProducts.filter(item => item.replaceProductCode === val)[0]
      const replaceableNum = NP.times(NP.divide(res.totalAmount, this.replaceProduct.reduceInventory), this.replaceProduct.addInventory)
      const useInventory = NP.divide(NP.times(0, this.replaceProduct.reduceInventory), this.replaceProduct.addInventory)
      this.$set(this.form.orderDetailDtos[0], 'orderInventory', res.totalAmount)
      this.$set(this.form.orderDetailDtos[0], 'replaceableNum', replaceableNum)
      this.$set(this.form.orderDetailDtos[0], 'useInventory', useInventory)
    },
    handleProductList(data) {
      if (data) {
        this.getOriginalProduct(data.productId)
        this.form.orderDetailDtos = this.form.orderDetailDtos.concat({ productCode: data.productId, productCodeName: data.productName })
      }
    },
    async getOriginalProduct(originalProductCode) {
      try {
        const res = await replaceOrderOriginalProduct(originalProductCode)
        this.replacedProducts = res
      } catch (error) {}
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
        if (['useInventory'].includes(column.property)) {
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
            this.form.orderDTO.useInventory = sums[6]
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
    /deep/ {
      .el-input__inner {
        text-align: right;
      }
      .el-table__footer-wrapper tbody td {
        background-color: #fff;
      }
    }
    .e-select-con {
      /deep/ .el-input {
        width: 100%;
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
