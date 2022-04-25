<template>
  <section class="p-information-con" style="padding-bottom: 72px" v-loading="checkBasicInformLoad">
    <el-card shadow="never" class="p-card">
      <div slot="header" class="p-card-head">
        <div class="p-card-reason">
          <span class="p-card-title">订单信息</span>
          <span class="p-card-back" v-if="$route.query.status !== 'add' && form.orderDTO.remark">（订单被退回，原因：{{ form.orderDTO.remark }}）</span>
        </div>
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
        <el-form-item>
          <template slot="label">{{ userInfo.level === 1 ? '消耗' : '申请' }}库存</template>
          <el-input :value="form.orderDTO.useInventory"></el-input>
        </el-form-item>
        <el-form-item label="受理人">
          <el-input :value="form.orderDTO.handlerUserName"></el-input>
        </el-form-item>
        <el-form-item label="申请经销商">
          <el-input disabled :value="`${form.orderDTO.agentId ? '[' + form.orderDTO.agentId + ']' : ''}${form.orderDTO.agentName}`"></el-input>
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
        <el-table-column prop="timingInventory" label="库存数量" align="right" v-if="userInfo.level === 1">
          <template slot="header">
            <section>
              <span>库存数量</span>
              <el-tooltip effect="dark" placement="top">
                <div slot="content">通用无限期库存数量</div>
                <img :src="questionIcon" alt="提示" class="e-icon-question" />
              </el-tooltip>
            </section>
          </template>
        </el-table-column>
        <el-table-column label="申请数量" align="right">
          <template slot-scope="scope">
            <template v-if="userInfo.level === 1 || ['detail'].includes($route.query.status)">{{ scope.row.useInventory }}</template>
            <el-input v-else size="small" v-model.number.trim="scope.row.useInventory" @change="handleReplaceNum(scope.row)"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="备注">
          <template slot-scope="scope">
            <span v-if="$route.query.status === 'detail'">{{ scope.row.remark }}</span>
            <el-input v-else size="small" v-model="scope.row.remark" maxlength="100" clearable class="e-product_remark"></el-input>
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
      <template v-if="$route.query.status === 'edit'">
        <el-button size="small" type="primary" v-permission="'SOFTWARE_INVENTORY_APPLY_SUBMIT'" :loading="checkVerifyBtnLoad" @click="handleVerify">提交</el-button>
      </template>
      <template v-if="$route.query.status === 'audit'">
        <el-button size="small" type="primary" v-permission="'SOFTWARE_INVENTORY_APPLY_AUDIT'" :loading="checkAuditBtnLoad" @click="handleReview">审核</el-button>
      </template>
    </div>
    <template v-if="['add', 'edit'].includes($route.query.status)">
      <inventory-product ref="product" :visible.sync="checkProductVisible" @productData="handleProductList" />
    </template>
    <el-dialog :destroy-on-close="true" :visible.sync="checkAuditOpinionVisible" @closed="verifyRemark = ''" title="订单审核意见" width="500px" class="e-dialog-audit">
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
import { mapActions } from 'vuex'
import dayjs from 'dayjs'
import NP from 'number-precision'
import { deepClone } from '@/utils'
import { orderStatus, formObj } from '../data'
import inventoryProduct from './inventoryProduct.vue'

import { queryHandlerMan } from '@/api/orderCenter/orderManagement'
import {
  applyOrderAdd,
  applyOrderUpdate,
  applyOrderDetail,
  applyOrderSubmit,
  applyOrderVerify,
  queryByAgentProduct
} from '@/api/orderCenter/orderManagement/softwareInventoryApply'

export default {
  components: {
    inventoryProduct
  },
  data() {
    return {
      questionIcon: require('@/assets/images/icon/questioin.png'),
      userInfo: JSON.parse(localStorage.userInfo),
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
    else this.getDetail()
  },
  methods: {
    ...mapActions(['updateTagView']),
    async getProductStock() {
      try {
        const res = await queryByAgentProduct({ agentId: this.userInfo.agentId, productCode: this.form.orderDetailDtos[0].productCode })
        this.form.orderDetailDtos[0].timingInventory = NP.minus(res?.commonAmount ?? 0, res?.commonLimitAmount ?? 0)
      } catch (error) {}
    },
    async handleAgree() {
      try {
        await this.getProductStock()
        await this.setOrderSave()
        await applyOrderVerify({ id: this.$route.query.id, reason: this.verifyRemark, result: 0 })
        this.$router.replace({ name: this.$route.name, query: { id: this.$route.query.id, orderStatus: 20, status: 'detail' } })
        this.getDetail()
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
      this.checkAuditOpinionVisible = true
    },
    handleCancel(name) {
      this.$store.dispatch('delTagView', this.$route).then(() => this.$router.push({ name }))
    },
    async handleSave() {
      if (!this.form.orderDetailDtos?.length) {
        this.$message({ type: 'warning', message: '请选择申请产品' })
        return
      }
      this.setOrderSave()
        .then(res => {
          this.checkSaveBtnLoad = true
          if (this.$route.query.status === 'add') {
            this.$router.replace({ name: this.$route.name, query: { id: res, orderStatus: 0, status: 'edit' } })
            this.updateTagView({ tagRoute: this.$route, title: '软件分销订单/编辑' })
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
      try {
        let data = { orderDTO: { ...this.form.orderDTO }, detailList: this.form.orderDetailDtos }
        if (this.userInfo.level === 2) {
          const { id, agentId, topAgentId } = this.userInfo
          data.orderDTO = Object.assign(data.orderDTO, { createUser: id, agentId, parentAgentId: topAgentId })
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
        if (this.$route.query.status === 'edit') this.form.orderDetailDtos[0].billNo = this.form.orderDTO.billNo
        this.form.orderDTO.useInventory = 1
      }
    },
    async getDetail() {
      try {
        this.checkBasicInformLoad = true
        const res = await applyOrderDetail(this.$route.query.id)
        this.form.orderDetailDtos = res?.detailList ?? []
        this.form.orderDTO = res?.inventoryApplyOrderDTO ?? {}
        if (this.$route.query.status === 'audit') this.getProductStock()
      } catch (error) {
      } finally {
        this.checkBasicInformLoad = false
      }
    },
    async getHandlerMan() {
      try {
        const { id = '', contactor = '', mobile = '' } = await queryHandlerMan({ area: this.userInfo.districtCode })
        this.form.orderDTO.handlerUser = id
        this.form.orderDTO.handlerUserName = `${contactor}${mobile ? '（' + mobile + '）' : ''}`
      } catch (error) {}
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
      .el-input {
        width: 100%;
        max-width: 240px;
      }
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
.e-dialog-audit {
  ::v-deep {
    .el-dialog__body {
      padding: 10px 20px 8px;
    }
  }
}
.e-icon-question {
  width: 14px;
  height: 14px;
  margin: 4px 0 0 5px;
}
</style>
