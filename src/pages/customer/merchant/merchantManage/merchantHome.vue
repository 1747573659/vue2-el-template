<template>
  <div>
    <div class="search-box">
      <el-form :inline="true" size="small" :model="form" label-suffix=":" label-width="90px" class="xdd-btn-block__w240">
        <el-row type="flex" align="bottom">
          <el-col :xl="21" :lg="21">
            <el-form-item label="商户信息">
              <el-input v-model="form.id" maxlength="50" placeholder="请输入商户编号/名称/联系人" clearable></el-input>
            </el-form-item>
            <el-form-item label="账号/手机">
              <el-input v-model="form.mobile" maxlength="11" placeholder="请输入账号/联系人手机" clearable></el-input>
            </el-form-item>
            <el-form-item label="业务员">
              <selectCopy
                filterable
                :value.sync="form.clerkId"
                placeholder="请输入业务员"
                clearable
                :options="clerkOptions"
                :optionsItem="{ key: 'id', label: 'name', value: 'id' }"
              ></selectCopy>
            </el-form-item>
            <el-form-item label="代理商">
              <selectCopy
                :value.sync="form.topAgentId"
                placeholder="请输入代理商"
                filterable
                clearable
                :options="topAgentOptions"
                :optionsItem="{ key: 'id', label: 'name', value: 'id' }"
              />
            </el-form-item>
            <el-form-item label="创建日期">
              <el-date-picker
                style="width:240px"
                v-model="form.time"
                type="daterange"
                range-separator="至"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :clearable="true"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="form.status" placeholder="请输入状态" clearable>
                <el-option v-for="item in statusOptions" :key="item.id" :label="item.name" :value="item.id"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="getPageList">查询</el-button>
            </el-form-item>
          </el-col>
          <el-col :xl="3" :lg="3" style="text-align:right">
            <el-form-item>
              <el-button v-permission="'MERCHANT_SET_ADD'" type="primary" plain icon="el-icon-plus" size="small" @click="addShop">新增</el-button>
              <el-dropdown style="margin-left: 12px;">
                <el-button size="small">
                  更多
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-permission="'MERCHANT_SET_STOPORSTART'" @click.native="batchOperate(0)">批量停用</el-dropdown-item>
                  <el-dropdown-item v-permission="'MERCHANT_SET_STOPORSTART'" @click.native="batchOperate(1)">批量启用</el-dropdown-item>
                  <el-dropdown-item v-permission="'MERCHANT_BATCH_CLERK'" @click.native="batchSubmitClerk()">移交业务员</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="data-box">
      <el-table v-loading="loading" :max-height="tabMaxHeight" ref="multipleTable" :data="tableData" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="40"></el-table-column>
        <el-table-column prop="companyName" label="商户名称" min-width="150" fixed></el-table-column>
        <el-table-column prop="loginName" label="账号" min-width="100"></el-table-column>
        <el-table-column prop="contactor" label="联系人" width="80"></el-table-column>
        <el-table-column prop="merchantNumber" label="品牌数" align="right" width="70"></el-table-column>
        <el-table-column prop="storeNum" label="门店数" align="right" width="70">
          <template slot-scope="scope"> {{ scope.row.storeNum || 0 }}</template>
        </el-table-column>
        <el-table-column prop="agentName" label="所属代理商" min-width="100"></el-table-column>
        <el-table-column prop="createTime" label="创建日期" width="110">
          <template v-if="scope.row.createTime" slot-scope="scope">{{ scope.row.createTime.split(' ')[0] }}</template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="70">
          <template slot-scope="scope">{{ scope.row.status | fiterStatus }}</template>
        </el-table-column>
        <el-table-column label="操作" align="right" width="170" fixed="right">
          <template slot-scope="scope">
            <el-button v-permission="'MERCHANT_SET_EDIT'" size="small" type="text" @click="handleEdit(scope.row.id)">编辑</el-button>
            <el-button v-if="scope.row.status !== 2" v-permission="'MERCHANT_SET_STOPORSTART'" size="small" type="text" @click="handleOperate(scope.row.id, scope.row.status)">{{
              scope.row.status | fiterOperateStatus
            }}</el-button>
            <el-popconfirm
              v-permission="'MERCHANT_SET_RESETPWD'"
              style="margin-left: 12px"
              iconColor="#FFA033"
              title="你确定要重置密码吗？确定后将对应账号的密码更新为888888"
              placement="top-start"
              @confirm="resetPsw(scope.row.userId)"
            >
              <el-button slot="reference" type="text" size="small">重置密码</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <div class="km-page-block">
        <el-pagination
          @size-change="getPageList"
          @current-change="handleCurrentChange"
          :current-page.sync="form.page"
          :page-sizes="[10, 15, 30]"
          :page-size.sync="form.rows"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
      <el-dialog title="移交业务员" :visible.sync="dialogFormVisible" width="510px">
        <el-form :model="clerkForm" :rules="clerkRules" ref="clerkForm" size="small" label-width="100px" class="xdd-btn-block__w240">
          <el-form-item label="新业务员：" prop="clerkId">
            <selectCopy
              :value.sync="clerkForm.clerkId"
              placeholder="请选择业务员"
              filterable
              clearable
              :options="newClerkOptions"
              :optionsItem="{ key: 'id', label: 'name', value: 'id' }"
            ></selectCopy>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="dialogFormVisible = false">取 消</el-button>
          <el-button size="small" type="primary" @click="onClerkConfirm">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { queryShopListByPage, queryClerkList, queryAgentPage, updateStatus, updateClerk } from '@/api/customer/merchant'
