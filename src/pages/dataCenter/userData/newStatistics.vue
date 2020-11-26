<template>
  <div class="app-container">
    <div class="search-box">
      <div class="xdd_tip"><i class="el-icon-info"></i>单次查询月份的最长跨度为6个月</div>
      <query-group className="xdd-btn-block__w240" :queryFormList.sync="queryFormList" :queryParams="queryParams" @search="handleFilter" :timeinterval="6">
        <template v-slot:formfooter>
          <el-form-item label="代理商：">
            <select-page
              :isNeedinitId="true"
              :request="queryAgentPage"
              :bvalue.sync="tableParam.userId"
              :name="'name'"
              searchName="id"
              id="userId"
              :width="'240px'"
              :placeholder="'代理商名称'"
            >
            </select-page>
          </el-form-item>
          <el-form-item label="上级代理商：">
            <select-page
              :isNeedinitId="true"
              :request="queryAgentPage"
              :bvalue.sync="tableParam.topAgentUser"
              :name="'name'"
              searchName="id"
              id="userId"
              :width="'240px'"
              :placeholder="'上级代理商名称'"
            >
            </select-page>
          </el-form-item>
        </template>
      </query-group>
    </div>
    <div class="data-box" v-loading="loading">
      <el-row>
        <el-col :span="6" class="sum-card-item">
          <div class="sum-card">
            <div class="sum-card-title">新增商户数</div>
            <div class="sum-card-money">{{ shopNew }}</div>
          </div>
        </el-col>
        <el-col :span="6" class="sum-card-item">
          <div class="sum-card">
            <div class="sum-card-title">商户总数</div>
            <div class="sum-card-money">{{ shopTotal }}</div>
          </div>
        </el-col>
        <el-col :span="6" class="sum-card-item">
          <div class="sum-card">
            <div class="sum-card-title">新增门店数</div>
            <div class="sum-card-money">{{ storeNew }}</div>
          </div>
        </el-col>
        <el-col :span="6" class="sum-card-item">
          <div class="sum-card">
            <div class="sum-card-title">门店总数</div>
            <div class="sum-card-money">{{ storeTotal }}</div>
          </div>
        </el-col>
      </el-row>
      <base-table
        :columns="headers"
        :list="list"
        :total="total"
        @getList="handleFilter(queryParams)"
        :page.sync="tableParam.page"
        :rows.sync="tableParam.rows"
      ></base-table>
    </div>
  </div>
</template>
<script>
import listMixins from '@/mixins/tableList'
import baseTable from '@/components/baseTable'
import queryGroup from '@/components/queryGroup'
import { queryAgentPageNew } from '@/api/customer/agent'
import { userdataCount } from '@/api/dataCenter/userData.js'
import selectPage from '@/components/selectPage2/index.vue'
import { downloadBufferFile } from '@/utils'
import moment from 'moment'
const DOWNLOAD_URL = process.env.VUE_APP_BASE_API

export default {
  name: 'newStatistics',
  mixins: [listMixins],
  components: {
    selectPage,
    baseTable,
    queryGroup
  },
  data() {
    return {
      queryFormList: [
        {
          type: 'daterange',
          name: 'time',
          label: '日期：',
          placeholder: '请选择日期',
          value: [
            moment()
              .subtract(7, 'days')
              .format('YYYY-MM-DD'),
            moment()
              .subtract(1, 'days')
              .format('YYYY-MM-DD')
          ]
        }
      ],
      list: [],
      shopNew: 0,
      shopTotal: 0,
      storeNew: 0,
      storeTotal: 0,
      loading: false,
      tableParam: {
        page: 1,
        rows: 10,
        userId: '',
        topAgentUser: '',
        startTime: '',
        endTime: ''
      },
      total: 0,
      headers: [
        {
          type: 'index',
          title: '序号'
        },
        {
          key: 'agentName',
          title: '代理商名称'
        },
        {
          key: 'shopNew',
          title: '新增商户数'
        },
        {
          key: 'shopTotal',
          title: '商户总数'
        },
        {
          key: 'storeNew',
          title: '新增门店数'
        },
        {
          key: 'storeTotal',
          title: '门店总数'
        },
        {
          key: 'topAgentName',
          title: '上级代理商'
        }
      ]
    }
  },
  methods: {
    handleFilter(e) {
      this.loading = true
      let data = Object.assign(this.tableParam, e)
      userdataCount(data)
        .then(res => {
          this.list = res.results || []
          this.shopNew = res?.shopNew ?? 0
          this.shopTotal = res?.shopTotal ?? 0
          this.storeNew = res?.storeNew ?? 0
          this.storeTotal = res?.storeTotal ?? 0
          this.total = res.totalCount || 0
        })
        .finally(() => {
          this.loading = false
        })
    },
    queryAgentPage(e) {
      return queryAgentPageNew(e)
    }
  },
  mounted() {
    this.handleFilter()
  }
}
</script>
<style lang="scss" scoped>
/deep/.xdd-btn-block__w240 {
  position: relative;
  left: -37px;
}
.xdd_tip {
  background: #e5edfd;
  border: 1px solid #a6c4fe;
  padding: 8px 30px;
  margin-bottom: 20px;
  color: #3d4966;
  font-size: 14px;
}
.xdd_tip i {
  color: #3377ff;
}

.sum-card-item {
  padding: 0 8px;
  margin-bottom: 20px;
  .sum-card {
    height: 108px;
    border-radius: 4px;
    border: 1px solid #e6e9f0;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    .sum-card-title {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #3d4966;
      margin-bottom: 3px;
    }
    .sum-card-money {
      margin-top: 3px;
      font-size: 30px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #1f2e4d;
    }
  }
}
.sum-card-item:first-child {
  padding-left: 0;
}
.sum-card-item:last-child {
  padding-right: 0;
}
</style>
