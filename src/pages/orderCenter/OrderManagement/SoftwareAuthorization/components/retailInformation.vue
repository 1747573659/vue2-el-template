<template>
  <section>
    <el-card shadow="never" class="p-card">
      <div slot="header" class="p-card-head">
        <span class="p-card-title">商户信息</span>
      </div>
      <el-form :model="form" size="small" :inline="true" label-suffix=":" label-width="110px">
        <el-form-item label="经销商">
          <el-input disabled :value="`${userBaseInfo.agentId ? '[' + userBaseInfo.agentId + ']' : ''}${userBaseInfo.name}`"></el-input>
        </el-form-item>
        <el-form-item label="商户名称">
          <el-select
            ref="shopPage"
            v-model="form.merchantDTO.merchantName"
            @change="handleMerchantInfo"
            :disabled="$route.query.status === 'detail'"
            placeholder="名称/商户号"
            filterable
            clearable
          >
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
          <el-select v-model="form.merchantDTO.applicationModule" :disabled="$route.query.status === 'detail'" @change="handleApplicationModule" clearable>
            <el-option label="微商城" :value="1"></el-option>
            <el-option label="商家助手" :value="2" v-if="form.merchantDTO.merchantVersion !== '3'"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="延期时长" v-if="['', 1].includes(form.merchantDTO.applicationModule)">
          <el-select v-model="form.merchantDTO.delayHour" @change="handleDelayHour" clearable :disabled="$route.query.status === 'detail'">
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
          <el-table-column prop="currentValidTime" label="当前有效期"></el-table-column>
          <el-table-column prop="delayValidTime" label="延期后有效期"></el-table-column>
        </template>
        <template v-else>
          <el-table-column label="当前状态">
            <template slot-scope="scope">{{ ['未开通', '已开通'][scope.row.currentState] }}</template>
          </el-table-column>
        </template>
        <el-table-column prop="orderInventory" label="下单时库存" align="right"></el-table-column>
        <el-table-column prop="useInventory" label="消耗库存" align="right"></el-table-column>
        <el-table-column label="备注">
          <template slot-scope="scope">
            <span v-if="$route.query.status === 'detail'">{{ scope.row.remark }}</span>
            <el-input v-else size="small" v-model="scope.row.remark" maxlength="100" clearable class="e-product_remark"></el-input>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </section>
</template>

<script>
import dayjs from 'dayjs'
import { delayTimes, versionMap } from '../data'

import { authOrderWlsCustList, queryByAgentProduct, authOrderWlsCustInfo } from '@/api/orderCenter/orderManagement/softwareAuthorization'

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
  methods: {
    handleDelayHour(val) {
      this.form.authOrderDTO.inventoryAmount = val
      this.form.detailDTOList.forEach(item => {
        item.delayValidTime = item.currentValidTime ? this.setDelayValidTime(item.currentValidTime) : ''
        item.useInventory = val
      })
    },
    handleApplicationModule() {
      this.form.merchantDTO.delayHour = 1
      this.form.authOrderDTO.inventoryAmount = 1
      this.form.detailDTOList = [
        {
          currentValidTime: `${this.merchantInfo?.KMValidity} 00:00:00` ?? '',
          delayValidTime: this.merchantInfo.KMValidity ? this.setDelayValidTime(this.merchantInfo.KMValidity) : '',
          orderInventory: this.productStockObj?.totalAmount ?? 0,
          useInventory: this.form.merchantDTO.delayHour,
          productCode: this.merchantInfo.productCode,
          remark: '',
          currentState: this.merchantInfo.OpenCustAssistantApp
        }
      ]
    },
    async handleMerchantInfo(val) {
      this.form.merchantDTO.merchantId = val
      this.merchantInfo = await authOrderWlsCustInfo({ cust: this.form.merchantDTO.merchantId })
      this.form.merchantDTO.merchantVersion = String(this.merchantInfo.VersionType)
      this.form.merchantDTO.storeCount = this.merchantInfo.BranchCount
      this.form.merchantDTO.relationProductName = this.merchantInfo.productionTypeName
      if (this.merchantInfo.VersionType === 3) this.form.merchantDTO.applicationModule = 1
      this.form.merchantDTO.delayHour = 1
      this.form.merchantDTO.applicationModule = ''
      if (this.form.detailDTOList.length > 0) {
        if (['2', '5'].includes(this.form.merchantDTO.merchantVersion)) this.form.detailDTOList = []
        else if (this.form.merchantDTO.merchantVersion === '3') {
          this.form.detailDTOList.forEach(item => {
            item.currentValidTime = `${this.merchantInfo?.KMValidity} 00:00:00` ?? ''
            item.delayValidTime = this.merchantInfo.KMValidity ? this.setDelayValidTime(this.merchantInfo.KMValidity) : ''
          })
        }
      }
      this.getProductStock()
    },
    async getProductStock() {
      try {
        this.checkProductStockLoad = true
        const productCode = this.$route.query.status === 'add' ? this.merchantInfo?.productCode : this.form.authOrderDTO.productCode
        this.productStockObj = (await queryByAgentProduct({ agentId: this.userBaseInfo.agentId, productCode })) || {}
        this.form.detailDTOList.forEach(item => {
          item.orderInventory = this.productStockObj?.totalAmount ?? 0
        })
      } catch (error) {
      } finally {
        this.checkProductStockLoad = false
      }
    },
    async getCustList(query) {
      const res = await authOrderWlsCustList({ cust: '', custname: '', organ: this.userBaseInfo.organNo })
      this.custListData = res
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
