'use strict';
require('../css/lib.css');
require('../css/app.css');
require('../js/core/flex.js');

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
        // return <h1>Hello, {props.name}？</h1>;
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
