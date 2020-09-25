<template>
  <div>
    <base-edit :isEdit="isEdit">
    </base-edit>
    <!-- <base-edit :isEdit="isEdit" :ruleForm="ruleForm">
    </base-edit> -->
  </div>
</template>

<script>
import BaseEdit from './components/BaseEdit'
import { queryAgentById } from '@/api/customer/agent'

export default {
  name: 'editAgent',
  components: {
    BaseEdit,
  },
  data() {
    return {
      isEdit: true,
      // ruleForm: {},
    }
  },
  created() {
    // this.queryAgentById()
  },
  methods: {
    // 编辑时获取代理商基本信息
    // async queryAgentById() {
    //   const res = await queryAgentById({ id: Number(this.$route.query.id) })
    //   this.ruleForm = res
    //   const areaRes = await queryDistricDto({ code: res.districtCode })
    //   this.areaValue[0] = areaRes.provinceCode
    //   this.areaValue[1] = areaRes.cityCode
    //   if (areaRes.zoneCode) {
    //     this.areaValue[2] = areaRes.zoneCode
    //   }
    //   this.areaKey += 1
    // },
  },
}
</script>

<style lang="scss" scoped>
</style>
