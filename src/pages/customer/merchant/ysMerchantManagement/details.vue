<template>
  <div v-loading="isLoading" class="container">
    <descriptions title="基础信息" :divide="false">
      <descriptions-item v-for="(item, index) in baseInfoItems" :key="index" :label="item.title">{{ item.value }} </descriptions-item>
    </descriptions>
    <descriptions title="版本信息">
      <descriptions-item v-for="(item, index) in versionsItems" :key="index" :label="item.title">{{ item.value }}</descriptions-item>
    </descriptions>
    <descriptions title="配置功能">
      <el-table :data="tableData" show-summary border :summary-method="getSummaries">
        <el-table-column type="index" label="序号" width="100"> </el-table-column>
        <el-table-column prop="funcCategory" label="模块类别"> </el-table-column>
        <el-table-column prop="funcName" label="模块功能">
          <template slot-scope="{ row }">
            <div>{{ row.funcName }}</div>
            <div v-if="row.needStoreCnt === 1">{{ row.storeCnt }}家</div>
          </template>
        </el-table-column>
        <el-table-column prop="funcValid" label="期限至"> </el-table-column>
        <el-table-column prop="funcAmount" label="功能费用">
          <template slot-scope="scope">
            {{ (scope.row.funcAmount / 100) | toFixedMoneyFilter }}
          </template>
        </el-table-column>
      </el-table>
    </descriptions>
  </div>
</template>

<script>
import Descriptions from '@/components/Descriptions/list'
import DescriptionsItem from '@/components/Descriptions/item'
import { baseInfoItems, versionsItems } from './data'
import { getDetails } from '@/api/customer/ysMerchantManagement'
import { formatNumber } from '@/utils'

export default {
  name: 'ysMerchantDetails',
  components: {
    Descriptions,
    DescriptionsItem
  },
  filters: {
    toFixedMoneyFilter(num) {
      return formatNumber(num, 2)
    }
  },
  data() {
    return {
      isLoading: false,
      baseInfoItems,
      versionsItems,
      tableData: []
    }
  },
  created() {
    this.getDetails()
  },
  methods: {
    async getDetails() {
      this.listLoading = true
      try {
        let allVersion = await getDetails({ shopAdminId: this.$route.query.id })
        this.detailsInfo = allVersion
        this.baseInfoItems = [
          { title: '客户名称', value: allVersion.name },
          { title: '服务到期时间', value: allVersion.validTime },
          { title: '渠道来源', value: allVersion.chName },
          { title: '客户地址', value: allVersion.address },
          { title: 'ERP客户编码', value: allVersion.custId },
          { title: '微平台商户ID', value: allVersion.microCustId || '无' }
        ]

        this.versionsItems = [
          { title: '版本名称', value: allVersion.versionName },
          { title: '期限至', value: allVersion.versionValid },
          { title: '购买状态', value: allVersion.versionStatus === 1 ? '已购买' : '未购买' },
          { title: '版本开通费用', value: formatNumber(allVersion.versionAmount / 100, 2) }
        ]
        this.tableData =
          allVersion.funcList &&
          allVersion.funcList.filter(item => {
            return item.funcStatus === 1
          })
        this.listLoading = false
      } catch {
        this.listLoading = false
        this.tableData = []
      }
    },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        const values = data.map(item => item[column.property])
        if (!values.every(value => isNaN(value))) {
          let temp = values.reduce((prev, curr) => {
            return prev + curr
          })
          sums[index] = (temp / 100).toFixed(2)
        } else {
          sums[index] = '—'
        }
      })
      return sums
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  border-top: 16px solid #f7f8fa;
  background-color: #fff;
  padding: 16px 16px 0;
}
</style>
