<template>
  <section class="p-hardware-con">
    <el-card shadow="never" class="p-card">
      <div slot="header" class="p-card-head">
        <div>
          <span class="p-card-title">订单信息</span>
          <span class="p-card-back" v-if="status !== 'add'">（订单被退回，原因：详细原因内容）</span>
        </div>
        <div class="p-card-state">
          <span>订单状态：</span>
          <span class="p-card-state_text">未保存</span>
        </div>
      </div>
      <el-form :model="form" size="small" disabled :inline="true" label-suffix=":" label-width="110px">
        <el-form-item label="单据编码">
          <el-input placeholder="保存后自动生成"></el-input>
        </el-form-item>
        <el-form-item label="订单日期">
          <el-input :value="form.orderVo.orderdate"></el-input>
        </el-form-item>
        <el-form-item label="订单金额">
          <el-input v-model="form.orderVo.orderAmount"></el-input>
        </el-form-item>
        <el-form-item label="受理人">
          <el-input v-model="form.orderVo.assignee"></el-input>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card shadow="never" class="p-card">
      <div slot="header" class="p-card-head">
        <div class="p-card-address">
          <span class="p-card-title">收货信息</span>
          <el-button v-if="['add', 'edit'].includes(status)" type="text" @click="handleCommonAddress">常用地址</el-button>
        </div>
      </div>
      <el-form :model="form" :rules="rules" :disabled="status === 'detail'" size="small" :inline="true" label-suffix=":" label-width="110px">
        <el-form-item label="收货人" prop="deliveryVo.receiver">
          <el-input v-model="form.deliveryVo.receiver" maxlength="30"></el-input>
        </el-form-item>
        <el-form-item label="收货人电话" prop="deliveryVo.consigneePhone">
          <el-input v-model="form.deliveryVo.consigneePhone" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="所在地区" prop="deliveryVo.area">
          <area-select @change="handleArea" :areaList="areaList"></area-select>
        </el-form-item>
        <el-form-item label="详细地址" prop="deliveryVo.address">
          <el-input v-model="form.deliveryVo.address" maxlength="50"></el-input>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card shadow="never" class="p-card">
      <div slot="header" class="p-card-head">
        <span class="p-card-title">账款信息</span>
      </div>
      <el-form :model="form" size="small" disabled :inline="true" label-suffix=":" label-width="110px">
        <el-form-item label="账面余额">
          <el-input v-model="form.accountVo.bookBalance"></el-input>
        </el-form-item>
        <el-form-item label="未核销担保金">
          <el-input v-model="form.accountVo.unwrittenGuaranteeFunds"></el-input>
        </el-form-item>
        <el-form-item label="付款状态">
          <el-input v-model="form.accountVo.paymentStatus"></el-input>
        </el-form-item>
        <el-form-item label="付款时间">
          <el-input v-model="form.accountVo.paymentTime"></el-input>
        </el-form-item>
        <el-form-item label="付款方式">
          <el-input v-model="form.accountVo.paymentMethod"></el-input>
        </el-form-item>
        <el-form-item label="收款人">
          <el-input v-model="form.accountVo.payee"></el-input>
        </el-form-item>
        <el-form-item label="使用余额">
          <el-input v-model="form.accountVo.useBalance"></el-input>
        </el-form-item>
        <el-form-item label="使用担保金">
          <el-input v-model="form.accountVo.securityDeposit"></el-input>
        </el-form-item>
        <el-form-item label="经销商">
          <el-input v-model="form.accountVo.dealer"></el-input>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card shadow="never" class="p-card">
      <div slot="header" class="p-card-head">
        <el-button type="text" size="small" v-if="['add', 'edit'].includes(status)" @click="checkProductVisible = true">选择产品</el-button>
        <span v-else class="p-card-title">订单明细</span>
      </div>
      <el-table :data="productData" show-summary :summary-method="getSummaries" class="p-hardware-product">
        <el-table-column label="序号">
          <template slot-scope="scope">{{ scope.$index + 1 }}</template>
        </el-table-column>
        <el-table-column prop="code" label="产品编码"></el-table-column>
        <el-table-column prop="name" label="产品名称"></el-table-column>
        <el-table-column prop="purchaseNumber" label="采购数量" align="right">
          <template slot-scope="scope">
            <span v-if="status === 'detail'">{{ scope.row.purchaseNumber }}</span>
            <el-input v-else size="small" v-model.trim="scope.row.purchaseNumber" @blur="handleCountAmount(scope.row)" style="width: 100%;"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="单价" align="right">
          <template slot-scope="scope">
            <span v-if="status === 'detail'">{{ scope.row.price }}</span>
            <el-input v-else size="small" v-model.trim="scope.row.price" @blur="handleCountAmount(scope.row)" style="width: 100%;"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="金额" align="right">
          <template slot-scope="scope">
            <span v-if="status === 'detail'">{{ scope.row.amount }}</span>
            <el-input v-else size="small" v-model.trim="scope.row.amount" @blur="handleAmount(scope.row)" style="width: 100%;"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="备注">
          <template slot-scope="scope">
            <span v-if="status === 'detail'">{{ scope.row.remark }}</span>
            <el-input v-else size="small" v-model="scope.row.remark" placeholder="备注内容，可以叉清空" style="width: 100%;" class="p-hardware-product_remark"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" v-if="status !== 'detail'">
          <template slot-scope="scope">
            <el-popconfirm class="el-button el-button--text" @confirm="handleDelAddress(scope.row)" placement="top-start" title="确定删除所选数据吗？">
              <el-button type="text" size="small" slot="reference">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-card shadow="never" class="p-card" v-if="status === 'detail'">
      <div slot="header" class="p-card-head">
        <span class="p-card-title">快递信息</span>
      </div>
      <el-form :model="form" size="small" disabled :inline="true" label-suffix=":" label-width="110px">
        <el-form-item label="发货状态">
          <el-input :value="form.shipVo.status"></el-input>
        </el-form-item>
        <el-form-item label="发货时间">
          <el-input :value="form.shipVo.time"></el-input>
        </el-form-item>
        <el-form-item label="快递单号">
          <el-input :value="form.shipVo.track"></el-input>
        </el-form-item>
        <el-form-item label="收货状态">
          <el-input :value="form.shipVo.receiptStatus"></el-input>
        </el-form-item>
      </el-form>
    </el-card>
    <div class="p-hardware-action">
      <el-button size="small" plain>{{ status === 'detail' ? '关闭' : '取消' }}</el-button>
      <el-button size="small" plain v-if="status === 'edit'">删除</el-button>
      <el-button size="small" type="primary" plain v-if="['add', 'edit'].includes(status)">保存</el-button>
      <el-button size="small" type="primary" v-if="status === 'edit'">提交</el-button>
      <el-button size="small" type="primary" v-if="status === 'detail'">确认收货</el-button>
    </div>
    <purchase-address ref="address" :visible.sync="checkAddressVisible" />
    <purchase-product :visible.sync="checkProductVisible" />
  </section>
