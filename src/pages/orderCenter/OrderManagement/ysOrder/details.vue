<template>
  <div v-loading="listLoading" class="container">
    <descriptions title="基础信息" :divide="false">
      <descriptions-item v-for="(item, index) in items" :key="index" :label="item.title">{{ itemInfo[item.key] }}</descriptions-item>
    </descriptions>

    <descriptions title="应用详情">
      <el-table :data="tableData" border>
        <el-table-column type="index" label="序号" width="100"> </el-table-column>
        <el-table-column label="订购服务">
          <template slot-scope="scope">
            <div class="order-info">
              <div class="order-title">{{ scope.row.goodsName }}</div>
              <span class="order-mouth">{{ scope.row.month ? scope.row.month + '个月' : '--' }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="单价(元)">
          <template slot-scope="scope">
            <div class="order-info">
              <div class="order-title">￥{{ (scope.row.amount / 100) | toFixedMoneyFilter }}</div>
              <div v-if="scope.row.changeDiscount === 0">
                <div v-if="scope.row.activeType === 1" class="order-mouth">促销活动{{ scope.row.discount / 100 }}折</div>
                <div v-else-if="scope.row.activeType === 2" class="order-mouth">立减{{ scope.row.coupon / 100 }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="activityAmount" label="活动价">
          <template slot-scope="{ row }">
            <div v-if="row.changeDiscount > 0">￥{{ (row.amount / 100) | toFixedMoneyFilter }}</div>
            <div v-else>￥{{ (row.activityAmount / 100) | toFixedMoneyFilter }}</div>
            <div class="wordsStyle" style="color: rgb(250, 47, 47)">
              <span v-if="row.activeType === 1">{{ `活动促销${row.discount / 100}折` }}</span>
              <span v-if="row.activeType === 2">{{ `立减￥${(row.coupon / 100 || 0).toFixed(2)}` }}</span>
              <span v-if="row.activeType === 3">{{ `买${row.buyCount}送${row.giveCount}` }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="售价">
          <template slot-scope="scope">
            <div>
              <span>￥{{ (scope.row.sellAmount / 100) | toFixedMoneyFilter }}</span
              ><span style="color: red; marginleft: 10px" v-if="scope.row.changeDiscount > 0">({{ (scope.row.changeDiscount / 100) | toFixedMoneyFilter }}折)</span>
            </div>
            <div class="order-mouth">期限至{{ scope.row.activeEndTime }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="quantity" label="数量"> </el-table-column>
        <el-table-column width="150" prop="totalAmount" label="小计(元)">
          <template slot-scope="scope">
            <div>￥{{ (scope.row.totalAmount / 100) | toFixedMoneyFilter }}</div>
          </template>
        </el-table-column>
      </el-table>
      <div class="order-total" style="padding-right: 20px">
        <div class="wordsStyle total-div">
          <div v-if="itemInfo.orderType === 5" style="flex: 1">备注:{{ itemInfo.remark }}</div>
          <div style="flex: 1; text-align: right">
            <span>合计：</span><span>{{ '￥' + (itemInfo.orderAmount / 100 || 0).toFixed(2) }}</span>
            <span style="color: rgb(250, 47, 47)" v-if="itemInfo.changeDiscount === 0">(0折)</span>
            <span style="color: rgb(250, 47, 47)" v-if="itemInfo.changeDiscount > 0">({{ itemInfo.changeDiscount / 100 }}折)</span>
          </div>
        </div>
        <p style="margin-top: 8px">
          <span class="payMoney">应付：</span><span class="price">{{ '￥' + (itemInfo.sellAmount / 100 || 0).toFixed(2) }}</span>
        </p>
      </div>
    </descriptions>

    <descriptions title="合同信息">
      <el-table :data="contractTable" border>
        <el-table-column label="合同编号" prop="contractNo">
          <template slot-scope="{ row }">
            <span v-if="row.orderType === 5 && !row.contractUrl">--</span>
            <span v-else>{{ row.contractNo }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="contractStatusDesc">
          <template slot-scope="{ row }">
            <span v-if="row.orderType === 5 && !row.contractUrl">--</span>
            <span v-else>{{ row.contractStatusDesc }}</span>
          </template>
        </el-table-column>
        <el-table-column label="更新时间" prop="contractUpdateTime">
          <template slot-scope="{ row }">
            <span v-if="row.orderType === 5 && !row.contractUrl">--</span>
            <span v-else>{{ row.contractUpdateTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="详情" prop="">
          <template slot-scope="{ row }">
            <el-button
              type="text"
              @click="onDownload(row)"
              :disabled="permission('ORDERCENTER_YOUSHU_CONTRACT_DOWNLOAD')"
              v-if="(row.orderType !== 5 && row.contractStatus === 1) || (row.orderType === 5 && row.contractUrl)"
              >下载</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </descriptions>

    <descriptions title="发票信息">
      <el-table :data="invoiceDetails" border>
        <el-table-column label="开票资料">
          <template slot-scope="{ row }">
            <div>{{ row.coName }}</div>
            <div>{{ row.taxNo }}</div>
            <div v-if="row.receiptType === 1">
              <div>{{ row.coAddress }}</div>
              <div>{{ row.coTel }}</div>
              <div>{{ row.accountName }}</div>
              <div>{{ row.accountNo }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="收件信息">
          <template slot-scope="{ row }">
            <div v-if="row.receiptType === 0">{{ row.email }}</div>
            <div v-if="row.receiptType === 1">
              <div>{{ row.address }}</div>
              <div>{{ row.addressee }}</div>
              <div>{{ row.tel }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="开票类型">
          <template slot-scope="{ row }">
            <div>{{ invoiceTypeEnum[row.receiptType] }}</div>
          </template>
        </el-table-column>
        <el-table-column label="开票状态">
          <template slot-scope="{ row }">
            <div>{{ invoiceStatusEnum[row.status] }}</div>
          </template>
        </el-table-column>
      </el-table>
    </descriptions>
  </div>
</template>

<script>
import Descriptions from '@/components/Descriptions/list'
import DescriptionsItem from '@/components/Descriptions/item'
// import { getCustomerPay, uploadContractFile } from '@/api/businessSupport/ysBusiness'
import { downloadBufferFile } from '@/utils'
import { invoiceTypeOptions, invoiceStatusOptions } from './data'
export default {
  name: 'ysOrderDetails',
  components: {
    Descriptions,
    DescriptionsItem
  },
  data() {
    return {
      invoiceTypeOptions,
      invoiceStatusOptions,
      listLoading: false,
      items: [
        { title: '订单编号', key: 'orderNo' },
        { title: '订单时间', key: 'orderTime' },
        { title: '状态', key: 'orderStatusStr' },
        { title: '客户名称', key: 'shopAdminName' },
        { title: '渠道来源', key: 'orderSalesUserName' },
        { title: '合同状态', key: 'contractStatusDesc' }
      ],
      itemInfo: {},
      tableData: [],
      contractTable: [],
      invoiceDetails: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async onDownload({ contractNo, orderId }) {
      let params = { contractNo, orderId }
      try {
        await downloadBufferFile(this.download_url, { isExport: true, params }, 'POST', 'json')
      } catch (e) {
        this.$message.error('下载出错了')
      }
    },
    async getList() {
      // this.listLoading = true
      // try {
      //   this.listLoading = false
      //   let response = await getCustomerPay(this.$route.query.id)
      //   this.itemInfo = response
      //   this.contractTable = [response]
      //   this.tableData = response.orderDetailList
      //   this.invoiceDetails = [response.receiptOutDTO]
      // } catch {
      //   this.listLoading = false
      //   this.tableData = []
      //   this.invoiceDetails = []
      // }
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  border-top: 16px solid #f7f8fa;
  background-color: #fff;
  padding: 16px 16px 0;
}
.order-total {
  margin-left: auto;
  margin-top: 20px;
  font-size: 14px;
  .total-div {
    display: flex;
    font-size: 14px;
    color: #949393;
    line-height: 35px;
  }
  p {
    display: flex;
    font-size: 14px;
    color: #949393;
    justify-content: flex-end;
    line-height: 35px;
    .price {
      font-size: 24px;
      color: #ed2525;
    }
  }
  p:nth-child(2) {
    color: #212430;
  }
  .wordsStyle {
    font-size: 12px;
    color: #807e7e;
  }
}
</style>
