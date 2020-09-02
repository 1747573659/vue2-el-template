<template>
  <section>
    <main class="p-home">
      <img src="../../assets/images/home/home.png" alt="首页" />
    </main>
  </section>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.p {
  &-home {
    width: 100%;
    height: calc(100vh - 56px - 48px - 16px - 16px);
    min-height: calc(100vh - 56px - 48px - 16px - 16px);
    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
