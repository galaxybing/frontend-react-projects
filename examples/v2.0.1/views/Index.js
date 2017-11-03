import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';

import { Link } from 'react-router-dom';
import { push } from 'react-router-redux';
// import { TweenMax } from 'gsap';// 动画
// 
// var request = require('request');
import { push as basenamePush } from '../../../lib_modules/router-basename';

class IndexView extends Component{
  static contextTypes={
		router: PropTypes.object.isRequired,
	};
  componentDidMount(){
    
  }
  render(){
      return (
          <div className="page-index">
            <h1 className="article-header">欢迎来到后 ASO 时代</h1>
            
            <div className="artical-content">
              <p>
                6 月 WWDC 上所宣布的「App Store 将迎来大改版」的消息，给 ASO 界砸下了一枚重磅炸弹。虽说 iOS11 要到今年秋季才会正式推送，且正式版面世到大面积使用还需要一定时间，到底会不会迎来一个新的 ASO 时代，目前尚不可知。
              </p>
              <img className="w-100 alignnone size-medium wp-image-25556" src="https://isux.tencent.com/static/upload/pics/8/25/201710_JzMu7FMwXyG3mYTLDVYO5.jpg" />
              <p>
                前言导语
              </p>
              <p>
                6 月 WWDC 上所宣布的「App Store 将迎来大改版」的消息，给 ASO 界砸下了一枚重磅炸弹。虽说 iOS11 要到今年秋季才会正式推送，且正式版面世到大面积使用还需要一定时间，到底会不会迎来一个新的 ASO 时代，目前尚不可知。
              </p>
              <p>
                为了做好迎接新时代的准备，咱们先来看看苹果砸下的到底是一枚什么样的「炸弹」。
              </p>
              <h3>搜索改动还算小</h3>
              <p>
                到了 iOS11 之后搜索将会发生哪些变化呢？我们就按照「搜索 -> 应用详情 -> 下载」这条路径来看看。
              </p>
              <p>
                  <img className="alignnone size-medium wp-image-25556" src="https://isux.tencent.com/static/upload/pics/8/25/2017ClYjNT0kxdz6hCzeDeKI9Gxi.png" />
              </p>
              <h3>1. 搜索入口</h3>
              <p>
                搜索入口从右二被挪到到右一的位置
              </p>
              <p>
                热搜词从 10 个降为 7 个
              </p>
              <p>
                虽然官方从未公开过热搜词的筛选算法，但根据长期观察，我们发现热搜词会受到搜索频次、短期下载次数、社会化分享、用户评分评论和苹果人为干涉等影响。
              </p>
              <p>
                可以发现除了苹果人为干涉之外，其他几个影响热搜词的因素都是可控的，所以刷榜或是积分墙依然有存在意义，也将无法杜绝。
              </p>
              <p>
                <img className="alignnone size-medium wp-image-25556" src="https://isux.tencent.com/static/upload/pics/8/25/20170KLLhHm451I5aFfUiCvq7rlm.png" />
              </p>
              <h3>2.  搜索结果</h3>
              <p>
                应用名不折行，「副标题」可能显示不全
              </p>
              <p>
                应用名下方默认展示应用所在的次分类（是的每个应用可以设置主分类和次分类）
              </p>
              <p>
                应用截图展示三张，应用视频可以展示三个
              </p>
              <p>
                目前，为了扩张词库、增加关键词权重，我们所谓的副标题其实是在「应用名称」的位置，用连字符与应用名区分开。从本质上来说“企鹅FM-做电台直播, 听有声书情感音乐广播剧”应该都是算作「应用名称」。在新版搜索结果中设置过副标题的应用名基本显示不全。
              </p>
              <p>
                还好，此次大改版新增了“subtitle”字段（注：后文均用 subtitle 表示苹果规定的副标题，以区分人为设置的副标题），也就是 App Store 的「亲生副标题」。如果设置了，它会出现在应用名称下方，也就是上图中应用次分类的位置。subtitle 对于关键词收录和用户查看应用详情页的可能性都会有影响。它似乎和安卓平台上的一句话简介有了相似的作用。
              </p>
              <p>
                应用截图二变三、视频一变三，换言之，搜索结果中能传达给用户的信息更多了。听起来是个好事，但多不一定是好，也可能是一个坑。虽然系统升级了，但多数用户的硬件并没有升级，要在 iPhone6 或者 iPhone7 的屏幕上多塞入一张截图，就需要运营和视觉把控好传达的信息。画布没有变大，但能承载的信息变多了，也可以算是一种诱惑吧。
              </p>
              <p>
                <img className="alignnone size-medium wp-image-25556" src="https://isux.tencent.com/static/upload/pics/8/25/2017weeE0vsPGMr6R5ZAdiAzcdvE.png" />
              </p>
              <h3>3. 应用详情页</h3>
              <p>
                自然，应用名称显示完整。应用名下方默认显示次分类，有 subtitle 则显示 subtitle
              </p>
              <p>
                What’s new 被放到了第一屏，默认显示前三行
              </p>
              <p>
                应用详情、评分评论和相关应用依次排列在应用截图之后，相关应用推荐甚至到了最后一屏
              </p>
              <p>
                值得注意的是，原来被排在描述之后的What’s new ，在大改版中突然翻身做主，坐到了黄金位置，虽然不知道官方的意图，但这无疑又是一块可运营的空间，值得思考如何将它变成一个拉新工具。
              </p>
              <p>
                其实评分在 What’s new 上方也有，但是用户评论是在第二屏位置。笔者对于描述和用户评论无甚想法，但对被放到了最后一屏的相关应用推荐，就略有担忧。毕竟通过友链还是能引一部分流量的，现在位置被调整到了犄角旮旯，来自于此的流量多少将会受到影响。
              </p>
              <h3>榜单 Jobs 估计都不认识了</h3>
              <p>
                榜单改动虽大，但影响不及搜索。假如幸运地被推荐，很是可以捧着当日新增笑了。
              </p>
              <p>
                <img className="alignnone size-medium wp-image-25556" src="https://isux.tencent.com/static/upload/pics/8/25/2017H9zFg2MnZPilO_QnRYOLz3Ph.png" />
              </p>
              <p>
                1. tab 换血
              </p>
              <p>
                「今天」取代「精品推荐」
              </p>
              <p>
                「游戏」成为与 APP 同级的入口
              </p>
              <p>
                「类别」和「排行榜」不再是一级入口
              </p>
              <p>
                值得一说的是，「游戏」被升级为一个单独的 tab。笔者认为这可能是苹果在平衡 App Store 的公平性和调整营收力度：其他互联网产品的流量和游戏的流量都不在一个量级上，而游戏 App 所带来的营收也不是其他产品可以拍马追上的。
              </p>
              <p>
                <img className="alignnone size-medium wp-image-25556" src="https://isux.tencent.com/static/upload/pics/8/25/2017A_Ecx5TUZ4a4HWODQhPXZhj-.png" />
              </p>
              <p>
                2. 每日更新的「今天」
              </p>
              <p>
                卡片式设计风格
              </p>
              <p>
                庞大的人工编辑团队
              </p>
              <p>
                从原来每周更新到每日更新
              </p>
              <p>
                目前公认的未来最大流量入口就是「今天」，除了推荐 App 之外，还有专题、文章……这不仅仅是一个卖应用更新应用的杂货铺，是要发展成能看电影吃饭的购物商场，将用户更长久地留在 App Store 中。业界对于上推荐位的普遍看法是，如果应用中使用到苹果主推的新技术（比如 AR）或者新 API，那么上推荐位的几率将大大提高。
              </p>
              <p>
                <img className="alignnone size-medium wp-image-25556" src="https://isux.tencent.com/static/upload/pics/8/25/2017b1cl153ynvkb66AihA0el3Ws.png" />
              </p>
              <p>
                3.收归了「类别」和「排行榜」的 「APP」
              </p>
              <p>
                取消「畅销榜」
              </p>
              <p>
                「付费榜」、「免费榜」和「类别」依次在倒数第二屏到最后一屏的位置
              </p>
              <h3>
                「付费榜」和「免费榜」默认展示前三位，可左右滑动或点右上角「查看全部」查看榜单
              </h3>
              <p>
                传言取消畅销榜是因为刷榜太多，规则玩崩了，所以苹果直接取消畅销榜让刷榜没得玩。不过这个事情…笔者认为刷榜公司还是能够找到对策的。
              </p>
              <p>
                对于不刷榜的我们受到更大影响的可能是「类别」的移动，这一举动相当于从一级入口到了三级入口（毕竟是最后一屏）。来自分类的流量将会受到一定影响，所以更要通过把握搜索来挽回损失的流量。
              </p>
              <h3>其他</h3>
              <p>
                除新增的 subtitle 字段之外，App Store 还新增了「宣传文本」字段，限制 170 字，可以随时更改不需要审核。成功提交后，这段文字会出现在应用描述之上，应用截图之下，大概第二屏的位置。通常应用截图在第一屏是无法显示完整的，用户大概率上会看到第二屏，也就很容易看到「宣传文本」。
              </p>
              <p>
                <img className="alignnone size-medium wp-image-25556" src="https://isux.tencent.com/static/upload/pics/8/25/20177_G757GVjCninv2Gn8aJeDDZ.png" />
              </p>
              <p>
                这个新增字段对重运营的产品，可是个好消息。通常一个版本里运营会推好几拨活动，可惜描述不能随时更改，活动也无法同步到 App Store。「宣传文本」的存在，让运营也能在 App Store 都做上文案推广啦。
              </p>
              <h3>总结</h3>
              <p>秋季 iOS11 才会正式推出，到完成市场占有还有挺长一段时间，但 iTunes Connect 已经可以提交这些新字段的内容了，各位 ASOer 做好如何准备准备，相信能够轻松平稳过渡到后 ASO 时代：</p>
              <p>提交新字段「subtitle」，同时兼顾好副标题的展现效果</p>
              <p>可以提供适配三张应用截图/三个应用视频的设计方案</p>
              <p>根据运营节奏更新「宣传文本」字段</p>
              <p>根据运营节奏更新「宣传文本」字段</p>
              <p>笔者认为 App Store 的大改版至少看到了官方的两个态度：打击刷榜；强调营收。最终目的都是调整流量。</p>
              <p>打击刷榜就好比游戏公司不许外挂了，人民币玩家会不爽，但对于从不用外挂的普通玩家而言，目前还算是好消息。</p>
              <p>虽然独立的「游戏」，调整了入口的「类别」和「排行榜」多少都会影响到流量的导向，但新出的 subtitle、「宣传文本」和应用截图展现等等都扩大了运营空间。</p>
              
              <div className="clear">
              </div>
              
              
            </div>
            
            <h2 style={{fontSize: 16, marginBottom: 15}}>路由跳转方式参考：</h2>
            
            <p><a href="http://www.317hu.com/" target="_blank">317护官网链接 - _blank</a></p>
            <p><Link to="/detail.html">标签跳转路由链接 - Link</Link></p>
            <p className=""><a href="javascript:;" onClick={()=>{
              this.context.router.history.push({ pathname: `/list/100153/hospital.html`}); // 会自带将 dispatch history location match 传递给下一个路由组件的 props
              // 
              // basenamePush({ pathname: '/list/100153/hospital.html', props: this.props})(this.context.router.history);
            }}>动态跳转路由链接 - context.router.history-push</a></p>
            <p>
              <a href="javascript:;" onClick={()=>{
                // 支持在 ConnectedRouter 路由封装生效
                this.props.dispatch(push({ pathname: '/hospital-admin/frontend-react-projects/detail.html', state: this.props.detailState}));
              }}>动态跳转链接 - ConnectedRouter-push</a>
            </p>
            <p>
              <a href="javascript:;" onClick={()=>{
                // 用于直接跳转
                // this.props.history.push({ pathname: '/detail.html', state: this.props.detailState});
                this.context.router.history.push({ pathname: '/detail.html', state: this.props.detailState});
                // basenamePush({ pathname: '/detail.html', props: this.props})();
              }}>动态跳转链接 - createHistory()-push</a>
            </p>
            
          </div>
      )
  }
}

function select(store/*, ownProps*/){ // 1）第一个参数总是state对象，还可以使用第二个参数，代表容器组件的props对象
								  // 2) 侦听 Store，每当state更新的时候，就会自动执行，重新计算 UI 组件的参数，从而触发 UI 组件的重新渲染。
								  // 3）当使用了 ownProps 作为参数后，如果容器组件的参数发生变化，也会引发 UI 组件重新渲染。
	return {
    basename: store.config.basename,
    detailState: store.router.location&&store.router.location.detailState
	}
}

function actions(dispatch, ownProps){
	return {
		dispatch
	};
}
module.exports = connect(select, actions)(IndexView);
