<template>
  <section ref="tagMenu" class="p-tags_con">
    <div class="p-tabs-con">
      <el-tabs :value="current" class="e-tags-con" type="card" @tab-click="handleTabClick" @tab-remove="handleTabRemove">
        <el-tab-pane v-for="item in tagViews" :key="item.fullPath" :closable="isTabClosable(item)" :label="item.title" :name="item.fullPath"></el-tab-pane>
      </el-tabs>
    </div>
    <el-dropdown class="e-tags-dropdown" @command="handleCloseAllTab" v-if="tagViews.length > 1">
      <span class="el-dropdown-link">
        <i class="el-icon-arrow-down"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>关闭全部</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  data() {
    return {
      current: ''
    }
  },
  watch: {
    $route(newVal) {
      this.handleTagViews()
      this.current = newVal.fullPath
    }
  },
  computed: {
    ...mapGetters(['tagViews', 'cachedViews'])
  },
  mounted() {
    this.handleTagViews()
    this.current = this.$route.fullPath
  },
  methods: {
    ...mapActions(['setTagViews', 'setCachedViews', 'closeTagView', 'delAllTagView']),
    handleCloseAllTab() {
      this.delAllTagView()
      this.current = '/home'
      this.$router.push({ name: 'home' })
    },
    /**
     * @description 接收 tab 标签的点击事件
     * @param {Object} tab 当前点击标签
     * */
    handleTabClick(tab) {
      const page = this.tagViews.find(item => item.fullPath === tab.name)
      if (page && page.fullPath !== this.current) {
        const { name, params, query } = page
        this.$router.push({ name, params, query })
      }
    },
    /**
     * @description 触发 tab 标签的删除按钮
     * @param {String} tagName tab名称
     * */
    handleTabRemove(tagName) {
      this.closeTagView({ tagName, current: this.current })
    },
    /**
     * @description 计算某个标签是否可关闭
     * @param {Object} page 其中一个标签
     * */
    isTabClosable(page) {
      return page.name !== 'homeIndex'
    },
    /**
     * @description 设置页面tag与cache
     * */
    handleTagViews() {
      if (this.$route.name) {
        this.setTagViews(this.$route)
        if (this.$route.name !== 'homeIndex') this.setCachedViews(this.$route)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.p-tags {
  &_con {
    height: 48px;
    min-height: 48px;
    padding: 0 10px;
    background: #ffffff;
    border-bottom: 1px solid #e8e8e8;
    position: fixed;
    top: 56px;
    left: 200px;
    width: calc(100% - 200px);
    z-index: 1000;
    display: flex;
  }
}
.p-tabs-con {
  overflow: hidden;
}

.e-tags {
  &-con {
    padding-top: 14px;

    ::v-deep {
      .el-tabs__item {
        height: 32px;
        line-height: 32px;
        font-size: 14px;
        color: #555555;
        background: #f6f6f6;
        &.is-active {
          background: #fff;
          color: #3377ff;
        }
        .el-icon-close {
          font-size: 14px !important;
          &:hover {
            background-color: inherit;
            color: inherit;
          }
        }
      }
      .el-tabs__header {
        margin-bottom: 0;
        border-bottom: none;
        .el-tabs__nav {
          border-radius: 2px 2px 0 0;
        }
      }
      .el-tabs__nav-prev,
      .el-tabs__nav-next {
        line-height: 32px;
      }
      .el-icon-arrow-left,
      .el-tabs__nav-next {
        font-size: 16px;
      }
    }
  }
  &-dropdown {
    height: 33px;
    line-height: 33px;
    font-size: 14px;
    color: #555;
    background: #f6f6f6;
    position: relative;
    top: 14px;
    border-bottom: 1px solid transparent;
    border-right: 1px solid #e4e7ed;
    border-top: 1px solid #e4e7ed;
    padding: 0 10px;
    cursor: pointer;
  }
}
</style>
