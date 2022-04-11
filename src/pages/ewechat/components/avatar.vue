<template>
  <div class="avatar">
    <div class="upload" @click="chooseImg" :style="{ width: width + 'px', height: height + 'px', lineHeight: height + 'px' }">
      <input type="file" ref="ipt" multiple accept="image/*" @change="change" />
      <i class="km-icon-plus"></i>
    </div>

    <div class="img-wrapper" v-if="value">
      <img :src="value" alt class="img" />
      <div class="img-bg">
        <i class="km-icon-delete" @click="delFile"></i>
      </div>
    </div>
  </div>
</template>

<script>
import { uploadPic } from '@/api/ewechat'
export default {
  props: {
    max: {
      type: Number || String
    },
    width: {
      default: 148,
      type: Number
    },
    height: {
      default: 148,
      type: Number
    },
    value: {
      type: [File, String],
      default: ''
    }
  },
  methods: {
    async change(e) {
      let files = e.target.files
      if (files.length === 1) {
        let file = files[0]
        let formdata = new FormData()
        formdata.append('file', file)
        let res = await uploadPic(formdata)
        this.$emit('input', res.server + res.path)
      }
    },
    chooseImg() {
      this.$refs.ipt.click()
    },
    getObjectURL(file) {
      let url = null
      if (window.createObjectURL !== undefined) {
        url = window.createObjectURL(file)
      } else if (window.URL !== undefined) {
        // mozilla(firefox)
        url = window.URL.createObjectURL(file)
      } else if (window.webkitURL !== undefined) {
        // webkit or chrome
        url = window.webkitURL.createObjectURL(file)
      }

      return url
    },
    delFile() {
      this.$emit('input', '')
    }
  }
}
</script>

<style scoped>
.upload {
  background-color: #fbfdff;
  border: 1px dashed #c0ccda;
  border-radius: 6px;
  box-sizing: border-box;
  cursor: pointer;
  vertical-align: top;
  display: inline-block;
  text-align: center;
  outline: none;
}

i {
  font-size: 28px;
  color: #8c939d;
}

.km-icon-delete {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  cursor: pointer;
}

input[type='file'] {
  display: none !important;
}

.avatar {
  position: relative;
}
.img-wrapper {
  border-radius: 6px;
  width: 148px;
  height: 148px;
  cursor: pointer;
  outline: none;
  position: absolute;
  top: 0;
  left: 0;
}

img {
  width: 100%;
  height: 100%;
  border-radius: 6px;
}

.img-bg {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  cursor: default;
  text-align: center;
  color: #fff;
  opacity: 0;
  font-size: 20px;
  background-color: rgba(0, 0, 0, 0.5);
  transition: opacity 0.3s;
}

.img-wrapper:hover .img-bg {
  opacity: 1;
}
</style>
