<template>
  <div class="data-box">
    <div class="km-setting-account-add">
      <el-form ref="form" size="small" :rules="rules" label-suffix=":" :model="form" label-width="110px" style="width:350px">
        <el-form-item label="手机 (账号)" prop="loginName">
          <el-input v-model.trim="form.loginName" v-if="type"></el-input>
          <span v-else>{{form.loginName}}</span>
        </el-form-item>
        <el-form-item label="姓名" prop="userName">
          <el-input v-model="form.userName"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="psw" v-if="type">
          <el-input :disabled="true" v-model="form.psw" placeholder="默认888888"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="roleId">
          <el-select style="width: 240px" v-model="form.roleId" placeholder="">
            <el-option
              v-for="item in roleList"
              clearable
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="remark">
          <el-input v-model="form.remark" style="width:240px" rows="6" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-button class="channel-baseinfo-save" type="primary" @click="onSubmit">保存</el-button>
          <el-button class="channel-baseinfo-save" @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {
  queryRole,
  insertRole,
  checkMobile,
  queryUseById
} from '@/api/setting/account'
export default {
  data() {
    var mobileRule = (rule, value, callback) => {
      if ((/^1[3456789]\d{9}$/.test(value))) {
        callback()
      } else {
        callback('请输入正确的手机号')
      }
    }
    return {
      form: {
        loginName: '',
        userName: '',
        psw: '',
        roleId: '',
        remark: ''
      },
      rules: {
        loginName: [
          { required: true, trigger: "blur", validator: mobileRule }
        ],
        userName: [
          { required: true, message: "请输入经销商名称", trigger: "blur" },
          { max: 30, message: '长度在 30 个字符以内', trigger: 'blur' }
        ],
        roleId: [
          { required: true, message: "请选择角色", trigger: "blur" }
        ]
      },
      roleList: {},
      type: true
    };
  },
  methods: {
    async onSubmit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          let data = {
            id: this.$route.query.id || '',
            loginName: this.form.loginName,
            remark: this.form.remark,
            roleId: this.form.roleId,
            userName: this.form.userName
          }
          try {
            const res = await insertRole(data)
            this.$message.success('操作成功')
            this.$router.push({ path: 'accountSetting' })
          } catch (e) {}
        } else {
        }
      })
    },
    cancel () {
      this.$router.push({ path: 'accountSetting' })
    },
    async getRoleList () {
      try {
        const res = await queryRole({})
        this.roleList = res
      } catch (e) {}
    },
    async queryUseById () {
      let data = {
        id: this.$route.query.id
      }
      try {
        const res = await queryUseById(data)
        this.form = res
      } catch (e) {}
    }
  },
  mounted() {
    this.getRoleList()
    if (this.$route.query.id) this.queryUseById()
  },
  computed: {
    loginName() {
      return this.form.loginName
    }
  },
  watch: {
    async loginName (newValue, oldValue) {
      // this.form.loginName = newValue.substr(0,11)
      if (newValue.length === 11 && !this.$route.query.id) { // 当且仅当输入框内容的长度为11且为新增的时候才进行校验手机号是否重复
        let data = {
          mobile: newValue
        }
        try {
          const res = await checkMobile(data)
        } catch (e) {}
      }
    }
  },
  created() {
    this.type = this.$route.query.id ? false : true // 由于query过来的参数是string, 所以要转换为number方便判断
    console.log(this.type)
  }
}
</script>

<style lang="scss" scoped>
.km-setting-account-add {
  display: flex;
  justify-content: center;
  padding-top: 48px;
}
.channel-baseinfo-save {
  padding: 8px 23px;
}
.km-baseinfo-cancel {
  padding: 8px 23px;
}
.km-setting-dialog {
  /deep/.el-dialog__body {
    display: flex;
    justify-content: center;
  }
}
.clicked {
  padding: 8px 7px;
}
</style>
