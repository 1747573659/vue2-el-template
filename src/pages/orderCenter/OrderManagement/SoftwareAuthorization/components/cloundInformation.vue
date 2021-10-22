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
          <km-select-page
            ref="shopPage"
            option-label="CustNameExpand"
            option-value="CustId"
            :data.sync="shopPageData"
            :request="getShopPage"
            :is-max-page.sync="isShopMaxPage"
            @change="handleShopPage"
            placeholder="名称/商户号"
          />
        </el-form-item>
        <el-form-item label="商户号">
          <el-input :value="form.merchantDTO.merchantNo" placeholder="请先选择商户" disabled></el-input>
        </el-form-item>
        <el-form-item label="应用系统">
          <el-select v-model="form.merchantDTO.applicationSystem" value-key="code" @change="handleAppModule" clearable>
            <el-option v-for="item in appModulesData" :key="item.code" :label="item.name" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="授权状态">
          <el-input :value="['正式', '试用'][form.merchantDTO.probationFlag]" disabled></el-input>
        </el-form-item>
        <el-form-item label="延期时长">
          <el-input value="永久" v-if="[201, 205].includes(form.merchantDTO.applicationSystem.code)" disabled></el-input>
          <el-select v-else v-model="form.merchantDTO.delayHour" @change="handleDelayHour" clearable>
            <el-option v-for="item in delayTimes" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-tabs v-model="activeName">
        <el-tab-pane label="加点" name="1"></el-tab-pane>
        <el-tab-pane label="续费" name="2" v-if="form.merchantDTO.probationFlag === 0 && ![201, 205].includes(form.merchantDTO.applicationSystem.code)"></el-tab-pane>
      </el-tabs>
      <div class="e-product-choose" v-if="['add', 'edit'].includes($route.query.status)">
        <el-button type="primary" size="small" plain @click="getProductStock" v-if="activeName === '1'">刷新库存</el-button>
        <el-button type="primary" size="small" plain @click="handleProductVisible" v-if="activeName === '2'">选择授权对象</el-button>
      </div>
      <el-table :data="form[activeName === '1' ? 'addAuthOrderDetailDTOList' : 'renewAuthOrderDetailDTOList']" :key="activeName" class="p-information-tab">
        <el-table-column label="序号" width="100">
          <template slot-scope="scope">{{ scope.$index + 1 }}</template>
        </el-table-column>
        <template v-if="activeName === '1'">
          <el-table-column prop="productCode" label="产品编码"></el-table-column>
          <el-table-column prop="productName" label="产品名称"></el-table-column>
          <el-table-column prop="orderInventory" label="下单时库存"></el-table-column>
          <el-table-column label="加点数">
            <template slot-scope="scope">
              <el-input size="small" v-model="scope.row.addNum" style="width:100%"></el-input>
            </template>
          </el-table-column>
        </template>
        <template v-else>
          <el-table-column prop="authId" label="授权ID"></el-table-column>
          <el-table-column prop="authCode" label="授权对象编码"></el-table-column>
          <el-table-column prop="authName" label="授权对象名称"></el-table-column>
          <el-table-column prop="currentValidTime" label="当前有效期"></el-table-column>
          <el-table-column prop="delayValidTime" label="延期后有效期"></el-table-column>
        </template>
        <el-table-column prop="useInventory" label="消耗库存"></el-table-column>
        <el-table-column label="备注">
          <template slot-scope="scope">
            <span v-if="$route.query.status === 'detail'">{{ scope.row.remark }}</span>
            <el-input v-else size="small" v-model="scope.row.remark" maxlength="100" clearable class="e-product_remark"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" v-if="$route.query.status !== 'detail' && activeName === '2'">
          <template slot-scope="scope">
            <el-popconfirm class="el-button el-button--text" @confirm="form.detailDTOList.splice(scope.$index, 1)" placement="top-start" title="确定删除所选数据吗？">
              <el-button type="text" size="small" slot="reference">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- <el-dialog :visible.sync="checkProductVisible" :destroy-on-close="true" title="选择授权对象" width="800px" class="p-address-con">
      <el-form size="small" :inline="true" label-width="80px" @submit.native.prevent>
        <el-form-item label="授权信息">
          <el-input v-model="productVal" maxlength="50" placeholder="授权对象编码/名称" clearable></el-input>
        </el-form-item>
        <el-button type="primary" size="small" @click="getProductPage">查询</el-button>
      </el-form>
      <el-table ref="product" :data="basicProductData" v-loading="checkProductTabLock">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="BranchName" label="授权ID"></el-table-column>
        <el-table-column prop="shopType" label="授权对象编码"></el-table-column>
        <el-table-column prop="KMValidity" label="授权对象名称"></el-table-column>
        <el-table-column prop="KMValidity" label="有效期"></el-table-column>
      </el-table>
      <el-pagination :request="getProductPage" layout="prev, pager, next" :current-page.sync="currentPage" :page-size.sync="pageSize" :total="totalPage" />
      <div slot="footer">
        <el-button @click="checkProductVisible = false" size="small">取消</el-button>
        <el-button type="primary" @click="handleConfirm" size="small">确定</el-button>
      </div>
    </el-dialog> -->
  </section>
</template>

<script>
import dayjs from 'dayjs'
import { delayTimes, cyVersionMap } from '../data'

