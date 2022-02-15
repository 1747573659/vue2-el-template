<template>
  <section class="p-head">
    <router-link to="/home" class="p-head_logo">
      <img src="../../assets/images/menu/logo.png" alt="logo" />
    </router-link>
    <!-- 导航 -->
    <div class="p-head_nav" style="display: flex;">
      <ul v-if="!isDropdown">
        <template v-if="routeMenus.length > 0">
          <template v-for="item in routeMenus">
            <li :class="{ 'e-head_active': getActiveRoute(item.path) }" :key="item.name" v-if="!item.hidden">
              <router-link :to="{ path: item.path + '/' + item.children[0].path + '/' + item.children[0].children.find(ele => !ele.hidden).path }">{{
                item.meta.title
              }}</router-link>
            </li>
          </template>
        </template>
      </ul>
      <!-- 位置不够，隐藏展示 -->
      <el-dropdown class="p-menu_dropdown" v-else>
        <span>下拉菜单<i class="el-icon-arrow-down el-icon--right"></i></span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="item in routeMenus" :key="item.path">
            <div :class="{ 'e-head_active': getActiveRoute(item.path) }" :key="item.name" v-if="!item.hidden">
              <router-link :to="{ path: item.path + '/' + item.children[0].path + '/' + item.children[0].children.find(ele => !ele.hidden).path }">{{
                item.meta.title
              }}</router-link>
            </div>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <!-- head操作 -->
    <div class="p-head_action">
      <el-button type="text" class="p-head_oldVersion" @click="handleSwitchVersion">切换旧版</el-button>
      <div class="p-head_avator">
        <img src="../../assets/images/menu/user.png" alt="用户头像" />
      </div>
      <el-dropdown trigger="click" class="p-head_dropdown" @command="handleDropDown">
        <div class="e-dropdown-con">
          <span class="e-dropdown-name">{{ userName }}</span>
          <i class="el-icon-arrow-down el-icon--right"></i>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item :command="1">个人信息</el-dropdown-item>
          <el-dropdown-item :command="2">修改密码</el-dropdown-item>
          <el-dropdown-item :command="3">退出账号</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <!-- 修改密码 -->
      <km-dropout :status.sync="dropOutStatus"></km-dropout>
      <!-- 修改个人信息 -->
      <km-dropInformation @change="userInfoChange" :status.sync="dropInfoStatus"></km-dropInformation>
    </div>
  </section>
</template>

<script>
import dropOutView from './component/dropOut'
import dropInformationView from './component/dropInformation'
import { getLocal } from '@/utils/storage'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    'km-dropout': dropOutView,
    'km-dropInformation': dropInformationView
  },
  data() {
    return {
      dropOutStatus: false,
      dropInfoStatus: false,
      userName: JSON.parse(getLocal('userInfo')).userName,
      routeMenus: [],
      isDropdown: false
    }
  },
  computed: {
    ...mapGetters(['routes']),
    getActiveRoute() {
      return function(path) {
        if (this.$route.name === 'homeIndex') {
          this.setBasePath(this.routes[0].path)
          return this.routes[0].path === path
        }
        if (this.$route.path.includes(path)) {
          this.setBasePath(path)
        }
        return this.$route.path.includes(path)
      }
    }
  },
  watch: {
    $route(route) {
      this.getChildRoutes(this.$route)
    }
  },
  mounted() {
    const userInfo = JSON.parse(getLocal('userInfo'))
    if (!JSON.parse(sessionStorage.getItem('isPilotAgent'))) {
      this.routes.map(item => {
        if (item.name === 'orderCenter') {
          if (userInfo.propertyType === 1) {
            if (userInfo.level === 2) {
              item.children = item.children.map(ele => {
                ele.children = ele.children.filter(
                  child => !['softwarePurchaseOrder', 'hardwarePurchaseOrder', 'erpAuthorizedTransfer', 'softwareUpdateOrder'].includes(child.name)
                )
                return ele
              })
            }
          } else item.children = item.children.filter(ele => ele.name !== 'orderManagement')
        } else if (item.name === 'customer') {
          if (userInfo.propertyType === 2) {
            item.children = item.children.map(ele => {
              ele.children = ele.children.filter(child => !['softNoteManagement'].includes(child.name))
              return ele
            })
          }
        }
      })
    }
    this.routeMenus = this.routes
    this.getChildRoutes(this.$route)
    this.$nextTick(() => {
      if (document.body.clientWidth < 1200) this.isDropdown = true
      else this.isDropdown = false
      window.addEventListener('resize', () => {
        if (document.body.clientWidth < 1200) this.isDropdown = true
        else this.isDropdown = false
      })
    })
  },
  methods: {
    ...mapActions(['setAsideRoutes', 'setBasePath']),
    handleDropDown(command) {
      if (command === 1) this.dropInfoStatus = true
      else if (command === 2) this.dropOutStatus = true
      else this.handleLoginOut()
    },
    userInfoChange() {
      this.userName = JSON.parse(getLocal('userInfo')).userName
    },
    handleLoginOut() {
      this.$confirm('确认退出吗?', '提示')
        .then(() => {
          this.$store.dispatch('Logout')
        })
        .catch(() => {})
    },
    handleSwitchVersion() {
      // 统计【切换旧版】系统的点击次数
      window._hmt.push(['_trackEvent', 'old_system_click', '切换旧版', '跳转到旧系统'])
      window.open(process.env.VUE_APP_OLD_VERSION)
    },
    getChildRoutes(route) {
      // 设置左侧导航栏
      let index = this.routes.findIndex(item => this.includeRouter(route, item))
      if (this.routes[index].children?.length) this.setAsideRoutes(this.routes[index].children)
    },
    includeRouter(route, routes) {
      if (routes.name === route.name) return true
      else if (routes?.children) return routes.children.some(childItem => this.includeRouter(route, childItem))
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
    z-index: 2000;
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
          height: 56px;
          line-height: 56px;
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
      margin: 0 10px 0 24px;
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
  &-menu {
    &_dropdown {
      font-size: 18px;
      color: #1f2e4d;
      line-height: 56px;
    }
  }
}
.e {
  &-head {
    &_active {
      a {
        color: #3377ff;
      }
    }
  }
  &-dropdown {
    &-con {
      display: flex;
      align-items: center;
      height: 56px;
    }
    &-name {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      display: inline-block;
      max-width: 100px;
      text-align: right;
    }
  }
}
</style>
