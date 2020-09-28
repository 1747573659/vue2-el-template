<template>
  <div v-permission.page="'AGENT_ROLE_EDIT'">
    <role-form :isEdit="isEdit" :type="type" :router="router"></role-form>
  </div>
</template>

<script>
import RoleForm from '@/components/roleForm'

export default {
  name: 'editRole',
  components: {
    RoleForm,
  },
  data() {
    return {
      isEdit: true,
      type: 1,
      router: '/customer/agent/agentRole',
    }
  },
}
</script>

<style lang="scss" scoped></style>
