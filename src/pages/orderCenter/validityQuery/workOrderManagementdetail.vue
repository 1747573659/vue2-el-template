<template>
  <section class="p-workorder-detail">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" size="small" label-width="100px" class="xdd-btn-block__w240" :disabled="isEdit">
      <el-form-item label="工单标题：" prop="demandName">
        <el-input v-model="ruleForm.demandName"></el-input>
      </el-form-item>
      <el-form-item label="工单类型：" prop="orderType">
        <el-radio-group v-model="ruleForm.orderType">
          <el-radio label="1" style="margin-right: 88px;">问题</el-radio>
          <el-radio label="2">需求</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="产品：" prop="productNoA">
        <el-cascader ref="cascader" v-model="ruleForm.productNoA" :options="options" :props="productProps"></el-cascader>
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
          ref="uploadfile"
          :file-list="fileList"
          list-type="picture-card"
        >
          <i class="el-icon-upload"></i>
          <div class="km_upload_file_text">上传素材</div>

          <!-- <el-button size="small" type="primary">点击上传</el-button> -->
          <div slot="tip" class="el-upload__tip">请上传图片、视频(推荐mp4格式)或文件</div>
        </km-upload>
        <!-- <km-upload
          class="upload-demo"
          name="files"
          :on-exceed="handleexceed"
          :limit="8"
          :action="uploadurl"
          :before-upload="handleBeforeupload"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
          ref="uploadfile"
          :file-list="fileList"
          list-type="picture-card"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">添加素材</div> -->
          <!-- <div slot="tip" class="el-upload__tip">请上传图片、视频(推荐mp4格式)或文件</div> -->
        <!-- </km-upload> -->
        <el-dialog :before-close="onClose" width="40%" title="预览" :visible.sync="dialogImgVisible">
          <img width="100%" v-if="dialogImgUrl" :src="dialogImgUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="公司名称：" prop="custName">
        <el-input v-model="ruleForm.custName"></el-input>
      </el-form-item>
      <el-form-item label="联系人：" prop="linkName">
        <el-input v-model="ruleForm.linkName"></el-input>
      </el-form-item>
      <el-form-item label="联系方式：" prop="linkPhone">
        <el-input v-model="ruleForm.linkPhone"></el-input>
      </el-form-item>
      <el-form-item v-if="!isEdit" style="padding-bottom: 10px;">
        <el-button :disabled="isDisabled" size="small" type="primary" @click="submitForm('ruleForm')" class="e-workorder-action_pd">提交</el-button>
        <el-button size="small" @click="cance()" class="e-workorder-action_pd">关闭</el-button>
      </el-form-item>
    </el-form>
    <div v-if="isEdit" style="padding-left: 100px;">
      <el-button size="small" type="primary" @click="cance()" class="e-workorder-action_pd">取消</el-button>
    </div>
  </section>
</template>

<script>
import { addWorkOrder, queryProductList, queryAgent, queryWorkOrderList, queryOrderDetail, queryAgentPage } from '@/api/dataCenter/dataCenter.js'
import { uploadimage } from '@/api/dataCenter/common.js'
import baseurl from '@/utils/baseUrl.js'
import KmUpload from '@/components/upload'
const { VUE_APP_WORK_ORDER_URL, VUE_APP_WORK_ORDER_URLPATH } = baseurl

