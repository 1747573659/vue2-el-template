<template>
  <div class="data-box" v-permission.page="'BRAND_SET_EDIT'">
    <div class="com-edit-wrapper">
      <el-form :model="ruleForm" size="small" :rules="rules" ref="ruleForm" label-width="150px" class="com-edit-ruleForm xdd-btn-block__w240">
        <div class="com-edit-item" style="padding-top: 0">
          <div class="com-edit-block">
            <div class="com-edit-ruleForm__content">
              <el-form-item label="商户：">
                <span>{{ adminName || '--' }}</span>
              </el-form-item>
              <el-form-item label="品牌编码：">
                <span>{{ mid || '--' }}</span>
              </el-form-item>
              <el-form-item label="品牌名称：" prop="name">
                <el-input v-model="ruleForm.name" placeholder=""></el-input>
              </el-form-item>
              <el-form-item label="品牌LOGO：">
                <pic-upload :uploadUrl="uploadUrl" :imageUrl="ruleForm.logo" :fileServer="ossFileServe" :showIconClose="true" @on-remove="onRemove" @on-success="onUploadSuccess">
                </pic-upload>
              </el-form-item>
              <el-form-item label="品牌行业：" prop="tradeTypeId">
                <brand-select v-model="brandValue" :key="brandKey"></brand-select>
              </el-form-item>
              <el-form-item label="ERP行业：">
                <span>{{ erpIndustryName || '--' }}</span>
              </el-form-item>
              <el-form-item label="ERP产品：">
                <span>{{ erpProductName || '--' }}</span>
              </el-form-item>
              <el-form-item label="密钥：">
                <span class="signKey-text">{{ signKey || '--' }}</span>
              </el-form-item>
              <el-form-item label="门店数：">
                <span>{{ storeNum || 0 }}</span>
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
</template>

<script>
import { queryMerchantById, addMerchant, checkMerchant } from '@/api/customer/merchant'
import BrandSelect from '@/components/brandSelect'
import PicUpload from '@/components/picUpload'
import picUploadMixin from '@/mixins/picUpload'

export default {
  name: 'editBrand',
  components: {
    BrandSelect,
    PicUpload
  },
  mixins: [picUploadMixin],
  data() {
    const validatorTradeType = (rule, value, callback) => {
      const val = this.brandValue
      if (val?.length === 0) {
        callback('请选择品牌行业')
      } else {
        callback()
      }
    }

    const validatorName = (rule, value, callback) => {
      if (value === '') {
        callback('请输入品牌名称')
      } else if (value !== this.validatorName) {
        checkMerchant({ name: value, adminId: this.ruleForm.adminId }).then(res => {
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
      uploadUrl: process.env.VUE_APP_BASE_API + '/oss/uploadFile',
      submitLoading: false,
      brandKey: 0,
      brandValue: [],
      adminName: '',
      mid: '',
      erpIndustryName: '',
      erpProductName: '',
      signKey: '',
      storeNum: '',
      ruleForm: {
        adminId: '',
        erpProductId: '',
        id: '',
        industryId: '',
        logo: '',
        name: '',
        tradeTypeId: ''
      },
      rules: {
        // name: { required: true, message: '请输入品牌名称', trigger: 'blur' },
        name: { required: true, validator: validatorName, trigger: 'blur' },
        // logo: { required: true, message: '请选择图片' },
        tradeTypeId: {
          required: true,
          validator: validatorTradeType,
          trigger: 'change'
        }
      }
    }
  },
  watch: {
    brandValue(val) {
      if (val.length > 0) {
        this.ruleForm.tradeTypeId = val[1]
      } else {
        this.ruleForm.tradeTypeId = ''
      }
    }
  },
  created() {
    this.queryMerchantById()
  },
  methods: {
    onRemove() {
      this.ruleForm.logo = ''
    },
    onUploadSuccess(res) {
      this.ruleForm.logo = res.data.path
    },
    queryMerchantById() {
      queryMerchantById({ id: Number(this.$route.query.id) }).then(res => {
        this.ruleForm = {
          adminId: res.adminId,
          erpProductId: res.erpProductId,
          id: res.id,
          industryId: res.industryId,
          logo: res.logo,
          name: res.name,
          tradeTypeId: res.tradeTypeId
        }

        this.validatorName = res.name
        this.brandValue = [res.topTradeTypeId, res.tradeTypeId]
        this.brandKey += 1
        this.adminName = res.adminName
        this.mid = res.mid
        this.erpIndustryName = res.erpIndustryName
        this.erpProductName = res.erpProductName
        this.signKey = res.signKey
        this.storeNum = res.storeNum
      })
    },
    submitForm() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          this.submitLoading = true
          this.$store.dispatch('delTagView', this.$route).then(() => {
            addMerchant(this.ruleForm)
              .then(() => {
                this.$message.success('保存成功')
                this.$store.dispatch('delTagView', this.$route).then(() => {
                  this.$router.push({ path: '/customer/merchant/brandHome' })
                })
              })
              .finally(() => {
                this.submitLoading = false
              })
          })
        }
      })
    },
    onCancel() {
      this.$store.dispatch('delTagView', this.$route).then(() => {
        this.$router.push({ path: '/customer/merchant/brandHome' })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.data-box {
  border-top: 16px solid #f7f8fa;
}
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
.signKey-text {
  white-space: nowrap;
}
</style>
