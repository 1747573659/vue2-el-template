<template>
  <div v-permission.page="'AGENT_MANAGE_ADD'" class="km-container__inner">
    <base-edit></base-edit>
  </div>
</template>

<script>
import BaseEdit from './components/BaseEdit'

export default {
  name: 'addAgent',
  components: {
    BaseEdit,
  },
  data() {
    return {}
  }
}
</script>

<style lang="scss" scoped></style>
