<template>
  <el-dialog v-bind="$attrs" v-on="$listeners" :destroy-on-close="true" title="选择产品" width="700px" class="p-address-con">
    <el-form size="small" :inline="true" label-width="80px">
      <el-form-item label="产品信息" placeholder="请输入产品编码和名称">
        <el-input v-model="productVal" maxlength="50"></el-input>
      </el-form-item>
      <el-button type="primary" size="small" @click="handleProductSearch">查询</el-button>
    </el-form>
    <el-table :data="basicProductData" v-loading="checkProductTabLock">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="code" label="产品编码"></el-table-column>
      <el-table-column prop="name" label="产品名称"></el-table-column>
    </el-table>
    <div slot="footer">
      <el-button @click="$emit('update:visible', false)" size="small">取 消</el-button>
      <el-button type="primary" @click="$emit('update:visible', false)" size="small">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      productVal: '',
      checkProductTabLock: false,
      basicProductData: [
        { code: 'KMD02', name: '店务通手持终端KMD02', purchaseNumber: 2, price: 3600.01, amount: 7200.01, remark: '' },
        { code: 'KMD02', name: '店务通手持终端KMD02', purchaseNumber: 3, price: 3600.02, amount: 10800.02, remark: '' }
      ]
    }
  },
  methods: {
    handleProductSearch: async function() {
      try {
        this.checkProductTabLock = true
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
