<template>
  <role-form :isEdit="isEdit" :type="type" :router="router" v-permission.page="'AGENT_ROLE_ADD'"></role-form>
</template>

<script>
import RoleForm from '@/components/roleForm'

export default {
  name: 'addRole',
  components: {
    RoleForm
  },
  data() {
    return {
      isEdit: false,
      type: 1,
      router: '/customer/agent/agentRole'
    }
  }
}
</script>
