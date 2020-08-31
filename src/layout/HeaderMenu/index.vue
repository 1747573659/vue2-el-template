<template>
  <section class="mk-head">
    <div class="mk-head_logo">
      <img src="../../assets/images/headMenu/logo.png" alt="logo" />
    </div>
    <div class="mk-head_nav" style="flex: 2 1 auto;">
      <ul>
        <li><router-link to="/login">客户管理</router-link></li>
        <li><router-link to="/login">订单管理</router-link></li>
        <li><router-link to="/login">数据中心</router-link></li>
      </ul>
    </div>
    <div style="display:flex;align-items: center;margin-right: 25px;">
      <el-button type="text" style="color:#3377FF;font-size:14px;">切换旧版</el-button>
      <div style="vertical-align: top;margin: 0 14px 0 24px;width:32px;height:32px">
        <img src="../../assets/images/headMenu/user.png" alt="用户头像" style="width:100%;height:100%">
      </div>
      <el-dropdown trigger="click">
        <span class="el-dropdown-link">张三丰<i class="el-icon-arrow-down el-icon--right"></i> </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>黄金糕</el-dropdown-item>
          <el-dropdown-item>狮子头</el-dropdown-item>
          <el-dropdown-item>螺蛳粉</el-dropdown-item>
          <el-dropdown-item disabled>双皮奶</el-dropdown-item>
          <el-dropdown-item divided>蚵仔煎</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.mk {
  &-head {
    width: 100%;
    height: 56px;
    overflow: hidden;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 6px 12px 0px rgba(230, 233, 240, 1);
    display: flex;
    position: fixed;
    z-index: 1001;
    &_logo {
      width: 200px;
      height: 100%;
      // @include clearfix;
      img {
        width: 148px;
        height: 41px;
        float: right;
        margin: 8px 12px 0 0;
      }
    }
    &_nav {
      margin-left: 68px;
      ul {
        display: flex;
        li {
          line-height: 55px;
          padding: 0 20px;
          a {
            font-size: 18px;
          }
        }
      }
    }
  }
}
</style>
