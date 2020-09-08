<template>
  <div class="tree-wrap">
    <!-- <div class="tree-left">
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
    </div> -->
    <el-tree
      :data="data"
      show-checkbox
      node-key="id"
      :default-expand-all="false"
      :accordion="true"
      :default-checked-keys="[5]"
      :props="defaultProps">
    </el-tree>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: [{
          id: 1,
          label: '一级 1',
          children: [{
            id: 4,
            label: '二级 1-1',
            children: [{
              id: 9,
              label: '三级 1-1-1'
            }, {
              id: 10,
              label: '三级 1-1-2'
            }]
          }]
        }, {
          id: 2,
          label: '一级 2',
          children: [{
            id: 5,
            label: '二级 2-1'
          }, {
            id: 6,
            label: '二级 2-2'
          }]
        }, {
          id: 3,
          label: '一级 3',
          children: [{
            id: 7,
            label: '二级 3-1'
          }, {
            id: 8,
            label: '二级 3-2'
          }]
        }],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
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
  /deep/.el-tree {
      position: relative;
    /deep/.el-tree-node.is-expanded {
      /deep/.el-tree-node__children {
        position: absolute;
        left: 80px;
        top: 0px
      }
    }
  }
  // height: 320px;
  // width: 496px;
  // display: flex;
  // justify-content: space-between;
  // align-items: center;
  // .tree-left {
  //   width: 360px;
  //   height: 320px;
  //   background: #FFFFFF;
  //   border-radius: 2px;
  //   border: 1px solid #D3DBEB;
  //   .tree-left-top {
  //     padding: 0px 12px;
  //     width: 100%;
  //     height: 32px;
  //     border-bottom: 1px solid #D3DBEB;
  //   }
  //   .tree-left-bot {
  //     .left-bot-first {
  //       border-right: 1px solid #D3DBEB;
  //     }
  //     .left-bot-second {
  //       border-right: 1px solid #D3DBEB;
  //     }
  //     .left-bot-third {}
  //   }
  // }
  // .tree-right {
  //   width: 120px;
  //   height: 320px;
  //   background: #FFFFFF;
  //   border-radius: 2px;
  //   border: 1px solid #D3DBEB;
  //   .tree-right-top {
  //     padding: 0px 12px;
  //     width: 100%;
  //     height: 32px;
  //     border-bottom: 1px solid #D3DBEB;
  //   }
  // }
}
</style>
