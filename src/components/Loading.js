import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
// import {TweenMax} from 'gsap';

class LoadingView extends Component{
  static contextTypes={
		router: PropTypes.object.isRequired, // React.PropTypes.object.isRequired
	};
  componentDidMount(){
  }
  render(){
    return (
      <div>
        galaxyw...
      </div>
    );
  }
}

function select(store){
	return {
    
	}
}

function actions(dispatch, ownProps){
	return {
		dispatch
	};
}

module.exports = LoadingView;
