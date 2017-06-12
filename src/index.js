'use strict';
require('./assets/css/lib.css');
require('./assets/css/app.css');
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import PropTypes from 'prop-types';
import createClass from 'create-react-class';
import { configureStore, history } from './store/configureStore';
import App from './views/app';
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
        var props = this.props;
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