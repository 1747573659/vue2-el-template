<template>
  <el-dialog :title="title" :close-on-click-modal="false" :show-close="false" :close-on-press-escape="false" :visible.sync="dialogVisible" width="800px" center>
    <el-row>
      <el-col :span="20">
        <el-input style="width: 100%" size="small" clearable v-model.trim="seachVal" :placeholder="placeholder"></el-input>
      </el-col>
      <el-col style="text-align: right" :span="4">
        <el-button size="small" @click="handleCurrentChange(1)" :loading="tableLoading" type="primary">查 询</el-button>
      </el-col>
    </el-row>
    <el-table v-loading="tableLoading" ref="singleTable" :data="tableData" style="width: 100%; margin-top: 16px">
      <el-table-column type="index" width="30">
        <template slot-scope="scope">
          <el-radio v-model="selectTableIndex" :label="scope.$index"></el-radio>
        </template>
      </el-table-column>
      <el-table-column v-for="(item, index) of columnS" :key="index" :prop="item.prop" :label="item.label"></el-table-column>
    </el-table>
    <div v-if="tableTotal" class="km-page-block">
      <el-pagination
        small
        :current-page="thisPage"
        :total="tableTotal"
        :page-size="pageSize"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        background
        :page-sizes="[10, 15, 30]"
        layout="prev, pager, next"></el-pagination>
    </div>
    <div slot="footer" style="text-align: center" class="dialog-footer">
      <el-button @click="handleClose" size="small">取 消</el-button>
      <el-button @click="sure" type="primary" size="small">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  watch: {
    dialogVisible: {
      immediate: true,
      handler(value) {
        this.selectTableIndex = ''
        this.seachVal = ''
        this.thisPage = 1
        if (value) {
          this.getTable()
        }
      }
    }
  },
  props: {
    columnS: {
      type: Array,
      default: () => {
        return [
          {
            label: '享钱商户ID',
            prop: 'id'
          },
          {
            label: '享钱商户名称',
            prop: 'companyName'
          }
        ]
      }
    }, //表格渲染的字段和标题
    listApi: {
      require: true,
      type: Function
    },
    title: {
      type: String,
      default: '提示'
    }, // 弹框标题
    placeholder: {
      type: String,
      default: '请输入'
    }, // 提示
    dialogVisible: {
      require: true,
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      tableLoading: false, // 表格加载
      tableTotal: 0, // 表格总页数
      thisPage: 1, // 当前页
      pageSize: 10, // 每页多少条
      selectTableIndex: '', // 选中的索引
      tableData: [],
      seachVal: '' // 搜索值
    }
  },
  methods: {
    sure() {
      if (this.selectTableIndex === '') {
        this.$message.warning('请选择')
        return
      }
      // 返回选中的索引和表格项
      this.$emit('sureVal', {
        index: this.selectTableIndex,
        tableItem: this.tableData[this.selectTableIndex]
      })
      this.handleClose()
    },
    async getTable() {
      this.tableLoading = true
      const res = await this.listApi({
        id: this.seachVal,
        page: this.thisPage,
        rows: this.pageSize
      })
      this.tableLoading = false
      this.tableData = res.results
      this.tableTotal = res.totalCount
    },
    // 分页
    handleSizeChange(val) {
      this.thisPage = 1
      this.pageSize = val
      this.getTable()
    },
    // 分页
    handleCurrentChange(val) {
      this.thisPage = val
      this.getTable()
    },
    handleClose() {
      this.$emit('update:dialogVisible', false)
    }
  }
}
</script>
