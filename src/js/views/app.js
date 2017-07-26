import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, HashRouter, Switch, Route } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';

import Bundle from '../core/bundle.js';

//import DetailViewContainer from 'bundle-loader?lazy&name=page-[name]!./pages/detailView.js';

import IndexView from './index.js';
import ListViewContainer from './pages/ListView.js'; // bundle-loader 返回
import DetailViewContainer from './pages/DetailView.js';
const createChildRouteComponent = (container, props,) => (
    <Bundle load={container}>
        {(View) => <View {...props} />}
    </Bundle>
);

class App extends Component{// function??/
  render() {
    // /* Router switch to [ ConnectedRouter ] will use the store from Provider automatically */
    const supportsHistory = 'pushState' in window.history;
    /*
    return (
      <BrowserRouter forceRefresh={!supportsHistory} keyLength={12}>
				<div>
					<Route exact path="/" component={IndexView}/>
					<Route name='list' path='/list(/:id/:name)' component={ListView} />
					<Route name='detail' path='/detail' component={DetailView} />
				</div>
      </BrowserRouter>
    );
    */
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
