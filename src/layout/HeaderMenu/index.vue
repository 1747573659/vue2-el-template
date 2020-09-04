<template>
  <section class="p-head">
    <router-link to="/home" class="p-head_logo"><img src="../../assets/images/headMenu/logo.png" alt="logo" /> </router-link>
    <!-- 导航 -->
    <div class="p-head_nav">
      <ul>
        <li class="e-head_active">
          <router-link to="/home">客户管理</router-link>
        </li>
        <li>
          <router-link to="/setting">设置</router-link>
        </li>
      </ul>
    </div>
    <!-- head操作 -->
    <div class="p-head_action">
      <el-button type="text" class="p-head_oldVersion" @click="handleSwitchVersion">切换旧版</el-button>
      <div class="p-head_avator">
        <img src="../../assets/images/headMenu/user.png" alt="用户头像" />
      </div>
      <el-dropdown trigger="click" class="p-head_dropdown" @command="handleDropDown">
        <span class="el-dropdown-link">{{ userName }}<i class="el-icon-arrow-down el-icon--right"></i></span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item :command="1">修改密码</el-dropdown-item>
          <el-dropdown-item :command="2">退出账号</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <!-- 修改密码 -->
      <km-dropout :status.sync="dropStatus"></km-dropout>
    </div>
  </section>
</template>

<script>
import dropOutView from './component/dropOut'
import { logout } from '@/api/login'
import { getLocal } from '@/utils/token'

export default {
  components: {
    'km-dropout': dropOutView
  },
  data() {
    return {
      // oldVersionUrl: process.env.VUE_APP_OLD_VERSION,
      dropStatus: false,
      userName: JSON.parse(getLocal('userInfo')).userName
    }
  },
  methods: {
    handleDropDown(command) {
      if (command === 1) this.dropStatus = true
      else this.handleLoginOut()
    },
    handleLoginOut() {
      this.$confirm('确认退出吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(() => {
          this.$store.dispatch('Logout')
        })
        .catch(() => {})
    },
    handleSwitchVersion() {
      window.open(process.env.VUE_APP_OLD_VERSION)
    }
  }
}
</script>

<style lang="scss" scoped>
.p {
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

      img {
        width: 148px;
        height: 41px;
        float: right;
        margin: 8px 12px 0 0;
      }
    }

    &_nav {
      margin-left: 68px;
      flex: 2 1 auto;

      ul {
        display: flex;

        li {
          line-height: 56px;
          padding: 0 20px;

          a {
            font-size: 18px;
            color: #1f2e4d;
          }

          &.e-head_active a {
            color: #3377ff;
          }
        }
      }
    }

    &_action {
      display: flex;
      align-items: center;
      margin-right: 25px;
    }

    &_oldVersion {
      color: #3377ff;
      font-size: 14px;
    }

    &_avator {
      vertical-align: top;
      margin: 0 14px 0 24px;
      width: 32px;
      height: 32px;

      img {
        width: 100%;
        height: 100%;
      }
    }

    &_dropdown {
      height: 100%;
      line-height: 56px;
      cursor: pointer;
    }
  }
}
</style>
