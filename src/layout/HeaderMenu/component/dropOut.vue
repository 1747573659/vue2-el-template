<template>
  <el-dialog title="修改密码" append-to-body width="508px">
    <km-form ref="passForm" :model="passwordInfo" :rules="passwordRules" :label-width="formLabelWidth">
      <km-form-item label="旧密码" prop="oldPass" ref="oldPass">
        <km-input type="password" v-model="passwordInfo.oldPass" auto-complete="on"></km-input>
      </km-form-item>
      <km-form-item label="新密码" prop="newPass">
        <km-input type="password" v-model="passwordInfo.newPass" auto-complete="on"></km-input>
      </km-form-item>
      <km-form-item label="确认新密码" prop="checkPass">
        <km-input type="password" v-model="passwordInfo.checkPass" auto-complete="on"></km-input>
      </km-form-item>
    </km-form>
    <div slot="footer">
      <km-button @click="dialogResetPassword = false">取消</km-button>
      <km-button type="primary" @click="confirmPass">确认修改</km-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    
  }
}
</script>
