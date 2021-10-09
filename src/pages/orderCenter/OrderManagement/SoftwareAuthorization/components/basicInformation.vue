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
          <el-input :value="form.purchaseOrderDTO.billNo" placeholder="保存后自动生成"></el-input>
        </el-form-item>
        <el-form-item label="订单时间">
          <el-input :value="`${form.purchaseOrderDTO.createOrderTime || baseOrderTime}`"></el-input>
        </el-form-item>
        <el-form-item label="消耗库存">
          <el-input :value="form.purchaseOrderDTO.consumeInventory"></el-input>
        </el-form-item>
        <el-form-item label="受理人">
          <el-input :value="form.purchaseOrderDTO.handUserName"></el-input>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card shadow="never" class="p-card">
      <div slot="header" class="p-card-head">
        <span class="p-card-title">商户信息</span>
      </div>
      <el-form :model="form" size="small" :inline="true" label-suffix=":" label-width="110px">
        <el-form-item label="经销商">
          <el-input disabled :value="`${form.purchaseOrderDTO.agentId ? '[' + form.purchaseOrderDTO.agentId + ']' : ''}${form.purchaseOrderDTO.agentName}`"></el-input>
        </el-form-item>
        <el-form-item label="商户名称">
          <km-select-page
            v-model="form.createUser"
            :data.sync="ordererData"
            option-label="contactor"
            option-value="id"
            :request="handleOrderPage"
            :is-max-page.sync="isOrdererMaxPage"
            placeholder="下单人"
          />
        </el-form-item>
        <el-form-item label="商户号">
          <el-input :value="form.purchaseOrderDTO.agentId" disabled></el-input>
        </el-form-item>
        <el-form-item label="应用系统" v-if="$route.query.type === 'clound'">
          <km-select-page
            v-model="form.createUser"
            :data.sync="ordererData"
            option-label="contactor"
            option-value="id"
            :request="handleOrderPage"
            :is-max-page.sync="isOrdererMaxPage"
            placeholder="下单人"
          />
        </el-form-item>
        <el-form-item label="授权状态" v-if="['erp', 'clound'].includes($route.query.type)">
          <el-input :value="form.purchaseOrderDTO.payMethod" disabled></el-input>
        </el-form-item>
        <template v-if="$route.query.type === 'erp'">
          <el-form-item label="产品">
            <el-input :value="form.purchaseOrderDTO.receiveMoneyPeopleName" disabled></el-input>
          </el-form-item>
          <el-form-item label="门店授权站点">
            <el-input :value="form.purchaseOrderDTO.receiveMoneyPeopleName" disabled></el-input>
          </el-form-item>
        </template>
        <template v-if="['retail', 'repast'].includes($route.query.type)">
          <el-form-item label="商户版本">
            <el-input :value="form.purchaseOrderDTO.useGuarantee"></el-input>
          </el-form-item>
          <el-form-item label="关联产品">
            <el-input :value="form.purchaseOrderDTO.agentId"></el-input>
          </el-form-item>
          <el-form-item label="门店总数">
            <el-input :value="form.purchaseOrderDTO.agentId"></el-input>
          </el-form-item>
          <el-form-item label="应用模块">
            <el-input :value="`${form.purchaseOrderDTO.agentId ? '[' + form.purchaseOrderDTO.agentId + ']' : ''}${form.purchaseOrderDTO.agentName}`"></el-input>
          </el-form-item>
        </template>
        <el-form-item label="延期时长" v-if="$route.query.type !== 'erp'">
          <el-select v-model="form.delayTime" clearable>
            <el-option v-for="item in delayTimes" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card shadow="never" class="p-card">
      <div slot="header">订单明细</div>
      <div class="e-product-choose" v-if="['add', 'edit'].includes($route.query.status)">
        <el-button type="primary" size="small" plain @click="handleProductVisible">选择产品</el-button>
        <el-button type="primary" size="small" plain @click="handleProductVisible">刷新库存</el-button>
      </div>
      <el-table v-if="$route.query.type === 'erp'" :data="form.orderItemList" show-summary :summary-method="getSummaries" class="p-information-tab">
        <el-table-column label="序号" width="100">
          <template slot-scope="scope">{{ scope.$index + 1 }}</template>
        </el-table-column>
        <el-table-column prop="moduleCode" label="模块编码"></el-table-column>
        <el-table-column prop="moduleName" label="模块名称"></el-table-column>
        <el-table-column prop="authorizedPoints" label="已授权点数" align="right"></el-table-column>
        <el-table-column prop="orderInventory" label="下单时库存" align="right"></el-table-column>
        <el-table-column prop="numberOfAuthorizations" label="本次授权数量" align="right">
          <template slot-scope="scope">
            <span v-if="$route.query.status === 'detail'">{{ scope.row.numberOfAuthorizations }}</span>
            <el-input v-else size="small" v-model.number.trim="scope.row.numberOfAuthorizations" style="width:100%"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="unionPayChannel" label="银联通道"></el-table-column>
        <el-table-column label="备注">
          <template slot-scope="scope">
            <span v-if="$route.query.status === 'detail'">{{ scope.row.remark }}</span>
            <el-input v-else size="small" v-model="scope.row.remark" maxlength="100" clearable class="e-product_remark"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" v-if="$route.query.status !== 'detail'">
          <template slot-scope="scope">
            <el-popconfirm class="el-button el-button--text" @confirm="form.orderItemList.splice(scope.$index, 1)" placement="top-start" title="确定删除所选数据吗？">
              <el-button type="text" size="small" slot="reference">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <div class="p-infomation-action">
      <el-button size="small" plain @click="handleCancel('hardwarePurchaseOrder')">{{ $route.query.status === 'detail' ? '关闭' : '取消' }}</el-button>
      <el-button size="small" type="primary" plain v-if="['add', 'edit'].includes($route.query.status)" :loading="checkSaveBtnLoad" @click="handleSave">保存</el-button>
      <el-button size="small" type="primary" v-if="$route.query.status === 'edit'" :loading="checkVerifyBtnLoad" @click="handleVerify">提交</el-button>
    </div>
    <template v-if="['add', 'edit'].includes($route.query.status)">
      <!-- <inventory-product ref="product" :visible.sync="checkProductVisible" @productData="handleProductList" /> -->
    </template>
  </section>
