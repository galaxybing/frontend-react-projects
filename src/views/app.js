import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, HashRouter, Switch, Route, Redirect } from 'react-router-dom';
// import { ConnectedRouter } from 'react-router-redux';
// import { CSSTransitionGroup } from 'react-transition-group';

import { ConnectedRouter } from 'react-router-redux';

import RootRouter from './router';

class App extends Component{// function??/
  render() {
    const supportsHistory = 'pushState' in window.history;
    return (
      <ConnectedRouter history={this.props.history}>
        <RootRouter />
      </ConnectedRouter>
    );
  }
};

function select(store) {
  return {
    isLoggedIn: true
  };
};
module.exports = connect(select)(App);