<template>
  <div class="data-box" v-permission.page="'ACCOUNT_SET_ADD,ACCOUNT_SET_EDIT'">
    <div class="km-setting-account-add">
      <el-form ref="form" size="small" :rules="rules" label-suffix=":" :model="form" label-width="110px" style="width:350px">
        <el-form-item label="手机 (账号)" prop="loginName">
          <el-input v-model.trim="form.loginName" v-if="isAdd"></el-input>
          <span v-else>{{form.loginName}}</span>
        </el-form-item>
        <el-form-item label="姓名" prop="userName">
          <el-input v-model="form.userName"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="psw" v-if="isAdd">
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
          <el-input v-model="form.remark" style="width:240px" :autosize="{ minRows: 6 }" type="textarea"></el-input>
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
  queryUserById
} from '@/api/setting/account'
export default {
  name: 'accountSettingAdd',
  data() {
    var mobileRule = async (rule, value, callback) => {
      if (!this.isAdd) {
        callback()
      } else if ((/^1[3456789]\d{9}$/.test(value))) {
        let data = {
          mobile: value
        }
        try {
          const res = await checkMobile(data)
          callback(res ? '此手机已注册，请更改后重试。' : null)
        } catch (e) {}
      } else if (value.length === 0) {
        callback('请输入手机号')
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
          { required: true, message: "请输入姓名", trigger: "blur" },
          { max: 30, message: '长度在 30 个字符以内', trigger: 'blur' }
        ],
        roleId: [
          { required: true, message: "请选择角色", trigger: "blur" }
        ]
      },
      roleList: {},
      isAdd: true
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
            this.$store.dispatch('delTagView', this.$route).then(() => {
              this.$router.push({ path: 'accountSetting' })
            })
          } catch (e) {}
        } else {
        }
      })
    },
    cancel () {
      this.$store.dispatch('delTagView', this.$route).then(() => {
        this.$router.push({ path: 'accountSetting' })
      })
    },
    async getRoleList () {
      try {
        const res = await queryRole({})
        this.roleList = res
      } catch (e) {}
    },
    async queryUserById () {
      let data = {
        id: this.$route.query.id
      }
      try {
        const res = await queryUserById(data)
        this.form = res
      } catch (e) {}
    }
  },
  mounted() {
    this.getRoleList()
    if (this.$route.query.id) this.queryUserById()
  },
  computed: {
    loginName() {
      return this.form.loginName
    }
  },
  created() {
    this.isAdd = this.$route.query.id ? false : true // 由于query过来的参数是string, 所以要转换为number方便判断
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
