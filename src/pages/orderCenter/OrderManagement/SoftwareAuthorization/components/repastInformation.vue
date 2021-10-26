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
          <el-select v-model="form.merchantDTO.merchantName" @change="handleMerchantInfo" :disabled="$route.query.status === 'detail'" placeholder="名称/商户号" filterable clearable>
            <el-option v-for="item in custListData" :key="item.CustId" :label="item.CustNameExpand" :value="item.CustId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商户号">
          <el-input :value="form.merchantDTO.merchantNo" disabled></el-input>
        </el-form-item>
        <el-form-item label="商户版本">
          <el-input :value="cyVersionMap.get(form.merchantDTO.merchantVersion)" disabled></el-input>
        </el-form-item>
        <el-form-item label="关联产品">
          <el-input :value="form.merchantDTO.relationProduct" disabled></el-input>
        </el-form-item>
        <el-form-item label="门店总数">
          <el-input :value="form.merchantDTO.storeCount" disabled></el-input>
        </el-form-item>
        <el-form-item label="应用模块">
          <el-select v-model="form.merchantDTO.applicationModule" @change="handleApplicationModule" :disabled="$route.query.status === 'detail'" clearable>
            <el-option label="门店" :value="101"></el-option>
            <el-option label="电子发票" :value="102" v-if="form.merchantDTO.merchantVersion !== '2'"></el-option>
            <el-option label="积分商城" :value="103" v-if="form.merchantDTO.merchantVersion === '1'"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="延期时长">
          <el-select v-model="form.merchantDTO.delayHour" @change="handleDelayHour" :disabled="$route.query.status === 'detail'" clearable>
            <el-option v-for="item in delayTimes" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="e-product-choose" v-if="['add', 'edit'].includes($route.query.status)">
        <el-button type="primary" size="small" plain v-if="[101, 102].includes(form.merchantDTO.applicationModule)" @click="handleProductVisible">选择授权对象</el-button>
        <el-button type="primary" size="small" plain @click="getProductStock" :disabled="form.detailDTOList.length < 0">刷新库存</el-button>
      </div>
      <el-table :data="form.detailDTOList" class="p-information-tab" :key="form.merchantDTO.applicationModule">
        <el-table-column label="序号" width="100">
          <template slot-scope="scope">{{ scope.$index + 1 }}</template>
        </el-table-column>
        <el-table-column prop="shopName" label="门店名称/商户/税号"></el-table-column>
        <el-table-column label="类型">
          <template slot-scope="scope">{{ scope.row.shopType === 101 ? '门店' : scope.row.shopType === 102 ? '电子发票' : '积分商城' }}</template>
        </el-table-column>
        <el-table-column prop="currentValidTime" label="当前有效期"></el-table-column>
        <el-table-column prop="delayValidTime" label="延期后有效期"></el-table-column>
        <el-table-column prop="orderInventory" label="下单时库存"></el-table-column>
        <el-table-column prop="useInventory" label="消耗库存"></el-table-column>
        <el-table-column label="备注">
          <template slot-scope="scope">
            <span v-if="$route.query.status === 'detail'">{{ scope.row.remark }}</span>
            <el-input v-else size="small" v-model="scope.row.remark" maxlength="100" clearable class="e-product_remark"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" v-if="$route.query.status !== 'detail'">
          <template slot-scope="scope">
            <el-popconfirm class="el-button el-button--text" @confirm="form.detailDTOList.splice(scope.$index, 1)" placement="top-start" title="确定删除所选数据吗？">
              <el-button type="text" size="small" slot="reference">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog :visible.sync="checkProductVisible" :destroy-on-close="true" title="选择授权对象" width="800px" class="p-address-con">
      <el-form size="small" :inline="true" label-width="80px" @submit.native.prevent>
        <el-form-item label="授权信息">
          <el-input v-model="productVal" maxlength="50" :placeholder="`请输入${form.merchantDTO.applicationModule === 101 ? '门店名称' : '税号'}`" clearable></el-input>
        </el-form-item>
        <el-button type="primary" size="small" @click="getProductPage">查询</el-button>
      </el-form>
      <el-table ref="product" :data="basicProductData" v-loading="checkProductTabLock">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="BranchName" label="门店名称/税号"></el-table-column>
        <el-table-column prop="shopType" label="类型">
          <template slot-scope="scope">{{ scope.row.shopType === 101 ? '门店' : '电子发票' }}</template>
        </el-table-column>
        <el-table-column prop="KMValidity" label="有效期"></el-table-column>
      </el-table>
      <km-pagination :request="getProductPage" layout="prev, pager, next" :current-page.sync="currentPage" :page-size.sync="pageSize" :total="totalPage" />
      <div slot="footer">
        <el-button @click="checkProductVisible = false" size="small">取消</el-button>
        <el-button type="primary" @click="handleConfirm" size="small">确定</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import dayjs from 'dayjs'
import { delayTimes, cyVersionMap } from '../data'

