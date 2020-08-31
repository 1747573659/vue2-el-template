<template>
  <section class="mk-head">
    <div class="mk-head_logo">
      <img src="../../assets/images/headMenu/logo.png" alt="logo" />
    </div>
    <div class="mk-head_nav">
      <ul>
        <li><router-link to="/login">客户管理</router-link></li>
        <li><router-link to="/login">订单管理</router-link></li>
        <li><router-link to="/login">数据中心</router-link></li>
      </ul>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.mk {
  &-head {
    height: 56px;
    overflow: hidden;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 6px 12px 0px rgba(230, 233, 240, 1);
    display: flex;
    &_logo {
      width: 200px;
      height: 100%;
      @include clearfix;
      img {
        float: right;
        margin: 8px 12px 0 0;
      }
    }
    &_nav {
      margin-left: 68px;
      ul {
        display: flex;
        li{
          line-height: 55px;
          padding: 0 20px;
          a{
            font-size: 18px;
          }
        }
      }
    }
  }
}
</style>
