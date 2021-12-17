<template>
  <section class="p-export-log">
    <el-button size="small" @click="handleExportLists">导出记录</el-button>
    <el-dialog title="导出记录" v-bind="$attrs" v-on="$listeners" :visible.sync="exportVisible" class="p-export-con" custom-class="p-dialog-order">
      <el-table :data="exportData" v-loading="checkExportTabLock">
        <slot name="basicRow">
          <el-table-column prop="fileName" label="文件名称"></el-table-column>
          <el-table-column prop="createTime" label="导出时间" min-width="50"></el-table-column>
        </slot>
        <slot>
          <el-table-column label="进度" width="100">
            <template slot-scope="scope">{{ scope.row.result === 1 ? '生成中' : scope.row.result === 2 ? '已生成' : '失败' }}</template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <template v-if="scope.row.result === 2">
                <el-link :href="scope.row.fileCompleteUrl" :underline="false">
                  <el-button size="small" type="text">下载</el-button>
                </el-link>
                <el-button size="small" @click="handleExportDel(scope.row)" type="text" class="p-export_del">删除</el-button>
              </template>
              <span v-else>--</span>
            </template>
          </el-table-column>
        </slot>
      </el-table>
      <km-pagination :request="handleExportRecord" :current-page.sync="currentPage" :page-size.sync="pageSize" :page-sizes="[10, 15, 20, 25]" :total="totalPage" />
    </el-dialog>
  </section>
</template>

<script>
export default {
  props: {
    requestExportLog: {
      type: Function,
      default: () => {}
    },
    requestExportDel: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      exportData: [],
      exportVisible: false,
      checkExportTabLock: false,
      currentPage: 1,
      pageSize: 10,
      totalPage: 0
    }
  },
  methods: {
    handleExportDel(row) {
      this.$confirm('确定要删除这条导出记录吗？', '删除', {
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            this.requestExportDel(row)
              .then(() => {
                this.$message({ type: 'success', message: '删除成功' })
                if (!--this.exportData.length) this.currentPage = Math.ceil((this.totalPage - 1) / this.pageSize) || 1
                this.handleExportRecord()
              })
              .catch(() => {})
              .finally(() => {
                instance.confirmButtonLoading = false
                done()
              })
          } else done()
        }
      }).catch(() => {})
    },
    handleExportRecord: async function() {
      try {
        this.checkExportTabLock = true
        const res = await this.requestExportLog({ currentPage: this.currentPage, pageSize: this.pageSize })
        this.exportData = res.results
        this.totalPage = res.totalCount
      } catch (e) {
      } finally {
        this.checkExportTabLock = false
      }
    },
    handleExportLists() {
      this.exportData = []
      this.totalPage = 0
      this.handleExportRecord()
      this.exportVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>
.p-export_del {
  margin-left: 8px;
}
.p-export-log {
  display: inline-block;
  margin-left: 12px;
  line-height: 1.5;
}
/deep/ {
  .p-export-con {
    .el-link {
      vertical-align: inherit;
    }
  }
  .p-dialog-order {
    display: flex;
    flex-direction: column;
    margin: 0 !important;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-height: calc(100% - 30px);
    max-width: calc(100% - 30px);
    .el-dialog__body {
      flex: 1;
      overflow: auto;
    }
  }
}
</style>
