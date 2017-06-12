import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
// import {TweenMax} from 'gsap';
import { Link } from 'react-router-dom';
import { push, replace } from 'react-router-redux';

class DetailView extends Component{
  constructor(props){
    super(props);
    
    this.state = {
      count: 0,
      ...props.stateData
    }
  }
  componentDidMount(){
  }
  addStateNumber(){
    this.setState((prevState, props) => {
      return { count: prevState.count + 1};
    })
  }
  render(){
      return (
        <div style={{textAlign: 'center'}}>
          <h1>企鹅TALK | PHP机器学习与智能推荐系统设计探讨</h1>
          <p>作为近期人工智能领域的热点话题一直在引发广泛讨论，而“学会如何去学习以及保持对新技术的追求”被认为是程序员朋友应具备的良好习惯，不过对于在不断寻求进阶的程序员朋友们，除了看书刷题听课，我们还需要更多的交流与探讨</p>
          <img src="http://image.135editor.com/files/users/106/1063211/201707/LzzwZEFk_wYUv.jpg" title="公众号：900×500.jpg" alt="公众号：900×500.jpg" />
          <p>企鹅Talk针对初创企业各部门人员精简、内部交流相对缺乏情况，就产品、设计、人事、运营等不同岗位人才量身打造职业进阶方案，通过多种形式的分享交流，从知识、技能、资源、人脉等多方面助力人才发展，在服务腾讯众创空间入驻团队的同时帮助更多职场新人成长。</p>
          <p>在这里，你可以听到大牛的案例分析，也可以分享你工作中遇到的困惑，我们聚在一起，去交流、去成长。</p>
          <h2>现场你可以碰到 Ta 们</h2>
          <p><img src="http://juzhen-10015292.cos.myqcloud.com/public/upload/20170726/201707261947299633691501069649.jpg" /></p>
          <p><img src="http://juzhen-10015292.cos.myqcloud.com/public/upload/20170726/201707261914009234551501067640.jpg" /></p>
          <p>8月3日周四晚 19:00-21:00 </p>
          <p>腾讯众创空间（杭州）活动室</p>
          <p>文二西路738号西溪乐谷2号楼2楼</p>
          <p>破冰+嘉宾分享+自由提问+场景题讨论</p>
          <div>*活动限制20人，工作人员将以报名页您的提问为参考进行筛选，请务必认真填写问题。</div>
          <p>
            <a href="javascript:;" onClick={()=>{this.addStateNumber()}}>点击操作</a>
          </p>
          <div >显示操作次数：{this.state.count}</div>
          <Link to='/index.html'>[Link链接到首页界面]</Link>
          <p>
            <a href="javascript:;" onClick={()=>{
              this.props.dispatch(replace({pathname: '/index.html', detailState: this.state})); // goBack routerActions
            }}>切换到首页界面</a>
          </p>
        </div>

      );
  }
}

function select(store){
	return {
    stateData: store.router.location.state 
	}
}

function actions(dispatch, ownProps){
	return {
		dispatch,
	};
}

module.exports = withRouter(connect(select, actions)(DetailView));
