<template>
  <section>
    <el-dialog class="p-drop_con" title="个人信息" :before-close="handleDiaClose" @open="getUserInfo" :visible.sync="status" append-to-body width="508px">
      <section class="p-drop_info">
        <el-form class="e-drop_info" ref="passForm" :model="form" :rules="rules" size="small" label-width="100px">
          <el-form-item label="账号">
            <el-input v-model="form.loginName" placeholder="账号" disabled></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input v-model="form.name" maxlength="30" placeholder="姓名"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="form.mobile" maxlength="11" placeholder="手机号" disabled></el-input>
          </el-form-item>
        </el-form>
        <el-button type="text" @click="phoneDiaStatus = true">修改</el-button>
      </section>
      <div slot="footer">
        <el-button @click="handleDiaClose" class="e-drop_cancel" size="small">取消</el-button>
        <el-button type="primary" :loading="isLoading" @click="handleUserInfo" size="small">确认修改</el-button>
      </div>
    </el-dialog>
    <el-dialog class="p-drop_con" title="修改联系人手机号" :before-close="handlePhoneDiaClose" :visible.sync="phoneDiaStatus" append-to-body width="508px">
      <el-form class="e-drop_phone" ref="phoneForm" :model="phoneForm" :rules="phoneRules" size="small" label-width="80px">
        <el-form-item label="新手机" prop="nPhone">
          <el-input v-model="phoneForm.nPhone" maxlength="11" placeholder="新手机"></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="code">
          <el-input v-model="phoneForm.code" maxlength="6" placeholder="验证码"></el-input>
          <el-button
            size="small"
            class="e-drop_resend"
            :class="{ 'e-drop-resend_clicked': isClick, 'e-drop-resend_disabled': isDisabled }"
            @click="handleSendCode"
            :disabled="isDisabled"
            >{{ sendBtnText }}</el-button
          >
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="handlePhoneDiaClose" class="e-drop_cancel" size="small">取消</el-button>
        <el-button type="primary" class="e-drop_cancel" :loading="phoneDiaLoading" @click="handlePhoneDiaModify" size="small">确定</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import { queryUser, modifyUserMobile, modifyUserName } from '@/api/login'
import { createAuthCode } from '@/api/sms/sms'

const cardholderPhone = (rule, value, callback) => {
  if (!/^1[3456789]\d{9}$/.test(value)) {
    callback('请输入正确的电话号码')
  } else {
    callback()
  }
}

export default {
  props: {
    status: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isLoading: false,
      phoneDiaLoading: false,
      form: {
        loginName: '',
        name: '',
        mobile: ''
      },
      rules: {
        name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        mobile: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { required: true, validator: cardholderPhone, trigger: ['blur', 'change'] }
        ]
      },
      isClick: false,
      isDisabled: false,
      phoneDiaStatus: false,
      sendBtnText: '发送验证码',
      countdownTime: 60,
      countdownTimer: null,
      phoneForm: {
        nPhone: '',
        code: ''
      },
      phoneRules: {
        nPhone: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { required: true, validator: cardholderPhone, trigger: ['blur', 'change'] }
        ],
        code: [{ required: true, message: '验证码不能为空', trigger: 'blur' }]
      }
    }
  },
  methods: {
    handleSendCode() {
      this.$refs.phoneForm.validateField('nPhone', async errorMessage => {
        if (!errorMessage) {
          try {
            let res = await createAuthCode({ mobile: this.phoneForm.nPhone })
            this.isClick = false
            this.isDisabled = true
            this.sendBtnText = `重新发送${this.countdownTime}s`
            this.countdownTimer = setInterval(() => {
              this.countdownTime -= 1
              this.sendBtnText = `重新发送${this.countdownTime}s`
              if (!this.countdownTime) {
                this.handleResetCodeBtn()
              }
            }, 1000)
          } catch (e) {
          } finally {
          }
        }
      })
    },
    handleResetCodeBtn() {
      this.countdownTime = 60
      this.isClick = true
      this.isDisabled = false
      this.sendBtnText = '重新发送'
      clearInterval(this.countdownTimer)
      this.countdownTimer = null
    },
    handleDiaClose() {
      this.$emit('update:status', false)
      this.$refs.passForm.resetFields()
    },
    handleUserInfo: async function() {
      this.$refs.passForm.validate(async valid => {
        if (valid) {
          try {
            this.isLoading = true
            await modifyUserName({ name: this.form.name })
            this.handleDiaClose()
            this.$message({ message: '修改成功', type: 'success' })
          } catch (e) {
          } finally {
            this.isLoading = false
          }
        }
      })
    },
    handlePhoneDiaClose() {
      this.phoneDiaStatus = false
      this.handleResetCodeBtn()
      this.$refs.phoneForm.resetFields()
    },
    handlePhoneDiaModify() {
      this.$refs.phoneForm.validate(async valid => {
        if (valid) {
          try {
            this.phoneDiaLoading = true
            await modifyUserMobile({ mobile: this.phoneForm.nPhone, codeKey: this.phoneForm.code })
            this.form.mobile = this.phoneForm.nPhone
            this.handlePhoneDiaClose()
            this.$message({ message: '手机号修改成功', type: 'success' })
          } catch (e) {
          } finally {
            this.phoneDiaLoading = false
          }
        }
      })
    },
    getUserInfo: async function() {
      try {
        const res = await queryUser()
        this.form = res
        this.form.mobile = '18565715357'
      } catch (error) {}
    }
  }
}
</script>

<style lang="scss" scoped>
.p {
  &-drop {
    &_info {
      display: flex;
      align-items: flex-end;
      justify-content: center;
      /deep/ .el-button {
        margin-left: 6px;
        margin-bottom: 7px;
      }
    }
  }
}

.e {
  &-drop {
    &_cancel {
      padding: 8px 22px;
    }
    &_info {
      flex-basis: 300px;
      max-width: 300px;
      margin-bottom: -16px;
    }
    &_phone {
      width: 300px;
      margin: 0 auto;
      margin-bottom: -16px;
      /deep/ .el-form-item {
        &:nth-child(2) {
          .el-input {
            width: 55%;
          }
          .el-button {
            margin-left: 8px;
          }
          .e-drop_resend {
            padding: 8px 9px;
          }
          .e-drop-resend_clicked {
            padding: 8px 15px;
          }
          .e-drop-resend_disabled {
            padding: 8px 0px;
            width: 90px;
          }
        }
      }
    }
  }
}
</style>
