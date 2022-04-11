<template>
  <div class="table">
    <div ref="tableWrapper" class="table-wrap">
      <el-table ref="table" :data="source" v-loading="loading" style="width: 100%" v-bind="$attrs" v-on="$listeners">
        <template v-for="(column, index) in columns">
          <el-table-column v-if="column.slot" :key="index" :prop="column.prop" :label="column.label" :width="column.width || 'auto'" v-bind="column.attrs || {}">
            <template slot-scope="scope">
              <slot :name="column.prop" :row="scope.row" v-if="!isInPage"></slot>
              <render-slot :ctx="page" :name="column.prop" slot-type="table" :row="scope.row" v-if="isInPage"></render-slot>
            </template>
          </el-table-column>
          <el-table-column
            v-else
            :key="column.prop"
            :prop="column.prop"
            :label="column.label"
            :type="column.type || ''"
            :width="column.width || 'auto'"
            v-bind="column.attrs || {}" />
        </template>
      </el-table>
    </div>
    <div v-if="hasPagination" class="pagination-wrapper">
      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :current-page.sync="currentPage"
        @size-change="handleSizeChange"
        :page-size="size"
        :total="total"
        :page-sizes="[10, 30, 50]"
        @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script>
import renderSlot from './render-slot.vue'
export default {
  components: {
    renderSlot
  },
  props: {
    isInPage: {
      type: Boolean,
      default: false
    },
    columns: {
      type: Array,
      default: () => []
    },
    source: {
      type: Array,
      default: () => []
    },
    total: {
      type: Number,
      default: 0
    },
    size: {
      type: Number,
      default: 10
    },
    hasPagination: {
      type: Boolean,
      default: true
    },
    loading: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      currentPage: 1
    }
  },
  inject: {
    page: {
      default: {}
    }
  },
  mounted() {
    for (const key in this.$refs.table) {
      if (!(key in this) && typeof this.$refs.table[key] === 'function') {
        this[key] = this.$refs.table[key].bind(this.$refs.table)
      }
    }
  },
  methods: {
    handleSizeChange(val) {
      this.size = val
      this.$emit('size-change', val)
    },
    handleCurrentChange() {
      this.$emit('page-change', this.currentPage)
    }
  }
}
</script>

<style lang="scss" scoped>
.pagination-wrapper {
  text-align: right;
  margin-top: 60px;
}
</style>
