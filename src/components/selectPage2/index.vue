<template>
  <div>
    <el-select
      :id="domID"
      :style="{ width: width }"
      class="select-page"
      v-model="selValue"
      v-loadmore="remoteMethod"
      filterable
      :disabled="disabled"
      clearable
      :collapse-tags="true"
      remote
      clear
      :multiple-limit="1"
      no-data-text="暂无匹配数据"
      no-match-text="暂无匹配数据"
      :reserve-keyword="false"
      :placeholder="placeText"
      :remote-method="remoteMethod"
      @clear="clear()"
      @visible-change="visibleChange"
    >
      <el-option v-for="item in options" :key="item[id]" :label="item[name]" :value="item[id]"> </el-option>
      <div class="loading-page">{{ isMaxPage ? '已全部加载完毕' : '正在加载下一页' }}</div>
    </el-select>
  </div>
</template>

<script>
export default {
  data() {
    return {
      domID: `domID${Math.floor(Math.random() * 100000000 + 1)}`, //随机生成一个唯一ID
      isMaxPage: false,
      options: [],
      page: 1,
      placeText: '',
      disabled: false
    }
  },
  props: {
    placeholder: {
      type: String,
      default: ''
    },
    bvalue: {
      type: [String, Array, Number],
      default: ''
    },
    isMultiple: {
      type: Boolean,
      default: false
    },
    isNeedinitId: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      default: 'id'
    },
    name: {
      type: String,
      default: 'label'
    },
    searchName: {
      type: String,
      default: ''
    },
    parame: {
      type: Object,
      default: null
    },
    request: {
      type: Function,
      default: null
    },
    width: {
      type: String,
      default: ''
    }
  },
  computed: {
    selValue: {
      get() {
        return this.bvalue
      },
      set(val) {
        this.$emit('update:bvalue', val)
      }
    }
  },
  directives: {
    loadmore: {
      // 指令的定义
      bind: function(el, binding) {
        // 获取km-ui定义好的scroll盒子
        const SELECTWRAP_DOM = el.querySelector('.el-select-dropdown .el-select-dropdown__wrap')
        SELECTWRAP_DOM.addEventListener('scroll', function() {
          const CONDITION = this.scrollHeight - this.scrollTop <= this.clientHeight
          if (CONDITION) {
            binding.value()
          }
        })
      }
    }
  },
  watch: {
    parame: function(val, oldVal) {
      if (val) {
        Object.keys(val).forEach((value, index) => {
          if (val[value] && val[value] !== oldVal[value]) {
            this.selValue = ''
            this.isInit = true
            this.options = []
            this.page = 1
            this.isMaxPage = false
            this.remoteMethod()
          }
          if (val[value] === '') {
            this.selValue = ''
            this.isInit = true
            this.options = []
            this.page = 1
            this.disabled = true
            this.isMaxPage = false
          }
        })
      }
    }
  },
  mounted() {
    this.isInit = false
    if (!this.isMultiple) {
      this.remoteMethod()
    } else {
      this.placeText = '全部'
      this.disabled = true
    }
  },
  methods: {
    // 选项展开关闭回掉
    visibleChange(event) {
      if (event) {
        if (!this.options.length) {
          // 如果options为空，下面走没有意义所以return
          if (this.selValue) {
            //筛选一下获取options
            this.remoteMethod(this.selValue)
            setTimeout(() => {
              this.visibleChange(true)
            }, 500) //由于之前的人没有写回掉，所以先通过计时器自己回掉
          }
          return
        }
        // 如果展开
        let label = ''
        for (let i = 0; i < this.options.length; i++) {
          const item = this.options[i]
          if (this.selValue === item[this.id] || this.bvalue === item[this.name]) {
            label = item[this.name]
          }
        }
        setTimeout(() => {
          document.getElementById(this.domID).value = label || '' //通过ID原生绑定
        }, 200)
      }
    },
    clear() {
      this.page = 1
      this.options = []
      this.remoteMethod()
    },
    remoteMethod(query) {
      let data = {}
      if (query !== undefined) {
        this.options = []
        this.page = 1
        this.isMaxPage = false
        data = {
          page: this.page,
          rows: 10,
          [this.searchName]: query
        }
        this.isInit = false
      } else {
        if (this.isNeedinitId) {
          data = {
            [this.searchName]: '',
            page: this.page,
            rows: 10
          }
        } else {
          data = {
            page: this.page,
            rows: 10
          }
        }
      }
      this.request(Object.assign(data, this.parame))
        .then(res => {
          if (!res.results) this.isMaxPage = true
          if (res.results && res.results.length < 10) this.isMaxPage = true
          if (this.isInit && !res.results) {
            this.placeText = '全部'
            this.disabled = true
          } else {
            if (!this.isMultiple) {
              this.placeText = '请选择' + this.placeholder
            } else {
              this.placeText = '全部'
            }
            //this.placeText="请选择"+this.placeholder
            this.isInit = false
            this.disabled = false
          }
          this.page++
          if (query !== undefined) {
            this.options = res.results || []
          } else {
            this.options = this.options.concat(res.results || [])
          }
        })
        .finally(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
.select-page {
  width: 240px;
}
.loading-page {
  margin: 5px 0;
  text-align: center;
  // color: #212430;
  font-size: 10px;
}
</style>