<template>
  <div v-permission.page="'MERCHANT_SET_EDIT'" class="km-container__inner">
    <div class="data-box">
      <div class="com-edit-wrapper">
        <el-form :model="ruleForm" size="small" :rules="rules" ref="ruleForm" label-width="150px" class="com-edit-ruleForm">
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
                <!-- <el-form-item label="商户类型：" prop="type">
                  <el-select
                    style="width: 240px;"
                    v-model="ruleForm.type"
                    placeholder="请选择产品"
                  >
                    <el-option
                      v-for="item in typeOptions"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    >
                    </el-option>
                  </el-select>
                </el-form-item> -->
                <el-form-item label="地区：" prop="districtCode">
                  <area-select :areaList="areaValue" :key="areaKey" @change="areaChange"></area-select>
                </el-form-item>
                <el-form-item label="详细地址：" prop="address">
                  <el-input v-model="ruleForm.address" placeholder=""></el-input>
                </el-form-item>
                <el-form-item label="运营者姓名：" prop="contactor">
                  <el-input v-model="ruleForm.contactor" placeholder=""></el-input>
                </el-form-item>
                <el-form-item label="运营者手机：" prop="mobile" required>
                  <span>{{ ruleForm.mobile }}</span>
                </el-form-item>
                <el-form-item label="运营者邮箱：" prop="email">
                  <el-input v-model="ruleForm.email" placeholder=""></el-input>
                </el-form-item>
                <el-form-item label="业务员：">
                  <el-select v-model="ruleForm.clerkId" placeholder="请选择业务员" clearable>
                    <el-option v-for="item in clerkOptions" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
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
      </div>
    </div>
  </div>
</template>

<script>
import {
  queryShopById,
  queryClerkList,
  modifyShop,
  queryDistricDto,
  checkShopName,
} from '@/api/customer/merchant'
import AreaSelect from '@/components/areaSelect'
import { isEmail } from '@/utils/common'

export default {
  name: 'editMerchant',
  components: {
    AreaSelect,
  },
  data() {
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
        checkShopName({ name: value }).then((res) => {
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
        { id: 3, name: '单店' },
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
        type: 2,
      },
      rules: {
        companyName: {
          required: true,
          validator: validatorCompanyName,
          trigger: 'blur',
        },
        shortName: {
          required: true,
          message: '请输入商户简称',
          trigger: 'blur',
        },
        districtCode: {
          required: true,
          message: '请选择地址',
          trigger: 'change',
        },
        address: { required: true, message: '请输入详细地址', trigger: 'blur' },
        contactor: {
          required: true,
          message: '请输入运营者姓名',
          trigger: 'blur',
        },
        email: {
          required: true,
          validator: validatorEmail,
          trigger: 'blur',
        },
        type: { required: true, message: '请选择商户类型', trigger: 'change' },
      },
      imageUrl: '',
    }
  },
  created() {
    this.queryClerkList()
    this.queryShopById()
  },
  methods: {
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
      queryClerkList().then((res) => {
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
        type: res.type,
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
      this.$refs['ruleForm'].validate((valid) => {
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
</style>
