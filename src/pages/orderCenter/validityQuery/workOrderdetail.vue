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
          <div class="work_item">{{ruleForm.demandName}}</div>
        </el-form-item>
        <el-form-item label="工单类型：" prop="orderType">
          <div class="work_item">{{workorderType}}</div>
        </el-form-item>
        <el-form-item label="产品：" prop="productNoA">
          <div class="work_item">{{workProductNo}}</div>
        </el-form-item>
        <el-form-item label="工单描述：" prop="demandDec">
          <div class="work_item">{{ruleForm.demandDec}}</div>
        </el-form-item>
        <el-form-item v-if="fileList && fileList.length>0" label="工单素材：" prop="fileName">
          <el-upload
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
          </el-upload>
          <el-dialog :before-close="onClose" width="40%"  title="预览" :visible.sync="dialogImgVisible">
            <img width="100%" v-if="dialogImgUrl" :src="dialogImgUrl" alt="">
            <!-- <video ref="vediomedia" width="100%" height="60%" loop autoplay v-if="vedioUrl" :src="vedioUrl" controls>
            </video> -->
          </el-dialog>
        </el-form-item>
         <el-form-item label="工单素材：" v-else>
           <div class="work_item">没有提交工单素材</div>
         </el-form-item>
        <el-form-item label="公司名称：" prop="custName">
          <div class="work_item">{{ruleForm.custName}}</div>
        </el-form-item>
        <el-form-item label="联系人：" prop="linkName">
          <div class="work_item">{{ruleForm.linkName}}</div>
        </el-form-item>
        <el-form-item label="联系方式：" prop="linkPhone">
          <div class="work_item">{{ruleForm.linkPhone}}</div>
        </el-form-item>

        <el-form-item label="状态：" prop="linkPhone">
          <div class="work_item">{{ruleForm.status}}</div>
        </el-form-item>
        <el-form-item label="进度：" prop="linkPhone">
            <div v-for="item in ruleForm.schedules" :key="item.operDate">
              <span style="margin-right: 20px;">{{item.operDate}}</span>
              <span>{{item.sheetStatus}}</span>
            </div>
        </el-form-item>

        
        <el-form-item v-if="!isEdit">
          <el-button size="small" type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <!-- <el-button  type="primary" plain @click="resetForm('ruleForm')">重置</el-button> -->
          <el-button size="small" @click="cance()" >取消</el-button>
        </el-form-item>
        
      </el-form>
      <div v-if="isEdit" style="padding-left: 100px;">
          <el-button size="small" type="primary" @click="cance()" >关闭</el-button>
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
import ElUpload from "@/components/upload"
const {VUE_APP_WORK_ORDER_URL,VUE_APP_WORK_ORDER_URLPATH}=baseurl

export default {
  name: "workOrderdetail",
  mixins: [],
  components: {
    ElUpload
  },
  computed: {
    workorderType:function(){
      if(this.ruleForm.orderType==="1"){
        return "问题"
      }else if(this.ruleForm.orderType==="2"){
        return "需求"
      }else{
        return "未知类型"
      }
    },
    workProductNo:function(){
      return this.ruleForm.productName+"-"+this.ruleForm.branchName
    }
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
      this.queryOrderDetail(res)
    }
    if(this.$route.query.sheetNo){
      this.isEdit=true
      const loading = this.$loading()
      getRequest.call(this,this.$route.query)
      loading.close()
    }
  },
  methods: {
    cance(){
      this.$store.dispatch('delTagView', this.$route).then(() => {
        this.$router.push({ path: '/customer/workorder/workOrderManagement' })
      })
    },
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
      function getTypeFile(res1){
            let suffix=res1.match(/.+\.(.+)/)[1]
            let isimg="bmp,jpg,png,tif,gif,pcx,tga,exif,fpx,svg,psd,cdr,pcd,dxf,ufo,eps,ai,raw,wmf,webp".includes(suffix.toLowerCase())
            let isvedio="avi,mov,rmvb,rm,flv,mp4,3gp".includes(suffix.toLowerCase())
            if(isimg){
              return {
                name:res1,
                url:VUE_APP_WORK_ORDER_URL+"/KMjsfw/images/"+res1,
                type:"image/*"
              }
            }else if(isvedio){
              return {
                name:res1,
                url:VUE_APP_WORK_ORDER_URL+"/KMjsfw/images/"+res1,
                type:"video/*"
              }
            }else{
              return {
                name:res1,
                url:VUE_APP_WORK_ORDER_URL+"/KMjsfw/images/"+res1,
                type:"other/*"
              }
            }
      }
      queryOrderDetail(res).then(
        res=>{
          let requestData=Object.assign({},res)
          this.ruleForm=res
          this.ruleForm.productNoA=[requestData.productNo,requestData.branch]
          const files1=requestData.fileName?requestData.fileName.split(",").map(getTypeFile):[]
          const files2=requestData.fileName2?requestData.fileName2.split(",").map(getTypeFile):[]
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
        // this.vedioUrl=file.url
        // this.$nextTick(()=>{
        //   if(this.$refs['vediomedia'].error){
        //     this.$message.warning('由于兼容问题不支持预览该视频')
        //     window.open(file.url);
        //   }
        // })
        // this.dialogImgVisible = true;
        window.open(file.url);
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
  padding: 30px 6%;
  margin: 24px;
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
/deep/ .el-upload--picture-card{
  display: none;
}
/deep/ .el-form-item{
      margin-bottom: 6px;
}
</style>
