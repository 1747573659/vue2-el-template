<template>
  <div class="data-box">
    <div class="km-setting-baseInfo">
      <el-form ref="form" size="small" :rules="rules" label-suffix=":" :model="form" label-width="110px" style="width: 384.30px">
        <el-form-item label="经销商编号" class="km-setting-baseInfo-text">
          <span>{{ form.agentId }}</span>
        </el-form-item>
        <el-form-item label="经销商名称" prop="name">
          <el-row>
            <el-col :span="21">
              <el-input v-model="form.name"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="联系人" prop="contact">
          <el-row>
            <el-col :span="21">
              <el-input v-model="form.contact"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="联系人手机" prop="mobile">
          <el-row>
            <el-col :span="21">
              <el-input disabled v-model="form.mobile"></el-input>
            </el-col>
            <el-col :span="3">
              <el-button type="text" class="km-setting-edit" v-permission="'BASEINFO_INDEX_EDIT'" @click="edit">修改</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="联系人邮箱" prop="email">
          <el-row>
            <el-col :span="21">
              <el-input v-model="form.email"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="注册时间">
          <span>{{ form.createTime }}</span>
        </el-form-item>
        <el-form-item label="社区编码">
          <span>{{ form.organNo }}</span>
        </el-form-item>
        <el-form-item label="">
          <el-button class="channel-baseinfo-save" type="primary" v-permission="'BASEINFO_INDEX_EDIT'" @click="onSubmit">保存</el-button>
        </el-form-item>
      </el-form>
      <el-dialog class="km-setting-dialog" title="修改联系人手机号" :visible.sync="dialogVisible" width="490px">
        <el-form ref="dialogForm" :rules="dialogRules" :model="dialogForm" label-suffix=":" size="small" style="width: 60%" label-width="70px">
          <el-form-item label="新手机" prop="mobile">
            <el-input v-model="dialogForm.mobile"></el-input>
          </el-form-item>
          <el-form-item label="验证码" prop="codeKey">
            <el-input style="width: 102px;display:inline-block" v-model="dialogForm.codeKey"></el-input>
            <el-button style="float: right" class="resend-btn" :class="{ clicked: isClick, disabled: isDisabled }" size="small" @click="sendCode" :disabled="isDisabled">
              {{ sendBtnText }}
            </el-button>
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
import { queryBaseInfo, modifyBaseInfo, checkAgentName } from '@/api/setting/baseInfo'
import { createAuthCode, modifyMobile } from '@/api/sms/sms'

export default {
  name: 'baseInfoIndex',
  data() {
    const mobileRule = (rule, value, callback) => {
      if (/^1[3456789]\d{9}$/.test(value)) {
        if (value === this.form.mobile) {
          callback('新旧手机一样,无需修改')
        } else {
          callback()
        }
      } else {
        callback('请输入正确的手机号')
      }
    }
    const nameRule = async (rule, value, callback) => {
      if (value.length === 0) {
        callback('请输入角色名称')
      } else if (value.length > 30) {
        callback('角色名称应少于30个字符')
      } else if (value !== this.form.usedName) {
        // 当编辑的时候，如果当前修改后的名字和原本的名字一样则不触发校验
        try {
          const res = await checkAgentName({ name: value })
          callback(res)
        } catch (e) {}
      }
    }
    return {
      form: {
        loginName: '',
        agentId: null,
        usedName: '',
        name: '',
        contact: '',
        mobile: '',
        email: '',
        createTime: ''
      },
      rules: {
        name: [{ required: true, validator: nameRule, trigger: 'blur' }],
        contact: [
          { required: true, message: '请输入联系人', trigger: 'blur' },
          { max: 30, message: '长度在 30 个字符以内', trigger: 'blur' }
        ],
        mobile: [{ required: true, message: '请输入联系人手机', trigger: 'blur' }],
        email: [
          { required: true, type: 'email', message: '请输入正确的邮箱', trigger: 'blur' },
          { max: 30, message: '长度在 30 个字符以内', trigger: 'blur' }
        ]
      },
      dialogRules: {
        mobile: [{ required: true, trigger: 'blur', validator: mobileRule }],
        codeKey: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
      },
      dialogVisible: false,
      dialogForm: {
        mobile: '',
        codeKey: ''
      },
      isClick: false,
      sendBtnText: '发送验证码',
      countdownTime: 60,
      countdownTimer: {},
      isDisabled: false
    }
  },
  methods: {
    async getInfo() {
      try {
        let res = await queryBaseInfo()
        this.form = res
        this.form.usedName = res.name
      } catch (e) {}
    },
    async onSubmit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          let data = {
            name: this.form.name,
            contact: this.form.contact,
            email: this.form.email,
            mobile: this.form.mobile
          }
          try {
            let res = await modifyBaseInfo(data)
            this.getInfo()
            this.$message.success('保存成功')
          } catch (e) {}
        }
      })
    },
    edit() {
      this.dialogVisible = true
      this.$nextTick(() => {
        this.dialogForm = { mobile: '', codeKey: '' }
        this.$refs.dialogForm.resetFields()
      })
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
      this.$refs.dialogForm.validateField('mobile', async errorMessage => {
        if (!errorMessage) {
          try {
            let res = await createAuthCode({ mobile: this.dialogForm.mobile })
            this.isClick = false
            this.isDisabled = true
            this.sendBtnText = `重新发送${this.countdownTime}s`
            this.countdownTimer = setInterval(() => {
              this.countdownTime -= 1
              this.sendBtnText = `重新发送${this.countdownTime}s`
              if (!this.countdownTime) {
                this.resetBtn()
              }
            }, 1000)
          } catch (e) {}
        }
      })
    },
    async confirmEdit() {
      this.$refs.dialogForm.validate(async valid => {
        if (valid) {
          let data = {
            codeKey: this.dialogForm.codeKey,
            mobile: this.dialogForm.mobile
          }
          try {
            const res = await modifyMobile(data)
            this.$message.success('修改成功')
            this.form.mobile = this.dialogForm.mobile
            this.dialogVisible = false
            setTimeout(() => {
              this.resetBtn()
            }, 500) // 增加延时,防止在消失时看到重新发送, 优化用户体验
          } catch (e) {}
        }
      })
    }
  },
  mounted() {
    this.getInfo()
  }
}
</script>

<style lang="scss" scoped>
.data-box {
  border-top: 16px solid#f7f8fa;
}
.km-setting-baseInfo {
  display: flex;
  justify-content: center;
  padding-top: 20px;
  .km-setting-edit {
    padding: 0 16px;
  }
  .km-setting-baseInfo-text {
    /deep/.el-form-item__label,
    /deep/.el-form-item__content {
      line-height: normal;
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
      padding: 8px 9px;
    }
    .clicked {
      padding: 8px 15px;
    }
    .disabled {
      padding: 8px 0px;
      width: 90px;
    }
  }
}
</style>
