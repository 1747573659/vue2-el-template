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
            <el-form-item label="小程序类目??????????" prop="miniCategoryIds">
              <el-cascader v-model='form.miniCategoryIds' placeholder='请选择小程序类目' filterable clearable :props="miniCategoryIdsProps"></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="小程序归属地区??????????" prop="region">
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
            <el-form-item label="小程序LOGO???????" prop="miniLogo">
              <picUpload v-model="form.miniLogo" :fileServer='fileServer' uploadUrl='/alipay/mini/fileUplaod' desc='只能上传jpg/png格式文件，文件不能超过256kb ' :size='0.49' accept='image/jpeg,image/jpg,image/png'></picUpload>
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
          <el-col :span="6">
            <el-form-item label="营业执照到期日期" prop="licenseValidDate">
              <!-- 长期有效那种 结束日期为空则默认为长期有效-->
              <el-date-picker v-model="form.licenseValidDate" type="daterange" style="width:90%" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <h4 class="title">营业执照资料</h4>
        <el-row>
          <el-col :span="4">
            <el-form-item label="营业执照" prop="licensePic">
              <picUpload desc='' :size='0.49' accept='image/jpeg,image/jpg,image/png'></picUpload>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="门店门头照" prop="outDoorPic">
              <picUpload desc='' :size='0.49' accept='image/jpeg,image/jpg,image/png'></picUpload>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="营业执照授权照">
              <picUpload desc='' :size='0.49' accept='image/jpeg,image/jpg,image/png'></picUpload>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="特殊资质照">
              <picUpload desc='' :size='0.49' accept='image/jpeg,image/jpg,image/png'></picUpload>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="其它">
              <picUpload desc='' :size='0.49' accept='image/jpeg,image/jpg,image/png'></picUpload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="width:100%;text-align: center;padding:20px 0px  100px 0px">
        <el-button v-if="$route.query.operation=='add'" type="primary" plain>暂存</el-button>
        <el-button type="primary">提交</el-button>
        <el-button plain>取消</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import picUpload from './../picUpload'
import { auditApply, saveBaseData, modifyBaseData, queryCategory, queryArea, queryByDatumId } from '@/api/alipay'
import { fileServer } from '@/api/fileServe/fileServe.js'
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
      fileServer: '', // 上传域名
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
        licenseValidDate: null,// 营业执照到期日期
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
          await queryCategory({
            categoryId: "",
            topParent: true
          })
          setTimeout(() => {
            const nodes = Array.from({ length: level + 1 })
              .map(item => ({
                value: 1,
                label: `选项`,
                leaf: level >= 2
              }));
            // 通过调用resolve将子节点数据返回，通知组件数据加载完成
            resolve(nodes);
          }, 1000);
        }
      },
      regionProps: { // 小程序归属地区
        lazy: true,
        async lazyLoad (node, resolve) {
          const { level } = node;
          await queryArea(
            {
              areaCode: "",
              topParent: true
            }
          )
          setTimeout(() => {
            const nodes = Array.from({ length: level + 1 })
              .map(item => ({
                value: 1,
                label: `选项`,
                leaf: level >= 2
              }));
            // 通过调用resolve将子节点数据返回，通知组件数据加载完成
            resolve(nodes);
          }, 1000);
        }
      },
      miniCategoryIdsOption: [],
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
        licenseNo: [
          { required: true, message: '请输入营业执照号', trigger: 'blur' },
          { min: 5, max: 32, message: '长度在 5 到 32 个字符', trigger: 'blur' },
        ],
        licenseName: [
          { required: true, message: '营业执照名称', trigger: 'blur' },
          { min: 2, max: 32, message: '长度在 2 到 32 个字符', trigger: 'blur' },
        ],
        licenseValidDate: [
          { required: true, message: '请选择营业执照到期日期', trigger: 'change' }
        ],
        licensePic: [
          { required: true, message: '请选择营业执照', trigger: 'change' }
        ],
        outDoorPic: [
          { required: true, message: '请选择营业执照', trigger: 'change' }
        ]
      }
    }
  },
  created () {
    console.log(this.$route.query)
    this.getFileServer()
  },
  methods: {
    // 基础资料维护
    async saveBaseData () {

    },
    // 更改
    async modifyBaseData () {

    },
    // 获取上次域名
    async getFileServer () {
      this.fileServer = await fileServer()
    },
    onSubmit () {
      console.log('submit!');
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