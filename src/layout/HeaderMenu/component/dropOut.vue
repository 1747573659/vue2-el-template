<template>
  <el-dialog class="p-drop_con" title="修改密码" :before-close="handleDiaClose" :visible.sync="status" append-to-body width="508px">
    <el-form ref="passForm" :model="passwordInfo" :rules="passwordRules" size="small" label-width="100px">
      <el-form-item label="旧密码" prop="oldPass">
        <el-input type="password" v-model="passwordInfo.oldPass" maxlength="6" placeholder="6位数字"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPass">
        <el-input type="password" v-model="passwordInfo.newPass" maxlength="6" placeholder="6位数字"></el-input>
      </el-form-item>
      <el-form-item label="确认新密码" prop="checkPass">
        <el-input type="password" v-model="passwordInfo.checkPass" maxlength="6" placeholder="6位数字"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="handleDiaClose" class="e-drop_cancel" size="small">取消</el-button>
      <el-button type="primary" :loading="isLoading" @click="handleModify" size="small">确认修改</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { MD5Util } from '@/utils'
import { mapActions } from 'vuex'

import { modifyPwd } from '@/api/login'

export default {
  props: {
    status: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('确认新密码不能为空'))
      } else if (value !== this.passwordInfo.newPass) {
        callback(new Error('两次新密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      isLoading: false,
      passwordInfo: {
        oldPass: '',
        newPass: '',
        checkPass: ''
      },
      passwordRules: {
        oldPass: [{ required: true, message: '旧密码不能为空', trigger: 'blur' }],
        newPass: [
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
        checkPass: [
          { validator: validatePass, required: true, trigger: 'blur' },
          { min: 6, message: '确认新密码必须6位数字', trigger: 'blur' },
          { type: 'number', message: '确认新密码必须6位数字', trigger: 'blur', transform: value => this.$options.filters.formValidateNum(value, 'number') }
        ]
      }
    }
  },
  methods: {
    ...mapActions(['Logout']),
    handleDiaClose() {
      this.$emit('update:status', false)
      this.$refs.passForm.resetFields()
    },
    handleModify() {
      this.$refs.passForm.validate(async valid => {
        if (valid) {
          try {
            this.isLoading = true
            await modifyPwd({ newPassword: this.passwordInfo.newPass, oldPassword: this.passwordInfo.oldPass })
            this.handleDiaClose()
            this.$message({ message: '修改成功', type: 'success' })
            this.Logout()
          } catch (e) {
          } finally {
            this.isLoading = false
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
    &_con {
      ::v-deep .el-form {
        width: 300px;
        margin: 0 auto;
        margin-top: 11px;
        margin-bottom: -16px;
      }
    }
  }
}

.e {
  &-drop {
    &_cancel {
      padding: 8px 22px;
    }
  }
}
</style>
