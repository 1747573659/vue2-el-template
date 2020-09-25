<template>
  <div v-permission.page="'AGENT_ROLE_EDIT'" class="data-box">
    <div class="com-edit-block">
      <div class="com-edit-title">
        <span>基本信息</span>
      </div>
      <div>
        <el-form :model="ruleForm" size="small" :rules="rules" ref="ruleForm" label-width="150px" class="com-edit-ruleForm">
          <el-form-item label="代理商名称：" prop="name">
            <el-input v-model="ruleForm.name" maxlength="50" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="地区：" prop="region">
            <el-cascader style="width: 240px;" :options="options" v-model="ruleForm.region" clearable></el-cascader>
          </el-form-item>
          <el-form-item label="运营者手机(账号)：" prop="region">
            <el-input v-model="ruleForm.name" maxlength="11" :disabled="true" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="密码：" prop="region">
            <el-select style="width: 240px;" v-model="ruleForm.name" placeholder="请选择产品">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="代理商角色：" prop="region">
            <el-select style="width: 240px;" v-model="ruleForm.name" placeholder="请选择产品">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="联系人邮箱：" prop="region">
            <el-input v-model="ruleForm.name" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="BD经理：" prop="region" class="item-block">
            <el-select style="width: 240px;" v-model="ruleForm.name" placeholder="请选择产品">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
            <el-button type="text" class="item-btn" @click="dialogVisible = true">管理</el-button>
          </el-form-item>
          <el-form-item label="代理商分成比例：" prop="region" class="icon-block">
            <el-input v-model="ruleForm.name" placeholder="1至100"></el-input>
            <el-popover :close-delay="0" placement="top" width="200" trigger="hover" content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。">
              <i slot="reference" class="el-icon-question icon-question"></i>
            </el-popover>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <div class="com-edit-block">
      <div class="com-edit-title">
        <span>公司信息</span>
      </div>
      <div>
        <el-form :model="ruleForm" size="small" :rules="rules" ref="ruleForm1" label-width="150px" class="com-edit-ruleForm">
          <el-form-item label="法人：" prop="rrr">
            <el-input v-model="ruleForm.name" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="营业执照：" prop="rrr">
            <el-upload class="avatar-uploader" action="https://jsonplaceholder.typicode.com/posts/" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
              <img v-if="imageUrl" :src="imageUrl" class="avatar">
              <span v-else class="avatar-uploader-icon-block">
                <i class="el-icon-plus avatar-uploader-icon"></i>
                <span class="avatar-uploader-text">上传照片</span>
              </span>
            </el-upload>
            <!-- <span class="avatar__msg">建议尺寸 600*600，大小不超过 2M</span> -->
          </el-form-item>
          <el-form-item label="商务姓名：" prop="rrr">
            <el-input v-model="ruleForm.name" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="商务手机：" prop="rrr">
            <el-input v-model="ruleForm.name" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="QQ：" prop="rrr">
            <el-input v-model="ruleForm.name" placeholder=""></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="com-edit-block">
      <div class="com-edit-title">
        <span>开票信息</span>
      </div>
      <div>
        <el-form :model="ruleForm" size="small" :rules="rules" ref="ruleForm2" label-width="150px" class="com-edit-ruleForm">
          <el-form-item label="地址：" prop="rrr">
            <el-input v-model="ruleForm.name" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="纳税人识别号：" prop="rrr">
            <el-input v-model="ruleForm.name" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="电话：" prop="rrr">
            <el-input v-model="ruleForm.name" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="银行账号：" prop="rrr">
            <el-input v-model="ruleForm.name" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="开户行：" prop="rrr">
            <el-input v-model="ruleForm.name" placeholder=""></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm()">保存</el-button>
            <el-button @click="resetForm('ruleForm')">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <el-dialog title="BD经理管理" width="510px" :visible.sync="dialogVisible">
      <el-form :model="form" :inline="true">
        <el-form-item label="BD经理名称：" label-width="120px">
          <el-input style="width: 200px" v-model="form.name" placeholder="请输入BD经理名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm()">增加BD经理</el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import options from '../shop/options.js'
import { queryAgentById } from '@/api/customer/agent'

export default {
  name: 'editAgent',
  components: {},
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {
      form: {
        name: 'yyy',
      },
      dialogVisible: false,
      options: [],
      // options: options,
      ruleForm: {
        name: '',
        region: ['zujian', 'basic', 'layout'],
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: '',
      },
      rules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' },
        ],
        region: [
          { required: true, message: '请选择活动区域', trigger: 'change' },
        ],
        date1: [
          {
            type: 'date',
            required: true,
            message: '请选择日期',
            trigger: 'change',
          },
        ],
        date2: [
          {
            type: 'date',
            required: true,
            message: '请选择时间',
            trigger: 'change',
          },
        ],
        type: [
          {
            type: 'array',
            required: true,
            message: '请至少选择一个活动性质',
            trigger: 'change',
          },
        ],
        resource: [
          { required: true, message: '请选择活动资源', trigger: 'change' },
        ],
        desc: [{ required: true, message: '请填写活动形式', trigger: 'blur' }],
      },
      imageUrl: '',
    }
  },
  computed: {},
  watch: {},
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      // 通过 `vm` 访问组件实例
      debugger
    })
  },
  created() {
    if (this.$route.query.page === 'add') {
      this.$route.meta.title = '代理商管理/新增111'
    } else {
      this.$route.meta.title = '代理商管理/编辑'
    }
    // console.log((this.$route.meta.title = '代理商管理/新增'))
    debugger
  },
  methods: {
    // 编辑时获取代理商基本信息
    queryAgentById() {
      queryAgentById().then((res) => {})
    },
    submitForm() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('111111111error submit!!')
          return false
        }
      })

      this.$refs['ruleForm1'].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('2222222error submit!!')
          return false
        }
      })
    },
    resetForm() {
      this.$refs['ruleForm'].resetFields()
      this.$refs['ruleForm1'].resetFields()
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

    handleClose() {},
  },
}
</script>

<style lang="scss" scoped>
.com-edit-title {
  padding: 0 16px 16px;
  border-bottom: 1px solid #e6e9f0;
  line-height: 1;
  color: #1f2e4d;
}
.com-edit-ruleForm {
  margin: 25px auto 50px;
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
.icon-block,
.item-block {
  position: relative;
}
.icon-question {
  position: absolute;
  left: 250px;
  top: 10px;
  width: 16px;
  font-size: 16px;
  color: #cad1e0;
  cursor: pointer;
  &:hover {
    color: #409eff;
  }
}
.item-btn {
  position: absolute;
  left: 250px;
  font-size: 14px;
  // color: #CAD1E0;
  // cursor: pointer;
}
</style>
