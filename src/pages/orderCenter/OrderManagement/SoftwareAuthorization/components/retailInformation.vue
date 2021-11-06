<template>
  <section class="p-retail-con">
    <el-card shadow="never" class="p-card">
      <div slot="header" class="p-card-head">
        <span class="p-card-title">商户信息</span>
      </div>
      <el-form :model="form" :disabled="$route.query.status === 'detail'" size="small" :inline="true" label-suffix=":" label-width="110px">
        <el-form-item label="经销商">
          <el-input disabled :value="`${userBaseInfo.agentId ? '[' + userBaseInfo.agentId + ']' : ''}${userBaseInfo.name}`"></el-input>
        </el-form-item>
        <el-form-item label="商户名称" class="is-required">
          <el-select ref="shopPage" v-model="form.merchantDTO.merchantName" @change="handleMerchantInfo" placeholder="请输入名称/商户号" filterable clearable>
            <el-option v-for="item in custListData" :key="item.CustID" :label="item.CustNameExpand" :value="item.CustID"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商户号">
          <el-input :value="form.merchantDTO.merchantId" placeholder="请先选择商户" disabled></el-input>
        </el-form-item>
        <el-form-item label="商户版本">
          <el-input :value="versionMap.get(form.merchantDTO.merchantVersion)" disabled></el-input>
        </el-form-item>
        <el-form-item label="关联产品">
          <el-input :value="form.merchantDTO.relationProductName" disabled></el-input>
        </el-form-item>
        <el-form-item label="门店总数">
          <el-input :value="form.merchantDTO.storeCount" disabled></el-input>
        </el-form-item>
        <el-form-item label="应用模块">
          <el-select v-model="form.merchantDTO.applicationModule" @change="handleApplicationModule" clearable>
            <el-option label="微商城" :value="1"></el-option>
            <el-option label="商家助手" :value="2" v-if="form.merchantDTO.merchantVersion !== '3'"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="延期时长" v-if="['', 1].includes(form.merchantDTO.applicationModule)">
          <el-select v-model="form.merchantDTO.delayHour" @change="handleDelayHour" clearable>
            <el-option v-for="item in delayTimes" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="e-product-choose" v-if="['add', 'edit'].includes($route.query.status)">
        <el-button type="primary" size="small" plain @click="getProductStock" :disabled="form.detailDTOList.length === 0" :loading="checkProductStockLoad">刷新库存</el-button>
      </div>
      <el-table :data="form.detailDTOList" class="p-information-tab" :key="form.merchantDTO.applicationModule">
        <el-table-column label="序号" width="100">
          <template slot-scope="scope">{{ scope.$index + 1 }}</template>
        </el-table-column>
        <template v-if="['', 1].includes(form.merchantDTO.applicationModule)">
          <el-table-column label="当前有效期">
            <template slot-scope="scope">{{ scope.row.currentValidTime | formatTime }}</template>
          </el-table-column>
          <el-table-column label="延期后有效期">
            <template slot-scope="scope">{{ scope.row.delayValidTime | formatTime }}</template>
          </el-table-column>
        </template>
        <template v-else>
          <el-table-column label="当前状态">
            <template slot-scope="scope">{{ ['未开通', '已开通'][scope.row.openCustAssistantApp] }}</template>
          </el-table-column>
        </template>
        <el-table-column prop="orderInventory" label="下单时库存" align="right"></el-table-column>
        <el-table-column prop="useInventory" label="消耗库存" align="right"></el-table-column>
        <el-table-column label="备注">
          <template slot-scope="scope">
            <el-input size="small" v-model="scope.row.remark" :disabled="$route.query.status === 'detail'" maxlength="100" clearable class="e-product_remark"></el-input>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </section>
</template>

<script>
import dayjs from 'dayjs'
import { delayTimes, versionMap } from '../data'

import { authOrderWlsCustList, queryByAgentProduct, authOrderWlsCustInfo, queryByAgentProductAndModule } from '@/api/orderCenter/orderManagement/softwareAuthorization'

