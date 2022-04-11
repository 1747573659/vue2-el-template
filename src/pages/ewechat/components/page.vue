<template>
  <div class="km-container-con">
    <div class="search-box">
      <com-form ref="queryForm" :raw-form="queryConfig" label-width="110px" label-position="right" :is-in-page="true">
        <el-col :span="8" slot="buttons" style="padding-left: 0; padding-right: 0">
          <el-form-item label-width="110px">
            <el-button size="small" type="primary" @click="query" :loading="queryLoading">查询</el-button>
            <el-button size="small" plain @click="reset" :loading="resetLoading">重置</el-button>
            <el-button size="small" @click="exportExcel">导出</el-button>
            <slot name="btn"></slot>
          </el-form-item>
        </el-col>
      </com-form>
    </div>
    <div class="data-box">
      <com-table
        ref="table"
        :source="list"
        :columns="listConfig"
        :size="size"
        :page="page"
        :total="total"
        :loading="tableLoading"
        :is-in-page="true"
        @page-change="onPageChange"
        @size-change="onSizeChange">
      </com-table>
    </div>
  </div>
</template>

<script>
// page 组件思路
/**
 * queryConfig: 查询配置
 * queryFormatter: 查询前的格式化参数, 将使用这个函数的返回值去查询列表
 * listConfig: 列表配置
 * api: 查询的接口函数
 * slot: btn
 */
import comTable from '../components/table.vue'
import comForm from '../components/form.vue'
import { downloadBufferFile } from '@/utils/index'
const DOWNLOAD_URL = process.env.VUE_APP_BASE_API
const defaultQueryFormatter = args => {
  return args
}

const noop = () => void 0

export default {
  components: {
    comTable,
    comForm
  },
  props: {
    queryConfig: {
      type: Array,
      default: () => []
    },
    listConfig: {
      type: Array,
      default: () => []
    },
    api: {
      type: Function,
      default: noop
    },
    downloadApi: {
      type: String,
      default: ''
    },
    queryFormatter: {
      type: Function,
      default: () => defaultQueryFormatter
    }
  },
  data() {
    return {
      page: 1,
      size: 10,
      total: 0,
      list: [],
      resetLoading: false,
      queryLoading: false,
      tableLoading: false
    }
  },
  provide() {
    return {
      page: this
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    async getList() {
      try {
        this.tableLoading = true
        const queryFormData = this.$refs.queryForm.form
        const params = this.queryFormatter(queryFormData)
        const res = await this.api({
          page: this.page,
          rows: this.size,
          params
        })
        this.tableLoading = false
        this.list = res.results || []
        this.total = res.totalRecord
      } catch (e) {
        this.tableLoading = false
      }
    },
    async query() {
      this.queryLoading = true
      await this.getList()
      this.queryLoading = false
    },
    async reset() {
      this.resetLoading = true
      this.$refs.queryForm.reset()
      await this.getList()
      this.resetLoading = false
    },
    onSizeChange(size) {
      this.page = 1
      this.size = size
      this.getList()
    },
    onPageChange(page) {
      this.page = page
      this.getList()
    },
    async exportExcel() {
      const queryFormData = this.$refs.queryForm.form
      const params = this.queryFormatter(queryFormData)
      try {
        await downloadBufferFile(DOWNLOAD_URL + this.downloadApi, { isExport: true, params }, 'POST', 'json')
      } catch (e) {
        this.$message.error('下载出错了')
      }
    }
  }
}
</script>

<style scoped lang="scss">
.search-box {
  margin-left: -16px;
  margin-right: -16px;
  border-bottom: 16px solid #f7f8fa;
}
::v-deep {
  .el-select {
    width: 240px;
  }
  .el-date-editor--wrap {
    width: 100%;
    .el-date-editor {
      width: 100%;
    }
  }
}
</style>
