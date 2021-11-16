<template>
  <section class="p-erpInformation-con">
    <el-card shadow="never" class="p-card">
      <div slot="header" class="p-card-head">
        <span class="p-card-title">商户信息</span>
      </div>
      <div class="e-product-choose" v-if="['add', 'edit'].includes($route.query.status)">
        <el-button type="primary" size="small" plain @click="handleProductVisible">选择产品模块</el-button>
        <el-button type="primary" size="small" plain @click="getProductStock" :loading="checkProductStockLoad" :disabled="form.dongleOrderDetails.length === 0">
          刷新库存
        </el-button>
      </div>
      <el-table ref="table" :data="form.dongleOrderDetails" show-summary :summary-method="getSummaries" class="p-information-tab">
        <el-table-column label="序号" width="100">
          <template slot-scope="scope">{{ scope.$index + 1 }}</template>
        </el-table-column>
        <el-table-column prop="productCode" label="产品编码"></el-table-column>
        <el-table-column prop="productName" label="产品名称"></el-table-column>
        <el-table-column label="版本">
          <template slot-scope="scope">
            <el-select v-model="scope.row.version" size="small" :disabled="$route.query.status === 'detail'" class="e-select-con">
              <el-option :value="1" label="单店版"></el-option>
              <el-option :value="2" label="网络版"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="orderInventory" label="下单时库存" align="right"></el-table-column>
        <el-table-column prop="authNum" label="本次授权数量" align="right">
          <template slot-scope="scope">
            <span v-if="$route.query.status === 'detail'">{{ scope.row.authNum }}</span>
            <el-input v-else size="small" v-model.number.trim="scope.row.authNum" @change="handleAuthNumAmount(scope.row)" style="width:100%"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="serialNumber" label="加密狗ID/序列号">
          <template slot-scope="scope">
            <span v-if="$route.query.status === 'detail'">{{ scope.row.serialNumber }}</span>
            <el-input v-else size="small" v-model="scope.row.serialNumber" maxlength="20" clearable class="e-product_remark"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="authorStr" label="授权信息串"></el-table-column>
        <el-table-column label="备注">
          <template slot-scope="scope">
            <span v-if="$route.query.status === 'detail'">{{ scope.row.remark }}</span>
            <el-input v-else size="small" v-model="scope.row.remark" maxlength="100" clearable class="e-product_remark"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" v-if="$route.query.status !== 'detail'">
          <template slot-scope="scope">
            <el-popconfirm class="el-button el-button--text" @confirm="form.dongleOrderDetails.splice(scope.$index, 1)" placement="top-start" title="确定删除所选数据吗？">
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

import { authModuleList, queryByAgentErpProduct } from '@/api/orderCenter/orderManagement/softwareAuthorization'

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
        return (row.authNum = 1)
      }
    },
    handleConfirm() {
      const Selections = this.$refs.product.selection.map(item => {
        return {
          productCode: item.moduleId,
          productName: item.moduleName,
          version: '',
          orderInventory: 0,
          authNum: 1,
          serialNumber: '',
          authorStr: '',
          remark: ''
        }
      })
      this.form.dongleOrderDetails = this.form.dongleOrderDetails.concat(Selections)
      this.getProductStock().then(() => (this.checkProductVisible = false))
    },
    async getProductStock() {
      try {
        this.checkProductStockLoad = true
        const res = await queryByAgentErpProduct({ agentId: this.userBaseInfo.agentId, productCodes: this.form.dongleOrderDetails.map(item => item.productCode) })
        if (this.form.dongleOrderDetails.length > 0 && res) {
          this.form.dongleOrderDetails.forEach(item => (item.orderInventory = res.find(ele => ele.productCode.toUpperCase() === item.productCode.toUpperCase()).totalAmount))
        }
      } catch (error) {
      } finally {
        this.checkProductStockLoad = false
      }
    },
    handleProductVisible() {
      this.checkProductVisible = true
      this.getProductPage()
    },
    async getProductPage() {
      try {
        this.checkProductTabLock = true
        const { custId, productCode } = { custId: '1b9271f0-533e-40a7-b04e-b4545ffa30dc', productCode: 'BLDPRO' }
        this.basicProductData = (await authModuleList({ moduleInfo: this.productVal, custId, productCode })) || []
      } catch (error) {
      } finally {
        this.checkProductTabLock = false
      }
    },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (['orderInventory', 'authNum'].includes(column.property)) {
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
            this.form.authOrderDTO.inventoryAmount = sums[5]
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
