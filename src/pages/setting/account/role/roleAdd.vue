<template>
  <div class="km-setting-roleAdd">
    <el-form ref="form" size="small" :rules="rules" label-suffix=":" :model="form" label-width="110px" style="width: 600px">
      <el-form-item label="角色名称" required>
        <el-input v-model="form.name" style="width:240px"></el-input>
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="form.name" style="width:240px" rows="6" type="textarea"></el-input>
      </el-form-item>
      <el-form-item label="PC后台权限">
        <tree-custom
          :data="pcData"
          show-checkbox
          ref="tree"
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
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  components: {
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
    onSubmit() {}
  }
}
</script>

<style lang="scss" scoped>
.km-setting-roleAdd {
  display: flex;
  justify-content: center;
  padding-top: 48px;
}
.channel-setting-save {
  padding: 8px 23px;
}
.km-setting-cancel {
  padding: 8px 23px;
}
.clicked {
  padding: 8px 7px;
}
</style>
