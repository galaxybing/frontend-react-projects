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

const { Option, OptGroup } = Select;

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
          {moment((new Date()).getTime()).format('YYYY-MM-DD HH:mm:ss')}
          <Modal
            title="基本弹层框"
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
          >
            <p style={{textAlign: 'center'}}>弹层内容</p>
          </Modal>
          <p>
              多媒体资源演示：
              <br />
              <iframe src="//v.qq.com/iframe/player.html?vid=c0353ehgq7k&amp;tiny=1&amp;auto=0"
              width="960" height="746" frameBorder="0" allowFullScreen="allowfullscreen" title="galaxyw">
              </iframe>
          </p>
          
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
          <div>
            <Select
              defaultValue="张三丰"
              style={{ width: 200 }}
              onChange={() => {
                
              }}
            >
              <OptGroup label="管理员">
                <Option value="张三丰">张三丰</Option>
                <Option value="小李飞刀">小李飞刀</Option>
              </OptGroup>
              <OptGroup label="vip会员">
                <Option value="赵本山">赵本山</Option>
              </OptGroup>
            </Select>
          </div>
        </div>
      );
  }
}

function select(store, ownProps){ // 1）第一个参数总是state对象，还可以使用第二个参数，代表容器组件的props对象
								  // 2) 侦听 Store，每当state更新的时候，就会自动执行，重新计算 UI 组件的参数，从而触发 UI 组件的重新渲染。
								  // 3）当使用了 ownProps 作为参数后，如果容器组件的参数发生变化，也会引发 UI 组件重新渲染。
	// 
  // debugger;
  // console.log(store.router.location.state);
  
	return {
    stateData: store.router.location&&store.router.location.state,
    user: store.user
	}
}

function actions(dispatch, ownProps){
	return {
		dispatch,
	};
}

// module.exports = withRouter(connect(select, actions)(DetailView));
// module.exports = withRouter(DetailView);
module.exports = connect(select, actions)(DetailView);
// module.exports = DetailView; // Cannot read property 'replace' of undefined
