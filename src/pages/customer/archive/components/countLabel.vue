<template>
  <div class="p-count-con">
    <section class="p-count-main">
      <slot name="tips"></slot>
      <template v-for="(item, index) in countData">
        <div class="p-count_item" :key="index">{{ item[label] }}：{{ item[value] }}</div>
      </template>
    </section>
  </div>
</template>

<script>
export default {
  props: {
    countData: {
      type: [Object, Array],
      default: () => []
    },
    label: {
      type: String,
      default: 'label'
    },
    value: {
      type: String,
      default: 'value'
    },
    bgColor: {
      type: String
    }
  }
}
</script>

<style lang="scss" scoped>
.p-count-con {
  min-height: 34px;
  margin: 0 8px 16px 8px;
  .p-count-main {
    background: rgba(255, 96, 16, 0.08);
    border: 1px solid rgba(255, 96, 16, 0.4);
    border-radius: 2px;
    display: flex;
    align-items: center;
    padding: 7px 16px;
    font-size: 14px;
    color: #3d4966;
    img {
      width: 16px;
      height: 16px;
      margin-right: 8px;
    }
  }
  .p-count_item {
    &:not(:last-child) {
      margin-right: 30px;
    }
  }
}
</style>
