<template>
  <div class="km-tips-con">
    <template v-if="showIcon && (icon || $slots.icon)">
      <slot name="icon">
        <i class="km-tips__icon" :class="[icon]"></i>
      </slot>
    </template>
    <div v-if="title || $slots.title">
      <slot name="title">{{ title }}</slot>
    </div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      default: 'el-icon-info'
    },
    title: {
      type: String,
      default: ''
    },
    showIcon: { type: Boolean }
  }
}
</script>

<style lang="scss" scoped>
.km-tips-con {
  border-radius: 2px;
  min-height: 40px;
  max-height: 40px;
  background: rgba(255, 96, 16, 0.08);
  border: 1px solid rgba(255, 96, 16, 0.4);
  display: flex;
  align-items: center;
  padding: 7px 16px;
  margin: 0 8px 16px 8px;

  .km-tips__icon {
    font-size: 16px;
    width: 16px;
  }
}
</style>
