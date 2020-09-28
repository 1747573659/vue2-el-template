<template>
  <div v-permission.page="'AGENT_MANAGE_EDIT'">
    <base-edit :isEdit="isEdit"></base-edit>
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
    }
  },
}
</script>

<style lang="scss" scoped></style>
