<template>
  <div class="app-container">
    <div class="data-box">
      <el-alert :closable='false' title="小程序资料用于支付宝小程序审核，请谨慎填写。" type="info"> </el-alert>
      <el-form style="padding:0px 46px" size="mini" ref="form" label-position="top" :model="form" :rules="rules" label-width="120px">
        <h4 class="title">小程序资料</h4>
        <el-row>
          <el-col :span="6">
            <el-form-item label="小程序名称" prop="miniName">
              <el-input v-model.trim="form.miniName" clearable style="width:80%" placeholder="请输入小程序名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="小程序英文名" prop="miniEnglishName">
              <el-input v-model.trim="form.miniEnglishName" clearable style="width:80%" placeholder="请输入小程序英文名"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="小程序类目" prop="miniCategoryIds">
              <el-cascader v-model='form.miniCategoryIds' placeholder='请选择小程序类目' filterable clearable :props="miniCategoryIdsProps"></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="小程序归属地区" prop="region">
              <el-cascader v-model='form.region' placeholder='请选择小程序归属地区' filterable clearable :props="regionProps"></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="小程序简介" prop="miniSlogan">
              <el-input v-model.trim="form.miniSlogan" type="textarea" :autosize="{ minRows: 2, maxRows: 6}" clearable placeholder="请输入小程序简介" style="width:80%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="小程序描述" prop="miniDesc">
              <el-input v-model.trim="form.miniDesc" type="textarea" :autosize="{ minRows: 2, maxRows: 6}" clearable placeholder="请输入小程序描述" style="width:80%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="小程序LOGO" prop="miniLogo">
              <picUpload v-model="form.miniLogo" :imageUrl='form.miniLogo' :showIconClose='true' @on-remove='onRemove("miniLogo")' @on-success='(...value)=>uploadSuccess({
                value,
                upField:"miniLogo"
                })' uploadUrl='/alipay/mini/fileUplaod' desc='只能上传jpg/png格式文件，文件不能超过250kb ' :size='250' accept='image/jpeg,image/jpg,image/png'></picUpload>
            </el-form-item>
          </el-col>
        </el-row>
        <h4 class="title">联系人信息</h4>
        <el-row>
          <el-col :span="6">
            <el-form-item label="客服电话" prop="servicePhone">
              <el-input v-model.trim="form.servicePhone" clearable style="width:80%" placeholder="请输入客服电话"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="客服邮箱" prop="serviceMail">
              <el-input maxlength="128" v-model.trim="form.serviceMail" clearable style="width:80%" placeholder="请输入客服邮箱"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <h4 class="title">商户资料信息</h4>
        <el-row>
          <el-col :span="6">
            <el-form-item label="营业执照号" prop="licenseNo">
              <el-input v-model.trim="form.licenseNo" clearable style="width:80%" placeholder="请输入营业执照号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="营业执照名称" prop="licenseName">
              <el-input v-model.trim="form.licenseName" clearable style="width:80%" placeholder="请输入营业执照名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="营业执照到期日期" prop="licenseStartDate">
              <el-row>
                <span>
                  <el-date-picker @change="()=>{
                    form.licenseEndDate=''
                    }" v-model="form.licenseStartDate" type="date" placeholder="开始日期"></el-date-picker>
                </span>
                <span>
                  -
                </span>
                <span>
                  <el-date-picker :picker-options="pickerOptions" v-model="form.licenseEndDate" type="date" placeholder="结束日期"></el-date-picker>
                </span>
                <el-tooltip effect="dark" content="“结束日期”留空代表长期有效" placement="top">
                  <img :src="questionIcon" alt="提示" style="width:20px;margin:5px 0px 0px 5px" />
                </el-tooltip>
              </el-row>
            </el-form-item>
          </el-col>
        </el-row>
        <h4 class="title">营业执照资料</h4>
        <el-row>
          <el-col :span="4">
            <el-form-item label="营业执照" prop="licensePic">
              <picUpload v-model="form.licensePic" :imageUrl='form.licensePic' :showIconClose='true' @on-remove='onRemove("licensePic")' @on-success='(...value)=>uploadSuccess({
                value,
                upField:"licensePic"
                })' uploadUrl='/alipay/mini/fileUplaod' desc='' :size='4096' accept='image/jpeg,image/jpg,image/png'></picUpload>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="门店门头照" prop="outDoorPic">
              <picUpload v-model="form.outDoorPic" :imageUrl='form.outDoorPic' :showIconClose='true' @on-remove='onRemove("outDoorPic")' @on-success='(...value)=>uploadSuccess({
                value,
                upField:"outDoorPic"
                })' uploadUrl='/alipay/mini/fileUplaod' desc='' :size='4096' accept='image/jpeg,image/jpg,image/png'></picUpload>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="营业执照授权照">
              <picUpload v-model="form.firstSpecialLicensePic" :imageUrl='form.firstSpecialLicensePic' @on-remove='onRemove("firstSpecialLicensePic")' @on-success='(...value)=>uploadSuccess({
                value,
                upField:"firstSpecialLicensePic"
                })' :showIconClose='true' uploadUrl='/alipay/mini/fileUplaod' desc='' :size='4096' accept='image/jpeg,image/jpg,image/png'></picUpload>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="特殊资质照">
              <picUpload v-model="form.secondSpecialLicensePic" :imageUrl='form.secondSpecialLicensePic' @on-remove='onRemove("secondSpecialLicensePic")' @on-success='(...value)=>uploadSuccess({
                value,
                upField:"secondSpecialLicensePic"
                })' :showIconClose='true' uploadUrl='/alipay/mini/fileUplaod' desc='' :size='4096' accept='image/jpeg,image/jpg,image/png'></picUpload>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="其它">
              <picUpload v-model="form.thirdSpecialLicensePic" :imageUrl='form.thirdSpecialLicensePic' @on-remove='onRemove("thirdSpecialLicensePic")' @on-success='(...value)=>uploadSuccess({
                value,
                upField:"thirdSpecialLicensePic"
                })' :showIconClose='true' uploadUrl='/alipay/mini/fileUplaod' desc='' :size='4096' accept='image/jpeg,image/jpg,image/png'></picUpload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="width:100%;text-align: center;padding:20px 0px  100px 0px">
        <template v-if="operation=='add'">
          <el-button :loading="loadingField=='saveBaseData'" @click="saveBaseData(0)" v-permission="'MARKETINGDETILESTAGING'" type="primary" plain>暂存</el-button>
          <el-button :loading="loadingField=='saveBaseData'" @click="saveBaseData(1)" type="primary" v-permission="'MARKETINGDETILESUBMIT'">提交</el-button>
        </template>
         <template v-if="operation=='edit'">
          <el-button :loading="loadingField=='modifyBaseData'" @click="modifyBaseData(0)" v-permission="'MARKETINGDETILESTAGING'" type="primary" plain>暂存</el-button>
          <el-button :loading="loadingField=='modifyBaseData'" @click="modifyBaseData(1)" type="primary" v-permission="'MARKETINGDETILESUBMIT'">提交</el-button>
        </template>
        <el-button @click="cancel" plain>取消</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import picUpload from './../picUpload'
