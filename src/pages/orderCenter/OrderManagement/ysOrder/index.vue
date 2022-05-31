<template>
  <section>
    <div class="search-box">
      <div class="km-tips">
        <template><img src="../../../../assets/images/icon/mark.png" alt="提示" class="tips-icon" /></template>
        <div class="tips-item" v-for="(item, index) in tipsData" :key="index">{{ item.label }}：{{ item.total }}</div>
      </div>
      <el-form ref="form" size="small" label-suffix=":" :inline="true" :model="searchForm" label-width="120px" @submit.native.prevent>
        <el-row type="flex" align="bottom">
          <el-col>
            <el-form-item label="客户名称">
              <el-input v-model="searchForm.params.shopIdOrName" clearable placeholder="请输入客户名称" @keyup.enter.native="handleSearch"></el-input>
            </el-form-item>
            <el-form-item label="订单状态">
              <el-select clearable multiple v-model="searchForm.params.orderStatusList" placeholder="请选择订单状态" @keyup.enter.native="handleSearch">
                <el-option v-for="item in orderStatusOptions" :key="item.id" :label="item.name" :value="item.id"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="合同状态">
              <el-select clearable v-model="searchForm.params.contractStatus" placeholder="请选择合同状态" @keyup.enter.native="handleSearch">
                <el-option v-for="item in contractStatusOptions" :key="item.id" :label="item.name" :value="item.id"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="订单编号">
              <el-input v-model="searchForm.params.orderNo" clearable placeholder="请输入订单编号" @keyup.enter.native="handleSearch"></el-input>
            </el-form-item>
            <el-form-item label="订单金额" class="number input2">
              <el-input-number
                style="width: 130px"
                v-model="searchForm.params.orderAmountMin"
                :controls="false"
                clearable
                placeholder="请输入订单金额"
                :min="0"
                :max="999999 - 1"
                step-strictly
                @keyup.enter.native="handleSearch"
                @change="
                  val => {
                    if (val > searchForm.params.orderAmountMax) {
                      searchForm.params.orderAmountMax = val + 1
                    }
                  }
                "></el-input-number>
              <div style="padding: 0 8px; display: inline-block">-</div>
              <el-input-number
                style="width: 130px"
                v-model="searchForm.params.orderAmountMax"
                :controls="false"
                clearable
                placeholder="请输入订单金额"
                :min="searchForm.params.orderAmountMin + 1"
                :max="999999"
                step-strictly
                @keyup.enter.native="handleSearch"></el-input-number>
            </el-form-item>
            <el-form-item label="服务类型">
              <el-select clearable v-model="searchForm.params.serviceType" @keyup.enter.native="handleSearch">
                <el-option v-for="item in serviceOptions" :key="item.id" :label="item.name" :value="item.id"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="购买标识">
              <el-select placeholder="请选择" v-model="searchForm.params.buyFlag" filterable @keyup.enter.native="handleSearch">
                <el-option :key="item.id" :label="item.name" :value="item.id" v-for="item in buyFlagOptions"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="开票状态">
              <el-select clearable v-model="searchForm.params.receiptStatus" placeholder="全部" @keyup.enter.native="handleSearch">
                <el-option :key="item.id" :label="item.name" :value="item.id" v-for="item in receiptOptions"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="起始时间" class="date-picker">
              <el-date-picker
                v-model="date"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                align="right"
                :clearable="true"
                unlink-panels
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']">
              </el-date-picker>
            </el-form-item>
            <el-form-item class="form-botton">
              <el-button type="primary" @click="handleSearch">查询</el-button>
              <el-button size="small" plain @click="handleReset">重置</el-button>
              <el-button size="small" v-permission="'ORDERCENTER_YOUSHU_EXPORT'" @click="handleExport">导出</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="data-box" v-loading="isLoading">
      <el-table :data="tableData" :max-height="tabMaxHeight">
        <el-table-column label="订单编号" prop="orderNo" width="180px"></el-table-column>
        <el-table-column label="商户名称" prop="shopAdminName" width="180px"></el-table-column>
        <el-table-column label="订购服务">
          <template slot-scope="{ row }">
            <div>{{ (row.orderDetailList || []).map(v => `${v.goodsName}*${v.quantity}${v.isProbation === 1 ? '(试用版)' : ''}`).join(',') }}</div>
          </template>
        </el-table-column>
        <el-table-column label="开始时间" prop="activeTimeStr" width="140px">
          <template slot-scope="scope">
            {{ scope.row.activeTimeStr }}
          </template>
        </el-table-column>
        <el-table-column label="到期时间" prop="expiredDateAppend" width="140px">
          <template slot-scope="scope">
            {{ scope.row.expiredDateAppend }}
          </template>
        </el-table-column>
        <el-table-column align="right" prop="orderAmount" label="订单金额">
          <template slot-scope="scope">
            <span>{{ (scope.row.orderAmounts || 0).toFixed(2) }}</span>
            <div style="color: rgb(250, 47, 47)" v-if="scope.row.changeDiscount === 0">(0折)</div>
            <div style="color: rgb(250, 47, 47)" v-if="scope.row.changeDiscount > 0">({{ scope.row.changeDiscount / 100 }}折)</div>
          </template>
        </el-table-column>
        <el-table-column label="购买标识" prop="buyFlag">
          <template slot-scope="scope">
            <span>{{ buyFlagEnum[scope.row.buyFlag] || '--' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="orderStatusDesc" label="订单状态"></el-table-column>
        <el-table-column prop="contractStatusDesc" label="合同状态"></el-table-column>
        <el-table-column align="center" prop="receiptStatusDesc" label="开票状态"></el-table-column>
        <el-table-column prop="updateTime" label="更新时间" width="165"> </el-table-column>
        <el-table-column label="操作" fixed="right" align="center" width="210">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              v-if="scope.row.contractStatus === 1"
              v-permission="'ORDERCENTER_YOUSHU_CONTRACT_DOWNLOAD'"
              @click="handleContractDownload(scope.row)">
              <span>合同下载</span>
            </el-button>
            <el-button type="text" size="small" @click="handleDeatils(scope.row)">
              <span>详情</span>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <km-pagination :request="getList" :current-page.sync="searchForm.page" :page-size.sync="searchForm.rows" :total="total" />
    </div>
  </section>
</template>

<script>
import { tableMaxHeight } from '@/mixins/tableMaxHeight'
import { downloadBufferFile } from '@/utils'
import { tipsData, orderStatusOptions, contractStatusOptions, serviceOptions, buyFlagOptions, buyFlagEnum, receiptOptions } from './data'
import { customerPayPage, merchantOrderStatusStatic } from '@/api/orderCenter/orderManagement/ysOrder'

export default {
  name: 'ysMerchantManagement',
  mixins: [tableMaxHeight],
  data() {
    return {
      download_url: process.env.VUE_APP_BASE_API + '/youshu/customerpay/download',
      ontractDownload_url: process.env.VUE_APP_BASE_API + '/youshu/customerpay/downloadContractByFddId',
      tipsData,
      orderStatusOptions,
      contractStatusOptions,
      serviceOptions,
      buyFlagOptions,
      buyFlagEnum,
      receiptOptions,
      searchForm: {
        page: 1,
        rows: 10,
        params: {
          shopIdOrName: '',
          orderStatusList: [],
          contractStatus: '',
          orderNo: '',
          serviceType: '',
          receiptStatus: '',
          startTime: '',
          endTime: '',
          orderAmountMin: undefined,
          orderAmountMax: undefined
        }
      },
      total: 0,
      tableData: [],
      isLoading: false,
      date: []
    }
  },
  watch: {
    date(val) {
      if (val && val.length > 0) {
        this.searchForm.params.startTime = val[0] + ' 00:00:00'
        this.searchForm.params.endTime = val[1] + ' 23:59:59'
      } else {
        this.searchForm.params.startTime = ''
        this.searchForm.params.endTime = ''
      }
    }
  },
  created() {
    this.merchantOrderStatusStatic()
    this.handleSearch()
  },
  methods: {
    handleSearch() {
      this.searchForm.page = 1
      this.getList()
    },
    async getList() {
      this.isLoading = true
      try {
        let res = await customerPayPage(this.searchForm)
        this.tableData = res.results || []
        this.total = res.totalRecord
        this.isLoading = false
      } catch {
        this.isLoading = false
      }
    },
    handleReset() {
      this.searchForm = {
        page: 1,
        rows: 10,
        params: {
          shopIdOrName: '',
          orderStatusList: [],
          contractStatus: '',
          orderNo: '',
          serviceType: '',
          receiptStatus: '',
          startTime: '',
          endTime: '',
          orderAmountMin: undefined,
          orderAmountMax: undefined
        }
      }
      this.date = []
      this.handleSearch()
    },
    async merchantOrderStatusStatic() {
      let res = await merchantOrderStatusStatic()
      if (res) {
        this.tipsData.map(e => {
          e.total = res[e.key]
        })
      }
    },
    async handleContractDownload({ orderId }) {
      try {
        await downloadBufferFile(this.ontractDownload_url, { orderId }, 'POST', 'json')
      } catch (e) {
        this.$message.error('下载出错了')
      }
    },
    async handleExport() {
      try {
        await downloadBufferFile(this.download_url, this.searchForm, 'POST', 'json', '有数商户订单')
      } catch (e) {
        this.$message.error('下载出错了')
      }
    },
    handleDeatils(row) {
      this.$router.push({ path: `/orderCenter/OrderManagement/ysOrderDetail?id=${row.orderId}` })
    }
  }
}
</script>

<style lang="scss" scoped>
.search-box {
  margin-left: -16px;
  margin-right: -16px;
  border-bottom: 16px solid #f7f8fa;
  .km-tips {
    border-radius: 2px;
    min-height: 40px;
    max-height: 40px;
    background: rgba(255, 96, 16, 0.08);
    border: 1px solid rgba(255, 96, 16, 0.4);
    display: flex;
    align-items: center;
    padding: 7px 16px;
    margin: 0 8px 16px 8px;
    .tips-icon {
      width: 16px;
      height: 16px;
      margin-right: 8px;
    }
    .tips-item {
      font-size: 14px;
      color: #3d4966;
      &:not(:last-child) {
        margin-right: 30px;
      }
    }
  }
  .form-botton {
    margin-left: 120px;
  }
}
.data-box {
  .e-btn-reason {
    margin-left: 12px;
  }
  .archive-table-oneline {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}

.input2 {
  ::v-deep {
    .el-input {
      width: 100%;
    }
  }
}
</style>
