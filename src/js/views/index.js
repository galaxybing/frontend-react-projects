import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Link } from 'react-router-dom';
import { TweenMax } from 'gsap';// 动画
import { vedioListAndUrlQuery } from '../actions';
class LoginView extends Component{
  static contextTypes={
		router: React.PropTypes.object.isRequired,
	};
  toPageList(){
    var loc = this.context.router.history;
    // loc.replace({ pathname: `/list/100153/hospital`});
    loc.push({ pathname: `/list/100153/hospital`});
    
  }
  componentDidMount(){
    this.props.dispatch(vedioListAndUrlQuery());
  }
  render(){
      return (
          <div className="page-index">
            <p style={{textAlign: 'center'}}>
              <a href="http://www.317hu.com/" target="_blank">317护</a>
            </p>
            <div className=""><a href="javascript:;" onClick={()=>this.toPageList()}>动态跳转路由链接</a></div>
            <Link to="/detail">Link 标签跳转路由链接</Link>
          </div>
      )
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
module.exports = connect(select, actions)(LoginView);
