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
  }
  addStateNumber(){
    this.setState((prevState, props) => {
      return { count: prevState.count + 1};
    })
  }
  render(){
      return (
        <div className="page-detail">
          <h1 className="article-header">项目优化的起承转合</h1>
          
          <article id="post-23791-frame" className="single-content">
            <div id="post-23791" className="post-23791 post type-post status-publish format-standard has-post-thumbnail hentry category-fd tag-qq tag-svip">
                <div className="artical-content">
                    <p>
                        <span style={{color: '#000000'}}>
                            不知道大家有没有这样的经历：当自己负责的产品需求上线一段日子后，发现活跃用户逐渐减少，这时我们不禁疑惑，究竟怎样才能激发用户的持续关注？项目优化不失为好的方法之一。要做项目优化，这不单是运营同学的事情，在设计以及技术实现层面上，我们也应该思考如何给项目带来一个好的方案。每一次的优化探索，都是一段结果未知的旅程。这里举例QQ会员公众号过期提醒项目，和大家聊聊我们的小尝试。
                        </span>
                    </p>
                    <p>
                        <span style={{color: '#000000'}}>
                            起承转合这四个字并不陌生，在设计、音乐、文学等领域上经常会出现。在这里，我也用了“起承转合”来总结整个项目优化过程。
                        </span>
                    </p>
                    <p>
                        <img className="aligncenter size-full wp-image-23792" src="https://isux.tencent.com/wp-content/uploads/2016/12/083929-96004.jpg"
                        alt="step" width="550" height="517" srcSet="https://isux.tencent.com/wp-content/uploads/2016/12/083929-96004.jpg 550w, https://isux.tencent.com/wp-content/uploads/2016/12/083929-96004-310x291.jpg 310w"
                        sizes="(max-width: 550px) 100vw, 550px" />
                        <noscript>
                            &lt;img className="aligncenter size-full wp-image-23792" src="https://isux.tencent.com/wp-content/uploads/2016/12/083929-96004.jpg"
                            alt="step" width="550" height="517" srcSet="https://isux.tencent.com/wp-content/uploads/2016/12/083929-96004.jpg
                            550w, https://isux.tencent.com/wp-content/uploads/2016/12/083929-96004-310x291.jpg
                            310w" sizes="(max-width: 550px) 100vw, 550px" /&gt;
                        </noscript>
                    </p>
                    <h2>
                        一、起
                    </h2>
                    <p>
                        “起”，就是事情的起因。一开始，针对QQ会员/超级会员即将到期或者已经到期的用户，我们会通过公众号信息的形式提醒用户：你的QQ会员已到期。然而，为了提供干净的界面给用户，不带给用户过多的骚扰，今年5月份开始“QQ会员”手Q公众号被收进“服务号”。随之带来的是
                        <strong>
                            手Q公众号催费渠道付费数开始下降。
                        </strong>
                    </p>
                    <p>
                        起初公众号推送模版为纯文字的固定模版，界面如下：
                    </p>
                    <p>
                        <img className="aligncenter size-medium wp-image-23793" src="https://isux.tencent.com/wp-content/uploads/2016/12/084329-12291-590x213.jpg"
                        alt="overdue" width="590" height="213" srcSet="https://isux.tencent.com/wp-content/uploads/2016/12/084329-12291-590x213.jpg 590w, https://isux.tencent.com/wp-content/uploads/2016/12/084329-12291-630x227.jpg 630w, https://isux.tencent.com/wp-content/uploads/2016/12/084329-12291-310x112.jpg 310w, https://isux.tencent.com/wp-content/uploads/2016/12/084329-12291.jpg 640w"
                        sizes="(max-width: 590px) 100vw, 590px" />
                        <noscript>
                            &lt;img className="aligncenter size-medium wp-image-23793" src="https://isux.tencent.com/wp-content/uploads/2016/12/084329-12291-590x213.jpg"
                            alt="overdue" width="590" height="213" srcSet="https://isux.tencent.com/wp-content/uploads/2016/12/084329-12291-590x213.jpg
                            590w, https://isux.tencent.com/wp-content/uploads/2016/12/084329-12291-630x227.jpg
                            630w, https://isux.tencent.com/wp-content/uploads/2016/12/084329-12291-310x112.jpg
                            310w, https://isux.tencent.com/wp-content/uploads/2016/12/084329-12291.jpg
                            640w" sizes="(max-width: 590px) 100vw, 590px" /&gt;
                        </noscript>
                    </p>
                    <p>
                        人都是没有耐心的，这种密密麻麻文字堆积的说明书形式的表现方式，加上本来的一级入口变成了二级入口，用户自然没有欲望点击。
                    </p>
                    <p>
                        交代了背景后，可以看出QQ会员公众号催费项目面临着几个问题：
                    </p>
                    <p style={{paddingLeft: '30px'}}>
                        1. “QQ会员”手Q公众号被收进服务号。
                    </p>
                    <p style={{paddingLeft: '30px'}}>
                        2. 目前的模板形式过于单调。
                    </p>
                    <h2>
                        二、承
                    </h2>
                    <p>
                        针对这些痛点，我们开始构思公众号过期提醒的改版。“承”这一块，主要是描述改版的探索过程。
                    </p>
                    <p>
                        在改版公众号展示方式的构思上，目前有几种方案可以选择：
                    </p>
                    <table>
                        <tbody>
                            <tr style={{height: '28px'}}>
                                <td style={{height: '28px'}}>
                                    解决方式
                                </td>
                                <td style={{height: '28px'}}>
                                    优点
                                </td>
                                <td style={{height: '28px'}}>
                                    缺点
                                </td>
                            </tr>
                            <tr style={{height: '28px', backgroundColor: '#f8f8f8'}}>
                                <td style={{height: '28px'}}>
                                    纯文字模版
                                </td>
                                <td style={{height: '28px'}}>
                                    配置简单
                                </td>
                                <td style={{height: '28px'}}>
                                    说明文般乏味
                                </td>
                            </tr>
                            <tr style={{height: '28px'}}>
                                <td style={{height: '28px'}}>
                                    图文模版
                                </td>
                                <td style={{height: '28px'}}>
                                    比纯文字模版内容丰富
                                </td>
                                <td style={{height: '28px'}}>
                                    平庸单薄
                                </td>
                            </tr>
                            <tr style={{height: '28px', backgroundColor: '#f8f8f8'}}>
                                <td style={{height: '28px'}}>
                                    原生模版
                                </td>
                                <td style={{height: '28px'}}>
                                    体验流畅
                                </td>
                                <td style={{height: '28px'}}>
                                    开发成本大，需要跟版本发布
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <p>
                        显然目前的纯文字模版不足以满足我们的需求，或许用图文模版能带来好转，但两者都不具备灵活的布局和交互，模版比较死板。后来，了解到了在QQ运动、QQ天气的公众号上，他们用到动态模版的展示，动图如下（
                        <span style={{color: '#808080'}}>
                            效果略卡顿与gif格式有关）
                        </span>
                        ：
                        <br />
                        <img className="aligncenter size-full wp-image-23794" src="https://isux.tencent.com/wp-content/uploads/2016/12/085441-24141.gif"
                        alt="qqweather1" width="320" height="569" />
                        <noscript>
                            &lt;img className="aligncenter size-full wp-image-23794" src="https://isux.tencent.com/wp-content/uploads/2016/12/085441-24141.gif"
                            alt="qqweather1" width="320" height="569" /&gt;
                        </noscript>
                        <br />
                        抛开技术实现方式来说，这种图＋文＋动画效果的表现方式，比起传统的公众号消息显然更有趣，并且更有画面感，让人一看就知道表达的信息是晴天还是下雨。于是产品经理在苦恼优化方案的时候，就想把这种展示形式移植到QQ会员公众号过期提醒上效果会怎样呢？尝试着用上这种动态模版，也许会使现状有所扭转。
                    </p>
                    <h3>
                        <strong>
                            构思：
                        </strong>
                    </h3>
                    <p>
                        通过了解，内部的即通开发团队自研的一套 Arkapp 框架，通过用&nbsp;Lua&nbsp;简洁、轻量、可拓展的脚本语言能实现这种动态模版。于是，我们迅速开始了策划－设计－开发－上线等一系列的流程。在开发过程中，也是踩过不少坑。
                    </p>
                    <p>
                        在整个过程中就像打怪一样，一步步击破，推敲出最优的效果。
                    </p>
                    <p>
                        设计师设计的时候，想在设计层面上跟结合会员品牌自身的属性，告诉用户：你要失去尊贵的会员身份了。同时，对于游戏用户在设计侧更有游戏氛围并且赠送游戏礼包来吸引用户。
                    </p>
                    <p>
                        最后，结合我们的需求以及想法，动画上会有一个企鹅＋文字从品牌色变灰的效果，同时底部会放多个礼包，支持点击滑动，在中心区域我们突出重点，显示过期后“80余项特权已失去”，以唤醒用户对QQ会员、超级会员这一身份的认知。
                    </p>
                    <p>
                        在两版设计稿中，通过推敲我们最后采用了第二版设计稿。
                    </p>
                    <h3>
                        <img className="aligncenter size-full wp-image-23795" src="https://isux.tencent.com/wp-content/uploads/2016/12/085935-65078.jpg"
                        alt="demopage2" width="960" height="485" srcSet="https://isux.tencent.com/wp-content/uploads/2016/12/085935-65078.jpg 960w, https://isux.tencent.com/wp-content/uploads/2016/12/085935-65078-590x298.jpg 590w, https://isux.tencent.com/wp-content/uploads/2016/12/085935-65078-768x388.jpg 768w, https://isux.tencent.com/wp-content/uploads/2016/12/085935-65078-630x318.jpg 630w, https://isux.tencent.com/wp-content/uploads/2016/12/085935-65078-770x389.jpg 770w, https://isux.tencent.com/wp-content/uploads/2016/12/085935-65078-310x157.jpg 310w"
                        sizes="(max-width: 960px) 100vw, 960px" />
                        <noscript>
                            &lt;img className="aligncenter size-full wp-image-23795" src="https://isux.tencent.com/wp-content/uploads/2016/12/085935-65078.jpg"
                            alt="demopage2" width="960" height="485" srcSet="https://isux.tencent.com/wp-content/uploads/2016/12/085935-65078.jpg
                            960w, https://isux.tencent.com/wp-content/uploads/2016/12/085935-65078-590x298.jpg
                            590w, https://isux.tencent.com/wp-content/uploads/2016/12/085935-65078-768x388.jpg
                            768w, https://isux.tencent.com/wp-content/uploads/2016/12/085935-65078-630x318.jpg
                            630w, https://isux.tencent.com/wp-content/uploads/2016/12/085935-65078-770x389.jpg
                            770w, https://isux.tencent.com/wp-content/uploads/2016/12/085935-65078-310x157.jpg
                            310w" sizes="(max-width: 960px) 100vw, 960px" /&gt;
                        </noscript>
                        <strong>
                            开发：
                        </strong>
                    </h3>
                    <p>
                        在开发阶段，我们经历了一开始对框架完全不熟悉，得到框架开发团队的帮助以及看着框架 api 自己尝试，开始写效果，做动画。
                    </p>
                    <p>
                        <strong>
                            动画方面
                        </strong>
                        ，针对企鹅由品牌色变灰的效果以及文字变色和数字滚动的效果，我们尝试了流畅度不断优化以及不同实现方法的探索，得到最后相对让人舒服的效果。
                    </p>
                    <p>
                        <strong>
                            性能优化方面
                        </strong>
                        ，一开始我们把效果做出来的时候发现，效果是能够正常显示的，然而打开公众号窗口时，白屏时间太长，系统需要加载各种资源需要的时间太久了，于是我们通过探索经历了一系列的优化：元素加载时间优化，图片资源异步加载优化，减少包大小，达到减少页面白屏时间和增强动画流畅度......
                    </p>
                    <p>
                        最终的效果如下：
                        <br />
                        <iframe src="//v.qq.com/iframe/player.html?vid=c0353ehgq7k&amp;tiny=1&amp;auto=0"
                        width="960" height="746" frameBorder="0" allowFullScreen="allowfullscreen">
                        </iframe>
                    </p>
                    <h2>
                        三、转
                    </h2>
                    <p>
                        如何判断改版优化是否有效？实践过后这个方法是可行还是不可行？“转”在诗文写作结构里是指事件结果的转折。我们要校验改版优化的结果，数据是一个很重要的体现。
                    </p>
                    <p>
                        在手Q会员公众号对到期会员游戏用户实现了动态模版＋游戏礼包引导催费，灰度效果喜人。
                    </p>
                    <p>
                        动态模版付费用户数是文字模版的5.4倍，催费消息点击率和付费转化率都比原本的文字模版有所提升。
                    </p>
                    <p>
                        <img className="aligncenter size-full wp-image-23796" src="https://isux.tencent.com/wp-content/uploads/2016/12/090457-33213.png"
                        alt="data" width="575" height="319" srcSet="https://isux.tencent.com/wp-content/uploads/2016/12/090457-33213.png 575w, https://isux.tencent.com/wp-content/uploads/2016/12/090457-33213-310x172.png 310w"
                        sizes="(max-width: 575px) 100vw, 575px" />
                        <noscript>
                            &lt;img className="aligncenter size-full wp-image-23796" src="https://isux.tencent.com/wp-content/uploads/2016/12/090457-33213.png"
                            alt="data" width="575" height="319" srcSet="https://isux.tencent.com/wp-content/uploads/2016/12/090457-33213.png
                            575w, https://isux.tencent.com/wp-content/uploads/2016/12/090457-33213-310x172.png
                            310w" sizes="(max-width: 575px) 100vw, 575px" /&gt;
                        </noscript>
                    </p>
                    <p>
                        当拿到产品经理给到的数据时，能看到对于这次的尝试虽然量小，但通过探索尝到了初步的甜头。通过对会员里的游戏用户，定制化地推送游戏动态模版，较于纯文本模版来说，在设计与动画展示上营造因为会员到期而特权福利失去的落差感，以及通过推送给用户的游戏礼包挽留，效果明显得到了优化。既然这个方法是有效提高转化率，能够吸引用户的，我们可以继续往深研究，覆盖到更广的面。
                    </p>
                    <h2>
                        四、合
                    </h2>
                    <p>
                        除了针对会员用户里的游戏用户推送带有游戏礼包福利的过期提醒动态模版外，整个公众号催费项目在其他应用场景上尝试用动态模版来实现推送模版优化，使得整个催费体系更加统一化。
                    </p>
                    <p>
                        <img className="aligncenter size-full wp-image-23798" src="https://isux.tencent.com/wp-content/uploads/2016/12/090801-48972.jpg"
                        alt="alldemo" width="650" height="550" srcSet="https://isux.tencent.com/wp-content/uploads/2016/12/090801-48972.jpg 650w, https://isux.tencent.com/wp-content/uploads/2016/12/090801-48972-590x499.jpg 590w, https://isux.tencent.com/wp-content/uploads/2016/12/090801-48972-630x533.jpg 630w, https://isux.tencent.com/wp-content/uploads/2016/12/090801-48972-310x262.jpg 310w"
                        sizes="(max-width: 650px) 100vw, 650px" />
                        <noscript>
                            &lt;img className="aligncenter size-full wp-image-23798" src="https://isux.tencent.com/wp-content/uploads/2016/12/090801-48972.jpg"
                            alt="alldemo" width="650" height="550" srcSet="https://isux.tencent.com/wp-content/uploads/2016/12/090801-48972.jpg
                            650w, https://isux.tencent.com/wp-content/uploads/2016/12/090801-48972-590x499.jpg
                            590w, https://isux.tencent.com/wp-content/uploads/2016/12/090801-48972-630x533.jpg
                            630w, https://isux.tencent.com/wp-content/uploads/2016/12/090801-48972-310x262.jpg
                            310w" sizes="(max-width: 650px) 100vw, 650px" /&gt;
                        </noscript>
                    </p>
                    <p>
                        同时，因为在会员业务上已经初步收到了一些成效，在QQ钱包、游戏中心等其他业务上也开始寻求插入点并开始使用公众号动态模版。
                    </p>
                    <p>
                        在整个项目上我们已经初步收获了一些成果，在接下来的行动里，我们计划：
                    </p>
                    <p style={{paddingLeft: '30px'}}>
                        1. 沉淀归纳开发过程中遇到的问题，组件化代码使之更有复用性，积累经验提供给其他项目使用；
                    </p>
                    <p style={{paddingLeft: '30px'}}>
                        2. 不同的设计方案可能对转化率的影响也不一样，设计多一种方案进行A/B test 并且做好数据校验；
                    </p>
                    <p style={{paddingLeft: '30px'}}>
                        3. 这次项目我们抛开平时十分熟悉的web前端技术，尝试用 Lua 去做动画，可以把经验带到日常工作的其他项目中，预研包括但并不局限于web前端的其他技术，为项目带来更多更大的价值。
                    </p>
                    <p>
                        对于这次的QQ会员公众号过期提醒优化项目，我们通过借鉴优秀的案例，结合自身产品属性进行消化、合理利用并且真正落地校验，在不断的探索中优化。也许这次公众号优化的方法不是最优的，它还存在一些缺点，例如开发成本大，表现形式依然不够新颖等，但整个摸索尝试的过程，到最后得到喜人的数据，正是从0到1之后我们经过思考与探索得来的成果。
                    </p>
                    <p>
                        这个小小的产品优化案例，就是结合了起－承－转－合四大阶段去实现的，这样上下一脉相承，可以帮助我们了解整个方案实现的历程，发现更多的不足再持续优化。引用小马哥的一句话，像“小白”用户那样思考。每天高频使用产品，不断发现不足。未来我们在表现方式、交互形式上还需平时多关注业界动态，把最新的技术落实到业务上，创造不一样的价值。
                    </p>
              </div>
            </div>
            
          </article>
          
          <p>
            <a href="javascript:;" onClick={()=>{this.addStateNumber()}}>点击操作</a>
          </p>
          <div >显示操作次数：{this.state.count}</div>
          <Link to='/index.html'>[Link链接到首页界面]</Link>
          <p>
            <a href="javascript:;" onClick={()=>{
              // this.props.dispatch(push({pathname: '/index.html', state: this.state}));
              // [A location object](https://github.com/ReactTraining/history/blob/v3/docs/Location.md)
              this.props.dispatch(replace({pathname: '/index.html', detailState: this.state})); // goBack routerActions
            }}>切换到首页界面</a>
          </p>
        </div>
      );
  }
}

function select(store/*, ownProps*/){ // 1）第一个参数总是state对象，还可以使用第二个参数，代表容器组件的props对象
								  // 2) 侦听 Store，每当state更新的时候，就会自动执行，重新计算 UI 组件的参数，从而触发 UI 组件的重新渲染。
								  // 3）当使用了 ownProps 作为参数后，如果容器组件的参数发生变化，也会引发 UI 组件重新渲染。
  console.log(store.router.location.pathname, " state->", store.router.location.state);
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
