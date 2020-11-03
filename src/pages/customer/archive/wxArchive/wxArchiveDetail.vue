<template>
  <section>
    <div style="padding-bottom: 16px;" class="data-box" v-loading="isTabLock">
      <el-table :data="tableData" :max-height="tableMaxHeight">
        <el-table-column prop="subMchId" label="微信商户号"></el-table-column>
        <el-table-column prop="channelList" label="进件类型"></el-table-column>
        <el-table-column prop="createTime" label="公司名称"></el-table-column>
        <el-table-column prop="createTime" label="进件时间"></el-table-column>
        <el-table-column prop="status" label="审核状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status === -1"
              >驳回<el-button style="margin-left: 20px;" @click="handleReason(scope.row)" type="text" size="small" v-if="!scope.row.updateStatus">原因</el-button></span
            >
            <span v-else-if="!scope.row.status">--</span>
            <span v-else>{{ detailOptions[scope.row.status].label }}</span>
          </template>
        </el-table-column>
        <el-table-column label="升级状态">
          <template slot-scope="scope">
            <span v-if="scope.row.updateStatus === -1"
              >已驳回<el-button style="margin-left: 20px;" @click="handleReason(scope.row)" type="text" size="small" v-if="!scope.row.updateStatus">原因</el-button></span
            >
            <span v-else-if="!scope.row.updateStatus">--</span>
            <span v-else>{{ updateStatusOptions[scope.row.updateStatus].label }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="right" width="400px">
          <template slot-scope="scope">
            <el-button type="text" size="small" v-permission="'WXARCHIVE_LIST_SIGNNOW'" v-if="scope.row.status === 3 && scope.row.updateStatus === null" @click="handleSignUp(scope.row, 1)">立即签约</el-button>
            <el-button type="text" size="small" v-permission="'WXARCHIVE_LIST_SIGNUPDATE'" v-else-if="[3, 4].includes(scope.row.status) && scope.row.updateStatus === 4" @click="handleSignUp(scope.row, 2)">升级签约</el-button>
            <el-button type="text" size="small" v-permission="'WXARCHIVE_LIST_VERIFY'" v-else-if="[3, 4].includes(scope.row.status) && scope.row.updateStatus === 2" @click="handleVerifyAccount(scope.row)">验证账户</el-button>
            <span v-else>--</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- dialog -->
    <!-- 升级签约/立即签约 -->
    <el-dialog append-to-body :visible.sync="signUpStatus" width="30%" custom-class="e-sign-dialog">
      <section class="e-sign-body">
        <header>
          <p>当前入驻申请已通过</p>
          <p>请{{ $route.query.legalPersonName }}（本人）微信扫码完成签约</p>
        </header>
        <div>
          <img :src="signUpUrl" alt="签约二维码" style="width:200px;height:200px" />
        </div>
        <section>
          <p>商户简称：{{ $route.query.merchantShortName }}</p>
          <p>公司名称：{{ $route.query.companyName }}</p>
          <p>结算银行卡：{{ $route.query.bankCard }}</p>
        </section>
      </section>
    </el-dialog>
    <!-- 验证账户 -->
    <el-dialog append-to-body title="验证账户" :visible.sync="checkAccountDialogVisible" width="40%">
      <section>
        <div class="p-account-item">
          <p>付款户名：{{ checkAccountData.accountName }}</p>
        </div>
        <div class="p-account-item">
          <p>汇款金额：{{ checkAccountData.payAmount }}</p>
        </div>
        <div class="p-account-item">
          <p>收款卡号：{{ checkAccountData.destinationAccountNumber }}</p>
        </div>
        <div class="p-account-item">
          <p>收款户名：{{ checkAccountData.destinationAccountName }}</p>
        </div>
        <div class="p-account-item">
          <p>收款账户开户行：{{ checkAccountData.destinationAccountBank }}</p>
        </div>
        <div class="p-account-item">
          <p>开户行省市：{{ checkAccountData.city }}</p>
        </div>
        <div class="p-account-item">
          <p>汇款截止时间：{{ checkAccountData.deadlineTime }}</p>
        </div>
        <div class="p-account-item">
          <p>汇款备注信息（必填）：{{ checkAccountData.remark }}</p>
        </div>
        <el-alert
          :title="'温馨提醒：请在' + checkAccountData.deadlineTime + '前，使用用上方的付款账号，向指定的收款账号汇入' + checkAccountData.payAmount + '元，以完成账户验证，过期未验证账户则入驻失败！'"
          type="warning"
          show-icon
          :closable="false"
          style="margin: 20px 0"
        ></el-alert>
      </section>
    </el-dialog>
    <!-- dialog -->
    <el-dialog append-to-body :visible.sync="isReason" title="原因" width="507px">
      <p>{{ reasonMsg }}</p>
      <div slot="footer">
        <el-button @click="isReason = false" type="primary" size="small">确定</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import { generalDetail, generalView, queryBySubMchId } from '@/api/wxArchive'
import { detailOptions, updateStatusOptions } from './index.js'

export default {
  data() {
    return {
      detailOptions,
      updateStatusOptions,
      isReason: false,
      signUpStatus: false,
      signUpUrl: '',
      checkAccountData: {},
      checkAccountDialogVisible: false,
      reasonMsg: '',
      isTabLock: false, // 锁状态
      tableData: [],
      currentPage: 1,
      totalPage: 0,
      pageSize: 10
    }
  },
  computed: {
    tableMaxHeight() {
      return document.documentElement.clientHeight - 56 - 48 - 32 - 116
    }
  },
  mounted() {
    this.handleQueryPage()
  },
  methods: {
    handleVerifyAccount: async function(row) {
      try {
        const res = await queryBySubMchId({ subMchId: row.subMchId })
        if (res) {
          this.checkAccountData = res
          this.checkAccountDialogVisible = true
        } else {
          this.$message.error('验证账户暂无结果，请稍后重试')
        }
      } catch (error) {}
    },
    handleSignUp: async function(row, flag) {
      try {
        this.signUpStatus = true
        const res = await generalView({ id: row.id, flag })
        this.signUpUrl = 'data:image/png;base64,' + btoa(new Uint8Array(res.data).reduce((data, byte) => data + String.fromCharCode(byte), ''))
      } catch (error) {}
    },
    handleReason(row) {
      this.reasonMsg = row.remark
      this.isReason = true
    },
    handleCurrentChange(val) {
      // 切换当前页
      this.currentPage = val
      this.handleQueryPage()
    },
    handleSizeChange(val) {
      // 切换页面总条数
      this.currentPage = 1
      this.pageSize = val
      this.handleQueryPage()
    },
    handleQueryPage: async function() {
      try {
        this.isTabLock = true
        const res = await generalDetail({ id: this.$route.query.id })
        this.tableData = res
        this.totalPage = res.totalCount
      } catch (error) {
      } finally {
        this.isTabLock = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.p {
  &-account {
    &-item {
      line-height: 40px;
    }
  }
}
.e {
  &-sign {
    &-body {
      text-align: center;
      section p {
        line-height: 1.8;
      }
    }
  }
}
</style>
<style lang="scss">
.e {
  &-sign {
    &-dialog {
      /deep/ .el-dialog__header {
        border-bottom: 0 none !important;
      }
    }
  }
}
</style>
