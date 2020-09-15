<template>
  <div>
    <div class="search-box">
      <el-form ref="form" size="small" label-suffix=":" :inline="true" :model="form" label-width="80px">
        <el-form-item label="申请时间">
          <el-date-picker
            v-model="form.time"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="资料状态">
          <el-select style="width: 240px" clearable v-model="form.status" placeholder="全选">
            <el-option
              v-for="item in statusList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="认证状态">
          <el-select style="width: 240px" clearable v-model="form.status" placeholder="全选">
            <el-option
              v-for="item in statusList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="km-archive-search" :loading="cxLoading" @click="search">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="data-box">
      <el-table
        :loading="tableLoading"
        :max-height="tableMaxHeight"
        :data="tableData"
        style="width: 100%">
        <el-table-column
          prop="name"
          label="申请时间">
        </el-table-column>
        <el-table-column
          prop="remark"
          label="资料ID">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="商户名称">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="商户简称">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="公司名称">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="银行卡号">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="资料状态">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="微信认证状态">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="费率">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="停用">
        </el-table-column>
        <el-table-column
          label="操作"
          align="right"
          width="70px">
          <template slot-scope="scope">
            <el-button @click="downLoad(scope.row)" type="text" size="small">下载</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="km-page-block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 15, 30]"
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

export default {
  data() {
    return {
      form: {
        name: '',
        time: [],
        status: ''
      },
      statusList: [],
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
        "endTime": this.form.time && this.form.time[1],
        "name": this.form.name,
        "orders": {},
        "page": this.currentPage,
        "rows": this.pageSize,
        "startTime": this.form.time && this.form.time[0]
      }
      try {
        const res = await queryDocumentByPage(data)
        this.tableData = res.results
        this.totalPage = res.totalCount
      } catch (e) {} finally {
        this.cxLoading = false
        this.tableLoading = false
      }
    }
  },
  computed: {
    tableMaxHeight() {
      return document.documentElement.clientHeight - 56 - 48 - 64 - 32 - 116
    }
  },
  mounted() {
    this.getList()
  }
}
</script>

<style lang="scss" scoped>
.km-archive-search {
  padding: 8px 22px;
}
</style>
