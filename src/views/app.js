import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, HashRouter, Switch, Route, Redirect } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';
import { CSSTransitionGroup } from 'react-transition-group';
import Bundle from '../core/bundle.js';

//import DetailViewContainer from 'bundle-loader?lazy&name=page-[name]!./pages/detailView.js';

import IndexView from './Index.js';
import ListViewContainer from './pages/ListView.js'; // bundle-loader 返回
import DetailViewContainer from './pages/DetailView.js';
const createChildRouteComponent = (container, props,) => (
    <Bundle load={container}>
        {(View) => <View {...props} />}
    </Bundle>
);

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
    return (
      <BrowserRouter basename="/frontend-react-projects" forceRefresh={!supportsHistory} keyLength={10}>
				
        <Route render={({ location }) => (
          <div>
            
            <Route path="/" render={() => (
              <Redirect to="/index.html" />
            )}/>
            
            <div>
              {/* 目前 CSSTransitionGroup 动画，要求路由结构已经生成？？，所以不可与子路由按需加载共用：
                <CSSTransitionGroup transitionName="fade" transitionEnterTimeout={300}  transitionLeaveTimeout={300}>
        					<Route name="index" path="/index.html" location={location} key={location.key} component={IndexView} />
        					<Route name='list' path='/list/:id/:name.html' location={location} key={location.key} component={(props, a, method) => {
                    return createChildRouteComponent(ListViewContainer, props);
                  }} />
                  <Route name='detail' path='/detail.html' location={location} key={location.key} component={() => createChildRouteComponent(DetailViewContainer)} />
                </CSSTransitionGroup>
                 */}
      					<Route name="index" path="/index.html" location={location} key={location.key} component={IndexView} />
      					<Route name='list' path='/list/:id/:name.html' component={(props, a, method) => {
                  return createChildRouteComponent(ListViewContainer, props);
                }} />
                <Route name='detail' path='/detail.html' component={() => createChildRouteComponent(DetailViewContainer)} />
            </div>
          
          </div>
        )} />
				
      </BrowserRouter>
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

function select(store) {
  return {
    isLoggedIn: true
  };
};
module.exports = connect(select)(App);

/*
 * 没有路由版本结构：
import React, { Component } from 'react';
import IndexView from './index';

class App extends Component{// function??/
  render() {
    return (
      <IndexView />
    );
  }
};

module.exports = App;
*/
