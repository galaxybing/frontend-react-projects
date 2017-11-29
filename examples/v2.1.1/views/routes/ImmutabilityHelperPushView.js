import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { Link } from 'react-router-dom';
import { push, replace } from 'react-router-redux';

import update from 'immutability-helper';

class DemoView extends Component{
  constructor(props){
    super(props);
    this.state = {
      count: 0,
    }
  }
  componentDidMount(){
    const state1 = ['x'];
    const state2 = update(state1, {$push: ['y']});
    console.log(state2);
    console.log('this.props->', this.props);
  }
  render(){
    return (
      <div>demo...</div>
    )
  }
}

function select(store){
	return {
    galaxyw: 'abc'
	}
}

function actions(dispatch, ownProps){
	return {
		dispatch
	}
}

// module.exports = withRouter(DemoView);
module.exports = connect(select, actions)(DemoView);
