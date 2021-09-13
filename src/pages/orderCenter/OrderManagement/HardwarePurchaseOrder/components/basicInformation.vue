<template>
  <section class="p-hardware-con" v-loading="checkBasicInformLoad">
    <el-card shadow="never" class="p-card">
      <div slot="header" class="p-card-head">
        <div>
          <span class="p-card-title">订单信息</span>
          <span class="p-card-back" v-if="$route.query.status !== 'add' && form.purchaseOrderDTO.remark">（订单被退回，原因：详细原因内容）</span>
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
          <el-input :value="form.purchaseOrderDTO.createOrderTime"></el-input>
        </el-form-item>
        <el-form-item label="订单金额">
          <el-input :value="form.purchaseOrderDTO.orderAmount"></el-input>
        </el-form-item>
        <el-form-item label="受理人">
          <el-input :value="`${form.purchaseOrderDTO.handUser}${form.purchaseOrderDTO.phone ? '（' + form.purchaseOrderDTO.phone + '）' : ''}`"></el-input>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="never" class="p-card">
      <div slot="header" class="p-card-head">
        <div class="p-card-address">
          <span class="p-card-title">收货信息</span>
          <el-button v-if="['add', 'edit'].includes($route.query.status)" type="text" @click="checkAddressVisible = true">常用地址</el-button>
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
        <el-table-column label="序号">
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
            <el-input
              v-else
              size="small"
              v-model="scope.row.remark"
              maxlength="100"
              placeholder="备注内容，可以叉清空"
              style="width: 100%;"
              class="p-hardware-product_remark"
            ></el-input>
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
      <el-button size="small" plain @click="handleCancel">{{ $route.query.status === 'detail' ? '关闭' : '取消' }}</el-button>
      <el-button size="small" plain v-if="$route.query.status === 'edit'" @click="handleDel">删除</el-button>
      <el-button size="small" type="primary" plain v-if="['add', 'edit'].includes($route.query.status)" :loading="checkSaveBtnLoad" @click="handleSave">保存</el-button>
      <el-button size="small" type="primary" v-if="$route.query.status === 'edit'" :loading="checkVerifyBtnLoad" @click="handleVerify">提交</el-button>
      <template v-if="$route.query.status === 'detail' && form.purchaseOrderDTO.payStatus === 2 && form.purchaseOrderDTO.goodsStatus === 20">
        <el-button size="small" type="primary" @click="handleReceipt">确认收货</el-button>
      </template>
    </div>
    <purchase-address v-if="['add', 'edit'].includes($route.query.status)" ref="address" :visible.sync="checkAddressVisible" @addressData="handleAddressList" />
    <purchase-product v-if="['add', 'edit'].includes($route.query.status)" ref="product" :visible.sync="checkProductVisible" @productData="handleProductList" />
  </section>
</template>

<script>
import NP from 'number-precision'
import { orderStatus, formObj } from '../../index'
import areaSelect from '@/components/areaSelect'
import purchaseAddress from '../../components/purchaseAddress'
import purchaseProduct from '../../components/purchaseProduct'
import { queryAgentMoneyStream, queryHandlerMan, purchaseAdd, purchaseQueryById, purchaseSubmit, purchaseUpdate, deleteById, confirmGoods } from '@/api/orderCenter/orderManagement'
import { getLocal } from '@/utils/storage'
import { deepClone } from '@/utils'

