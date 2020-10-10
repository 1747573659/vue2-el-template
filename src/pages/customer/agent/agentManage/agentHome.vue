<template>
  <div class="">
    <div class="search-box">
      <el-row>
        <el-col :span="20">
          <el-form
            :inline="true"
            size="small"
            label-width="100px"
            :model="form"
            class="xdd-btn-block__w240"
          >
            <el-form-item label="代理商信息：">
              <el-input
                v-model="form.id"
                maxlength="50"
                placeholder="请输入代理商编号/名称"
              ></el-input>
            </el-form-item>
            <el-form-item label="手机号：">
              <el-input
                v-model="form.mobile"
                maxlength="11"
                placeholder="请输入手机号"
              ></el-input>
            </el-form-item>
            <el-form-item label="BD经理：">
              <el-select
                v-model="form.channelManagerId"
                filterable
                clearable
                placeholder="请选择BD经理"
              >
                <el-option
                  v-for="item in channelManagerOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="getPageList">查询</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="4" style="text-align: right;">
          <el-button
            v-permission="'AGENT_MANAGE_ADD'"
            type="primary"
            size="small"
            plain
            icon="el-icon-plus"
            @click="addShop"
            >新增</el-button
          >
          <el-dropdown style="margin-left: 12px;">
            <el-button size="small">
              更多
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-permission="'AGENT_MANAGE_BATCH_STOP'"
                @click.native="batchOperate(0)"
                >批量停用</el-dropdown-item
              >
              <el-dropdown-item
                v-permission="'AGENT_MANAGE_BATCH_START'"
                @click.native="batchOperate(1)"
                >批量启用</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </div>
    <div class="data-box">
      <el-table
        v-loading="loading"
        :max-height="tableMaxHeight"
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="40"></el-table-column>
        <el-table-column prop="id" label="代理商编号"></el-table-column>
        <el-table-column prop="name" label="代理商名称"></el-table-column>
        <el-table-column prop="mobile" label="手机"></el-table-column>
        <el-table-column prop="channelManagerName" label="BD经理">
        </el-table-column>
        <el-table-column prop="proportion" label="分成比例"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180px">
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">{{
            scope.row.status | fiterStatus
          }}</template>
        </el-table-column>
        <el-table-column label="操作" align="right" width="280px">
          <template slot-scope="scope">
            <el-button
              v-permission="'AGENT_MANAGE_EDIT'"
              size="small"
              type="text"
              @click="handleEdit(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              v-permission="'AGENT_MANAGE_STOPANDSTART'"
              size="small"
              type="text"
              @click="handleOperate(scope.row.id, scope.row.status)"
              >{{ scope.row.status | fiterOperateStatus }}</el-button
            >
            <el-popconfirm
              v-permission="'AGENT_MANAGE_PSW'"
              style="margin-left: 12px"
              iconColor="#FFA033"
              title="你确定要重置密码吗？确定后将对应账号的密码更新为888888"
              placement="top-start"
              @onConfirm="resetPsw(scope.row.userId)"
            >
              <el-button slot="reference" type="text" size="small"
                >重置密码</el-button
              >
            </el-popconfirm>
            <el-button
              v-permission="'AGENT_MANAGE_QUATA'"
              style="margin-left: 12px;"
              size="small"
              type="text"
              @click="handleQuota(scope.row.userId)"
              >分配应用配额</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div v-show="total > 0" class="km-page-block">
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

      <el-dialog
        title="分配应用配额"
        :visible.sync="dialogVisible"
        width="740px"
      >
        <div>
          <div class="dialog-content">
            <aside class="dialog-left">
              <div class="dialog-title">应用名称</div>
              <ul class="dialog-list">
                <li
                  class="dialog-item"
                  :class="{ active: item.id === quotaActiveId }"
                  v-for="item in quotaNameOptions"
                  :key="item.id"
                  @click="handleQuotaName(item.id)"
                >
                  {{ item.name }}
                </li>
              </ul>
            </aside>
            <section class="dialog-right" v-loading="quotaLoading">
              <div class="dialog-title">分配醒额</div>
              <div class="dialog-right-content">
                <div
                  class="quota-item"
                  v-for="item in quotaItems"
                  :key="item.payType"
                >
                  <span>
                    <el-checkbox
                      v-model="item.checked"
                      :disabled="item.quotaNo === 0"
                      @change="changeCheckbox(item)"
                    >
                    </el-checkbox>
                    {{ item.payType | fiterQuotaPayType }}（剩余配额
                    <span style="color: #FF6010">{{ item.quotaNo }}</span
                    >，建议售价：<span style="color: #FF6010">{{
                      (item.saleAmount / 100).toFixed(2)
                    }}</span
                    >元）
                  </span>
                  <span>
                    分配
                    <el-input
                      class="content_input"
                      size="small"
                      v-model="item.input"
                      :disabled="!item.checked"
                      @input="checkoutQuotaValue(item)"
                    >
                    </el-input>
                    个配额
                  </span>
                </div>
              </div>
              <div class="sum-total">
                <div class="sum-total__label">
                  总计：
                  <span class="sum-total__value">{{ sumTotal }}</span>
                  元
                </div>
              </div>
            </section>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="dialogVisible = false"
            >取 消</el-button
          >
          <el-button type="primary" size="small" @click="onQuotaComfirm"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  queryChannel,
  queryAgentPage,
  updateStatus,
  queryAppQuotaAndPrice,
  queryAgentAppAndQuota,
  distributeAppQuota,
} from '@/api/customer/agent'
import { resetPassword } from '@/api/setting/account'
import { isPositiveInteger } from '@/utils/common'

