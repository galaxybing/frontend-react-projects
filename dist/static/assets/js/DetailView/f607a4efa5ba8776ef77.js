webpackJsonp([1],{1192:function(e,t,n){"use strict";function l(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function c(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function p(e){return{stateData:e.router.location.state}}function u(e,t){return{dispatch:e}}var s=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var l in n)Object.prototype.hasOwnProperty.call(n,l)&&(e[l]=n[l])}return e},o=function(){function e(e,t){for(var n=0;n<t.length;n++){var l=t[n];l.enumerable=l.enumerable||!1,l.configurable=!0,"value"in l&&(l.writable=!0),Object.defineProperty(e,l.key,l)}}return function(t,n,l){return n&&e(t.prototype,n),l&&e(t,l),t}}(),r=n(0),i=function(e){return e&&e.__esModule?e:{default:e}}(r),d=(n(99),n(100)),m=n(218),f=n(217),h=n(101),w=function(e){function t(e){l(this,t);var n=a(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.state=s({count:0},e.stateData),n}return c(t,e),o(t,[{key:"componentDidMount",value:function(){}},{key:"addStateNumber",value:function(){this.setState(function(e,t){return{count:e.count+1}})}},{key:"render",value:function(){var e=this;return i.default.createElement("div",{className:"page-detail"},i.default.createElement("h1",{className:"article-header"},"项目优化的起承转合"),i.default.createElement("article",{id:"post-23791-frame",className:"single-content"},i.default.createElement("div",{id:"post-23791",className:"post-23791 post type-post status-publish format-standard has-post-thumbnail hentry category-fd tag-qq tag-svip"},i.default.createElement("div",{className:"artical-content"},i.default.createElement("p",null,i.default.createElement("span",{style:{color:"#000000"}},"不知道大家有没有这样的经历：当自己负责的产品需求上线一段日子后，发现活跃用户逐渐减少，这时我们不禁疑惑，究竟怎样才能激发用户的持续关注？项目优化不失为好的方法之一。要做项目优化，这不单是运营同学的事情，在设计以及技术实现层面上，我们也应该思考如何给项目带来一个好的方案。每一次的优化探索，都是一段结果未知的旅程。这里举例QQ会员公众号过期提醒项目，和大家聊聊我们的小尝试。")),i.default.createElement("p",null,i.default.createElement("span",{style:{color:"#000000"}},"起承转合这四个字并不陌生，在设计、音乐、文学等领域上经常会出现。在这里，我也用了“起承转合”来总结整个项目优化过程。")),i.default.createElement("p",null,i.default.createElement("img",{className:"aligncenter size-full wp-image-23792",src:"https://isux.tencent.com/wp-content/uploads/2016/12/083929-96004.jpg",alt:"step",width:"550",height:"517",srcSet:"https://isux.tencent.com/wp-content/uploads/2016/12/083929-96004.jpg 550w, https://isux.tencent.com/wp-content/uploads/2016/12/083929-96004-310x291.jpg 310w",sizes:"(max-width: 550px) 100vw, 550px"}),i.default.createElement("noscript",null,'<img className="aligncenter size-full wp-image-23792" src="https://isux.tencent.com/wp-content/uploads/2016/12/083929-96004.jpg" alt="step" width="550" height="517" srcSet="https://isux.tencent.com/wp-content/uploads/2016/12/083929-96004.jpg 550w, https://isux.tencent.com/wp-content/uploads/2016/12/083929-96004-310x291.jpg 310w" sizes="(max-width: 550px) 100vw, 550px" />')),i.default.createElement("h2",null,"一、起"),i.default.createElement("p",null,"“起”，就是事情的起因。一开始，针对QQ会员/超级会员即将到期或者已经到期的用户，我们会通过公众号信息的形式提醒用户：你的QQ会员已到期。然而，为了提供干净的界面给用户，不带给用户过多的骚扰，今年5月份开始“QQ会员”手Q公众号被收进“服务号”。随之带来的是",i.default.createElement("strong",null,"手Q公众号催费渠道付费数开始下降。")),i.default.createElement("p",null,"起初公众号推送模版为纯文字的固定模版，界面如下："),i.default.createElement("p",null,i.default.createElement("img",{className:"aligncenter size-medium wp-image-23793",src:"https://isux.tencent.com/wp-content/uploads/2016/12/084329-12291-590x213.jpg",alt:"overdue",width:"590",height:"213",srcSet:"https://isux.tencent.com/wp-content/uploads/2016/12/084329-12291-590x213.jpg 590w, https://isux.tencent.com/wp-content/uploads/2016/12/084329-12291-630x227.jpg 630w, https://isux.tencent.com/wp-content/uploads/2016/12/084329-12291-310x112.jpg 310w, https://isux.tencent.com/wp-content/uploads/2016/12/084329-12291.jpg 640w",sizes:"(max-width: 590px) 100vw, 590px"}),i.default.createElement("noscript",null,'<img className="aligncenter size-medium wp-image-23793" src="https://isux.tencent.com/wp-content/uploads/2016/12/084329-12291-590x213.jpg" alt="overdue" width="590" height="213" srcSet="https://isux.tencent.com/wp-content/uploads/2016/12/084329-12291-590x213.jpg 590w, https://isux.tencent.com/wp-content/uploads/2016/12/084329-12291-630x227.jpg 630w, https://isux.tencent.com/wp-content/uploads/2016/12/084329-12291-310x112.jpg 310w, https://isux.tencent.com/wp-content/uploads/2016/12/084329-12291.jpg 640w" sizes="(max-width: 590px) 100vw, 590px" />')),i.default.createElement("p",null,"人都是没有耐心的，这种密密麻麻文字堆积的说明书形式的表现方式，加上本来的一级入口变成了二级入口，用户自然没有欲望点击。"),i.default.createElement("p",null,"交代了背景后，可以看出QQ会员公众号催费项目面临着几个问题："),i.default.createElement("p",{style:{paddingLeft:"30px"}},"1. “QQ会员”手Q公众号被收进服务号。"),i.default.createElement("p",{style:{paddingLeft:"30px"}},"2. 目前的模板形式过于单调。"),i.default.createElement("h2",null,"二、承"),i.default.createElement("p",null,"针对这些痛点，我们开始构思公众号过期提醒的改版。“承”这一块，主要是描述改版的探索过程。"),i.default.createElement("p",null,"在改版公众号展示方式的构思上，目前有几种方案可以选择："),i.default.createElement("table",null,i.default.createElement("tbody",null,i.default.createElement("tr",{style:{height:"28px"}},i.default.createElement("td",{style:{height:"28px"}},"解决方式"),i.default.createElement("td",{style:{height:"28px"}},"优点"),i.default.createElement("td",{style:{height:"28px"}},"缺点")),i.default.createElement("tr",{style:{height:"28px",backgroundColor:"#f8f8f8"}},i.default.createElement("td",{style:{height:"28px"}},"纯文字模版"),i.default.createElement("td",{style:{height:"28px"}},"配置简单"),i.default.createElement("td",{style:{height:"28px"}},"说明文般乏味")),i.default.createElement("tr",{style:{height:"28px"}},i.default.createElement("td",{style:{height:"28px"}},"图文模版"),i.default.createElement("td",{style:{height:"28px"}},"比纯文字模版内容丰富"),i.default.createElement("td",{style:{height:"28px"}},"平庸单薄")),i.default.createElement("tr",{style:{height:"28px",backgroundColor:"#f8f8f8"}},i.default.createElement("td",{style:{height:"28px"}},"原生模版"),i.default.createElement("td",{style:{height:"28px"}},"体验流畅"),i.default.createElement("td",{style:{height:"28px"}},"开发成本大，需要跟版本发布")))),i.default.createElement("p",null,"显然目前的纯文字模版不足以满足我们的需求，或许用图文模版能带来好转，但两者都不具备灵活的布局和交互，模版比较死板。后来，了解到了在QQ运动、QQ天气的公众号上，他们用到动态模版的展示，动图如下（",i.default.createElement("span",{style:{color:"#808080"}},"效果略卡顿与gif格式有关）"),"：",i.default.createElement("br",null),i.default.createElement("img",{className:"aligncenter size-full wp-image-23794",src:"https://isux.tencent.com/wp-content/uploads/2016/12/085441-24141.gif",alt:"qqweather1",width:"320",height:"569"}),i.default.createElement("noscript",null,'<img className="aligncenter size-full wp-image-23794" src="https://isux.tencent.com/wp-content/uploads/2016/12/085441-24141.gif" alt="qqweather1" width="320" height="569" />'),i.default.createElement("br",null),"抛开技术实现方式来说，这种图＋文＋动画效果的表现方式，比起传统的公众号消息显然更有趣，并且更有画面感，让人一看就知道表达的信息是晴天还是下雨。于是产品经理在苦恼优化方案的时候，就想把这种展示形式移植到QQ会员公众号过期提醒上效果会怎样呢？尝试着用上这种动态模版，也许会使现状有所扭转。"),i.default.createElement("h3",null,i.default.createElement("strong",null,"构思：")),i.default.createElement("p",null,"通过了解，内部的即通开发团队自研的一套 Arkapp 框架，通过用 Lua 简洁、轻量、可拓展的脚本语言能实现这种动态模版。于是，我们迅速开始了策划－设计－开发－上线等一系列的流程。在开发过程中，也是踩过不少坑。"),i.default.createElement("p",null,"在整个过程中就像打怪一样，一步步击破，推敲出最优的效果。"),i.default.createElement("p",null,"设计师设计的时候，想在设计层面上跟结合会员品牌自身的属性，告诉用户：你要失去尊贵的会员身份了。同时，对于游戏用户在设计侧更有游戏氛围并且赠送游戏礼包来吸引用户。"),i.default.createElement("p",null,"最后，结合我们的需求以及想法，动画上会有一个企鹅＋文字从品牌色变灰的效果，同时底部会放多个礼包，支持点击滑动，在中心区域我们突出重点，显示过期后“80余项特权已失去”，以唤醒用户对QQ会员、超级会员这一身份的认知。"),i.default.createElement("p",null,"在两版设计稿中，通过推敲我们最后采用了第二版设计稿。"),i.default.createElement("h3",null,i.default.createElement("img",{className:"aligncenter size-full wp-image-23795",src:"https://isux.tencent.com/wp-content/uploads/2016/12/085935-65078.jpg",alt:"demopage2",width:"960",height:"485",srcSet:"https://isux.tencent.com/wp-content/uploads/2016/12/085935-65078.jpg 960w, https://isux.tencent.com/wp-content/uploads/2016/12/085935-65078-590x298.jpg 590w, https://isux.tencent.com/wp-content/uploads/2016/12/085935-65078-768x388.jpg 768w, https://isux.tencent.com/wp-content/uploads/2016/12/085935-65078-630x318.jpg 630w, https://isux.tencent.com/wp-content/uploads/2016/12/085935-65078-770x389.jpg 770w, https://isux.tencent.com/wp-content/uploads/2016/12/085935-65078-310x157.jpg 310w",sizes:"(max-width: 960px) 100vw, 960px"}),i.default.createElement("noscript",null,'<img className="aligncenter size-full wp-image-23795" src="https://isux.tencent.com/wp-content/uploads/2016/12/085935-65078.jpg" alt="demopage2" width="960" height="485" srcSet="https://isux.tencent.com/wp-content/uploads/2016/12/085935-65078.jpg 960w, https://isux.tencent.com/wp-content/uploads/2016/12/085935-65078-590x298.jpg 590w, https://isux.tencent.com/wp-content/uploads/2016/12/085935-65078-768x388.jpg 768w, https://isux.tencent.com/wp-content/uploads/2016/12/085935-65078-630x318.jpg 630w, https://isux.tencent.com/wp-content/uploads/2016/12/085935-65078-770x389.jpg 770w, https://isux.tencent.com/wp-content/uploads/2016/12/085935-65078-310x157.jpg 310w" sizes="(max-width: 960px) 100vw, 960px" />'),i.default.createElement("strong",null,"开发：")),i.default.createElement("p",null,"在开发阶段，我们经历了一开始对框架完全不熟悉，得到框架开发团队的帮助以及看着框架 api 自己尝试，开始写效果，做动画。"),i.default.createElement("p",null,i.default.createElement("strong",null,"动画方面"),"，针对企鹅由品牌色变灰的效果以及文字变色和数字滚动的效果，我们尝试了流畅度不断优化以及不同实现方法的探索，得到最后相对让人舒服的效果。"),i.default.createElement("p",null,i.default.createElement("strong",null,"性能优化方面"),"，一开始我们把效果做出来的时候发现，效果是能够正常显示的，然而打开公众号窗口时，白屏时间太长，系统需要加载各种资源需要的时间太久了，于是我们通过探索经历了一系列的优化：元素加载时间优化，图片资源异步加载优化，减少包大小，达到减少页面白屏时间和增强动画流畅度......"),i.default.createElement("p",null,"最终的效果如下：",i.default.createElement("br",null),i.default.createElement("iframe",{src:"//v.qq.com/iframe/player.html?vid=c0353ehgq7k&tiny=1&auto=0",width:"960",height:"746",frameBorder:"0",allowFullScreen:"allowfullscreen"})),i.default.createElement("h2",null,"三、转"),i.default.createElement("p",null,"如何判断改版优化是否有效？实践过后这个方法是可行还是不可行？“转”在诗文写作结构里是指事件结果的转折。我们要校验改版优化的结果，数据是一个很重要的体现。"),i.default.createElement("p",null,"在手Q会员公众号对到期会员游戏用户实现了动态模版＋游戏礼包引导催费，灰度效果喜人。"),i.default.createElement("p",null,"动态模版付费用户数是文字模版的5.4倍，催费消息点击率和付费转化率都比原本的文字模版有所提升。"),i.default.createElement("p",null,i.default.createElement("img",{className:"aligncenter size-full wp-image-23796",src:"https://isux.tencent.com/wp-content/uploads/2016/12/090457-33213.png",alt:"data",width:"575",height:"319",srcSet:"https://isux.tencent.com/wp-content/uploads/2016/12/090457-33213.png 575w, https://isux.tencent.com/wp-content/uploads/2016/12/090457-33213-310x172.png 310w",sizes:"(max-width: 575px) 100vw, 575px"}),i.default.createElement("noscript",null,'<img className="aligncenter size-full wp-image-23796" src="https://isux.tencent.com/wp-content/uploads/2016/12/090457-33213.png" alt="data" width="575" height="319" srcSet="https://isux.tencent.com/wp-content/uploads/2016/12/090457-33213.png 575w, https://isux.tencent.com/wp-content/uploads/2016/12/090457-33213-310x172.png 310w" sizes="(max-width: 575px) 100vw, 575px" />')),i.default.createElement("p",null,"当拿到产品经理给到的数据时，能看到对于这次的尝试虽然量小，但通过探索尝到了初步的甜头。通过对会员里的游戏用户，定制化地推送游戏动态模版，较于纯文本模版来说，在设计与动画展示上营造因为会员到期而特权福利失去的落差感，以及通过推送给用户的游戏礼包挽留，效果明显得到了优化。既然这个方法是有效提高转化率，能够吸引用户的，我们可以继续往深研究，覆盖到更广的面。"),i.default.createElement("h2",null,"四、合"),i.default.createElement("p",null,"除了针对会员用户里的游戏用户推送带有游戏礼包福利的过期提醒动态模版外，整个公众号催费项目在其他应用场景上尝试用动态模版来实现推送模版优化，使得整个催费体系更加统一化。"),i.default.createElement("p",null,i.default.createElement("img",{className:"aligncenter size-full wp-image-23798",src:"https://isux.tencent.com/wp-content/uploads/2016/12/090801-48972.jpg",alt:"alldemo",width:"650",height:"550",srcSet:"https://isux.tencent.com/wp-content/uploads/2016/12/090801-48972.jpg 650w, https://isux.tencent.com/wp-content/uploads/2016/12/090801-48972-590x499.jpg 590w, https://isux.tencent.com/wp-content/uploads/2016/12/090801-48972-630x533.jpg 630w, https://isux.tencent.com/wp-content/uploads/2016/12/090801-48972-310x262.jpg 310w",sizes:"(max-width: 650px) 100vw, 650px"}),i.default.createElement("noscript",null,'<img className="aligncenter size-full wp-image-23798" src="https://isux.tencent.com/wp-content/uploads/2016/12/090801-48972.jpg" alt="alldemo" width="650" height="550" srcSet="https://isux.tencent.com/wp-content/uploads/2016/12/090801-48972.jpg 650w, https://isux.tencent.com/wp-content/uploads/2016/12/090801-48972-590x499.jpg 590w, https://isux.tencent.com/wp-content/uploads/2016/12/090801-48972-630x533.jpg 630w, https://isux.tencent.com/wp-content/uploads/2016/12/090801-48972-310x262.jpg 310w" sizes="(max-width: 650px) 100vw, 650px" />')),i.default.createElement("p",null,"同时，因为在会员业务上已经初步收到了一些成效，在QQ钱包、游戏中心等其他业务上也开始寻求插入点并开始使用公众号动态模版。"),i.default.createElement("p",null,"在整个项目上我们已经初步收获了一些成果，在接下来的行动里，我们计划："),i.default.createElement("p",{style:{paddingLeft:"30px"}},"1. 沉淀归纳开发过程中遇到的问题，组件化代码使之更有复用性，积累经验提供给其他项目使用；"),i.default.createElement("p",{style:{paddingLeft:"30px"}},"2. 不同的设计方案可能对转化率的影响也不一样，设计多一种方案进行A/B test 并且做好数据校验；"),i.default.createElement("p",{style:{paddingLeft:"30px"}},"3. 这次项目我们抛开平时十分熟悉的web前端技术，尝试用 Lua 去做动画，可以把经验带到日常工作的其他项目中，预研包括但并不局限于web前端的其他技术，为项目带来更多更大的价值。"),i.default.createElement("p",null,"对于这次的QQ会员公众号过期提醒优化项目，我们通过借鉴优秀的案例，结合自身产品属性进行消化、合理利用并且真正落地校验，在不断的探索中优化。也许这次公众号优化的方法不是最优的，它还存在一些缺点，例如开发成本大，表现形式依然不够新颖等，但整个摸索尝试的过程，到最后得到喜人的数据，正是从0到1之后我们经过思考与探索得来的成果。"),i.default.createElement("p",null,"这个小小的产品优化案例，就是结合了起－承－转－合四大阶段去实现的，这样上下一脉相承，可以帮助我们了解整个方案实现的历程，发现更多的不足再持续优化。引用小马哥的一句话，像“小白”用户那样思考。每天高频使用产品，不断发现不足。未来我们在表现方式、交互形式上还需平时多关注业界动态，把最新的技术落实到业务上，创造不一样的价值。")))),i.default.createElement("p",null,i.default.createElement("a",{href:"javascript:;",onClick:function(){e.addStateNumber()}},"点击操作")),i.default.createElement("div",null,"显示操作次数：",this.state.count),i.default.createElement(f.Link,{to:"/index.html"},"[Link链接到首页界面]"),i.default.createElement("p",null,i.default.createElement("a",{href:"javascript:;",onClick:function(){e.props.dispatch((0,h.replace)({pathname:"/index.html",detailState:e.state}))}},"切换到首页界面")))}}]),t}(r.Component);e.exports=(0,m.withRouter)((0,d.connect)(p,u)(w))}});