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
        <el-form-item label="工单标题" prop="demandName">
          <el-input v-model="ruleForm.demandName"></el-input>
        </el-form-item>
        <el-form-item label="工单类型" prop="orderType">
          <el-radio-group v-model="ruleForm.orderType">
            <el-radio label="1">问题</el-radio>
            <el-radio label="2">需求</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="产品" prop="productNoA">
          <el-cascader ref="cascader" v-model="ruleForm.productNoA" :options="options" :props="productProps" @change="handleChange"></el-cascader>
        </el-form-item>
        <el-form-item label="工单描述" prop="demandDec">
          <el-input type="textarea" v-model="ruleForm.demandDec"></el-input>
        </el-form-item>
        <el-form-item label="公司素材" prop="fileName">
          <el-upload
            class="upload-demo"
            name="files"
            action="/JFService/KMJFService.asmx/uploadimage"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-success="handleSuccess"
            :file-list="fileList"
            list-type="picture"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip"></div>
          </el-upload>
        </el-form-item>
        <el-form-item label="公司名称" prop="custName">
          <el-input v-model="ruleForm.custName"></el-input>
        </el-form-item>
        <el-form-item label="联系人" prop="linkName">
          <el-input v-model="ruleForm.linkName"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="linkPhone">
          <el-input v-model="ruleForm.linkPhone"></el-input>
        </el-form-item>
        <el-form-item v-if="!isEdit">
          <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
        <el-form-item v-else>
          <el-button type="primary" @click="router.go(-1)" >关闭</el-button>
        </el-form-item>
      </el-form>
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
export default {
  name: "validityPeriod",
  mixins: [],
  components: {},
  data() {
    return {
      isEdit:false,
      ruleForm: {
        demandName: "",
        orderType: "",
        productNoA: [],
        demandDec: "",
        fileName: "",
        custName: "",
        linkName: "",
        linkPhone: "",
      },
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
        {
          branchName: "御商+",
          branchId: "1",
          branchs: [
            {
              branchName: "全部",
              branchId: "0",
            },
          ],
        },
        {
          branchName: "蛙笑CS专卖",
          branchId: "2",
          branchs: [
            {
              branchName: "全部",
              branchId: "0",
            },
          ],
        },
        {
          branchName: "智赢+",
          branchId: "3",
          branchs: [
            {
              branchName: "全部",
              branchId: "0",
            },
          ],
        }
      ],
    };
  },
   mounted(){
    async function getRequest(res){
      await this.queryProductList()
      this.queryOrderDetail(res)
    }
    //isEdit
    //console.log(this.$router.query)
    getRequest.call(this,{
        sheetNo:"BG2009230480",
        orderType:1
    })
  },
  methods: {
    submitForm(formName) {
      const cascader=this.$refs['cascader'].getCheckedNodes()[0];
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let requestData=Object.assign({},this.ruleForm)
          requestData.productNo=cascader.path[0]
          requestData.branch=cascader.path[1]
          requestData.productName=cascader.pathLabels[0]
          requestData.branchName=cascader.pathLabels[1]
          requestData.fileName=this.fileList.map(res=>res.name).join()
          //requestData.fileName2=this.fileList.map(res=>res.name).join()
          addWorkOrder(requestData).then(res=>{
            this.$message("创建成功")
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
        url:response.url
      })
    },
    queryProductList(){
      queryProductList().then((res)=>{
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
          this.ruleForm.productNoA=[requestData.productNo,requestData.branch]
          this.fileList=requestData.fileName.split().map(res=>{
            return {
              name:res,
              url:"www.baidu.com"
            }
          })
        }
      )
    },
    handleChange(e){
      console.log(e)
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      // this.ruleForm={
      //   demandName: "",
      //   orderType: "",
      //   productNoA: [],
      //   demandDec: "",
      //   fileName: "",
      //   custName: "",
      //   linkName: "",
      //   linkPhone: "",
      // }
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
  },
  created() {},
};
</script>

<style lang="scss" scoped>
.app-form {
  background: #fff;
  padding: 30px 20%;
  margin-top: 46px;
}
</style>
