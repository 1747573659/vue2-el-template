<template>
  <div class="app-container">
    <div class="search-box">
      <div class="xdd_tip"><i class="el-icon-info"></i> 支付订单号 与 退款订单号 至少输入一个，支付订单号无需选择商户，退款订单号必须选择商户； 只支持查询近半年内的退款订单；</div>
      <el-form :inline="true" label-width="100px" @submit.native.prevent class="xdd-btn-block__w240" size="small">
        <el-row>
          <el-form-item label="商户">
            <select-page
              :request="queryMerchantAdminPage"
              :bvalue.sync="formData.shopAdminId"
              :name="'companyName'"
              searchName="id"
              id="id"
              :width="'240px'"
              :placeholder="'商户名称'">
            </select-page>
          </el-form-item>
          <el-form-item label="退款订单号">
            <el-input clearable placeholder="请输入退款订单号" oninput="value=value.replace(/[\W]/g,'')" size="small" v-model.trim="formData.sn"></el-input>
          </el-form-item>
          <el-form-item label="退款状态">
            <el-select v-model="formData.status">
              <el-option :key="item.id" :label="item.name" :value="item.id" v-for="item in statusList"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="支付订单号">
            <el-input clearable placeholder="请输入支付订单号" oninput="value=value.replace(/[^\d]/g, '')" size="small" v-model.trim="formData.order"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button :loading="searchLock" @click="handleSearch" size="small" type="primary">查询</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
    <!-- 内容展示区域 -->
    <div class="data-box" v-loading="tabLock">
      <el-table :max-height="tableMaxHeight" :data="tabData" ref="table">
        <el-table-column :width="110" label="退款时间" prop="refundDate"></el-table-column>
        <el-table-column :min-width="134" label="退款订单号" prop="sn"></el-table-column>
        <el-table-column :min-width="134" label="支付订单号" prop="paySn"></el-table-column>
        <el-table-column label="商户名称" prop="shopName"></el-table-column>
        <el-table-column label="门店名称" prop="tradeStoreName"></el-table-column>
        <el-table-column label="支付方式" prop="methodPluginName"></el-table-column>
        <el-table-column label="退款人" prop="refundPerson"></el-table-column>
        <el-table-column align="right" label="申请退款金额" prop="amount" :width="106"></el-table-column>
        <el-table-column align="right" label="退还用户金额" prop="refundAmount" :width="106"></el-table-column>
        <el-table-column label="退款状态" prop="refundStatusName"></el-table-column>
        <el-table-column align="right" label="操作">
          <template slot-scope="scope">
            <el-button @click="handleDetails(scope.row)" size="small" type="text">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="el-pagination-box">
        <el-pagination
          v-if="pageTotal"
          :current-page="pageNo"
          :page-size="pageSize"
          :page-sizes="[10, 30, 50]"
          :total="pageTotal"
          @current-change="handleTabCurrent"
          @size-change="handleTabSize"
          background
          layout="total, sizes, prev, pager, next, jumper"></el-pagination>
      </div>
    </div>
    <order-detail-dialog ref="orderDetailDialog" :dialogTitle="dialogTitle" :form="dialogForm" type="refund" />
  </div>
</template>

<script>
import { refundOrderQueryPage, refundOrderdetail, queryMerchantAdminPage } from '@/api/transtionManagement'
import orderDetailDialog from './components/orderDetailDialog'
import selectPage from '@/components/selectPage2/index.vue'
export default {
  name: 'refundOrderQuery',
  components: {
    selectPage,
    orderDetailDialog
  },
  data() {
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
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.formData.order = vm.$route.query.id
      if (vm.$route.query.id) {
        vm.handleQueryPage()
      }
    })
  },
  computed: {
    tableMaxHeight() {
      return document.documentElement.clientHeight - 56 - 48 - 64 - 32 - 210
    }
  },
  methods: {
    async handleDetails(row) {
      this.dialogForm = {}
      const data = {
        dataSource: 3,
        paySn: row.paySn,
        sn: row.sn
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
    queryMerchantAdminPage(e) {
      return queryMerchantAdminPage(e)
    },
    handleSearch() {
      if (!this.formData.shopAdminId) {
        this.$message.error('请先选择商户')
        return
      }
      if (!this.formData.sn && !this.formData.order) {
        this.$message.error('支付订单号、退款订单号至少输入一个')
        return
      }
      if (this.formData.sn && !this.formData.shopAdminId) {
        this.$message.error('退款订单号必须选择商户')
      } else {
        this.pageNo = 1
        this.searchLock = true
        this.handleQueryPage()
        this.searchLock = false
      }
    },
    handleReset() {
      //this.$refs.selectPage.clearAll()
      this.formData = {
        order: '',
        sn: '',
        status: '',
        shopAdminId: null
      }
      this.tabData = []
    },
    handleTabCurrent(val) {
      this.pageNo = val
      this.handleQueryPage()
    },
    handleTabSize(val) {
      this.pageNo = 1
      this.pageSize = val
      this.handleQueryPage()
    },
    async handleQueryPage() {
      if (!this.formData.order && !this.formData.sn) {
        this.$message.error('请输入支付订单号或者退款订单号')
        return
      }
      let params = {
        order: this.formData.order,
        page: this.pageNo,
        rows: this.pageSize,
        sn: this.formData.sn,
        shopId: this.formData.shopAdminId,
        status: this.formData.status
      }
      Object.keys(params).forEach(key => {
        if (!params[key]) {
          delete params[key]
        }
      })
      try {
        const res = await refundOrderQueryPage(params)
        this.pageTotal = res.totalCount
        this.tabData = res.results || []
      } catch {}
      this.tabLock = true
      this.tabLock = false
    },
    setInputNum() {
      this.orderType = this.orderType.replace(/[^\d]/g, '')
    },
    setInputNumOrInto() {
      this.processOrderNum = this.processOrderNum.replace(/[\W]/g, '')
    }
  }
}
</script>

<style lang="scss" scoped>
.search-box {
  margin-left: -16px;
  margin-right: -16px;
  border-bottom: 16px solid #f7f8fa;
}
.el-pagination-box {
  text-align: right;
  margin-top: 20px;
  background: #fff;
  padding-bottom: 20px;
}
.xdd_tip {
  background: #e5edfd;
  border: 1px solid #a6c4fe;
  padding: 8px 30px;
  margin-bottom: 20px;
  color: #3d4966;
  font-size: 14px;
}
.xdd_tip i {
  color: #3377ff;
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
  ::v-deep.el-select {
    display: block;
  }
}
</style>
