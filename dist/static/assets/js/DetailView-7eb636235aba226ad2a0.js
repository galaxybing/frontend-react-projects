webpackJsonp([1],{311:function(e,t,n){"use strict";function l(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function r(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function u(e){return{stateData:e.router.location.state}}function o(e,t){return{dispatch:e}}var c=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var l in n)Object.prototype.hasOwnProperty.call(n,l)&&(e[l]=n[l])}return e},i=function(){function e(e,t){for(var n=0;n<t.length;n++){var l=t[n];l.enumerable=l.enumerable||!1,l.configurable=!0,"value"in l&&(l.writable=!0),Object.defineProperty(e,l.key,l)}}return function(t,n,l){return n&&e(t.prototype,n),l&&e(t,l),t}}(),f=n(3),p=function(e){return e&&e.__esModule?e:{default:e}}(f),s=(n(39),n(29)),d=n(7),m=n(65),h=n(30),E=function(e){function t(e){l(this,t);var n=a(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.state=c({count:0},e.stateData),n}return r(t,e),i(t,[{key:"componentDidMount",value:function(){}},{key:"addStateNumber",value:function(){this.setState(function(e,t){return{count:e.count+1}})}},{key:"render",value:function(){var e=this;return p.default.createElement("div",{style:{textAlign:"center"}},p.default.createElement("h1",null,"企鹅TALK | PHP机器学习与智能推荐系统设计探讨"),p.default.createElement("p",null,"作为近期人工智能领域的热点话题一直在引发广泛讨论，而“学会如何去学习以及保持对新技术的追求”被认为是程序员朋友应具备的良好习惯，不过对于在不断寻求进阶的程序员朋友们，除了看书刷题听课，我们还需要更多的交流与探讨"),p.default.createElement("img",{src:"http://image.135editor.com/files/users/106/1063211/201707/LzzwZEFk_wYUv.jpg",title:"公众号：900×500.jpg",alt:"公众号：900×500.jpg"}),p.default.createElement("p",null,"企鹅Talk针对初创企业各部门人员精简、内部交流相对缺乏情况，就产品、设计、人事、运营等不同岗位人才量身打造职业进阶方案，通过多种形式的分享交流，从知识、技能、资源、人脉等多方面助力人才发展，在服务腾讯众创空间入驻团队的同时帮助更多职场新人成长。"),p.default.createElement("p",null,"在这里，你可以听到大牛的案例分析，也可以分享你工作中遇到的困惑，我们聚在一起，去交流、去成长。"),p.default.createElement("h2",null,"现场你可以碰到 Ta 们"),p.default.createElement("p",null,p.default.createElement("img",{src:"http://juzhen-10015292.cos.myqcloud.com/public/upload/20170726/201707261947299633691501069649.jpg"})),p.default.createElement("p",null,p.default.createElement("img",{src:"http://juzhen-10015292.cos.myqcloud.com/public/upload/20170726/201707261914009234551501067640.jpg"})),p.default.createElement("p",null,"8月3日周四晚 19:00-21:00 "),p.default.createElement("p",null,"腾讯众创空间（杭州）活动室"),p.default.createElement("p",null,"文二西路738号西溪乐谷2号楼2楼"),p.default.createElement("p",null,"破冰+嘉宾分享+自由提问+场景题讨论"),p.default.createElement("div",null,"*活动限制20人，工作人员将以报名页您的提问为参考进行筛选，请务必认真填写问题。"),p.default.createElement("p",null,p.default.createElement("a",{href:"javascript:;",onClick:function(){e.addStateNumber()}},"点击操作")),p.default.createElement("div",null,"显示操作次数：",this.state.count),p.default.createElement(m.Link,{to:"/index.html"},"[Link链接到首页界面]"),p.default.createElement("p",null,p.default.createElement("a",{href:"javascript:;",onClick:function(){e.props.dispatch((0,h.replace)({pathname:"/index.html",detailState:e.state}))}},"切换到首页界面")))}}]),t}(f.Component);e.exports=(0,d.withRouter)((0,s.connect)(u,o)(E))}});