import dayjs from 'dayjs'
import NP from 'number-precision'
import { orderStatus, paymentStatus } from '../index'
import { mapActions } from 'vuex'

import { queryByPage, queryBaseInfo, queryOrderMan, exportOrder, exportRecordList, deleteExport } from '@/api/orderCenter/orderManagement'

export const purchaseOrder = {
  data() {
    return {
      orderStatus,
      paymentStatus,
      cueerntAgentId: '',
      ordererData: [],
      isOrdererMaxPage: false,
      tableData: [],
      checkTabLock: false,
      currentPage: 1,
      totalPage: 0,
      pageSize: 10,
      checkExportLoad: false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > dayjs().endOf('day')
        }
      }
    }
  },
  filters: {
    formatAmount(val) {
      return val ? NP.divide(val, 100) : 0
    }
  },
  activated() {
    this.getQueryPage()
  },
  mounted() {
    const StartTime = dayjs().subtract(7, 'days')
    this.form.createTime = [StartTime.format('YYYY-MM-DD 00:00:00'), dayjs().format('YYYY-MM-DD 23:59:59')]
    this.getQueryPage()
    this.getBaseInfo()
  },
  methods: {
    ...mapActions(['delCachedView']),
    handleQueryParams() {
      const { createTime, ...params } = this.form
      return Object.assign(params, {
        from: false,
        orderType: this.$route.name === 'hardwarePurchaseOrder' ? 0 : 1,
        startTime: createTime?.[0] ?? '',
        endTime: createTime?.[1] ?? '',
        page: this.currentPage,
        rows: this.pageSize
      })
    },
    async handleExport() {
      try {
        this.checkExportLoad = true
        await exportOrder(this.handleQueryParams())
        this.$message({ type: 'success', message: '数据文件生成中，请稍后在导出记录中下载' })
      } catch (error) {
      } finally {
        this.checkExportLoad = false
      }
    },
    handleExportRecord: async function({ currentPage, pageSize } = { currentPage: 1, pageSize: 10 }) {
      const { page, rows, ...params } = this.handleQueryParams()
      return await exportRecordList({ ...params, page: currentPage, rows: pageSize })
    },
    handleExportDel: async function(row) {
      return await deleteExport({ id: row.id })
    },
    handleSearch() {
      this.currentPage = 1
      this.getQueryPage()
    },
    async getQueryPage() {
      try {
        this.checkTabLock = true
        const res = await queryByPage(this.handleQueryParams())
        this.tableData = res?.results ?? []
        this.totalPage = res?.totalCount ?? 0
      } catch (error) {
      } finally {
        this.checkTabLock = false
      }
    },
    async handleOrderPage({ query = '', page = 1, row = 10 } = {}) {
      try {
        const res = await queryOrderMan({ id: query, agentId: this.cueerntAgentId, page, rows: row })
        this.ordererData = this.ordererData.concat(res.results || [])
        if (this.ordererData.every(item => item.contactor !== '全部')) {
          this.ordererData = [{ contactor: '全部', id: -1 }].concat(this.ordererData)
        }
        this.isOrdererMaxPage = !res.results || (res.results && res.results.length < 10)
      } catch (error) {}
    },
    async getBaseInfo() {
      try {
        const { agentId = '' } = await queryBaseInfo()
        this.cueerntAgentId = agentId
      } catch (error) {}
    }
  }
}
