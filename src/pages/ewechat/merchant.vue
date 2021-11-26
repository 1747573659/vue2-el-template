<template>
  <div>
    <page
        ref="page"
        :api="getCorpVersionList"
        :query-config="queryForm"
        :list-config="columns"
        :query-formatter="queryFormatter"
        :download-api="downloadVersionList">
        <template #form_label-dateRange>
          <el-select v-model="dateCondition">
            <el-option :value="1" label="开通时间"></el-option>
            <el-option :value="2" label="到期时间"></el-option>
            <el-option :value="3" label="首购时间"></el-option>
          </el-select>
        </template>
      </page>
  </div>
</template>

<script>
import page from './components/page.vue'
import { getAllVersionList,  downloadVersionList, getCorpVersionList } from '@/api/ewechat'
import comTable from './components/table.vue'
import comForm from './components/form.vue'
export default {
  components: {
    page,
  },
  data () {
    const statusFormatter = (row) => {
      const statusMap = ['配置中', '试用中', '试用到期', '付费使用中', '即将到期(30天以内)', '已到期' ]
      return statusMap[row.status]
    }
    const repurchaseFormatter = (row) => {
      return row.repurchase ? '是' : '否'
    }
    return {
      current: {},
      version: '',
      getCorpVersionList,
      downloadVersionList,
      dateCondition: 1,
      versionDialog: false,
      channelDialog: false,
      validDateDialog: false,
      channelList: [],
      activeVersionList: [],
      columns: [
        { prop: 'index', label: '序号', type: 'index' },
        { prop: 'corpName', label: '企业名称' },
        { prop: 'superAdminName', label: '企业管理员' },
        { prop: 'superAdminPhone', label: '管理员手机号' },
        { prop: 'scale', label: '人员规模' },
        { prop: 'industry', label: '行业类型' },
        { prop: 'location', label: '企业地址' },
        { prop: 'versionName', label: '当前版本' },
        { prop: 'status', label: '当前状态', attrs: { formatter: statusFormatter } },
        { prop: 'channelName', label: '所属代理商' },
        { prop: 'openTime', label: '开通时间' },
        { prop: 'expireTime', label: '到期时间' },
        { prop: 'lastLoginTime', label: '最近登录时间' },
      ],
      queryForm: [
        {
          label: '企业名称',
          prop: 'corpName',
          type: 'input',
          col: 6
        },
        {
          label: '企业管理员',
          prop: 'superAdminName',
          type: 'input',
          col: 6
        },
        {
          label: '管理员手机号',
          prop: 'superAdminPhone',
          type: 'input',
          col: 6
        },
        {
          label: '当前版本',
          prop: 'versionId',
          type: 'select',
          default: -1,
          options: [
            { label: '全部', value: -1 }
          ],
          col: 6
        },
        {
          label: '当前状态',
          prop: 'status',
          type: 'select',
          default: -1,
          options: [
            { label: '全部', value: -1 },
            { label: '配置中', value: 0 },
            { label: '试用中', value: 1 },
            { label: '试用到期', value: 2 },
            { label: '付费使用中', value: 3 },
            { label: '即将到期(30天以内)', value: 4 },
            { label: '已到期', value: 5 }
          ],
          col: 6
        },
        {
          prop: 'dateRange',
          type: 'daterange',
          default: [],
          attrs: { 'value-format': 'yyyy-MM-dd' },
          col: 6
        }
      ],
    }
  },
  created () {
    this.getAllVersionList()
  },
  methods: {
    async getAllVersionList () {
      let res = await getAllVersionList({ page: 1, rows: 10000})
      this.queryForm[3].options = this.queryForm[3].options.concat(res.results.map(item =>
        ({ label: item.name, value: item.id })
      ))
    },
    queryFormatter (queryFormData) {
      const params = {
        ...queryFormData,
        dateCondition: this.dateCondition,
        startTime: queryFormData.dateRange ? queryFormData.dateRange[0] : '',
        endTime: queryFormData.dateRange ? queryFormData.dateRange[1] : ''
      }
      return params
    }
  }
}
</script>

<style scoped lang="scss">

.radio-wrapper {
  line-height: 40px;
}

/deep/ {
  .el-select {
    width: 100%;
  }
  .el-date-editor--wrap {
    width: 100%;
    .el-date-editor {
      width: 100%;
    }
  }
}

</style>
