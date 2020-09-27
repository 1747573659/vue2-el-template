<template>
  <div class="app-container">
    <div class="search-box">
      <el-form @submit.native.prevent label-width="110px" size="small">
        <el-row>
         
          <el-col :span="8">
            <el-form-item label="支付订单号">
              <el-input style="width:85%" clearable placeholder="请输入支付订单号" size="small" oninput="value=value.replace(/[^\d]/g, '')" v-model.trim="formData.orderId"></el-input>
              <el-tooltip effect="light" class="payment">
                <div slot="content"><img src="../../../assets/images/paymentOrderNumber.png"></div>
                <i class="el-icon-question pure-info-tip"></i>
              </el-tooltip>
            </el-form-item>
          </el-col>
           <el-col :span="8">
            <el-form-item label="商户">
              <select-page
                :request="queryMerchantAdminPage"
                :bvalue.sync="formData.shopAdminId"
                :name="'companyName'"
                searchName="id"
                id="id"
                :placeholder="'商户名称'"
              >
              </select-page>
            </el-form-item>
          </el-col>
           <el-col :span="8">
            <el-form-item label="交易时间">
              <el-date-picker
                style="width:85%"
                size="small"
                :clearable="false"
                :default-time="['00:00:00', '23:59:59']"
                :picker-options="pickerOptions"
                end-placeholder="结束日期"
                range-separator="至"
                start-placeholder="开始日期"
                type="datetimerange"
                v-model="formData.transactionTime"
                value-format="timestamp"
              ></el-date-picker>
            </el-form-item>
          </el-col>
         
          
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="交易流水号">
              <el-input style="width:85%" clearable placeholder="请输入交易流水号" size="small" oninput="value=value.replace(/[\W]/g,'')" v-model.trim="formData.serialSn"></el-input>
              <el-tooltip effect="light" class="payment">
                <div slot="content"><img src="../../../assets/images/paymentSerialNumber.png"></div>
                <i class="el-icon-question pure-info-tip"></i>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="线下订单号">
              <el-input style="width:85%" clearable placeholder="请输入线下订单号" size="small" oninput="value=value.replace(/[^\d]/g, '')" v-model.trim="formData.thirdSn"></el-input>
              <el-tooltip effect="light" class="payment">
                <div slot="content"><img src="../../../assets/images/offlineOrderNumber.png"></div>
                <i class="el-icon-question pure-info-tip"></i>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="商户单号">
              <el-input style="width:85%" clearable placeholder="请输入商户单号" size="small" oninput="value=value.replace(/[^\d]/g, '')" v-model.trim="formData.tenantSn"></el-input>
              <el-tooltip effect="light" class="payment">
                <div slot="content"><img src="../../../assets/images/merchantOrderNumber.png"></div>
                <i class="el-icon-question pure-info-tip"></i>
              </el-tooltip>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item>
              <el-button :loading="searchLock" @click="handleSearch" size="small" type="primary">查询</el-button>
              <el-button @click="handleReset" plain size="small" type="primary">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- 内容展示区域 -->
    <div class="data-box" v-loading="tabLock">
      <el-table :data="tabData" ref="table">
        <el-table-column label="交易时间" prop="createDate"></el-table-column>
        <el-table-column label="支付订单号" prop="orders"></el-table-column>
        <el-table-column label="商户名称" prop="shopName"></el-table-column>
        <el-table-column label="门店名称" prop="storeName"></el-table-column>
        <el-table-column label="支付通道" prop="aisleName"></el-table-column>
        <el-table-column label="交易渠道" prop="payChannelType"></el-table-column>
        <el-table-column label="支付方式" prop="methodPluginName"></el-table-column>
        <el-table-column label="交易状态" prop="orderStatusName"></el-table-column>
        <el-table-column label="交易金额" prop="amount"></el-table-column>
        <el-table-column label="申请退款金额" prop="refundAmount"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="handleDetails(scope.row)"  size="small" type="text">详情</el-button>
            <el-button @click="handleDelRow(scope.row)" v-if="(scope.row.paymentStatus === 3 || scope.row.paymentStatus === 4)" size="small" type="text">退款详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="el-pagination-box">
        <el-pagination
          :current-page="pageNo"
          :page-size="pageSize"
          :page-sizes="[10, 15, 20, 25]"
          :total="pageTotal"
          @current-change="handleTabCurrent"
          @size-change="handleTabSize"
          background
          layout="total, sizes, prev, pager, next, jumper"
        ></el-pagination>
      </div>
    </div>
    <el-dialog :visible.sync="showDialogStatus" @close="showDialogStatus = false" title="订单详情" width="600px">
      <section>
        <div class="pure-dialog-orderItem">
          <span class="pure-dialog-orderLeft">商户名称: 新北区河海宜思客餐饮店</span>
          <span class="pure-dialog-orderRight">交易时间: 2020-03-23 12:23:56</span>
        </div>
        <div class="pure-dialog-orderItem">
          <span class="pure-dialog-orderLeft">享钱订单号: 9115623336332156</span>
          <span class="pure-dialog-orderRight">ERP订单号: 1562333633215623</span>
        </div>
        <div class="pure-dialog-orderItem">
          <span class="pure-dialog-orderLeft">交易通道: 得仕通道</span>
          <span class="pure-dialog-orderRight">交易商户号: 205362200087</span>
        </div>
        <div class="pure-dialog-orderItem">
          <span class="pure-dialog-orderLeft">门店名称: 新北区第一门店</span>
          <span class="pure-dialog-orderRight">收银员: 小黄/--</span>
        </div>
        <div class="pure-dialog-orderItem">
          <span class="pure-dialog-orderLeft">交易渠道: 线下收银</span>
          <span class="pure-dialog-orderRight">支付方式: 支付宝商家主扫</span>
        </div>
        <div class="pure-dialog-orderItem">
          <span class="pure-dialog-orderLeft">订单金额: 100.23</span>
          <span class="pure-dialog-orderRight">商家优惠: 0.00</span>
        </div>
        <div class="pure-dialog-orderItem">
          <span class="pure-dialog-orderLeft">交平台优惠: 100.00</span>
          <span class="pure-dialog-orderRight">申请退款总金额: 8.23</span>
        </div>
        <div class="pure-dialog-orderItem">
          <span class="pure-dialog-orderLeft">退券金额: 100.00</span>
          <span class="pure-dialog-orderRight">用户实退: 8.23</span>
        </div>
        <div class="pure-dialog-orderItem">
          <span class="pure-dialog-orderLeft">商家实收: 100.00</span>
          <span class="pure-dialog-orderRight">手续费: --/0.32</span>
        </div>
        <div class="pure-dialog-orderItem">
          <span>手续费率: 0.2%</span>
        </div>
      </section>
      <div slot="footer">
        <el-button @click="showDialogStatus = false">取消</el-button>
        <el-button @click="showDialogStatus = false" type="primary">确定</el-button>
      </div>
    </el-dialog>
    <order-detail-dialog
      ref="orderDetailDialog"
      :dialogTitle="dialogTitle"
      :form="dialogForm"
      type='order'
    />
    <order-detail-dialog
      ref="orderDetailDialog"
      :dialogTitle="dialogTitle"
      :form="dialogForm2"
      type='refund'
    />
  </div>
