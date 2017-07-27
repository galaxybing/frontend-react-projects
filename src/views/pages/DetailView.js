import React, { Component } from 'react';
import { connect } from 'react-redux';
// import {TweenMax} from 'gsap';
import { Link } from 'react-router-dom';

class DetailView extends Component{
  constructor(props){
    super(props);
  }
  componentDidMount(){
    console.log('render detail ...');
  }
  render(){
      return (
        <p style={{textAlign: 'center'}}>
          <Link to='/index.html'>[返回上页]</Link>
        </p>
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
		dispatch
	};
}

module.exports = connect(select, actions)(DetailView);
