<template>
  <div class="app-container">
    <div class="app-form">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
        :disabled="isEdit"
      >
        <el-form-item label="工单标题：" prop="demandName">
          <el-input class="km_input_width"  v-model="ruleForm.demandName"></el-input>
        </el-form-item>
        <el-form-item label="工单类型：" prop="orderType">
          <el-radio-group v-model="ruleForm.orderType">
            <el-radio label="1">问题</el-radio>
            <el-radio label="2">需求</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="产品：" prop="productNoA">
          <el-cascader ref="cascader" v-model="ruleForm.productNoA" :options="options" :props="productProps" ></el-cascader>
        </el-form-item>
        <el-form-item label="工单描述：" prop="demandDec">
          <el-input class="demandDec" :maxlength="250" show-word-limit type="textarea" v-model="ruleForm.demandDec"></el-input>
        </el-form-item>
        <el-form-item label="工单素材：" prop="fileName">
          <km-upload
            class="upload-demo"
            name="files"
            :on-exceed="handleexceed"
            :limit="8"
            :action="uploadurl"
            :before-upload="handleBeforeupload"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-success="handleSuccess"
            :file-list="fileList"
            list-type="picture-card"
          >
            <i class="el-icon-upload"></i>
            <div class="km_upload_file_text">上传素材</div>

            <!-- <el-button size="small" type="primary">点击上传</el-button> -->
            <div slot="tip" class="el-upload__tip">请上传图片、视频(推荐mp4格式)或文件</div>
          </km-upload>
          <el-dialog :before-close="onClose" width="40%"  title="预览" :visible.sync="dialogImgVisible">
            <img width="100%" v-if="dialogImgUrl" :src="dialogImgUrl" alt="">
            <video width="100%" height="60%" loop autoplay v-if="vedioUrl" src="http://www.k-scm.com/KMjsfw/images/JF2010104775_mmexport1602319019570.mp4" controls>
            </video>
          </el-dialog>
        </el-form-item>
        <el-form-item label="公司名称：" prop="custName">
          <el-input class="km_input_width" v-model="ruleForm.custName"></el-input>
        </el-form-item>
        <el-form-item label="联系人：" prop="linkName">
          <el-input class="km_input_width" v-model="ruleForm.linkName"></el-input>
        </el-form-item>
        <el-form-item label="联系方式：" prop="linkPhone">
          <el-input class="km_input_width" v-model="ruleForm.linkPhone"></el-input>
        </el-form-item>
        <el-form-item v-if="!isEdit">
          <el-button size="small" type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <!-- <el-button  type="primary" plain @click="resetForm('ruleForm')">重置</el-button> -->
          <el-button size="small" @click="$router.go(-1)" >取消</el-button>
        </el-form-item>
        
      </el-form>
      <div v-if="isEdit" style="padding-left: 100px;">
          <el-button size="small" type="primary" @click="$router.go(-1)" >取消</el-button>
        </div>
    </div>
  </div>
</template>

<script>
import { 
  addWorkOrder,
  queryProductList,
  queryAgent,
  queryWorkOrderList,
  queryOrderDetail
  } from '@/api/dataCenter/dataCenter.js'
  import { 
  uploadimage
  } from '@/api/dataCenter/common.js'
import baseurl from '@/utils/baseUrl.js'
import KmUpload from "@/components/upload"
const {VUE_APP_WORK_ORDER_URL,VUE_APP_WORK_ORDER_URLPATH}=baseurl

