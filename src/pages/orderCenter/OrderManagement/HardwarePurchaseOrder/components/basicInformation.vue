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
        <div class="p-card-address">
          <span class="p-card-title">收货信息</span>
          <el-button v-if="['add', 'edit'].includes($route.query.status)" type="text" @click="handCommonAddress">常用地址</el-button>
        </div>
      </div>
      <el-form ref="receiptForm" :model="form" :rules="rules" :disabled="$route.query.status === 'detail'" size="small" :inline="true" label-suffix=":" label-width="110px">
        <el-form-item label="收货人" prop="purchaseOrderDTO.receivePeople">
          <el-input v-model="form.purchaseOrderDTO.receivePeople" placeholder="收货人" maxlength="30"></el-input>
        </el-form-item>
        <el-form-item label="收货人电话" prop="purchaseOrderDTO.receivePeoplePhone">
          <el-input v-model="form.purchaseOrderDTO.receivePeoplePhone" placeholder="收货人电话" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="所在地区" prop="purchaseOrderDTO.area">
          <area-select :key="areaKey" @change="getArea" :areaList="areaList" placeholder="收货人所在地区"></area-select>
        </el-form-item>
        <el-form-item label="详细地址" prop="purchaseOrderDTO.address">
          <el-input v-model="form.purchaseOrderDTO.address" placeholder="详细地址" maxlength="50"></el-input>
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
          <el-input :value="`${paymentStatus.has(form.purchaseOrderDTO.payStatus) ? paymentStatus.get(form.purchaseOrderDTO.payStatus).label : ''}`"></el-input>
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
            <el-input v-else size="small" v-model.number.trim="scope.row.productCount" @change="handleCountAmount(scope.row)" style="width: 100%;"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="productPrice" label="单价" align="right">
          <template slot-scope="scope">
            <span v-if="$route.query.status === 'detail'">{{ scope.row.productPrice }}</span>
            <el-input v-else size="small" v-model.trim="scope.row.productPrice" @change="handleCountAmount(scope.row)" style="width: 100%;"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="productAmount" label="金额" align="right">
          <template slot-scope="scope">
            <span v-if="$route.query.status === 'detail'">{{ scope.row.productAmount }}</span>
            <el-input v-else size="small" v-model.trim="scope.row.productAmount" @change="handleAmount(scope.row)" style="width: 100%;"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="备注">
          <template slot-scope="scope">
            <span v-if="$route.query.status === 'detail'">{{ scope.row.remark }}</span>
            <template v-else>
              <el-input size="small" v-model="scope.row.remark" maxlength="100" clearable class="p-hardware-product_remark"></el-input>
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
    <el-card shadow="never" class="p-card" v-if="$route.query.status === 'detail'">
      <div slot="header" class="p-card-head">
        <span class="p-card-title">快递信息</span>
      </div>
      <el-form :model="form" size="small" disabled :inline="true" label-suffix=":" label-width="110px">
        <el-form-item label="发货状态">
          <el-input :value="['不需发货', '需要发货'][form.purchaseOrderDTO.deliverStatus]"></el-input>
        </el-form-item>
        <el-form-item label="发货时间">
          <el-input :value="form.purchaseOrderDTO.deliverTime"></el-input>
        </el-form-item>
        <el-form-item label="快递单号">
          <el-input :value="form.purchaseOrderDTO.expressNo"></el-input>
        </el-form-item>
        <el-form-item label="收货状态">
          <el-input :value="['未收货', '已收货'][form.purchaseOrderDTO.receiveGoodStatus]"></el-input>
        </el-form-item>
      </el-form>
    </el-card>
    <div class="p-hardware-action">
      <el-button size="small" plain @click="handleCancel('hardwarePurchaseOrder')">{{ $route.query.status === 'detail' ? '关闭' : '取消' }}</el-button>
      <el-button size="small" plain v-if="$route.query.status === 'edit'" @click="handleDel('hardwarePurchaseOrder')">删除</el-button>
      <el-button size="small" type="primary" plain v-if="['add', 'edit'].includes($route.query.status)" :loading="checkSaveBtnLoad" @click="handleSave">保存</el-button>
      <el-button size="small" type="primary" v-if="$route.query.status === 'edit'" v-permission="'HARDWARE_PURCHASE_ORDER_SUBMIT'" :loading="checkVerifyBtnLoad" @click="handleVerify">提交</el-button>
      <template v-if="$route.query.status === 'detail' && form.purchaseOrderDTO.payStatus === 2 && form.purchaseOrderDTO.goodsStatus === 20">
        <el-button size="small" type="primary" @click="handleReceipt">确认收货</el-button>
      </template>
    </div>
    <template v-if="['add', 'edit'].includes($route.query.status)">
      <purchase-address ref="address" :visible.sync="checkAddressVisible" :agentId="handUserInfo.agentId" @addressData="handleAddressList" />
      <purchase-product ref="product" :visible.sync="checkProductVisible" @productData="handleProductList" />
    </template>
  </section>
</template>

<script>
import areaSelect from '@/components/areaSelect'
import purchaseAddress from '../../components/purchaseAddress'
import { basicInfoMixin } from '../../mixins/basicInfoMixin'

import { confirmGoods } from '@/api/orderCenter/orderManagement'

export default {
  mixins: [basicInfoMixin],
  components: {
    areaSelect,
    purchaseAddress
  },
  data() {
    return {
      areaList: [],
      areaKey: Symbol('areaKey'),
      rules: {
        'purchaseOrderDTO.receivePeople': [{ required: true, message: '请输入收货人', trigger: 'blur' }],
        'purchaseOrderDTO.receivePeoplePhone': [
          { required: true, message: '请输入收货人电话', trigger: 'blur' },
          { pattern: /^1\d{10}$/, message: '请输入正确的电话号码', trigger: 'change' }
        ],
        'purchaseOrderDTO.area': [{ required: true, message: '请输入收货人所在地区', trigger: 'change' }],
        'purchaseOrderDTO.address': [{ required: true, message: '请输入收货详细地址', trigger: 'blur' }]
      },
      checkAddressVisible: false
    }
  },
  methods: {
    handleReceipt: async function() {
      this.$confirm('确认已收到货了吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await confirmGoods({ id: parseFloat(this.$route.query.id) })
          this.handleDetail()
        })
        .catch(() => {})
    },
    handCommonAddress() {
      this.checkAddressVisible = true
      this.$refs.address.getReceiverAddress()
    },
    handleAddressList(data) {
      if (data) {
        const { receivePeople, receivePeoplePhone, province, city, area, address } = data
        this.form.purchaseOrderDTO.receivePeople = receivePeople
        this.form.purchaseOrderDTO.receivePeoplePhone = receivePeoplePhone
        this.form.purchaseOrderDTO.province = province
        this.form.purchaseOrderDTO.city = city
        this.form.purchaseOrderDTO.area = area
        console.info(address)
        this.form.purchaseOrderDTO.address = address
        this.areaList = [province, city, area]
        this.areaKey = Symbol('areaKey')
      }
    },
    getArea(value) {
      this.form.purchaseOrderDTO.province = value[0]
      this.form.purchaseOrderDTO.city = value[1]
      this.form.purchaseOrderDTO.area = value[2]
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../scss/basicInfo.scss';
.p-hardware {
  &-con {
    border-bottom: 72px solid #f7f8fa;
  }
}
</style>
