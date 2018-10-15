import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as RouterContainer } from 'react-router-dom';
const boz = require('../../config').BOZ;
import RootRouter from './router';

class App extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const supportsHistory = 'pushState' in window.history;
    return (
      <RouterContainer basename="/hospital-admin/frontend-react-projects" forceRefresh={!supportsHistory} keyLength={10}>
        <RootRouter />
      </RouterContainer>
    );
  }
}
function select(state) {
  return {
    app: state.main,
  };
}
function actions(dispatch, ownProps) {
  return { dispatch };
};
export default connect(select, actions)(App);
