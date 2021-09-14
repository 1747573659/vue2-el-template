<template>
  <section class="p-hardware-con" v-loading="checkBasicInformLoad">
    <el-card shadow="never" class="p-card">
      <div slot="header" class="p-card-head">
        <div>
          <span class="p-card-title">订单信息</span>
          <span class="p-card-back" v-if="$route.query.status !== 'add' && form.purchaseOrderDTO.remark">（订单被退回，原因：{{ form.purchaseOrderDTO.remark }}）</span>
        </div>
        <div class="p-card-state">
          <span>订单状态：</span>
          <span class="p-card-state_text">{{ currentOrderStatus }}</span>
        </div>
      </div>
      <el-form :model="form" size="small" disabled :inline="true" label-suffix=":" label-width="110px">
        <el-form-item label="单据编码">
          <el-input :value="form.purchaseOrderDTO.billNo" placeholder="保存后自动生成"></el-input>
        </el-form-item>
        <el-form-item label="订单日期">
          <el-input :value="`${form.purchaseOrderDTO.createOrderTime ? form.purchaseOrderDTO.createOrderTime : baseOrderTime}`"></el-input>
        </el-form-item>
        <el-form-item label="订单金额">
          <el-input :value="form.purchaseOrderDTO.orderAmount"></el-input>
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
          <el-input
            :value="`${form.purchaseOrderDTO.agentPaperMoney}${form.purchaseOrderDTO.agentPaperGiftMoney ? '（另有赠金' + form.purchaseOrderDTO.agentPaperGiftMoney + '）' : ''}`"
          ></el-input>
        </el-form-item>
        <el-form-item label="未核销担保金">
          <el-input :value="form.purchaseOrderDTO.agentGuaranteeMoney"></el-input>
        </el-form-item>
        <el-form-item label="付款状态">
          <el-input :value="form.purchaseOrderDTO.payStatus"></el-input>
        </el-form-item>
        <el-form-item label="付款时间">
          <el-input :value="form.purchaseOrderDTO.payTime"></el-input>
        </el-form-item>
        <el-form-item label="付款方式">
          <el-input :value="form.purchaseOrderDTO.payMethod"></el-input>
        </el-form-item>
        <el-form-item label="收款人">
          <el-input :value="form.purchaseOrderDTO.receiveMoneyPeople"></el-input>
        </el-form-item>
        <el-form-item label="使用余额">
          <el-input :value="form.purchaseOrderDTO.useBalance"></el-input>
        </el-form-item>
        <el-form-item label="使用担保金">
          <el-input :value="form.purchaseOrderDTO.useGuarantee"></el-input>
        </el-form-item>
        <el-form-item label="经销商">
          <el-input :value="`${'[' + form.purchaseOrderDTO.agentId + ']'}${form.purchaseOrderDTO.agentName}`"></el-input>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card shadow="never" class="p-card">
      <div slot="header" class="p-card-head">
        <el-button type="text" size="small" v-if="['add', 'edit'].includes($route.query.status)" @click="handleProductVisible">选择产品</el-button>
        <span v-else class="p-card-title">订单明细</span>
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
            <el-input v-else size="small" v-model.number.trim="scope.row.productCount" @blur="handleCountAmount(scope.row)" style="width: 100%;"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="productPrice" label="单价" align="right">
          <template slot-scope="scope">
            <span v-if="$route.query.status === 'detail'">{{ scope.row.productPrice }}</span>
            <el-input v-else size="small" v-model.number.trim="scope.row.productPrice" @blur="handleCountAmount(scope.row)" style="width: 100%;"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="productAmount" label="金额" align="right">
          <template slot-scope="scope">
            <span v-if="$route.query.status === 'detail'">{{ scope.row.productAmount }}</span>
            <el-input v-else size="small" v-model.number.trim="scope.row.productAmount" @blur="handleAmount(scope.row)" style="width: 100%;"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="备注">
          <template slot-scope="scope">
            <span v-if="$route.query.status === 'detail'">{{ scope.row.remark }}</span>
            <template v-else>
              <el-input size="small" v-model="scope.row.remark" maxlength="100" placeholder="备注内容，可以叉清空" class="p-hardware-product_remark"></el-input>
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
      <el-button size="small" type="primary" v-if="$route.query.status === 'edit'" :loading="checkVerifyBtnLoad" @click="handleVerify">提交</el-button>
      <template v-if="$route.query.status === 'detail' && form.purchaseOrderDTO.payStatus === 2 && form.purchaseOrderDTO.goodsStatus === 20">
        <el-button size="small" type="primary" @click="handleReceipt">确认收货</el-button>
      </template>
    </div>
    <purchase-product v-if="['add', 'edit'].includes($route.query.status)" ref="product" :visible.sync="checkProductVisible" @productData="handleProductList" />
  </section>
</template>

<script>
import { basicInfoMixin } from '../../mixins/basicInfoMixin'

export default {
  mixins:[basicInfoMixin],
}
</script>

<style lang="scss" scoped>
.p-card {
  border-radius: 0;
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
  &-address {
    .el-button {
      margin-left: 20px;
      font-size: 14px;
    }
  }
  &-back {
    color: red;
  }
  /deep/ {
    .el-card__header {
      padding: 15px 67px 15px 16px;
    }
  }
}
.p-hardware {
  &-con {
    border-bottom: 72px solid #f7f8fa;
  }
  &-action {
    width: calc(100% - 200px - 42px);
    height: 56px;
    position: fixed;
    bottom: 0;
    background-color: #fff;
    line-height: 56px;
    text-align: center;
    box-shadow: 0px -1px 2px 0px rgba(0, 0, 0, 0.03);
    /deep/ .el-button {
      padding: 8px 22px;
    }
  }
  &-product {
    &_remark {
      width: 100%;
      /deep/ .el-input__inner {
        text-align: left !important;
      }
    }
    /deep/ {
      .el-input__inner {
        text-align: right;
      }
      .el-table__footer-wrapper tbody td {
        background-color: #fff;
      }
    }
  }
}
</style>
