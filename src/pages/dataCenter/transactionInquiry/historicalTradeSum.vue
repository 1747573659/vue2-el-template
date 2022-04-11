<template>
  <div class="app-container">
    <el-menu :default-active="activeIndex" class="el-menu-sum" mode="horizontal" @select="handleSelect">
      <el-menu-item index="1">日交易数据</el-menu-item>
      <el-menu-item index="2">月交易数据</el-menu-item>
      <el-menu-item index="3">总交易数据</el-menu-item>
    </el-menu>
    <div v-if="activeIndex === '1'">
      <day-trade-data></day-trade-data>
    </div>
    <div v-if="activeIndex === '2'">
      <month-trade-data></month-trade-data>
    </div>
    <div v-if="activeIndex === '3'">
      <total-trade-data></total-trade-data>
    </div>
  </div>
</template>

<script>
import dayTradeData from './historicalTradeSumComponents/dayTradeData.vue'
import totalTradeData from './historicalTradeSumComponents/totalTradeData.vue'
import monthTradeData from './historicalTradeSumComponents/monthTradeData.vue'

export default {
  name: 'historicalTradeSum',
  components: {
    dayTradeData,
    totalTradeData,
    monthTradeData
  },
  data() {
    return {
      activeIndex: '1'
    }
  },
  computed: {},
  methods: {
    handleSelect(key) {
      this.activeIndex = String(key)
    }
  }
}
</script>

<style lang="scss" scoped>
.el-menu-sum {
  margin-left: -16px;
  margin-right: -16px;
  ::v-deep.el-menu-item {
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #3d4966;
  }
  ::v-deep.el-menu-item.is-active {
    border-bottom: 2px solid #3377ff;
  }
  ::v-deep.el-menu-item.is-active {
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 600;
    color: #1f2e4d;
  }
}
</style>
