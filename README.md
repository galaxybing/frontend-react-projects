# 初始化项目

## 安装开发环境的 npm 包
```bash
# 当一直无法找到 react 包资源时，请删除所以 node_modules 目录，再重新安装；
npm install

npm run dev:server
# 启用本地的开发环境，及热更新模式
# http://localhost:8081/frontend-react-projects/index.html

npm run build
# 构建生产环境的部署代码
# http://browserroute.galaxyw.com/frontend-react-projects/index.html

```

## 提交开发域名给后端 galaxyw.317hu.com
- 是为了得到权限中心的接口请求的授权

## 文件及目录的命名方式：
- 文件及目录命名，以小写单词或小写开头骆峰拼写为主
- 配置文件名称，可用点号或连词线拼接成词组意义
- 组件（components）和通用类(class)文件及目录的名称，大写开头
- 复数含义的目录，请添加`s`示意

***

# 项目特性：

1. 单页面开发模式
2. 按需加载子路由
3. 进行路由美化配置
  - 对 history 显示进行路由美化
  - 实现生产环境，配置 nginx 代理服务器为 history 路径显示
  - nginx


/ 路径加载失败？？403

# Scroll Restoration

# 子路由组件里面，得到 this.props 两种方式：
- withRouter: A public higher-order component to access the imperative API # react-router
- module.exports = connect(select, actions)(ListView); # react-redux

# react-router-redux@^5.0.0-alpha.6

# react-router-config

# 抽离基础通用脚本、样式：
  - react + react-dom + react-router + animation(pc端可以使用js引擎、移动端看css3为主吧) 
  - antd组件等第三方组件库使用

***
