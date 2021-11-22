<template>
  <section class="p-information-con" v-loading="checkBasicInformLoad">
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
        <el-form-item label="申请库存">
          <el-input :value="form.orderDTO.useInventory"></el-input>
        </el-form-item>
        <el-form-item label="受理人">
          <el-input :value="form.orderDTO.handlerUserName"></el-input>
        </el-form-item>
        <el-form-item label="经销商">
          <el-input disabled :value="`${userInfo.agentId ? '[' + userInfo.agentId + ']' : ''}${userInfo.name}`"></el-input>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card shadow="never" class="p-card">
      <div slot="header">订单明细 <span class="e-product-tip" v-if="$route.query.status !== 'audit'">(提示：每次只能申请一种产品，如要更换请先删除已选产品)</span></div>
      <div class="e-product-choose" v-if="['add', 'edit'].includes($route.query.status)">
        <el-button type="primary" size="small" plain :disabled="form.orderDetailDtos.length > 0" @click="handleProductVisible">选择产品</el-button>
      </div>
      <el-table :data="form.orderDetailDtos" class="p-information-tab">
        <el-table-column label="序号" width="100">
          <template slot-scope="scope">{{ scope.$index + 1 }}</template>
        </el-table-column>
        <el-table-column label="申请产品">
          <template slot-scope="scope">{{ `${scope.row.productCode ? '[' + scope.row.productCode + ']' : ''}${scope.row.productCodeName || ''}` }}</template>
        </el-table-column>
        <el-table-column prop="timingInventory" label="下单时库存" v-if="userInfo.level === 1"></el-table-column>
        <el-table-column prop="replaceNum" label="申请数量" align="right">
          <template slot-scope="scope">
            <el-input
              size="small"
              v-model.number.trim="scope.row.useInventory"
              @change="handleReplaceNum(scope.row)"
              :disabled="['audit', 'detail'].includes($route.query.status)"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column label="备注">
          <template slot-scope="scope">
            <el-input size="small" v-model="scope.row.remark" maxlength="100" :disabled="$route.query.status === 'detail'" clearable class="e-product_remark"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" v-if="!['audit', 'detail'].includes($route.query.status)" width="100">
          <template slot-scope="scope">
            <el-popconfirm class="el-button el-button--text" @confirm="form.orderDetailDtos.splice(scope.$index, 1)" placement="top-start" title="确定删除所选数据吗？">
              <el-button type="text" size="small" slot="reference">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <div class="p-infomation-action">
      <el-button size="small" plain @click="handleCancel('softwareInventoryApply')">{{ $route.query.status === 'detail' ? '关闭' : '取消' }}</el-button>
      <el-button size="small" type="primary" plain v-if="['add', 'edit', 'audit'].includes($route.query.status)" :loading="checkSaveBtnLoad" @click="handleSave">保存</el-button>
      <template v-if="$route.query.status === 'edit'" v-permission="'SOFTWARE_INVENTORY_REPLACE_SUBMIT'">
        <el-button size="small" type="primary" :loading="checkVerifyBtnLoad" @click="handleVerify">提交</el-button>
      </template>
      <template v-if="$route.query.status === 'audit'" v-permission="'SOFTWARE_INVENTORY_REPLACE_AUDIT'">
        <el-button size="small" type="primary" :loading="checkAuditBtnLoad" @click="handleReview">审核</el-button>
      </template>
    </div>
    <template v-if="['add', 'edit'].includes($route.query.status)">
      <inventory-product ref="product" :visible.sync="checkProductVisible" @productData="handleProductList" />
    </template>
    <el-dialog :destroy-on-close="true" :visible.sync="checkAuditOpinionVisible" @closed="verifyRemark = ''" title="订单审核意见" width="600px" class="e-dialog-audit">
      <el-input type="textarea" v-model="verifyRemark" placeholder="请填写你的意见" :rows="4" maxlength="100"></el-input>
      <div slot="footer">
        <el-button @click="checkAuditOpinionVisible = false" size="small">取消</el-button>
        <el-button type="primary" plain @click="handleNoAgree" size="small">不同意</el-button>
        <el-button type="primary" @click="handleAgree" size="small">同意</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import dayjs from 'dayjs'
