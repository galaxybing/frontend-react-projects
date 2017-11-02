# 初始化项目

## 项目特性：
1. 单页面开发
2. 按需加载子路由
3. 路由美化配置
  - 对 history 显示进行路由美化
  - 实现生产环境，配置 nginx 代理服务器为 history 路径显示
  - nginx
4. 不再使用生成器函数

# 开发和构建命令的操作：

```bash
# 安装环境
npm install

# 启用
# 本地的开发环境，及热更新模式（默认应用 dev 服务数据）
# http://localhost:8081/planning/start.html
npm run start
# 应用 sit 服务数据：
npm run start:sit
npm run start:uat

# 构建
# 生产环境的部署代码(默认应用 dev 服务数据)
npm run build 
npm run build:dev -- develop
npm run build:dev-local # 本机
# 应用 sit 服务数据
npm run build:sit -- develop
npm run build:sit-local # 本机
# 应用 uat 服务数据
npm run build:uat -- develop
# 应用 prod 服务数据
npm run build:prod -- develop

# 构建master分支dev环境
# npm run build:[环境标示] -- [分支名称]
npm run build:dev -- master

```

# 部署详解：

```
1. 配置 package.json 的项目名称：
  - 如 "name": "frontend-react-projects"
2. 指定 push 推送消息格式（切换至发布分支上）：

  - npm run build:[环境名] -- [发布分支]
  - git commit -m '[环境名]@配置发布的版本号（以备 qsync 使用）'
    - git push origin 当前所在分支名:[环境名]-[发布分支]
  
  - git checkout master
  - 配置发布的版本号（以备 index.html 页面结构使用）：/src/store/api.prod.js 
    - "version": "v[版本号]",
  - npm run build:prod
  - git commit -m 'v[版本号]@配置发布的版本号（以备 qsync 使用）'
    - git push origin master:master
  
3. [Bone部署系统](http://bone.317hu.com/task/submit/)，将环境分支，同步到对应的 Eweb 工程 webapps 目录
4. 完成部署。
```

## 部署 dev|sit|uat 环境版本：
- git checkout develop
- npm run build:dev -- develop （声明发布 dev 环境，且当前所在主发布分支为 develop 的情况；以备 index.html 页面结构使用，即 dev-develop）
- git commit -m 'dev@配置发布的版本号（以备 qsync 使用）'
  - git push origin develop:dev-develop
- Bone 操作界面
  - 同步hospital-admin仓库与Eweb工程的 index.vm 入口文件
* 测试环境：
  - http://galaxyw.317hu.com:8081/hospital-admin/frontend-react-projects/index.html
  - http://hospital.dev.317hu.com/hospital-admin/frontend-react-projects/index.html

## 部署生产环境版本：
- git checkout master
- 配置发布的版本号（以备 index.html 页面结构使用）：/src/store/api.prod.js 
  - "version": "v1.0.1",
- npm run build:prod
- git commit -m 'v1.0.1@配置发布的版本号（以备 qsync 使用）'
  - git push origin master:master
- Bone 操作界面
  - 同步hospital-admin仓库与Eweb工程的 index.vm 入口文件
* 本地测试目录：( 即，模拟发布生产环境版本 使用uat数据 )
  - http://galaxyw.317hu.com/hospital-admin/frontend-react-projects/index.html


# 如何使用：

#### 1.本机起 nginx 环境：
- 配置：

```bash
# hosts
127.0.0.1  historyroute.317hu.com

# nginx
server {
    listen 80;
    server_name historyroute.317hu.com;
    index  index.php index.html index.htm;
    root /Users/galaxyw/web/com_317hu/nurse-training-planning/dist/;

    location ~*^/ {
        try_files $uri $uri/ /index.html;
    }
}
```
- 所以，访问路径：`http://historyroute.317hu.com/planning/start.html`
  
#### 2.与其他电脑联调：
- 配置：
```bash
# host
# 将指向源码电脑上的 localhost:8081/planning/start.html，且通过 npm run start 命令启动已经包含了单页面路由控制；
172.16.110.17  galaxyw.317hu.com
```
- 所以，访问路径：`http://galaxyw.317hu.com:8081/planning/start.html`

#### 3.Eweb入口工程服务器：
- 配置：`http://hospital.[开发环境].317hu.com/[Eweb入口工程项目名称]/[前端工程项目名称]/*.html`
- 如，`http://hospital.sit.317hu.com/hospital-admin/nurse-training-planning/planning/hospital.html`


调试方式
------------

#### 断点设置

**1. 在 IDE 中设置断点：**

```js
debugger;
console.log(store.router.location.state);
```

**2. 在发布压缩运行版本中设置断点（开发者工具的 Sources 标签卡）：**

- Sources 页卡选中 - 直接在源码显示框左侧行号上，点击添加。
- `Pretty Print`，标识为一对大括号 `{}` - 格式化压缩后的js文件 


