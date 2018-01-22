import React, { Component } from 'react';

import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
// import PropTypes from 'prop-types';

// import createClass from 'create-react-class';
import { configureStore, history } from './store/configureStore';
import App from '../examples/v2.1.1/views/app';
// import App from './views/app';

// import AnimationExample from './views/AnimationExample';

require('./assets/css/lib.css');
require('./assets/css/app.css');
// require('../examples/v2.1.1/views/app-antd.js');// 以允许应用不同版本的 antd 样式（引用以入口为准，属于 lib-app.css）
require('./views/app-antd.js');

if ('scrollRestoration' in history) {
  // history.scrollRestoration = 'manual';
}

class Root extends Component{
    static defaultProps = {
        demo: false,
    };
    constructor(props){
        super(props);
        this.state = {
            author: "galaxyw",
            store: configureStore(),
        };
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