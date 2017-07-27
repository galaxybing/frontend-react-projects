'use strict';
require('./assets/css/lib.css');
require('./assets/css/app.css');

import React, { Component } from 'react';

import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import PropTypes from 'prop-types';

import createClass from 'create-react-class';
import configureStore from './store/configureStore';
import App from './views/app';

class Root extends Component{
    static defaultProps = {
        demo: false,
    };
    constructor(props){
        super(props);
        this.state = {
            userName: "galaxyw",
            store: configureStore(),
        };
    }
    render(){
        var props = this.props;
        return (
          <Provider store={this.state.store}>
			      <App />
          </Provider>
        );
    }
};

function startApp(){
    ReactDOM.render(<Root name="demo-react-router-redux" />, document.getElementById('app'));
}
startApp();