<template>
  <section>
    <div class="search-box">
      <el-form size="small" :model="form" :inline="true" label-suffix=":" label-width="90px" @submit.native.prevent>
        <el-form-item label="商户号">
          <el-input v-model.trim="form.businessNumber" clearable></el-input>
        </el-form-item>
        <el-form-item label="商户名称">
          <el-input v-model.trim="form.businessName" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="handleToDetail({ status: 'add' })">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="data-box" v-loading="checkTabLock">
      <el-table :data="tableData">
        <el-table-column prop="serialNo" label="序列号"></el-table-column>
        <el-table-column prop="product" label="产品">
          <template slot-scope="scope">{{ scope.row.productCode ? '[' + scope.row.productCode + ']' + scope.row.productName : '' }}</template>
        </el-table-column>
        <el-table-column prop="merchantCode" label="商户编码"></el-table-column>
        <el-table-column prop="merchantName" label="商户名称"></el-table-column>
        <el-table-column prop="status" label="使用状态"></el-table-column>
        <el-table-column prop="bindingTime" label="绑定时间"></el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
      </el-table>
      <km-pagination :request="getQueryPage" :current-page.sync="currentPage" :page-size.sync="pageSize" :total="totalPage" />
    </div>
  </section>
</template>

<script>
export default {
  name: 'selfServiceEquipment',
  data() {
    return {
      form: { businessNumber: '', businessName: '' },
      checkTabLock: false,
      tableData: [
        {
          serialNo: 'SM987612345698765432',
          productCode: 'DPZZ',
          productName: '大屏自助',
          merchantCode: '123433',
          merchantName: '科脉技术股份有限公司',
          status: '已使用',
          bindingTime: '2020-09-09 10:00:00',
          createTime: '2020-09-09 10:00:00'
        },
        {
          serialNo: 'SM987612345698765432',
          productCode: 'DPZZ',
          productName: '大屏自助',
          merchantCode: '123433',
          merchantName: '科脉技术股份有限公司',
          status: '已使用',
          bindingTime: '2020-09-09 10:00:00',
          createTime: '2020-09-09 10:00:00'
        }
      ],
      currentPage: 1,
      totalPage: 0,
      pageSize: 10
    }
  },
  methods: {
    handleQueryParams() {
      const { createTime, ...params } = this.form
      return Object.assign(params, {
        from: this.userInfo.level,
        startDate: createTime?.[0] ?? '',
        endDate: createTime?.[1] ?? '',
        page: this.currentPage,
        rows: this.pageSize
      })
    },
    handleSearch() {
      this.currentPage = 1
      this.getQueryPage()
    },
    async getQueryPage() {
      try {
        this.checkTabLock = true
        // const res = await queryByPage(this.handleQueryParams())
        // this.tableData = res?.results ?? []
        // this.totalPage = res?.totalCount ?? 0
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
