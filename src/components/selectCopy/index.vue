<template>
  <!-- 功能:单选且筛选时候具有可以复制label值的功能 -->
  <!-- 陈南方 2020-12-01   :value.sync='绑定的值，其他相同' -->
  <el-select
    @change="change"
    @visible-change="visibleChange"
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
  >
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    >
    </el-option>
  </el-select>
</template>
<script>
export default {
  props: {
    placeholder: {
      type: String,
      default: "",
    }, //提示
    options: {
      type: Array,
      default: () => [],
    }, //选项
    value: {
      type: String || Number,
      default: "",
    }, //传进来绑定的值
    multiple: {
      type: Boolean,
      default: false,
    }, //是否多选
    disabled: {
      type: Boolean,
      default: false,
    }, //是否禁用
    valueKey: {
      type: String,
      default: "", //作为 value 唯一标识的键名，绑定值为对象类型时必填
    },
    size: {
      type: String,
      default: "", //输入框尺寸
    },
    clearable: {
      type: Boolean,
      default: false,
    }, //是否可以清空选项
    collapseTags: {
      type: Boolean,
      default: false,
    }, //多选时是否将选中值按文字的形式展示
    multipleLimit: {
      type: Number,
      default: 0,
    }, //多选时用户最多可以选择的项目数，为 0 则不限制
    name: {
      type: String,
      default: "",
    }, //select input 的 name 属性
    autocomplete: {
      type: String,
      default: "off",
    }, //select input 的 autocomplete 属性
    filterable: {
      type: Boolean,
      default: false, //是否可搜索
    },
  },
  watch: {
    value: {
      handler(newVal) {
        this.bindValue = newVal;
      },
      deep: true,
      immediate: true, //深度监听且改变赋值
    },
  },
  data() {
    return {
      domID: `dom${Math.floor(Math.random() * 100000000 + 1)}`, //随机生成一个唯一ID
      bindValue: "", //绑定的值
    };
  },
  methods: {
    // 选项展开关闭回掉
    visibleChange(event) {
      if (event && this.bindValue) {
        // 如果展开且有值
        let label = "";
        for (let i = 0; i < this.options.length; i++) {
          if (this.bindValue == this.options[i].value) {
            label = this.options[i].label;
          }
        }
        setTimeout(() => {
          document.getElementById(this.domID).value = label || ""; //通过ID原生绑定
        }, 200);
      }
    },
    change() {
      // 更新数据
      this.$emit("update:value", this.bindValue);
    },
  },
};
</script>