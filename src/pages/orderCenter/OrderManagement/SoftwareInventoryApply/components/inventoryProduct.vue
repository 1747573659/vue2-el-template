<template>
  <el-dialog v-bind="$attrs" v-on="$listeners" :destroy-on-close="true" @close="handleProductClose" title="选择产品" width="700px" class="p-product-con">
    <el-form size="small" :inline="true" label-width="80px" @submit.native.prevent>
      <el-form-item label="产品信息">
        <el-input v-model="productVal" maxlength="50" placeholder="请输入产品编码/名称" clearable></el-input>
      </el-form-item>
      <el-button type="primary" size="small" @click="getProductPage">查询</el-button>
    </el-form>
    <el-table ref="product" :data="tableData" class="e-inventory-tab" @row-click="handleRowIndex" v-loading="checkProductTabLock">
      <el-table-column width="55">
        <template slot-scope="scope">
          <el-radio v-model="checkProductVal" :label="scope.$index"></el-radio>
        </template>
      </el-table-column>
      <el-table-column prop="code" label="产品编码"></el-table-column>
      <el-table-column prop="name" label="产品名称"></el-table-column>
    </el-table>
    <km-pagination :request="getProductPage" layout="prev, pager, next" :current-page.sync="currentPage" :page-size.sync="pageSize" :total="totalPage" />
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
      checkProductVal: '',
      checkProductTabLock: false,
      tableData: [],
      currentPage: 1,
      totalPage: 0,
      pageSize: 10
    }
  },
  methods: {
    handleRowIndex(row) {
      this.checkProductVal = this.tableData.findIndex(item => item.id === row.id)
    },
    handleConfirm() {
      this.$emit('productData', this.tableData[this.checkProductVal])
      this.$emit('update:visible', false)
    },
    handleProductClose() {
      this.currentPage = 1
      this.productVal = ''
    },
    async getProductPage() {
      try {
        this.checkProductVal = ''
        this.checkProductTabLock = true
        const { topAgentId, agentId, propertyType, level } = JSON.parse(localStorage.getItem('userInfo'))
        let data = {
          info: this.productVal.trim(),
          agentId: propertyType === 1 && level === 2 ? topAgentId : agentId,
          page: this.currentPage,
          rows: this.pageSize,
          orderType: 1
        }
        const res = await productInfo(data)
        this.tableData = res?.results ?? []
        this.totalPage = res.totalRecord ?? 0
      } catch (error) {
      } finally {
        this.checkProductTabLock = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.p-product {
  &-con {
    ::v-deep {
      .el-dialog__body {
        padding: 16px 20px;
      }
      .km-page-block {
        padding-bottom: 0px;
      }
    }
  }
}
.e-inventory {
  &-tab {
    ::v-deep {
      .el-radio__label {
        display: none;
      }
      .el-radio__inner {
        width: 16px;
        height: 16px;
      }
      .el-radio__inner::after {
        width: 8px;
        height: 8px;
      }
    }
  }
}
</style>
