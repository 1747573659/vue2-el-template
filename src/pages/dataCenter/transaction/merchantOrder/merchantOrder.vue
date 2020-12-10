<template>
  <div class="app-container">
    <div class="action-box">
      <km-form :inline="true" @submit.native.prevent>
        <km-form-item label="付款时间">
          <km-date-picker
            :picker-options="pickerOptions"
            @blur="handleResetTime"
            class="km-material-datepicker"
            end-placeholder="结束日期"
            range-separator="至"
            start-placeholder="开始日期"
            type="daterange"
            v-model="createTime"
          ></km-date-picker>
        </km-form-item>
        <km-form-item label="商户名称">
          <km-select>
            <km-option>123</km-option>
          </km-select>
        </km-form-item>
        <km-form-item label="门店名称">
          <km-select>
            <km-option>123</km-option>
          </km-select>
        </km-form-item>
        <km-form-item label="交易渠道">
          <km-select>
            <km-option>123</km-option>
          </km-select>
        </km-form-item>
        <km-form-item label="支付方式">
          <km-select>
            <km-option>123</km-option>
          </km-select>
        </km-form-item>
        <km-form-item label="交易场景">
          <km-select>
            <km-option>123</km-option>
          </km-select>
        </km-form-item>
        <km-form-item label="交易状态">
          <km-select>
            <km-option>123</km-option>
          </km-select>
        </km-form-item>
        <km-form-item>
          <km-button :loading="searchLock" @click="handleSearch" size="small" type="primary">查询</km-button>
          <km-button @click="handleReset" plain size="small" type="primary">重置</km-button>
        </km-form-item>
      </km-form>
    </div>
    <!-- 内容展示区域 -->
    <div class="data-box" v-loading="tabLock">
      <km-table :data="tabData" ref="table">
        <km-table-column label="交易时间" prop="createTime"></km-table-column>
        <km-table-column label="享钱订单号" prop="createTime"></km-table-column>
        <km-table-column label="商户名称" prop="createTime"></km-table-column>
        <km-table-column label="门店名称" prop="createTime"></km-table-column>
        <km-table-column label="支付通道" prop="createTime"></km-table-column>
        <km-table-column label="交易渠道" prop="createTime"></km-table-column>
        <km-table-column label="支付方式" prop="createTime"></km-table-column>
        <km-table-column label="支付状态" prop="createTime"></km-table-column>
        <km-table-column label="订单金额" prop="createTime"></km-table-column>
        <km-table-column label="退款金额" prop="createTime"></km-table-column>
        <km-table-column label="操作">
          <template slot-scope="scope">
            <km-button @click="handleDetails(scope.row)" size="small" type="text">详情</km-button>
            <km-button @click="handleDelRow(scope.row)" size="small" type="text">退款详情</km-button>
          </template>
        </km-table-column>
      </km-table>
      <div class="km-pagination-box">
        <km-pagination
          :current-page="pageNo"
          :page-size="pageSize"
          :page-sizes="[10, 30, 50]"
          :total="pageTotal"
          @current-change="handleTabCurrent"
          @size-change="handleTabSize"
          background
          layout="total, sizes, prev, pager, next, jumper"
        ></km-pagination>
      </div>
    </div>
    <km-dialog :visible.sync="showDialogStatus" @close="showDialogStatus = false" title="订单详情" width="600px">
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
        <km-button @click="showDialogStatus = false">取消</km-button>
        <km-button @click="showDialogStatus = false" type="primary">确定</km-button>
      </div>
    </km-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      orderType: '',
      processOrderNum: '',
      serialNumber: '',
      showDialogStatus: false,
      titleDialogStatus: false,
      pageNo: 1,
      pageSize: 10,
      pageTotal: 50,
      searchLock: false,
      tabLock: false,
      tabData: []
    }
  },
  mounted () {
    this.handleQueryPage()
  },
  methods: {
    handleDetails (row) {
      console.info(123)
    },
    handleSearch () {
      this.pageNo = 1
      this.searchLock = true
      this.handleQueryPage()
      this.searchLock = false
    },
    handleReset () {
      this.orderType = this.processOrderNum = this.serialNumber = ''
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
      const params = {
        orderType: this.orderType,
        processOrderNum: this.processOrderNum,
        serialNumber: this.serialNumber
      }
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
.km-pagination-box {
  text-align: right;
  margin-top: 20px;
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
</style>
