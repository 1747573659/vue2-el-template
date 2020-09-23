<template>
  <section>
    <div class="data-box" v-loading="isTabLock">
      <el-table :data="tableData" :max-height="tableMaxHeight">
        <el-table-column prop="subMchId" label="微信商户号"></el-table-column>
        <el-table-column prop="channelList" label="进件类型"></el-table-column>
        <el-table-column prop="createTime" label="公司名称"></el-table-column>
        <el-table-column prop="createTime" label="进件时间"></el-table-column>
        <el-table-column prop="status" label="审核状态"></el-table-column>
        <el-table-column prop="updateStatus" label="升级状态"></el-table-column>
        <el-table-column label="操作" align="right" width="400px">
          <template slot-scope="scope">
            <div v-if="scope.row.status !== -1">
              <el-button type="text" size="small" v-if="scope.row.status === 3 && scope.row.updateStatus === null">立即签约</el-button>
              <el-button type="text" size="small" v-if="scope.row.updateStatus === 4">升级签约</el-button>
              <el-button type="text" size="small" v-if="scope.row.updateStatus === 2">验证账户</el-button>
            </div>
            <span v-else>--</span>
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
          :total="totalPage"
        >
        </el-pagination>
      </div>
    </div>
    <!-- dialog -->
    <!-- 升级签约/立即签约 -->
    <el-dialog>
      <section>
        <header>
          <p>当前入驻申请已通过</p>
          <p>请林超（本人）微信扫码完成签约</p>
        </header>
        <div>
          <img src="" alt="" />
        </div>
        <section>
          <p>商户简称</p>
          <p>公司名称</p>
          <p>结算银行卡</p>
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
  </section>
</template>

<script>
import { generalDetail } from '@/api/wxArchive'

export default {
  data() {
    return {
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
        this.tableData = res.results
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
.author-dialog {
  /deep/.el-dialog__body {
    height: 380px;
    .author-dialog-text {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      line-height: 22px;
      color: #3d4966;
    }
    .author-dialog-text:first-child {
      margin-bottom: 12px;
    }
    .author-dialog-img {
      top: 50%;
      position: absolute;
      left: 50%;
      transform: translate(-50%);
      width: 152px;
      height: 152px;
    }
  }
}
.shop-dialog {
  /deep/.el-dialog__body {
    display: flex;
    justify-content: center;
  }
}
.shop-dialog-row {
  display: flex;
  align-items: center;
  line-height: 32px;
}
</style>
