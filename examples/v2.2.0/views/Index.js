import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';

import { Link } from 'react-router-dom';
import { push } from 'react-router-redux';
import { logout } from '../../../src/actions/config'
// import { TweenMax } from 'gsap';// 动画
// 
// var request = require('request');
// import { push as basenamePush } from '../../../lib_modules/router-basename';
// import { fetch } from '../../../src/core/_utils/request';

class IndexView extends Component{
  static contextTypes={
		router: PropTypes.object.isRequired,
	};
  componentDidMount(){}
  render(){
    const { logout, dispatch } = this.props;
    return (
      <div className="page-index page-container">
        <h1>版本：v2.2.0</h1>
        <a href="#" onClick={() => logout()}>登出</a>
        <h2 style={{fontSize: 16, marginBottom: 15}}>路由跳转方式参考：</h2>
        <p><a href="http://www.317hu.com/" target="_blank" rel="noopener noreferrer">317护官网链接 - _blank</a></p>
        <p><Link to="/detail.html">标签跳转路由链接 - Link</Link></p>
        <p className=""><span onClick={()=>{
          this.context.router.history.push({ pathname: `/list/100153/hospital.html`}); // 会自带将 dispatch history location match 传递给下一个路由组件的 props
          // 
          // basenamePush({ pathname: '/list/100153/hospital.html', props: this.props})(this.context.router.history);
        }}>动态跳转路由链接 - context.router.history-push</span></p>
        <p>
          <span className="link" onClick={()=>{
            // 支持在 ConnectedRouter 路由封装生效
            // this.props.dispatch(push({ pathname: '/hospital-admin/frontend-react-projects/detail.html', state: this.props.detailState}));
          }}>动态跳转链接 - ConnectedRouter-push</span>
        </p>
        <p>
          <span className="link" onClick={()=>{
            // 用于直接跳转
            // this.props.history.push({ pathname: '/detail.html', state: this.props.detailState});
            this.context.router.history.push({ pathname: '/detail.html', state: this.props.detailState});
            // basenamePush({ pathname: '/detail.html', props: this.props})();
          }}>动态跳转链接 - createHistory()-push</span>
        </p>
        
        <h2 style={{fontSize: 16, marginBottom: 15}}>immutability-helper 使用参考：</h2>
        <p>
          <span className="link" onClick={()=>{
            this.context.router.history.push({ pathname: '/immutability-demo-push.html'});
          }}>$push</span>
        </p>
      </div>
    )
  }
}

function select(store/*, ownProps*/){ // 1）第一个参数总是state对象，还可以使用第二个参数，代表容器组件的props对象
								  // 2) 侦听 Store，每当state更新的时候，就会自动执行，重新计算 UI 组件的参数，从而触发 UI 组件的重新渲染。
								  // 3）当使用了 ownProps 作为参数后，如果容器组件的参数发生变化，也会引发 UI 组件重新渲染。
	return {
    basename: store.config.basename,
    detailState: store.router.location&&store.router.location.detailState
	}
}

function actions(dispatch, ownProps){
	return {
    logout,
		dispatch
	};
}

module.exports = connect(select, actions)(IndexView); // 方便在 ui 层面，应用 this.dispatch
// module.exports = connect(select, { logout })(IndexView); // 直接在 actions 层面，返回 type 触发动作函数
