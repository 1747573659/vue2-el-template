<template>
  <section class="p-retail-con">
    <el-card shadow="never" class="p-card">
      <div slot="header" class="p-card-head">
        <span class="p-card-title">商户信息</span>
      </div>
      <el-form :model="form" :disabled="$route.query.status === 'detail'" size="small" :inline="true" label-suffix=":" label-width="110px">
        <el-form-item label="经销商">
          <el-input disabled :value="`${userInfo.agentId ? '[' + userInfo.agentId + ']' : ''}${userInfo.name}`"></el-input>
        </el-form-item>
        <el-form-item label="商户名称" class="is-required">
          <km-select-page
            ref="selectPage"
            v-model="form.merchantDTO.merchantName"
            option-label="CustNameExpand"
            option-value="CustID"
            :data.sync="shopPageData"
            :request="getCustList"
            :is-max-page.sync="isShopMaxPage"
            @change="handleMerchantInfo"
            placeholder="请输入名称/商户号"
          />
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
            <el-option label="电子发票" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="延期时长" v-if="form.merchantDTO.applicationModule !== 2">
          <el-select v-model="form.merchantDTO.delayHour" @change="handleDelayHour" clearable>
            <el-option v-for="item in delayTimes" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="e-product-choose" v-if="['add', 'edit'].includes($route.query.status)">
        <template v-if="form.merchantDTO.applicationModule === 3 && form.merchantDTO.merchantId">
          <el-button type="primary" size="small" plain @click="handleProductVisible">选择授权对象</el-button>
        </template>
        <el-button
          type="primary"
          size="small"
          plain
          @click="getProductStock"
          :disabled="form.detailDTOList.length === 0"
          :loading="checkProductStockLoad"
          >刷新库存</el-button
        >
      </div>
      <el-table :data="form.detailDTOList" class="p-information-tab" :key="form.merchantDTO.applicationModule">
        <el-table-column label="序号" width="100">
          <template slot-scope="scope">{{ scope.$index + 1 }}</template>
        </el-table-column>
        <template v-if="form.merchantDTO.applicationModule !== 2">
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
        <el-table-column prop="orderInventory" label="库存数量" align="right"></el-table-column>
        <el-table-column prop="useInventory" label="消耗库存" align="right"></el-table-column>
        <el-table-column label="备注">
          <template slot-scope="scope">
            <el-input
              size="small"
              v-model="scope.row.remark"
              :disabled="$route.query.status === 'detail'"
              maxlength="100"
              clearable
              class="e-product_remark"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" v-if="$route.query.status !== 'detail' && form.merchantDTO.applicationModule === 3">
          <template slot-scope="scope">
            <el-popconfirm class="el-button el-button--text" @confirm="handleDelDetailDTO(scope)" placement="top-start" title="确定删除所选数据吗？">
              <el-button type="text" size="small" slot="reference">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog
      :visible.sync="checkProductVisible"
      @close="productVal = ''"
      :close-on-click-modal="false"
      title="选择授权对象"
      width="700px"
      class="p-address-con"
    >
      <el-form size="small" :inline="true" label-width="80px" @submit.native.prevent>
        <el-form-item label="授权信息">
          <el-input v-model="productVal" maxlength="30" placeholder="请输入税号" clearable></el-input>
        </el-form-item>
        <el-button type="primary" size="small" @click="handleTaxpayerNum">查询</el-button>
      </el-form>
      <el-table ref="product" :data="basicProductData" @select="handleSelect" @select-all="handleSelectAll" v-loading="checkProductTabLock">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="TaxpayerNum" label="税号"></el-table-column>
        <el-table-column label="类型">税号</el-table-column>
        <el-table-column label="有效期">
          <template slot-scope="scope">{{ scope.row.KMValidity || new Date() | formatTime }}</template>
        </el-table-column>
      </el-table>
      <div slot="footer">
        <el-button @click="checkProductVisible = false" size="small">取消</el-button>
        <el-button type="primary" @click="handleConfirm" size="small">确定</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import dayjs from 'dayjs'
import { delayTimes, versionMap } from '../data'
import { deepClone } from '@/utils'

import {
  authOrderWlsCustList,
  queryByAgentProduct,
  authOrderWlsCustInfo,
  queryByAgentProductAndModule,
  authOrderWcyTaxpayerNum
} from '@/api/orderCenter/orderManagement/softwareAuthorization'