export default {
  props: {
    form: {
      type: Object,
      default: () => {}
    },
    userBaseInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      delayTimes,
      versionMap,
      custListData: [],
      isCustListPage: false,
      merchantInfo: [],
      productStockObj: {},
      checkProductStockLoad: false
    }
  },
  filters: {
    formatTime(val) {
      return dayjs(val).format('YYYY-MM-DD')
    }
  },
  methods: {
    handleDelayHour(val) {
      this.form.authOrderDTO.inventoryAmount = val
      this.form.detailDTOList.forEach(item => {
        item.delayValidTime = item.currentValidTime
          ? dayjs(this.setDelayValidTime(item.currentValidTime))
              .subtract(1, 'day')
              .format('YYYY-MM-DD 00:00:00')
          : ''
        item.useInventory = val
      })
    },
    async handleApplicationModule() {
      this.form.merchantDTO.delayHour = 1
      if (!this.form.merchantDTO.merchantId) this.$message({ type: 'warning', message: '请先选择商户' })
      else {
        if (this.$route.query.status === 'edit') this.merchantInfo = await this.getWlsCustInfo()
        if (this.merchantInfo.productCode) {
          this.setDetailDTOList()
          this.getProductStock()
        } else this.form.detailDTOList = []
      }
    },
    async handleMerchantInfo(val) {
      this.form.merchantDTO.merchantId = val
      this.form.merchantDTO.delayHour = 1
      if (val) {
        this.merchantInfo = await this.getWlsCustInfo()
        this.form.merchantDTO.merchantVersion = String(this.merchantInfo.VersionType)
        this.form.merchantDTO.storeCount = this.merchantInfo.BranchCount
        this.form.merchantDTO.relationProductName = this.merchantInfo.productionTypeName
        if (this.merchantInfo.VersionType === 3) this.form.merchantDTO.applicationModule = 1
        if (!this.merchantInfo.productCode) this.form.detailDTOList = []
        else this.getProductStock()
      } else {
        const resetDTO = { merchantVersion: '', storeCount: '', relationProductName: '', applicationModule: '' }
        this.form.merchantDTO = Object.assign(this.form.merchantDTO, resetDTO)
        this.form.detailDTOList = []
      }
      if (['2', '5'].includes(this.form.merchantDTO.merchantVersion)) {
        this.form.merchantDTO.applicationModule = ''
        this.form.detailDTOList = []
      } else if (this.form.merchantDTO.merchantVersion === '3' && this.form.detailDTOList.length > 0) {
        this.form.detailDTOList.forEach(item => {
          item.currentValidTime = `${this.merchantInfo?.KMValidity} 00:00:00` ?? ''
          item.delayValidTime = this.merchantInfo.KMValidity ? this.setDelayValidTime(this.merchantInfo.KMValidity) : ''
        })
      }
    },
    setDetailDTOList() {
      if (this.merchantInfo) {
        this.form.authOrderDTO.inventoryAmount = 1
        this.merchantInfo.KMValidity = this.merchantInfo?.KMValidity ?? dayjs().format('YYYY-MM-DD')
        this.form.detailDTOList = [
          {
            remark: '',
            productCode: this.merchantInfo.productCode,
            useInventory: this.form.merchantDTO.delayHour,
            orderInventory: this.productStockObj?.totalAmount ?? 0,
            openCustAssistantApp: this.merchantInfo.OpenCustAssistantApp,
            currentValidTime: `${this.merchantInfo?.KMValidity} 00:00:00` ?? '',
            delayValidTime: this.merchantInfo.KMValidity
              ? dayjs(this.setDelayValidTime(this.merchantInfo.KMValidity))
                  .subtract(1, 'day')
                  .format('YYYY-MM-DD 00:00:00')
              : ''
          }
        ]
      }
    },
    getWlsCustInfo() {
      return authOrderWlsCustInfo({ cust: this.form.merchantDTO.merchantId })
    },
    async getProductStock() {
      try {
        this.checkProductStockLoad = true
        const productCode = this.merchantInfo.productCode || this.form.authOrderDTO.productCode
        const baseData = { agentId: this.userBaseInfo.agentId, productCode }
        this.productStockObj =
          this.form.merchantDTO.applicationModule !== 2 ? await queryByAgentProduct(baseData) : await queryByAgentProductAndModule(Object.assign(baseData, { moduleId: 'WXXCX' }))
        this.form.detailDTOList.forEach(item => {
          item.orderInventory = this.productStockObj?.totalAmount ?? 0
        })
      } catch (error) {
      } finally {
        this.checkProductStockLoad = false
      }
    },
    async getCustList() {
      const res = await authOrderWlsCustList({ cust: '', custname: '', organ: this.userBaseInfo.organNo })
      this.custListData = res.filter((item, index) => index < 100)
      this.custListData.forEach(item => (item.CustNameExpand = `${item.CustName}（${item.CustID}）`))
    },
    setDelayValidTime(val) {
      const countTime = dayjs(val).isAfter(dayjs().format('YYYY-MM-DD')) ? val : dayjs().format('YYYY-MM-DD')
      return dayjs(countTime)
        .add(this.form.merchantDTO.delayHour, 'year')
        .format('YYYY-MM-DD 00:00:00')
    }
  }
}
</script>

<style lang="scss" scoped>
.p-retail-con {
  padding-bottom: 70px;
}
.p-information {
  &-tab {
    /deep/ {
      .el-input__inner {
        text-align: right;
      }
    }
    .e-select-con {
      /deep/ .el-input {
        width: 100%;
        &__inner {
          text-align: left;
        }
      }
    }
  }
  &-con {
    padding-bottom: 70px;
  }
}
.p-card {
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
}
.p-address {
  &-con {
    /deep/ {
      .el-dialog__body {
        padding: 16px 20px;
      }
      .km-page-block {
        padding-bottom: 0px;
      }
    }
  }
}
.e-product {
  &-choose {
    text-align: right;
    padding-bottom: 10px;
  }
  &_remark {
    width: 100%;
    /deep/ .el-input__inner {
      text-align: left !important;
    }
  }
}
</style>
