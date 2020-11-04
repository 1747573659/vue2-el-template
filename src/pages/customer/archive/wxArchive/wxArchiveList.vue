<template>
  <section>
    <div class="search-box">
      <div class="p-count">
        <section class="p-count_con" v-if="countData.length > 0">
          <img src="../../../../assets/images/icon/mark.png" alt="提示" />
          <template v-for="item in countData">
            <div class="p-count_item" :key="item.auditStatus">{{ item.label }}：{{ item.total }}</div>
          </template>
        </section>
      </div>
      <el-form ref="form" size="small" label-suffix=":" :inline="true" :model="form" label-width="80px" @submit.native.prevent>
        <el-row class="p-general_row">
          <el-col :span="21">
            <el-col>
              <el-form-item label="申请时间">
                <el-date-picker
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
              <el-form-item label="资料状态">
                <el-select v-model="form.auditStatus" class="p-general_formWidth" clearable placeholder="全部">
                  <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="商户信息">
                <el-input v-model.trim="form.msg" class="p-general_formWidth" maxlength="50" clearable placeholder="商户名称/简称/公司名称/卡号"></el-input>
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="停用">
                <el-select v-model="form.stopUse" class="p-general_formWidth" clearable placeholder="全部">
                  <el-option v-for="item in deactivateOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item class="p-general_btnLabel">
                <el-button type="primary" class="e-general-btn" @click="handleSearch" :loading="isSearchLock">查询</el-button>
              </el-form-item>
            </el-col>
          </el-col>
          <el-col :span="3">
            <el-form-item class="p-general_fr">
              <el-button
                v-permission="'WXARCHIVE_LIST_ADD'"
                type="primary"
                class="e-general-add"
                size="small"
                plain
                icon="el-icon-plus"
                @click="handlePushDetail({ action: 'add' })"
                >新增</el-button
              >
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="data-box" v-loading="isTabLock">
      <el-table :data="tableData" :max-height="tableMaxHeight" :default-sort="{ prop: 'archiveBaseDTO.createTime', order: 'descending' }" @sort-change="handleTabSort">
        <el-table-column prop="archiveBaseDTO.createTime" label="申请时间" sortable="custom" width="110"></el-table-column>
        <el-table-column prop="merchantName" label="商户名称"></el-table-column>
        <el-table-column prop="archiveBaseDTO.merchantShortName" label="商户简称"></el-table-column>
        <el-table-column prop="archiveBaseDTO.companyName" label="公司名称"></el-table-column>
        <el-table-column label="进件类型">
          <template slot-scope="scope">
            <span>{{ scope.row.archiveBaseDTO.archiveType === 1 ? '微信直连' : '小微商户' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="资料状态">
          <template slot-scope="scope">
            <span :class="{ 'e-general_tabOrange': scope.row.archiveBaseDTO.auditStatus === 4 }" @click="handleReason(scope.row)">
              {{ scope.row.archiveBaseDTO.auditStatus | filterReview }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="小微进件">
          <template slot-scope="scope">
            <span>{{ scope.row.xiaoWeiArchiveStatus | filterArchiveStatus(xiaoWeiArchiveData) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="升级状态">
          <template slot-scope="scope">
            <span>{{ scope.row.xiaoWeiUpgradeStatus | filterArchiveStatus(xiaoWeiUpgradeData) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="费率" width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.archiveBaseDTO.fixFeeRate / 100 }}%</span>
          </template>
        </el-table-column>
        <el-table-column label="停用" width="60">
          <template slot-scope="scope">
            <span>{{ scope.row.archiveBaseDTO.stopUse ? '是' : '否' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="right" width="210">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              v-permission="'WXARCHIVE_LIST_EDIT'"
              @click="handlePushDetail({ status: 'edit' }, scope.row)"
              v-if="scope.row.archiveBaseDTO.auditStatus === 2"
              >审核</el-button
            >
            <el-button
              type="text"
              size="small"
              v-permission="'WXARCHIVE_LIST_EDIT'"
              @click="handlePushDetail({ status: 'edit' }, scope.row)"
              v-else-if="[0, 1, 4].includes(scope.row.archiveBaseDTO.auditStatus)"
              >编辑</el-button
            >
            <el-button type="text" size="small" @click="handlePushDetail({ status: 'detail' }, scope.row)" v-else>详情</el-button>
            <el-button type="text" size="small" v-permission="'WXARCHIVE_LIST_ADD'" @click="handlePushDetail({ status: 'copy' }, scope.row)">复制</el-button>
            <el-button type="text" size="small" v-permission="'WXARCHIVE_LIST_STOPUSE'" v-if="scope.row.archiveBaseDTO.auditStatus !== 0" @click="handleStopUse(scope.row)">{{
              scope.row.archiveBaseDTO.stopUse === 1 ? '启用' : '停用'
            }}</el-button>
            <el-popover :ref="`popover${scope.$index}`" placement="top-start" width="170" v-else class="e-popover_con">
              <p class="e-popover_prompt">确定删除所选数据吗？</p>
              <div class="e-popover_action">
                <el-button size="mini" type="text" @click="handleDraftCancel(scope.$index)">取消</el-button>
                <el-button type="primary" size="mini" @click="handleDraftList(scope)">确定</el-button>
              </div>
              <el-button type="text" size="small" slot="reference">删除</el-button>
            </el-popover>
            <el-button type="text" size="small" v-if="scope.row.hasArchive" @click="handlePushLinComDetail">进件详情</el-button>
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
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalPage"
        >
        </el-pagination>
      </div>
    </div>
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
import { statusOptions, deactivateOptions, countOptions } from './index'
import { filterReview, filterArchiveStatus } from './filters'
import { queryPage, xiaoWeiArchiveStatus, xiaoWeiUpgradeStatus, generalStopUse, queryTotalByStatus, delList } from '@/api/wxArchive'

export default {
  name: 'wxArchive',
  data() {
    return {
      statusOptions,
      deactivateOptions,
      countOptions,
      countData: [],
      form: {
        createTime: '',
        auditStatus: '',
        msg: '',
        stopUse: 0
      },
      isSearchLock: false, // 锁状态
      isTabLock: false,
      isReason: false, // 异常状态原因
      reasonMsg: '',
      sortStatus: '', // 时间排序状态
      xiaoWeiArchiveData: [],
      xiaoWeiUpgradeData: [],
      tableData: [],
      currentPage: 1,
      totalPage: 0,
      pageSize: 10
    }
  },
  filters: {
    filterReview,
    filterArchiveStatus
  },
  computed: {
    tableMaxHeight() {
      return document.documentElement.clientHeight - 56 - 48 - 172.5 - 32 - 116
    }
  },
  activated() {
    this.currentPage = 1
    this.handleQueryPage()
    this.handleQueryTotalByStatus()
  },
  mounted() {
    this.getXiaoWeiArchiveStatus()
    this.getXiaoWeiUpgradeStatus()
    this.handleQueryPage()
    this.handleQueryTotalByStatus()
  },
  methods: {
    handleQueryTotalByStatus: async function() {
      const data = {
        orders: { createTime: this.sortStatus },
        startTime: this.form.createTime?.[0] ?? '',
        endTime: this.form.createTime?.[1] ?? '',
        auditStatus: this.form.auditStatus,
        companyName: this.form.msg,
        bankCard: this.form.msg,
        merchantName: this.form.msg,
        merchantShortName: this.form.msg,
        stopUse: this.form.stopUse,
        page: this.currentPage,
        row: this.pageSize
      }
      try {
        const res = await queryTotalByStatus(data)
        this.countData = []
        for (const item of res) {
          for (const ele of this.countOptions) {
            if (ele.value === item.auditStatus) this.countData.push({ label: ele.label, total: item.total })
          }
        }
      } catch (error) {}
    },
    handleDraftCancel(index) {
      this.$refs[`popover${index}`].doClose()
    },
    handleDraftList: async function(scope) {
      try {
        await delList({ id: scope.row.archiveBaseDTO.id })
        this.handleQueryPage()
      } catch (error) {
      } finally {
        this.$refs[`popover${scope.$index}`].doClose()
      }
    },
    handlePushLinComDetail(row) {
      this.$router.push({
        name: 'wxArchiveDetail',
        query: { id: row.id, legalPersonName: row.legalPersonName, merchantShortName: row.merchantShortName, companyName: row.companyName, bankCard: row.bankCard }
      })
    },
    handlePushDetail(query, row = {}) {
      this.$router.push({ name: 'wxArchiveAdd', query: query.action === 'add' ? query : Object.assign({ action: 'detail', id: row.archiveBaseDTO.id }, query) })
    },
    handleReason(row) {
      if (row.archiveBaseDTO.auditStatus === 4) {
        this.reasonMsg = row.archiveBaseDTO.auditRemark
        this.isReason = true
      }
    },
    handleSearch() {
      this.currentPage = 1
      this.isSearchLock = true
      this.handleQueryTotalByStatus()
      this.handleQueryPage().finally(() => {
        this.isSearchLock = false
      })
    },
    handleTabSort({ column, prop, order }) {
      this.sortStatus = order ? order.substring(0, order.indexOf('ending')) : ''
      this.handleQueryPage()
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
      const data = {
        orders: { createTime: this.sortStatus },
        startTime: this.form.createTime?.[0] ?? '',
        endTime: this.form.createTime?.[1] ?? '',
        auditStatus: this.form.auditStatus,
        companyName: this.form.msg,
        bankCard: this.form.msg,
        merchantName: this.form.msg,
        merchantShortName: this.form.msg,
        stopUse: this.form.stopUse,
        page: this.currentPage,
        row: this.pageSize
      }
      try {
        this.isTabLock = true
        const res = await queryPage(data)
        this.tableData = res.results
        this.totalPage = res.totalCount
      } catch (error) {
      } finally {
        this.isTabLock = false
      }
    },
    handleStopUse: async function(row) {
      await generalStopUse({ archiveId: row.archiveBaseDTO.id, stopUse: !row.archiveBaseDTO.stopUse ? 1 : 0 })
      await this.handleQueryPage()
      this.$message.success('修改成功')
    },
    getXiaoWeiArchiveStatus: async function() {
      const res = await xiaoWeiArchiveStatus()
      this.xiaoWeiArchiveData = res
    },
    getXiaoWeiUpgradeStatus: async function() {
      const res = await xiaoWeiUpgradeStatus()
      this.xiaoWeiUpgradeData = res
    }
  }
}
</script>

<style lang="scss" scoped>
.p {
  &-general {
    &_row {
      display: flex;
      align-items: flex-end;
    }
    &_formWidth {
      width: 240px;
    }
    &_fr {
      float: right;
    }
    &_btnLabel {
      padding-left: 30px;
      text-align: right;
    }
  }
  &-count {
    min-height: 44px;
    margin: 0 8px 16px 8px;
    &_con {
      background: rgba(255, 96, 16, 0.08);
      border: 1px solid rgba(255, 96, 16, 0.4);
      border-radius: 2px;
      display: flex;
      align-items: center;
      padding: 12px 16px;
      font-size: 14px;
      color: #3d4966;
      img {
        width: 14px;
        height: 14px;
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

.e {
  &-general {
    &-btn {
      padding: 8px 13px;
    }
    &-add {
      padding: 8px 15.5px;
    }
    &_tabOrange {
      color: #ff6010;
      cursor: pointer;
    }
  }
  &-popover {
    &_con {
      margin-left: 12px;
    }
    &_prompt {
      margin-bottom: 15px;
    }
    &_action {
      text-align: right;
    }
  }
}
</style>