</template>

<script>
import selectPage from '@/components/selectPage2/index.vue'
import moment from 'moment'
import orderDetailDialog from './components/orderDetailDialog'
import {
  querySingleOrder,
  detail,
  refundOrderdetail,
  queryMerchantAdminPage
} from '@/api/transtionManagement'
let minTime = ''
let maxTime = ''
export default {
  name: 'SingleOrderQuery',
  components: {
    selectPage,
    orderDetailDialog
  },
  data () {
    return {
      showDialogStatus: false,
      titleDialogStatus: false,
      pageNo: 1,
      pageSize: 10,
      pageTotal: 50,
      searchLock: false,
      dialogTitle: '订单详情',
      tabLock: false,
      dialogForm: {},
      dialogForm2: {},
      tabData: [],
      formData: {
        transactionTime: '',
        shopAdminId: null,
        orderId: '',
        serialSn: '',
        thirdSn: '',
        tenantSn: ''
      },
      pickerOptions: {
        onPick: ({ maxDate, minDate }) => {
          if (minDate) {
            const day30 = 30 * 24 * 3600 * 1000
            maxTime = minDate.getTime() + day30
            minTime = minDate.getTime() - day30
          }
        },
        disabledDate: (time) => {
          if (maxTime) {
            return time.getTime() > moment().endOf('day').valueOf() || time.getTime() < moment().subtract(6, 'months').valueOf() || time.getTime() > maxTime || time.getTime() < minTime
          }
          return time.getTime() > moment().endOf('day').valueOf() || time.getTime() < moment().subtract(6, 'months').valueOf()
        }
      }
    }
  },
  mounted () {
    // this.handleQueryPage()
  },
  methods: {
   async  handleDelRow (row) {
     this.dialogForm = {}
      const data = {
        dataSource: 2,
        paySn: row.id,
        // 'orderId': '9115882679906900459209030',
        shopId: row.shopId
      }
      try {
        const res = await refundOrderdetail(data)
        if (!res) {
          this.$message('暂无数据')
          return
        }
        res.shopName=row.shopName
        this.dialogForm2 = res
        this.dialogForm2.shopName = row.shopName
        this.$refs.orderDetailDialog2.orderDetailVisible = true
      } catch {}
    },
    queryMerchantAdminPage (e) {
      return queryMerchantAdminPage(e)
    },
    async handleDetails (row) {
      this.dialogForm = {}
      const data = {
        'orderId': row.id,
        // 'orderId': '9115882679906900459209030',
        'shopId': row.shopId
      }
      try {
        const res = await detail(data)
        if (!res) {
          this.$message('暂无数据')
          return
        }
        this.dialogForm = res
        this.dialogForm.shopName = row.shopName
        this.$refs.orderDetailDialog.orderDetailVisible = true
      } catch {}
    },
    handleSearch () {
      this.pageNo = 1
      this.searchLock = true
      this.handleQueryPage()
      this.searchLock = false
    },
    handleReset () {
      this.formData = {
        transactionTime: '',
        shopAdminId: null,
        orderId: '',
        serialSn: '',
        thirdSn: '',
        tenantSn: ''
      }
      this.$refs.selectPage.clearAll()
      this.tabData = []
    },
    handleTabCurrent (val) {
      this.pageNo = val
      this.handleQueryPage()
    },
    handleTabSize (val) {
      this.pageNo = 1
      this.pageSize = val
      this.handleQueryPage()
    },
    async handleQueryPage () {
      let params = {
        'endTime': this.formData.transactionTime ? moment(this.formData.transactionTime[1]).format('YYYY-MM-DD HH:mm:ss') : '',
        'orderId': this.formData.orderId,
        'serialSn': this.formData.serialSn,
        'shopAdminId': this.formData.shopAdminId,
        'startTime': this.formData.transactionTime ? moment(this.formData.transactionTime[0]).format('YYYY-MM-DD HH:mm:ss') : '',
        'tenantSn': this.formData.tenantSn,
        'thirdSn': this.formData.thirdSn
      }
      Object.keys(params).forEach(key => {
        console.log(params[key])
        if (!params[key]) {
          delete params[key]
        }
      })
      this.tabLock = true
      try {
        const res = await querySingleOrder(params)
        this.tabData = res
        this.tabLock = false
      } catch {
        this.tabLock = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.pure-info-tip{
  font-size: 18px;
  vertical-align: middle;
  margin-left: 5px;
}
.el-pagination-box {
  text-align: right;
  margin-top: 20px;
  background: #fff;
  padding-bottom: 20px;
}
.pure {
  &-dialog {
    &-orderItem {
      display: flex;
      font-size: 15px;
      margin-bottom: 10px;
    }
    &-orderLeft {
      flex: 1;
    }
    &-orderRight {
      flex: 1;
    }
  }
}
.action-box {
  /deep/.el-date-editor--wrap {
    width: 100%;
    /deep/.el-date-editor--datetimerange.el-input__inner {
      width: 100%;
    }
  }
  .select-paeg {
    /deep/.el-select {
      display: block;
    }
  }
}
.el-tooltip__popper.is-light{
  border: 0 none;
  box-shadow: 0 0 10px 0 rgba(0,0,0,.5);
}
</style>
