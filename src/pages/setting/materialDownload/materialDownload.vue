<template>
  <div>
    <div class="search-box">
      <el-form ref="form" size="small" label-suffix=":" :inline="true" :model="form" label-width="80px">
        <el-form-item label="创建日期">
          <el-input style="width: 240px" clearable placeholder="" v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="角色信息">
          <el-input style="width: 240px" clearable placeholder="请输入角色名称" v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="km-role-search" @click="search">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="data-box">
      <el-table
        max-height="700"
        :data="tableData"
        style="width: 100%">
        <el-table-column
          prop="roleName"
          label="资料名称">
        </el-table-column>
        <el-table-column
          prop="descript"
          label="资料描述">
        </el-table-column>
        <el-table-column
          prop="creatTime"
          label="创建时间">
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
export default {
  data() {
    return {
      form: {
        name: ''
      },
      tableData: [
        {
          roleName: '经销商管理员',
          descript: '拥有所有功能权限',
          accountNum: '12',
          creatTime: '2018-01-01 10:00:00'
        },
        {
          roleName: '经销商管理员',
          descript: '拥有所有功能权限',
          accountNum: '12',
          creatTime: '2018-01-01 10:00:00'
        },
        {
          roleName: '经销商管理员',
          descript: '拥有所有功能权限',
          accountNum: '12',
          creatTime: '2018-01-01 10:00:00'
        },
        {
          roleName: '经销商管理员',
          descript: '拥有所有功能权限',
          accountNum: '12',
          creatTime: '2018-01-01 10:00:00'
        },
        {
          roleName: '经销商管理员',
          descript: '拥有所有功能权限',
          accountNum: '12',
          creatTime: '2018-01-01 10:00:00'
        },
        {
          roleName: '经销商管理员',
          descript: '拥有所有功能权限',
          accountNum: '12',
          creatTime: '2018-01-01 10:00:00'
        },
        {
          roleName: '经销商管理员',
          descript: '拥有所有功能权限',
          accountNum: '12',
          creatTime: '2018-01-01 10:00:00'
        },
        {
          roleName: '经销商管理员',
          descript: '拥有所有功能权限',
          accountNum: '12',
          creatTime: '2018-01-01 10:00:00'
        }
      ],
      currentPage: 1,
      totalPage: 233,
      pageSize: 10
    }
  },
  methods: {
    search() {},
    downLoad() {},
    handleSizeChange() {},
    handleCurrentChange() {}
  }
}
</script>

<style lang="scss" scoped>
.km-role-search {
  padding: 8px 22px;
}
</style>
