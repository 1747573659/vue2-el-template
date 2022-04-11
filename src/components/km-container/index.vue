<template>
  <div class="km-container">
    <div class="km-container-con">
      <keep-alive :include="cachedViews">
        <router-view />
      </keep-alive>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters(['cachedViews'])
  }
}
</script>

<style lang="scss">
.km-container {
  padding: 0 16px 16px;
  height: inherit;
  &-con {
    height: inherit;
    background-color: #fff;
  }
}
</style>
