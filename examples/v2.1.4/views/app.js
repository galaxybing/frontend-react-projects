import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as RouterContainer, /* Router, HashRouter, Switch, Route, Redirect */ } from 'react-router-dom';

//const RouterContainer = require('react-router-dom').BrowserRouter;

// import { ConnectedRouter } from 'react-router-redux';
// import { CSSTransitionGroup } from 'react-transition-group';

import RootRouter from './router';
// import { setBasename } from '../../lib_modules/router-basename';

class App extends Component{// function??/
  render() {
    // Router switch to [ ConnectedRouter ] will use the store from Provider automatically ??
    /*
     * 美化路由为 .html ：
     *    1）首选使用 nodejs 的应用服务器代理
     *    2) 因为要配置服务器端重定向，所以路由中 exact 精确属性一定得去掉
     *    3) <Route name="index" path="/index.html" ，如果指明确为.html 则/ 表示为所有子路由都共用的部分了
     *    4）basename="/" 子目录名称配置，需要后端应用服务器（如，nginx）对应的配置
     */
     
    const supportsHistory = 'pushState' in window.history;
    /*
     路由封装：
     1. Router 与 BrowserRouter 的区别意义在哪里？
     <Router history={this.props.history}>
       <RootRouter />
     </Router>

     2. 
     // {basename="/planning"}
     //   不支持 使用由 react-router-redux 导出的 push、replace 方法，进行 basename 进行基准路由跳转
     //   支持 this.props.history
     //   支持 this.context.router.history
    <RouterContainer basename="/frontend-react-projects" forceRefresh={!supportsHistory} keyLength={10}>
      <RootRouter />
    </RouterContainer>
    
     3. 
    // 定义 function select(store){ store.router.location
    // 定义 reducers 的入口：
        module.exports = combineReducers({
            router: routerReducer //将 reducer 声明到 store 里面的 router 键
        });
    //
    <ConnectedRouter history={this.props.history}>
      <RootRouter />
    </ConnectedRouter>
    */
    return (
      <RouterContainer basename="/hospital-admin/frontend-react-projects" forceRefresh={!supportsHistory} keyLength={10}>
        <RootRouter />
      </RouterContainer>
    );
    /*
     * 锚点路由链接形式：
     *    1）配合没有个性权限的应有服务器，或者本地开发时使用；
     *
    return (
      <HashRouter>
				<Switch>
          <Route exact path="/" component={IndexView}/>
					<Route name='list' path='/list/:id/:name' page='abc' component={(props, a, method) => {
            // console.log('props->>>', props, ' a->>>', a, ' method->>>', method,);
            return createChildRouteComponent(ListViewContainer, props);
          }} />
					<Route name='detail' path='/detail' component={() => createChildRouteComponent(DetailViewContainer)} />
				</Switch>
      </HashRouter>
    );
     */
  }
};

module.exports = connect(null, dispatch => {
    // dispatch(setBasename('/hospital-admin/frontend-react-projects'));
    return {
      dispatch
    }
})(App);

