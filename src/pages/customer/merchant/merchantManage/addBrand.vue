<template>
  <div>
    <div class="data-box">
      <div class="com-edit-wrapper">
        <el-form :model="ruleForm" :rules="rules" size="small" ref="ruleForm" label-width="150px" class="com-edit-ruleForm xdd-btn-block__w240">
          <div class="com-edit-item" style="padding-top: 0">
            <div class="com-edit-block">
              <div class="com-edit-ruleForm__content">
                <el-form-item label="商户：" prop="adminId">
                  <el-select v-model="ruleForm.adminId" placeholder="请选择商户" clearable>
                    <el-option v-for="item in adminOptions" :key="item.id" :label="item.companyName" :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="品牌名称：" prop="name">
                  <el-input v-model="ruleForm.name" maxlength="50" placeholder=""></el-input>
                </el-form-item>
                <el-form-item label="品牌LOGO1111：" prop="logo">
                  <el-upload class="avatar-uploader" action="https://jsonplaceholder.typicode.com/posts/" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                    <img v-if="imageUrl" :src="imageUrl" class="avatar">
                    <span v-else class="avatar-uploader-icon-block">
                      <i class="el-icon-plus avatar-uploader-icon"></i>
                      <span class="avatar-uploader-text">上传照片</span>
                    </span>
                  </el-upload>
                  <span class="avatar__msg">建议尺寸 600*600，大小不超过 2M</span>
                </el-form-item>
                <el-form-item label="品牌行业：" prop="tradeTypeId">
                  <brand-select v-model="brandValue"></brand-select>
                </el-form-item>
                <el-form-item label="ERP行业：" prop="industryId" class="msg-block">
                  <el-select v-model="ruleForm.industryId" placeholder="请选择行业" clearable>
                    <el-option v-for="item in industryOptions" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                  </el-select>
                  <span class="msg">注：使用科脉ERP才需要选择此项</span>
                </el-form-item>
                <el-form-item label="ERP产品：" prop="erpProductId" class="msg-block">
                  <el-select v-model="ruleForm.erpProductId" placeholder="请选择产品" clearable>
                    <el-option v-for="item in erpProductOptions" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                  </el-select>
                  <span class="msg">注：使用科脉ERP才需要选择此项</span>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" :loading="submitLoading" @click="submitForm()">保存</el-button>
                  <el-button @click="onCancel">取消</el-button>
                </el-form-item>
              </div>
            </div>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import {
  queryShopListByPage,
  queryProductInfoByIndustryId,
  addMerchant,
} from '@/api/customer/merchant'
import BrandSelect from '@/components/brandSelect'

export default {
  name: 'addBrand',
  components: {
    BrandSelect,
  },
  props: {},
  data() {
    const validatorTradeType = (rule, value, callback) => {
      const val = this.brandValue
      if (val?.length === 0) {
        callback('请选择品牌行业')
      } else {
        callback()
      }
    }

    return {
      submitLoading: false,
      brandValue: [],
      erpProductOptions: [],
      industryOptions: [],
      adminOptions: [],
      ruleForm: {
        adminId: '',
        erpProductId: '',
        id: '',
        industryId: '',
        logo: '',
        name: '',
        tradeTypeId: '',
      },
      rules: {
        adminId: { required: true, message: '请选择商户', trigger: 'change' },
        name: { required: true, message: '请输入品牌名称', trigger: 'blur' },
        tradeTypeId: {
          required: true,
          validator: validatorTradeType,
          trigger: 'change',
        },
      },
      imageUrl: '',
    }
  },
  computed: {},
  watch: {
    'ruleForm.industryId': function (val) {
      this.ruleForm.erpProductId = ''
      if (val === '') {
        this.erpProductOptions = []
      } else {
        queryProductInfoByIndustryId({ industryId: val }).then(
          (erpProductRes) => {
            this.erpProductOptions = erpProductRes
          }
        )
      }
    },
    brandValue(val) {
      if (val.length > 0) {
        this.ruleForm.tradeTypeId = val[1]
      } else {
        this.ruleForm.tradeTypeId = ''
      }
    },
  },
  created() {
    this.queryShopListByPage()
    this.queryProductInfoByIndustryId()
  },
  methods: {
    queryProductInfoByIndustryId() {
      queryProductInfoByIndustryId({ industryId: 0 }).then((industryRes) => {
        this.industryOptions = industryRes
      })
    },
    queryShopListByPage() {
      const params = {
        clerkId: '',
        id: '',
        mobile: '',
        page: 1,
        rows: 500,
        status: '',
        topAgentId: '',
      }
      queryShopListByPage(params).then((res) => {
        this.adminOptions = res.results
      })
    },
    submitForm() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.submitLoading = true
          addMerchant(this.ruleForm)
            .then(() => {
              this.$message.success('保存成功')
              this.$router.push({ path: '/customer/merchant/brandHome' })
            })
            .finally(() => {
              this.submitLoading = false
            })
        }
      })
    },
    onCancel() {
      this.$store.dispatch('delTagView', this.$route).then(() => {
        this.$router.push({ path: '/customer/merchant/brandHome' })
      })
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
  },
}
</script>

<style lang="scss" scoped>
.com-edit-item:last-child {
  padding-top: 30px;
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
  width: 390px;
}
.msg-block {
  position: relative;
}
.msg {
  position: absolute;
  left: 250px;
  width: 250px;
  font-size: 14px;
  color: #cad1e0;
}

.avatar-uploader {
  height: 82px;
  overflow: hidden;
}
.avatar-uploader /deep/ .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader /deep/ .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon-block {
  display: inline-block;
  width: 80px;
  height: 80px;
  background-color: #f7f8fa;
}
.avatar-uploader-icon {
  margin-top: 15px;
  font-size: 18px;
  color: #8c939d;
}
.avatar {
  width: 80px;
  height: 80px;
  display: block;
}
.avatar__msg {
  font-size: 14px;
  color: #cad1e0;
}
.avatar-uploader-text {
  display: block;
  font-size: 14px;
  line-height: 1;
  color: #8f9bb3;
}
</style>
