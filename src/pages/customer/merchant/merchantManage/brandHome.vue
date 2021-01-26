<template>
  <div>
    <div class="search-box">
      <el-row>
        <el-col :span="20">
          <el-form :inline="true" size="small" :model="form" label-width="85px" class="xdd-btn-block__w240">
            <el-form-item label="商户信息：">
              <el-input v-model="form.merchantAdminName" maxlength="50" placeholder="请输入商户编号/名称" clearable></el-input>
            </el-form-item>
            <el-form-item label="品牌信息：">
              <el-input v-model="form.merchantName" maxlength="50" placeholder="请输入品牌编号/名称" clearable></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="getPageList">查询</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="4" style="text-align: right;">
          <el-button v-permission="'BRAND_SET_ADD'" type="primary" size="small" plain icon="el-icon-plus" @click="addShop">新增</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="data-box">
      <el-table v-loading="loading" :data="tableData" tooltip-effect="dark" style="width: 100%">
        <el-table-column prop="adminId" label="商户编号"> </el-table-column>
        <el-table-column prop="adminName" label="商户名称"> </el-table-column>
        <el-table-column prop="mid" label="品牌编码"> </el-table-column>
        <el-table-column prop="name" label="品牌名称"> </el-table-column>
        <el-table-column prop="tradeTypeName" label="行业"> </el-table-column>
        <el-table-column prop="storeNum" label="旗下门店数量">
        </el-table-column>
        <el-table-column prop="address" label="状态">
          <template slot-scope="scope">{{
            scope.row.status | fiterStatus
          }}</template>
        </el-table-column>
        <el-table-column label="操作" align="right" width="180">
          <template slot-scope="scope">
            <el-button v-permission="'BRAND_SET_EDIT'" size="small" type="text" @click="handleEdit(scope.row.id)">编辑</el-button>
            <el-popconfirm v-permission="'BRAND_SET_DEL'" style="margin: 0 12px" iconColor="#FFA033" title="确定删除所选数据吗？确定后删除品牌信息" placement="top-start" @confirm="handleDelete(scope.row.storeNum, scope.row.id)">
              <el-button slot="reference" size="small" type="text">删除</el-button>
            </el-popconfirm>
            <el-button v-permission="'BRAND_SET_STOPANDSTART'" size="small" type="text" @click="handleOperate(scope.row.id, scope.row.status)">{{ scope.row.status | fiterOperateStatus }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div v-show="total > 0" class="km-page-block">
        <el-pagination @size-change="getPageList" @current-change="handleCurrentChange" :current-page.sync="form.page" :page-sizes="[10, 30, 50]" :page-size.sync="form.rows" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import {
  queryMerchantListByPage,
  branchUpdateStatus,
  deleteMerchant,
} from '@/api/customer/merchant'
import { mapActions } from 'vuex'

export default {
  name: 'brandHome',
  filters: {
    fiterStatus(val) {
      if (val === 0) {
        return '停用'
      } else if (val === 1) {
        return '启用'
      }
    },
    fiterOperateStatus(val) {
      if (val === 0) {
        return '启用'
      } else if (val === 1) {
        return '停用'
      }
    },
  },
  data() {
    return {
      form: {
        merchantAdminName: '',
        merchantName: '',
        page: 1,
        rows: 10,
      },
      total: 0,
      loading: false,
      tableData: [],
    }
  },
  activated() {
    this.queryMerchantListByPage()
  },
  mounted() {
    this.queryMerchantListByPage()
  },
  methods: {
    ...mapActions(['delCachedView']),
    async handleDelete(num, id) {
      if (num > 0) return this.$message.error('该品牌已有门店使用，不能删除')

      await deleteMerchant({ id })
      await this.queryMerchantListByPage()
      this.$message({
        type: 'success',
        message: '删除成功!',
      })
    },
    async handleOperate(id, val) {
      await branchUpdateStatus({ id, status: val === 0 ? 1 : 0 })
      await this.queryMerchantListByPage()
      this.$message.success('操作成功！')
    },
    queryMerchantListByPage() {
      this.loading = true
      queryMerchantListByPage(this.form)
        .then((res) => {
          this.tableData = res.results
          this.total = res.totalCount
        })
        .catch(() => {
          this.total = 0
          this.tableData = []
        })
        .finally(() => {
          this.loading = false
        })
    },
    handleCurrentChange(value) {
      this.queryMerchantListByPage()
    },
    getPageList() {
      this.form.page = 1
      this.queryMerchantListByPage()
    },
    addShop() {
      this.delCachedView({ name: 'addBrand' }).then(()=> {
        this.$router.push({ path: '/customer/merchant/addBrand' })
      })
    },
    handleEdit(id) {
      this.delCachedView({ name: 'editBrand' }).then(()=> {
        this.$router.push({ path: '/customer/merchant/editBrand', query: { id } })
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.search-box{
  margin-left: -16px;
  margin-right: -16px;
  border-bottom: 16px solid #f7f8fa;
}
</style>