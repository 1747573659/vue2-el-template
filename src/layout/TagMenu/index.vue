<template>
  <section class="p-tags_con" ref="tagMenu">
    <div
      class="p-tags_item"
      v-for="(item, index) in baseArr"
      :key="item.path"
      :class="{ 'e-tag_active': isActive(item), 'p-tags_closable': index > 0 }"
      @click="handleJumpPage(item, item.query)">
      <span>{{ item.title }}</span>
      <i class="el-icon-close" @click.stop="handleClose(item)"></i>
    </div>
    <el-dropdown class="p-tags_item e-tags_dropdown" v-if="dropArr.length > 0" @command="handleCommand">
      <span class="el-dropdown-link">
        <i class="el-icon-arrow-down"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item v-for="item in dropArr" :key="item.name" :command="{ item: item, query: item.query }" :class="{ 'e-tag_active': isActive(item) }">{{
          item.title
        }}</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </section>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  data() {
    return {
      dropArr: [],
      baseArr: []
    }
  },
  watch: {
    $route() {
      this.handleTagViews()
    },
    tagViews: {
      handler(val) {
        this.baseArr = val
        this.$nextTick(() => {
          let tagsWidth = this.$refs.tagMenu.offsetWidth
          let tagsItem = document.querySelectorAll('.p-tags_item')
          let width = 0
          for (let i = 0; i < this.tagViews.length; i++) {
            width += tagsItem[i].offsetWidth
            if (tagsWidth - width <= 100) {
              this.baseArr = this.tagViews.slice(0, i)
              this.dropArr = this.tagViews.slice(i).concat({ title: '关闭全部' })
              break
            } else {
              if (val.length >= 2) this.dropArr = [{ title: '关闭全部' }]
              else this.dropArr = []
            }
          }
        })
      },
      immediate: true
    }
  },
  computed: {
    ...mapGetters(['tagViews', 'routes'])
  },
  mounted() {
    this.handleTagViews()
  },
  methods: {
    ...mapActions(['setTagViews', 'setCachedViews', 'delTagView', 'delCachedView', 'delAllTagView']),
    handleCommand({ item, query }) {
      if (item.title === '关闭全部') {
        new Promise(resolve => {
          this.delAllTagView()
          resolve()
        }).then(() => {
          this.$router.replace({ name: 'home' })
        })
      } else this.$router.push({ path: item.path, query: Object.keys(query).length === 0 ? {} : query })
    },
    handleTagViews() {
      if (this.$route.name) {
        if (this.tagViews.length === 15 && !this.tagViews.some(item => item.name === this.$route.name)) {
          this.$message({ type: 'warning', message: '最大支持15个页签，请关闭其他页签后重试' })
        } else this.setTagViews(this.$route)
        this.setCachedViews(this.$route)
      }
    },
    handleJumpPage(item, query) {
      if (this.$route.path === item.path) return
      this.$router.push({ path: item.path, query: Object.keys(query).length === 0 ? {} : query })
    },
    handleClose(item) {
      this.delTagView(item).then(views => {
        if (this.isActive(item)) {
          const latestView = views.slice(-1)[0]
          if (latestView) {
            this.$router.push({ path: latestView.path, query: latestView.query ? latestView.query : {} })
          } else {
            const menus = this.routes
            if (JSON.stringify(menus).includes('home')) {
              this.$router.push({ name: 'home' })
            } else {
              this.$router.push({ name: menus[0].children[0].children[0].name })
            }
          }
        }
        this.delCachedView(item)
      })
    },
    isActive(route) {
      return route.path === this.$route.path
    }
  }
}
</script>

<style lang="scss" scoped>
.p {
  &-tags {
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
    }
    &_item {
      height: 32px;
      line-height: 32px;
      display: inline-block;
      font-size: 14px;
      color: #555555;
      background: #f6f6f6;
      position: relative;
      top: 15px;
      border-bottom: 1px solid transparent;
      border-left: 1px solid #e4e7ed;
      border-top: 1px solid #e4e7ed;
      transition: padding 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      padding: 0 20px;
      cursor: pointer;
      &:last-child {
        border-right: 1px solid #e4e7ed;
      }
      ::v-deep .el-icon-close {
        position: relative;
        width: 0;
        height: 14px;
        vertical-align: middle;
        overflow: hidden;
        top: -1px;
        right: -2px;
        transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
        margin-left: 5px;
      }
      &.e-tag_active.p-tags_closable {
        &:hover {
          padding-left: 20px;
          padding-right: 20px;
        }
        ::v-deep .el-icon-close {
          width: 14px;
        }
      }
      &.p-tags_closable {
        &:hover {
          padding-left: 13px;
          padding-right: 13px;
          ::v-deep .el-icon-close {
            width: 14px;
          }
        }
      }
    }
  }
}
.e {
  &-tag {
    &_active {
      background: #fff;
      color: #3377ff;
      border-bottom: 1px solid #fff;
    }
    &_close {
      margin-left: 10px;
    }
    &-cut__pd {
      padding-right: 10px;
    }
  }
  &-tags {
    &_dropdown {
      padding: 0;
      ::v-deep .el-dropdown-link {
        padding: 0 10px;
        display: inline-block;
      }
    }
  }
}
</style>
