<template>
  <section v-if="!routes.hidden">
    <template v-if="handleTailChild && !handleTailChild.children">
      <router-link v-if="handleTailChild.meta" :to="{ path: resolvePath(handleTailChild.path) }" @click.native="linkClick(handleTailChild)">
        <el-menu-item :index="resolvePath(handleTailChild.path)">
          <span v-if="handleTailChild.meta.title">{{ handleTailChild.meta.title }}</span>
        </el-menu-item>
      </router-link>
    </template>
    <el-submenu class="e-submenu" :index="resolvePath(routes.path)" v-else>
      <template slot="title">
        <i :class="routes.meta.icon"></i>
        <span v-if="routes.meta && routes.meta.title" slot="title">{{ routes.meta.title }}</span>
      </template>
      <template v-if="routes.children && routes.children.length > 0">
        <sidebar-nav v-for="child in routes.children" :key="child.name" :routes="child" :basePath="resolvePath(child.path)"></sidebar-nav>
      </template>
    </el-submenu>
  </section>
</template>

<script>
import path from 'path'

export default {
  name: 'sidebarNav',
  props: {
    routes: {
      type: Object
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  computed: {
    getTailChildNum() {
      if (this.routes.children && this.routes.children.length > 0) {
        const tailChildNum = this.routes.children.filter(item => item.meta && !item.meta.hidden)
        return tailChildNum.length
      }
      return 0
    },
    handleTailChild() {
      // 当有子级的时候，则返回null
      if (this.getTailChildNum > 1) return null
      if (this.routes.children && this.routes.children.length > 0) {
        for (let child of this.routes.children) {
          if (!child.meta || !child.meta.hidden) {
            return this.routes
          }
        }
      }
      return { ...this.routes, path: '' }
    }
  },
  methods: {
    isExternal(path) {
      return /^(https?:|mailto:|tel:)/.test(path)
    },
    resolvePath(routePath) {
      if (this.isExternal(routePath)) {
        return routePath
      }
      if (this.isExternal(this.basePath)) {
        return this.basePath
      }
      return path.resolve(this.basePath, routePath)
    },
    linkClick(routePathObj) {
      if (routePathObj && routePathObj.meta) {
        // 统计左侧菜单栏的点击次数
        window._hmt.push(['_trackEvent', 'left_menu_click', routePathObj.meta.name || 'unknow', routePathObj.meta.title || 'unknow'])
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.e {
  &-submenu {
    /deep/ .el-submenu__title {
      color: #475166 !important;
      padding-left: 29px !important;
      font-weight: 500;
    }
    /deep/ .el-menu-item {
      padding-left: 58px !important;
      font-weight: 400;
    }
    /deep/ .el-submenu__icon-arrow {
      display: none;
    }
  }
}
</style>
