import React, { Component } from 'react';
import { connect } from 'react-redux';
import {TweenMax} from 'gsap';

class DetailView extends Component{
    render(){
        return (
            <div style={{border: '1px solid red'}}>DetailView</div>
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

module.exports = connect(select, actions)(DetailView);
