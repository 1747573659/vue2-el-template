<template>
  <div class="km-setting-account-add">
    <el-form ref="form" size="small" :rules="rules" label-suffix=":" :model="form" label-width="110px" style="width:350px">
      <el-form-item label="手机 (账号)" required>
        <el-input v-model="form.name" v-if="type"></el-input>
        <span v-else>18566239874</span>
      </el-form-item>
      <el-form-item label="姓名" required>
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="密码" required v-if="type">
        <el-input :disabled="true" v-model="form.name" placeholder="默认888888"></el-input>
      </el-form-item>
      <el-form-item label="角色" required>
        <el-select v-model="form.roleId" placeholder="">
          <el-option
            v-for="item in roleList"
            clearable
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="form.name" style="width:240px" rows="6" type="textarea"></el-input>
      </el-form-item>
      <el-form-item label="">
        <el-button class="channel-baseinfo-save" type="primary" @click="onSubmit">保存</el-button>
        <el-button type="primary" plain class="channel-baseinfo-save" @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        name: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ]
      },
      dialogVisible: false,
      dialogForm: {},
      isClick: false,
      sendBtnText: '发送验证码',
      countdownTime: 60,
      countdownTimer: {},
      roleList: {},
      type: true
    };
  },
  methods: {
    onSubmit() {},
    cancel () {
      this.$router.push({path: 'accountSetting'})
    },
    edit() {
      this.dialogVisible = true
    },
    resetBtn() {
      this.countdownTime = 60
      this.isClick = false
      this.sendBtnText = '重新发送'
      clearInterval(this.countdownTimer)
      this.countdownTimer = null
    },
    sendCode() {
      this.isClick = true
      this.sendBtnText = `重新发送(${this.countdownTime})`
      this.countdownTimer = setInterval(() => {
        console.log(this.countdownTime)
        this.countdownTime -= 1
        this.sendBtnText = `重新发送(${this.countdownTime})`
        if (!this.countdownTime) {
          this.resetBtn()
        }
      }, 1000)
    },
    confirmEdit() {
      // 增加延时,防止在消失时看到重新发送, 优化用户体验
      setTimeout(() => {
        this.resetBtn()
      }, 500)
      this.dialogVisible = false
    }
  },
  mounted() {
    // let nameInput = document.getElementById('channel-baseInfo-name-input')
    // let contactInput = document.getElementById('channel-baseInfo-contact-input')
  },
  created() {
    this.type = this.$route.query.id ? false : true // 由于query过来的参数是string, 所以要转换为number方便判断
    console.log(this.type)
  }
}
</script>

<style lang="scss" scoped>
.km-setting-account-add {
  display: flex;
  justify-content: center;
  padding-top: 48px;
}
.channel-baseinfo-save {
  padding: 8px 23px;
}
.km-baseinfo-cancel {
  padding: 8px 23px;
}
.km-setting-dialog {
  /deep/.el-dialog__body {
    display: flex;
    justify-content: center;
  }
}
.clicked {
  padding: 8px 7px;
}
</style>
