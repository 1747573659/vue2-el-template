<template>
  <div>
    <el-upload class="avatar-uploader" :action="uploadUrl" :headers="{ token: token }" :accept="accept" :show-file-list="false" :on-error="uploadErrer" :on-success="uploadSuccess" :before-upload="beforeUpload">
      <div v-if="imageUrl" class="avatar-img-content">
        <i v-if="showIconClose" class="avatar-icon-close el-icon-error" @click.stop="handleRemove"></i>
        <img :src="fileServer + imageUrl" class="avatar" />
      </div>
      <span v-else class="avatar-uploader-icon-block">
        <i class="el-icon-plus avatar-uploader-icon"></i>
        <span class="avatar-uploader-text">上传照片</span>
      </span>
    </el-upload>
    <slot name="footer">
      <span class="avatar__msg">{{desc}}</span>
    </slot>
  </div>
</template>

<script>
import { getLocal } from '@/utils/storage'

export default {
  name: 'PicUpload',
  props: {
    desc:{
      type:String,
      default:''
    },// 描述
    showIconClose: {
      type: Boolean,
      default: false,
    }, // 删除按钮
    uploadUrl: {
      require: true,
      type: String,
      default: '',
    }, // 上传接口
    accept: {
      type: String,
      default: 'image/gif,image/jpeg,image/jpg,image/png',
    }, // 图片类型
    size:{
       type: Number,
       default:10240
    }, // 大小 1km  b为基础
    imageUrl: {
      require: true,
      type: String,
      default: '',
    }, // 图片链接
    fileServer: {
      require: true,
      type: String,
      default: '',
    }, // 服务地址
  },
  data() {
    return {
      token: getLocal('token'),
    }
  },
  methods: {
    handleRemove() {
      this.$emit('on-remove')
    },
    uploadErrer(err) {
      this.$message.error('上传失败')
    },
    uploadSuccess(res, file) {
      this.$emit('on-success', res)
    },
    beforeUpload(file) {
      const imgTypes = this.accept.split(',')
      const isJPG = imgTypes.includes(file.type)
      const isLt2M = file.size / 1024 < this.size
      if (!isJPG) {
        return this.$message.error(`上传图片只能是 ${this.accept} 格式!`)
      }
      if (!isLt2M) {
        return this.$message.error(`上传图片大小不能超过 ${this.size}kB!`)
      }
      return isLt2M && isJPG
    },
  },
}
</script>

<style lang="scss" scoped>
.avatar-uploader {
  height: 82px;
}
.avatar-uploader /deep/ .el-upload {
  position: relative;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  height: 100%;
  cursor: pointer;

  .avatar-img-content {
    display: inline-block;
    position: relative;
  }

  .avatar-icon-close {
    display: none;
    position: absolute;
    top: -8px;
    right: -8px;
    z-index: 1;
    font-size: 16px;
  }

  &:hover {
    .avatar-icon-close {
      display: block;
      color: #f23c3c;
    }
  }
}
.avatar-uploader /deep/ .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon-block {
  display: inline-block;
  width: 80px;
  height: 80px;
  background-color: #f7f8fa;
}
.avatar-uploader-icon {
  margin-top: 15px;
  font-size: 18px;
  color: #8c939d;
}
.avatar {
  width: 80px;
  height: 80px;
  display: block;
}
.avatar__msg {
  font-size: 14px;
  color: #cad1e0;
}
.avatar-uploader-text {
  display: block;
  font-size: 14px;
  line-height: 1;
  color: #8f9bb3;
}
</style>