import { resetPassword } from '@/api/setting/account'
import selectCopy from '@/components/selectCopy'
import { mapActions } from 'vuex'
import { tableMaxHeight } from '@/mixins/tableMaxHeight'

export default {
  name: 'merchantManage',
  mixins: [tableMaxHeight],
  components: { selectCopy },
  filters: {
    fiterStatus(val) {
      if (val === 0) {
        return '停用'
      } else if (val === 1) {
        return '启用'
      } else if (val === 2) {
        return '待审核'
      }
    },
    fiterOperateStatus(val) {
      if (val === 0) {
        return '启用'
      } else if (val === 1) {
        return '停用'
      }
    }
  },
  data() {
    return {
      dialogFormVisible: false,
      topAgentOptions: [],
      clerkOptions: [],
      newClerkOptions: [],
      statusOptions: [
        { id: '', name: '全部' },
        { id: 0, name: '停用' },
        { id: 1, name: '启用' },
        { id: 2, name: '待审核' }
      ],
      loading: false,
      total: 0,
      form: {
        clerkId: '',
        id: '',
        mobile: '',
        page: 1,
        rows: 10,
        status: '',
        topAgentId: '',
        time: []
      },
      clerkForm: {
        clerkId: ''
      },
      clerkRules: {
        clerkId: { required: true, message: '请选择业务员', trigger: 'change' }
      },
      tableData: [],
      multipleSelection: []
    }
  },
  watch: {
    dialogFormVisible(val) {
      if (!val) {
        this.$refs['clerkForm'].resetFields()
      }
    }
  },
  activated() {
    this.queryShopListByPage()
  },
  mounted() {
    this.queryClerkList()
    this.queryAgentPage()
    this.queryShopListByPage()
  },
  methods: {
    ...mapActions(['delCachedView']),
    onClerkConfirm() {
      this.$refs['clerkForm'].validate(async valid => {
        if (valid) {
          const idStr = this.multipleSelection.map(item => item.id).join(',')
          const params = {
            idStr,
            clerkId: this.clerkForm.clerkId
          }

          await updateClerk(params)
          this.$message.success('操作成功！')
          await this.queryShopListByPage()
          this.dialogFormVisible = false
        }
      })
    },
    batchSubmitClerk() {
      if (this.multipleSelection.length === 0) {
        return this.$message.error('请先选择数据')
      }

      this.dialogFormVisible = true
    },
    async batchOperate(status) {
      const multipleSelection = this.multipleSelection
      if (multipleSelection.length === 0) {
        return this.$message.error('请先选择数据')
      }

      const flag = multipleSelection.some(item => {
        return item.status !== 0 && item.status !== 1
      })

      if (flag) {
        return this.$message.error('您选择了未通过审核的用户，请重新选择')
      }

      const idStr = multipleSelection.map(item => item.id).join(',')
      const params = {
        idStr,
        status
      }

      await updateStatus(params)
      await this.queryShopListByPage()
      this.$message.success('操作成功！')
    },
    handleOperate(idStr, val) {
      updateStatus({ idStr, status: val === 0 ? 1 : 0 })
        .then(() => {
          this.queryShopListByPage()
          this.$message.success('操作成功！')
        })
        .catch(() => {})
    },
    async resetPsw(userId) {
      await resetPassword({ userId })
      this.$message.success('重置密码成功!')
    },
    queryAgentPage() {
      const params = {
        id: '',
        channelManagerId: '',
        mobile: '',
        page: 1,
        rows: 100
      }

      queryAgentPage(params).then(res => {
        if (res && res.results) {
          this.topAgentOptions = [{ id: '', name: '全部' }, ...res.results]
        }
      })
    },
    queryClerkList() {
      queryClerkList().then(res => {
        this.clerkOptions = [{ id: '', name: '全部' }, ...res]
        this.newClerkOptions = res
      })
    },
    handleCurrentChange(value) {
      this.queryShopListByPage()
    },
    getPageList() {
      this.form.page = 1
      this.queryShopListByPage()
    },
    queryShopListByPage() {
      this.loading = true
      let data = {
        clerkId: this.form.clerkId,
        id: this.form.id,
        mobile: this.form.mobile,
        page: this.form.page,
        rows: this.form.rows,
        status: this.form.status,
        topAgentId: this.form.topAgentId,
        startTime: this.form.time && this.form.time[0] && this.form.time[0] + ' 00:00:00',
        endTime: this.form.time && this.form.time[1] && this.form.time[1] + ' 23:59:59'
      }
      queryShopListByPage(data)
        .then(res => {
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
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    addShop() {
      this.delCachedView({ name: 'addMerchant' }).then(() => {
        this.$router.push({ path: '/customer/merchant/addMerchant' })
      })
    },
    handleEdit(id) {
      this.delCachedView({ name: 'editMerchant' }).then(() => {
        this.$router.push({ path: '/customer/merchant/editMerchant', query: { id } })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@media only screen and (min-width: 1200px) {
  .el-col-lg-3 {
    width: 13%;
  }
}
.search-box {
  margin-left: -16px;
  margin-right: -16px;
  border-bottom: 16px solid #f7f8fa;
}
</style>
