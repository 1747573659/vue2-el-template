<template>
  <div>
    <div class="search-box">
      <el-form ref="form" size="small" label-suffix=":" :inline="true" :model="form" label-width="80px">
        <el-form-item label="账号信息">
          <el-input style="width: 240px" placeholder="请输入姓名/手机号" v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="角色">
          <el-select style="width: 240px" v-model="form.roleId" placeholder="全选">
            <el-option
              v-for="item in roleList"
              clearable
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="km-role-search" @click="search">查询</el-button>
        </el-form-item>
        <el-form-item style="float:right">
          <el-button type="primary" plain icon="el-icon-plus" class=""  @click="add">新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="data-box">
      <el-table
        max-height="700"
        :data="tableData"
        style="width: 100%">
        <el-table-column
          prop="name"
          label="姓名">
        </el-table-column>
        <el-table-column
          prop="descript"
          label="手机号(账号)">
        </el-table-column>
        <el-table-column
          prop="accountNum"
          label="角色">
        </el-table-column>
        <el-table-column
          prop="creatTime"
          label="创建时间">
        </el-table-column>
        <el-table-column
          prop="creatTime"
          label="状态">
        </el-table-column>
        <el-table-column
          label="操作"
          align="right">
          <template slot-scope="scope">
            <el-button @click="edit(scope.row)" type="text" size="small">编辑</el-button>
            <el-button @click="stop(scope.row)" type="text" size="small">停用</el-button>
            <el-button @click="resetPsw(scope.row)" type="text" size="small">重置密码</el-button>
            <el-button @click="del(scope.row)" type="text" size="small">删除</el-button>
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
export default {
  data() {
    return {
      form: {
        name: '',
        roleId: null
      },
      roleList: [],
      tableData: [],
      currentPage: 1,
      totalPage: 233,
      pageSize: 10
    }
  },
  methods: {
    search() {},
    edit(row) {
      this.$router.push({ path: 'accountSettingAdd', query: { id: row.id } }) // row.id ? edit : add
    },
    stop () {},
    resetPsw () {},
    del() {},
    handleSizeChange() {},
    handleCurrentChange() {},
    add () {
      this.$router.push({ path: 'accountSettingAdd' }) // row.id ? edit : add
    }
  }
}
</script>

<style lang="scss" scoped>
.km-role-search {
  padding: 8px 22px;
}
</style>
