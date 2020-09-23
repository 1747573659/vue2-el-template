<!--
 * @Author: wuhao
 * @Date: 2019-03-26 10:05:10
 * @LastEditors: wuhao
 * @LastEditTime: 2019-04-15 15:04:24
 * @Description: 封装el-table
 -->

<template>
  <div class="base-table-container">
    <el-row>
      <el-col :span="24">
        <el-table v-loading="loading" :data="list" @selection-change="handleSelectionChange" v-bind="$attrs">
          <!--   -->
          <template v-for="(column, index) in columns">
            <!-- 复选框 -->
            <el-table-column
              :key="index"
              v-if="column.type === 'selection'"
              type="selection"
              width="55"
            ></el-table-column>
            <!-- 序号 -->
            <el-table-column
              :key="index"
              v-else-if="column.type === 'index'"
              type="index"
              :index="continuousIndex"
              width="60"
              label="序号"
            ></el-table-column>
            <!-- 具体内容 -->
            <el-table-column
              :key="index"
              v-else
              :align="column.position"
              :label="column.title"
              :width="column.width"
              :show-overflow-tooltip="column.showOverflowTooltip"
            >
              <template slot-scope="scope">
                <!-- 仅仅显示文字 -->
                <label v-if="!column.hidden">
                  <!-- 如果hidden为true的时候 那么当前格可以不显示，可以选择显示自定义的slot-->
                  <!-- 操作按钮 -->
                  <label v-if="column.type === 'operate'">
                    <template v-for="(operate, index) in column.operates">
                      <el-button
                        :key="index"
                        v-if="
                          operate.escape && operate.escape(scope.row).isShow !== undefined
                            ? operate.escape(scope.row).isShow
                            : true
                        "
                        :disabled="(operate.escape && operate.escape(scope.row).disabled) || false"
                        @click="handleClick(operate, scope.row)"
                        type="text"
                        size="small"
                        >{{ (operate.escape && operate.escape(scope.row).text) || operate.name }}</el-button
                      >
                    </template>
                  </label>
                  <!-- 文字内容 可转码 -->
                  <span v-else>{{ (column.escape && column.escape(scope.row)) || scope.row[column.key] }}</span>
                </label>
                <!-- 使用slot的情况下 -->
                <label v-if="column.slot">
                  <!-- 具名slot -->
                  <slot v-if="column.slot" :name="column.slot" :scope="scope"></slot>
                </label>
              </template>
            </el-table-column>
          </template>
          <!--默认的slot -->
          <slot></slot>
        </el-table>
        <pagination
          v-if="paginationShow"
          v-show="total > 0"
          :total="total"
          :page.sync="currentPage"
          :limit.sync="pageSizes"
          :auto-scroll="false"
          position="right"
          @pagination="getList"
        ></pagination>
      </el-col>
    </el-row>
  </div>
</template>

<script>
/**
 * @author wuhao
 * @todo 项目中使用表格分页
 * @property
 * list => 表格数据
 * columns: [ ==> 配置表格头
 *  key: => 渲染字段名称
 *  title: => 表头名称
 *  operates： => 操作数组 [
 *      name: 名称
 *      emitKey: 要emit出去的事件
 *  ]
 * ]
 * demo columns
 * headers: [
        { type: 'selection'},
        { type: 'index'},
        { key: 'loginName', title: 'XXX'，escape: row => { return row.state == 0? "发送": "已领取"} },   <!-- escape字段可写转码函数 -->
        { key: 'userName', title: 'XXX' },
        { key: 'roleName', title: 'XXX', hidden: true, slot: 'roleSlot' },
        { key: 'createDate', title: 'XXX' },
        // operate 这一行可以选择直接使用slot或者是使用配置项
        { type: 'operate', title: 'XXX',
          operates: [
            { name: 'XXX', emitKey: 'reset' },
            { name: 'XXX', emitKey: 'edit' },
            { name: 'XXX', emitKey: 'delete' }
        ] }
      ]
 */

import Pagination from '@/components/Pagination'

export default {
  components: { Pagination },
  props: {
    // 核心数据
    list: {
      type: Array,
      default: () => []
    },
    // columns
    columns: {
      type: Array,
      required: true,
      default: () => []
    },
    paginationShow: {
      type: Boolean,
      default: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    total: {
      type: Number,
      default: 0
    },
    page: {
      type: Number,
      default: 0
    },
    rows: {
      type: Number,
      default: 0
    }
  },
  computed: {
    currentPage: {
      get () {
        return this.page
      },
      set (val) {
        this.$emit('update:page', val)
      }
    },
    pageSizes: {
      get () {
        return this.rows
      },
      set (val) {
        this.$emit('update:rows', val)
      }
    }
  },
  methods: {
    // 让index序号连续
    continuousIndex (index) {
      return index + (this.currentPage - 1) * this.pageSizes + 1
    },
    // 页码变化触发获取数据
    getList (obj) {
      this.$emit('getList', obj)
    },
    // 处理点击事件
    handleClick (action, data) {
      // emit事件
      this.$emit(`${action.emitKey}`, data)
    },
    // 选中变化
    handleSelectionChange (val) {
      this.$emit('changeSelect', val)
    }
  }
}
</script>

<style scoped lang="scss">
</style>
