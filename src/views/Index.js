import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Link } from 'react-router-dom';
import { push } from 'react-router-redux';
// import { TweenMax } from 'gsap';// 动画
import { checkedQuery } from '../actions';
class LoginView extends Component{
  static contextTypes={
		router: React.PropTypes.object.isRequired,
	};
  toPageList(){
    var loc = this.context.router.history;
    loc.push({ pathname: `/list/100153/hospital.html`});
    
  }
  componentDidMount(){
    let checkCodeResult = this.props.dispatch(checkedQuery());
    checkCodeResult.then((res)=>{
      // 得到同步数据，以备操作
    });
  }
  render(){
      return (
          <div className="page-index">
            <p style={{textAlign: 'center'}}>
              <a href="http://www.317hu.com/" target="_blank">317护咯</a>
            </p>
            <div className=""><a href="javascript:;" onClick={()=>this.toPageList()}>动态跳转路由链接 - list</a></div>
            <Link to="/detail.html">Link 标签跳转路由链接 - detail</Link>
            <p>
              <a href="javascript:;" onClick={()=>{
                this.props.dispatch(push({ pathname: '/detail.html', state: this.props.detailState}));
              }}>到详情界面</a>
            </p>
          </div>
      )
  }
}

function select(store){
	return {
    detailState: store.router.location.detailState
	}
}

function actions(dispatch, ownProps){
	return {
		dispatch
	};
}
module.exports = connect(select, actions)(LoginView);
