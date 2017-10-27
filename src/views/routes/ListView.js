import React, { Component } from 'react';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';
// import {TweenMax} from 'gsap';

class ListView extends Component{
  static contextTypes={
		router: PropTypes.object.isRequired, // React.PropTypes.object.isRequired
	};
  componentDidMount(){
    console.log('this.props.match.params->', this.props.match.params);
    console.log('this.context.router->', this.context.router);
    console.log('this.props->', this.props);// dispatch history location match
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

function select(store/*, ownProps*/){ // 1）第一个参数总是state对象，还可以使用第二个参数，代表容器组件的props对象
								  // 2) 侦听 Store，每当state更新的时候，就会自动执行，重新计算 UI 组件的参数，从而触发 UI 组件的重新渲染。
								  // 3）当使用了 ownProps 作为参数后，如果容器组件的参数发生变化，也会引发 UI 组件重新渲染。
	return {

	}
}

function actions(dispatch, ownProps){
	return {
		//loginCodeCheck: (arg)=> dispatch(loginCodeCheck(arg)),
		dispatch
	};
}

module.exports = connect(select, actions)(ListView);
