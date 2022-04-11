<template>
  <div v-permission.page="'AGENT_MANAGE_EDIT'" class="km-container__inner">
    <base-edit :isEdit="isEdit"></base-edit>
  </div>
</template>

<script>
import BaseEdit from './components/BaseEdit.vue'

export default {
  name: 'editAgent',
  components: {
    BaseEdit
  },
  data() {
    return {
      isEdit: true
    }
  }
}
</script>

<style lang="scss" scoped></style>
