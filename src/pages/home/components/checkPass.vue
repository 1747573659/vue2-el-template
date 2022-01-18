<template>
  <el-dialog title="系统提示" width="500px" v-bind="$attrs" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
    <section class="p-layout-pass">
      <p>为了您的账号安全，请修改初始密码</p>
      <el-form ref="form" :model="form" :rules="rules" size="small" label-suffix=":" label-width="100px">
        <el-form-item label="新密码" prop="newPassword">
          <el-input type="password" v-model="form.newPassword" maxlength="6" placeholder="6位数字"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="verifyNewPassword">
          <el-input type="password" v-model="form.verifyNewPassword" maxlength="6" placeholder="6位数字"></el-input>
        </el-form-item>
      </el-form>
    </section>
    <div slot="footer">
      <el-button type="primary" :loading="isPwdSubmit" @click="handleSubmit" size="small">确认修改</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import { MD5Util } from '@/utils'

import { modifyPwd } from '@/api/login'

export default {
  data() {
    return {
      isPwdSubmit: false,
      form: {
        newPassword: '',
        verifyNewPassword: ''
      },
      rules: {
        newPassword: [
          { required: true, message: '新密码不能为空', trigger: 'blur' },
          { min: 6, message: '新密码必须6位数字', trigger: 'blur' },
          { type: 'number', message: '新密码必须6位数字', trigger: 'blur', transform: value => this.$options.filters.formValidateNum(value, 'number') },
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (MD5Util.md5(String(value)) === '21218cca77804d2ba1922c33e0151105') callback(new Error('新密码不能为初始密码'))
              else callback()
            }
          }
        ],
        verifyNewPassword: [
          { min: 6, message: '确认新密码必须6位数字', trigger: 'blur' },
          { type: 'number', message: '确认新密码必须6位数字', trigger: 'blur', transform: value => this.$options.filters.formValidateNum(value, 'number') },
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (value === '') callback(new Error('确认新密码不能为空'))
              else if (value !== Number(this.form.newPassword)) callback(new Error('两次新密码不一致!'))
              else callback()
            }
          }
        ]
      }
    }
  },
  methods: {
    ...mapActions(['Logout']),
    ...mapMutations({
      setPwdVisible: 'SET_PWDVISIBLE'
    }),
    handleSubmit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          try {
            this.isPwdSubmit = true
            await modifyPwd({ newPassword: this.form.newPassword, oldPassword: '888888' })
            this.setPwdVisible(false)
            this.$message({ type: 'success', message: '修改成功，将重新登录' })
            sessionStorage.removeItem('pass')
            this.Logout()
          } catch (e) {
          } finally {
            this.isPwdSubmit = false
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.p-layout-pass {
  display: flex;
  align-items: center;
  flex-direction: column;
  > p {
    font-size: 16px;
    margin-bottom: 30px;
  }
}
.el-dialog__wrapper {
  /deep/ .el-dialog__body {
    padding-top: 20px;
    padding-bottom: 0;
  }
}
</style>
