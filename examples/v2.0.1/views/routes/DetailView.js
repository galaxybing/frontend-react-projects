import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
// import {TweenMax} from 'gsap';
import { Link } from 'react-router-dom';
import { push, replace } from 'react-router-redux';

import { Progress, Input, Button,Modal } from 'antd';// 引用且渲染 产生文件量
import moment from 'moment';

class DetailView extends Component{
  // static propTypes = {
  //   match: PropTypes.object.isRequired,
  //   location: PropTypes.object.isRequired,
  //   history: PropTypes.object.isRequired
  // }
  constructor(props){
    super(props);
    
    this.state = {
      count: 0,
      ...props.stateData
    }
    /*
    let history = this.props.history;
    this.state = {
      count: (history.location.state && history.location.state.count) ? history.location.state.count : 0,
    }
    // history.listen((location,action) => { // router: routerReducer
        // this.setState({
        //     count: (history.location.state && history.location.state.count) ? history.location.state.count : 0,
        // })
    // }); 
    */
  }
  componentDidMount(){
    console.log('this.context.router->', this.context.router);
    console.log('this.props->', this.props);
  }
  addStateNumber(){
    this.setState((prevState, props) => {
      return { count: prevState.count + 1};
    })
  }
  render(){
      return (
        <div className="page-detail">
          <Progress width={40} gapPosition={'top'} type="circle" percent={80} format={() => `床`} />
          {moment((new Date()).getTime()).format('YYYY-MM-DD HH:mm:ss')}
          <p>
              多媒体资源演示：
              <br />
              <iframe src="//v.qq.com/iframe/player.html?vid=c0353ehgq7k&amp;tiny=1&amp;auto=0"
              width="960" height="746" frameBorder="0" allowFullScreen="allowfullscreen">
              </iframe>
          </p>
          
          <p>
            <a href="javascript:;" onClick={()=>{this.addStateNumber()}}>点击操作</a>
          </p>
          <div >显示操作次数：{this.state.count}</div>
          <Link to='/index.html'>[Link链接到首页界面]</Link>
          <p>
            <a href="javascript:;" onClick={()=>{
              // this.props.dispatch(push({pathname: '/index.html', state: this.state}));
              // [A location object](https://github.com/ReactTraining/history/blob/v3/docs/Location.md)
              // 
            
              // this.props.dispatch(replace({pathname: '/index.html', detailState: this.state}));
              this.props.history.replace({pathname: '/index.html', detailState: this.state})
              
              // goBack routerActions
            }}>切换到首页界面</a>
          </p>
        </div>
      );
  }
}

function select(store/*, ownProps*/){ // 1）第一个参数总是state对象，还可以使用第二个参数，代表容器组件的props对象
								  // 2) 侦听 Store，每当state更新的时候，就会自动执行，重新计算 UI 组件的参数，从而触发 UI 组件的重新渲染。
								  // 3）当使用了 ownProps 作为参数后，如果容器组件的参数发生变化，也会引发 UI 组件重新渲染。
	// 
  // debugger;
  // console.log(store.router.location.state);
  
	return {
    stateData: store.router.location&&store.router.location.state
	}
}

function actions(dispatch, ownProps){
	return {
		dispatch,
	};
}

// module.exports = withRouter(connect(select, actions)(DetailView));
module.exports = withRouter(DetailView);
// module.exports = connect(select, actions)(DetailView);
// module.exports = DetailView; // Cannot read property 'replace' of undefined
