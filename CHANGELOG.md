## [开发记录]
<details>
  <summary>
    这里主要记录开发过程主要的功能点、及升级版本，`点击这里`来查看未发布但计划或正在处理的部分内容：
  </summary>
  <section>
    <ul>
      <li>单元测试模块</li>
    </ul>
  </section>
  
</details>

**升级版本注意事项:**

- /src/index.js
  * 确认 `require('./views/app-antd.js');` 为 antd 主样式入口
  * 确认 `import App from './views/app';` 为主路由入口
- 特定版本升级，需要安装依赖包命令：`npm install`

## 2.1.4 (2018年03月21日)

1. 应用 redux-auth-wrapper 权限配置

- auth 的高阶组件 与 bundle 分割文件冲突？

## 2.1.3 (2018年01月26日)

1. 新增本地发布命令： 

- npm run build:uat-local

2. 更正 prod 域名字段：

```
  loginConfig: '//317hu.com/care-central/page/login',
  mock_nurseTrainApi: '//rap.api.317hu.com/app/mock/17',
  nurseTrainApi: '//nursetrain.prd.317hu.com',
  www_form_urlencoded_nurseTrainApi: '//nursetrain.prd.317hu.com',
  www_form_urlencoded_usercentralApi: '//usercentral.317hu.com',
  careCentralApi: '//317hu.com',
  privilegeApi: '//privilege.317hu.com',
  tradeApi: '//tradecenter.317hu.com',
  qiniuDomain: '//image.317hu.com',
```


## 2.1.2 (2017年12月08日)

### 开发仓库与发布目录分离

- 要求开发仓库的 origin 远程分支必须为源码仓库地址


## 2.1.1 (2017年11月01日)

### 自动化执行

### 只读数据插件引入

* immutability-helper


## 2.1.0 (2017年11月01日)

### 路由

* BrowserRouter 路由封装 basename={} 处理
* 将分离的模块，重复代码进行再次抽取
* 关于 entry 入口模块中是否一定要加入 antd 块，与按需加载冲突问题
* antdesign 组件模块的 `<style type="text/css"` 更新为 `<link` 引用

## 2.0.0 (2017年09月02日)

### 路由组件

- Scroll Restoration
  * state 数据同步
- 子路由组件里面，得到 this.props 两种方式：
  * withRouter: A public higher-order component to access the imperative API # react-router
  * module.exports = connect(select, actions)(ListView); # react-redux
- react-router-config
  * this.props.dispatch(replace({pathname: '/index.html', detailState: this.state})); # 所跳转的路由栈是不计入浏览器历史记录里面的？？

### 依赖版本升级

- react-router-redux@5.0.0-alpha.6
  * Keep your state in sync with your router 
  * ConnectedRouter will use the store from Provider automatically


### 抽离基础通用脚本、样式
- react + react-dom + react-router + animation(pc端可以使用js引擎、移动端看css3为主吧) 
- antd组件等第三方组件库使用
  
### Promise based HTTP client
- npm install axios

### 异步 action creator 执行
- [For async actions I'm using redux-thunk.](https://stackoverflow.com/questions/42872846/react-router-redux-setstate-warning-after-redirect/42915448#42915448)

### 阻塞父层级的请求发送，实现子组件 dom 数据同步

```javascript
class PanningList extends Component{
  async componentDidMount() {
    await this.props.dispatch(get());// 
    // 
    
  }
}
```

