<template>
  <section class="p-sidebar_con">
    <div class="p-sidebar_main">
      <el-scrollbar>
        <el-menu :default-active="$route.path" active-text-color="#3377FF" text-color="#3D4966">
          <sidebar-nav v-for="route in asideRoutes" :key="route.name" :routes="route" :basePath="basePath + '/' + route.path"></sidebar-nav>
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
    ...mapGetters(['asideRoutes', 'basePath'])
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
    &_main {
      margin-right: -1px;
      padding-top: 12px;
    }
  }
}
</style>
