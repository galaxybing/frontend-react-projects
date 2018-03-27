import React, { Component } from 'react';
// import PropTypes from 'prop-types';
// import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// import { withRouter } from 'react-router';
// import {TweenMax} from 'gsap';
import { Link } from 'react-router-dom';
// import { push, replace } from 'react-router-redux';
import { /* Input, Button, */ Modal, Select } from 'antd';// 引用且渲染 产生文件量
import moment from 'moment';
import { loginOut } from '../../../../src/actions/user'

const { Option, OptGroup } = Select;

class LoginAfterView extends Component{
  // static propTypes = {
  //   match: PropTypes.object.isRequired,
  //   location: PropTypes.object.isRequired,
  //   history: PropTypes.object.isRequired
  // }
  constructor(props){
    super(props);
    
    this.state = {
      count: 0,
      visible: true,
      ...props.stateData
    }
    console.log('user->', this.props)
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
  loginOutHandler = () => {
    console.log('loginOutHandler...galaxyw');
    this.props.dispatch(loginOut())
  }
  addStateNumber(){
    this.setState((prevState, props) => {
      return { count: prevState.count + 1};
    })
  }
  handleOk = (e) => {
    this.setState({
      visible: false,
    });
  }
  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  }
  render(){
      return (
        <div className="page-detail">
          <div>
            <a href="javascript:;" onClick={this.loginOutHandler}>登出</a>
          </div>
          {moment((new Date()).getTime()).format('YYYY-MM-DD HH:mm:ss')}
          <p>
            <span className="link" onClick={()=>{this.addStateNumber()}}>点击增加操作次数：{this.state.count}</span>
          </p>
          <Link to='/index.html'>[Link链接到首页界面]</Link>
          <div className="link" onClick={()=>{
            // this.props.dispatch(push({pathname: '/index.html', state: this.state}));
            // [A location object](https://github.com/ReactTraining/history/blob/v3/docs/Location.md)
            // 
          
            // this.props.dispatch(replace({pathname: '/index.html', detailState: this.state}));
            this.props.history.replace({pathname: '/index.html', detailState: this.state})
            
            // goBack routerActions
          }}>切换到首页界面</div>
        </div>
      );
  }
}

function select(store, ownProps){
	return {
    stateData: store.router.location && store.router.location.state,
    user: store.user
	}
}

function actions(dispatch, ownProps){
	return {
		dispatch,
	};
}

module.exports = connect(select, actions)(LoginAfterView);
