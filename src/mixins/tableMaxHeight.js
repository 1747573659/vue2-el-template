const tableMaxHeight = {
  data() {
    return {
      tabMaxHeight: 0
    }
  },
  mounted() {
    window.addEventListener('resize', this.tableMaxHeight)
    this.$nextTick(() => {
      this.tableMaxHeight()
    })
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.tableMaxHeight)
  },
  methods: {
    tableMaxHeight() {
      let timer
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        const mainHeight = document.documentElement.clientHeight
        const headHeight = document.querySelector('.p-head').offsetHeight
        const tagHeight = document.querySelector('.p-tags_con').offsetHeight
        const searchBoxHeight = document.querySelector('.search-box')?.offsetHeight ?? 0
        const pageHeight = document.querySelector('.km-page-block')?.offsetHeight ?? 0
        this.tabMaxHeight = mainHeight - headHeight - tagHeight - searchBoxHeight - pageHeight - 32 - 16
      }, 100)
    }
  }
}

const dataMaxHeight = {
  data() {
    return {
      dataMaxHeight: 0
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.dataMaxHeight()
    })
  },
  methods: {
    dataMaxHeight() {
      const mainHeight = document.documentElement.clientHeight
      const headHeight = document.querySelector('.p-head').offsetHeight
      const tagHeight = document.querySelector('.p-tags_con').offsetHeight
      const searchBoxHeight = document.querySelector('.search-box')?.offsetHeight ?? 0
      const pageHeight = document.querySelector('.km-page-block')?.offsetHeight ?? 0
      this.tabMaxHeight = mainHeight - headHeight - tagHeight - searchBoxHeight - pageHeight - 32 - 16
    }
  }
}

export { tableMaxHeight, dataMaxHeight }
