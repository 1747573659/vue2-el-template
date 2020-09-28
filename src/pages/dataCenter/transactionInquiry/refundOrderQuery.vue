<template>
  <div class="app-container">
    <div class="search-box">
      <el-form  label-width="110px" @submit.native.prevent class="search-form" size="small">
        <el-row>
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
            <el-form-item label="退款订单号">
              <el-input clearable placeholder="请输入退款订单号" oninput="value=value.replace(/[\W]/g,'')" size="small" v-model.trim="formData.sn"></el-input>
            </el-form-item>
          </el-col>
           <el-col :span="8">
            <el-form-item label="退款状态">
              <el-select v-model="formData.status">
                <el-option :key="item.id" :label="item.name" :value="item.id" v-for="item in statusList"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="支付订单号">
              <el-input clearable placeholder="请输入支付订单号" oninput="value=value.replace(/[^\d]/g, '')" size="small" v-model.trim="formData.order"></el-input>
            </el-form-item>
          </el-col>
          
        </el-row>
        <el-row>
          <el-col :span="16">
            <el-form-item style="margin-left:-60px">
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
        <el-table-column label="退款时间" prop="refundDate"></el-table-column>
        <el-table-column label="退款订单号" prop="sn"></el-table-column>
        <el-table-column label="支付订单号" prop="paySn"></el-table-column>
        <el-table-column label="商户名称" prop="shopName"></el-table-column>
        <el-table-column label="门店名称" prop="tradeStoreName"></el-table-column>
        <el-table-column label="支付方式" prop="methodPluginName"></el-table-column>
        <el-table-column label="退款人员" prop="refundPerson"></el-table-column>
        <el-table-column label="申请退款金额" prop="amount"></el-table-column>
        <el-table-column label="退还用户金额" prop="refundAmount"></el-table-column>
        <el-table-column label="退款状态" prop="refundStatusName"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="handleDetails(scope.row)" v-if="permissonCheckMenus('TRANSACTION_REFUND_DETAIL')" size="small" type="text">详情</el-button>
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
      type='refund'
    />
  </div>
</template>

<script>
import {
  refundOrderQueryPage,
  refundOrderdetail,
  queryMerchantAdminPage
} from '@/api/transtionManagement'
import orderDetailDialog from './components/orderDetailDialog'
import selectPage from '@/components/selectPage2/index.vue'
export default {
  name: 'RefundOrderQuery',
  components: {
    selectPage,
    orderDetailDialog
  },
  data () {
    return {
      orderType: '',
      processOrderNum: '',
      serialNumber: '',
      showDialogStatus: false,
      titleDialogStatus: false,
      pageNo: 1,
      pageSize: 10,
      pageTotal: 0,
      dialogForm: {},
      dialogTitle: '退款详情',
      searchLock: false,
      tabLock: false,
      tabData: [],
      formData: {
        order: '',
        sn: '',
        status: '',
        shopAdminId: null
      },
      statusList: [
        { id: '', name: '全部' },
        { id: 1, name: '退款成功' },
        { id: 2, name: '退款失败' }
      ]
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.formData.order = vm.$route.query.id
      if (vm.$route.query.id) {
        vm.handleQueryPage()
      }
    })
  },
  methods: {
    async handleDetails (row) {
      this.dialogForm = {}
      const data = {
        dataSource:3,
        paySn:row.id,
        'sn': row.sn
      }
      try {
        const res = await refundOrderdetail(data)
        if (!res) {
          this.$message('暂无数据')
          return
        }
        this.dialogForm = res
        this.dialogForm.shopName = row.shopName
        this.$refs.orderDetailDialog.orderDetailVisible = true
      } catch {}
    },
    queryMerchantAdminPage (e) {
      return queryMerchantAdminPage(e)
    },
    handleSearch () {
      if (!this.formData.sn && !this.formData.order) {
        this.$message.error('请输入支付订单号或者退款订单号')
        return
      }
      if (this.formData.sn && !this.formData.shopAdminId) {
        this.$message.error('用退款订单号进行查询时,需要选择对应的商户!')
      } else {
        this.pageNo = 1
        this.searchLock = true
        this.handleQueryPage()
        this.searchLock = false
      }
    },
    handleReset () {
      //this.$refs.selectPage.clearAll()
      this.formData = {
        order: '',
        sn: '',
        status: '',
        shopAdminId: null
      }
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
      if (!this.formData.order && !this.formData.sn) {
        this.$message.error('请输入支付订单号或者退款订单号')
        return
      }
      let params = {
        'order': this.formData.order,
        'page': this.pageNo,
        'rows': this.pageSize,
        'sn': this.formData.sn,
        'shopId': this.formData.shopAdminId,
        'status': this.formData.status
      }
      Object.keys(params).forEach(key => {
        if (!params[key]) {
          delete params[key]
        }
      })
      try {
        const res = await refundOrderQueryPage(params)
        this.pageTotal = res.totalCount
        this.tabData = res.results
      } catch {}
      this.tabLock = true
      this.tabLock = false
    },
    setInputNum () {
      this.orderType = this.orderType.replace(/[^\d]/g, '')
    },
    setInputNumOrInto () {
      this.processOrderNum = this.processOrderNum.replace(/[\W]/g, '')
    }
  }
}
</script>

<style lang="scss" scoped>
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
.search-form {
  /deep/.el-select {
    display: block;
  }
}
</style>
