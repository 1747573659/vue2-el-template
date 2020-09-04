<template>
  <div class="data-box">
    <div class="km-setting-roleAdd">
      <el-form ref="form" size="small" :rules="rules" label-suffix=":" :model="form" label-width="110px" style="width: 600px">
        <el-form-item label="角色名称" required>
          <el-input v-model="form.name" style="width:240px"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.name" style="width:240px" rows="6" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="PC后台权限">
          <authority-tree></authority-tree>
        </el-form-item>
        <el-form-item label="E助手权限">
          <tree-custom
            :data="EData"
            show-checkbox
            ref="tree"
            node-key="id"
            accordion
            :default-expanded-keys="[-1]"
            :default-checked-keys="defaultEList"
            :props="defaultProps"
          >
          </tree-custom>
        </el-form-item>
        <el-form-item label="">
          <el-button class="channel-setting-save" type="primary" @click="onSubmit">保存</el-button>
          <el-button class="channel-setting-save" @click="onSubmit">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { queryPCMenuByRoleId, queryAPPMenuByRoleId } from '@/api/setting/account'
import routeTree from '@/utils/routeTree'
import authorityTree from '@/components/authorityTree'
export default {
  components: {
    authorityTree
  },
  data() {
    return {
      rules: {},
      form: {
        name: ''
      },
      pcData: [],
      EData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      defaultPCList: [],
      defaultEList: []
    }
  },
  methods: {
    onSubmit() {},
    async queryAPPMenuByRoleId () {
      let data = {
        roleId: this.$route.query.id || ''
      }
      try {
        const res = await queryAPPMenuByRoleId(data)
        this.pcData = [{
          id: -1,
          name: '访问权限',
          children: res || []
        }]
        console.log(this.pcData)
      } catch (e) {
      } finally {}
    },
    async queryPCMenuByRoleId () {
      let data = {
        roleId: this.$route.query.id || ''
      }
      try {
        const res = await queryPCMenuByRoleId(data)
      } catch (e) {
      } finally {}
    }
  },
  mounted() {
    this.queryAPPMenuByRoleId()
    this.queryPCMenuByRoleId()
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
