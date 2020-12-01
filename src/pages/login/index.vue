<template>
  <section class="p-login">
    <div class="p-login_picture"></div>
    <div class="p-login_con">
      <header>
        <img
          src="../../assets/images/menu/logo.png"
          class="p-login_logo"
          alt="logo"
        />
      </header>
      <section>
        <div class="p-login_form">
          <header class="p-loginForm_head">欢迎登录渠道管理系统</header>
          <el-form
            :model="loginForm"
            :rules="loginRules"
            ref="ruleForm"
            class="p-loginForm_con"
            @submit.native.prevent
          >
            <el-form-item prop="userName">
              <label class="e-form_label">账号</label>
              <el-input
                clearable
                v-model.trim="loginForm.userName"
                @keyup.enter.native="handleLogin"
                placeholder="请输入用户名"
              ></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <label class="e-form_label">密码</label>
              <el-input
                clearable
                type="password"
                v-model.trim="loginForm.password"
                @keyup.enter.native="handleLogin"
                placeholder="请输入密码"
              ></el-input>
            </el-form-item>
          </el-form>
          <el-button
            type="primary"
            :loading="isLoading"
            @click.native="handleSubmitCode"
            class="e-form_btn"
            >登录</el-button
          >
          <div class="p-login_regist">
            登录即代表你同意
            <a
              href="http://ceshi-file-oss.oss-cn-hangzhou.aliyuncs.com/legalNotices/privacyPolicy.html"
              target="_blank"
              >《用户使用协议》</a
            >
          </div>
        </div>
      </section>
      <footer class="p-login_record">
        <p>Copyright © 1999-2020 粤ICP备10037982号</p>
        <p>深圳市科脉技术股份有限公司 版权所有</p>
      </footer>
    </div>
    <section class="login_nocolor">
      <el-dialog
        :visible.sync="loginVisible"
        width="318px"
        :close-on-click-modal="false"
      >
        <slide-login
          v-if="loginVisible"
          :loading="loading"
          :text="text"
          :title="title"
          :status.sync="status"
          :slide-block-img-bg="slideBlockImgBg"
          :slide-block-img="slideBlockImg"
          :slideH="170"
          :offsetY="offsetY"
          @close="close"
          @getMouseUpData="mouseUp"
          @refresh="refresh"
        >
        </slide-login>
      </el-dialog>
    </section>
  </section>
</template>

<script>
import { checkSliderImg, initImg } from "@/api/login";
import slideLogin from "./components/slide-login";