export default {
  props: {
    form: {
      type: Object,
      default: () => {}
    },
    userInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      delayTimes,
      versionMap,
      shopPageData: [],
      isShopMaxPage: false,
      merchantInfo: {},
      productStockObj: {},
      checkProductStockLoad: false,
      productVal: '',
      basicProductData: [],
      searchProductData: [],
      checkProductVisible: false,
      checkProductTabLock: false,
      selectMaps: new Map(),
      currentPageSelectSets: new Set()
    }
  },
  filters: {
    formatTime(val) {
      return dayjs(val).format('YYYY-MM-DD')
    }
  },
  methods: {
    handleTaxpayerNum() {
      if (this.productVal === '') this.getProductPage()
      else this.basicProductData = this.searchProductData.filter(item => item.TaxpayerNum === this.productVal)
    },
    handleDelDetailDTO(scope) {
      this.form.detailDTOList.splice(scope.$index, 1)
      this.selectMaps.delete(scope.row.moduleCode)
      this.currentPageSelectSets.delete(scope.row.moduleCode)
    },
    handleProductVisible() {
      if (!this.merchantInfo.productCode && this.form.merchantDTO.applicationModule === 3) {
        this.$message({ type: 'warning', message: '找不到对应的周边产品' })
        return
      }
      this.checkProductVisible = true
      this.getProductPage()
    },
    async getProductPage() {
      try {
        this.checkProductTabLock = true
        const res = await authOrderWcyTaxpayerNum({ cust: this.form.merchantDTO.merchantId })
        this.basicProductData = res.map(item => {
          item.shopType = this.form.merchantDTO.applicationModule
          return item
        })
        this.searchProductData = deepClone(this.basicProductData)
        this.$nextTick(() => {
          if (this.basicProductData?.length) {
            let hasDetailDTO = ''
            this.basicProductData.forEach(item => {
              if (this.form.detailDTOList?.length) hasDetailDTO = this.form.detailDTOList.some(ele => ele.shopCode === item.TaxpayerNum)
              if ((this.selectMaps?.size && this.selectMaps.has(item.TaxpayerNum)) || hasDetailDTO) {
                this.currentPageSelectSets.add(item.TaxpayerNum)
                this.$refs.product.toggleRowSelection(item, true)
              }
              if (hasDetailDTO) this.selectMaps.set(item.TaxpayerNum, item)
            })
          }
        })
      } catch (error) {
      } finally {
        this.checkProductTabLock = false
      }
    },
    handleSelect(selection, row) {
      if (selection.length > this.currentPageSelectSets.size) {
        this.selectMaps.set(row.TaxpayerNum, row)
        this.currentPageSelectSets.add(row.TaxpayerNum)
      } else {
        this.selectMaps.delete(row.TaxpayerNum)
        this.currentPageSelectSets.delete(row.TaxpayerNum)
      }
    },
    handleSelectAll(selection) {
      if (selection?.length) {
        selection.forEach(item => {
          this.selectMaps.set(item.TaxpayerNum, item)
          this.currentPageSelectSets.add(item.TaxpayerNum)
        })
      } else {
        this.currentPageSelectSets.forEach(item => this.selectMaps.delete(item))
        this.currentPageSelectSets.clear()
      }
    },
    handleConfirm() {
      const addDetailItem = item => {
        this.form.detailDTOList.push({
          shopName: this.applicationStoreModule ? item.BranchName : '电子发票',
          shopCode: this.applicationStoreModule ? item.BranchNo : item.TaxpayerNum,
          shopType: item.shopType,
          currentValidTime: item.KMValidity ? `${item.KMValidity} 23:59:59` : dayjs().format('YYYY-MM-DD 23:59:59'),
          delayValidTime: this.setDelayValidTime(item.KMValidity),
          orderInventory: this.productStockObj?.totalAmount ?? 0,
          useInventory: this.form.merchantDTO.delayHour,
          productCode: this.merchantInfo.productCode,
          remark: ''
        })
      }
      if (this.form.detailDTOList.length === 0 && this.selectMaps.size) this.selectMaps.forEach(item => addDetailItem(item))
      else if (this.selectMaps.size && this.form.detailDTOList?.length > 0) {
        this.form.detailDTOList.forEach((item, index) => {
          if (!this.selectMaps.has(item.shopCode)) this.form.detailDTOList.splice(index, 1)
        })
        this.selectMaps.forEach((item, key) => {
          if (this.form.detailDTOList.every(ele => ele.shopCode !== key)) addDetailItem(item)
        })
      }
      this.getProductStock().then(() => (this.checkProductVisible = false))
    },
    handleDelayHour(val) {
      this.form.authOrderDTO.inventoryAmount = val
      this.form.detailDTOList.forEach(item => {
        item.delayValidTime = item.currentValidTime ? dayjs(this.setDelayValidTime(item.currentValidTime)).format('YYYY-MM-DD 23:59:59') : ''
        item.useInventory = val
      })
    },
    async handleApplicationModule(val) {
      this.form.merchantDTO.delayHour = 1
      if (!this.form.merchantDTO.merchantId) this.$message({ type: 'warning', message: '请先选择商户' })
      else {
        if (this.merchantInfo?.productCode) {
          if (val !== 1) await this.handleZbProduct()
          if (val !== 3) {
            this.setDetailDTOList()
            this.getProductStock()
          } else this.resetDTOList()
        } else this.resetDTOList()
      }
    },
    resetDTOList() {
      this.form.detailDTOList = []
      this.selectMaps.clear()
      this.currentPageSelectSets.clear()
    },
    async handleZbProduct() {
      try {
        const applicationModule = this.form.merchantDTO.applicationModule
        const res = await queryByAgentProductAndModule({
          moduleId: applicationModule === 2 ? 'WXXCX' : 'DZFP',
          productCode: this.merchantInfo.productCode
        })
        this.merchantInfo.productCode = res.productId
        if (!this.merchantInfo.productCode) this.$message({ type: 'warning', message: '找不到对应的周边产品' })
      } catch (error) {}
    },
    async handleMerchantInfo(val) {
      this.form.merchantDTO.merchantId = val
      this.form.merchantDTO.delayHour = 1
      if (val) {
        this.merchantInfo = this.shopPageData.find(item => item.CustID === val)
        this.form.merchantDTO.merchantVersion = String(this.merchantInfo.VersionType)
        this.form.merchantDTO.storeCount = this.merchantInfo.BranchCount
        this.form.merchantDTO.relationProductName = this.merchantInfo.ProductionTypeName
        if (this.merchantInfo.VersionType === 3) this.form.merchantDTO.applicationModule = 1
        if (!this.merchantInfo.productCode) this.form.detailDTOList = []
        else if (this.form.merchantDTO.applicationModule) {
          this.setDetailDTOList()
          this.getProductStock()
        }
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
          item.currentValidTime = `${dayjs(this.merchantInfo?.KMValidity).format('YYYY-MM-DD')} 23:59:59` ?? ''
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
            currentValidTime: this.merchantInfo?.KMValidity
              ? dayjs(this.merchantInfo?.KMValidity)
                  .startOf('day')
                  .format('YYYY-MM-DD 23:59:59')
              : '',
            delayValidTime: this.merchantInfo.KMValidity
              ? dayjs(this.setDelayValidTime(this.merchantInfo.KMValidity))
                  .subtract(1, 'day')
                  .format('YYYY-MM-DD 23:59:59')
              : ''
          }
        ]
      }
    },
    async getProductStock() {
      try {
        this.checkProductStockLoad = true
        const productCode = this.merchantInfo.productCode || this.form.authOrderDTO.productCode
        this.productStockObj = await queryByAgentProduct({ agentId: this.userInfo.agentId, productCode })
        this.form.detailDTOList.forEach(item => {
          item.orderInventory = this.productStockObj?.totalAmount ?? 0
        })
      } catch (error) {
      } finally {
        this.checkProductStockLoad = false
      }
    },
    async getCustList({ query = '', page = 1, rows = 10 } = {}) {
      try {
        const isNum = new RegExp(/^\d{1,}$/).test(query)
        const res = await authOrderWlsCustList({
          cust: isNum ? query : '',
          custName: !isNum && query ? query : '',
          pageIndex: page,
          pageSize: rows,
          organ: this.userInfo.organNo
        })
        res.forEach(item => (item.CustNameExpand = `${item.CustName ? item.CustName : ''}（${item.CustID}）`))
        this.shopPageData = this.shopPageData.concat(res || [])
        this.isShopMaxPage = !res || (res && res.length < 10)
      } catch (error) {}
    },
    setDelayValidTime(val) {
      const countTime = dayjs(val).isAfter(dayjs().format('YYYY-MM-DD')) ? val : dayjs().format('YYYY-MM-DD')
      return dayjs(countTime)
        .add(this.form.merchantDTO.delayHour, 'year')
        .format('YYYY-MM-DD 23:59:59')
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
    max-width: 240px;
    /deep/ .el-input__inner {
      text-align: left !important;
    }
  }
}
</style>
