<template>
  <section class="p-login">
    <div class="p-login_con">
      <div class="p-login_form">
        <header class="p-loginForm_head">欢迎登录渠道管理系统</header>
        <el-form :model="loginForm" :rules="loginRules" ref="ruleForm" class="p-loginForm_con">
          <el-form-item prop="userName">
            <el-input clearable v-model.trim="loginForm.userName" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input clearable type="password" v-model.trim="loginForm.password" placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-form-item prop="codeKey">
            <img @click="captcha" :src="codeKeyUrl" alt="验证码" class="e-form_code" />
            <el-input v-model.trim="loginForm.codeKey" placeholder="请输入验证码"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" :loading="isLoading" @click="handleLogin" class="e-form_btn">登录</el-button>
      </div>
    </div>
  </section>
</template>

<script>
import { captcha, validCaptcha } from '@/api/login'

export default {
  data() {
    var codeKeyPass = async (rule, value, callback) => {
      if (value.length === 4) {
        let data = {
          codeKey: this.usedCoedKey,
          codeVal: this.loginForm.codeKey
        }
        try {
          let res = await validCaptcha(data)
          callback()
        } catch (e) {
          callback('验证码错误,请重新输入')
        }
      } else {
        callback('请输入验证码')
      }
    }
    var userNamePass = (rule, value, callback) => {
      if (/^1[3456789]\d{9}$/.test(value)) {
        callback()
      } else {
        callback('请输入用户名')
      }
    }
    return {
      isLoading: false,
      codeKeyUrl: '',
      usedCoedKey: '',
      loginForm: {
        userName: '',
        password: '',
        codeKey: ''
      },
      loginRules: {
        userName: [{ required: true, trigger: 'blur', validator: userNamePass }],
        password: [{ required: true, trigger: 'blur', message: '请输入密码' }],
        codeKey: [{ required: true, trigger: 'blur', validator: codeKeyPass }]
      },
      redirect: '',
      query: ''
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
        this.query = route.query && route.query.query
      },
      immediate: true
    }
  },
  mounted() {
    this.captcha()
  },
  methods: {
    handleLogin() {
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          this.isLoading = true
          this.$store
            .dispatch('login', this.loginForm)
            .then(() => {
              const routes = this.$store.getters.routes
              const utilRoutePoint = () => {
                if (routes.length && routes[0] && routes[0].redirect) {
                  this.$router.push({ path: routes[0].redirect })
                } else {
                  console.error('登录跳转成功后第一个路由没有redirect请检查：', routes)
                }
              }

              if (this.redirect) {
                const rotationData = this.redirect.split('/')
                rotationData.shift()
                if (rotationData.every(item => JSON.stringify(routes).includes(item))) {
                  this.$router.push({ path: this.redirect, query: this.query ? JSON.parse(this.query) : '' })
                } else utilRoutePoint()
              } else utilRoutePoint()
            })
            .catch((err) => {
              console.error(err)
              this.$refs.ruleForm.resetField()
              this.captcha()
            })
            .finally(() => {
              this.isLoading = false
            })
        }
      })
    },
    async captcha() {
      const res = await captcha()
      this.codeKeyUrl = res.code || ''
      this.usedCoedKey = res.codeKey
    }
  }
}
</script>

<style lang="scss" scoped>
.p {
  &-login {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: linear-gradient(207deg, rgba(50, 163, 255, 1) 0%, rgba(51, 119, 255, 1) 100%);
    &_con {
      width: 1120px;
      height: 539px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
    &_form {
      width: 400px;
      height: 406px;
      background: #fff;
      box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.15);
      border-radius: 4px;
      padding: 56px 24px 24px 24px;
      box-sizing: border-box;
    }
  }
  &-loginForm {
    &_head {
      font-size: 28px;
      font-weight: 500;
      color: rgba(31, 46, 77, 1);
    }
    &_con {
      margin-top: 20px;
      margin-bottom: 57px;
      /deep/ .el-input__inner {
        border-radius: 0;
        border: 0 none;
        border-bottom: 1px solid #d3dbeb;
        padding-left: 0;
      }
    }
  }
}
.e {
  &-form {
    &_code {
      width: 60px;
      height: 38px;
      position: absolute;
      bottom: 5px;
      right: 0;
      z-index: 1000;
      cursor: pointer;
    }
    &_btn {
      width: 100%;
      height: 44px;
    }
  }
}
</style>