import {
  authOrderYsCustomerList,
  authOrderYsAppModules,
  authOrderYsTrialPointDetail,
  queryByAgentProduct,
  authOrderYsByCusAndApplyList
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
      shopPageData: [],
      isShopMaxPage: false,
      appModulesData: [],

      delayTimes,
      cyVersionMap,
      custListData: [],
      isCustListPage: false,
      merchantInfo: [],
      productStockObj: {},
      activeName: '1',
      checkProductVisible: false,
      productVal: '',
      checkProductTabLock: false,
      basicProductData: [],
      currentPage: 1,
      pageSize: 10,
      totalPage: 0
    }
  },
  mounted() {
    this.getOrderYsAppModules()
  },
  methods: {
    async getProductStock(data) {
      try {
        this.productStockObj = (await queryByAgentProduct({ agentId: this.userBaseInfo.agentId, productCode: data.productCode })) || {}
      } catch (error) {}
    },
    async handleAppModule(val) {
      if (val) {
        const { merchantNo, CustName } = this.form.merchantDTO
        const res = await authOrderYsTrialPointDetail({ custId: merchantNo, appId: val.outCode, custName: CustName })
        this.$set(this.form.merchantDTO, 'probationFlag', res.ProbationFlag)
        this.getProductStock(val).then(() => {
          this.form.addAuthOrderDetailDTOList = [
            { productCode: val.productCode, productName: val.name, orderInventory: this.productStockObj.totalAmount || 0, addNum: 1, useInventory: 1, remark: '' }
          ]
        })
      }
    },
    async getShopPage({ query = '', page = 1, rows = 10 } = {}) {
      try {
        const res = await authOrderYsCustomerList({ Condition: query, OrganNo: this.userBaseInfo.organNo, PageIndex: --page, PageSize: rows })
        res.forEach(item => (item.CustNameExpand = `${item.CustName}（${item.CustId}）`))
        this.shopPageData = this.shopPageData.concat(res || [])
        this.isShopMaxPage = !res || (res && res.length < 10)
      } catch (error) {}
    },
    async handleShopPage(val) {
      if (val) {
        const { CustId: merchantNo, CustName } = this.shopPageData.filter(item => item.CustId === val)[0]
        this.form.merchantDTO = Object.assign(this.form.merchantDTO, { merchantNo, CustName })
      } else this.form.merchantDTO = Object.assign(this.form.merchantDTO, { merchantNo: '', CustName: '' })
    },
    async getOrderYsAppModules() {
      try {
        this.appModulesData = (await authOrderYsAppModules()) || []
      } catch (error) {}
    },

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
      // this.getProductStock().then(() => (this.checkProductVisible = false))
    },
    setDelayValidTime(date) {
      return dayjs(date)
        .add(this.form.merchantDTO.delayHour, 'year')
        .format('YYYY-MM-DD 00:00:00')
    },
    handleProductVisible() {
      this.checkProductVisible = true
      this.getProductPage()
    },
    // async getProductPage() {
    //   try {
    //     this.checkProductTabLock = true
    //     const res = await authOrderWcyBranchList({ branch: '', branchname: '', cust: this.form.merchantDTO.merchantNo })
    //     this.basicProductData = res.map(item => {
    //       item.shopType = this.form.merchantDTO.applicationModule
    //       return item
    //     })
    //   } catch (error) {
    //   } finally {
    //     this.checkProductTabLock = false
    //   }
    // },
    handleDelayHour(val) {
      // this.form.detailDTOList[0].delayValidTime = this.merchantInfo.KMValidity ? this.setDelayValidTime() : ''
      // this.form.detailDTOList[0].useInventory = val
    },
    handleApplicationModule(val) {
      if (val) {
        this.form.merchantDTO.delayHour = 1
        // this.form.detailDTOList[0] = {
        //   currentValidTime: `${this.merchantInfo?.KMValidity} 00:00:00` ?? '',
        //   delayValidTime: this.merchantInfo.KMValidity ? this.setDelayValidTime() : '',
        //   orderInventory: this.productStockObj?.totalAmount ?? 0,
        //   useInventory: this.form.merchantDTO.delayHour,
        //   productCode: this.merchantInfo.productCode,
        //   remark: '',
        //   currentState: this.merchantInfo.OpenCustAssistantApp
        // }
      }
    }
    // async handleMerchantInfo() {
    //   this.merchantInfo = await authOrderWcyCustInfo({ cust: this.form.merchantDTO.merchantNo })
    //   this.merchantInfo.productCode = this.custListData.filter(item => item.CustId === this.merchantInfo.CustId)[0].productCode
    //   this.form.merchantDTO.merchantVersion = this.merchantInfo.IsHadWxGzhForOss
    //   this.form.merchantDTO.storeCount = this.merchantInfo.BranchCount
    //   this.form.merchantDTO.relationProduct = this.merchantInfo.productionTypeName
    //   this.form.detailDTOList = []
    //   this.form.merchantDTO.applicationModule = 101
    //   // if (this.merchantInfo.VersionType === 3) this.form.merchantDTO.applicationModule = 1
    //   this.getProductStock()
    // },

    // async getCustList(query) {
    //   const res = await authOrderYsCustomerList({ Condition:'',OrganNo:'',PageIndex:'',PageSize:'' cust: '', custname: '', organ: this.userBaseInfo.organNo })
    //   this.custListData = res.filter((item, index) => index < 10 && item.CustName)
    //   this.custListData.forEach(item => (item.CustNameExpand = `${item.CustName}（${item.CustId}）`))
    // },
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