export default {
  name: 'agentManage',
  components: {},
  filters: {
    fiterStatus(val) {
      if (val === 0) {
        return '停用'
      } else if (val === 1) {
        return '启用'
      } else if (val === 2) {
        return '待审核'
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
    fiterQuotaPayType(val) {
      if (val === 1) {
        return '试用'
      } else if (val === 2) {
        return '1年'
      } else if (val === 3) {
        return '按单付费'
      }
    },
  },
  data() {
    return {
      activeUserId: 0,
      quotaLoading: false,
      quotaNameOptions: [],
      quotaItems: [],
      quotaActiveId: 0,
      dialogVisible: false,
      loading: false,
      channelManagerOptions: [],
      form: {
        channelManagerId: '',
        id: '',
        mobile: '',
        page: 1,
        rows: 10,
      },
      tableData: [],
      total: 0,
      multipleSelection: [],
    }
  },
  computed: {
    tableMaxHeight() {
      return document.documentElement.clientHeight - 56 - 48 - 64 - 32 - 116
    },
    sumTotal() {
      let sum
      if (this.quotaItems.length === 0) {
        sum = 0
      } else {
        const result = this.quotaItems.map(
          (item) => (Number(item.input) * item.saleAmount) / 100
        )
        sum = result.reduce((accumulator, currentValue) => {
          return accumulator + currentValue
        })
      }

      return sum.toFixed(2)
    },
  },
  created() {
    this.queryChannel()
    this.queryAgentPage()
    this.queryAgentAppAndQuota()
  },
  activated() {
    this.queryAgentPage()
  },
  methods: {
    checkoutQuotaValue(item) {
      const value = item.input
      if (isPositiveInteger(value)) {
        if (Number(value) > item.quotaNo) {
          item.input = ''
          this.$message.error('输入的配额不能大于剩余配额！')
        }
      } else {
        item.input = ''
        // this.$message.error('请输入大于0的正整数！')
      }
    },
    onQuotaComfirm() {
      let selectPayType = []
      for (let item of this.quotaItems) {
        if (item.checked) {
          if (item.input === '') {
            return this.$message.error('配额不能为空!')
          }

          selectPayType.push({
            num: Number(item.input),
            type: item.payType,
          })
        }
      }

      if (selectPayType.length === 0) {
        // return this.$message.error('合计金额为零，数据异常')
        return this.$message.error('请选择分配醒额')
      }

      const params = {
        id: this.quotaActiveId,
        payTypeVOS: selectPayType,
        price: Number(this.sumTotal) * 100,
        userId: this.activeUserId,
      }

      distributeAppQuota(params).then(() => {
        this.dialogVisible = false
      })
    },
    changeCheckbox(item) {
      if (!item.checked) {
        item.input = ''
      }
    },
    queryAgentAppAndQuota() {
      queryAgentAppAndQuota().then((res) => {
        this.quotaNameOptions = res
      })
    },
    queryAppQuotaAndPrice(id) {
      this.quotaLoading = true
      queryAppQuotaAndPrice({ id })
        .then((res) => {
          this.quotaItems = res.appQuotaDTOS.map((item) => {
            return { ...item, ...{ checked: false, input: '' } }
          })
        })
        .finally(() => {
          this.quotaLoading = false
        })
    },
    handleQuotaName(id) {
      if (this.quotaActiveId !== id) {
        this.quotaActiveId = id
        this.queryAppQuotaAndPrice(id)
      }
    },
    handleQuota(userId) {
      this.dialogVisible = true
      this.activeUserId = userId
      this.quotaActiveId = this.quotaNameOptions[0].id
      this.queryAppQuotaAndPrice(this.quotaActiveId)
    },
    async resetPsw(userId) {
      await resetPassword({ userId })
      this.$message.success('重置密码成功!')
    },
    async handleOperate(idStr, val) {
      await updateStatus({ idStr, status: val === 0 ? 1 : 0 })
      await this.queryAgentPage()
      this.$message.success('操作成功！')
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
      await this.queryAgentPage()
      this.$message.success('操作成功！')
    },
    handleCurrentChange(value) {
      this.queryAgentPage()
    },
    getPageList() {
      this.form.page = 1
      this.queryAgentPage()
    },
    queryChannel() {
      queryChannel().then((res) => {
        this.channelManagerOptions = res
      })
    },
    queryAgentPage() {
      this.loading = true
      queryAgentPage(this.form)
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
        path: '/customer/agent/addAgent',
      })
    },
    handleEdit(id) {
      this.$router.push({ path: '/customer/agent/editAgent', query: { id } })
    },
  },
}
</script>