import {
  authOrderWcyCustList,
  authOrderWcyCustInfo,
  queryByAgentProduct,
  authOrderWcyBranchList,
  authOrderWcyTaxpayerNum
} from '@/api/orderCenter/orderManagement/softwareAuthorization'

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
      cyVersionMap,
      custListData: [],
      isCustListPage: false,
      merchantInfo: [],
      productStockObj: {},
      checkProductVisible: false,
      productVal: '',
      checkProductTabLock: false,
      basicProductData: [],
      currentPage: 1,
      pageSize: 10,
      totalPage: 0
    }
  },
  watch: {
    'form.detailDTOList': {
      handler(newVal) {
        return (this.form.authOrderDTO.inventoryAmount = newVal.reduce((accumulator, currentValue) => {
          return accumulator + currentValue.useInventory
        }, 0))
      },
      deep: true
    }
  },
  methods: {
    handleConfirm() {
      const Selections = this.$refs.product.selection.map(item => {
        return {
          shopName: item.BranchName,
          shopCode: item.BranchNo,
          shopType: item.shopType,
          currentValidTime: `${item.KMValidity} 00:00:00`,
          delayValidTime: this.setDelayValidTime(item.KMValidity),
          orderInventory: this.productStockObj?.totalAmount ?? 0,
          useInventory: this.form.merchantDTO.delayHour,
          productCode: this.merchantInfo.productCode,
          remark: ''
        }
      })
      this.form.detailDTOList = this.form.detailDTOList.concat(Selections)
      this.getProductStock().then(() => (this.checkProductVisible = false))
    },
    setDelayValidTime(date) {
      const countTime = dayjs(date).isAfter(dayjs().format('YYYY-MM-DD')) ? date : dayjs().format('YYYY-MM-DD')
      return dayjs(countTime)
        .add(this.form.merchantDTO.delayHour, 'year')
        .format('YYYY-MM-DD 00:00:00')
    },
    handleProductVisible() {
      this.checkProductVisible = true
      this.getProductPage()
    },
    async getProductPage() {
      try {
        this.checkProductTabLock = true
        const isNum = new RegExp(/^\d{1,}$/).test(this.productVal)
        const res =
          this.form.merchantDTO.applicationModule === 101
            ? await authOrderWcyBranchList({
                branch: isNum ? this.productVal : '',
                branchname: !isNum && this.productVal ? this.productVal : '',
                cust: this.form.merchantDTO.merchantNo
              })
            : await authOrderWcyTaxpayerNum({ cust: this.form.merchantDTO.merchantNo })
        this.basicProductData = res.map(item => {
          item.shopType = this.form.merchantDTO.applicationModule
          return item
        })
      } catch (error) {
      } finally {
        this.checkProductTabLock = false
      }
    },
    handleDelayHour(val) {
      this.form.detailDTOList.forEach(item => {
        item.delayValidTime = item.currentValidTime ? this.setDelayValidTime(item.currentValidTime) : ''
        item.useInventory = val
      })
    },
    handleApplicationModule(val) {
      if (val) {
        this.form.merchantDTO.delayHour = 1
        if (val === 103) {
          this.form.detailDTOList.push({
            shopName: this.merchantInfo.CustName,
            shopCode: this.merchantInfo.CustId,
            shopType: 103,
            currentValidTime: `${this.merchantInfo.KMValidity} 00:00:00`,
            delayValidTime: this.setDelayValidTime(this.merchantInfo.KMValidity),
            orderInventory: this.productStockObj?.totalAmount ?? 0,
            useInventory: this.form.merchantDTO.delayHour,
            productCode: this.merchantInfo.productCode,
            remark: ''
          })
        } else this.form.detailDTOList = []
      }
    },
    async handleMerchantInfo(val) {
      if (val) {
        try {
          this.form.merchantDTO.merchantNo = val
          this.merchantInfo = await authOrderWcyCustInfo({ cust: val })
          this.merchantInfo.productCode = this.custListData.filter(item => item.CustId === this.merchantInfo.CustId)[0].productCode
          this.form.merchantDTO.merchantVersion = this.merchantInfo.IsHadWxGzhForOss
          this.form.merchantDTO.storeCount = this.merchantInfo.BranchCount
          this.form.merchantDTO.relationProduct = this.merchantInfo.productionTypeName
          this.form.detailDTOList = []
          this.form.merchantDTO.applicationModule = 101
          this.getProductStock()
        } catch (error) {}
      }
    },
    async getProductStock() {
      if (!this.merchantInfo.productCode) {
        this.$message({ type: 'warning', message: '请先选择商户' })
        return
      }
      try {
        this.productStockObj = (await queryByAgentProduct({ agentId: this.userBaseInfo.agentId, productCode: this.merchantInfo.productCode })) || {}
      } catch (error) {}
    },
    async getCustList(query) {
      const res = await authOrderWcyCustList({ cust: '', custname: '', organ: this.userBaseInfo.organNo })
      this.custListData = res.filter((item, index) => index < 10 && item.CustName)
      this.custListData.forEach(item => (item.CustNameExpand = `${item.CustName}（${item.CustId}）`))
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
