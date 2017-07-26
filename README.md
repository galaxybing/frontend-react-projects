# 初始化项目

## 安装开发环境的 npm 包
```bash
# 当一直无法找到 react 包资源时，请删除所以 node_modules 目录，再重新安装；
npm install
# 启动开发环境
npm run dev:server
```

## 启用本地开发环境
- 热替换的演示路径，访问：`http://localhost:8081/`
- [热替换演示路径：](http://localhost:9090/index.html)

## 提交开发域名给后端 galaxyw.317hu.com
- 是为了得到权限中心的接口请求的授权

## 文件及目录的命名方式：
- 文件及目录命名，以小写单词或小写开头骆峰拼写为主
- 配置文件名称，可用点号或连词线拼接成词组意义
- 组件（components）和通用类(class)文件及目录的名称，大写开头
- 复数含义的目录，请添加`s`示意

***

# 项目特性：

## 单页面开发模式

## 按需加载子路由
- 的资源加载做分离处理
- 构建打包时，路由分离加载机制
  - react-router
  - webpack
- 保持开发环境，node本机服务器模拟 history 路径、#SourceMap定位源码；能分离路由资源文件的话，更好！
  - node express 服务器

## 目录结构调整 - 可借鉴 dva
- 去除简单 js\css 目录，按功能进行线分

## 进行路由美化配置
- 对 history 显示进行路由美化
- 实现生产环境，配置 nginx 代理服务器为 history 路径显示
- nginx

***

## react-router-redux@^5.0.0-alpha.6

***
