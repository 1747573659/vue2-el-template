<template>
  <div class="descriptions">
    <div v-if="divide" class="divide" />
    <div class="descriptions__title">{{ title }}</div>
    <el-row v-bind="$props"><slot /></el-row>
  </div>
</template>

<script>
export default {
  name: 'List',
  props: {
    title: {
      type: String,
      default: ''
    },
    divide: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style lang="scss" scoped>
.descriptions {
  font-size: 14px;
  .divide {
    height: 1px;
    background: #d5d5d5;
    margin: 20px 0 20px;
  }
  &__title {
    font-weight: 600;
    color: #212430;
    line-height: 22px;
    margin-bottom: 20px;
    font-size: 16px;
  }
}
</style>
