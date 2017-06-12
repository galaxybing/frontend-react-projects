import React, { Component } from 'react';
import { connect } from 'react-redux';
// import {TweenMax} from 'gsap';

class ListView extends Component{
  static contextTypes={
		router: React.PropTypes.object.isRequired,
	};
  componentDidMount(){
  }
  goBack(){
    var loc = this.context.router.history;
    loc.goBack()
  }
  render(){
      return (
        <div style={{textAlign: 'center', color: '#ff0000'}} onClick={()=>this.goBack()}>[返回上页去吧]</div>
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

module.exports = connect(select, actions)(ListView);
