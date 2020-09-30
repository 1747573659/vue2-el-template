<template>
  <section>
    <div class="search-box">
      <el-form ref="form" size="small" label-suffix=":" :inline="true" :model="form" label-width="100px" @submit.native.prevent>
        <el-row class="p-general_row">
          <el-col :span="21">
            <el-form-item label="申请时间">
              <el-date-picker
                v-model="form.createTime"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="资料状态">
              <el-select v-model="form.auditStatus" class="p-general_formWidth" clearable placeholder="全部">
                <template v-for="item in statusOptions">
                  <el-option v-if="!item.hidden" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </template>
              </el-select>
            </el-form-item>
            <el-form-item label="商户信息">
              <el-input v-model="form.msg" class="p-general_formWidth" maxlength="50" clearable placeholder="请输入商户名称/简称/公司名称/银行卡号"></el-input>
            </el-form-item>
            <el-form-item label="停用">
              <el-select v-model="form.isDeactivate" class="p-general_formWidth" clearable placeholder="全部">
                <el-option v-for="item in deactivateOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <div class="p-general_btnLabel">
                <el-button type="primary" class="e-general-btn" @click="handleSearch" :loading="isSearchLock">查询</el-button>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item class="p-general_fr">
              <el-button
                type="primary"
                class="e-general-add"
                size="small"
                plain
                icon="el-icon-plus"
                @click="$router.push({ name: 'wxArchiveAdd', query: { action: 'add' } })"
                v-permission="'ACCOUNT_ROLE_ADD'"
                >新增</el-button
              >
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="data-box" v-loading="isTabLock">
      <el-table :data="tableData" :max-height="tableMaxHeight" @sort-change="handleTabSort">
        <el-table-column prop="archiveBaseDTO.createTime" label="申请时间" sortable="custom" width="110" align="center"></el-table-column>
        <el-table-column prop="merchantName" label="商户名称"></el-table-column>
        <el-table-column prop="archiveBaseDTO.merchantShortName" label="商户简称"></el-table-column>
        <el-table-column prop="archiveBaseDTO.companyName" label="公司名称"></el-table-column>
        <el-table-column label="进件类型" width="100px">
          <template slot-scope="scope">
            <p>{{ scope.row.archiveBaseDTO.archiveType === 1 ? '微信直连' : '小微商户' }}</p>
          </template>
        </el-table-column>
        <el-table-column label="资料状态" width="150px">
          <template slot-scope="scope">
            <span :class="{ 'e-general_tabOrange': scope.row.archiveBaseDTO.auditStatus === 4 }" @click="handleReason(scope.row)">{{
              scope.row.archiveBaseDTO.auditStatus | filterReview
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="小微进件状态" width="110px">
          <template slot-scope="scope">
            <span>{{ scope.row.xiaoWeiArchiveStatus | filterArchiveStatus(xiaoWeiArchiveData) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="升级状态" width="110px">
          <template slot-scope="scope">
            <span>{{ scope.row.xiaoWeiUpgradeStatus | filterArchiveStatus(xiaoWeiUpgradeData) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="费率" width="90px">
          <template slot-scope="scope">
            <span>{{ scope.row.archiveBaseDTO.fixFeeRate / 100 }}%</span>
          </template>
        </el-table-column>
        <el-table-column label="停用" width="90px">
          <template slot-scope="scope">
            <span>{{ scope.row.archiveBaseDTO.stopUse === 1 ? '停用' : '启用' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="right" width="210px">
          <template slot-scope="scope">
            <!-- 按钮状态 编辑、审核、详情、复制、启用、停用 -->
            <el-button
              type="text"
              size="small"
              @click="$router.push({ name: 'wxArchiveAdd', query: { action: 'detail', id: scope.row.archiveBaseDTO.id } })"
              v-if="scope.row.archiveBaseDTO.auditStatus === 2"
              >审核</el-button
            >
            <el-button
              type="text"
              size="small"
              @click="$router.push({ name: 'wxArchiveAdd', query: { action: 'detail', id: scope.row.archiveBaseDTO.id } })"
              v-else-if="[0, 1, 4].includes(scope.row.archiveBaseDTO.auditStatus)"
              >编辑</el-button
            >
            <el-button type="text" size="small" v-else @click="$router.push({ name: 'wxArchiveAdd', query: { action: 'detail', id: scope.row.archiveBaseDTO.id } })"
              >详情</el-button
            >
            <el-button type="text" size="small" @click="$router.push({ name: 'wxArchiveAdd', query: { action: 'detail', isCopy: true, id: scope.row.archiveBaseDTO.id } })"
              >复制</el-button
            >
            <el-button type="text" size="small" @click="handleGeneralStopUse(scope.$index, scope.row)">{{ scope.row.archiveBaseDTO.stopUse === 1 ? '启用' : '停用' }}</el-button>
            <el-button type="text" size="small" v-if="scope.row.xiaoWeiArchiveStatus" @click="$router.push({ name: 'wxArchiveDetail', query: { id: scope.row.archiveBaseDTO.id } })"
              >进件详情</el-button
            >
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
import { filterReview, filterArchiveStatus } from './filters/reviewStatus'
import { statusOptions, deactivateOptions } from './index'
import { queryPage, xiaoWeiArchiveStatus, xiaoWeiUpgradeStatus, generalStopUse } from '@/api/wxArchive'
// 申请时间排序接口对接
// 停用启用状态对接
export default {
  data() {
    return {
      statusOptions,
      deactivateOptions,
      form: {
        createTime: '',
        auditStatus: '',
        msg: '',
        isDeactivate: 0
      },
      isSearchLock: false, // 锁状态
      isTabLock: false,
      isReason: false, // 异常状态原因
      reasonMsg: '',
      sortStatus: '',
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
      return document.documentElement.clientHeight - 56 - 48 - 112.5 - 32 - 116
    }
  },
  mounted() {
    this.getXiaoWeiArchiveStatus()
    this.getXiaoWeiUpgradeStatus()
    this.handleQueryPage()
  },
  methods: {
    handleReason(row) {
      this.reasonMsg = row.archiveBaseDTO.auditRemark
      this.isReason = true
    },
    handleTabSort({ column, prop, order }) {
      this.sortStatus = order ? order.substring(0, order.indexOf('ending')) : ''
      this.handleQueryPage()
    },
    handleSearch() {
      this.currentPage = 1
      this.isSearchLock = true
      this.handleQueryPage().finally(() => {
        this.isSearchLock = false
      })
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
    handleGeneralStopUse: async function(index, row) {
      // 启用/停用
      try {
        await generalStopUse({ archiveId: row.archiveBaseDTO.id, stopUse: !row.archiveBaseDTO.stopUse ? 1 : 0 })
        this.tableData[index].archiveBaseDTO.stopUse = !row.archiveBaseDTO.stopUse ? 1 : 0
      } catch (error) {}
    },
    handleQueryPage: async function() {
      const data = {
        orders: { createTime: this.sortStatus },
        startTime: this.form.createTime[0] ? `${this.form.createTime[0]} 00:00:00` : '',
        endTime: this.form.createTime[1] ? `${this.form.createTime[1]} 23:59:59` : '',
        auditStatus: this.form.auditStatus,
        companyName: this.form.msg,
        bankCard: this.form.msg,
        merchantName: this.form.msg,
        merchantShortName: this.form.msg,
        stopUse: this.form.isDeactivate,
        page: this.currentPage,
        row: this.pageSize
      }
      // 查询调用接口
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
      width: 100px;
      text-align: right;
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
}
</style>
