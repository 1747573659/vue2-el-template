import Vue from "vue";
import VueRouter from "vue-router";
import { routes } from "./routes"

Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  fallback: true, // 如果浏览器不支持history模式，那么自动帮我们改为hash模式
  base: process.env.ENV === 'dev' ? '/kmchannel' : '',
  routes
});

export default router;
