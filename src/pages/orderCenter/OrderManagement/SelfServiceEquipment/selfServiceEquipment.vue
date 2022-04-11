<template>
  <section>
    <div class="search-box">
      <el-form size="small" :model="form" :inline="true" label-suffix=":" label-width="90px" @submit.native.prevent>
        <el-form-item label="商户号">
          <el-input v-model.trim="form.custId" maxlength="10" clearable></el-input>
        </el-form-item>
        <el-form-item label="商户名称">
          <el-input v-model.trim="form.custName" maxlength="30" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="handleSearch">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="data-box" v-loading="checkTabLock">
      <el-table :data="tableData">
        <el-table-column prop="serialNo" label="序列号"></el-table-column>
        <el-table-column label="产品">
          <template slot-scope="scope">{{ scope.row.productCode ? `[${scope.row.productCode}] ${scope.row.productName}` : '' }}</template>
        </el-table-column>
        <el-table-column prop="custId" label="商户编码"></el-table-column>
        <el-table-column prop="custName" label="商户名称"></el-table-column>
        <el-table-column label="使用状态">
          <template slot-scope="scope">{{ scope.row.status === 0 ? '未使用' : '已使用' }}</template>
        </el-table-column>
        <el-table-column prop="bindingTime" label="绑定时间"></el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
      </el-table>
      <km-pagination :request="getQueryPage" :current-page.sync="currentPage" :page-size.sync="pageSize" :total="totalPage" />
    </div>
  </section>
</template>

<script>
import { queryOrderSelfPage } from '@/api/orderCenter/orderManagement/selfServiceEquipment'

export default {
  name: 'selfServiceEquipment',
  data() {
    return {
      form: { custId: '', custName: '' },
      checkTabLock: false,
      tableData: [],
      currentPage: 1,
      totalPage: 0,
      pageSize: 10
    }
  },
  mounted() {
    this.getQueryPage()
  },
  methods: {
    handleQueryParams() {
      return Object.assign(this.form, { orderAuth: '', page: this.currentPage, rows: this.pageSize })
    },
    handleSearch() {
      this.currentPage = 1
      this.getQueryPage()
    },
    async getQueryPage() {
      try {
        this.checkTabLock = true
        const res = await queryOrderSelfPage(this.handleQueryParams())
        this.tableData = res?.results ?? []
        this.totalPage = res?.totalCount ?? 0
      } catch (error) {
      } finally {
        this.checkTabLock = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.search-box {
  margin-left: -16px;
  margin-right: -16px;
  border-bottom: 16px solid #f7f8fa;
}
</style>
