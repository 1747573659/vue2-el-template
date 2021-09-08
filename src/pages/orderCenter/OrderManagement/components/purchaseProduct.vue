<template>
  <el-dialog v-bind="$attrs" v-on="$listeners" :destroy-on-close="true" title="选择产品" width="800px" class="p-address-con">
    <el-form size="small" :inline="true" label-width="80px">
      <el-form-item label="产品信息" placeholder="请输入产品编码和名称">
        <el-input v-model="productVal" maxlength="50" clearable></el-input>
      </el-form-item>
      <el-button type="primary" size="small" @click="handleProductSearch">查询</el-button>
    </el-form>
    <el-table ref="product" :data="basicProductData" v-loading="checkProductTabLock">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="code" label="产品编码"></el-table-column>
      <el-table-column prop="name" label="产品名称"></el-table-column>
    </el-table>
    <km-pagination :request="getProductPage" :current-page.sync="currentPage" :page-size.sync="pageSize" :total="totalPage" />
    <div slot="footer">
      <el-button @click="$emit('update:visible', false)" size="small">取消</el-button>
      <el-button type="primary" @click="handleConfirm" size="small">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { productInfo } from '@/api/orderCenter/orderManagement'

export default {
  data() {
    return {
      productVal: '',
      checkProductTabLock: false,
      basicProductData: [],
      currentPage: 1,
      pageSize: 10,
      totalPage: 0
    }
  },
  mounted() {
    this.getProductPage()
  },
  methods: {
    handleConfirm() {
      const Selections = this.$refs.product.selection.map(item => {
        return {
          productCode: item.code,
          productName: item.name,
          productCount: 0,
          productPrice: item.saleAmount,
          productAmount: 0,
          remark: ''
        }
      })
      this.$emit('productData', Selections)
      this.$emit('update:visible', false)
    },
    handleQueryParams() {
      return {
        params: { info: this.productVal.trim() },
        page: this.currentPage,
        rows: this.pageSize
      }
    },
    handleProductSearch() {
      this.getProductPage()
    },
    getProductPage: async function() {
      try {
        this.checkProductTabLock = true
        const { results, totalRecord } = await productInfo(this.handleQueryParams())
        this.basicProductData = results || []
        this.totalPage = totalRecord || 0
      } catch (error) {
      } finally {
        this.checkProductTabLock = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.p-address {
  &-con {
    /deep/ .el-dialog__body {
      padding: 16px 20px;
    }
  }
}
</style>
