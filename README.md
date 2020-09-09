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

## 文件结构

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

### store

### utils
存放系统工具函数

### 待完成工作
- 百度统计事件绑定 (今天)
- 全局不能输空格指令

### 已完成工作
- layout 待补充完整
- 顶部导航栏修改密码与退出账号
- 登录页面布局
- axios 待重新优化，补充element异常处理与二次封装
- login 事件，验证码待补充
- router 拦截器待补充完整



