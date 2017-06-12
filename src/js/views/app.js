import React, { Component } from 'react';
import { connect } from 'react-redux';
//import { Router, Route, hashHistory, IndexRoute} from 'react-router';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';

import createHistory from 'history/createBrowserHistory';
const history = createHistory();// 第2次配置

const RouteApp = (({ children }) => (
	<div className="view-container">
		<div className="view-bg-page"></div>
		{children}
	</div>
));
import Login from './login';
import ListView from './listView';
import DetailView from './detailView';
import MessageView from './messageView';

class App extends Component{// function??/
    render() {
        // /* Router switch to [ ConnectedRouter ] will use the store from Provider automatically */
        return (
            <BrowserRouter history={history}>
				<div>
					<Route exact path="/" component={Login}/>
					<Route name='list' path='/list(/:id/:name)' component={ListView} />
					<Route name='detail' path='/detail' component={DetailView} />
				</div>
            </BrowserRouter>
        );
    }
};

function select(store) {
  return {
    isLoggedIn: true
  };
};
module.exports = connect(select)(App);
