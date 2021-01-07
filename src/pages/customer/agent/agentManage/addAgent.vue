<template>
  <base-edit v-permission.page="'AGENT_MANAGE_ADD'"></base-edit>
</template>

<script>
import BaseEdit from './components/BaseEdit'

export default {
  name: 'addAgent',
  components: {
    BaseEdit,
  }
}
</script>