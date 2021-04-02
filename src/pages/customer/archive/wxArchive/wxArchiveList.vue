<template>
  <section>
    <div class="search-box">
      <div class="p-count-con">
        <section class="p-count-main" v-if="countData.length > 0">
          <img src="../../../../assets/images/icon/mark.png" alt="提示" />
          <template v-for="item in countData">
            <div class="p-count_item" :key="item.directAuditStatus">{{ item.label }}：{{ item.value }}</div>
          </template>
        </section>
      </div>
      <!-- <pre>{{countData}}</pre> -->
      <!-- <count-tips-header :data="countData" color="rgba(255, 96, 16, 0.08)" bdColor="rgba(255, 96, 16, 0.4)">
        <template #icon>
          <img src="../../../../assets/images/icon/mark.png" alt="提示" />
        </template>
      </count-tips-header> -->
      <el-form ref="form" size="small" label-suffix=":" :inline="true" :model="form" label-width="80px" @submit.native.prevent>
        <el-row class="p-form-general_row">
          <el-col :span="21">
            <el-col>
              <el-form-item label="申请时间">
                <el-date-picker
                  class="p-form-input_width"
                  v-model="form.createTime"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :default-time="['00:00:00', '23:59:59']"
                  clearable
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="商户类型">
                <el-select v-model="form.merchantType" class="p-form-input_width" clearable placeholder="全部">
                  <el-option v-for="item in merchantTypeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="审核状态">
                <el-select v-model="form.directAuditStatus" class="p-form-input_width" filterable clearable placeholder="全部">
                  <el-option v-for="(item, index) in [{ label: '全部', value: '' }, ...direAuditStatusOptions]" :key="index" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="是否停用">
                <el-select v-model="form.stopUse" class="p-form-input_width" clearable placeholder="全部">
                  <el-option v-for="item in deactivateOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="商户号">
                <el-input v-model.trim="form.channelMchId" class="p-form-input_width" maxlength="50" clearable placeholder="商户号"></el-input>
              </el-form-item>
              <el-form-item label="商户信息">
                <el-input v-model.trim="form.msg" class="p-form-input_width" maxlength="50" clearable placeholder="商户/公司名称/商户简称/银行卡号/资料ID"></el-input>
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item class="p-form-general_label">
                <el-button type="primary" @click="handleSearch" :loading="isSearchLock">查询</el-button>
              </el-form-item>
            </el-col>
          </el-col>
          <el-col :span="3">
            <el-form-item>
              <el-button type="primary" size="small" plain icon="el-icon-plus" v-permission="'WXARCHIVE_LIST_ADD'" @click="handlePushDetail({ action: 'add' })">新增</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="data-box" v-loading="isTabLock">
      <el-table :data="tableData" :max-height="tabMaxHeight" :default-sort="{ prop: 'archiveBaseDTO.createTime', order: 'descending' }" @sort-change="handleTabSort">
        <el-table-column prop="archiveBaseDTO.createTime" label="申请时间" sortable="custom" width="110"></el-table-column>
        <el-table-column prop="archiveBaseDTO.id" label="资料ID" min-width="100"></el-table-column>
        <el-table-column prop="merchantName" label="商户/公司名称" min-width="190">
          <template slot-scope="scope">
            <div class="archive-table-oneline">{{ scope.row.merchantName || '--' }}</div>
            <div class="archive-table-oneline">{{ scope.row.archiveBaseDTO.companyName || '--' }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="archiveBaseDTO.merchantShortName" label="商户简称/银行卡号" min-width="190">
          <template slot-scope="scope">
            <div class="archive-table-oneline">{{ scope.row.archiveBaseDTO.merchantShortName || '--' }}</div>
            <div class="archive-table-oneline">{{ scope.row.archiveExpandDTO.bankCard || '--' }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="archiveExpandDTO.channelMchId" label="商户号" min-width="80"></el-table-column>
        <el-table-column label="商户类型">
          <template slot-scope="scope">
            <span>{{ scope.row.archiveBaseDTO.merchantType | filterStatus(merchantTypeOptions) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="审核状态">
          <template slot-scope="scope">
            <span :class="{ 'e-general_tabOrange': scope.row.archiveBaseDTO.directAuditStatus === 4 }" @click="handleReason(scope.row)">
              {{ scope.row.archiveBaseDTO.directAuditStatus | filterStatus(direAuditStatusOptions) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="费率" min-width="75">
          <template slot-scope="scope">
            <span>{{ scope.row.archiveBaseDTO.fixFeeRate / 100 }}%</span>
          </template>
        </el-table-column>
        <el-table-column label="停用" min-width="55">
          <template slot-scope="scope">
            <span>{{ scope.row.archiveBaseDTO.stopUse ? '是' : '否' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" align="right" width="210">
          <template slot-scope="scope">
            <template v-if="scope.row.archiveBaseDTO.directAuditStatus === 1">
              <el-button type="text" size="small" v-permission="'WXARCHIVE_LIST_EDIT'" @click="handlePushDetail({ status: 'edit' }, scope.row)">审核</el-button>
            </template>
            <template v-else-if="[0, 2, 4, 6, 8].includes(scope.row.archiveBaseDTO.directAuditStatus)">
              <el-button type="text" size="small" v-permission="'WXARCHIVE_LIST_EDIT'" @click="handlePushDetail({ status: 'edit' }, scope.row)">编辑</el-button>
            </template>
            <el-button type="text" size="small" v-else @click="handlePushDetail({ status: 'detail' }, scope.row)">详情</el-button>
            <el-button type="text" size="small" v-permission="'WXARCHIVE_LIST_ADD'" @click="handlePushDetail({ status: 'copy' }, scope.row)">复制</el-button>
            <template v-if="scope.row.archiveBaseDTO.directAuditStatus === 0">
              <el-popconfirm class="e-popover_con" @confirm="handleDelRow(scope.row)" placement="top-start" title="确定删除所选数据吗？">
                <el-button type="text" size="small" slot="reference">删除</el-button>
              </el-popconfirm>
            </template>
            <el-button type="text" size="small" v-permission="'WXARCHIVE_LIST_STOPUSE'" v-else @click="handleStopUse(scope.row)">
              <span>{{ scope.row.archiveBaseDTO.stopUse === 1 ? '启用' : '停用' }}</span>
            </el-button>
            <el-button type="text" size="small" v-if="scope.row.archiveBaseDTO.directAuditStatus === 3" @click="handleDirectAuditStatus(scope.row)">撤销</el-button>
            <template v-if="scope.row.archiveBaseDTO.merchantType === 5">
              <el-button type="text" size="small" v-if="scope.row.archiveBaseDTO.directAuditStatus === 10" @click="handleCheckAccount(scope.row)">验证账号</el-button>
              <el-button type="text" size="small" v-if="scope.row.archiveBaseDTO.directAuditStatus === 11" @click="handleSignUp(scope.row)">立即签约</el-button>
            </template>
            <template v-else-if="[7, 10, 11].includes(scope.row.archiveBaseDTO.directAuditStatus)">
              <el-button type="text" size="small" @click="$router.push({ name: 'wxProgress', query: { id: scope.row.archiveBaseDTO.id } })">申请进度</el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <div class="km-page-block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 30, 50]"
          :page-size="pageSize"
          :total="totalPage"
          layout="total, sizes, prev, pager, next, jumper"
        >
        </el-pagination>
      </div>
    </div>

    <!-- 升级签约/立即签约 -->
    <el-dialog append-to-body :visible.sync="signUpVisible" width="30%" custom-class="e-sign-dialog">
      <section class="e-sign-body">
        <header>
          <p>当前入驻申请已通过</p>
          <p>请{{ signUpData.legalPersonName }}（本人）微信扫码完成签约</p>
        </header>
        <div>
          <img :src="signUpData.QRcode" alt="签约二维码" style="width:200px;height:200px" />
        </div>
        <section>
          <p>商户名称：{{ signUpData.merchantShortName }}</p>
          <p>门店名称：{{ signUpData.companyName }}</p>
          <p>结算银行卡：{{ signUpData.bankCard }}</p>
        </section>
      </section>
    </el-dialog>

    <!-- 验证账户 -->
    <el-dialog append-to-body title="验证账户" :visible.sync="checkAccountVisible" width="40%">
      <section>
        <div class="p-account-item" v-for="(item, index) in checkAccountData" :key="index">
          <p>{{ item.label }}：{{ item.value }}</p>
        </div>
        <el-alert
          :title="
            `温馨提醒：请在${checkAccountData[6].deadlineTime}前，使用用上方的付款账号，向指定的收款账号汇入${checkAccountData[1].payAmount}元，以完成账户验证，过期未验证账户则入驻失败！`
          "
          type="warning"
          show-icon
          :closable="false"
          style="margin: 20px 0"
        ></el-alert>
      </section>
    </el-dialog>
  </section>
</template>

<script>
import { mapActions } from 'vuex'
import { filterStatus } from './filters'
import { tableMaxHeight } from '@/mixins/tableMaxHeight'
import { merchantTypeOptions, deactivateOptions, countOptions } from './index'
import {
  queryPage,
  generalStopUse,
  queryTotalByStatus,
  delList,
  generalView,
  queryArchiveDirectAuditStatus,
  queryBySubMchId,
  generalDetail,
  updateArchiveBaseDirectAuditStatus
} from '@/api/wxArchive'
import countTipsHeader from '../components/tipsHeader'

export default {
  name: 'wxArchive',
  mixins: [tableMaxHeight],
  // components: {
  //   countTipsHeader
  // },
  data() {
    return {
      merchantTypeOptions,
      deactivateOptions,
      countOptions,
      direAuditStatusOptions: [],
      countData: [],
      form: {
        createTime: '',
        merchantType: '',
        directAuditStatus: '',
        stopUse: 0,
        channelMchId: '',
        msg: '',
        sortStatus: 'desc'
      },
      isSearchLock: false, // 锁状态
      isTabLock: false,
      tableData: [],
      currentPage: 1,
      totalPage: 0,
      pageSize: 10,
      signUpVisible: false,
      signUpData: {},
      checkAccountVisible: false,
      checkAccountData: [
        { label: '付款户名', field: 'accountName', value: '' },
        { label: '汇款金额', field: 'payAmount', value: '' },
        { label: '收款卡号', field: 'destinationAccountNumber', value: '' },
        { label: '收款户名', field: 'destinationAccountName', value: '' },
        { label: '收款账户开户行', field: 'destinationAccountBank', value: '' },
        { label: '开户行省市', field: 'city', value: '' },
        { label: '汇款截止时间', field: 'deadlineTime', value: '' },
        { label: '汇款备注信息（必填）', field: 'remark', value: '' }
      ]
    }
  },
  filters: {
    filterStatus
  },
  activated() {
    this.countData = countOptions
    this.handleQueryPage()
    this.handleQueryTotalByStatus()
  },
  mounted() {
    this.countData = countOptions
    this.handleQueryPage()
    this.handleQueryTotalByStatus()
    this.handleAuditStatus()
  },
  methods: {
    ...mapActions(['delCachedView']),
    handleDirectAuditStatus: async function(row) {
      try {
        await updateArchiveBaseDirectAuditStatus({ id: row.archiveBaseDTO.id })
        this.handleQueryPage()
        this.$message({ type: 'success', message: '资料撤销成功' })
      } catch (error) {}
    },
    handleAuditStatus: async function() {
      try {
        const res = await queryArchiveDirectAuditStatus()
        const direAuditStatusOptions = res.map(item => {
          return { label: item.directArchiveAuditStatusDesc, value: item.directArchiveAuditStatus }
        })
        this.direAuditStatusOptions = direAuditStatusOptions
        sessionStorage.direAuditStatusOptions = JSON.stringify(direAuditStatusOptions)
      } catch (error) {}
    },
    handlePushDetail(query, row = {}) {
      const queryParams = query.action === 'add' ? query : Object.assign({ action: 'detail', id: row.archiveBaseDTO.id }, query)
      this.delCachedView({ name: 'wxArchiveAdd' }).then(() => this.$router.push({ name: 'wxArchiveAdd', query: queryParams }))
    },
    handleReason(row) {
      if (row.archiveBaseDTO.directAuditStatus === 4) {
        this.$alert(row.archiveBaseDTO.auditRemark, '原因', { confirmButtonText: '知道了', customClass: 'e-message-con' }).catch(() => {})
      }
    },
    handleTabSort({ column, prop, order }) {
      this.form.sortStatus = order ? order.substring(0, order.indexOf('ending')) : ''
      this.handleQueryPage()
    },

    handleQueryTotalByStatus: async function() {
      try {
        const res = await queryTotalByStatus(this.handleQueryTabParams())
        this.countData = []
        if (res.auditStatuses?.length > 0) {
          for (const ele of this.countOptions) {
            for (const item of res.auditStatuses) {
              if (ele.value === item.auditStatus) this.countData.push({ label: ele.label, value: item.total })
            }
          }
        } else this.countData = countOptions
      } catch (error) {}
    },

    handleQueryTabParams() {
      const { createTime, msg, sortStatus, ...params } = this.form
      return Object.assign(params, {
        orders: { createTime: sortStatus },
        startTime: createTime?.[0] ?? '',
        endTime: createTime?.[1] ?? '',
        archiveIdStr: msg,
        companyName: msg,
        bankCard: msg,
        merchantName: msg,
        merchantShortName: msg,
        page: this.currentPage,
        rows: this.pageSize
      })
    },
    handleCheckAccount: async function(row) {
      try {
        const generalRes = await generalDetail({ id: row.archiveBaseDTO.id })
        const res = await queryBySubMchId({ subMchId: generalRes?.[0]?.subMchId ?? '' })
        if (res) {
          this.checkAccountVisible = true
          this.checkAccountData.forEach(item => {
            item.value = res[item.field]
            return item
          })
        } else this.$message({ type: 'error', message: '验证账户暂无结果，请稍后重试' })
      } catch (error) {}
    },
    handleSignUp: async function(row) {
      try {
        const generalRes = await generalDetail({ id: row.archiveBaseDTO.id })
        if (generalRes.length > 0 && generalRes.length === 1) {
          const res = await generalView({ id: generalRes[0].id, flag: 1 })
          this.signUpStatus = true
          this.signUpData = row
          this.signUpData.QRcode = 'data:image/png;base64,' + btoa(new Uint8Array(res.data).reduce((data, byte) => data + String.fromCharCode(byte), ''))
        } else this.$message({ type: 'error', message: '签约账户暂无结果，请稍后重试' })
      } catch (error) {}
    },
    handleDelRow: async function(row) {
      try {
        await delList({ id: row.archiveBaseDTO.id })
        if (!--this.tableData.length) this.currentPage = Math.ceil((this.totalPage - 1) / this.pageSize) || 1
        this.handleQueryPage()
        this.handleQueryTotalByStatus()
      } catch (error) {}
    },
    handleStopUse: async function(row) {
      await generalStopUse({ archiveId: row.archiveBaseDTO.id, stopUse: Number(!row.archiveBaseDTO.stopUse) })
      await this.handleQueryPage()
      this.$message.success('修改成功')
    },
    handleSearch() {
      this.currentPage = 1
      this.isSearchLock = true
      this.handleQueryTotalByStatus()
      this.handleQueryPage().finally(() => {
        this.isSearchLock = false
      })
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.handleQueryPage()
    },
    handleSizeChange(val) {
      this.currentPage = 1
      this.pageSize = val
      this.handleQueryPage()
    },
    handleQueryPage: async function() {
      try {
        this.isTabLock = true
        const res = await queryPage(this.handleQueryTabParams())
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
.search-box {
  margin-left: -16px;
  margin-right: -16px;
  border-bottom: 16px solid #f7f8fa;
  .p-form-general_row {
    display: flex;
    align-items: flex-end;
  }
  .p-form-input_width {
    width: 240px;
    @media screen and (min-width: 1440px) {
      width: 290px;
    }
  }
  .p-form-general_label {
    margin-left: 80px;
  }
  .el-col-3 .el-form-item {
    float: right;
  }
}
.data-box {
  .e-general_tabOrange {
    color: #ff6010;
    cursor: pointer;
  }
  .e-popover_con {
    margin-left: 12px;
  }
  .archive-table-oneline {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
.p {
  &-count {
    &-con {
      min-height: 34px;
      margin: 0 8px 16px 8px;
    }
    &-main {
      background: rgba(255, 96, 16, 0.08);
      border: 1px solid rgba(255, 96, 16, 0.4);
      border-radius: 2px;
      display: flex;
      align-items: center;
      padding: 7px 16px;
      font-size: 14px;
      color: #3d4966;
      img {
        width: 16px;
        height: 16px;
        margin-right: 8px;
      }
    }
    &_item {
      &:not(:last-child) {
        margin-right: 30px;
      }
    }
  }
}
</style>
