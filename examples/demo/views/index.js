import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { push } from 'react-router-redux';
import { logout } from '../../../src/actions/config';

// 动画
// import { TweenMax } from 'gsap';

// 发请求
// var request = require('request');
// import { fetch } from '../../../src/core/_utils/request';

class IndexView extends Component{
  static contextTypes={
		router: PropTypes.object.isRequired,
	};
  componentDidMount() {
    
  }
  render() {
    const { logout, dispatch } = this.props;
    return (
      <div className="page-index page-container">
        <h1>版本：demo</h1>
        <div>
          
        </div>
      </div>
    )
  }
}

function select(store/*, ownProps*/){
  // 1）第一个参数总是state对象，还可以使用第二个参数，代表容器组件的props对象
  // 2) 侦听 Store，每当state更新的时候，就会自动执行，重新计算 UI 组件的参数，从而触发 UI 组件的重新渲染。
  // 3）当使用了 ownProps 作为参数后，如果容器组件的参数发生变化，也会引发 UI 组件重新渲染。
	return {
    basename: store.config.basename,
    detailState: store.router.location && store.router.location.detailState
	}
}

function actions(dispatch, ownProps){
	return {
    logout,
		dispatch
	};
}

export default connect(select, actions)(IndexView);