import { deepClone } from '@/utils'
import { orderStatus, formObj } from '../data'
import inventoryProduct from './inventoryProduct.vue'

import { queryHandlerMan } from '@/api/orderCenter/orderManagement'
import { applyOrderAdd, applyOrderUpdate, applyOrderDetail, applyOrderSubmit, applyOrderVerify } from '@/api/orderCenter/orderManagement/softwareInventoryApply'

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
      agentProductList: {},
      userInfo: JSON.parse(localStorage.userInfo),
      checkAuditBtnLoad: false,
      checkAuditOpinionVisible: false,
      verifyRemark: ''
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
    if (this.$route.query.status !== 'add') this.getDetail()
  },
  methods: {
    async handleAgree() {
      try {
        await applyOrderVerify({ id: this.$route.query.id, reason: this.verifyRemark, result: 0 })
        this.$router.replace({ name: this.$route.name, query: { id: this.$route.query.id, orderStatus: 20, status: 'detail' } })
        this.$message({ type: 'success', message: '审核成功' })
      } catch (error) {
      } finally {
        this.checkAuditOpinionVisible = false
      }
    },
    async handleNoAgree() {
      if (!this.verifyRemark) {
        this.$message({ type: 'warning', message: '审核意见不能为空' })
      } else {
        try {
          await applyOrderVerify({ id: this.$route.query.id, reason: this.verifyRemark, result: 1 })
          this.$store.dispatch('delTagView', this.$route).then(() => this.$router.push({ name: 'softwareInventoryApply' }))
          this.$message({ type: 'success', message: '订单退回成功' })
        } catch (error) {
        } finally {
          this.checkAuditOpinionVisible = false
        }
      }
    },
    handleReview() {
      this.checkReviewStatus = true
      this.setOrderSave()
        .then(() => {
          this.checkAuditOpinionVisible = true
        })
        .catch(() => {})
        .finally(() => {
          this.checkReviewStatus = false
        })
    },
    handleCancel(name) {
      this.$store.dispatch('delTagView', this.$route).then(() => this.$router.push({ name }))
    },
    async handleSave() {
      this.setOrderSave()
        .then(res => {
          this.checkSaveBtnLoad = true
          if (this.$route.query.status === 'add') {
            this.$router.replace({ name: this.$route.name, query: { id: res, orderStatus: 0, status: 'edit' } })
            document.querySelector('.e-tag_active span').innerText = `软件库存置换单/编辑`
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
      try {
        // const agentProductObj = await queryByAgentProduct({ agentId: this.form.orderDTO.agentId, productCode: this.form.orderDetailDtos[0].productCode })
        // if (agentProductObj) {
        //   if (this.form.orderDetailDtos[0].useInventory > agentProductObj.totalAmount) {
        //     this.form.orderDetailDtos[0].orderInventory = agentProductObj.totalAmount
        //     this.$message({ type: 'warning', message: `[${this.form.orderDetailDtos[0].productCodeName}]的库存不足，请修改后重试` })
        //     return new Promise((resolve, reject) => reject(new Error()))
        //   } else {
        //   }
        // } else {
        //   this.$message({ type: 'warning', message: '换购产品库存不足，请先下单' })
        //   return new Promise((resolve, reject) => reject(new Error()))
        // }
        const data = {
          orderDTO: { ...this.form.orderDTO, createUser: this.userInfo.id },
          detailList: this.form.orderDetailDtos
        }
        if (this.userInfo.level === 2) {
          data.orderDTO.agentId = this.userInfo.agentId
          data.orderDTO.parentAgentId = this.userInfo.topAgentId
        }
        return this.$route.query.status === 'add' ? applyOrderAdd(data) : applyOrderUpdate(data)
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
                await applyOrderSubmit({ id: parseFloat(this.$route.query.id) })
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
    },
    handleProductVisible() {
      this.checkProductVisible = true
      this.$refs.product.productVal = ''
      this.$refs.product.tableData = []
      this.$refs.product.getProductPage()
    },
    handleReplaceNum(row) {
      if (!/^\+?[1-9]{1}[0-9]{0,2}\d{0,0}$/.test(row.useInventory)) {
        this.$message({ type: 'warning', message: '申请数量范围为[1-999]' })
        row.useInventory = 1
      } else this.form.orderDTO.useInventory = row.useInventory
    },
    // handleReplaceProductName(val) {
    //   let [replaceableNum, useInventory] = ['', '']
    //   if (val) {
    //     if (this.agentProductList) {
    //       this.replaceProduct = this.replacedProducts.filter(item => item.replaceProductCode === val)[0]
    //       replaceableNum = Math.floor(NP.divide(this.agentProductList?.commonAmount??0, this.replaceProduct.reduceInventory))
    //       useInventory = NP.times(1, this.replaceProduct.reduceInventory)
    //     }
    //   }
    //   this.form.orderDetailDtos[0].replaceNum = 1
    //   this.form.orderDetailDtos[0].replaceableNum = replaceableNum || 0
    //   this.form.orderDetailDtos[0].useInventory = useInventory || 0
    //   this.form.orderDTO.useInventory = useInventory || 0
    // },
    async handleProductList(data) {
      if (data) {
        this.form.orderDetailDtos = [
          {
            agentId: this.userInfo.agentId,
            parentAgentId: this.userInfo.topAgentId,
            productCode: data.code,
            productCodeName: data.name,
            useInventory: 1,
            remark: ''
          }
        ]
        if (this.$route.query.status === 'edit') {
          this.form.orderDetailDtos[0].billNo = this.form.orderDTO.billNo
        }
        this.form.orderDTO.useInventory = 1
      }
    },
    async getDetail() {
      try {
        this.checkBasicInformLoad = true
        const res = await applyOrderDetail(this.$route.query.id)
        this.form.orderDTO = res?.inventoryApplyOrderDTO ?? {}
        this.form.orderDetailDtos = res?.detailList ?? []
      } catch (error) {
      } finally {
        this.checkBasicInformLoad = false
      }
    },
    // async getOriginalProduct(originalProductCode) {
    //   try {
    //     const res = await replaceOrderOriginalProduct(originalProductCode)
    //     this.replacedProducts = res || []
    //   } catch (error) {}
    // },
    // async getBaseInfo() {
    //   try {
    //     const res = await queryBaseInfo()
    //     this.form.orderDTO.agentId = res.agentId
    //     this.form.orderDTO.agentName = res.name
    //     this.getHandlerMan(res.districtCode)
    //   } catch (error) {}
    // },
    async getHandlerMan() {
      try {
        const { id = '', contactor = '', mobile = '' } = await queryHandlerMan({ area: this.userInfo.districtCode })
        this.form.orderDTO.handlerUser = id
        this.form.orderDTO.handlerUserName = `${contactor}${mobile ? '（' + mobile + '）' : ''}`
      } catch (error) {}
    }
    // getSummaries(param) {
    //   const { columns, data } = param
    //   const sums = []
    //   columns.forEach((column, index) => {
    //     if (['replaceNum'].includes(column.property)) {
    //       const values = data.map(item => parseFloat(item[column.property]))
    //       if (!values.every(value => isNaN(value))) {
    //         sums[index] = values.reduce((prev, curr) => {
    //           const value = Number(curr)
    //           if (!isNaN(value)) {
    //             return NP.plus(prev, curr)
    //           } else {
    //             return prev
    //           }
    //         }, 0)
    //       }
    //     }
    //   })
    //   return sums
    // }
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
      .el-input {
        width: 100%;
      }
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
.e-dialog-audit {
  /deep/ {
    .el-dialog__body {
      padding: 10px 20px 8px;
    }
  }
}
</style>
