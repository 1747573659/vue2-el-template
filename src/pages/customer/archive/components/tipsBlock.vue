<template>
  <div class="km-tips-con">
    <i class="km-tips__icon" :class="[iconClass]" v-if="showIcon"></i>
    <div v-if="title || $slots.title">
      <slot name="title">{{ title }}</slot>
    </div>
    <div v-if="(data || $slots.data) && data.length > 0">
      <div class="km-tips-item" v-for="(item, index) in data" :key="index">{{ item.label }}：{{ item.value }}}</div>
    </div>
  </div>
</template>

<script>
const TYPE_CLASSES_MAP = {
  success: 'el-icon-success',
  warning: 'el-icon-warning',
  error: 'el-icon-error'
}
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    data: {
      type: [Array, Object],
      default: () => []
    },
    type: {
      type: String,
      default: 'info'
    },
    showIcon: {
      type: Boolean
    }
  },
  computed: {
    iconClass() {
      return TYPE_CLASSES_MAP[this.type] || 'el-icon-info'
    }
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
  .km-tips-item {
    font-size: 14px;
    color: #3d4966;
    &:not(:last-child) {
      margin-right: 25px;
    }
  }
}
.km-tips__icon {
  font-size: 16px;
  width: 16px;
}
</style>
