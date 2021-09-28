<template>
  <div class="km-page-block">
    <el-pagination
      v-bind="$attrs"
      v-on="$listeners"
      background
      :current-page="currentPage"
      :page-size="pageSize"
      :page-sizes="pageSizes"
      :total="total"
      :layout="layout"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  props: {
    request: {
      require: true,
      type: Function,
      default: () => {}
    },
    currentPage: {
      require: true,
      type: Number,
      default: 1
    },
    pageSize: {
      require: true,
      type: Number,
      default: 10
    },
    pageSizes: {
      type: Array,
      default: () => [10, 30, 50]
    },
    total: {
      require: true,
      type: Number,
      default: 0
    },
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper'
    }
  },
  methods: {
    handleSizeChange (val) {
      this.$emit('update:pageSize', val)
      this.$emit('update:currentPage', 1)
      this.request()
    },
    handleCurrentChange (val) {
      this.$emit('update:currentPage', val)
      this.request()
    }
  }
}
</script>

<style lang="scss">
.km-page-block {
  padding: 12px 0 15px;
  display: flex;
  justify-content: flex-end;
}
</style>
