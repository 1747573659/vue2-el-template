<template>
  <div class="tree-wrap">
    <div class="tree-left">
      <div class="tree-left-top">
        <el-checkbox :indeterminate="indeterminateVisited" v-model="checkAllVisited" @change="changeAllVisited">访问权限</el-checkbox>
      </div>
      <div class="tree-left-bot">
        <div class="left-bot-first">
          <el-checkbox v-for="(item, index) in list" :key="item.id" :indeterminate="indeterminateVisitedArr[index]" v-model="checkAllVisitedArr[index]" @change="changeAllVisited">访问权限</el-checkbox>
        </div>
        <div class="left-bot-second"></div>
        <div class="left-bot-third"></div>
      </div>
    </div>
    <div class="tree-right">
      <div class="tree-right-top">
        <el-checkbox :indeterminate="indeterminateOperate" v-model="checkAllOperate" @change="changeAllOperate">操作权限</el-checkbox>
      </div>
      <div class="tree-right-bot"></div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [],
      indeterminateVisitedArr: [],
      indeterminateVisited: false,
      checkAllVisitedArr: false,
      indeterminateOperate: false,
      checkAllOperate: false
    }
  },
  methods: {
    changeAllVisited() {},
    changeAllOperate() {}
  }
}
</script>

<style lang="scss" scoped>
.tree-wrap {
  height: 320px;
  width: 496px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .tree-left {
    width: 360px;
    height: 320px;
    background: #FFFFFF;
    border-radius: 2px;
    border: 1px solid #D3DBEB;
    .tree-left-top {
      padding: 0px 12px;
      width: 100%;
      height: 32px;
      border-bottom: 1px solid #D3DBEB;
    }
    .tree-left-bot {
      .left-bot-first {
        border-right: 1px solid #D3DBEB;
      }
      .left-bot-second {
        border-right: 1px solid #D3DBEB;
      }
      .left-bot-third {}
    }
  }
  .tree-right {
    width: 120px;
    height: 320px;
    background: #FFFFFF;
    border-radius: 2px;
    border: 1px solid #D3DBEB;
    .tree-right-top {
      padding: 0px 12px;
      width: 100%;
      height: 32px;
      border-bottom: 1px solid #D3DBEB;
    }
  }
}
</style>
