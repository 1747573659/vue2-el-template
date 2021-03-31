<template>
  <section :style="bgColor" class="p-count-con">
    <slot name="icon">
      <i :class="`el-icon-${icon}`" v-if="icon"></i>
    </slot>
    <slot name="content">
      <div v-if="content">{{ content }}</div>
    </slot>
    <template v-if="data.length > 0">
      <div class="p-count-item" v-for="(item, index) in data" :key="index">{{ item.label }}：{{ item.value }}</div>
    </template>
  </section>
</template>

<script>
export default {
  props: {
    icon:{
      type: String,
      default: ''
    },
    data: {
      type: [Object, Array],
      default: () => []
    },
    color: {
      type: String,
      default: '#FF6010'
    },
    bdColor: {
      type: String,
      default: '#FF6010'
    },
    content: {
      type: String,
      default: ''
    }
  },
  computed: {
    bgColor() {
      return {
        'background-color': this.color,
        'border-color': this.bdColor
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.p-count-con {
  border-radius: 2px;
  min-height: 40px;
  max-height: 40px;
  border: 1px solid;
  display: flex;
  align-items: center;
  padding: 7px 16px;
  .p-count-item {
    font-size: 14px;
    color: #3d4966;
    &:not(:last-child) {
      margin-right: 25px;
    }
  }
}
</style>
