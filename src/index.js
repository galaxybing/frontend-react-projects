// require('string.prototype.startswith');
require('./assets/css/lib.css');
require('./assets/css/app.css');
import 'babel-polyfill';
const Promise = require('es6-promise').Promise;
const boz = require('../config').BOZ;
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { configureStore, history } from './store/configureStore';
import { saveCache } from './core/_utils/storage';
// import App from '../examples/v2.2.1/views/app'; // import App from './views/app';
import App from './views/app';

if (boz[`env`] === 'prod') {
  window[`url$Raven`] = `//993be79068aa427295767e9bcda03c1c@sentry.317hu.com/15`;
  require('@317hu/GlobalRavenCaptureException');
}

if ('scrollRestoration' in history) {
  // history.scrollRestoration = 'manual';
}

class Root extends Component {
  static defaultProps = {
    demo: false,
  };
  constructor (props) {
    super(props);
    this.state = {
        author: "galaxyw",
        store: configureStore(),
    }
    if (typeof this.state.store !== 'undefined') {
      window.onbeforeunload = () => { // 在刷新界面之前 存储 state ui 模型对象
        const store = this.state.store;
        store.dispatch({
          type: 'APP_VERSION_UPDATE',
          data: boz[`env`]
        })
        const state = store.getState();
        saveCache('state', state);
      }
    }
  }
  render () {
    return (
      <Provider store={this.state.store}>
		    <App history={history} />
      </Provider>
    );
  }
};

function startApp() {
  ReactDOM.render(<Root name="demo-react-router-redux" />, document.getElementById('app'));
}

if (window[`$Raven`]) {
  window[`$Raven`].context(function() {
    startApp();
  });
} else {
  startApp();
}