</template>

<script>
import dayjs from 'dayjs'
import NP from 'number-precision'
import areaSelect from '@/components/areaSelect'
import purchaseAddress from '../../components/purchaseAddress'
import purchaseProduct from '../../components/purchaseProduct'

export default {
  props: {
    status: {
      type: String,
      default: 'add'
    }
  },
  components: {
    areaSelect,
    purchaseAddress,
    purchaseProduct
  },
  data() {
    return {
      areaList: [],
      form: {
        orderVo: {
          orderdate: dayjs().format('YYYY-MM-DD'),
          orderAmount: 0,
          assignee: ''
        },
        deliveryVo: {
          receiver: '',
          consigneePhone: '',
          province: '',
          city: '',
          area: '',
          address: ''
        },
        accountVo: {
          bookBalance: '',
          unwrittenGuaranteeFunds: '',
          paymentStatus: '',
          paymentTime: '',
          paymentMethod: '',
          payee: '',
          useBalance: '',
          securityDeposit: '',
          dealer: ''
        },
        shipVo: {
          status: '已发货',
          time: '2020-10-24 10:00:00',
          track: '212546321145',
          receiptStatus: '未确认'
        }
      },
      rules: {
        'deliveryVo.receiver': [{ required: true, message: '请输入收货人', trigger: 'blur' }],
        'deliveryVo.consigneePhone': [
          { required: true, message: '请输入收货人电话', trigger: 'blur' },
          { pattern: /^1\d{10}$/, message: '请输入正确的电话号码', trigger: 'change' }
        ],
        'deliveryVo.area': [{ required: true, message: '请输入收货人所在地区', trigger: 'change' }],
        'deliveryVo.address': [{ required: true, message: '请输入收货详细地址', trigger: 'blur' }]
      },
      productData: [
        { code: 'KMD02', name: '店务通手持终端KMD02', purchaseNumber: 2, price: 3600.01, amount: 7200.01, remark: '' },
        { code: 'KMD02', name: '店务通手持终端KMD02', purchaseNumber: 3, price: 3600.02, amount: 10800.02, remark: '' }
      ],
      checkAddressVisible: false,
      checkProductVisible: false
    }
  },
  methods: {
    handleCountAmount(row) {
      return (row.amount = NP.times(row.purchaseNumber, row.price))
    },
    handleAmount(row) {
      return (row.price = NP.divide(row.amount, row.purchaseNumber))
    },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (['purchaseNumber', 'amount'].includes(column.property)) {
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
            this.form.orderVo.orderAmount = sums[5]
          }
        }
      })
      return sums
    },
    handleCommonAddress: async function() {
      this.checkAddressVisible = true
      this.$refs.address.getReceiverAddress()
    },
    handleArea(value) {
      this.form.deliveryInformation.province = value[0]
      this.form.deliveryInformation.city = value[1]
      this.form.deliveryInformation.area = value[2]
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
