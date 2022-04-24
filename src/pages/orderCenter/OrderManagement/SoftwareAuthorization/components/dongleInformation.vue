<template>
  <section class="p-erpInformation-con">
    <el-card shadow="never" class="p-card">
      <div slot="header" class="p-card-head">
        <span class="p-card-title">订单明细</span>
      </div>
      <div class="e-product-choose" v-if="['add', 'edit'].includes($route.query.status)">
        <el-button type="primary" size="small" plain @click="handleProductVisible">选择产品</el-button>
        <el-button type="primary" size="small" plain @click="getProductStock" :loading="checkProductStockLoad" :disabled="form.detailDTOList.length === 0"> 刷新库存 </el-button>
      </div>
      <el-table ref="table" :data="form.detailDTOList" max-height="500" show-summary :summary-method="getSummaries" class="p-information-tab">
        <el-table-column label="序号" width="100">
          <template slot-scope="scope">{{ scope.$index + 1 }}</template>
        </el-table-column>
        <el-table-column prop="productCode" label="产品编码"></el-table-column>
        <el-table-column prop="productCodeName" label="产品名称"></el-table-column>
        <el-table-column label="版本">
          <template slot-scope="scope">
            <el-select v-model="scope.row.authVersion" size="small" :disabled="$route.query.status === 'detail'" placeholder="" class="e-select-con">
              <el-option :value="2" label="单店版"></el-option>
              <el-option :value="1" label="连锁版"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="orderInventory" label="库存数量" align="right"></el-table-column>
        <el-table-column prop="authNum" label="加点数量" align="right">
          <template slot-scope="scope">
            <span v-if="$route.query.status === 'detail'">{{ scope.row.authNum }}</span>
            <el-input v-else size="small" v-model.number.trim="scope.row.authNum" @change="handleAuthNumAmount(scope.row)" style="width: 100%"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="加密狗ID/序列号">
          <template slot-scope="scope">
            <span v-if="$route.query.status === 'detail'">{{ scope.row.dogId }}</span>
            <el-input v-else size="small" v-model="scope.row.dogId" maxlength="40" clearable class="e-product_remark"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="dogAuthString" label="授权信息串" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" v-if="$route.query.status !== 'detail'">
          <template slot-scope="scope">
            <el-popconfirm class="el-button el-button--text" @confirm="handleDelDetailDTO(scope)" placement="top-start" title="确定删除所选数据吗？">
              <el-button type="text" size="small" slot="reference">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog :visible.sync="checkProductVisible" @close="productVal = ''" :close-on-click-modal="false" title="选择产品" width="700px" class="p-address-con">
      <el-form size="small" :inline="true" label-width="80px" @submit.native.prevent>
        <el-form-item label="产品信息">
          <el-input v-model="productVal" maxlength="30" placeholder="产品编码/名称" clearable></el-input>
        </el-form-item>
        <el-button type="primary" size="small" @click="getProductPage">查询</el-button>
      </el-form>
      <el-table ref="product" :data="basicProductData" @select="handleSelect" @select-all="handleSelectAll" v-loading="checkProductTabLock">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="code" label="产品编码"></el-table-column>
        <el-table-column prop="name" label="产品名称"></el-table-column>
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

