<template>
  <section class="p-tags_con">
    <div
      class="p-tags_item"
      :class="{ 'e-tag_active': isActive(item), 'e-tag-cut__pd': hasTagIndex(index) }"
      @mouseover="setTagIndex(index)"
      @mouseleave="resetTagIndex"
      @click="handleJumpPage(item, item.query)"
      v-for="(item, index) in tagViews"
      :key="item.path"
    >
      {{ item.title }}
      <i v-if="hasTagIndex(index) && item.name !== 'homeIndex'" class="el-icon-close" :class="{ 'e-tag_close': hasTagIndex(index) }" @click.stop="handleClose(item)"></i>
    </div>
  </section>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  data() {
    return {
      tags: [],
      activeIndex: 0
    }
  },
  watch: {
    $route() {
      this.handleTagViews()
    },
    tagViews(val) {
      this.tags = val
    }
  },
  computed: {
    ...mapGetters(['tagViews', 'routes'])
  },
  mounted() {
    this.handleTagViews()
  },
  methods: {
    ...mapActions(['setTagViews', 'setCachedViews', 'delTagView', 'delCachedView']),
    handleTagViews() {
      if (this.$route.name) {
        this.setTagViews(this.$route)
        this.setCachedViews(this.$route)
      }
    },
    handleJumpPage(item, query) {
      if (this.$route.path === item.path) return
      this.$router.push({ path: item.path, query: Object.keys(query).length === 0 ? {} : query })
    },
    handleClose(item) {
      this.delTagView(item).then(views => {
        if (this.isActive(item)) {
          const latestView = views.slice(-1)[0]
          if (latestView) {
            this.$router.push({ path: latestView.path, query: latestView.query ? {} : latestView.query })
          } else {
            const menus = this.routes
            if (JSON.stringify(menus).includes('home')) {
              this.$router.push({ name: 'home' })
            } else {
              this.$router.push({ name: menus[0].children[0].children[0].name, query: { time: String(new Date().getTime()) } })
            }
          }
          this.delCachedView(item)
        }
      })
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
      display: block;
      float: left;
      font-size: 14px;
      color: #555555;
      background: #f6f6f6;
      line-height: 32px;
      height: 32px;
      padding: 0 20px 0 20px;
      border-right: 1px solid #e8e8e8;
      border-top: 1px solid #e8e8e8;
      margin-top: 14px;
      cursor: pointer;
      box-sizing: content-box;
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
