<template>
  <div class="data-box" v-permission.page="'MERCHANT_SET_EDIT'">
    <el-form :model="ruleForm" size="small" :rules="rules" ref="ruleForm" label-width="170px" class="com-edit-ruleForm">
      <div class="com-edit-item" style="padding-top: 0">
        <div class="com-edit-block">
          <div class="com-edit-ruleForm__content">
            <el-form-item label="商户编号：">
              <span>{{ ruleForm.id || '--' }}</span>
            </el-form-item>
            <el-form-item label="商户名称：" prop="companyName">
              <el-input v-model="ruleForm.companyName" placeholder="商户名称需与营业执照一致"></el-input>
            </el-form-item>
            <el-form-item label="商户简称：" prop="shortName">
              <el-input v-model="ruleForm.shortName" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="行业：">
              <span>{{ tradeFullName || '--' }}</span>
            </el-form-item>
            <el-form-item label="地区：" prop="districtCode">
              <area-select :areaList="areaValue" :key="areaKey" @change="areaChange"></area-select>
            </el-form-item>
            <el-form-item label="详细地址：" prop="address">
              <el-input v-model="ruleForm.address" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="联系人：" prop="contactor">
              <el-input v-model="ruleForm.contactor" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="联系人手机（账号）：" prop="mobile" required>
              <div style="position: relative">
                <el-input disabled v-model="ruleForm.mobile"></el-input>
                <el-button @click="dialogVisible = true" style=" position: absolute;right:-46px;top:9px" type="text">修改</el-button>
              </div>
            </el-form-item>
            <el-form-item label="联系人邮箱：" prop="email">
              <el-input v-model="ruleForm.email" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="业务员：">
              <el-select v-model="ruleForm.clerkId" placeholder="请选择业务员" clearable>
                <el-option v-for="item in clerkOptions" :key="item.id" :label="item.name" :value="item.id"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="商户密钥：">
              <span>{{ signKey || '--' }}</span>
            </el-form-item>
            <el-form-item label="创建时间：">
              <span>{{ createTime || '--' }}</span>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :loading="submitLoading" @click="submitForm()">保存</el-button>
              <el-button @click="onCancel">取消</el-button>
            </el-form-item>
          </div>
        </div>
      </div>
    </el-form>

    <el-dialog class="km-setting-dialog" title="修改联系人手机号" :visible.sync="dialogVisible" width="520px">
      <el-form ref="dialogForm" :rules="dialogRules" :model="dialogForm" label-suffix=":" size="small" style="width: 60%" label-width="70px">
        <el-form-item label="新手机" prop="mobile">
          <el-input maxlength="11" v-model="dialogForm.mobile"></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="codeKey">
          <el-input style="width: 102px;display:inline-block" maxlength="6" v-model="dialogForm.codeKey"></el-input>
          <el-button style="float: right" @click="sendCode" class="resend-btn" :class="{ clicked: isClick, disabled: isDisabled }" size="small" :disabled="isDisabled">
            {{ sendBtnText }}
          </el-button>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false" class="km-baseinfo-cancel">取消</el-button>
        <el-button size="small" @click="confirmEdit" type="primary">确认修改</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { queryShopById, queryClerkList, modifyShop, queryDistricDto, checkShopName } from '@/api/customer/merchant'
import AreaSelect from '@/components/areaSelect'
import { isEmail } from '@/utils/common'
import { createAuthCode, shopModifyMobile } from '@/api/sms/sms'

