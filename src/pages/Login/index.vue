<template>
  <section class="mk-login">
    <div class="mk-login_con">
      <div class="mk-login_form">
        <header class="mk-loginForm_head">欢迎登录渠道管理系统</header>
        <el-form :model="loginForm" status-icon ref="ruleForm" class="mk-loginForm_con">
          <el-form-item prop="loginName">
            <el-input v-model="loginForm.loginName" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" v-model="loginForm.password" placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-form-item prop="verifycode">
            <el-input v-model="loginForm.verifycode" placeholder="请输入验证码"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" @click="submitForm('ruleForm')" style="width:100%;height:44px">登录</el-button>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        loginName: '',
        password: '',
        verifycode: ''
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
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
      /deep/ .el-input__inner{
        border-radius: 0;
        border: 0 none;
        border-bottom: 1px solid #D3DBEB;
        padding-left: 0;
      }
    }
  }
}
</style>
