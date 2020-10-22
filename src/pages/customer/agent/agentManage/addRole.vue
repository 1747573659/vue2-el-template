<template>
  <div v-permission.page="'AGENT_ROLE_ADD'" class="km-container__inner">
    <role-form :isEdit="isEdit" :type="type" :router="router"></role-form>
  </div>
</template>

<script>
import RoleForm from '@/components/roleForm'

export default {
  name: 'addRole',
  components: {
    RoleForm,
  },
  data() {
    return {
      isEdit: false,
      type: 1,
      router: '/customer/agent/agentRole',
    }
  },
}
</script>

<style lang="scss" scoped></style>
