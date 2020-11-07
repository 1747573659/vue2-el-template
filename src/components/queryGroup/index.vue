
<template>
  <div class="query-group-container">
    <slot name="header"></slot>

    <el-form :inline="true" :model="queryParams" ref="queryForm" size="small" label-width="100px" :class="className">
       <el-row>
          <el-col :span="24">
      <slot name="formheader"></slot>
      <template v-for="(item, index) in queryFormList">
        <el-form-item class="xdd_item_form"  :style="{ width:item.width }" :key="index" v-if="item.type === 'input'" :label="item.label" :label-width="item.labelWidth">
          <el-input  clearable   v-model="item.value" :placeholder="item.placeholder || ''"></el-input>
        </el-form-item>

        <el-form-item
          class="xdd_item_form"
          :style="{ width:item.width }"
          :key="index"
          v-else-if="item.type === 'select'"
          :label="item.label"
          :label-width="item.labelWidth"
        >
          <el-select
            :clearable="item.clearable"
            :filterable="item.filterable"
            v-model="item.value"
            :placeholder="item.placeholder || ''"
          >
            <el-option
              v-for="(option, i) in item.options"
              :key="i"
              :label="option.label"
              :value="option.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          class="xdd_item_form"
          :style="{ width:item.width }"
          :key="index"
          v-else-if="item.type === 'date' || item.type === 'daterange'"
          :label="item.label"
          :label-width="item.labelWidth"
        >
          <el-date-picker
            :type="item.type"
            :value-format='daterangeValueFormat'
            range-separator="至"
            placeholder="选择日期"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerBeginDateBefore"
            @change="daterangeChange"
            v-model="item.value"
            :default-time="['00:00:00', '23:59:59']"
          ></el-date-picker>
        </el-form-item>
      </template>
      <el-button size="small" class="xdd_small-btn" @click="search" type="primary">查询</el-button>
      <slot name="formfoot"></slot>
      
      </el-col>
      </el-row>
    </el-form>
    <slot name="foot"></slot>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  props: {
    queryParams: {
      type: Object,
      default: () => {}
    },
    queryFormList: {
      type: Array,
      default: () => []
    },
    timeinterval:{
      type: Number,
      default: 0
    },
    // 可在下方css里随意加类名自定义样式，使用时传入名字即可
    className: {
      type: String,
      default: ''
    },
    daterangeValueFormat: {
      type: String,
      default: 'yyyy-MM-dd'
    }
  },
  data () {
    let maxTime = ''
    let minTime = ''
    let _this=this
    return {
      resetData: '',
      pickerBeginDateBefore: {
        onPick: ({ maxDate, minDate }) => {
          if (minDate) {
            const day31 = _this.timeinterval*31 * 24 * 3600 * 1000
            maxTime = minDate.getTime() + day31
            minTime = minDate.getTime() - day31
          }
        },
        disabledDate (time) {
          
          if(_this.timeinterval){
            if (maxTime) {
              return (
                time.getTime() >
                  moment()
                    .endOf('day')
                    .valueOf() ||
                time.getTime() > maxTime ||
                time.getTime() < minTime
              )
            }
            return (
              time.getTime() >
              moment()
                .endOf('day')
                .valueOf()
            )
          }else{
              let date = new Date()
            return time.getTime() > new Date(
              date.getFullYear(),
              date.getMonth(),
              date.getDate(),
              23,
              59,
              59
            ).getTime()
          }
          
        }
      }
    }
  },
  mounted () {
    this.resetData = this.queryParams
  },

  methods: {
    search (val) {
      this.$emit('search', this.queryParams)
    },
    // 日期区间选择callback
    daterangeChange (val) {
      this.$emit('daterangeChange', val)
    },
    // 重置搜索表单
    resetForm (formName) {
      this.$refs[formName].resetFields()
      this.$emit('resetForm', this.resetData)
    }
  }
}
</script>

<style scoped lang="scss">
.query-group-container {
     
  .xdd_small-btn{

  }
  overflow: hidden;
  .all-fr {
    float: left;
  }

  .btn-fr {
    .el-button {
      float: right;
    }
  }
  /deep/.xdd_item_form{
    display: inline-flex;
    .el-form-item__content{
      flex:1
    }
    .el-date-editor {
      flex:1
    }
    .el-date-editor {
      flex:1
    }
  }
}
</style>
