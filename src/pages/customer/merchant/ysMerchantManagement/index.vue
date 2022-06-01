<template>
  <section>
    <div class="search-box">
      <div class="km-tips">
        <template><img src="../../../../assets/images/icon/mark.png" alt="提示" class="tips-icon" /></template>
        <div class="tips-item" v-for="(item, index) in tipsData" :key="index">{{ item.label }}：{{ item.total }}</div>
      </div>
      <el-form ref="form" size="small" label-suffix=":" :inline="true" :model="searchForm" label-width="120px" @submit.native.prevent>
        <el-row type="flex" align="bottom">
          <el-col>
            <el-form-item label="商户名称">
              <el-input placeholder="请输入商户名称" clearable v-model="searchForm.params.shopIdOrName" @keyup.enter.native="handleSearch"></el-input>
            </el-form-item>
            <el-form-item label="主账号">
              <el-input placeholder="超管登录账号" clearable v-model="searchForm.params.loginName" @keyup.enter.native="handleSearch"></el-input>
            </el-form-item>
            <el-form-item label="账号状态">
              <el-select placeholder="全部" clearable multiple v-model="searchForm.params.accountStatus" @keyup.enter.native="handleSearch">
                <el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in accountStatusData"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="版本">
              <el-select placeholder="全部" clearable multiple collapse-tags v-model="searchForm.params.versionDetailId" @keyup.enter.native="handleSearch">
                <el-option :key="item.versionDetailDTO.id" :label="item.versionDetailDTO.name" :value="item.versionDetailDTO.id" v-for="item in currentVersionData"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="是否增购服务">
              <el-select placeholder="全部" clearable v-model="searchForm.params.isAdditional" @keyup.enter.native="handleSearch">
                <el-option value="" label="全部"></el-option>
                <el-option :value="1" label="是"></el-option>
                <el-option :value="0" label="否"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="ERP产品" prop="erpName">
              <el-select clearable multiple v-model="searchForm.params.erpCodes" @keyup.enter.native="handleSearch">
                <el-option v-for="(item, index) in erpSelectList" :key="index" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="是否微平台转入" prop="isMicro">
              <el-select clearable v-model="searchForm.params.isMicro" @keyup.enter.native="handleSearch">
                <el-option value="" label="全部"></el-option>
                <el-option :value="1" label="是"></el-option>
                <el-option :value="0" label="否"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="" class="date-picker">
              <el-select placeholder="开通时间" v-model="searchForm.params.timeQueryType" style="width: 120px" @keyup.enter.native="handleSearch">
                <el-option key="1" value="1" label="开通时间"></el-option>
                <el-option key="2" value="2" label="到期时间"></el-option>
                <el-option key="3" value="3" label="首购时间"></el-option>
              </el-select>
              <el-date-picker
                align="center"
                value-format="yyyy-MM-dd"
                end-placeholder="结束日期"
                range-separator="至"
                size="small"
                start-placeholder="开始日期"
                type="daterange"
                v-model="date" />
            </el-form-item>
            <el-form-item class="form-botton">
              <el-button type="primary" @click="handleSearch">查询</el-button>
              <el-button size="small" plain @click="handleReset">重置</el-button>
              <el-button size="small" v-permission="'YOUSHU_MERCHANT_MANAGEMENT_EXPORT'" @click="handleExport">导出</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="data-box" v-loading="isLoading">
      <el-table :data="tableData" :max-height="tabMaxHeight">
        <el-table-column label="商户名称" width="180px">
          <template slot-scope="scope">
            {{ '[' + scope.row.shopAdminId + ']' + scope.row.shopName }}
          </template>
        </el-table-column>
        <el-table-column label="主账号" prop="loginName" width="180px">
          <template slot-scope="scope">
            {{ scope.row.loginName ? scope.row.loginName : '--' }}
          </template>
        </el-table-column>
        <el-table-column label="ERP产品" prop="erpName"></el-table-column>
        <el-table-column label="开通时间" prop="activeTime" width="120px"></el-table-column>
        <el-table-column label="首购时间" prop="firstPurchaseTime" width="120px"></el-table-column>
        <el-table-column label="到期时间" prop="validTime" width="120px"></el-table-column>
        <el-table-column label="上线时间" prop="onlineTime" width="120px"></el-table-column>
        <el-table-column label="版本" prop="versionDetailDTO.name" width="120px"></el-table-column>
        <el-table-column label="版本状态" prop="accountStatus" width="160px">
          <template slot-scope="scope">
            <span>{{ accountStatusEnum[scope.row.accountStatus] }}</span>
          </template>
        </el-table-column>
        <el-table-column label="是否增购" prop="isAdditional" width="80px">
          <template slot-scope="scope">
            {{ scope.row.isAdditional === 1 ? '是' : '否' }}
          </template>
        </el-table-column>
        <el-table-column label="微平台ID" prop="microCustId"></el-table-column>
        <el-table-column label="地址" prop="detailAddress" width="120px">
          <template slot-scope="scope">
            {{ scope.row.detailAddress ? scope.row.detailAddress : '--' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" align="center" width="210">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="handleDeatils(scope.row)">
              <span>详情</span>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <km-pagination :request="getList" :current-page.sync="searchForm.page" :page-size.sync="searchForm.rows" :total="total" />
    </div>
  </section>
</template>

<script>
import { tableMaxHeight } from '@/mixins/tableMaxHeight'
import { downloadBufferFile } from '@/utils'
import { tipsData, accountStatusData, accountStatusEnum, erpSelectList } from './data'
import { queryCustomerVersion, queryByPage, queryVersionStatic } from '@/api/customer/ysMerchantManagement'

export default {
  name: 'ysMerchantManagement',
  mixins: [tableMaxHeight],
  data() {
    return {
      download_url: process.env.VUE_APP_BASE_API + '/youshu/merchant/download',
      tipsData,
      accountStatusData,
      accountStatusEnum,
      erpSelectList,
      currentVersionData: [],
      searchForm: {
        page: 1,
        rows: 10,
        params: {
          shopIdOrName: '',
          loginName: '',
          accountStatus: [],
          versionDetailId: [],
          isAdditional: '',
          erpCodes: [],
          isMicro: '',
          timeQueryType: '1',
          queryStartTime: '',
          queryEndTime: ''
        }
      },
      date: [],
      total: 0,
      tableData: [],
      isLoading: false
    }
  },
  watch: {
    date(val) {
      if (val && val.length > 0) {
        this.searchForm.params.queryStartTime = val[0] + ' 00:00:00'
        this.searchForm.params.queryEndTime = val[1] + ' 23:59:59'
      } else {
        this.searchForm.params.queryStartTime = ''
        this.searchForm.params.queryEndTime = ''
      }
    }
  },
  created() {
    this.getCurrentVersion()
    this.queryVersionStatic()
    this.handleSearch()
  },
  methods: {
    handleSearch() {
      this.searchForm.page = 1
      this.getList()
    },
    async getList() {
      console.log(this.searchForm.page, 'this.searchForm.page')
      this.isLoading = true
      try {
        let res = await queryByPage(this.searchForm)
        this.tableData = res.results || []
        this.total = res.totalRecord
        this.isLoading = false
      } catch {
        this.isLoading = false
      }
    },
    handleReset() {
      this.searchForm = {
        page: 1,
        rows: 10,
        params: {
          shopIdOrName: '',
          loginName: '',
          accountStatus: [],
          versionDetailId: [],
          isAdditional: '',
          erpCodes: [],
          isMicro: '',
          timeQueryType: '1',
          queryStartTime: '',
          queryEndTime: ''
        }
      }
      this.date = []
      this.handleSearch()
    },
    async queryVersionStatic() {
      let res = await queryVersionStatic()
      if (res) {
        this.tipsData.map(e => {
          e.total = res[e.key]
        })
      }
    },
    async getCurrentVersion() {
      let res = await queryCustomerVersion()
      this.currentVersionData = res
    },
    async handleExport() {
      try {
        await downloadBufferFile(this.download_url, this.searchForm, 'POST', 'json', '有数商户')
      } catch (e) {
        this.$message.error('下载出错了')
      }
    },
    handleDeatils(row) {
      this.$router.push({ path: `/customer/merchant/ysMerchantDetails?id=${row.shopAdminId}` })
    }
  }
}
</script>

<style lang="scss" scoped>
.search-box {
  margin-left: -16px;
  margin-right: -16px;
  border-bottom: 16px solid #f7f8fa;
  .km-tips {
    border-radius: 2px;
    min-height: 40px;
    max-height: 40px;
    background: rgba(255, 96, 16, 0.08);
    border: 1px solid rgba(255, 96, 16, 0.4);
    display: flex;
    align-items: center;
    padding: 7px 16px;
    margin: 0 8px 16px 8px;
    .tips-icon {
      width: 16px;
      height: 16px;
      margin-right: 8px;
    }
    .tips-item {
      font-size: 14px;
      color: #3d4966;
      &:not(:last-child) {
        margin-right: 30px;
      }
    }
  }
  .form-botton {
    margin-left: 120px;
  }
  .date-picker {
    ::v-deep {
      .el-input {
        width: 100%;
      }
    }
  }
}
.data-box {
  .e-btn-reason {
    margin-left: 12px;
  }
  .archive-table-oneline {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
</style>
