# km-channel-h5

## Project setup
```
npm install
or
cnpm i
```

### Compiles and hot-reloads for development
```
npm run serve:dev
npm run serve:test
npm run serve:pro
```

### Compiles and minifies for production
```
npm run build:dev
package:./km-channel-dev
npm run build:test
package:./km-channel-test
npm run build:pro
package:./km-channel-pro
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### branch
master
  for product
release
  for test
dev
  for develop
channelV1.*.*
  for version develop

## 构建方法
开发环境构建 推送代码到dev分支，然后去jenkins http://192.168.239.101:9056/job/sz-dev-km-channel-h5/去构建即可, 账号：姓名拼音，如xiaoming(小明);密码：开机密码
测试环境构建 推送最新代码到release分支，然后通知相关测试人员去构建测试环境的jenkins
生产环境构建 自己手动打包然后提供包给测试即可

## 文件结构
### api
接口请求文件（按模块构建）

### assets
系统公共文件

### components
系统公共组件
- kmContainer 系统统一布局文件
- index 导入Vue.component

### scss 结构
- _reset.scss 全局重置样式，消除不同浏览器html标签差异
- variables.scss 全局 scss 变量, 组件内可直接调用
- mixin.scss 全局 scss mixin, 组件内可直接通过@include调用,用于定义公共的mixin函数
- cover.scss 全局覆盖样式，用于覆盖element ui 默认样式

### layout
包含页面基本布局文件，顶部导航栏 `HeadMenu` , 左侧导航栏 `SidebarMenu` , 标签导航栏 `TagMenu`

### pages
主项目文件夹首单词大写，参考驼峰命名标准

### plugin
配置挂载到Vue原型的配置，可全局调用

### router
系统路由配置包含路由守卫 `permission`、本地路由字典 `routes`、VueRouter实例化配置
- **_import** 提取成方法

### store
- 命名空间暂未添加

### utils
存放系统工具函数
- modules 工具函数构建完成

### 待完成工作 (优化)
- 接口请求拒绝报错捕获
- 验证文件整理
- 全局不能输空格指令

### 已完成工作
- vue.config.js 修复
- 百度统计事件绑定
- layout 待补充完整
- 顶部导航栏修改密码与退出账号
- 登录页面布局
- axios 待重新优化，补充element异常处理与二次封装
- login 事件，验证码待补充
- router 拦截器待补充完整
- utils整理



