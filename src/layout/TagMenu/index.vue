<template>
  <section class="p-tags_con">
    <span></span>
    <!-- <div ref="tags">
      <div
        v-for="(item, index) in tags"
        :key="item.title"
        class="p-tags_item"
        :class="{ 'e-tag-cut__pd': hasTagIndex(index), 'e-tag_active': isActive(index) }"
        @mouseover="setTagIndex(index)"
        @mouseleave="resetTagIndex"
        @click="handleJumpPage"
      >
        <span>{{ item.title }}</span>
        <i v-if="hasTagIndex(index) && activeIndex !== 0" class="el-icon-close" :class="{ 'e-tag_close': hasTagIndex(index) }" @click.stop="handleClose(item)"></i>
      </div>
    </div> -->
  </section>
</template>

<script>
export default {
  data() {
    return {
      tags: [{ title: '首页' }, { title: '测试页' }],
      activeIndex: 0
    }
  },
  watch: {
    $route() {}
  },
  methods: {
    addTagViews() {
      if (this.$route.name) {
        
      }
    },
    handleJumpPage() {},
    handleClose(item) {
      console.info(item)
    },
    setTagIndex(index) {
      this.activeIndex = index
    },
    resetTagIndex() {
      this.activeIndex = 0
    },
    isActive(route) {
      return route.path === this.$route.path
    },
    hasTagIndex(index) {
      return this.activeIndex === index
    }
  }
}
</script>

<style lang="scss" scoped>
.p {
  &-tags {
    &_con {
      height: 48px;
      min-height: 48px;
      padding: 0 10px;
      background: #ffffff;
      border-bottom: 1px solid #e8e8e8;
      position: fixed;
      top: 56px;
      left: 200px;
      width: 100%;
      z-index: 1000;
    }
    &_item {
      padding: 0 20px;
      float: left;
      line-height: 32px;
      height: 32px;
      border-right: 1px solid #e8e8e8;
      border-top: 1px solid #e8e8e8;
      border-bottom: 1px solid #e8e8e8;
      margin-top: 16px;
      background: #f6f6f6;
      cursor: pointer;
      &:first-child {
        border-left: 1px solid #e8e8e8;
      }
    }
  }
}
.e {
  &-tag {
    &_active {
      background: #fff;
      color: #1a92fd;
      border-bottom: 1px solid #fff;
    }
    &_close {
      margin-left: 10px;
    }
    &-cut__pd {
      padding-right: 10px;
    }
  }
}
</style>
