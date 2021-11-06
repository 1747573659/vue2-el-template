<template>
  <section class="p-erpInformation-con">
    <el-card shadow="never" class="p-card">
      <div slot="header" class="p-card-head">
        <span class="p-card-title">商户信息</span>
      </div>
      <el-form :model="form" size="small" :disabled="$route.query.status === 'detail'" :inline="true" label-suffix=":" label-width="110px">
        <el-form-item label="经销商">
          <el-input disabled :value="`${userBaseInfo.agentId ? '[' + userBaseInfo.agentId + ']' : ''}${userBaseInfo.name}`"></el-input>
        </el-form-item>
        <el-form-item label="商户名称" class="is-required">
          <km-select-page
            ref="selectPage"
            v-model="form.erpAuthMerchantDTO.merchantName"
            option-label="custNameExpand"
            option-value="custId"
            :data.sync="shopPageData"
            :request="getShopPage"
            :is-max-page.sync="isShopMaxPage"
            @change="handleShopPage"
            placeholder="请输入名称/商户号"
          />
        </el-form-item>
        <el-form-item label="商户号">
          <el-input :value="form.erpAuthMerchantDTO.merchantId" placeholder="请先选择商户" disabled></el-input>
        </el-form-item>
        <el-form-item label="授权状态">
          <el-input :value="['试用', '试用', '正式', '停用'][parseFloat(form.erpAuthMerchantDTO.authStatus)]" disabled></el-input>
        </el-form-item>
        <el-form-item label="产品">
          <el-input
            :value="`${form.erpAuthMerchantDTO.productCode ? '[' + form.erpAuthMerchantDTO.productCode + ']' : ''}${form.erpAuthMerchantDTO.productName || ''}`"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="门店授权站点">
          <el-input :value="form.erpAuthMerchantDTO.authCount" disabled></el-input>
        </el-form-item>
      </el-form>
      <div class="e-product-choose" v-if="['add', 'edit'].includes($route.query.status)">
        <el-button type="primary" size="small" plain @click="handleProductVisible">选择产品模块</el-button>
        <el-button type="primary" size="small" plain @click="getProductStock" :loading="checkProductStockLoad" :disabled="form.erpAuthOrderDetails.length === 0">
          刷新库存
        </el-button>
      </div>
      <el-table ref="table" :data="form.erpAuthOrderDetails" show-summary :summary-method="getSummaries" class="p-information-tab">
        <el-table-column label="序号" width="100">
          <template slot-scope="scope">{{ scope.$index + 1 }}</template>
        </el-table-column>
        <el-table-column prop="moduleCode" label="模块编码"></el-table-column>
        <el-table-column prop="moduleName" label="模块名称"></el-table-column>
        <el-table-column prop="authPoint" label="已授权点数" v-if="['2', '3'].includes(form.erpAuthMerchantDTO.authStatus)" align="right"></el-table-column>
        <el-table-column prop="orderInventory" label="下单时库存" align="right"></el-table-column>
        <el-table-column prop="authNum" label="本次授权数量" align="right">
          <template slot-scope="scope">
            <span v-if="$route.query.status === 'detail'">{{ scope.row.authNum }}</span>
            <el-input v-else size="small" v-model.number.trim="scope.row.authNum" @change="handleAuthNumAmount(scope.row)" style="width:100%"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="银联通道">
          <template slot-scope="scope">
            <km-select-page
              ref="unionChannel"
              v-if="['BNK', 'BNK1', 'BNK5'].includes(scope.row.moduleCode)"
              size="small"
              v-model="scope.row.unionChannel"
              option-label="channelName"
              option-value="channelCode"
              :data.sync="channelData"
              :request="getChannelPage"
              :disabled="$route.query.status === 'detail'"
              :is-max-page.sync="isChannelPage"
              placeholder="银联通道"
              class="e-select-con"
            />
          </template>
        </el-table-column>
        <el-table-column label="备注">
          <template slot-scope="scope">
            <el-input size="small" v-model="scope.row.remark" :disabled="$route.query.status === 'detail'" maxlength="100" clearable class="e-product_remark"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" v-if="$route.query.status !== 'detail'">
          <template slot-scope="scope">
            <el-popconfirm class="el-button el-button--text" @confirm="form.erpAuthOrderDetails.splice(scope.$index, 1)" placement="top-start" title="确定删除所选数据吗？">
              <el-button type="text" size="small" slot="reference">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog :visible.sync="checkProductVisible" @close="productVal = ''" :close-on-click-modal="false" title="选择产品模块" width="700px" class="p-address-con">
      <el-form size="small" :inline="true" label-width="80px" @submit.native.prevent>
        <el-form-item label="产品信息">
          <el-input v-model="productVal" maxlength="50" placeholder="模块编码/模块名称" clearable></el-input>
        </el-form-item>
        <el-button type="primary" size="small" @click="getProductPage">查询</el-button>
      </el-form>
      <el-table ref="product" :data="basicProductData" v-loading="checkProductTabLock">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="moduleId" label="模块编码"></el-table-column>
        <el-table-column prop="moduleName" label="模块名称"></el-table-column>
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
import NP from 'number-precision'

