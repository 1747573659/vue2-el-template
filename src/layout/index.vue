<template>
  <div class="app-wrapper">
    <HeaderView />
    <!-- <SidebarView /> -->
    <!-- <TagView /> -->
    <router-view />
  </div>
</template>

<script>
import HeaderView from './HeaderMenu'
// import SidebarView from './SidebarMenu'
// import TagView from './TagMenu'

export default {
  components: {
    HeaderView,
    // SidebarView,
    // TagView
  }
}
</script>
