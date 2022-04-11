<template>
  <div>
    <div class="search-box">
      <el-form ref="form" size="small" label-suffix=":" :inline="true" :model="form" label-width="80px">
        <el-form-item label="创建日期">
          <el-date-picker v-model="form.time" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="资料信息">
          <el-input style="width: 240px" clearable placeholder="请输入资料名称" v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="km-role-search" :loading="cxLoading" @click="search">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="data-box">
      <el-table :loading="tableLoading" :max-height="tabMaxHeight" :data="tableData" style="width: 100%">
        <el-table-column label="资料名称">
          <template slot-scope="scope">
            <span :title="scope.row.name">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="资料描述">
          <template slot-scope="scope">
            <span :title="scope.row.remark">{{ scope.row.remark }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="350px"> </el-table-column>
        <el-table-column label="操作" align="right" width="150px">
          <template slot-scope="scope">
            <el-button @click="downLoad(scope.row)" type="text" size="small" v-permission="'MATERIAL_INDEX_DOWN'">下载</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="km-page-block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 30, 50]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalPage">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { queryDocumentByPage } from '@/api/setting/material'
import { downloadForURL } from '@/utils'
import { tableMaxHeight } from '@/mixins/tableMaxHeight'

export default {
  name: 'materialDownload',
  mixins: [tableMaxHeight],
  data() {
    return {
      form: {
        name: '',
        time: []
      },
      tableData: [],
      currentPage: 1,
      totalPage: 0,
      pageSize: 10,
      cxLoading: false,
      tableLoading: false
    }
  },
  methods: {
    search() {
      this.cxLoading = true
      this.currentPage = 1
      this.getList()
    },
    downLoad(row) {
      downloadForURL(row.completeUrl)
    },
    handleSizeChange(value) {
      this.pageSize = value
      this.currentPage = 1
      this.getList()
    },
    handleCurrentChange(value) {
      this.currentPage = value
      this.getList()
    },
    async getList() {
      this.tableLoading = true
      let data = {
        endTime: this.form.time && this.form.time[1],
        name: this.form.name,
        orders: {},
        page: this.currentPage,
        rows: this.pageSize,
        startTime: this.form.time && this.form.time[0]
      }
      try {
        const res = await queryDocumentByPage(data)
        this.tableData = res.results
        this.totalPage = res.totalCount
      } catch (e) {
      } finally {
        this.cxLoading = false
        this.tableLoading = false
      }
    }
  },
  mounted() {
    this.getList()
  }
}
</script>

<style lang="scss" scoped>
.search-box {
  margin-left: -16px;
  margin-right: -16px;
  border-bottom: 16px solid #f7f8fa;
}
.km-role-search {
  padding: 8px 22px;
}
</style>
