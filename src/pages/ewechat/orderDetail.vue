<template>
  <div class="km-container-con">
    <div class="data-box">
      <h5>基本信息</h5>
      <com-form ref="basicInfoForm" :raw-form="basicInfoForm" label-width="100px" label-position="right"></com-form>

      <h5>应用详情</h5>
      <com-table ref="table" :source="list" :columns="columns" :loading="false" :has-pagination="false" :summary-method="getSummaries" show-summary>
        <template #amount="scope">
          <div>¥ {{ scope.row.amount / 100 }}</div>
        </template>
      </com-table>
      <div class="pay">
        应付: <span>¥{{ orderAmount / 100 }}</span>
      </div>

      <template v-if="contractList.length && contractList[0].status !== 0">
        <h5>合同信息</h5>
        <com-table :source="contractList" :columns="contractColumns" :loading="false" :has-pagination="false">
          <template #operation="scope">
            <el-button type="text" @click="downloadContract(scope.row)">下载</el-button>
          </template>
        </com-table>
      </template>
    </div>
  </div>
</template>

<script>
import comTable from './components/table.vue'
import comForm from './components/form.vue'
import { getOrderDetail, getDownloadUrl } from '@/api/ewechat'
import downloadForURL from '@/utils/modules/download'
export default {
  components: {
    comTable,
    comForm
  },
  data() {
    const totalAmountFormatter = row => {
      return row.totalAmount / 100
    }

    const contractStatusFormatter = row => {
      const statusMap = ['待签约', '签约完成']
      return statusMap[Number(row.status)]
    }

    return {
      list: [],
      columns: [
        { prop: 'order', type: 'index', label: '序号', width: '60px' },
        { prop: 'name', label: '订购服务' },
        { prop: 'amount', label: '售价', slot: true },
        { prop: 'quantity', label: '数量' },
        { prop: 'totalAmount', label: '小计(元)', width: '150px', attrs: { formatter: totalAmountFormatter } }
      ],
      contractList: [],
      contractColumns: [
        { prop: 'contractNo', label: '合同编号' },
        { prop: 'status', label: '状态', attrs: { formatter: contractStatusFormatter } },
        { prop: 'updateTime', label: '更新时间' },
        { prop: 'operation', label: '详情', slot: true }
      ],
      basicInfoForm: [
        {
          label: '订单编号',
          prop: 'orderNo',
          type: 'text',
          col: 8
        },
        {
          label: '订单时间',
          prop: 'orderTime',
          type: 'text',
          col: 8
        },
        {
          label: '状态',
          prop: 'orderStatus',
          type: 'text',
          col: 8
        },
        {
          label: '企业名称',
          prop: 'corpName',
          type: 'text',
          col: 8
        },
        {
          label: '渠道来源',
          prop: 'orderSource',
          type: 'text',
          col: 8
        },
        {
          label: '签约状态',
          prop: 'contractStatus',
          type: 'text',
          col: 8
        }
      ],
      orderAmount: 0
    }
  },
  created() {
    this.getOrderDetail()
  },
  methods: {
    async downloadContract(row) {
      const res = await getDownloadUrl({ orderNo: this.$route.query.orderNo })
      downloadForURL(res, `电子合同-${row.corpName}`)
    },

    async getOrderDetail() {
      let statuses = ['已取消', '待付款', '已付款', '待审核']
      let orderSources = ['', 'PC', 'H5']
      let res = await getOrderDetail({ orderNo: this.$route.query.orderNo })
      res.orderStatus = statuses[res.orderStatus + 1]
      res.orderSource = orderSources[res.orderSource]
      res.corpName = res.corpName || res.wxCorpId
      if (res.contract) {
        this.contractList = [res.contract]
        res.contractStatus = ['待签约', '签约完成'][res.contract.status]
      }
      this.list = res.goods
      this.$refs.basicInfoForm.setData(res)
      this.orderAmount = res.changeAmount ? res.changeAmount : res.orderAmount
    },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (column.property === 'totalAmount') {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          sums[index] = sums[index] / 100
        } else {
          sums[index] = ''
        }
      })
      return sums
    }
  }
}
</script>

<style scoped lang="scss">
.pay {
  line-height: 80px;
  font-size: 18px;
  text-align: right;
  letter-spacing: 4px;
  span {
    color: red;
  }
}

h5 {
  display: block;
  font-size: 0.83em;
  margin-block-start: 1.67em;
  margin-block-end: 1.67em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  font-weight: bold;
}
</style>