export default {
  name: 'editMerchant',
  components: {
    AreaSelect
  },
  data() {
    const mobileRule = (rule, value, callback) => {
      if (/^1[3456789]\d{9}$/.test(value)) {
        if (value === this.ruleForm.mobile) {
          callback('新旧手机一样,无需修改')
        } else {
          callback()
        }
      } else {
        callback('请输入正确的手机号')
      }
    }
    const validatorEmail = (rule, value, callback) => {
      if (value.length === 0) {
        callback('请输入邮箱')
      } else if (isEmail(value)) {
        callback()
      } else {
        callback('请输入正确的邮箱')
      }
    }

    const validatorCompanyName = (rule, value, callback) => {
      if (value === '') {
        callback('请输入商户名称')
      } else if (value !== this.checkShopName) {
        checkShopName({ name: value }).then(res => {
          if (res) {
            callback(res)
          } else {
            callback()
          }
        })
      } else {
        callback()
      }
    }

    return {
      isClick: false,
      sendBtnText: '发送验证码',
      countdownTime: 60,
      isDisabled: false,
      dialogRules: {
        mobile: [{ required: true, trigger: 'blur', validator: mobileRule }],
        codeKey: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
      },
      dialogForm: {
        mobile: '',
        codeKey: ''
      },
      dialogVisible: false,
      checkShopName: '',
      submitLoading: false,
      areaKey: 0,
      areaValue: [],
      tradeFullName: '',
      signKey: '',
      createTime: '',
      options: [],
      clerkOptions: [],
      typeOptions: [
        { id: 1, name: '普通连锁（单品牌）' },
        { id: 2, name: '多品牌连锁（多公众号）' },
        { id: 3, name: '单店' }
      ],
      ruleForm: {
        address: '',
        clerkId: '',
        companyName: '',
        contactor: '',
        districtCode: '',
        email: '',
        id: 0,
        mobile: '',
        shortName: '',
        type: 2
      },
      rules: {
        companyName: {
          required: true,
          validator: validatorCompanyName,
          trigger: 'blur'
        },
        shortName: {
          required: true,
          message: '请输入商户简称',
          trigger: 'blur'
        },
        districtCode: {
          required: true,
          message: '请选择地址',
          trigger: 'change'
        },
        address: { required: true, message: '请输入详细地址', trigger: 'blur' },
        contactor: {
          required: true,
          message: '请输入联系人姓名',
          trigger: 'blur'
        },
        email: {
          required: true,
          validator: validatorEmail,
          trigger: 'blur'
        },
        type: { required: true, message: '请选择商户类型', trigger: 'change' }
      },
      imageUrl: ''
    }
  },
  created() {
    this.queryClerkList()
    this.queryShopById()
  },
  methods: {
    async confirmEdit() {
      this.$refs.dialogForm.validate(async valid => {
        if (valid) {
          let data = {
            codeKey: this.dialogForm.codeKey,
            mobile: this.dialogForm.mobile,
            shopId: Number(this.$route.query.id)
          }
          try {
            const res = await shopModifyMobile(data)
            this.$message.success('修改成功')
            this.ruleForm.mobile = this.dialogForm.mobile
            this.dialogVisible = false
            setTimeout(() => {
              this.resetBtn()
            }, 500) // 增加延时,防止在消失时看到重新发送, 优化用户体验
          } catch (e) {}
        }
      })
    },
    resetBtn() {
      this.countdownTime = 60
      this.isClick = true
      this.isDisabled = false
      this.sendBtnText = '重新发送'
    },
    setCodeText() {
      this.sendBtnText = `重新发送${this.countdownTime}s`
      this.countdownTime -= 1
      if (this.countdownTime <= 0) {
        this.resetBtn()
        return
      }
      setTimeout(() => {
        this.setCodeText()
      }, 1000)
    },
    sendCode() {
      this.$refs.dialogForm.validateField('mobile', async errorMessage => {
        if (!errorMessage) {
          try {
            let res = await createAuthCode({ mobile: this.dialogForm.mobile })
            this.isClick = false
            this.isDisabled = true
            this.setCodeText()
          } catch (e) {}
        }
      })
    },
    areaChange(value) {
      this.areaValue = value

      if (value.length === 0) {
        this.ruleForm.districtCode = ''
      } else if (value.length === 2) {
        this.ruleForm.districtCode = value[1]
      } else {
        this.ruleForm.districtCode = value[2]
      }
    },
    queryClerkList() {
      queryClerkList().then(res => {
        this.clerkOptions = res
      })
    },
    async queryShopById() {
      const res = await queryShopById({ id: Number(this.$route.query.id) })
      this.ruleForm = {
        address: res.address,
        clerkId: res.clerkId,
        companyName: res.companyName,
        contactor: res.contactor,
        districtCode: res.districtCode,
        email: res.email,
        id: res.id,
        mobile: res.mobile,
        shortName: res.shortName,
        type: res.type
      }

      this.checkShopName = res.companyName
      this.tradeFullName = res.tradeFullName
      this.signKey = res.signKey
      this.createTime = res.createTime

      if (res.districtCode) {
        const areaRes = await queryDistricDto({ code: res.districtCode })
        this.areaValue[0] = areaRes.provinceCode
        this.areaValue[1] = areaRes.cityCode
        if (areaRes.zoneCode) {
          this.areaValue[2] = areaRes.zoneCode
        }
        this.areaKey += 1
      }
    },
    submitForm() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          this.submitLoading = true
          modifyShop(this.ruleForm)
            .then(() => {
              this.$message.success('保存成功！')
              this.$store.dispatch('delTagView', this.$route).then(() => {
                this.$router.push({ path: '/customer/merchant/merchantManage' })
              })
            })
            .finally(() => {
              this.submitLoading = false
            })
        }
      })
    },
    onCancel() {
      this.$store.dispatch('delTagView', this.$route).then(() => {
        this.$router.push({ path: '/customer/merchant/merchantManage' })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.data-box{
  border-top: 16px solid #f7f8fa;
}
.com-edit-block {
  display: flex;
  justify-content: center;
}
.com-edit-title {
  padding: 0 16px 16px;
  border-bottom: 1px solid #e6e9f0;
  line-height: 1;
  color: #1f2e4d;
}
.com-edit-ruleForm__content {
  padding-top: 20px;
  width: auto;
  margin-right: 130px;
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
