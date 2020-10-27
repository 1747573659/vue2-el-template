<template>
  <section>
    <el-dialog class="p-drop_con" title="个人信息" :before-close="handleDiaClose" :visible.sync="status" append-to-body width="508px">
      <section class="p-drop_info">
        <el-form class="e-drop_info" ref="passForm" :model="form" :rules="rules" size="small" label-width="100px">
          <el-form-item label="账号">
            <el-input v-model="form.account" placeholder="账号" disabled></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input v-model="form.name" maxlength="30" placeholder="姓名"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="form.phone" maxlength="11" placeholder="手机号"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="text" @click="phoneDiaStatus = true">修改</el-button>
      </section>
      <div slot="footer">
        <el-button @click="handleDiaClose" class="e-drop_cancel" size="small">取消</el-button>
        <el-button type="primary" :loading="isLoading" @click="handleModify" size="small">确认修改</el-button>
      </div>
    </el-dialog>
    <el-dialog class="p-drop_con" title="修改联系人手机号" :before-close="handlePhoneDiaClose" :visible.sync="phoneDiaStatus" append-to-body width="508px">
      <el-form class="e-drop_phone" ref="phoneForm" :model="phoneForm" :rules="phoneRules" size="small" label-width="80px">
        <el-form-item label="新手机" prop="nPhone">
          <el-input v-model="phoneForm.nPhone" maxlength="11" placeholder="新手机"></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="code">
          <el-input v-model="phoneForm.code" maxlength="6" placeholder="验证码"></el-input>
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
const userInfo = localStorage.userInfo ? JSON.parse(localStorage.userInfo) : ''
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
        account: userInfo?.loginName ?? '',
        name: userInfo?.userName ?? '',
        phone: ''
      },
      rules: {
        name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        phone: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { required: true, validator: cardholderPhone, trigger: ['blur', 'change'] }
        ]
      },
      phoneDiaStatus: false,
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
    handleDiaClose() {
      this.$emit('update:status', false)
      this.$refs.passForm.resetFields()
    },
    handleModify() {
      this.$refs.passForm.validate(async valid => {
        if (valid) {
          try {
            this.isLoading = true
            // await modifyPwd({ newPassword: this.passwordInfo.newPass, oldPassword: this.passwordInfo.oldPass })
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
      this.$refs.phoneForm.resetFields()
    },
    handlePhoneDiaModify() {
      this.$refs.phoneForm.validate(async valid => {
        if (valid) {
          try {
            this.phoneDiaLoading = true
            // await modifyPwd({ newPassword: this.passwordInfo.newPass, oldPassword: this.passwordInfo.oldPass })
            // this.handleDiaClose()
            this.form.phone = this.phoneForm.nPhone
            this.handlePhoneDiaClose()
            this.$message({ message: '手机号修改成功', type: 'success' })
          } catch (e) {
          } finally {
            this.phoneDiaLoading = false
          }
        }
      })
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
    }
  }
}
</style>
