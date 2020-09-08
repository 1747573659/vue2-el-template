<template>
  <section v-if="!routes.hidden">
    <template v-if="handleTailChild && !handleTailChild.children">
      <router-link v-if="handleTailChild.meta" :to="{ path: handleTailChild.path }">
        <el-menu-item>
          <span v-if="handleTailChild.meta.title" slot="title">{{ handleTailChild.meta.title }}</span>
        </el-menu-item>
      </router-link>
    </template>
    <el-submenu :index="routes.name" v-else>
      <template slot="title">
        <span v-if="routes.meta && routes.meta.title" slot="title">{{ routes.meta.title }}</span>
      </template>
      <template v-if="routes.children">
        <sidebar-nav v-for="child in routes.children" :key="child.name" :routes="child"></sidebar-nav>
      </template>
    </el-submenu>
  </section>
</template>

<script>
export default {
  name: 'sidebarNav',
  props: {
    routes: {
      type: Object
    }
  },
  methods: {
    getTailChildNum() {
      if (this.routes.children) {
        const tailChildNum = this.routes.children.filter(item => {
          if (item.meta && item.meta.hidden) return false
          else return true
        })
        return tailChildNum.length
      }
      return 0
    },
    handleTailChild() {
      if (this.getTailChildNum > 1) return null
      if (this.routes.children) {
        for (let child of this.routes.children) {
          if (!child.meta || !child.meta.hidden) {
            return this.routes
          }
        }
      }
      console.info(this.routes)
      return { ...this.routes, path: '' }
    }
  }
}
</script>
