import React, { Component } from 'react';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';
// import {TweenMax} from 'gsap';
import { Progress, Input, Button, Modal } from 'antd';// 引用且渲染 产生文件量
import moment from 'moment';

class ListView extends Component{
  static contextTypes={
		router: PropTypes.object.isRequired, // React.PropTypes.object.isRequired
	};
  componentDidMount(){
    console.log('this.props.match.params->', this.props.match.params);
    console.log('this.context.router->', this.context.router);
    console.log('this.props->', this.props);// dispatch history location match
  }
  render(){
    return (
      <div>
        <Progress width={40} gapPosition={'top'} type="circle" percent={80} format={() => `317护`} />
        {moment((new Date()).getTime()).format('YYYY-MM-DD HH:mm:ss')}
        <div style={{textAlign: 'center', color: '#ff0000', cursor: 'pointer', width: 260, margin: '0 auto'}} onClick={()=>{
          this.context.router.history.goBack();
          // this.props.history.replace({ pathname: '/hospital-admin/frontend-react-projects/index.html'});
        }}>[返回 - 直接使用goBack无法回到顶部]</div>
        <pre>
          console.log('this.props.match.params->', this.props.match.params);<br />
          console.log('this.context.router->', this.context.router);<br />
          console.log('this.props->', this.props);// dispatch history location match
        </pre>
        
      </div>
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
