<template>
  <section class="p-sidebar_con">
    <div class="p-sidebar_main">
      <el-scrollbar>
        <el-menu :default-active="$route.path">
          <sidebar-nav v-for="item in sidebarRoutes" :key="item.name" :routes="item"></sidebar-nav>
        </el-menu>
      </el-scrollbar>
    </div>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
import sidebarNav from './component/sidebar'

export default {
  components: {
    sidebarNav
  },
  computed: {
    ...mapGetters(['sidebarRoutes'])
  },
  mounted(){
    console.info(this.sidebarRoutes)
  }
}
</script>

<style lang="scss" scoped>
.p {
  &-sidebar {
    &_con {
      height: 100%;
      width: 200px;
      position: fixed;
      background-color: #fff;
      box-shadow: 2px 0px 4px 0px rgba(0, 0, 0, 0.08);
    }
    // &_main {
    // padding-top: 68px;
    // }
  }
}
</style>
