<template>
  <section class="p-abnormal_404">
    <div class="p-abnormal_con">
      <div class="p-abnormal_img">
        <img src="../../assets/images/abnormal/404.png" alt="404" />
      </div>
      <div class="p-abnormal_main">
        <p class="p-abnormal_errTitle">404</p>
        <p class="p-abnormal_errMsg">抱歉，你访问的页面不存在</p>
        <el-button type="primary" @click="$router.push({ name: 'homeIndex' })">返回首页</el-button>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.p {
  &-abnormal {
    &_404 {
      height: 100%;
      width: 100%;
      background: #f6f6f6;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    &_con {
      min-width: 800px;
      display: flex;
      align-items: center;
    }
    &_main {
      margin-left: 120px;
    }
    &_errTitle {
      font-size: 100px;
      line-height: 2.5;
      color: #434e59;
    }
    &_errMsg {
      font-size: 20px;
      color: rgba(0, 0, 0, 0.45);
      margin: 0 0 20px 0;
    }
  }
}
</style>
