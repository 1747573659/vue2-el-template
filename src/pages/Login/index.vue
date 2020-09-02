<template>
  <section class="mk-login">
    <div class="mk-login_con">
      <div class="mk-login_form">
        <header class="mk-loginForm_head">欢迎登录渠道管理系统</header>
        <el-form :model="loginForm" :rules="loginRules" ref="ruleForm" class="mk-loginForm_con">
          <el-form-item prop="userName">
            <el-input clearable v-model.trim="loginForm.userName" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input clearable type="password" v-model.trim="loginForm.password" placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-form-item prop="codeKey">
            <img @click="captcha" :src="codeKeyUrl" alt="图形验证码" class="e-form_code" />
            <el-input v-model="loginForm.codeKey" placeholder="请输入验证码"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" :loading="isLoading" @click="handleLogin" style="width:100%;height:44px">登录</el-button>
      </div>
    </div>
  </section>
</template>

<script>
import { captcha } from '@/api/login'

export default {
  data() {
    return {
      isLoading: false,
      codeKeyUrl: '',
      loginForm: {
        userName: '',
        password: '',
        codeKey: ''
      },
      loginRules: {
        userName: [{ required: true, trigger: 'blur', message: '请输入账号' }],
        password: [{ required: true, trigger: 'blur', message: '请输入密码' }],
        codeKey: [{ required: true, trigger: 'blur', message: '请输入验证码' }]
      }
    }
  },
  mounted() {
    this.captcha()
  },
  methods: {
    handleLogin() {
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          this.$store.dispatch('login', this.loginForm).then(() => {
            this.$router.push({ name: 'home' })
          }).catch(() => {
            this.loginForm = {
              userName: '',
              password: '',
              codeKey: ''
            }
            this.captcha()
          }).finally(() => {
            this.isLoading = false
          })
          // try {
          //   this.isLoading = true
          //   const res = await login({
          //     userName: this.loginForm.userName,
          //     password: MD5Util.md5(this.loginForm.password),
          //     codeKey: this.loginForm.codeKey
          //   })
          //   this.$router.push({ name: 'home' })
          // } catch (error) {
          // } finally {
          //   this.isLoading = false
          // }
        }
      })
    },
    async captcha() {
      const res = await captcha()
      this.codeKeyUrl = res.code || ''
    }
  }
}
</script>

<style lang="scss" scoped>
.mk {
  &-login {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    &_con {
      width: 1120px;
      height: 539px;
      display: flex;
      justify-content: flex-end;
      background: linear-gradient(207deg, rgba(50, 163, 255, 1) 0%, rgba(51, 119, 255, 1) 100%);
    }
    &_form {
      width: 400px;
      height: 406px;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.15);
      border-radius: 4px;
      margin-top: 67px;
      margin-right: 72px;
      padding: 44px 24px 24px 24px;
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
      margin-bottom: 55px;
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
      right: 0;
      z-index: 1000;
      cursor: pointer;
    }
  }
}
</style>
