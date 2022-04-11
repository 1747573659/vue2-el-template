<template>
  <section class="p-hardware-con" v-loading="checkBasicInformLoad">
    <el-card shadow="never" class="p-card">
      <div slot="header" class="p-card-head">
        <div class="p-card-reason">
          <span class="p-card-title">订单信息</span>
          <span class="p-card-back" v-if="$route.query.status !== 'add' && form.purchaseOrderDTO.remark">（订单被退回，原因：{{ form.purchaseOrderDTO.remark }}）</span>
        </div>
        <div class="p-card-state">
          <span>订单状态：</span>
          <span class="p-card-state_text">{{ currentOrderStatus }}</span>
        </div>
      </div>
      <el-form :model="form" size="small" disabled :inline="true" label-suffix=":" label-width="110px">
        <el-form-item label="订单编码">
          <el-input :value="form.purchaseOrderDTO.billNo" placeholder="保存后自动生成"></el-input>
        </el-form-item>
        <el-form-item label="订单日期">
          <el-input :value="`${form.purchaseOrderDTO.createOrderTime || baseOrderTime}`"></el-input>
        </el-form-item>
        <el-form-item label="订单金额">
          <el-input :value="form.purchaseOrderDTO.orderAmount | formatAmount"></el-input>
        </el-form-item>
        <el-form-item label="受理人">
          <el-input :value="form.purchaseOrderDTO.handUserName"></el-input>
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
          <el-input :value="form.purchaseOrderDTO.agentGuaranteeMoney | formatAmount"></el-input>
        </el-form-item>
        <el-form-item label="付款状态">
          <el-input :value="`${form.purchaseOrderDTO.payStatus ? paymentStatus.get(form.purchaseOrderDTO.payStatus).label : '未付款'}`"></el-input>
        </el-form-item>
        <el-form-item label="付款时间">
          <el-input :value="form.purchaseOrderDTO.payTime"></el-input>
        </el-form-item>
        <el-form-item label="付款方式">
          <el-input :value="form.purchaseOrderDTO.payMethod"></el-input>
        </el-form-item>
        <el-form-item label="收款人">
          <el-input :value="form.purchaseOrderDTO.receiveMoneyPeopleName"></el-input>
        </el-form-item>
        <el-form-item label="使用余额">
          <el-input :value="useAmount"></el-input>
        </el-form-item>
        <el-form-item label="使用担保金">
          <el-input :value="form.purchaseOrderDTO.useGuarantee | formatAmount"></el-input>
        </el-form-item>
        <el-form-item label="经销商">
          <el-input :value="`${form.purchaseOrderDTO.agentId ? '[' + form.purchaseOrderDTO.agentId + ']' : ''}${form.purchaseOrderDTO.agentName}`"></el-input>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card shadow="never" class="p-card">
      <div slot="header" class="p-card-head">订单明细</div>
      <div class="e-card-product">
        <el-button type="primary" size="small" plain @click="handleProductVisible" v-if="['add', 'edit'].includes($route.query.status)">选择产品</el-button>
      </div>
      <el-table :data="form.orderItemList" show-summary :summary-method="getSummaries" class="p-hardware-product">
        <el-table-column label="序号" width="100">
          <template slot-scope="scope">{{ scope.$index + 1 }}</template>
        </el-table-column>
        <el-table-column prop="productCode" label="产品编码"></el-table-column>
        <el-table-column prop="productName" label="产品名称"></el-table-column>
        <el-table-column prop="productCount" label="采购数量" align="right">
          <template slot-scope="scope">
            <span v-if="$route.query.status === 'detail'">{{ scope.row.productCount }}</span>
            <el-input v-else size="small" v-model.number.trim="scope.row.productCount" @change="handleCountAmount(scope.row)" style="width: 100%"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="productPrice" label="单价" align="right">
          <template slot-scope="scope">
            <span v-if="$route.query.status === 'detail'">{{ scope.row.productPrice }}</span>
            <el-input v-else size="small" v-model.trim="scope.row.productPrice" @change="handleCountAmount(scope.row)" style="width: 100%"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="productAmount" label="金额" align="right">
          <template slot-scope="scope">
            <span v-if="$route.query.status === 'detail'">{{ scope.row.productAmount }}</span>
            <el-input v-else size="small" v-model.trim="scope.row.productAmount" @change="handleAmount(scope.row)" style="width: 100%"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="备注">
          <template slot-scope="scope">
            <span v-if="$route.query.status === 'detail'">{{ scope.row.remark }}</span>
            <template v-else>
              <el-input size="small" v-model="scope.row.remark" maxlength="100" class="p-hardware-product_remark"></el-input>
            </template>
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
    <div class="p-hardware-action">
      <el-button size="small" plain @click="handleCancel('softwarePurchaseOrder')">{{ $route.query.status === 'detail' ? '关闭' : '取消' }}</el-button>
      <el-button size="small" plain v-if="$route.query.status === 'edit'" @click="handleDel('softwarePurchaseOrder')">删除</el-button>
      <el-button size="small" type="primary" plain v-if="['add', 'edit'].includes($route.query.status)" :loading="checkSaveBtnLoad" @click="handleSave">保存</el-button>
      <template v-if="$route.query.status === 'edit'">
        <el-button size="small" type="primary" v-permission="'SOFT_PURCHASE_ORDER_SUBMIT'" :loading="checkVerifyBtnLoad" @click="handleVerify">提交</el-button>
      </template>
      <template v-if="$route.query.status === 'detail' && form.purchaseOrderDTO.payStatus === 2 && form.purchaseOrderDTO.goodsStatus === 20">
        <el-button size="small" type="primary" @click="handleReceipt">确认收货</el-button>
      </template>
    </div>
    <purchase-product v-if="['add', 'edit'].includes($route.query.status)" ref="product" :visible.sync="checkProductVisible" @productData="handleProductList" />
  </section>
</template>

<script>
import NP from 'number-precision'
import { basicInfoMixin } from '../../mixins/basicInfoMixin'
import { productInfo } from '@/api/orderCenter/orderManagement'

export default {
  mixins: [basicInfoMixin],
  activated() {
    if (this.$route.query.productCode) this.handleToStock()
  },
  mounted() {
    if (this.$route.query.productCode) this.handleToStock()
  },
  methods: {
    async handleToStock() {
      if (this.form.id) delete this.form.id
      if (this.form.purchaseOrderDTO.id) delete this.form.purchaseOrderDTO.id
      try {
        const { results = [] } = await productInfo({ info: this.$route.query.productCode.trim(), page: 1, rows: 10, orderType: 1 })
        if (results?.length) {
          this.form.orderItemList = [
            {
              productCode: results[0].code,
              productName: results[0].name,
              productCount: 1,
              productPrice: NP.divide(results[0].saleAmount, 100),
              productAmount: NP.divide(NP.times(1, results[0].saleAmount), 100),
              sourcePrice: NP.times(1, results[0].saleAmount),
              remark: ''
            }
          ]
        }
      } catch (error) {}
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../scss/basicInfo.scss';
.p-hardware {
  &-con {
    padding-bottom: 72px;
  }
}
</style>
