<template>
  <div class="data-box">
    <div class="km-setting-roleAdd">
      <el-form ref="form" size="small" :rules="rules" label-suffix=":" :model="form" label-width="110px" style="width: 800px">
        <el-form-item label="角色名称" required prop="name">
          <el-input v-model="form.name" style="width:240px"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.remark" maxlength="250" style="width:240px" rows="6" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="PC后台权限">
          <tree-custom
            :data="pcData"
            show-checkbox
            ref="treePC"
            node-key="id"
            accordion
            :default-expanded-keys="[-1]"
            :default-checked-keys="defaultPCList"
            :props="defaultProps"
          >
          </tree-custom>
        </el-form-item>
        <el-form-item label="E助手权限">
          <tree-custom
            :data="appData"
            show-checkbox
            ref="treeE"
            node-key="id"
            accordion
            :default-expanded-keys="[-1]"
            :default-checked-keys="defaultAPPList"
            :props="defaultProps"
          >
          </tree-custom>
        </el-form-item>
        <el-form-item label="">
          <el-button class="channel-setting-save" :loading="submitLoading" type="primary" @click="onSubmit">保存</el-button>
          <el-button class="channel-setting-save" @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {
  addRole,
  queryAllPCMenu,
  queryAllAPPMenu,
  queryRoleById
} from '@/api/setting/account'
import routeTree from '@/utils/routeTree'
export default {
  components: {
  },
  data() {
    return {
      rules: {
        name: [
          { required: true, trigger: "blur", message: '请输入角色名称' },
          { max: 55, message: '长度在 50 个字符以内', trigger: 'blur' }
        ],
      },
      form: {
        id: null,
        name: '',
        remark: '',
        menuIdsPC: '',
        menuIdsAPP: ''
      },
      submitLoading: false,
      pcData: [],
      appData: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      defaultPCList: [],
      defaultAPPList: []
    }
  },
  methods: {
    getCheckIdList (tree) {
      let checkIdList = []
      const traverse = function (node) {
        const childNodes = node.root ? node.root.childNodes : node.childNodes
        childNodes.forEach((child) => {
          if (child.checked || child.indeterminate) {
            if (child.data.code !== 'COMMON_HEADQUARTERS_MANAGEMENT_VIEW') {
              checkIdList.push(child.key)
            }
          }
          traverse(child)
        })
      }
      traverse(tree)
      if (checkIdList[0] === -1) {
        return checkIdList.slice(1).join(',')
      } else {
        return checkIdList.join(',')
      }
    },
    cancel () {
      this.$router.push({ name: 'role' })
    },
    async onSubmit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.submitLoading = true
          this.form.menuIdsPC = this.getCheckIdList(this.$refs.treePC)
          this.form.menuIdsAPP = this.getCheckIdList(this.$refs.treeE)
          let data = {
            id: this.form.id || null,
            menuIdsAPP: this.form.menuIdsAPP,
            menuIdsPC: this.form.menuIdsPC,
            name: this.form.name,
            remark: this.form.remark
          }
          try {
            const res = await addRole(data)
            this.$message.success('操作成功')
            this.$router.push({ name: 'role' })
          } catch (e) {
          } finally {
            this.submitLoading = false
          }
        }
      })
    },
    async queryAllAPPMenu (id) {
      try {
        const res = await queryAllAPPMenu({ roleId: id })
        this.appData = [{
          id: -1,
          name: '访问权限',
          children: routeTree(res.allMenus) || []
        }]
        res.roleMenus.forEach(item => {
          this.defaultAPPList.push(item.id)
        })
      } catch (e) {}
    },
    async queryAllPCMenu (id) {
      try {
        const res = await queryAllPCMenu({ roleId: id })
        this.pcData = [{
          id: -1,
          name: '访问权限',
          children: routeTree(res.allMenus) || []
        }]
        res.roleMenus.forEach(item => {
          this.defaultPCList.push(item.id)
        })
      } catch (e) {}
    },
    async queryRoleById () {
      try {
        const res = await queryRoleById({ 'id': this.$route.query.id })
        this.form.id = res.id
        this.form.name = res.name
        this.form.remark = res.remark
        res.menuIdsPC.forEach(item => {
          this.defaultPCList.push(item.id)
        })
      } catch(e) {}
    }
  },
  mounted() {
    this.queryAllPCMenu(this.$route.query.id || '')
    this.queryAllAPPMenu(this.$route.query.id || '')
    if (this.$route.query.id) {
      this.queryRoleById()
    }
  },
}
</script>

<style lang="scss" scoped>
.km-setting-roleAdd {
  display: flex;
  justify-content: center;
  padding-top: 48px;
}
.channel-setting-save {
  padding: 8px 22px;
}
.km-setting-cancel {
  padding: 8px 22px;
}
.clicked {
  padding: 8px 7px;
}
</style>