export default {
  name: "validityPeriod",
  mixins: [],
  components: {
    KmUpload
  },
  data() {
    return {
      isEdit:false,
      ruleForm: {
        demandName: "",
        orderType: "1",
        productNoA: [],
        demandDec: "",
        fileName: "",
        custName: "",
        linkName: "",
        linkPhone: "",
        fileName2:" "
      },
      dialogImgVisible:false,
      dialogImgUrl:"",
      vedioUrl:"",
      uploadurl:VUE_APP_WORK_ORDER_URL+VUE_APP_WORK_ORDER_URLPATH+"/KMJFService.asmx/uploadimage?jsoncallback=?",
      rules: {
        demandName: [
          { required: true, message: "请填写工单标题", trigger: "blur" },
        ],
        productNoA: [
          { required: true, message: "请选择产品", trigger: "change" },
        ],
        demandDec: [
          { required: true, message: "请填写工单描述", trigger: "blur" },
        ],
        custName: [
          { required: true, message: "请填写公司名称", trigger: "blur" },
        ],
        linkName: [
          { required: true, message: "请填写联系人", trigger: "blur" },
        ],
        linkPhone: [
          { required: true, message: "请填写联系方式", trigger: "blur" },
        ],
      },
      fileList: [],
      productProps:{
        "label":"branchName",
        "value":"branchId",
        "children":"branchs"
      },
      options: [

      ],
    };
  },

   mounted(){
    async function getRequest(res){
      await this.queryProductList()
      this.queryOrderDetail(res)
    }
    if(this.$route.query.sheetNo){
      this.isEdit=true
      getRequest.call(this,this.$route.query)
    }else{
      this.queryProductList()
    }
  },
  methods: {
    handleexceed(){
      this.$message.error("最多上传8个文件");
    },
    submitForm(formName) {
      const cascader=this.$refs['cascader'].getCheckedNodes()[0];
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let requestData=Object.assign({},this.ruleForm)
          delete requestData.productNoA
          requestData.productNo=cascader.path[0]
          requestData.branch=cascader.path[1]
          requestData.productName=cascader.pathLabels[0]
          requestData.branchName=cascader.pathLabels[1]
          requestData.fileName=this.fileList.filter(res=>/(^video\/.+$)|(^image\/.+$)/.test(res.type)).map(res=>res.name).join()
          requestData.fileName2=this.fileList.filter(res=>!(/(^video\/.+$)|(^image\/.+$)/.test(res.type))).map(res=>res.name).join()
          addWorkOrder(requestData).then(res=>{
            this.$message.success("创建成功")
            this.$router.go(-1)
          })
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleSuccess(response, file, fileList){
        this.fileList.push({
          name:response.fileName,
          url:VUE_APP_WORK_ORDER_URL+"/KMjsfw/images/"+response.fileName,
          type:file.raw.type
        })
    },
    queryProductList(){
      queryProductList({
        productName:""
      }).then((res)=>{
         this.options=[]
        for (const key in res) {
          const element = res[key];
          element['branchName']=element['productName']
          element['branchId']=element['productNo']
          delete element['productName']
          delete element['productNo']
        }
        this.options=res
      })
    },
    queryOrderDetail(res){
      queryOrderDetail(res).then(
        res=>{
          let requestData=Object.assign({},res)
          this.ruleForm=res
          this.ruleForm.productNoA=[requestData.productNo,requestData.branch]
          const files1=requestData.fileName?requestData.fileName.split(",").map(res1=>{
            return {
              name:res1,
              url:VUE_APP_WORK_ORDER_URL+"/KMjsfw/images/"+res1,
              type:"image/*"
            }
          }):[]
          const files2=requestData.fileName2?requestData.fileName2.split(",").map(res1=>{
            return {
              name:res1,
              url:VUE_APP_WORK_ORDER_URL+"/KMjsfw/images/"+res1,
              type:"video/*"
            }
          }):[]
          this.fileList=[...files1,...files2]
        }
      )
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.fileList=[]
    },
    handleBeforeupload(file){
      if(file.size / 1024 / 1024 > 50){
         this.$message.warning('请将文件大小限制50M以内')
         return false
      }
    },
    handleRemove(file, fileList) {
      this.fileList=this.fileList.filter(re=>re.uid!==file.uid)
    },
    onClose(done){
      this.vedioUrl=""
      this.dialogImgUrl=""
      done()
    },
    handlePreview(file) {
      if(/^video\/.+$/.test(file.type)){
        this.vedioUrl=file.url
        this.dialogImgVisible = true;
      }else if(/^image\/.+$/.test(file.type)){
        this.dialogImgUrl = file.url;
        this.dialogImgVisible = true;
      }else{
        window.open(file.url);
        //this.$message.warning('只有图片和视频文件支持预览')
      }
    },
  },
  created() {},
};
</script>

<style lang="scss" scoped>
.app-form {
  background: #fff;
  padding: 30px 30%;
  margin-top: 46px;
}
.el-icon-upload{
  color: #D3DBEB;
}
.km_upload_file_text{
    line-height: 0px;
    position: relative;
    top: -36%;
    color: #D3DBEB;
}
.demandDec /deep/ textarea{
    height: 200px!important;
}
.km_input_width{
  width: 62%;
}
</style>
