<template>
  <div class="form custom-form">
    <el-form ref="form" :model="form" :rules="rules" :label-width="labelWidth" :label-position="labelPosition" size="small" @validate="onValidate">
      <el-row :gutter="gutter" style="margin-left: 0; margin-right: 0;">
        <el-col v-for="(item, index) in rawForm" :key="index" :span="item.col || 24" style="padding-left: 0; padding-right: 0;">
          <el-form-item v-if="!item.hide" :prop="item.prop" :class="{ 'is-text': item.type === 'text' }">
            <!-- 自定义label start-->
            <template v-slot:label>
              <slot :name="'label-' + item.prop" v-if="!isInPage || item.label">{{ item.label + ':' }}</slot>
              <render-slot :ctx="page" :name="'label-' + item.prop" slot-type="form" :form="form" v-else></render-slot>
            </template>
            <!-- 自定义label end -->

            <!-- select 选择框start -->
            <el-select
              v-if="item.type === 'select'"
              :ref="item.prop"
              v-model="form[item.prop]"
              :placeholder="(item.attrs && item.attrs.placeholder) || '请选择' + item.label"
              v-bind="item.attrs || {}"
              v-on="listeners[item.prop] || {}"
            >
              <el-option v-for="(option, i) in item.options || []" :key="i" :label="option.label" :value="option.value" />
            </el-select>
            <!-- select 选择框end -->

            <!-- 普通文本start -->
            <span v-else-if="item.type === 'text'">{{ form[item.prop] }}</span>
            <!-- 普通文本end -->

            <!-- switch start -->
            <el-switch
              v-else-if="item.type === 'switch'"
              :ref="item.prop"
              v-model="form[item.prop]"
              v-bind="item.attrs || {}"
              :active-value="item.active === undefined ? 1 : 0"
              :inactive-value="item.inactive === undefined ? 0 : 1"
              v-on="listeners[item.prop] || {}"
            />
            <!-- switch end -->

            <!-- slot start -->
            <template v-else-if="item.type === 'slot'">
              <slot :name="item.prop" v-bind="form" v-if="!isInPage"></slot>
              <render-slot :ctx="page" :name="item.prop" slot-type="form" :form="form" v-if="isInPage"></render-slot>
            </template>

            <!-- slot end -->

            <!-- 单选框组 start -->
            <el-radio-group v-else-if="item.type === 'radio'" :ref="item.prop" v-model="form[item.prop]" v-bind="item.attrs || {}" v-on="listeners[item.prop] || {}">
              <el-radio v-for="(r, i) in item.options" :key="i" :label="r.value">{{ r.label }}</el-radio>
            </el-radio-group>
            <!-- 单选框组 end -->

            <!-- 时间选择器 start -->
            <el-time-picker
              v-else-if="item.type === 'time'"
              :ref="item.prop"
              v-model="form[item.prop]"
              :placeholder="(item.attrs && item.attrs.placeholder) || '请选择' + item.label"
              v-bind="item.attrs || {}"
              v-on="listeners[item.prop] || {}"
            />
            <!-- 时间选择器 end -->

            <!-- 日期选择器 start -->
            <el-date-picker
              v-else-if="item.type === 'date'"
              :ref="item.prop"
              v-model="form[item.prop]"
              :placeholder="(item.attrs && item.attrs.placeholder) || '请选择' + item.label"
              type="date"
              v-bind="item.attrs || {}"
              value-format="yyyy-MM-dd"
              v-on="$listeners[item.prop] || {}"
            />
            <!-- 日期选择器 en -->

            <!-- 日期时间选择器 start -->
            <el-date-picker
              v-else-if="item.type === 'datetime'"
              :ref="item.prop"
              v-model="form[item.prop]"
              :placeholder="(item.attrs && item.attrs.placeholder) || '请选择' + item.label"
              type="datetime"
              v-bind="item.attrs || {}"
              v-on="listeners[item.prop] || {}"
            />
            <!-- 日期时间选择器 end -->

            <!-- 日期时间范围选择器 start -->
            <el-date-picker
              v-else-if="item.type === 'daterange'"
              :ref="item.prop"
              v-model="form[item.prop]"
              type="daterange"
              v-bind="item.attrs || {}"
              v-on="listeners[item.prop] || {}"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
            <!-- 日期时间范围选择器 end -->

            <!-- 头像上传 start -->
            <avatar v-else-if="item.type === 'avatar'" :ref="item.prop" v-model="form[item.prop]" v-bind="item.attrs || {}" v-on="listeners[item.prop] || {}" />
            <!-- 头像上传 end -->

            <!-- 数字输入框 start -->
            <div class="el-input-number-wrapper" v-else-if="item.type === 'number'">
              <label v-if="item.prepend" style="padding-right: 12px;">{{ item.prepend }}</label>
              <el-input-number :controls="false" :ref="item.prop" v-model="form[item.prop]" v-bind="item.attrs || {}" v-on="listeners[item.prop] || {}"> </el-input-number>
              <label v-if="item.append" style="padding-left: 12px;">{{ item.append }}</label>
            </div>
            <!-- 数字输入框 end -->

            <!-- input 输入框 -->
            <el-input
              v-else
              clearable
              :ref="item.prop"
              :value="form[item.prop]"
              v-bind="item.attrs || {}"
              :placeholder="(item.attrs && item.attrs.placeholder) || '请输入' + item.label"
              :type="(item.type !== 'input' && item.type) || 'text'"
              :row="item.type === 'textarea' ? item.row : ''"
              :maxlength="item.maxlength > 0 ? item.maxlength : '-1'"
              @input="onInput($event, item)"
              v-on="listeners[item.prop] || {}"
            >
              <template slot="append" v-if="item.append">{{ item.append }}</template>
              <template slot="prepend" v-if="item.prepend">{{ item.prepend }}</template>
            </el-input>
            <!-- input 输入框 -->
          </el-form-item>
        </el-col>
        <slot name="buttons"></slot>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import renderSlot from './render-slot.vue'
