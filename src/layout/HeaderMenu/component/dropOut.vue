<template>
  <el-dialog class="p-drop_con" title="修改密码" :before-close="handleDiaClose" :visible.sync="status" append-to-body width="508px">
    <el-form ref="passForm" :model="passwordInfo" :rules="passwordRules" size="small" label-width="100px">
      <el-form-item label="旧密码" prop="oldPass">
        <el-input type="password" v-model="passwordInfo.oldPass" placeholder="6位数字"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPass">
        <el-input type="password" v-model="passwordInfo.newPass" placeholder="6位数字"></el-input>
      </el-form-item>
      <el-form-item label="确认新密码" prop="checkPass">
        <el-input type="password" v-model="passwordInfo.checkPass" placeholder="6位数字"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="handleDiaClose">取消</el-button>
      <el-button type="primary">确认修改</el-button>
    </div>
  </el-dialog>
</template>

<script>
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
        callback(new Error('请再次输入密码'))
      } else if (value !== this.passwordInfo.newPass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      passwordInfo: {
        oldPass: '',
        newPass: '',
        checkPass: ''
      },
      passwordRules: {
        oldPass: [{ required: true, message: '请输入原始密码', trigger: 'blur' }],
        newPass: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, message: '新密码长度最少为6个字符', trigger: 'blur' }
        ],
        checkPass: [{ validator: validatePass, required: true, trigger: 'blur' }]
      }
    }
  },
  methods: {
    handleDiaClose() {
      this.$emit('update:status', false)
      this.$refs.passForm.resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
.p {
  &-drop {
    &_con {
      /deep/ .el-form {
        width: 300px;
        margin: 0 auto;
      }
    }
  }
}
</style>
