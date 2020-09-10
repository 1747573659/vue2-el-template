<template>
  <div>
    <div class="search-box">
      <el-form ref="form" size="small" label-suffix=":" :inline="true" :model="form" label-width="80px">
        <el-form-item label="账号信息">
          <el-input style="width: 240px" maxlength="50" clearable placeholder="请输入姓名/手机号" v-model="form.userName"></el-input>
        </el-form-item>
        <el-form-item label="角色">
          <el-select style="width: 240px" clearable v-model="form.roleId" placeholder="全选">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="km-role-search" :loading="cxLoading" @click="search">查询</el-button>
        </el-form-item>
        <el-form-item style="float:right">
          <el-button type="primary" plain icon="el-icon-plus" v-permission="'ACCOUNT_SET_ADD'" @click="add">新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="data-box">
      <el-table
        id="table"
        :max-height="tableMaxHeight"
        v-loading="tableLoading"
        :data="tableData"
        style="width: 100%">
        <el-table-column
          prop="userName"
          label="姓名">
        </el-table-column>
        <el-table-column
          prop="loginName"
          label="手机号(账号)">
        </el-table-column>
        <el-table-column
          prop="roleName"
          label="角色">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间">
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态">
          <template slot-scope="scope">
            {{statusList[scope.row.status]}}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="right">
          <template slot-scope="scope">
            <el-button @click="edit(scope.row)" v-permission="'ACCOUNT_SET_EDIT'" type="text" size="small">编辑</el-button>
            <el-button @click="status(scope.row)" v-permission="'ACCOUNT_SET_STATUS'" type="text" size="small">{{statusList[scope.row.status === 0 ? 1 : 0]}}</el-button>
            <el-popconfirm
              v-permission="'ACCOUNT_SET_RESETPWD'"
              style="margin-left: 12px"
              iconColor="#FFA033"
              title="你确定要重置密码吗？确定后将对应账号的密码更新为888888"
              placement="top-start"
              @onConfirm="resetPsw(scope.row)"
            >
              <el-button slot="reference" type="text" size="small">重置密码</el-button>
            </el-popconfirm>
            <el-popconfirm
              v-permission="'ACCOUNT_SET_DEL'"
              style="margin-left: 12px"
              iconColor="#FFA033"
              title="确定删除所选数据吗？"
              placement="top-start"
              @onConfirm="del(scope.row)"
            >
              <el-button slot="reference" type="text" size="small">删除</el-button>
            </el-popconfirm>
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
          :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { 
  queryUserPage,
  queryRole,
  updateStatus,
  resetPassword,
  deleteUser
  } from '@/api/setting/account'
export default {
  data() {
    return {
      statusList: [
        '停用',
        '启用'
      ],
      form: {
        userName: '',
        roleId: null
      },
      roleList: [],
      tableData: [],
      currentPage: 1,
      total: 233,
      pageSize: 10,
      tableLoading: false,
      cxLoading: false
    }
  },
  methods: {
    search() {
      this.cxLoading = true
      this.currentPage = 1
      this.getList()
    },
    edit(row) {
      this.$router.push({ path: 'accountSettingAdd', query: { id: row.id } }) // row.id ? edit : add
    },
    async status (row) {
      let data = {
        status: row.status ? 0 : 1,
        userId: row.id
      }
      try {
        const res = await updateStatus(data)
        this.$message.success('操作成功')
        this.getList()
      } catch (e) {}
    },
    async resetPsw (row) {
      let data = {
        userId: row.id
      }
      try {
        const res = await resetPassword(data)
        this.getList()
        this.$message.success('重置密码成功!')
      } catch(e) {
      } finally {}
    },
    async del(row) {
      let data = {
        userId: row.id
      }
      try {
        const res = await deleteUser(data)
        this.getList()
        this.$message.success('删除成功!')
      } catch(e) {
      } finally {}
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
    add () {
      this.$router.push({ path: 'accountSettingAdd' }) // row.id ? edit : add
    },
    async getList () {
      this.tableLoading = true
      let data = {
        'page': this.currentPage,
        'roleId': this.form.roleId,
        'rows': this.pageSize,
        'userName': this.form.userName
      }
      try {
        const res = await queryUserPage(data)
        this.tableData = res.results
        this.total = res.totalCount
      } catch (e) {
      } finally {
        this.cxLoading = false
        this.tableLoading = false
      }
    },
    async getRoleList () {
      try {
        const res = await queryRole({})
        this.roleList = res
      } catch (e) {}
    }
  },
  computed: {
    tableMaxHeight() {
      return document.documentElement.clientHeight - 56 - 48 - 64 - 32 - 116
    }
  },
  mounted() {
    this.getList()
    this.getRoleList()
  },
}
</script>

<style lang="scss" scoped>
.km-role-search {
  padding: 8px 22px;
}
</style>