export default {
  components: {
    areaSelect,
    purchaseAddress,
    purchaseProduct
  },
  data() {
    return {
      checkBasicInformLoad: false,
      areaList: [],
      areaKey: Symbol('areaKey'),
      form: deepClone(formObj),
      rules: {
        'purchaseOrderDTO.receivePeople': [{ required: true, message: '请输入收货人', trigger: 'blur' }],
        'purchaseOrderDTO.receivePeoplePhone': [
          { required: true, message: '请输入收货人电话', trigger: 'blur' },
          { pattern: /^1\d{10}$/, message: '请输入正确的电话号码', trigger: 'change' }
        ],
        'purchaseOrderDTO.area': [{ required: true, message: '请输入收货人所在地区', trigger: 'change' }],
        'purchaseOrderDTO.address': [{ required: true, message: '请输入收货详细地址', trigger: 'blur' }]
      },
      checkSaveBtnLoad: false,
      checkVerifyBtnLoad: false,
      checkAddressVisible: false,
      checkProductVisible: false
    }
  },
  computed: {
    currentOrderStatus() {
      if (this.$route.query.status) {
        if (orderStatus.has(parseFloat(this.$route.query.orderStatus))) return orderStatus.get(parseFloat(this.$route.query.orderStatus)).label
        else return '未保存'
      } else return ''
    }
  },
  mounted() {
    this.form.purchaseOrderDTO.agentId = JSON.parse(getLocal('userBaseInfo')).agentId
    this.form.purchaseOrderDTO.agentName = JSON.parse(getLocal('userBaseInfo')).name
    this.getHandlerMan()
    if (this.$route.query.status === 'add') this.getAgentMoneyStream()
    else this.handleDetail()
  },
  methods: {
    handleSave() {
      this.$refs.receiptForm.validate(async valid => {
        if (valid) {
          try {
            this.form.purchaseOrderDTO.orderType = 0
            this.checkSaveBtnLoad = true
            const {
              purchaseOrderDTO: { id, orderStatus }
            } = this.$route.query.status === 'add' ? await purchaseAdd(this.form) : await purchaseUpdate(this.form)
            if (this.$route.query.status === 'add') {
              this.$router.replace({ name: 'hardwarePurchaseDetails', query: { id, orderStatus, status: 'edit' } })
              document.querySelector('.e-tag_active span').innerText = '硬件采购订单/编辑'
            }
            this.handleDetail()
            this.$message({ type: 'success', message: '保存成功' })
          } catch (error) {
          } finally {
            this.checkSaveBtnLoad = false
          }
        }
      })
    },
    handleCancel() {
      this.$store.dispatch('delTagView', this.$route).then(() => {
        this.$router.push({ name: 'hardwarePurchaseOrder' })
      })
    },
    handleDel() {
      this.$confirm('确定删除单据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await deleteById({ id: parseFloat(this.$route.query.id) })
          this.$message({ type: 'success', message: '删除成功' })
          this.$store.dispatch('delTagView', this.$route).then(() => {
            this.$router.push({ name: 'hardwarePurchaseOrder' })
          })
        })
        .catch(() => {})
    },
    handleVerify() {
      this.$refs.receiptForm.validate(async valid => {
        if (valid) {
          try {
            this.form.purchaseOrderDTO.orderType = 0
            this.checkVerifyBtnLoad = true
            await purchaseSubmit(this.form)
            this.handleCancel()
            this.$message({ type: 'success', message: '提交成功' })
          } catch (error) {
          } finally {
            this.checkVerifyBtnLoad = false
          }
        }
      })
    },
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
    handleDetail: async function() {
      try {
        this.checkBasicInformLoad = true
        const res = await purchaseQueryById({ from: false, id: parseFloat(this.$route.query.id) })
        const { orderItemList, purchaseOrderDTO } = res
        this.form.id = purchaseOrderDTO.id
        this.form.purchaseOrderDTO = purchaseOrderDTO
        this.form.orderItemList = orderItemList
        this.areaList = [res.purchaseOrderDTO.province, res.purchaseOrderDTO.city, res.purchaseOrderDTO.area]
        this.areaKey = Symbol('areaKey')
      } catch (error) {
      } finally {
        this.checkBasicInformLoad = false
      }
    },
    handleAddressList(data) {
      if(data){
        const { receivePeople, receivePeoplePhone, province, city, area, address } = data
        this.form.purchaseOrderDTO.receivePeople = receivePeople
        this.form.purchaseOrderDTO.receivePeoplePhone = receivePeoplePhone
        this.form.purchaseOrderDTO.province = province
        this.form.purchaseOrderDTO.city = city
        this.form.purchaseOrderDTO.area = area
        this.form.purchaseOrderDTO.address = address
        this.areaList = [province, city, area]
        this.areaKey = Symbol('areaKey')
      }
    },
    handleProductList(data) {
      this.form.orderItemList = this.form.orderItemList.concat(data)
    },
    handleProductVisible() {
      this.checkProductVisible = true
      this.$refs.product.basicProductData = []
      this.$refs.product.getProductPage()
    },
    handleCountAmount(row) {
      if(!/^\+?[1-9]{1}[0-9]{0,2}\d{0,0}$/.test(row.productCount)) {
        this.$message({ type: 'warning', message: '有效采购数量范围为[1-999]' })
        row.productCount = 1
      }
      if(!/^([0-9]\d{0,6}?)(\.\d{1,2})?$/.test(row.productPrice)) {
        this.$message({ type: 'warning', message: '有效单价范围为[0, 9999999.99]' })
        row.productPrice = 0
      }
      return (row.productAmount = NP.times(row.productCount, row.productPrice))
    },
    handleAmount(row) {
      if(!/^([0-9]\d{0,6}?)(\.\d{1,2})?$/.test(row.productPrice)) {
        this.$message({ type: 'warning', message: '有效金额范围为[0, 9999999999.99]' })
        row.productAmount = 0
      }
      return (row.productPrice = NP.divide(row.productAmount, row.productCount))
    },
    getHandlerMan: async function() {
      try {
        const { userName = '', phone = '' } = await queryHandlerMan({ area: JSON.parse(getLocal('userBaseInfo')).districtCode })
        this.form.purchaseOrderDTO.handUser = userName
      } catch (error) {}
    },
    getAgentMoneyStream: async function() {
      try {
        const { paperMoney, paperMoneyGift, noQualityGuaranteeMoney } = await queryAgentMoneyStream({ agentId: JSON.parse(getLocal('userBaseInfo')).agentId })
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
                return NP.plus(prev, curr)
              } else {
                return prev
              }
            }, 0)
            this.form.purchaseOrderDTO.orderAmount = sums[5]
          }
        }
      })
      return sums
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
    z-index: 1000;
    /deep/ .el-button {
      padding: 8px 22px;
    }
  }
  &-product {
    &_remark {
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
