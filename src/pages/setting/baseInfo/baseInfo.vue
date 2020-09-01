<template>
  <div class="data-box">
    <div class="km-setting-baseInfo">
      <el-form ref="form" size="small" :rules="rules" label-suffix=":" :model="form" label-width="110px" style="width: 384.30px">
        <el-form-item label="账号" class="km-setting-baseInfo-text">
          <span>18512457412</span>
        </el-form-item>
        <el-form-item label="经销商编号" class="km-setting-baseInfo-text">
          <span>00001</span>
        </el-form-item>
        <el-form-item label="经销商名称" required>
          <el-row>
            <el-col :span="21">
              <el-input v-model="form.name"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="联系人" required>
          <el-row>
            <el-col :span="21">
              <el-input v-model="form.name"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="联系人手机" required>
          <el-row>
            <el-col :span="21">
              <el-input v-model="form.name"></el-input>
            </el-col>
            <el-col :span="3">
              <el-button type="text" class="km-setting-edit" @click="edit">修改</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="联系人邮箱" required>
          <el-row>
            <el-col :span="21">
              <el-input v-model="form.name"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="注册时间">
          <span>2020-10-10 10:00</span>
        </el-form-item>
        <el-form-item label="">
          <el-button class="channel-baseinfo-save" type="primary" @click="onSubmit">保存</el-button>
        </el-form-item>
      </el-form>
      <el-dialog
        class="km-setting-dialog"
        title="修改联系人手机号"
        :visible.sync="dialogVisible"
        width="490px">
        <el-form :model="dialogForm" label-suffix=":" ref="dialogForm" size="small" style="width: 60%" label-width="70px">
          <el-form-item label="新手机" required>
            <el-input v-model="dialogForm.name"></el-input>
          </el-form-item>
          <el-form-item label="验证码" required>
            <el-input style="width: 112px;display:line-block" v-model="dialogForm.name"></el-input>
            <el-button style="float: right" class="resend-btn" :class="{ clicked: isClick, disabled: isDisabled }" size="small" @click="sendCode" :disabled="isDisabled">{{sendBtnText}}</el-button>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="dialogVisible = false" class="km-baseinfo-cancel">取消</el-button>
          <el-button size="small" type="primary" @click="confirmEdit">确认修改</el-button>
        </span>
      </el-dialog>
    </div>
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
      isDisabled: false
    };
  },
  methods: {
    onSubmit() {},
    edit() {
      this.dialogVisible = true
    },
    resetBtn() {
      this.countdownTime = 60
      this.isClick = true
      this.isDisabled = false
      this.sendBtnText = '重新发送'
      clearInterval(this.countdownTimer)
      this.countdownTimer = null
    },
    sendCode() {
      this.isClick = false
      this.isDisabled = true
      this.sendBtnText = `重新发送(${this.countdownTime})`
      this.countdownTimer = setInterval(() => {
        console.log(this.countdownTime)
        this.countdownTime -= 1
        this.sendBtnText = `重新发送(${this.countdownTime})`
        if (!this.countdownTime) {
          this.resetBtn()
        }
      }, 100)
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
}
</script>

<style lang="scss" scoped>
.km-setting-baseInfo {
  display: flex;
  justify-content: center;
  padding-top: 20px;
  .km-setting-edit {
    padding: 0 16px;
  };
  .km-setting-baseInfo-text {
    /deep/.el-form-item__label, /deep/.el-form-item__content {
      line-height: normal
    }
  }
}
.channel-baseinfo-save {
  padding: 8px 23px;
}
.km-baseinfo-cancel {
  padding: 8px 22px;
}
.km-setting-dialog {
  /deep/.el-dialog__body {
    display: flex;
    justify-content: center;
    .resend-btn {
      padding:8px 5px;
    }
    .clicked {
      padding: 8px 11px;
    }
    .disabled {
      padding: 8px 0px;
    }
  }
}
</style>
