<template>
  <transition-group
    tag="ul"
    :class="[
      'el-upload-list',
      'el-upload-list--' + listType,
      { 'is-disabled': disabled }
    ]"
    name="el-list"
  >
    <li
      v-for="file in files"
      :class="['el-upload-list__item', 'is-' + file.status, focusing ? 'focusing' : '']"
      :key="file.uid"
      tabindex="0"
      @keydown.delete="!disabled && $emit('remove', file)"
      @focus="focusing = true"
      @blur="focusing = false"
      @click="focusing = false"
    >
      <slot :file="file">
        <template v-if="getFiletype(file.type)===2">
          <img
              class="el-upload-list__item-thumbnail"
              v-if="file.status !== 'uploading' && ['picture-card', 'picture'].indexOf(listType) > -1"
              :src="file.url" alt=""
            >
        </template>
        <template v-else-if="getFiletype(file.type)===1">
            <div class="el-upload-list__item-thumbnail bk_img">
              <img src="./imgs/vedio.png" class="el-icon-video-play">
            </div>
        </template>
         <template v-else>
            <div class="el-upload-list__item-thumbnail bk_img">
              <img src="./imgs/text.png" class="el-icon-video-play">
            </div>
        </template>
        
        <a class="el-upload-list__item-name" @click="handleClick(file)">
          <i class="el-icon-document"></i>{{file.name}}
        </a>
        <label class="el-upload-list__item-status-label">
          <i :class="{
            'el-icon-upload-success': true,
            'el-icon-circle-check': listType === 'text',
            'el-icon-check': ['picture-card', 'picture'].indexOf(listType) > -1
          }"></i>
        </label>
        <i class="el-icon-close" v-if="!disabled" @click="$emit('remove', file)"></i>
        <i class="el-icon-close-tip" v-if="!disabled">{{ t('el.upload.deleteTip') }}</i> <!--因为close按钮只在li:focus的时候 display, li blur后就不存在了，所以键盘导航时永远无法 focus到 close按钮上-->
        <el-progress
          v-if="file.status === 'uploading'"
          :type="listType === 'picture-card' ? 'circle' : 'line'"
          :stroke-width="listType === 'picture-card' ? 6 : 2"
          :percentage="parsePercentage(file.percentage)">
        </el-progress>
        <span class="el-upload-list__item-actions" v-if="listType === 'picture-card'">
          <span
            class="el-upload-list__item-preview"
            v-if="handlePreview && listType === 'picture-card'"
            @click="handlePreview(file)"
          >
            <i class="el-icon-zoom-in"></i>
          </span>
          <span
            v-if="!disabled"
            class="el-upload-list__item-delete"
            @click="$emit('remove', file)"
          >
            <i class="el-icon-delete"></i>
          </span>
        </span>
      </slot>
    </li>
  </transition-group>
</template>
<script>
  import Locale from 'element-ui/src/mixins/locale';
  import ElProgress from 'element-ui/packages/progress';

  export default {

    name: 'ElUploadList',

    mixins: [Locale],

    data() {
      return {
        focusing: false
      };
    },
    components: { ElProgress },

    props: {
      files: {
        type: Array,
        default() {
          return [];
        }
      },
      disabled: {
        type: Boolean,
        default: false
      },
      handlePreview: Function,
      listType: String
    },
    filters:{
      
    },
    methods: {
      getFiletype: function (value) {
        let flag=3
        if(/^video\/.+$/.test(value)){
          flag=1
        }else if(/^image\/.+$/.test(value)){
          flag=2
        }else{
          flag=3
        }
        return flag
      },
      parsePercentage(val) {
        return parseInt(val, 10);
      },
      handleClick(file) {
        this.handlePreview && this.handlePreview(file);
      }
    }
  };
</script>
<style scoped>
  .bk_img{
    display: none;
  }
  .el-upload-list__item.is-success .bk_img{
    display: block;
    background: #f7f9fc;
  }
  .el-upload-list__item.is-success .bk_img img{
    margin-top: 42%;
  }
  .el-upload-list__item.is-success{
    text-align: center;
    line-height: 148px;
  }
</style>
