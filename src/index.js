require('string.prototype.startswith');
// require('String.prototype.startsWith');
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
// import PropTypes from 'prop-types';
// import createClass from 'create-react-class';
import { configureStore, history } from './store/configureStore';
import { saveCache } from './core/_utils/storage';
import App from '../examples/v2.2.0/views/app';
// import App from './views/app';

// import AnimationExample from './views/AnimationExample';

require('./assets/css/lib.css');
require('./assets/css/app.css');
// require('../examples/v2.1.1/views/app-antd.js'); // 以允许应用不同版本的 antd 样式（引用以入口为准，属于 lib-app.css）
// require('./views/app-antd.js');

if ('scrollRestoration' in history) {
  // history.scrollRestoration = 'manual';
}

class Root extends Component {
  static defaultProps = {
    demo: false,
  };
  constructor(props){
    super(props);
    this.state = {
        author: "galaxyw",
        store: configureStore(),
    }

    if (typeof this.state.store !== 'undefined') {
      const version = process.env.VERSION_ENV || 'dev';
      window.onbeforeunload = () => { // 在刷新界面之前 存储 state ui 模型对象
        const store = this.state.store;
        store.dispatch({
          type: 'APP_VERSION_UPDATE',
          data: version
        })
        const state = store.getState();
        saveCache('state', state);
      }
    }
  }
  render(){
    // var props = this.props;
    return (
      <Provider store={this.state.store}>
		    <App history={history} />
      </Provider>
    );
  }
};

function startApp(){
  ReactDOM.render(<Root name="demo-react-router-redux" />, document.getElementById('app'));
}

startApp();