import { saveBaseData, modifyBaseData, queryCategory, queryArea, queryByDatumId } from '@/api/alipay'
import dayjs from 'dayjs'
export default {
  name: 'marketingDetile',
  components: { picUpload },
  data () {
    var checkRegMiniName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入小程序名称'))
      }
      let reg = /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/
      if (!reg.test(value)) {
        return callback(new Error('仅支持中文、数字、英文及下划线'))
      }
      callback()
    }
    var checkRegMiniEnglishName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入小程序英文名'))
      }
      let reg = /^[a-zA-Z0-9]+$/
      if (!reg.test(value)) {
        return callback(new Error('仅支持数字、英文'))
      }
      callback()
    }
    var checkRegServicePhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入客服电话'))
      }
      let reg = /^[0-9-]+$/
      if (!reg.test(value)) {
        return callback(new Error('仅支持数字、-'))
      }
      callback()
    }
    return {
      detileId: '',
      operation: '',
      questionIcon: require('@/assets/images/icon/questioin.png'),
      pickerOptions: {
        disabledDate: time => {
          if (!this.form.licenseStartDate) {
            return false
          }
          return time.getTime() < new Date(this.form.licenseStartDate)
        }
      },
      loadingField: '',
      form: {
        miniName: '', // 小程序名称
        miniEnglishName: '',// 小程序英文名
        miniCategoryIds: [], // 小程序类目
        region: [],// 小程序归属地区
        miniSlogan: '',// 小程序简介
        miniDesc: '',// 小程序描述
        miniLogo: '', // 小程序LOGO
        servicePhone: '',// 客服电话
        serviceMail: '',// 客服邮箱
        licenseNo: '',// 营业执照号
        licenseName: '',// 营业执照名称
        licenseStartDate: null,// 营业执照到期日期
        licenseEndDate: null,
        licensePic: '',// 营业执照
        outDoorPic: '', // 门店门头照
        firstSpecialLicensePic: '', // 营业执照授权照
        secondSpecialLicensePic: '', // 特殊资质照
        thirdSpecialLicensePic: '' // 其它照片
      },
      miniCategoryIdsProps: { // 小程序类目
        lazy: true,
        async lazyLoad (node, resolve) {
          const { level } = node;
          const res = (await queryCategory({
            categoryId: level === 0 ? "" : node.data.categoryId,
            topParent: level === 0 ? true : false
          })) || []
          if (res.length) {
            res.map(item => {
              item.value = item.categoryId;
              item.label = item.categoryName;
            })
          }
          resolve(res);
        }
      },
      regionProps: { // 小程序归属地区
        lazy: true,
        async lazyLoad (node, resolve) {
          const { level } = node;
          const res = (await queryArea({
            areaCode: level === 0 ? "" : node.data.areaCode,
            topParent: level === 0 ? true : false
          })) || []
          if (res.length) {
            res.map(item => {
              item.value = item.areaCode;
              item.label = item.areaName;
            })
          }
          resolve(res);
        }
      },
      rules: {
        miniName: [
          { required: true, message: '请输入小程序名称', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' },
          { validator: checkRegMiniName, trigger: 'blur' }
        ],
        miniEnglishName: [
          { required: true, message: '请输入小程序英文名', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' },
          { validator: checkRegMiniEnglishName, trigger: 'blur' }
        ],
        miniCategoryIds: [
          { required: true, message: '请选择小程序类目', trigger: 'change' }
        ],
        region: [
          { required: true, message: '请选择小程序归属地区', trigger: 'change' }
        ],
        miniSlogan: [
          { required: true, message: '请输入小程序简介', trigger: 'blur' },
          { min: 10, max: 32, message: '长度在 10 到 32 个字符', trigger: 'blur' }
        ],
        miniDesc: [
          { required: true, message: '请输入小程序描述', trigger: 'blur' },
          { min: 20, max: 200, message: '长度在 20 到 200 个字符', trigger: 'blur' }
        ],
        miniLogo: [
          { required: true, message: '请选择小程序LOGO', trigger: 'change' }
        ],
        servicePhone: [
          { required: true, message: '请输入客服电话', trigger: 'blur' },
          { min: 5, max: 30, message: '长度在 5 到 30 个字符', trigger: 'blur' },
          { validator: checkRegServicePhone, trigger: 'blur' }
        ],
        serviceMail: [
          { required: true, message: '请输入客服邮箱', trigger: 'blur' },
          { min: 5, max: 128, message: '长度在 5 到 128 个字符', trigger: 'blur' },
        ],
        licenseNo: [
          { required: true, message: '请输入营业执照号', trigger: 'blur' },
          { min: 5, max: 32, message: '长度在 5 到 32 个字符', trigger: 'blur' },
        ],
        licenseName: [
          { required: true, message: '营业执照名称', trigger: 'blur' },
          { min: 2, max: 32, message: '长度在 2 到 32 个字符', trigger: 'blur' },
        ],
        licenseStartDate: [
          { required: true, message: '请选择营业执照开始日期', trigger: 'change' }
        ],
        licensePic: [
          { required: true, message: '请选择营业执照', trigger: 'change' }
        ],
        outDoorPic: [
          { required: true, message: '请选择门店门头照', trigger: 'change' }
        ]
      }
    }
  },
  created () {
    this.initFun()
  },
  methods: {
    initFun () {
      const query = this.$route.query
      this.operation = query.operation || ""
      if (query.id && [2, 8, 9, 10, 11].includes(Number(query.status))) {
        this.queryByDatumId(query.id)
      }
    },
    onRemove (field) {
      this.form[field] = ''
    },
    uploadSuccess (res) {
      this.form[res.upField] = res.value[0].data.url
      this.$refs.form.validate(async valid => {
      })
    },
    cancel () {
      this.$confirm('确定退出吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('delTagView', this.$route).then(() => {
          this.$router.push({ path: 'marketingManagement' })
        })
      }).catch(() => {
      })
    },
    async queryByDatumId (datumId) {
      const res = await queryByDatumId({
        datumId
      })
      this.form.miniName = res.miniName
      this.form.miniEnglishName = res.miniEnglishName
      this.form.miniCategoryIds = [res.miniCategoryId1 || '', res.miniCategoryId2 || '', res.miniCategoryId3 || '']
      this.form.region = [res.provinceCode || '', res.cityCode || '', res.areaCode || '']
      this.form.miniSlogan = res.miniSlogan
      this.form.miniDesc = res.miniDesc
      this.form.miniLogo = res.miniLogo
      this.form.servicePhone = res.servicePhone
      this.form.serviceMail = res.serviceMail
      this.form.licenseNo = res.licenseNo
      this.form.licenseName = res.licenseName
      this.form.licenseStartDate = res.licenseStartDate
      this.form.licenseEndDate = res.licenseEndDate === '1970-01-01 00:00:00' ? '' : res.licenseEndDate
      this.form.licensePic = res.licensePic
      this.form.outDoorPic = res.outDoorPic
      this.form.firstSpecialLicensePic = res.firstSpecialLicensePic
      this.form.secondSpecialLicensePic = res.secondSpecialLicensePic
      this.form.thirdSpecialLicensePic = res.thirdSpecialLicensePic
      this.detileId = res.id
    },
    initSubData () {
      let subData = {
        miniName: this.form.miniName,
        miniEnglishName: this.form.miniEnglishName,
        miniCategoryId1: this.form.miniCategoryIds[0] || '',
        miniCategoryId2: this.form.miniCategoryIds[1] || '',
        miniCategoryId3: this.form.miniCategoryIds[2] || '',
        provinceCode: this.form.region[0],
        cityCode: this.form.region[1],
        areaCode: this.form.region[2],
        miniSlogan: this.form.miniSlogan,
        miniDesc: this.form.miniDesc,
        miniLogo: this.form.miniLogo,
        servicePhone: this.form.servicePhone,
        serviceMail: this.form.serviceMail,
        licenseNo: this.form.licenseNo,
        licenseName: this.form.licenseName,
        licenseStartDate: dayjs(this.form.licenseStartDate).format('YYYY-MM-DD'),
        licenseEndDate: this.form.licenseEndDate ? dayjs(this.form.licenseEndDate).format('YYYY-MM-DD') : '1970-01-01',
        licensePic: this.form.licensePic,
        outDoorPic: this.form.outDoorPic,
        firstSpecialLicensePic: this.form.firstSpecialLicensePic,
        secondSpecialLicensePic: this.form.secondSpecialLicensePic,
        thirdSpecialLicensePic: this.form.thirdSpecialLicensePic,
      }
      return subData
    },
    // 基础资料维护
    async saveBaseData (status) {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.loadingField = 'saveBaseData'
          try {
            await saveBaseData({
              ...this.initSubData(),
              miniProgramId: this.$route.query.id,
              status, //保存状态（0 暂存 1保存）
              miniProgramAppid: this.$route.query.miniProgramAppid
            })
            this.$message.success('暂存成功')
            this.$store.dispatch('delTagView', this.$route).then(() => {
              this.$router.push({ path: 'marketingManagement' })
            })
          } catch (error) {
          } finally {
            this.loadingField = ''
          }
        }
      })
    },
    // 更改
    async modifyBaseData (status) {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.loadingField = 'modifyBaseData'
          try {
            await modifyBaseData({
              ...this.initSubData(),
              id: this.detileId,
              miniProgramId: this.$route.query.id,
              status, //保存状态（0 暂存 1保存）
              miniProgramAppid: this.$route.query.miniProgramAppid
            })
            this.$message.success('提交成功')
            this.$store.dispatch('delTagView', this.$route).then(() => {
              this.$router.push({ path: 'marketingManagement' })
            })
          } catch (error) {
          } finally {
            this.loadingField = ''
          }
        }
      })
    }
  }
}
</script>
<style scoped>
.title {
  width: 100%;
  padding: 40px 0px 20px 0px;
}
</style>