import { queryByAgentErpProduct, authOrderProductPage } from '@/api/orderCenter/orderManagement/softwareAuthorization'

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
      checkProductVisible: false,
      productVal: '',
      checkProductTabLock: false,
      basicProductData: [],
      currentPage: 1,
      pageSize: 10,
      totalPage: 0,
      checkProductStockLoad: false,
      selectMaps: new Map(),
      currentPageSelectSets: new Set()
    }
  },
  methods: {
    handleDelDetailDTO(scope) {
      this.form.detailDTOList.splice(scope.$index, 1)
      this.selectMaps.delete(scope.row.productCode)
      this.currentPageSelectSets.delete(scope.row.productCode)
    },
    handleSelectAll(selection) {
      if (selection?.length) {
        selection.forEach(item => {
          this.selectMaps.set(item.code, item)
          this.currentPageSelectSets.add(item.code)
        })
      } else {
        this.currentPageSelectSets.forEach(item => this.selectMaps.delete(item))
        this.currentPageSelectSets.clear()
      }
    },
    handleSelect(selection, row) {
      if (selection.length > this.currentPageSelectSets.size) {
        this.selectMaps.set(row.code, row)
        this.currentPageSelectSets.add(row.code)
      } else {
        this.selectMaps.delete(row.code)
        this.currentPageSelectSets.delete(row.code)
      }
    },
    handleAuthNumAmount(row) {
      if (!/^\+?[1-9]{1}[0-9]{0,2}\d{0,0}$/.test(row.authNum)) {
        this.$message({ type: 'warning', message: '授权数量范围为[1-999]' })
        return (row.authNum = row.useInventory = 1)
      }
    },
    handleConfirm() {
      const addDetailItem = item => {
        this.form.detailDTOList.push({
          productCode: item.code,
          productCodeName: item.name,
          authVersion: '',
          orderInventory: 0,
          authNum: 1,
          dogId: '',
          dogAuthString: '',
          remark: '',
          useInventory: 1
        })
      }
      if (this.form.detailDTOList.length === 0) this.selectMaps.forEach(item => addDetailItem(item))
      else if (this.selectMaps.size && this.form.detailDTOList?.length > 0) {
        this.form.detailDTOList.forEach((item, index) => {
          if (!this.selectMaps.has(item.productCode)) this.form.detailDTOList.splice(index, 1)
        })
        this.selectMaps.forEach((item, key) => {
          if (this.form.detailDTOList.every(ele => ele.productCode !== key)) addDetailItem(item)
        })
      } else this.form.detailDTOList = []
      this.checkProductVisible = false
      this.getProductStock()
    },
    async getProductStock() {
      try {
        this.checkProductStockLoad = true
        const res = await queryByAgentErpProduct({ agentId: this.userInfo.agentId, productCodes: this.form.detailDTOList.map(item => item.productCode) })
        if (this.form.detailDTOList.length > 0 && res) {
          this.form.detailDTOList.forEach(item => (item.orderInventory = res.find(ele => ele.productCode.toUpperCase() === item.productCode.toUpperCase()).totalAmount))
        }
      } catch (error) {
      } finally {
        this.checkProductStockLoad = false
      }
    },
    handleProductVisible() {
      this.currentPage = 1
      this.productVal = ''
      if (!this.form.detailDTOList?.length) {
        this.selectMaps.clear()
        this.currentPageSelectSets.clear()
      }
      this.getProductPage()
      this.checkProductVisible = true
    },
    async getProductPage() {
      try {
        this.checkProductTabLock = true
        this.currentPageSelectSets.clear()
        const res = await authOrderProductPage({
          type: '1',
          isOnSale: 1,
          registerMethod: 2,
          productTypeList: [1],
          info: this.productVal,
          page: this.currentPage,
          rows: this.pageSize
        })
        this.basicProductData = res.results || []
        this.totalPage = res?.totalCount ?? 0
        this.$nextTick(() => {
          if (this.basicProductData?.length) {
            let hasDetailDTO = ''
            this.basicProductData.forEach(item => {
              if (this.form.detailDTOList?.length) hasDetailDTO = this.form.detailDTOList.some(ele => ele.productCode === item.code)
              if ((this.selectMaps?.size && this.selectMaps.has(item.code)) || hasDetailDTO) {
                this.currentPageSelectSets.add(item.code)
                this.$refs.product.toggleRowSelection(item, true)
              }
              if (hasDetailDTO) this.selectMaps.set(item.code, item)
            })
          }
        })
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
    ::v-deep {
      .el-input__inner {
        text-align: right;
      }
    }
    .e-select-con {
      ::v-deep .el-input {
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
    ::v-deep {
      .el-button {
        font-size: 16px;
      }
    }
  }
}
.p-address {
  &-con {
    ::v-deep {
      .el-dialog__body {
        padding: 16px 20px;
      }
      .km-page-block {
        padding-bottom: 0;
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
    ::v-deep .el-input__inner {
      text-align: left !important;
    }
  }
}
</style>
