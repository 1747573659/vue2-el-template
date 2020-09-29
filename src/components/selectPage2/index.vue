<template>
  <div>
    <el-select
      class="select-page"
      v-model="selValue"
      v-loadmore="remoteMethod"
      filterable
      :disabled="disabled"
      clearable
      :multiple="isMultiple"
      :collapse-tags="true"
      remote
      clear
      :multiple-limit="1"
      no-data-text="暂无匹配数据"
      no-match-text="暂无匹配数据"
      :reserve-keyword="false"
      :placeholder="placeText"
      :remote-method="remoteMethod"
      >
      <el-option
        v-for="item in options"
        :key="item[id]"
        :label="item[name]"
        :value="item[id]">
      </el-option>
      <div class="loading-page">{{isMaxPage ? '已全部加载完毕' : '正在加载下一页'}}</div>
    </el-select>
  </div>
</template>

<script>

export default {
  data() {
    return {
      isMaxPage:false,
      options:[],
      page:1,
      placeText:"",
      disabled:false
    }
  },
  props:{
    placeholder: {
      type: String,
      default: ''
    },
    bvalue:{
      type: [String ,Array,Number],
      default: ''
    },
    isMultiple:{
      type: Boolean,
      default: false
    },
    id:{
      type: String,
      default: 'id'
    },
    name:{
      type: String,
      default: 'label'
    },
    searchName:{
      type: String,
      default: ''
    },
    parame:{
      type:Object,
      default:null
    },
    request: {
      type: Function,
      default: null
    },
  },
  computed: {
    selValue:{
      get () {
        return this.bvalue
      },
      set (val) {
        this.$emit('update:bvalue', val)
      }
    }
  },
  directives: {
    loadmore: {
      // 指令的定义
      bind: function (el, binding) {
        // 获取km-ui定义好的scroll盒子
        const SELECTWRAP_DOM = el.querySelector('.el-select-dropdown .el-select-dropdown__wrap')
        SELECTWRAP_DOM.addEventListener('scroll', function () {
          const CONDITION = this.scrollHeight - this.scrollTop <= this.clientHeight
          if (CONDITION) {
            binding.value()
          }
        })
      }
    }
  },
  watch: {
    "parame":function(val, oldVal){
      if(val){
        Object.keys(val).forEach((value,index)=>{
          if(val[value] && val[value]!==oldVal[value]){
            this.selValue=""
            this.isInit=true
            this.options=[]
            this.page=1
            this.isMaxPage=false
            this.remoteMethod()
          }
        })
      }
    }
  },
  mounted() {
      this.isInit=false
      if(!this.isMultiple) this.remoteMethod()
  },
  methods: {
    remoteMethod(query){
      let data={}
      if(query!==undefined){
        this.options=[]
        this.page=1
        this.isMaxPage=false
        data = {
          page:this.page,
          rows: 10,
          [this.searchName]:query
        }
        this.isInit=false
      }else{
        data = {
          page:this.page,
          rows: 10,
        }
      }
      this.request(Object.assign(data,this.parame)).then((res)=>{
        if(!res.results) this.isMaxPage=true
        if(res.results && res.results.length<10) this.isMaxPage=true
        if(this.isInit && !res.results){
          this.placeText="暂无匹配数据"
          this.disabled=true
        }else{
          this.placeText=this.placeholder
          this.disabled=false
        }
        this.page++
        if(query!==undefined){
          this.options=res.results || []
        }else{
          this.options=(this.options).concat(res.results || [])
        }
      }).finally(()=>{
        
      })
    }
  },
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