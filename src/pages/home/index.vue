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
      padding: 0 20px;
      @media screen and (max-width: 1440px) {
        max-width: 1366px;
      }
      @media screen and (max-width: 1366px) {
        max-width: 1200px;
      }
    }
  }
}
</style>
