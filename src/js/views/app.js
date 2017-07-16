import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, HashRouter, Switch, Route } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';

import IndexView from './index';
import ListView from './listView';
import DetailView from './detailView';
class App extends Component{// function??/
  render() {
    // /* Router switch to [ ConnectedRouter ] will use the store from Provider automatically */
    /*
    return (
      <BrowserRouter history={history}>
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
					<Route name='list' path='/list/:id/:name' component={ListView} />
					<Route name='detail' path='/detail' component={DetailView} />
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