export default {
  components: { slideLogin },
  data() {
    var userNamePass = (rule, value, callback) => {
      if (/^1[3456789]\d{9}$/.test(value)) {
        callback();
      } else {
        callback("请输入账号");
      }
    };
    return {
      isLoading: false,
      loginVisible: false,
      loading: false,
      text: "拖动滑块完成校验",
      title: "请完成安全校验",
      slideBlockImgBg: "",
      slideBlockImg: "",
      offsetX: 0,
      offsetY: 0,
      status: "pendding",
      key: "",
      loginForm: {
        userName: "",
        password: "",
        codeKey: "",
      },
      loginRules: {
        userName: [
          { required: true, trigger: "blur", validator: userNamePass },
          { required: true, trigger: "change", message: "请输入账号" },
        ],
        password: [
          { required: true, trigger: "change", message: "请输入密码" },
        ],
      },
      redirect: "",
      query: "",
    };
  },
  mounted() {
    this.initImg();
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
        this.query = route.query && route.query.query;
      },
      immediate: true,
    },
  },
  methods: {
    initImg: async function () {
      try {
        this.loading = true;
        const res = await initImg();
        // 请求接口获取图片和图片对应的位置
        this.slideBlockImgBg = res.sourceImage;
        this.slideBlockImg = res.newImage;
        this.offsetY = res.y;
        this.key = res.sliderToken;
      } catch (err) {
      } finally {
        this.loading = false;
      }
    },
    // 刷新图片验证
    refresh() {
      this.initImg();
    },
    // 关闭图片验证
    close() {
      this.loginVisible = false;
    },
    // 验证
    mouseUp: async function (imgX) {
      try {
        const data = {
          x: imgX,
          y: this.offsetY,
          token: this.key,
        };
        const res = await checkSliderImg(data);
        this.status = "success";
        setTimeout(() => {
          this.loginVisible = false;
          this.handleLogin();
        }, 500);
      } catch (error) {
        this.status = "fail";
        // this.initImg()
      }
    },
    handleSubmitCode() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          this.loginVisible = true;
        }
      });
    },
    handleLogin() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          this.isLoading = true;
          this.$store
            .dispatch("login", this.loginForm)
            .then(() => {
              const routes = this.$store.getters.routes;
              const utilRoutePoint = () =>
                this.$router.push({
                  path: JSON.stringify(routes).includes("home")
                    ? "/"
                    : routes[0].redirect,
                });
              // 重定向存在时，跳转重定向路径，不存在时，判断是否包含home,包含跳转home，不包含跳转routes首个路由，由于系统基础路由默认包含home，故此判断暂时多余
              if (this.redirect) {
                const rotationData = this.redirect.split("/");
                rotationData.shift();
                if (
                  rotationData.every((item) =>
                    JSON.stringify(routes).includes(item)
                  )
                ) {
                  this.$router.push({
                    path: this.redirect,
                    query: this.query ? JSON.parse(this.query) : "",
                  });
                } else utilRoutePoint();
              } else utilRoutePoint();
            })
            .catch((err) => {
              this.loginForm.codeKey = "";
              // this.captcha()
            })
            .finally(() => {
              this.isLoading = false;
            });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.login_nocolor {
  /deep/ .el-dialog {
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -159px;
    margin-top: -184px !important;
    border-radius: 4px;
    .el-dialog__header {
      display: none;
    }
    .el-dialog__body {
      padding: 0;
    }
  }
}
.p {
  &-login {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    &_picture {
      flex: 1 1 auto;
      height: 100%;
      background: url("../../assets/images/login/login.jpg") center center
        no-repeat;
    }
    &_con {
      width: 32%;
      background-color: #fff;
      height: inherit;
      padding: 38px 30px;
      display: flex;
      flex-direction: column;
      > header {
        padding-left: 24px;
        margin-bottom: 76px;
        text-align: center;
      }
      > section {
        flex-grow: 2;
      }
    }
    &_logo {
      width: 188px;
      height: 52px;
    }
    &_form {
      background: #fff;
      border-radius: 4px;
      padding: 37px 24px 24px 24px;
      box-sizing: border-box;
    }
    &_regist {
      margin-top: 20px;
      font-size: 12px;
      color: #807e7e;
      /deep/ .el-checkbox__label {
        color: #807e7e !important;
      }
      > a {
        color: #1a92fe;
      }
    }
    &_record {
      text-align: center;
      line-height: 2;
      font-size: 14px;
      color: #8f9bb3;
    }
  }
  &-loginForm {
    &_head {
      font-size: 28px;
      font-weight: 500;
      color: rgba(31, 46, 77, 1);
      text-align: center;
    }
    &_con {
      margin-top: 40px;
      margin-bottom: 57px;
      /deep/ .el-input__inner {
        border-radius: 0;
        border: 0 none;
        border-bottom: 1px solid #d3dbeb;
        padding-left: 80px;
      }
      /deep/ .el-form-item {
        &:nth-child(2) {
          .e-form_label {
            top: -1px;
          }
        }
      }
    }
  }
}
.e {
  &-form {
    &_code {
      width: 60px;
      height: 38px;
      position: absolute;
      right: 0;
      z-index: 1000;
      cursor: pointer;
    }
    &_btn {
      width: 100%;
      height: 44px;
    }
    &_label {
      width: 70px;
      height: 40px;
      background-color: #fff;
      display: inline-block;
      position: absolute;
      z-index: 100;
    }
  }
}
</style>
