<template>
  <div class="app-container">
    <div class="search-box">
        <query-group
          className="all-fr"
          :queryFormList.sync="queryFormList"
          :queryParams="queryParams"
          @search="initData"
        ></query-group>
    </div>
    <div class="data-box">
        <base-table
          :columns="headers"
          :list="list"
          :loading="loading"
          :total="total"
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

export default {
  name: 'validityPeriod',
  mixins: [listMixins],
  components: {
    baseTable,
    queryGroup
  },
  data () {
    return {
      queryFormList: [
        {
          type: 'select',
          name: 'status',
          label: '状态',
          value: '0',
          options: [
            {
              label: '全部',
              value: '0'
            },
            {
              label: '服务中',
              value: '1'
            },
            {
              label: '已过期',
              value: '2'
            }
          ]
        },
        {
          type: 'input',
          name: 'agentId',
          label: '应用信息',
          placeholder: '请输入应用名称',
          value: ''
        }
      ],
      list: [],
      headers: [
        {
          key: 'appName',
          title: '应用名称'
        },
        {
          key: 'charged',
          title: '收费对象'
        },
        {
          key: 'timeLately',
          title: '最近一次授权时间'
        },
        {
          key: 'timeEnd',
          title: '到期时间/剩余配额'
        },
        {
          type: 'operate',
          title: '操作',
          width: '100',
          operates: [
            {
              name: '延期',
              emitKey: 'viewResClick'
            }
          ]
        }
      ]
    }
  },
  methods: {
    initData () {
      console.log('123')
    },
    handleFilter () {
      console.log(1)
    }
  },
  created () {}
}
</script>

<style lang="scss" scoped>
</style>
