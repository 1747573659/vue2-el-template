<template>
  <el-dialog :visible.sync="visibleInner" :before-close="handleAuditStatus" :close-on-click-modal="false" title="系统提示" width="800px" class="xq-dialog">
    <div class="xdd_tip">以下商户没有进行享钱交易，将影响转正（数据截止到昨天）</div>
    <el-table v-loading="tableLoading" :data="tableData" style="width: 100%" max-height="400px" v-loadmore="loadMore">
      <el-table-column prop="custId" label="软注编码"></el-table-column>
      <el-table-column prop="custName" label="软注商户"></el-table-column>
      <el-table-column prop="xqUsedStatus" label="享钱开通状态" width="120px">
        <template slot-scope="scope">
          <div v-if="scope.row.xqUsedStatus === 1">未配置</div>
          <div v-if="scope.row.xqUsedStatus === 2">未交易</div>
          <div v-if="scope.row.xqUsedStatus === 3">未识别</div>
        </template>
      </el-table-column>
    </el-table>
    <template slot="footer">
      <el-button @click="handleAuditStatus" size="small">知道了</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
export default {
  props: ['visible'],
  directives: {
    loadmore: {
      // 指令的定义
      bind: function(el, binding) {
        // 获取km-ui定义好的scroll盒子
        const SELECTWRAP_DOM = el.querySelector('.el-table__body-wrapper')
        SELECTWRAP_DOM.addEventListener('scroll', function() {
          const CONDITION = this.scrollHeight - this.scrollTop <= this.clientHeight
          if (CONDITION) {
            binding.value()
          }
        })
      }
    }
  },
  computed: {
    ...mapGetters({
      tableData: 'nonactivatedXqList'
    }),
    visibleInner: {
      get () {
        return this.visible
      },
      set (value) {
        this.$emit('update:visible', value)
      }
    }
  }, 
  data() {
    return {
      tableLoading: false
    }
  },
  mounted() {
  },
  methods: {
    ...mapMutations({
      setNonactivatedXq: 'SET_NONACTIVATEDXQ'
    }),
    ...mapActions(['authShopPageMethodAction']),
    handleAuditStatus () {
      this.setNonactivatedXq(false)
    },
    loadMore () {
      this.authShopPageMethodAction()
    }
  }
}
</script>

<style lang="scss" scoped>
.xq-dialog {
  /deep/.el-dialog__body {
    padding: 10px 20px 10px;
    .xdd_tip {
      padding-bottom: 10px;
      background: #e5edfd;
      border: 1px solid #a6c4fe;
      padding: 8px 10px;
      margin-bottom: 20px;
      color: #3d4966;
      font-size: 14px;
    }
  }
  /deep/.el-dialog__footer {
    display: flex;
    justify-content: center;
  }
}
</style>