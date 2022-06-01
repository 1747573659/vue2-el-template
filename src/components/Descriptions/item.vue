<template>
  <el-col :span="column" v-bind="$props" class="descriptions__item">
    <span class="descriptions__item--label">{{ label }}</span>
    <span class="descriptions__item--val">
      <slot />
    </span>
  </el-col>
</template>

<script>
export default {
  name: 'Item',
  props: {
    label: {
      type: String,
      default: ''
    },
    column: {
      type: Number,
      default: 8
    }
  }
}
</script>

<style lang="scss" scoped>
.descriptions__item {
  margin-bottom: 8px;
  &--label {
    color: #807e7e;
    line-height: 20px;
  }
  &--val {
    color: #212430;
    line-height: 20px;
    margin-left: 16px;
  }
}
</style>
