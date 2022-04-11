<template>
  <div class="data-box" v-permission.page="'ACCOUNT_ROLE_ADD,ACCOUNT_ROLE_EDIT'">
    <div class="km-setting-roleAdd">
      <el-form ref="form" size="small" :rules="rules" label-suffix=":" :model="form" label-width="110px" style="width: 800px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name" maxlength="50" style="width: 240px"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.remark" maxlength="250" style="width: 240px" :autosize="{ minRows: 6 }" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="PC后台权限">
          <tree-custom :data="pcData" show-checkbox ref="treePC" node-key="id" accordion :default-expanded-keys="[-1]" :default-checked-keys="defaultPCList" :props="defaultProps">
          </tree-custom>
        </el-form-item>
        <el-form-item label="E助手权限">
          <tree-custom :data="appData" show-checkbox ref="treeE" node-key="id" accordion :default-expanded-keys="[-1]" :default-checked-keys="defaultAPPList" :props="defaultProps">
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
import { addRole, queryAllPCMenu, queryAllAPPMenu, queryRoleById, checkRoleName } from '@/api/setting/account'
import { routeTree } from '@/utils'
import { routeTreeLevel, sortData } from '@/utils/modules/routeTree.js'

export default {
  name: 'roleAdd',
  components: {},
  data() {
    var nameRule = async (rule, value, callback) => {
      if (value.length === 0) {
        callback('请输入角色名称')
      } else if (value.length > 50) {
        callback('角色名称应少于50个字符')
      } else if (value !== this.form.usedName) {
        // 当编辑的时候，如果当前修改后的名字和原本的名字一样则不触发校验
        try {
          const res = await checkRoleName({ name: value })
          callback(res)
        } catch (e) {}
      }
    }
    return {
      rules: {
        name: [{ required: true, trigger: 'blur', validator: nameRule }]
      },
      form: {
        id: null,
        usedName: '',
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
    // 递归选中的id
    getCheckIdInitForPC(arr) {
      var temp = []
      if (arr && arr.length > 0) {
        arr.forEach(item => {
          item['children'] = []
          if (!item.parentId) {
            temp.push(item)
          }
          if (item.parentId) {
            // 递归操作
            const traverse = function (array, item) {
              array.forEach(cItem => {
                if (cItem.id === item.parentId) {
                  cItem['children'].push(item)
                } else {
                  traverse(cItem['children'], item)
                }
              })
            }
            traverse(temp, item)
          }
        })
      }
      // let obj = this.toChildrenNum(list)
      function t2(array) {
        array.length > 0 &&
          array.forEach(item => {
            if (item['children'].length === 0) {
              this.defaultPCList.push(item.id)
            } else {
              t2.call(this, item['children'])
            }
          })
      }
      t2.call(this, temp)
    },
    getCheckIdInitForAPP(arr, list) {
      var temp = []
      if (arr && arr.length > 0) {
        arr.forEach(item => {
          item['children'] = []
          if (!item.parentId) {
            temp.push(item)
          }
          if (item.name === '查看') {
            item.disabled = true
            item.checked = true
            list.push(item)
          }
          if (item.parentId) {
            // 递归操作
            const traverse = function (array, item) {
              array.forEach(cItem => {
                if (cItem.id === item.parentId) {
                  cItem['children'].push(item)
                } else {
                  traverse(cItem['children'], item)
                }
              })
            }
            traverse(temp, item)
          }
        })
      }
      // let obj = this.toChildrenNum(list)
      function t2(array) {
        array.length > 0 &&
          array.forEach(item => {
            if (item['children'].length === 0) {
              this.defaultAPPList.push(item.id)
            } else {
              t2.call(this, item['children'])
            }
          })
      }
      t2.call(this, temp)
    },
    getCheckIdList(tree) {
      let checkIdList = []
      const traverse = function (node) {
        const childNodes = node.root ? node.root.childNodes : node.childNodes
        childNodes.forEach(child => {
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
    cancel() {
      this.$store.dispatch('delTagView', this.$route).then(() => {
        this.$router.push({ name: 'roleManagement' })
      })
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
            await addRole(data)
            this.$message.success('操作成功')
            this.$store.dispatch('delTagView', this.$route).then(() => {
              this.$router.push({ name: 'roleManagement' })
            })
          } catch (e) {
          } finally {
            this.submitLoading = false
          }
        }
      })
    },
    async queryAllAPPMenu(id) {
      try {
        const res = await queryAllAPPMenu({ roleId: id })
        this.appData = [
          {
            id: -1,
            name: '访问权限',
            children: routeTree(res.allMenus) || []
          }
        ]
        this.getCheckIdInitForAPP(res.roleMenus || [], this.appData.children)
        sortData(this.appData[0].children)
      } catch (e) {}
    },
    async queryAllPCMenu(id) {
      try {
        if (id) {
          this.queryRoleById()
        }
        const res = await queryAllPCMenu({ roleId: id })
        var cid = 444444
        // 屏蔽二级经销商采购订单权限选择
        const userInfo = JSON.parse(localStorage.getItem('userInfo'))
        if ((userInfo.propertyType === 1 && userInfo.level === 2) || userInfo.propertyType === 2) {
          let purchaseOrderCodes = [
            'ORDERCENTER_ORDERMANAGEMENT_SOFTWAREPURCHASEORDER',
            'ORDERCENTER_ORDERMANAGEMENT_HARDWAREPURCHASEORDER',
            'ORDERCENTER_ORDERMANAGEMENT_DEMANDDEVELOPMENTFEE',
            'ORDERCENTER_ORDERMANAGEMENT_SOFTWAREUPDATEORDER'
          ]
          if (userInfo.propertyType === 2)
            purchaseOrderCodes = purchaseOrderCodes.concat([
              'XDD_PAY_SHOP_SOFTNOTEMANGEMENT',
              'ORDERCENTER_ORDERMANAGEMENT',
              'ORDERCENTER_ORDERMANAGEMENT_SOFTWAREAUTHORIZATION',
              'ORDERCENTER_ORDERMANAGEMENT_SOFTWAREINVENTORYREPLACE',
              'ORDERCENTER_ORDERMANAGEMENT_SOFTWAREINVENTORYAPPLY',
              'ORDERCENTER_ORDERMANAGEMENT_SELFSERVICEEQUIPMENT',
              'ORDERCENTER_ORDERMANAGEMENT_ERPAUTHORIZEDTRANSFER',
              'ORDERCENTER_EWECHAT_ORDER'
            ])
          const purchaseOrderIds = []
          res.allMenus = res.allMenus.filter(item => {
            if (purchaseOrderCodes.includes(item.code)) purchaseOrderIds.push(item.id)
            return !purchaseOrderCodes.includes(item.code) && !purchaseOrderIds.includes(item.parentId)
          })
        }
        let newRouteTree = routeTree(res.allMenus)
        let isNodeCheck, isDisabled
        let sysMenuThree =
          routeTreeLevel(res.roleMenus || [])
            .filter(item => item.lever === 3)
            .map(item => item.id) || []
        newRouteTree.forEach(itemOne => {
          if (itemOne && itemOne.children) {
            itemOne.children.forEach(itemTwo => {
              if (itemTwo && itemTwo.children) {
                itemTwo.children.forEach(itemThree => {
                  cid++
                  if (itemThree && itemThree.children) {
                    if (sysMenuThree.includes(itemThree.id)) {
                      isNodeCheck = true
                      isDisabled = true
                      res.roleMenus.push({
                        id: cid,
                        name: '查看',
                        code: 'COMMON_HEADQUARTERS_MANAGEMENT_VIEW',
                        iconCls: null,
                        url: null,
                        lever: 4,
                        parentId: itemThree.id,
                        remark: null,
                        creatorId: null,
                        createTime: null,
                        modifierId: null,
                        modifyTime: null,
                        type: 4,
                        appId: null,
                        parentName: null,
                        children: null,
                        viewPath: null,
                        sort: 100,
                        domainType: null,
                        menuType: 2
                      })
                    } else {
                      isNodeCheck = false
                      isDisabled = false
                    }
                    itemThree.children.push({
                      id: cid,
                      name: '查看',
                      code: 'COMMON_HEADQUARTERS_MANAGEMENT_VIEW',
                      iconCls: null,
                      url: null,
                      lever: 4,
                      parentId: itemThree.id,
                      remark: null,
                      creatorId: null,
                      createTime: null,
                      modifierId: null,
                      modifyTime: null,
                      type: 4,
                      parentName: null,
                      children: [],
                      disabled: isNodeCheck,
                      checked: isDisabled,
                      viewPath: null,
                      sort: 100,
                      domainType: null,
                      appId: null,
                      menuType: 2
                    })
                  }
                })
              }
            })
          }
        })
        this.pcData = [
          {
            id: -1,
            name: '访问权限',
            children: newRouteTree || []
          }
        ]
        id && this.getCheckIdInitForPC(res.roleMenus || [], res.allMenus || [])
        sortData(this.pcData[0].children)
      } catch (e) {}
    },
    async queryRoleById() {
      try {
        const res = await queryRoleById({ id: this.$route.query.id })
        this.form.id = res.id
        this.form.name = res.name
        this.form.usedName = res.name
        this.form.remark = res.remark
      } catch (e) {}
    }
  },
  mounted() {
    this.queryAllPCMenu(this.$route.query.id || '')
    this.queryAllAPPMenu(this.$route.query.id || '')
    this.$nextTick(() => {
      document.querySelector('.e-tag_active span').innerText = `角色管理/${this.$route.query.id ? '编辑' : '新增'}`
    })
  }
}
</script>
<style lang="scss" scoped>
.data-box {
  border-top: 16px solid#f7f8fa;
  border-bottom: 16px solid#f7f8fa;
}
.km-setting-roleAdd {
  display: flex;
  justify-content: center;
  padding-top: 16px;
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
