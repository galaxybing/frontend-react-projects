import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as RouterContainer, HashRouter, Switch, Route, Redirect } from 'react-router-dom';
// import { ConnectedRouter } from 'react-router-redux';
// import { CSSTransitionGroup } from 'react-transition-group';

import { ConnectedRouter } from 'react-router-redux';

import RootRouter from './router';

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
     * // {basename="/planning"}
     *
    <BrowserRouter basename="/frontend-react-projects" forceRefresh={!supportsHistory} keyLength={10}>
      <RootRouter />
    </BrowserRouter>
    
    <ConnectedRouter history={this.props.history}>
      <RootRouter />
    </ConnectedRouter>
    */
    return (
      <RouterContainer forceRefresh={!supportsHistory} keyLength={10}>
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
    /*
    dispatch(getAtionMethod());
    */
    return {
      dispatch
    }
})(App);

