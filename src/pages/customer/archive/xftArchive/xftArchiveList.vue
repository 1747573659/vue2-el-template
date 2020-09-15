<template>
  <div>
    <div class="search-box">
      <el-form ref="form" size="small" label-suffix=":" :inline="true" :model="form" label-width="100px">
        <el-row>
          <el-col :span="21">
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
              <el-select style="width: 240px" clearable v-model="form.status" placeholder="全部">
                <el-option
                  v-for="item in statusList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="认证状态">
              <el-select style="width: 240px" clearable v-model="form.status" placeholder="全部">
                <el-option
                  v-for="item in statusList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="商户信息">
          <el-input style="width: 240px" maxlength="50" clearable placeholder="商户名称/简称/公司名称/银行卡号" v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="停用">
          <el-select style="width: 240px" clearable v-model="form.status" placeholder="全部">
            <el-option
              v-for="item in statusList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="padding-left:30px">
          <el-button type="primary" class="km-archive-search" :loading="cxLoading" @click="search">查询</el-button>
        </el-form-item>
        <el-form-item style="float:right">
          <el-button type="primary" class="add-btn" size="small" @click="add" plain icon="el-icon-plus" v-permission="'ACCOUNT_ROLE_ADD'">新增</el-button>
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
          <template slot-scope="scope">
            <span class="table-text-color" @click="statusClick(scope.row)">
              {{scope.row.creatorName}}
            </span>
          </template>
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
          width="240px">
          <template slot-scope="scope">
            <el-button @click="downLoad(scope.row)" type="text" size="small">编辑</el-button>
            <el-button @click="downLoad(scope.row)" type="text" size="small">复制</el-button>
            <el-button @click="downLoad(scope.row)" type="text" size="small">停用</el-button>
            <el-dropdown style="margin-left: 12px" @command="handleCommand">
              <span class="el-dropdown-link">
                ···
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="toDetail">进件详情</el-dropdown-item>
                <el-dropdown-item>认证状态</el-dropdown-item>
                <el-dropdown-item>商户扫码认证</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
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
    add() {
      this.$router.push({ name: 'xftArchiveAdd' })
    },
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
    statusClick(row) {
      this.$alert(row.name)
    },
    handleCommand(command) {
      this.toDetail()
    },
    toDetail (row) {
      this.$router.push({ name: 'xftArchiveDetail' })
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
      return document.documentElement.clientHeight - 56 - 48 - 112.5 - 32 - 116
    }
  },
  mounted() {
    this.getList()
  }
}
</script>

<style lang="scss" scoped>
.km-archive-search {
  padding: 8px 13px;
}
.add-btn {
  padding: 8px 15.5px;
}
.el-dropdown-link {
  font-size: 18px;
  color: #3377FF;
  cursor: pointer;
}
.table-text-color {
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #FF6010;
  cursor: pointer;
}
</style>