export default {
  name: 'workOrderManagementdetail',
  mixins: [],
  components: {
    KmUpload
  },
  data() {
    return {
      isEdit: false,
      ruleForm: {
        demandName: '',
        orderType: '',
        productNoA: [],
        demandDec: '',
        fileName: '',
        custName: '',
        linkName: '',
        linkPhone: '',
        fileName2: ' '
      },
      dialogImgVisible: false,
      dialogImgUrl: '',
      vedioUrl: '',
      isDisabled: false,
      uploadurl: VUE_APP_WORK_ORDER_URL + VUE_APP_WORK_ORDER_URLPATH + '/KMJFService.asmx/uploadimage?jsoncallback=?',
      rules: {
        demandName: [{ required: true, message: '请填写工单标题', trigger: 'blur' }],
        productNoA: [{ required: true, message: '请选择产品', trigger: 'change' }],
        demandDec: [{ required: true, message: '请填写工单描述', trigger: 'blur' }],
        orderType: [{ required: true, message: '请选择工单类型', trigger: 'blur' }],
        custName: [{ required: true, message: '请填写公司名称', trigger: 'blur' }],
        linkName: [{ required: true, message: '请填写联系人', trigger: 'blur' }],
        linkPhone: [{ required: true, message: '请填写联系方式', trigger: 'blur' }]
      },
      fileList: [],
      productProps: {
        label: 'branchName',
        value: 'branchId',
        children: 'branchs'
      },
      options: []
    }
  },

  mounted() {
    async function getRequest(res) {
      await this.queryProductList()
      this.queryOrderDetail(res)
    }
    if (this.$route.query.sheetNo) {
      this.isEdit = true
      getRequest.call(this, this.$route.query)
    } else {
      this.queryProductList()
      queryAgentPage().then(res => {
        this.ruleForm.custName = res.companyName
        this.ruleForm.linkName = res.contact
        this.ruleForm.linkPhone = res.mobile
      })
    }
  },
  methods: {
    handleexceed() {
      this.$message.error('最多上传8个文件')
    },
    submitForm(formName) {
      let files = this.$refs['uploadfile'].$children[0].files
      if (files.length > 0) {
        const isuploadingco = files.every((item, index) => {
          if (item.status === 'success') {
            return true
          } else {
            return false
          }
        })
        if (!isuploadingco) {
          this.$message.warning('有文件正在上传，请等待文件上传完在点提交')
          return false
        }
      }
      const cascader = this.$refs['cascader'].getCheckedNodes()[0]
      this.$refs[formName].validate(valid => {
        if (valid) {
          let requestData = Object.assign({}, this.ruleForm)
          delete requestData.productNoA
          requestData.productNo = cascader.path[0]
          requestData.branch = cascader.path[1]
          requestData.productName = cascader.pathLabels[0]
          requestData.branchName = cascader.pathLabels[1]
          requestData.fileName = this.fileList
            .filter(res => /(^video\/.+$)|(^image\/.+$)/.test(res.type))
            .map(res => res.name)
            .join()
          requestData.fileName2 = this.fileList
            .filter(res => !/(^video\/.+$)|(^image\/.+$)/.test(res.type))
            .map(res => res.name)
            .join()
          addWorkOrder(requestData).then(res => {
            this.$message.success('创建成功')
            this.$router.go(-1)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleSuccess(response, file, fileList) {
      this.fileList.push({
        name: response.fileName,
        url: VUE_APP_WORK_ORDER_URL + '/KMjsfw/images/' + response.fileName,
        type: file.raw.type
      })
      this.isDisabled = false
    },
    queryProductList() {
      queryProductList({
        productName: ''
      }).then(res => {
        this.options = []
        for (const key in res) {
          const element = res[key]
          element['branchName'] = element['productName']
          element['branchId'] = element['productNo']
          delete element['productName']
          delete element['productNo']
        }
        this.options = res
      })
    },
    queryOrderDetail(res) {
      queryOrderDetail(res).then(res => {
        let requestData = Object.assign({}, res)
        this.ruleForm = res
        this.ruleForm.productNoA = [requestData.productNo, requestData.branch]
        const files1 = requestData.fileName
          ? requestData.fileName.split(',').map(res1 => {
              return {
                name: res1,
                url: VUE_APP_WORK_ORDER_URL + '/KMjsfw/images/' + res1,
                type: 'image/*'
              }
            })
          : []
        const files2 = requestData.fileName2
          ? requestData.fileName2.split(',').map(res1 => {
              return {
                name: res1,
                url: VUE_APP_WORK_ORDER_URL + '/KMjsfw/images/' + res1,
                type: 'video/*'
              }
            })
          : []
        this.fileList = [...files1, ...files2]
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.fileList = []
    },
    handleBeforeupload(file) {
      if (file.size / 1024 / 1024 > 50) {
        this.$message.warning('请将文件大小限制50M以内')
        return false
      }
      this.isDisabled = true
    },
    handleRemove(file, fileList) {
      this.fileList = this.fileList.filter(re => re.uid !== file.uid)
    },
    onClose(done) {
      this.vedioUrl = ''
      this.dialogImgUrl = ''
      done()
    },
    handlePreview(file) {
      if (/^video\/.+$/.test(file.type)) {
        window.open(file.url)
      } else if (/^image\/.+$/.test(file.type)) {
        this.dialogImgUrl = file.url
        this.dialogImgVisible = true
      } else {
        window.open(file.url)
        //this.$message.warning('只有图片和视频文件支持预览')
      }
    },
    cance() {
      this.$store.dispatch('delTagView', this.$route).then(() => {
        this.$router.push({ path: '/customer/workorder/workOrderManagement' })
      })
    }
  },
  created() {}
}
</script>

<style lang="scss" scoped>
.p-workorder-detail {
  margin: 16px 16px 72px;
  padding-top: 32px;
  background-color: #fff;
}
.upload-demo {
  // display: flex;
  /deep/ {
    // .el-upload--picture-card {
    //   width: 80px;
    //   height: 80px;
    //   display: flex;
    //   align-items: center;
    //   justify-content: center;
    //   flex-direction: column;
    //   line-height: normal;
    // }
    // .el-upload__text {
    //   line-height: normal;
    //   color: #8f9bb3;
    // }
    // .el-upload__tip {
    //   font-size: 14px;
    //   color: #cad1e0;
    // }
    // .el-upload-list__item{
    //   width: 80px;
    //   height: 80px;
    //   line-height: 80px;
    // }
  }
}
.e-workorder-action_pd {
  padding: 8px 22px;
}
.app-form {
  background: #fff;
  height: 100%;
  margin-bottom: 0px;
}
/deep/.el-input__count {
  right: 56px;
  bottom: -5px;
  background: transparent;
}
.xdd-btn-block__w240 {
  width: 545px;
  margin: 0 auto;
}
.xdd-btn-block__w240 /deep/ .el-input__inner {
  height: 32px;
}
.demandDec /deep/ textarea {
  width: 400px;
  height: 120px;
}
.el-icon-upload {
  color: #d3dbeb;
}
.km_upload_file_text {
  line-height: 0px;
  position: relative;
  top: -36%;
  color: #d3dbeb;
}
.km_input_width {
  width: 62%;
}
</style>