<style lang="scss" scoped>
.dialog-content {
  display: flex;
  border-radius: 2px;
  border: 1px solid #e6e9f0;
}
.dialog-left {
  flex-basis: 136px;
  background: #f7f9fc;
}
.dialog-right {
  position: relative;
  flex: 1;
}
.dialog-title {
  border-bottom: 1px solid #e6e9f0;
  padding-left: 16px;
  padding-right: 16px;
  height: 56px;
  line-height: 56px;
  background: #f7f9fc;
}
ul {
  margin: 0;
  padding: 0;
  list-style-type: none;
}
.dialog-list {
  height: 316px;
}
.dialog-item {
  padding: 0 16px;
  height: 40px;
  line-height: 40px;
  font-size: 14px;
  color: #3d4966;
  cursor: pointer;
  user-select: none;
  &.active,
  &:hover {
    color: #3377ff;
    background: #fff;
  }
}
.dialog-right-content {
  margin-top: 16px;
  .quota-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 16px;
    color: #3d4966;
  }
  .content_input {
    width: 96px;
    margin: 0 5px;
  }
}
.sum-total {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 40px;
  line-height: 40px;
  padding: 0 16px;
  text-align: right;
}
.sum-total__label {
  border-top: 1px solid #e6e9f0;
  font-size: 14px;
  color: #3d4966;
  .sum-total__value {
    color: #ff6010;
  }
}
</style>
