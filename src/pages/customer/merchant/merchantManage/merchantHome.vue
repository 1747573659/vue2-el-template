<template>
  <div>
    <div class="search-box">
      <el-row>
        <el-col :span="20">
          <el-form :inline="true" size="small" :model="form" label-width="85px" class="xdd-btn-block__w240">
            <el-form-item label="商户信息：">
              <el-input v-model="form.mobile" maxlength="50" placeholder="请输入商户编号/名称/运营者/手机"></el-input>
            </el-form-item>
            <el-form-item label="业务员：">
              <el-select v-model="form.clerkId" placeholder="请输入业务员" filterable clearable>
                <el-option v-for="item in clerkOptions" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="代理商：">
              <el-select v-model="form.topAgentId" placeholder="请输入代理商" filterable clearable>
                <el-option v-for="item in topAgentOptions" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="状态：">
              <el-select v-model="form.status" placeholder="请输入状态">
                <el-option v-for="item in statusOptions" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="getPageList">查询</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="4" style="text-align: right;">
          <el-button v-permission="'MERCHANT_SET_ADD'" type="primary" plain icon="el-icon-plus" size="small" @click="addShop">新增</el-button>
          <el-dropdown style="margin-left: 12px;">
            <el-button type="primary" size="small">
              更多<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="batchOperate(0)">批量停用</el-dropdown-item>
              <el-dropdown-item @click.native="batchOperate(1)">批量启用</el-dropdown-item>
              <el-dropdown-item @click.native="batchSubmitClerk()">移交业务员</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </div>
    <div class="data-box">
      <el-table v-loading="loading" ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="40">
        </el-table-column>
        <el-table-column prop="id" label="商户编号">
        </el-table-column>
        <el-table-column prop="companyName" label="商户名称">
        </el-table-column>
        <el-table-column prop="contactor" label="运营者">
        </el-table-column>
        <el-table-column prop="mobile" label="手机">
        </el-table-column>
        <el-table-column prop="merchantNumber" label="品牌数">
        </el-table-column>
        <el-table-column prop="storeNum" label="门店数">
        </el-table-column>
        <el-table-column prop="agentName" label="所属代理商">
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180">
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">{{ scope.row.status | fiterStatus }}</template>
        </el-table-column>
        <el-table-column label="操作" align="right" width="180">
          <template slot-scope="scope">
            <el-button v-permission="'MERCHANT_SET_EDIT'" size="small" type="text" @click="handleEdit(scope.row.id)">编辑</el-button>
            <el-button v-permission="'MERCHANT_SET_STOPORSTART'" size="small" type="text" @click="handleOperate(scope.row.id, scope.row.status)">{{ scope.row.status | fiterOperateStatus }}</el-button>
            <el-popconfirm v-permission="'MERCHANT_SET_RESETPWD'" style="margin-left: 12px" iconColor="#FFA033" title="你确定要重置密码吗？确定后将对应账号的密码更新为888888" placement="top-start" @onConfirm="resetPsw(scope.row.userId)">
              <el-button slot="reference" type="text" size="small">重置密码</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <div v-show="total > 0" class="km-page-block">
        <el-pagination @size-change="getPageList" @current-change="handleCurrentChange" :current-page.sync="form.page" :page-sizes="[10, 15, 30]" :page-size.sync="form.rows" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
      <el-dialog title="移交业务员" :visible.sync="dialogFormVisible" width="510px">
        <el-form :model="clerkForm" :rules="clerkRules" ref="clerkForm" size="small" label-width="100px" class="xdd-btn-block__w240">
          <el-form-item label="新业务员：" prop="clerkId">
            <el-select v-model="clerkForm.clerkId" placeholder="请选择业务员" filterable clearable>
              <el-option v-for="item in newClerkOptions" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
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
import {
  queryShopListByPage,
  queryClerkList,
  queryAgentPage,
  updateStatus,
  updateClerk,
} from '@/api/customer/merchant'
import { resetPassword } from '@/api/setting/account'

export default {
  name: 'merchantManage',
  components: {},
  filters: {
    fiterStatus(val) {
      if (val === 0) {
        return '停用'
      } else if (val === 1) {
        return '启用'
      } else {
        return '删除'
      }
    },
    fiterOperateStatus(val) {
      if (val === 0) {
        return '启用'
      } else if (val === 1) {
        return '停用'
      } else {
        return ''
      }
    },
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
      },
      clerkForm: {
        clerkId: '',
      },
      clerkRules: {
        clerkId: { required: true, message: '请选择业务员', trigger: 'change' },
      },
      tableData: [],
      multipleSelection: [],
    }
  },
  computed: {},
  watch: {
    dialogFormVisible(val) {
      if (!val) {
        this.$refs['clerkForm'].resetFields()
      }
    },
  },
  created() {
    this.queryClerkList()
    this.queryAgentPage()
    this.queryShopListByPage()
  },
  methods: {
    onClerkConfirm() {
      this.$refs['clerkForm'].validate(async (valid) => {
        if (valid) {
          const idStr = this.multipleSelection.map((item) => item.id).join(',')
          const params = {
            idStr,
            clerkId: this.clerkForm.clerkId,
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
        this.$message.error('请先选择数据')
        return
      }

      this.dialogFormVisible = true
    },
    async batchOperate(status) {
      if (this.multipleSelection.length === 0) {
        this.$message.error('请先选择数据')
        return
      }

      const idStr = this.multipleSelection.map((item) => item.id).join(',')
      const params = {
        idStr,
        status,
      }
      await updateStatus(params)
      await this.queryShopListByPage()
      this.$message.success('操作成功！')
    },
    async handleOperate(idStr, val) {
      await updateStatus({ idStr, status: val === 0 ? 1 : 0 })
      await this.queryShopListByPage()
      this.$message.success('操作成功！')
    },
    async resetPsw(userId) {
      await resetPassword({ userId })
      this.$message.success('重置密码成功!')
    },
    queryAgentPage() {
      const params = {
        agentId: '',
        channelManagerId: '',
        mobile: '',
        page: 1,
        propertyType: 2,
        rows: 100,
      }
      queryAgentPage(params).then((res) => {
        if (res && res.results) {
          this.topAgentOptions = [{ id: '', name: '全部' }, ...res.results]
        }
      })
    },
    queryClerkList() {
      queryClerkList().then((res) => {
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
      queryShopListByPage(this.form)
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
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    addShop() {
      this.$router.push({
        path: '/customer/merchant/addMerchant',
      })
    },
    handleEdit(id) {
      this.$router.push({
        path: '/customer/merchant/editMerchant',
        query: { id },
      })
    },
  },
}
</script>

<style lang="scss" scoped>
</style>
