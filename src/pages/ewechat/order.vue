<template>
  <div>
    <page ref="page" :api="getOrderList" :query-config="queryForm" :list-config="columns" :query-formatter="queryFormatter" :download-api="downloadOrderList">
      <template #table_operation="scope">
        <el-button type="text" @click="toDetail(scope.row)">详情</el-button>
      </template>

      <template #table_goods="scope">
        <div v-for="good in scope.row.goods" :key="good.id">{{ good.name + ' * ' + good.quantity }}</div>
      </template>

      <template #table_orderAmount="scope">
        <template v-if="scope.row.changeAmount === 0">{{ (scope.row.orderAmount / 100).toFixed(2) }}</template>
        <template v-else>
          <div>原价: {{ (scope.row.orderAmount / 100).toFixed(2) }}</div>
          <div>改价: {{ (scope.row.changeAmount / 100).toFixed(2) }}</div>
        </template>
      </template>
    </page>
  </div>
</template>

<script>
import page from './components/page.vue'
import { getOrderList, downloadOrderList } from '@/api/ewechat'

export default {
  components: {
    page
  },
  data() {
    const statusFormatter = row => {
      const statusMap = ['已取消', '待付款', '已付款', '待审核']
      return statusMap[Number(row.orderStatus) + 1]
    }
    return {
      current: {},
      version: '',
      getOrderList,
      downloadOrderList,
      dateCondition: 1,
      priceDialog: false,
      channelDialog: false,
      relateDialog: false,
      columns: [
        { prop: 'index', label: '序号', type: 'index', width: '60px' },
        { prop: 'orderNo', label: '订单编号', width: '230px' },
        { prop: 'corpName', label: '企业名称' },
        { prop: 'channelName', label: '所属渠道' },
        { prop: 'channelAreaAddress', label: '渠道区域' },
        { prop: 'goods', label: '订购服务', slot: true },
        { prop: 'orderSourceStr', label: '来源渠道' },
        { prop: 'orderStatus', label: '订单状态', attrs: { formatter: statusFormatter } },
        { prop: 'orderAmount', label: '订单金额(元)', slot: true },
        { prop: 'updateTime', label: '更新时间', width: '180px' },
        { prop: 'operation', label: '操作', width: '200px', slot: true }
      ],
      queryForm: [
        {
          label: '企业名称',
          prop: 'corpName',
          type: 'input',
          col: 6
        },
        {
          label: '订单编号',
          prop: 'orderNo',
          type: 'input',
          col: 6
        },
        {
          label: '订购服务',
          prop: 'goodsType',
          type: 'select',
          default: -1,
          options: [
            { label: '全部', value: -1 },
            { label: '应用版本', value: 1 },
            { label: '增购服务', value: 2 }
          ],
          col: 6
        },
        {
          label: '订单状态',
          prop: 'status',
          type: 'select',
          default: -2,
          options: [
            { label: '全部', value: -2 },
            { label: '已取消', value: -1 },
            { label: '待付款', value: 0 },
            { label: '已付款', value: 1 },
            { label: '待审核', value: 2 }
          ],
          col: 6
        },
        {
          label: '渠道来源',
          prop: 'orderSource',
          type: 'select',
          default: -1,
          options: [
            { label: '全部', value: -1 },
            { label: 'PC', value: 1 },
            { label: 'H5', value: 2 }
          ],
          col: 6
        },
        {
          label: '更新时间',
          prop: 'dateRange',
          type: 'daterange',
          attrs: { 'value-format': 'yyyy-MM-dd' },
          default: [],
          col: 6
        }
      ]
    }
  },
  methods: {
    queryFormatter(queryFormData) {
      const params = {
        ...queryFormData,
        startTime: queryFormData.dateRange[0] || '',
        endTime: queryFormData.dateRange[1] || ''
      }
      delete params.dateRange
      return params
    },
    toDetail(row) {
      this.$router.push('/orderCenter/orderManagement/ewechatOrderDetail?orderNo=' + row.orderNo)
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
