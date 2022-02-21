<template>
  <section>
    <div class="search-box">
      <el-form size="small" :model="form" :inline="true" label-suffix=":" label-width="80px" @submit.native.prevent>
        <el-row type="flex" align="bottom">
          <el-col :xl="22" :lg="21">
            <el-form-item label="订单日期">
              <el-date-picker
                v-model="form.createTime"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions"
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']"
                clearable
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="订单状态">
              <el-select v-model="form.orderStatus" clearable>
                <el-option
                  v-for="item in Array.from(orderStatus).filter(item => ![5, 10].includes(item[0]))"
                  :key="item[1].value"
                  :label="item[1].label"
                  :value="item[1].value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="付款状态">
              <el-select v-model="form.payStatus" clearable>
                <el-option v-for="item in paymentStatus" :key="item[1].value" :label="item[1].label" :value="item[1].value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="发货状态">
              <el-select v-model="form.goodsStatus" clearable>
                <el-option v-for="item in deliveryStatus" :key="item[1].value" :label="item[1].label" :value="item[1].value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="下单人">
              <km-select-page
                v-model="form.createUser"
                :data.sync="ordererData"
                option-label="userName"
                option-value="id"
                :request="handleOrderPage"
                :is-max-page.sync="isOrdererMaxPage"
                placeholder="全部"
              ></km-select-page>
            </el-form-item>
            <el-form-item label="订单编码">
              <el-input v-model.trim="form.billNo" clearable></el-input>
            </el-form-item>
            <el-form-item style="margin-left:80px">
              <el-button type="primary" size="small" @click="handleSearch">查询</el-button>
              <el-button size="small" v-permission="'HARDWARE_PURCHASE_ORDER_EXPORT'" :loading="checkExportLoad" @click="handleExport">导出</el-button>
              <km-export-view ref="export" v-permission="'HARDWARE_PURCHASE_ORDER_EXPORT'" :request-export-log="handleExportRecord" :request-export-del="handleExportDel">
                <el-table-column label="进度" width="100">
                  <template slot-scope="scope">{{ ['生成中', '已生成'][scope.row.status - 1] }}</template>
                </el-table-column>
                <el-table-column label="操作" width="100">
                  <template slot-scope="scope">
                    <template v-if="scope.row.status === 2">
                      <el-link :href="scope.row.fileUrl" :underline="false">
                        <el-button size="small" type="text">下载</el-button>
                      </el-link>
                      <el-button size="small" @click="$refs.export.handleExportDel(scope.row)" type="text" style="margin-left: 8px;">删除</el-button>
                    </template>
                    <span v-else>--</span>
                  </template>
                </el-table-column>
              </km-export-view>
            </el-form-item>
          </el-col>
          <el-col :xl="2" :lg="3" style="text-align:right">
            <el-form-item v-permission="'HARDWARE_PURCHASE_ORDER_PLUS'">
              <el-button type="primary" size="small" plain icon="el-icon-plus" @click="handleHardWareDetail({ status: 'add' })">新增</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="data-box" v-loading="checkTabLock">
      <el-table :data="tableData">
        <el-table-column prop="createOrderTime" label="订单时间" width="165"></el-table-column>
        <el-table-column prop="billNo" label="订单编码" width="150"></el-table-column>
        <el-table-column label="订单状态" width="140">
          <template slot-scope="scope">
            <span :class="{ 'p-mark-text': scope.row.orderStatus !== 40 }">{{ orderStatus.has(scope.row.orderStatus) ? orderStatus.get(scope.row.orderStatus).label : '--' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="订单金额" align="right" min-width="100">
          <template slot-scope="scope">{{ scope.row.orderAmount | formatAmount }}</template>
        </el-table-column>
        <el-table-column label="付款状态">
          <template slot-scope="scope">
            <span :class="{ 'p-mark-text': scope.row.payStatus !== 2 }">{{ paymentStatus.has(scope.row.payStatus) ? paymentStatus.get(scope.row.payStatus).label : '--' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="发货状态">
          <template slot-scope="scope">{{ deliveryStatus.has(scope.row.goodsStatus) ? deliveryStatus.get(scope.row.goodsStatus).label : '--' }}</template>
        </el-table-column>
        <el-table-column prop="handUserName" label="受理人"></el-table-column>
        <el-table-column prop="createUserName" label="下单人"></el-table-column>
        <el-table-column label="使用本金" align="right" min-width="100">
          <template slot-scope="scope">{{ scope.row.useAmount | formatAmount }}</template>
        </el-table-column>
        <el-table-column label="使用赠金" align="right" min-width="100">
          <template slot-scope="scope">{{ scope.row.useAmountGift | formatAmount }}</template>
        </el-table-column>
        <el-table-column label="担保金额" align="right" min-width="100">
          <template slot-scope="scope">{{ scope.row.useGuarantee | formatAmount }}</template>
        </el-table-column>
        <el-table-column label="担保人">
          <template slot-scope="scope">{{ scope.row.guaranteePeopleName || '--' }}</template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="110">
          <template slot-scope="scope">
            <template v-if="[0, 5, 10].includes(scope.row.orderStatus)">
              <el-button v-permission="'HARDWARE_PURCHASE_ORDER_EDIT'" type="text" size="small" @click="handleHardWareDetail({ status: 'edit' }, scope.row)">编辑</el-button>
            </template>
            <el-button v-else type="text" size="small" @click="handleHardWareDetail({ status: 'detail' }, scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <km-pagination :request="getQueryPage" :current-page.sync="currentPage" :page-size.sync="pageSize" :total="totalPage" />
    </div>
  </section>
</template>

<script>
import { deliveryStatus } from '../index'
import { purchaseOrder } from '../mixins/purchaseOrder'

export default {
  name: 'hardwarePurchaseOrder',
  mixins: [purchaseOrder],
  data() {
    return {
      deliveryStatus,
      form: {
        createTime: '',
        orderStatus: -1,
        payStatus: -1,
        goodsStatus: -1,
        createUser: -1,
        billNo: ''
      }
    }
  },
  methods: {
    handleHardWareDetail(status, row = {}) {
      this.delCachedView({ name: 'hardwarePurchaseDetails' }).then(() => {
        this.$router.push({ name: 'hardwarePurchaseDetails', query: { ...status, orderStatus: row.orderStatus, id: row.id } })
      })
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
.p-mark-text {
  color: red;
}
</style>
