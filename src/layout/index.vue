<template>
  <div class="app-wrapper">
    <HeaderView />
    <main class="p-layout_main">
      <SidebarView />
      <section class="p-layout_content">
        <!-- <Breadcrumb /> -->
        <TagView />
        <div class="p-layout_fill">
          <router-view />
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import HeaderView from './HeaderMenu'
import SidebarView from './SidebarMenu'
import TagView from './TagMenu'
import Breadcrumb from './Breadcrumb'

export default {
  components: {
    HeaderView,
    SidebarView,
    // Breadcrumb,
    TagView
  }
}
</script>

<style lang="scss" scoped>
.p {
  &-layout {
    &_main {
      padding-top: 56px;
    }
    &_content {
      margin-left: 200px;
      height: 100%;
    }
    &_fill {
      padding: 48px 0px 16px;
    }
  }
}
</style>
