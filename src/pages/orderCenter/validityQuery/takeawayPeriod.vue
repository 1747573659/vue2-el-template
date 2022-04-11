<template>
  <div class="app-container">
    <el-menu :default-active="activeTab" class="el-menu-sum" mode="horizontal" @select="handleClick">
      <el-menu-item index="1">商户授权模式</el-menu-item>
      <el-menu-item index="2">门店授权模式</el-menu-item>
    </el-menu>
    <div class="search-box">
      <query-group className="xdd-btn-block__w240" :queryFormList.sync="queryFormList" :queryParams="queryParams" @search="e => handleFilter(e, 'isSearch')">
        <!-- ↑↑↑ 上一个人的代码写的太难改了，我只能这样改，写成这样并不是我本意 -->
        <template v-slot:formheader>
          <el-form-item label="商户">
            <select-page
              v-if="activeTab === '2'"
              :request="queryMerchantAdminPage"
              :bvalue.sync="tableParam.userId"
              :name="'companyName'"
              searchName="id"
              :width="'240px'"
              id="userId"
              :placeholder="'商户名称'">
            </select-page>
            <select-page
              v-else
              :request="queryMerchantAdminPage"
              :bvalue.sync="tableParam.merchantAdminId"
              :name="'companyName'"
              searchName="id"
              :width="'240px'"
              id="id"
              :placeholder="'商户名称'">
            </select-page>
          </el-form-item>
        </template>
        <template v-slot:formfoot>
          <el-button v-permission.page="'ACCOUNT_ROLE_ADD,ORDERCENTER_VALIDITYQUERY_TAKEAWAYPERIOD_EXPORT'" size="small" @click="wmdownloadExcel">导出</el-button>
        </template>
      </query-group>
    </div>
    <div class="data-box">
      <base-table
        :columns="headers"
        :list="list"
        :loading="loading"
        :total="total"
        @getList="handleFilter(queryParams)"
        :page.sync="tableParam.page"
        :rows.sync="tableParam.rows"></base-table>
    </div>
  </div>
</template>

