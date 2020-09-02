<template>
  <section class="mk-login">
    <div class="mk-login_con">
      <div class="mk-login_form">
        <header class="mk-loginForm_head">欢迎登录渠道管理系统</header>
        <el-form :model="loginForm" :rules="loginRules" ref="ruleForm" class="mk-loginForm_con">
          <el-form-item prop="loginName">
            <el-input v-model.trim="loginForm.loginName" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" v-model.trim="loginForm.password" placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-form-item prop="verifycode">
            <img @click="getVerifyCode" :src="verifycodeUrl" alt="图形验证码" class="e-form_verify" />
            <el-input v-model="loginForm.verifycode" placeholder="请输入验证码"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" :loading="isLoading" @click="handleLogin" style="width:100%;height:44px">登录</el-button>
      </div>
    </div>
  </section>
</template>

<script>
// import MD5Util from '@/utils/MD5Util'
import { getVerifyCode, login } from '@/api/login'
import testJson from './test.json'

export default {
  data() {
    return {
      isLoading: false,
      verifycodeUrl: '',
      loginForm: {
        loginName: '',
        password: '',
        verifycode: ''
      },
      loginRules: {
        loginName: [{ required: true, trigger: 'blur', message: '请输入账号' }],
        password: [{ required: true, trigger: 'blur', message: '请输入密码' }],
        verifycode: [{ required: true, trigger: 'blur', message: '请输入验证码' }]
      }
    }
  },
  mounted() {
    this.getVerifyCode()
  },
  methods: {
    handleLogin() {
      console.info(testJson)
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          try {
            this.isLoading = true
            const res = await login({
              // username: this.loginForm.username,
              // password: MD5Util.md5(this.loginForm.password)
              username: '18800000001',
              password: 'b09918812f8273a7df57f1752a3d80ff'
            })
            this.$router.push({ name: 'home' })
            console.info(res)
          } catch (error) {
            console.info(error)
          } finally {
            this.isLoading = false
          }
        }
      })
    },
    async getVerifyCode() {
      const res = await getVerifyCode()
      this.verifycodeUrl = res.img ?? ''
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
    &_verify {
      position: absolute;
      right: 0;
      z-index: 1000;
      cursor: pointer;
    }
  }
}
</style>
