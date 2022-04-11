<template>
  <!-- 功能:单选且筛选时候具有可以复制label值的功能 -->
  <!-- 陈南方 2020-12-01 :value.sync 绑定值 -->
  <el-select
    @change="change"
    @visible-change="visibleChange"
    @focus="focus"
    v-model="bindValue"
    :id="domID"
    :placeholder="placeholder"
    :multiple="multiple"
    :disabled="disabled"
    :value-key="valueKey"
    :size="size"
    :clearable="clearable"
    :collapse-tags="collapseTags"
    :multiple-limit="multipleLimit"
    :name="name"
    :autocomplete="autocomplete"
    :filterable="filterable"
    :remote="remote"
    :reserve-keyword="reserveKeyword"
    :remote-method="remoteMethod"
    @clear="clear()">
    <el-option v-for="item in options" :key="item[optionsItem.key]" :label="item[optionsItem.label]" :value="item[optionsItem.value]"> </el-option>
  </el-select>
</template>
<script>
export default {
  props: {
    isCopy: {
      type: Boolean,
      default: false
    }, //是否可以复制
    placeholder: {
      type: String,
      default: ''
    }, //提示
    options: {
      type: Array,
      default: () => []
    }, //选项
    optionsItem: {
      type: Object,
      default() {
        return {
          key: 'value',
          label: 'label',
          value: 'value'
        }
      }
    }, //绑定带每一项要取的字段
    value: {
      type: [String, Number],
      default: ''
    }, //传进来绑定的值
    multiple: {
      type: Boolean,
      default: false
    }, //是否多选
    disabled: {
      type: Boolean,
      default: false
    }, //是否禁用
    valueKey: {
      type: String,
      default: '' //作为 value 唯一标识的键名，绑定值为对象类型时必填
    },
    size: {
      type: String,
      default: '' //输入框尺寸
    },
    clearable: {
      type: Boolean,
      default: false
    }, //是否可以清空选项
    collapseTags: {
      type: Boolean,
      default: false
    }, //多选时是否将选中值按文字的形式展示
    multipleLimit: {
      type: Number,
      default: 0
    }, //多选时用户最多可以选择的项目数，为 0 则不限制
    name: {
      type: String,
      default: ''
    }, //select input 的 name 属性
    autocomplete: {
      type: String,
      default: 'off'
    }, //select input 的 autocomplete 属性
    filterable: {
      type: Boolean,
      default: false //是否可搜索
    },
    remote: {
      type: Boolean,
      default: false //是否为远程搜索
    },
    reserveKeyword: {
      type: Boolean,
      default: false //多选且可搜索时，是否在选中一个选项后保留当前的搜索关键词
    },
    remoteMethod: {
      type: Function //远程搜索方法
    }
  },
  watch: {
    value: {
      handler(newVal) {
        this.bindValue = newVal
      },
      deep: true,
      immediate: true //深度监听且改变赋值
    }
  },
  data() {
    return {
      domID: `domID${Math.floor(Math.random() * 100000000 + 1)}`, //随机生成一个唯一ID
      bindValue: '' //绑定的值
    }
  },
  methods: {
    clear() {
      document.getElementById(this.domID).value = ''
      this.$emit('clear')
    },
    focus(event) {
      this.$emit('focus', event)
    },
    // 选项展开关闭回掉
    visibleChange(event) {
      if (this.isCopy && event) {
        // 如果展开
        let label = ''
        for (let i = 0; i < this.options.length; i++) {
          const valueField = this.optionsItem.value
          const labelField = this.optionsItem.label
          if (this.bindValue === this.options[i][valueField]) {
            label = this.options[i][labelField]
          }
        }
        setTimeout(() => {
          document.getElementById(this.domID).value = label || '' //通过ID原生绑定
        }, 200)
      }
    },
    change(...value) {
      // 更新数据
      this.$emit('update:value', this.bindValue)
      this.$emit('change', value)
    }
  }
}
</script>
