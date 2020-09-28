<template>
  <section>
    <main class="p-home">
      <img src="../../assets/images/home/home.png" alt="首页" />
    </main>
  </section>
</template>

<style lang="scss" scoped>
.p {
  &-home {
    width: 100%;
    height: calc(100vh - 56px - 48px);
    min-height: calc(100vh - 56px - 48px);
    text-align: center;
    background-color: #fff;
    img {
      width: 100%;
      max-width: 1440px;
      height: 100%;
    }
  }
}
</style>