import avatar from './avatar.vue'
export default {
  components: {
    avatar,
    renderSlot
  },
  props: {
    isInPage: {
      type: Boolean,
      default: false
    },
    rawForm: {
      type: Array,
      default: () => [
        {
          label: '活动名称',
          prop: 'name',
          type: 'input',
          rules: [{ required: true, trigger: ['change', 'blur'], message: '请选择活动区域' }]
        },
        {
          label: '活动区域',
          prop: 'region',
          type: 'select',
          options: [
            { label: '上海', value: 'shanghang' },
            { label: '北京', value: 'beijing' }
          ],
          rules: [{ required: true, trigger: ['change', 'blur'], message: '请选择活动区域' }]
        }
      ]
    },
    labelWidth: {
      type: String,
      default: '100px'
    },
    labelPosition: {
      type: String,
      default: 'top'
    },
    gutter: {
      type: Number,
      default: 50
    }
  },
  inject: {
    page: {
      default: {}
    }
  },
  data() {
    return {
      form: {},
      listeners: {},
      dataStatus: 0, // 0 空状态 1 原始数据 2 数据有修改
      canFocusError: false
    }
  },
  computed: {
    rules() {
      const res = {}
      this.rawForm.forEach(item => {
        Array.isArray(item.rules) &&
          item.rules.forEach(rule => {
            if (!rule.message && typeof rule.validator !== 'function' && item.label) {
              rule.message = (item.type === 'input' ? '请输入' : '请选择') + item.label
            }
          })
        res[item.prop] = item.rules
      })
      return res
    }
  },
  watch: {
    form: {
      handler() {
        if (this.dataStatus === 0) {
          this.dataStatus = 1
        } else if (this.dataStatus === 1) {
          this.dataStatus = 2
        }
      },
      deep: true
    }
  },
  created() {
    this.rawForm.forEach(item => {
      this.$set(this.form, item.prop, item.default || '')
    })
    this.distributeListeners()
  },
  mounted() {
    this.setfocus()
  },
  methods: {
    /**
     * 分发$listeners
     * this.$listeners 获得form的事件, 根据form事件名称分发给每个控件
     * 例如: @change_username: 这样就监听了prop===username 的控件的change事件
     */
    distributeListeners() {
      for (const key in this.$listeners || {}) {
        const childEvents = key.split('_')
        if (childEvents.length >= 2) {
          const listenerFn = this.$listeners[key]
          const eventName = key.split('_')[0]
          const eventProp = key.split('_')[1]
          if (!this.listeners[eventProp]) {
            this.listeners[eventProp] = {}
          }
          this.listeners[eventProp][eventName] = listenerFn
        }
      }
    },
    /**
     * 监听输入框输入事件, 限制只能输入数字
     */
    onInput(value, rawData) {
      const prop = rawData.prop
      if (rawData.filterLetter) {
        this.form[prop] = value.replace(/[^\d]/g, '') || ''
      } else {
        this.form[prop] = value
      }
      this.$emit('input', value)
    },
    /**
     *  检验表单数据
     */
    valid() {
      this.canFocusError = true
      return new Promise((resolve, reject) => {
        this.$refs.form
          .validate()
          .then(valid => {
            if (valid) {
              resolve({ ...this.form })
            }
          })
          .catch(e => {
            reject(e)
          })
      })
    },
    /**
     *  监听validate方法, 当报错的时候, 自动focus报错的第一项
     */
    onValidate(prop, isValid) {
      if (!isValid && this.canFocusError) {
        this.canFocusError = false
        const target = this.$refs[prop] ? this.$refs[prop][0] : {}
        if (typeof target.focus === 'function') {
          target.focus()
        }
      }
    },
    /**
     * auto foucus, 如果有设置defaultfoucs, 则foucs到这一项,
     * 如果没有, 则focus到符合条件的第一项
     */
    setfocus() {
      let formItemRef = null
      let autoFocusRef = null
      for (let i = 0; i < this.rawForm.length; i++) {
        const data = this.rawForm[i]
        formItemRef = this.$refs[data.prop] ? this.$refs[data.prop][0] : {}
        if (data.defaultfoucs) {
          typeof formItemRef.focus === 'function' && formItemRef.focus()
          break
        } else {
          if (!formItemRef.disabled && !formItemRef.readonly && typeof formItemRef.focus === 'function' && !autoFocusRef) {
            autoFocusRef = formItemRef
          }
        }
      }
      autoFocusRef.focus()
    },
    /**
     * reset 表单数据
     */
    reset() {
      this.$refs.form.resetFields()
    },
    /**
     *  填充表达数据
     */
    setData(data) {
      this.dataStatus = 0
      for (const key in this.form) {
        const isUnf = data[key] === undefined
        if (!isUnf) {
          this.form[key] = data[key]
        }
      }
    },
    /**
     * 修改原始数据某一项
     * @params prop : 原始数据的prop
     * @params key : 原始数据的某个key
     * @params value : 更改后的值
     */
    setRawData(prop, key, value) {
      this.rawForm.forEach(item => {
        const p = item.prop
        if (p === prop) {
          item[key] = value
        }
      })
    },
    /**
     * 修改attrs某一项
     * @params prop : 原始数据的prop
     * @params key : attrs的某个key
     * @params value : 更改后的值
     */
    setAttrsData(prop, key, value) {
      this.rawForm.forEach(item => {
        const p = item.prop
        if (p === prop) {
          if (!item.attrs) return
          item.attrs[key] = value
        }
      })
    },
    /**
     * 关闭form组件前, form data 有改动需要提示弹窗(可在页面组件中的beforeRouteLeave调用)
     */
    async beforeCloseCheck() {
      let canClose = true
      if (this.dataStatus === 2) {
        const confirm = await this.$confirm('数据未保存，确定要关闭窗口？')
        if (confirm) {
          canClose = true
        } else {
          canClose = false
        }
      } else {
        canClose = true
      }
      return canClose
    }
  }
}
</script>

<style lang="scss" scoped>
.form {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>

<style lang="scss">
.custom-form {
  .el-input,
  .el-date-editor--daterange {
    width: 100% !important;
  }
  .el-select {
    width: 100%;

    .el-input {
      width: 100%;
    }
  }

  .el-select-dropdown {
    min-width: 240px;
  }

  .el-form-item--small {
    height: auto;
  }

  .el-input-number,
  .el-input-number--samll {
    width: auto;
  }
}
</style>
<style lang="scss">
.is-text {
  margin-bottom: 0 !important;
}
</style>