import { authShopPage, authModuleList, queryByAgentErpProduct, queryChannelPage } from '@/api/orderCenter/orderManagement/softwareAuthorization'

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
      channelData: [],
      isChannelPage: false,
      checkProductVisible: false,
      productVal: '',
      checkProductTabLock: false,
      basicProductData: [],
      currentPage: 1,
      pageSize: 10,
      totalPage: 0,
      checkProductStockLoad: false
    }
  },
  methods: {
    handleAuthNumAmount(row) {
      if (!/^\+?[1-9]{1}[0-9]{0,2}\d{0,0}$/.test(row.authNum)) {
        this.$message({ type: 'warning', message: '授权数量范围为[1-999]' })
        row.authNum = 1
      }
    },
    handleShopPage(val) {
      if (val) {
        const { authCount, productId: productCode, productName, status: authStatus, custId: merchantId } = this.shopPageData.filter(item => item.custId === val)[0]
        this.form.erpAuthMerchantDTO = Object.assign(this.form.erpAuthMerchantDTO, { authCount, productCode, productName, authStatus, merchantId })
      } else this.form.erpAuthMerchantDTO = Object.assign(this.form.erpAuthMerchantDTO, { authCount: '', productCode: '', productName: '', authStatus: '', merchantId: '' })
      this.form.erpAuthOrderDetails = []
    },
    handleConfirm() {
      const Selections = this.$refs.product.selection.map(item => {
        return {
          moduleCode: item.moduleId,
          moduleName: item.moduleName,
          authPoint: [0, 1].includes(this.form.erpAuthMerchantDTO.authStatus) ? 0 : item?.authNum ?? 0,
          orderInventory: 0,
          authNum: 1,
          productCode: item.productId,
          unionChannel: '',
          remark: ''
        }
      })
      this.form.erpAuthOrderDetails = this.form.erpAuthOrderDetails.concat(Selections)
      if (this.form.erpAuthOrderDetails.some(item => ['BNK', 'BNK1', 'BNK5'].includes(item.moduleCode))) this.getChannelPage()
      this.getProductStock().then(() => (this.checkProductVisible = false))
    },
    async getProductStock() {
      try {
        this.checkProductStockLoad = true
        const res = await queryByAgentErpProduct({ agentId: this.userBaseInfo.agentId, productCodes: this.form.erpAuthOrderDetails.map(item => item.productCode) })
        if (this.form.erpAuthOrderDetails.length > 0 && res) {
          this.form.erpAuthOrderDetails.forEach(item => (item.orderInventory = res.find(ele => ele.productCode.toUpperCase() === item.productCode.toUpperCase()).totalAmount))
        }
      } catch (error) {
      } finally {
        this.checkProductStockLoad = false
      }
    },
    handleProductVisible() {
      if (!this.form.erpAuthMerchantDTO.merchantId) this.$message({ type: 'warning', message: '请先选择商户' })
      else {
        this.checkProductVisible = true
        this.getProductPage()
      }
    },
    async getProductPage() {
      try {
        this.checkProductTabLock = true
        const { merchantId: custId, productCode } = this.form.erpAuthMerchantDTO
        this.basicProductData = (await authModuleList({ moduleInfo: this.productVal, custId, productCode })) || []
      } catch (error) {
      } finally {
        this.checkProductTabLock = false
      }
    },
    async getChannelPage({ query = '', page = 1, rows = 10 } = {}) {
      try {
        const res = await queryChannelPage({ channelName: query, page, rows })
        this.channelData = this.channelData.concat(res.results || [])
        this.isChannelPage = !res.results || (res.results && res.results.length < 10)
      } catch (error) {}
    },
    async getShopPage({ query = '', page = 1, rows = 10 } = {}) {
      try {
        const isNum = new RegExp(/[\u4e00-\u9fa5]/).test(query)
        const res = await authShopPage({ custId: !isNum ? query : '', authShopMessage: isNum && query ? query : '', page, rows })
        res.results.forEach(item => (item.custNameExpand = `${item.custName}（${item.custId}）`))
        this.shopPageData = this.shopPageData.concat(res.results || [])
        this.isShopMaxPage = !res.results || (res.results && res.results.length < 10)
      } catch (error) {}
    },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (['authPoint', 'authNum'].includes(column.property)) {
          const values = data.map(item => parseFloat(item[column.property]))
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                return NP.plus(prev, curr)
              } else {
                return prev
              }
            }, 0)
            this.form.authOrderDTO.inventoryAmount = sums[['2', '3'].includes(this.form.erpAuthMerchantDTO.authStatus) ? 5 : 4]
          }
        }
      })
      return sums
    }
  }
}
</script>

<style lang="scss" scoped>
.p-erpInformation-con {
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
