<template>
  <div>
    <div class="search-box">
      <el-row>
        <el-col :span="20">
          <el-form :inline="true" size="small" :model="form" class="xdd-btn-block__w240">
            <el-form-item label="角色信息：">
              <el-input v-model="form.name" placeholder="请输入角色名称" clearable></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="getPageList">查询</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="4" style="text-align: right;">
          <el-button v-permission="'AGENT_ROLE_ADD'" type="primary" size="small" plain icon="el-icon-plus" @click="add">新增</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="data-box">
      <el-table v-loading="loading" :max-height="tabMaxHeight" ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%">
        <el-table-column prop="id" label="角色编号"> </el-table-column>
        <el-table-column prop="name" label="角色名称"> </el-table-column>
        <el-table-column prop="remark" label="描述">
          <template slot-scope="scope">
            {{ scope.row.remark || '--' }}
          </template>
        </el-table-column>
        <el-table-column prop="num" label="关联账号数量"> </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180px">
        </el-table-column>
        <el-table-column label="操作" align="right" width="100px">
          <template slot-scope="scope">
            <el-button v-permission="'AGENT_ROLE_EDIT'" size="small" type="text" @click="edit(scope.row.id)">编辑</el-button>
            <el-popconfirm v-permission="'AGENT_ROLE_DEL'" style="margin-left: 12px" iconColor="#FFA033" title="确定删除所选数据吗？确认则删除角色及账号对应的角色关系" placement="top-start" @confirm="handleDelete(scope.row.num, scope.row.id)">
              <el-button slot="reference" size="small" type="text">删除</el-button>
            </el-popconfirm>
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
import { queryPage, deleteSysRole } from '@/api/customer/agent'
import { mapActions } from 'vuex'
import { tableMaxHeight } from '@/mixins/tableMaxHeight'

export default {
  name: 'agentRole',
  mixins: [tableMaxHeight],
  data() {
    return {
      loading: false,
      total: 0,
      form: {
        name: '',
        page: 1,
        rows: 10,
        type: 1,
      },
      tableData: [],
    }
  },
  activated() {
    this.queryPage()
  },
  mounted() {
    this.queryPage()
  },
  methods: {
    ...mapActions(['delCachedView']),
    queryPage() {
      this.loading = true
      queryPage(this.form)
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
      this.queryPage()
    },
    getPageList() {
      this.form.page = 1
      this.queryPage()
    },
    add() {
      this.delCachedView({ name: 'addRole' }).then(()=> {
        this.$router.push({ path: '/customer/agent/addRole' })
      })
    },
    edit(id) {
      this.delCachedView({ name: 'editRole' }).then(()=> {
        this.$router.push({ path: '/customer/agent/editRole', query: { id } })
      })
    },
    async handleDelete(num, roleId) {
      if (num > 0) return this.$message.error('角色有关联的账号，不能删除')
      await deleteSysRole({ roleId })
      await this.queryPage()
      this.$message.success('删除成功!')
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
