<template>
  <el-dialog title="导出记录" :visible.sync="exportVisible" custom-class="p-dialog-order">
    <el-table :data="exportLists" v-loading="exportLock">
      <el-table-column prop="fileName" label="文件名称"></el-table-column>
      <el-table-column prop="createTime" label="导出时间" width="180"></el-table-column>
      <el-table-column label="进度" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.result === 1 ? '生成中' : scope.row.result === 2 ? '已生成' : '失败' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <template v-if="scope.row.result === 2">
            <el-link :href="scope.row.fileCompleteUrl" :underline="false">
              <el-button size="small" type="text">下载</el-button>
            </el-link>
            <el-link :underline="false">
              <el-button size="small" @click="handleExportDel(scope.row)" type="text" class="p-export_del">删除</el-button>
            </el-link>
          </template>
          <span v-else>--</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="p-export-pagination">
      <el-pagination
        background
        @size-change="handleExportSizeChange"
        @current-change="handleExportCurrentChange"
        :page-sizes="[10, 15, 20, 25]"
        :current-page="exportCurrentPage"
        :page-size="exportPageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="exportPageTotal"
      >
      </el-pagination>
    </div>
  </el-dialog>
</template>
<script>
import { xftArchiveExportLog, xftArchiveExportDel } from '@/api/xftArchive'
export default {
  props: {
    exportType: {
      require: true,
      type: Number,
      default: 1
    } // 是否展现
  },
  data() {
    return {
      exportVisible: false, // 是否展现
      exportLock: false, // 加载
      exportLists: [], // 表格
      exportCurrentPage: 1, // 分页相关
      exportPageSize: 10,
      exportPageTotal: 0
    }
  },
  watch: {
    exportVisible: {
      immediate: true,
      handler(value) {
        if (value) {
          this.exportCurrentPage = 1
          this.exportPageSize = 10
          this.handleExportRecord()
        }
      }
    }
  },
  methods: {
    handleExportCurrentChange(val) {
      this.exportCurrentPage = val
      this.handleExportRecord()
    },
    handleExportSizeChange(val) {
      this.exportCurrentPage = 1
      this.exportPageSize = val
      this.handleExportRecord()
    },
    handleExportDel(row) {
      this.$confirm('确定要删除这条导出记录吗？', '删除', {
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            xftArchiveExportDel({ id: row.id })
              .then(() => {
                this.$message({ type: 'success', message: '删除成功' })
                if (!--this.exportLists.length) this.exportCurrentPage = Math.ceil((this.exportPageTotal - 1) / this.exportPageSize) || 1
                this.handleExportRecord()
              })
              .finally(() => {
                instance.confirmButtonLoading = false
                done()
              })
          } else done()
        }
      }).catch(err => {})
    },
    // 查询
    async handleExportRecord() {
      const data = { exportType: this.exportType, page: this.exportCurrentPage, rows: this.exportPageSize }
      try {
        this.exportLock = true
        const res = await xftArchiveExportLog(data)
        this.exportLists = res.results
        this.exportPageTotal = res.totalCount
      } finally {
        this.exportLock = false
      }
    }
  }
}
</script>
<style lang="scss" scoped>
// /deep/ .p-dialog-order {
//   display: flex;
//   flex-direction: column;
//   margin: 0 !important;
//   position: absolute;
//   top: 50%;
//   left: 50%;
//   transform: translate(-50%, -50%);
//   max-height: calc(100% - 30px);
//   max-width: calc(100% - 30px);
//   /deep/ .el-dialog__body {
//     flex: 1;
//     overflow: auto;
//   }
// }
.p-export-pagination {
  text-align: right;
  margin-top: 16px;
}
</style>