</template>

<script>
import dayjs from 'dayjs'
import NP from 'number-precision'
import { orderStatus, formObj, delayTimes } from '../data'
import { deepClone } from '@/utils'

import { queryOrderMan } from '@/api/orderCenter/orderManagement'

export default {
  data() {
    return {
      delayTimes,
      baseOrderTime: dayjs().format('YYYY-MM-DD'),
      form: deepClone(formObj),
      checkSaveBtnLoad: false,
      ordererData: [],
      isOrdererMaxPage: false,
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
  methods: {
    handleCancel() {},
    handleSave() {},
    handleVerify() {},
    handleProductVisible() {
      this.checkProductVisible = true
      this.$refs.product.basicProductData = []
      this.$refs.product.getProductPage()
    },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (['authorizedPoints', 'numberOfAuthorizations'].includes(column.property)) {
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
            this.form.purchaseOrderDTO.consumeInventory = sums[6]
          }
        }
      })
      return sums
    },
    async handleOrderPage({ query = '', page = 1, row = 10 } = {}) {
      try {
        const res = await queryOrderMan({ id: query, agentId: this.cueerntAgentId, page, rows: row })
        this.ordererData = this.ordererData.concat(res.results || [])
        if (this.ordererData.every(item => item.contactor !== '全部')) {
          this.ordererData = [{ contactor: '全部', id: -1 }].concat(this.ordererData)
        }
        this.isOrdererMaxPage = !res.results || (res.results && res.results.length < 10)
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
