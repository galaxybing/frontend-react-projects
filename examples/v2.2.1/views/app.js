import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as RouterContainer, /* Router, HashRouter, Switch, Route, Redirect */ } from 'react-router-dom';

//const RouterContainer = require('react-router-dom').BrowserRouter;

// import { ConnectedRouter } from 'react-router-redux';
// import { CSSTransitionGroup } from 'react-transition-group';

import RootRouter from './router';

// Promise 对象
// 
var Promise = require('es6-promise').polyfill();
var win = window;
if (!win.Promise) {
    win.Promise = Promise;
    window = win;
}

class App extends Component{
  render() {
    const supportsHistory = 'pushState' in window.history;
    return (
      <RouterContainer basename="/hospital-admin/frontend-react-projects" forceRefresh={!supportsHistory} keyLength={10}>
        <RootRouter />
      </RouterContainer>
    )
  }
};

export default connect(null, dispatch => {
  return {
    dispatch
  }
})(App);
