<template>
  <div class="km-setting-baseInfo">
    <el-form ref="form" size="small" :rules="rules" :model="form" label-width="100px" style="width:23%">
      <el-form-item label="账号">
        <span>18512457412</span>
      </el-form-item>
      <el-form-item label="经销商编号">
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
        <el-button type="primary" @click="onSubmit">保存</el-button>
      </el-form-item>
    </el-form>
    <el-dialog
      class="km-setting-dialog"
      title="修改联系人手机号"
      :visible.sync="dialogVisible"
      width="27%">
      <el-form :model="dialogForm" ref="dialogForm" size="small" style="width: 60%" label-width="70px">
        <el-form-item label="新手机" required>
          <el-input v-model="dialogForm.name"></el-input>
        </el-form-item>
        <el-form-item label="验证码" required>
          <el-row>
            <el-col :span="12">
              <el-input v-model="dialogForm.name"></el-input>
            </el-col>
            <el-col :span="12">
              <el-button style="float: right" @click="sendCode" :disabled="isClick" type="primary">{{sendBtnText}}</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmEdit">确认修改</el-button>
      </span>
    </el-dialog>
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
      countdownTimer: {}
    };
  },
  methods: {
    onSubmit() {},
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
      this.sendBtnText = `重新发送 (${this.countdownTime})`
      this.countdownTimer = setInterval(() => {
        console.log(this.countdownTime)
        this.countdownTime -= 1
        this.sendBtnText = `重新发送 (${this.countdownTime})`
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
}
</script>

<style lang="scss" scoped>
.km-setting-baseInfo {
  display: flex;
  justify-content: center;
  .km-setting-edit {
    padding: 0 16px;
    font-size:14px;
    font-family:PingFangSC-Regular,PingFang SC;
    font-weight:400;
    color:rgba(51,119,255,1);
  };
  .km-setting-dialog {
    /deep/.el-dialog {
      border-radius:6px;
      /deep/.el-dialog__header {
        border-bottom: 1px solid rgba(230,233,240,1);
        /deep/.el-dialog__headerbtn {
          /deep/.el-icon-close {
            width:20px;
            height:20px;
            color:rgba(102,102,102,1);
          }
        }
      };
      /deep/.el-dialog__body {
        display: flex;
        justify-content: center;
      }
    }
  }
}
</style>