<script>
import listMixins from '@/mixins/tableList'
import baseTable from '@/components/baseTable'
import queryGroup from '@/components/queryGroup'
import { queryMerchantAdminPage } from '@/api/transtionManagement'
import { queryWmTermPage, queryWmWhitePage } from '@/api/orderCenter'
import selectPage from '@/components/selectPage2/index.vue'
import { downloadBufferFile } from '@/utils'
const DOWNLOAD_URL = process.env.VUE_APP_BASE_API
export default {
  name: 'takeawayPeriod',
  mixins: [listMixins],
  components: {
    selectPage,
    baseTable,
    queryGroup
  },
  data() {
    return {
      activeTab: '1',
      queryFormList: [
        {
          type: 'select',
          name: 'appStatus',
          label: '状态',
          value: '',
          options: [
            {
              label: '全部',
              value: ''
            },
            {
              label: '有效',
              value: '1'
            },
            {
              label: '已过期',
              value: '-1'
            }
          ]
        }
      ],
      list: [],
      loading: false,
      tableParam: {},
      tableParam1: {
        page: 1,
        rows: 10,
        merchantAdminId: ''
      },
      tableParam2: {
        page: 1,
        rows: 10,
        userId: ''
      },
      total: 0,
      headers: [],
      headers2: [
        {
          key: 'shopName',
          title: '商户',
          escape: row => {
            return '[' + row.shopId + ']' + row.shopName
          }
        },
        {
          key: 'storeName',
          title: '门店',
          escape: row => {
            return (row.merchantName ? row.merchantName : '') + '(' + row.storeName + ')'
          }
        },
        {
          key: 'appStatus',
          title: '状态',
          escape: row => {
            let str = ''
            switch (row.appStatus) {
              case 1:
                str = '有效'
                break
              case 2:
                str = '快到期'
                break
              case -1:
                str = '已过期'
                break
              default:
                str = '--'
                break
            }
            return str
          }
        },
        {
          key: 'quotaType',
          title: '收费类型',
          escape: row => {
            let str = ''
            switch (row.quotaType) {
              case 1:
                str = '试用'
                break
              case 2:
                str = '按年收费'
                break
              case 3:
                str = '按单收费'
                break
              default:
                str = '--'
                break
            }
            return str
          }
        },
        {
          key: 'buyTime',
          title: '开通日期'
        },
        {
          key: 'expireTime',
          title: '到期日期'
        }
      ],
      headers1: [
        {
          key: 'shopName',
          title: '商户',
          escape: row => {
            return '[' + row.shopId + ']' + row.shopName
          }
        },
        {
          key: 'appStatus',
          title: '状态',
          escape: row => {
            let str = ''
            switch (row.appStatus) {
              case 1:
                str = '有效'
                break
              case 2:
                str = '快到期'
                break
              case -1:
                str = '已过期'
                break
              default:
                str = '--'
                break
            }
            return str
          }
        },
        {
          key: 'quotaType',
          title: '收费类型',
          escape: row => {
            let str = ''
            switch (row.quotaType) {
              case 1:
                str = '试用'
                break
              case 2:
                str = '按年收费'
                break
              case 3:
                str = '按单收费'
                break
              default:
                str = '--'
                break
            }
            return str
          }
        },
        {
          key: 'buyTime',
          title: '开通日期'
        },
        {
          key: 'expireTime',
          title: '到期日期'
        }
      ]
    }
  },
  computed: {
    tableMaxHeight() {
      return document.documentElement.clientHeight - 56 - 48 - 172.5 - 32 - 116
    }
  },
  methods: {
    handleClick(key) {
      this.activeTab = String(key)
      if (this.activeTab === '1') {
        this.headers = this.headers1
        this.tableParam = this.tableParam1
        this.queryFormList = [
          {
            type: 'select',
            name: 'appStatus',
            label: '状态',
            value: '',
            options: [
              {
                label: '全部',
                value: ''
              },
              {
                label: '有效',
                value: '1'
              },
              {
                label: '已过期',
                value: '-1'
              }
            ]
          }
        ]
      } else {
        this.headers = this.headers2
        this.tableParam = this.tableParam2
        this.queryFormList = [
          {
            type: 'select',
            name: 'appStatus',
            label: '状态',
            value: '',
            options: [
              {
                label: '全部',
                value: ''
              },
              {
                label: '有效',
                value: '1'
              },
              {
                label: '快到期',
                value: '2'
              },
              {
                label: '已过期',
                value: '-1'
              }
            ]
          }
        ]
      }
      this.handleFilter()
    },
    handleFilter(e, type) {
      this.loading = true
      if (type === 'isSearch') {
        this.tableParam.page = 1
      }
      if (this.activeTab === '1') {
        let data = Object.assign(this.tableParam, e)
        queryWmWhitePage(data)
          .then(res => {
            this.list = res.results || []
            this.total = res.totalCount || 0
          })
          .finally(() => {
            this.loading = false
          })
      } else {
        let data = Object.assign(this.tableParam, e)
        queryWmTermPage(data)
          .then(res => {
            this.list = res.results || []
            this.total = res.totalCount || 0
          })
          .finally(() => {
            this.loading = false
          })
      }
    },
    wmdownloadExcel() {
      let data = Object.assign(this.tableParam, this.queryParams)
      if (this.activeTab === '1') {
        downloadBufferFile(DOWNLOAD_URL + '/wm/downloadWmWhiteExcel', data, 'POST', 'json')
      } else {
        downloadBufferFile(DOWNLOAD_URL + '/wm/downloadExcel', data, 'POST', 'json')
      }
    },
    queryMerchantAdminPage(e) {
      return queryMerchantAdminPage(e)
    }
  },
  created() {
    this.tableParam = this.tableParam1
    this.headers = this.headers1
  },
  mounted() {
    this.handleFilter()
  }
}
</script>

<style lang="scss" scoped>
.search-box {
  margin-left: -16px;
  margin-right: -16px;
  border-bottom: 16px solid #f7f8fa;
}
::v-deep.xdd-btn-block__w240 {
  position: relative;
  left: -53px;
}
.tp-tabs {
  ::v-deep.el-tabs__header {
    padding: 10px 24px;
    background-color: #ffffff;
  }
  ::v-deep.el-tabs__item.is-active {
    color: #3377ff !important;
  }
  ::v-deep.el-tabs__active-bar {
    background-color: #3377ff;
  }
  ::v-deep.el-tabs__item:hover {
    color: #3b83ff !important;
  }
}
.el-menu-sum {
  margin-left: -16px;
  margin-right: -16px;
  ::v-deep.el-menu-item {
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #3d4966;
  }
  ::v-deep.el-menu-item.is-active {
    border-bottom: 2px solid #3377ff;
  }
  ::v-deep.el-menu-item.is-active {
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 600;
    color: #1f2e4d;
  }
}
</style>
