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
            <el-button type="text" size="small" v-if="scope.row.status === 3 && scope.row.updateStatus === null" @click="handleSignUp(scope.row, 1)">立即签约</el-button>
            <el-button type="text" size="small" v-else-if="[3, 4].includes(scope.row.status) && scope.row.updateStatus === 4" @click="handleSignUp(scope.row, 2)">升级签约</el-button>
            <el-button type="text" size="small" v-else-if="[3, 4].includes(scope.row.status) && scope.row.updateStatus === 2">验证账户</el-button>
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
    <el-dialog title="验证账户">
      <section>
        <div class="p-account-item">
          <p>汇款金额</p>
        </div>
        <div class="p-account-item">
          <p>收款卡号</p>
        </div>
        <div class="p-account-item">
          <p>收款户名</p>
        </div>
        <div class="p-account-item">
          <p>收款账户开户行</p>
        </div>
        <div class="p-account-item">
          <p>开户行省市</p>
        </div>
        <div class="p-account-item">
          <p>汇款截止时间</p>
        </div>
        <div class="p-account-item">
          <p>汇款备注信息</p>
        </div>
      </section>
      <el-alert :title="234" type="warning" show-icon :closable="false"></el-alert>
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
import { generalDetail, generalView } from '@/api/wxArchive'
import { detailOptions, updateStatusOptions } from './index.js'

export default {
  data() {
    return {
      detailOptions,
      updateStatusOptions,
      isReason: false,
      signUpStatus: false,
      signUpUrl: '',
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
.e {
  &-sign {
    &-body {
      text-align: center;
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
