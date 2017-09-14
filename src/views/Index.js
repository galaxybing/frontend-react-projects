import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Link } from 'react-router-dom';
import { push } from 'react-router-redux';
// import { TweenMax } from 'gsap';// 动画
// 
// var request = require('request');

class IndexView extends Component{
  static contextTypes={
		router: React.PropTypes.object.isRequired,
	};
  toPageList(){
    var loc = this.context.router.history;
    loc.push({ pathname: `/list/100153/hospital.html`});
    
  }
  componentDidMount(){
  }
  render(){
      return (
          <div className="page-index">
            <h1 className="article-header">可视化系统搭建</h1>
            
            <div className="artical-content">
              <p>
                  如何搭建数据可视化系统，用丰富的设计语言清晰表达复杂和庞大数据，并形成鲜明的设计风格？我们把数据可视化的元素进行拆分并建立相应的规范体系。
              </p>
              <h3>
                  图表设计
              </h3>
              <p>
                  <strong>
                      1.
                  </strong>
                  <strong>
                      图表基本类型
                  </strong>
              </p>
              <p>
                  六种基本图表涵盖了大部分图表使用场景，也是做数据可视化最常用的图表类型：
              </p>
              <p>
                  <strong>
                      柱状图
                  </strong>
                  &nbsp; 分类照片照片什么照片什么什么项目之间的比较;
              </p>
              <p>
                  <strong>
                      饼图
                  </strong>
                  &nbsp; 构成即部分占总体的比例;
              </p>
              <p>
                  <strong>
                      折线图
                  </strong>
                  &nbsp; &nbsp;随时间变化的趋势;
              </p>
              <p>
                  <strong>
                      条形图
                  </strong>
                  &nbsp; 分类照片照片什么照片什么什么项目之间的比较;
              </p>
              <p>
                  <strong>
                      散点图
                  </strong>
                  &nbsp; 相关性或分布关系;
              </p>
              <p>
                  <strong>
                      地图
                  </strong>
                  &nbsp; 区域之间的分类照片照片什么照片什么什么比较。
              </p>
              <p>
                  基本图表类型都有通用的样式，不过多的展开讲解我们更多的考虑如何选择常用图表来呈现数据，达到数据可视化的目标基本方法：
              </p>
              <p>
                  <img className="alignnone size-medium wp-image-25556" src="https://isux.tencent.com/wp-content/uploads/2017/07/060507-46299-590x128.png"
                  alt="" width="590" height="128" srcSet="https://isux.tencent.com/wp-content/uploads/2017/07/060507-46299-590x128.png 590w, https://isux.tencent.com/wp-content/uploads/2017/07/060507-46299-768x166.png 768w, https://isux.tencent.com/wp-content/uploads/2017/07/060507-46299-630x137.png 630w, https://isux.tencent.com/wp-content/uploads/2017/07/060507-46299-770x167.png 770w, https://isux.tencent.com/wp-content/uploads/2017/07/060507-46299-310x67.png 310w, https://isux.tencent.com/wp-content/uploads/2017/07/060507-46299.png 960w"
                  sizes="(max-width: 590px) 100vw, 590px" />
                  <noscript>
                      &lt;img className="alignnone size-medium wp-image-25556" src="https://isux.tencent.com/wp-content/uploads/2017/07/060507-46299-590x128.png"
                      alt="" width="590" height="128" srcSet="https://isux.tencent.com/wp-content/uploads/2017/07/060507-46299-590x128.png
                      590w, https://isux.tencent.com/wp-content/uploads/2017/07/060507-46299-768x166.png
                      768w, https://isux.tencent.com/wp-content/uploads/2017/07/060507-46299-630x137.png
                      630w, https://isux.tencent.com/wp-content/uploads/2017/07/060507-46299-770x167.png
                      770w, https://isux.tencent.com/wp-content/uploads/2017/07/060507-46299-310x67.png
                      310w, https://isux.tencent.com/wp-content/uploads/2017/07/060507-46299.png
                      960w" sizes="(max-width: 590px) 100vw, 590px" /&gt;
                  </noscript>
              </p>
              <p>
                  a.明确目标
              </p>
              <p>
                  明确数据可视化的目标，通过数据可视化我们要解决什么样的问题，需要探索什么内容或陈述什么事实。
              </p>
              <p>
                  b.选择图形
              </p>
              <p>
                  围绕目标找到能提供信息的指标或者数据，选择合适的图形去展示需要可视化的数据。
              </p>
              <p>
                  Andrew Abela整理的图表类型选择指南图示，将图表展示的关系分为四类：
              </p>
              <p>
                  <img className="alignnone size-medium wp-image-25571" src="https://isux.tencent.com/wp-content/uploads/2017/07/063056-39119-590x440.png"
                  alt="" width="590" height="440" srcSet="https://isux.tencent.com/wp-content/uploads/2017/07/063056-39119-590x440.png 590w, https://isux.tencent.com/wp-content/uploads/2017/07/063056-39119-768x573.png 768w, https://isux.tencent.com/wp-content/uploads/2017/07/063056-39119-630x470.png 630w, https://isux.tencent.com/wp-content/uploads/2017/07/063056-39119-770x574.png 770w, https://isux.tencent.com/wp-content/uploads/2017/07/063056-39119-310x231.png 310w, https://isux.tencent.com/wp-content/uploads/2017/07/063056-39119.png 924w"
                  sizes="(max-width: 590px) 100vw, 590px" />
                  <noscript>
                      &lt;img className="alignnone size-medium wp-image-25571" src="https://isux.tencent.com/wp-content/uploads/2017/07/063056-39119-590x440.png"
                      alt="" width="590" height="440" srcSet="https://isux.tencent.com/wp-content/uploads/2017/07/063056-39119-590x440.png
                      590w, https://isux.tencent.com/wp-content/uploads/2017/07/063056-39119-768x573.png
                      768w, https://isux.tencent.com/wp-content/uploads/2017/07/063056-39119-630x470.png
                      630w, https://isux.tencent.com/wp-content/uploads/2017/07/063056-39119-770x574.png
                      770w, https://isux.tencent.com/wp-content/uploads/2017/07/063056-39119-310x231.png
                      310w, https://isux.tencent.com/wp-content/uploads/2017/07/063056-39119.png
                      924w" sizes="(max-width: 590px) 100vw, 590px" /&gt;
                  </noscript>
              </p>
              <p>
                  c.选择维度
              </p>
              <p>
                  分辨哪些是有价值的值得关注的维度，选择数据展示的视角。基本图表一般有哪些可用维度呢？
              </p>
              <p>
                  <img className="alignnone size-medium wp-image-25572" src="https://isux.tencent.com/wp-content/uploads/2017/07/063057-44549-590x277.jpg"
                  alt="" width="590" height="277" srcSet="https://isux.tencent.com/wp-content/uploads/2017/07/063057-44549-590x277.jpg 590w, https://isux.tencent.com/wp-content/uploads/2017/07/063057-44549-768x360.jpg 768w, https://isux.tencent.com/wp-content/uploads/2017/07/063057-44549-630x295.jpg 630w, https://isux.tencent.com/wp-content/uploads/2017/07/063057-44549-770x361.jpg 770w, https://isux.tencent.com/wp-content/uploads/2017/07/063057-44549-310x145.jpg 310w, https://isux.tencent.com/wp-content/uploads/2017/07/063057-44549.jpg 960w"
                  sizes="(max-width: 590px) 100vw, 590px" />
                  <noscript>
                      &lt;img className="alignnone size-medium wp-image-25572" src="https://isux.tencent.com/wp-content/uploads/2017/07/063057-44549-590x277.jpg"
                      alt="" width="590" height="277" srcSet="https://isux.tencent.com/wp-content/uploads/2017/07/063057-44549-590x277.jpg
                      590w, https://isux.tencent.com/wp-content/uploads/2017/07/063057-44549-768x360.jpg
                      768w, https://isux.tencent.com/wp-content/uploads/2017/07/063057-44549-630x295.jpg
                      630w, https://isux.tencent.com/wp-content/uploads/2017/07/063057-44549-770x361.jpg
                      770w, https://isux.tencent.com/wp-content/uploads/2017/07/063057-44549-310x145.jpg
                      310w, https://isux.tencent.com/wp-content/uploads/2017/07/063057-44549.jpg
                      960w" sizes="(max-width: 590px) 100vw, 590px" /&gt;
                  </noscript>
              </p>
              <p style={{textAlign: 'center'}}>
                  <em>
                      基本图表维度
                  </em>
              </p>
              <p>
                  对照以上图形维度，制作可视化图形。
              </p>
              <p>
                  d.突出关键信息
              </p>
              <p>
                  根据可视化展示目标，将重要信息添加辅助线或更改颜色等手段，进行信息的凸显，将用户的注意力引向关键信息，帮助用户理解数据意义。
              </p>
              <p>
                  <img className="alignnone size-medium wp-image-25567" src="https://isux.tencent.com/wp-content/uploads/2017/07/063051-2569-590x277.jpg"
                  alt="" width="590" height="277" srcSet="https://isux.tencent.com/wp-content/uploads/2017/07/063051-2569-590x277.jpg 590w, https://isux.tencent.com/wp-content/uploads/2017/07/063051-2569-768x360.jpg 768w, https://isux.tencent.com/wp-content/uploads/2017/07/063051-2569-630x295.jpg 630w, https://isux.tencent.com/wp-content/uploads/2017/07/063051-2569-770x361.jpg 770w, https://isux.tencent.com/wp-content/uploads/2017/07/063051-2569-310x145.jpg 310w, https://isux.tencent.com/wp-content/uploads/2017/07/063051-2569.jpg 960w"
                  sizes="(max-width: 590px) 100vw, 590px" />
                  <noscript>
                      &lt;img className="alignnone size-medium wp-image-25567" src="https://isux.tencent.com/wp-content/uploads/2017/07/063051-2569-590x277.jpg"
                      alt="" width="590" height="277" srcSet="https://isux.tencent.com/wp-content/uploads/2017/07/063051-2569-590x277.jpg
                      590w, https://isux.tencent.com/wp-content/uploads/2017/07/063051-2569-768x360.jpg
                      768w, https://isux.tencent.com/wp-content/uploads/2017/07/063051-2569-630x295.jpg
                      630w, https://isux.tencent.com/wp-content/uploads/2017/07/063051-2569-770x361.jpg
                      770w, https://isux.tencent.com/wp-content/uploads/2017/07/063051-2569-310x145.jpg
                      310w, https://isux.tencent.com/wp-content/uploads/2017/07/063051-2569.jpg
                      960w" sizes="(max-width: 590px) 100vw, 590px" /&gt;
                  </noscript>
              </p>
              <p style={{textAlign: 'center'}}>
                  <em>
                      CPU监控
                  </em>
              </p>
              <p>
                  CPU使用率监控案例，可视化的目标就是检测CPU的使用情况，特别是异常使用情况。所以图中将100％最高临界线使用特殊的颜色和线形标识出来，异常的使用段用颜色帮助用户识别。
              </p>
              <p>
                  <strong>
                      2.
                  </strong>
                  <strong>
                      图表排布
                  </strong>
              </p>
              <p>
                  在可视化展示中，往往有多组数据进行展示。通过信息的构图来突出重点，在主信息图和次信息图之间的排布和大小比例上进行调整，明确信息层级及信息流向，使用户获取重要信息的同时达到视觉平衡。以扶贫展示项目为例，以地图的方式展示出扶贫的概况信息，两边排布扶贫的具体内容信息，在构图和上突出主次。并在主要信息的背景上做动画处理，进一步加强信息层级及视觉流向的引导。
              </p>
              <p>
                  <img className="alignnone size-medium wp-image-25566" src="https://isux.tencent.com/wp-content/uploads/2017/07/063050-89901-590x332.jpg"
                  alt="" width="590" height="332" srcSet="https://isux.tencent.com/wp-content/uploads/2017/07/063050-89901-590x332.jpg 590w, https://isux.tencent.com/wp-content/uploads/2017/07/063050-89901-768x432.jpg 768w, https://isux.tencent.com/wp-content/uploads/2017/07/063050-89901-630x354.jpg 630w, https://isux.tencent.com/wp-content/uploads/2017/07/063050-89901-770x433.jpg 770w, https://isux.tencent.com/wp-content/uploads/2017/07/063050-89901-310x174.jpg 310w"
                  sizes="(max-width: 590px) 100vw, 590px" />
                  <noscript>
                      &lt;img className="alignnone size-medium wp-image-25566" src="https://isux.tencent.com/wp-content/uploads/2017/07/063050-89901-590x332.jpg"
                      alt="" width="590" height="332" srcSet="https://isux.tencent.com/wp-content/uploads/2017/07/063050-89901-590x332.jpg
                      590w, https://isux.tencent.com/wp-content/uploads/2017/07/063050-89901-768x432.jpg
                      768w, https://isux.tencent.com/wp-content/uploads/2017/07/063050-89901-630x354.jpg
                      630w, https://isux.tencent.com/wp-content/uploads/2017/07/063050-89901-770x433.jpg
                      770w, https://isux.tencent.com/wp-content/uploads/2017/07/063050-89901-310x174.jpg
                      310w" sizes="(max-width: 590px) 100vw, 590px" /&gt;
                  </noscript>
              </p>
              <p style={{textAlign: 'center'}}>
                  <em>
                      扶贫项目
                  </em>
              </p>
              <p>
                  <strong>
                      3.
                  </strong>
                  <strong>
                      动效设计
                  </strong>
              </p>
              <p>
                  目前越来越多的可视化展示的数据都是实时的，所以动效在可视化项目中的应用越来越广泛，动效设计肩负着承载更多信息和丰富画面效果的重要作用。
              </p>
              <p>
                  a.信息承载
              </p>
              <p>
                  在可视化设计中经常遇到，非常多的数据信息需要展示在一个大屏幕上。遇到这种情况，需要对信息进行合并整理或通过动画的方式，在有限的屏幕空间里承载更多的信息，使信息更加聚合，同时使信息展示更加清晰，突出重点。
              </p>
              <p>
                  b.画面效果
              </p>
              <p>
                  增加细节及空间感，背景动效使画面更加丰富。单个图表的出场动画，使画面平衡而流畅。减少了图表在出现或数据变化时的生硬刻板。
              </p>
              <p>
                  数据可视化动画在设计上重要的原则是恰当的展示数据。动画要尽量的简单，复杂的动画会导致用户对数据的理解错。动画要使用户可预期，可使用多次重复动画，让用户看到动画从哪里开始到哪里停止。
              </p>
              <h3>
                  配色方案
              </h3>
              <p>
                  由于图表的特殊性，数据可视化的配色方案和配色要求具有独特性。配色方案要充分考虑到特殊人群对数据图的可读性。丰富的色系，至少6种才可满足图表应用的各种场景。同时配色需要有可辨识性，色彩选择需要有跨度。
              </p>
              <p>
                  <strong>
                      1.
                  </strong>
                  <strong>
                      背景色定义
                  </strong>
              </p>
              <p>
                  背景色的选择与可视化展示的设备相关，分为深色、浅色、彩色。
              </p>
              <p>
                  a.大屏背景色
              </p>
              <p>
                  在大屏设备中普遍用深色作为背景色，以减少屏幕拖尾，观众在视觉上也不会觉得刺眼。所有图表的配色需要以深色背景为基础。保证可视化图的清晰辨识度，色调与明度变化需要有跨度。
              </p>
              <p>
                  <img className="alignnone size-medium wp-image-25570" src="https://isux.tencent.com/wp-content/uploads/2017/07/063054-41166-590x442.png"
                  alt="" width="590" height="442" srcSet="https://isux.tencent.com/wp-content/uploads/2017/07/063054-41166-590x442.png 590w, https://isux.tencent.com/wp-content/uploads/2017/07/063054-41166.png 630w, https://isux.tencent.com/wp-content/uploads/2017/07/063054-41166-310x232.png 310w"
                  sizes="(max-width: 590px) 100vw, 590px" />
                  <noscript>
                      &lt;img className="alignnone size-medium wp-image-25570" src="https://isux.tencent.com/wp-content/uploads/2017/07/063054-41166-590x442.png"
                      alt="" width="590" height="442" srcSet="https://isux.tencent.com/wp-content/uploads/2017/07/063054-41166-590x442.png
                      590w, https://isux.tencent.com/wp-content/uploads/2017/07/063054-41166.png
                      630w, https://isux.tencent.com/wp-content/uploads/2017/07/063054-41166-310x232.png
                      310w" sizes="(max-width: 590px) 100vw, 590px" /&gt;
                  </noscript>
              </p>
              <p style={{textAlign: 'center'}}>
                  <em>
                      淘宝双11大屏设计
                  </em>
              </p>
              <p>
                  b.中小屏背景色
              </p>
              <p>
                  中小屏幕背景色选择范围就比较广，浅色、彩色、深色均可以做出很好的设计。相比之下，浅色背景更适合展示大量的数据信息，因为在浅色底上数据图表的识别度比较高。而深色、彩色背景更适合渲染简单的数据，用于烘托气氛。
              </p>
              <p>
                  <img className="alignnone size-medium wp-image-25574" src="https://isux.tencent.com/wp-content/uploads/2017/07/063059-96630-590x362.jpg"
                  alt="" width="590" height="362" srcSet="https://isux.tencent.com/wp-content/uploads/2017/07/063059-96630-590x362.jpg 590w, https://isux.tencent.com/wp-content/uploads/2017/07/063059-96630-768x471.jpg 768w, https://isux.tencent.com/wp-content/uploads/2017/07/063059-96630-630x387.jpg 630w, https://isux.tencent.com/wp-content/uploads/2017/07/063059-96630-770x472.jpg 770w, https://isux.tencent.com/wp-content/uploads/2017/07/063059-96630-310x190.jpg 310w, https://isux.tencent.com/wp-content/uploads/2017/07/063059-96630.jpg 960w"
                  sizes="(max-width: 590px) 100vw, 590px" />
                  <noscript>
                      &lt;img className="alignnone size-medium wp-image-25574" src="https://isux.tencent.com/wp-content/uploads/2017/07/063059-96630-590x362.jpg"
                      alt="" width="590" height="362" srcSet="https://isux.tencent.com/wp-content/uploads/2017/07/063059-96630-590x362.jpg
                      590w, https://isux.tencent.com/wp-content/uploads/2017/07/063059-96630-768x471.jpg
                      768w, https://isux.tencent.com/wp-content/uploads/2017/07/063059-96630-630x387.jpg
                      630w, https://isux.tencent.com/wp-content/uploads/2017/07/063059-96630-770x472.jpg
                      770w, https://isux.tencent.com/wp-content/uploads/2017/07/063059-96630-310x190.jpg
                      310w, https://isux.tencent.com/wp-content/uploads/2017/07/063059-96630.jpg
                      960w" sizes="(max-width: 590px) 100vw, 590px" /&gt;
                  </noscript>
              </p>
              <p style={{textAlign: 'center'}}>
                  <em>
                      中小屏幕浅色，深色，彩色设计
                  </em>
              </p>
              <p>
                  <strong>
                      2.
                  </strong>
                  <strong>
                      图表色定义
                  </strong>
              </p>
              <p>
                  在图表的颜色运用上，色彩是最直接的信息表达的方式，往往比图形和文字更加直观的传递信息，不同颜色的的组合也能体现数据的逻辑关系。颜色的表示方法有很多种，如RGB、CMYK等，在可视化设计中，颜色作为用于数据编码的视觉通道，HSV的颜色表示方式更加符合人类感知方式，同时也更加适合展示数据。
              </p>
              <p>
                  a.色彩辨识度
              </p>
              <p>
                  要确保配色非常容易辨识与区分，对于使用单一色相配色，明度差异需要全局考虑，明度跨度一定要够大才能更清晰的展示数据。明度跨度是否合适，可以通过在灰度模式下配色的辨识度来判断。
              </p>
              <p>
                  <img className="alignnone size-medium wp-image-25565" src="https://isux.tencent.com/wp-content/uploads/2017/07/063048-76657-590x738.jpg"
                  alt="" width="590" height="738" srcSet="https://isux.tencent.com/wp-content/uploads/2017/07/063048-76657-590x738.jpg 590w, https://isux.tencent.com/wp-content/uploads/2017/07/063048-76657-768x960.jpg 768w, https://isux.tencent.com/wp-content/uploads/2017/07/063048-76657-630x788.jpg 630w, https://isux.tencent.com/wp-content/uploads/2017/07/063048-76657-770x963.jpg 770w, https://isux.tencent.com/wp-content/uploads/2017/07/063048-76657-310x388.jpg 310w, https://isux.tencent.com/wp-content/uploads/2017/07/063048-76657.jpg 960w"
                  sizes="(max-width: 590px) 100vw, 590px" />
                  <noscript>
                      &lt;img className="alignnone size-medium wp-image-25565" src="https://isux.tencent.com/wp-content/uploads/2017/07/063048-76657-590x738.jpg"
                      alt="" width="590" height="738" srcSet="https://isux.tencent.com/wp-content/uploads/2017/07/063048-76657-590x738.jpg
                      590w, https://isux.tencent.com/wp-content/uploads/2017/07/063048-76657-768x960.jpg
                      768w, https://isux.tencent.com/wp-content/uploads/2017/07/063048-76657-630x788.jpg
                      630w, https://isux.tencent.com/wp-content/uploads/2017/07/063048-76657-770x963.jpg
                      770w, https://isux.tencent.com/wp-content/uploads/2017/07/063048-76657-310x388.jpg
                      310w, https://isux.tencent.com/wp-content/uploads/2017/07/063048-76657.jpg
                      960w" sizes="(max-width: 590px) 100vw, 590px" /&gt;
                  </noscript>
              </p>
              <p>
                  b.色彩跨度
              </p>
              <p>
                  多色相配色在数据可视化中是相当常见的，多色相配色使用户容易将数据与图像联系起来。如何有效利用色调的变化来传达数据信息？
              </p>
              <p>
                  <img className="alignnone size-medium wp-image-25569" src="https://isux.tencent.com/wp-content/uploads/2017/07/063053-49081-590x430.jpg"
                  alt="" width="590" height="430" srcSet="https://isux.tencent.com/wp-content/uploads/2017/07/063053-49081-590x430.jpg 590w, https://isux.tencent.com/wp-content/uploads/2017/07/063053-49081-768x560.jpg 768w, https://isux.tencent.com/wp-content/uploads/2017/07/063053-49081-630x459.jpg 630w, https://isux.tencent.com/wp-content/uploads/2017/07/063053-49081-770x561.jpg 770w, https://isux.tencent.com/wp-content/uploads/2017/07/063053-49081-310x226.jpg 310w, https://isux.tencent.com/wp-content/uploads/2017/07/063053-49081.jpg 960w"
                  sizes="(max-width: 590px) 100vw, 590px" />
                  <noscript>
                      &lt;img className="alignnone size-medium wp-image-25569" src="https://isux.tencent.com/wp-content/uploads/2017/07/063053-49081-590x430.jpg"
                      alt="" width="590" height="430" srcSet="https://isux.tencent.com/wp-content/uploads/2017/07/063053-49081-590x430.jpg
                      590w, https://isux.tencent.com/wp-content/uploads/2017/07/063053-49081-768x560.jpg
                      768w, https://isux.tencent.com/wp-content/uploads/2017/07/063053-49081-630x459.jpg
                      630w, https://isux.tencent.com/wp-content/uploads/2017/07/063053-49081-770x561.jpg
                      770w, https://isux.tencent.com/wp-content/uploads/2017/07/063053-49081-310x226.jpg
                      310w, https://isux.tencent.com/wp-content/uploads/2017/07/063053-49081.jpg
                      960w" sizes="(max-width: 590px) 100vw, 590px" /&gt;
                  </noscript>
              </p>
              <p style={{textAlign: 'center'}}>
                  <em>
                      带明度信息的色环
                  </em>
              </p>
              <p>
                  当需要的颜色较少时，避免使用相近的色相同类色和相近色。尽量选择对比色或互补色，这样可以使不同属性数据在图表中展示更加清晰。
              </p>
              <p>
                  例如：美国大选使用红色和蓝色两种对比色，将清晰的将选票结果展示于地图上。
              </p>
              <p>
                  <img className="alignnone size-medium wp-image-25576" src="https://isux.tencent.com/wp-content/uploads/2017/07/063919-63123-590x524.jpg"
                  alt="" width="590" height="524" srcSet="https://isux.tencent.com/wp-content/uploads/2017/07/063919-63123-590x524.jpg 590w, https://isux.tencent.com/wp-content/uploads/2017/07/063919-63123-768x682.jpg 768w, https://isux.tencent.com/wp-content/uploads/2017/07/063919-63123-630x560.jpg 630w, https://isux.tencent.com/wp-content/uploads/2017/07/063919-63123-770x684.jpg 770w, https://isux.tencent.com/wp-content/uploads/2017/07/063919-63123-310x275.jpg 310w, https://isux.tencent.com/wp-content/uploads/2017/07/063919-63123.jpg 960w"
                  sizes="(max-width: 590px) 100vw, 590px" />
                  <noscript>
                      &lt;img className="alignnone size-medium wp-image-25576" src="https://isux.tencent.com/wp-content/uploads/2017/07/063919-63123-590x524.jpg"
                      alt="" width="590" height="524" srcSet="https://isux.tencent.com/wp-content/uploads/2017/07/063919-63123-590x524.jpg
                      590w, https://isux.tencent.com/wp-content/uploads/2017/07/063919-63123-768x682.jpg
                      768w, https://isux.tencent.com/wp-content/uploads/2017/07/063919-63123-630x560.jpg
                      630w, https://isux.tencent.com/wp-content/uploads/2017/07/063919-63123-770x684.jpg
                      770w, https://isux.tencent.com/wp-content/uploads/2017/07/063919-63123-310x275.jpg
                      310w, https://isux.tencent.com/wp-content/uploads/2017/07/063919-63123.jpg
                      960w" sizes="(max-width: 590px) 100vw, 590px" /&gt;
                  </noscript>
              </p>
              <p style={{textAlign: 'center'}}>
                  <em>
                      美国大选图
                  </em>
              </p>
              <p>
                  当图表需要的颜色较多时，建议最多不超过12种色相。通常情况下人在不连续的区域内可以分辨6〜12种不同色相。过多的颜色对传达数据是没有作用的，反而会让人产生迷惑如何让多种色相的颜色看来和谐有几种取色的方法？
              </p>
              <p>
                  色环提取法：
              </p>
              <p>
                  选择同一饱和度和明度的不同色调作为可视化图表的配色，这样可以使图表看起来协调统一。
              </p>
              <p>
                  <img className="alignnone size-medium wp-image-25575" src="https://isux.tencent.com/wp-content/uploads/2017/07/063100-37693-590x430.jpg"
                  alt="" width="590" height="430" srcSet="https://isux.tencent.com/wp-content/uploads/2017/07/063100-37693-590x430.jpg 590w, https://isux.tencent.com/wp-content/uploads/2017/07/063100-37693-768x560.jpg 768w, https://isux.tencent.com/wp-content/uploads/2017/07/063100-37693-630x459.jpg 630w, https://isux.tencent.com/wp-content/uploads/2017/07/063100-37693-770x561.jpg 770w, https://isux.tencent.com/wp-content/uploads/2017/07/063100-37693-310x226.jpg 310w, https://isux.tencent.com/wp-content/uploads/2017/07/063100-37693.jpg 960w"
                  sizes="(max-width: 590px) 100vw, 590px" />
                  <noscript>
                      &lt;img className="alignnone size-medium wp-image-25575" src="https://isux.tencent.com/wp-content/uploads/2017/07/063100-37693-590x430.jpg"
                      alt="" width="590" height="430" srcSet="https://isux.tencent.com/wp-content/uploads/2017/07/063100-37693-590x430.jpg
                      590w, https://isux.tencent.com/wp-content/uploads/2017/07/063100-37693-768x560.jpg
                      768w, https://isux.tencent.com/wp-content/uploads/2017/07/063100-37693-630x459.jpg
                      630w, https://isux.tencent.com/wp-content/uploads/2017/07/063100-37693-770x561.jpg
                      770w, https://isux.tencent.com/wp-content/uploads/2017/07/063100-37693-310x226.jpg
                      310w, https://isux.tencent.com/wp-content/uploads/2017/07/063100-37693.jpg
                      960w" sizes="(max-width: 590px) 100vw, 590px" /&gt;
                  </noscript>
              </p>
              <p>
                  渐变色取色法：
              </p>
              <p>
                  不同明度和色相的取色，淡紫到深黄的过渡，与淡黄到深紫的过渡，感觉是一样的配色，但是实际两种配色实际感觉却差别很大。
              </p>
              <p>
                  <img className="alignnone size-medium wp-image-25562" src="https://isux.tencent.com/wp-content/uploads/2017/07/063045-87575-590x161.png"
                  alt="" width="590" height="161" srcSet="https://isux.tencent.com/wp-content/uploads/2017/07/063045-87575-590x161.png 590w, https://isux.tencent.com/wp-content/uploads/2017/07/063045-87575-630x172.png 630w, https://isux.tencent.com/wp-content/uploads/2017/07/063045-87575-310x85.png 310w, https://isux.tencent.com/wp-content/uploads/2017/07/063045-87575.png 675w"
                  sizes="(max-width: 590px) 100vw, 590px" />
                  <noscript>
                      &lt;img className="alignnone size-medium wp-image-25562" src="https://isux.tencent.com/wp-content/uploads/2017/07/063045-87575-590x161.png"
                      alt="" width="590" height="161" srcSet="https://isux.tencent.com/wp-content/uploads/2017/07/063045-87575-590x161.png
                      590w, https://isux.tencent.com/wp-content/uploads/2017/07/063045-87575-630x172.png
                      630w, https://isux.tencent.com/wp-content/uploads/2017/07/063045-87575-310x85.png
                      310w, https://isux.tencent.com/wp-content/uploads/2017/07/063045-87575.png
                      675w" sizes="(max-width: 590px) 100vw, 590px" /&gt;
                  </noscript>
              </p>
              <p>
                  淡黄到深紫的过渡看起来更加自然，这是因为我们在自然中大多存在的都是淡黄向深紫的过度。如下图，所以采用仿自然的配色方式会让图表更加自然。
              </p>
              <p>
                  <img className="alignnone size-medium wp-image-25557" src="https://isux.tencent.com/wp-content/uploads/2017/07/063042-26630-590x440.jpg"
                  alt="" width="590" height="440" srcSet="https://isux.tencent.com/wp-content/uploads/2017/07/063042-26630-590x440.jpg 590w, https://isux.tencent.com/wp-content/uploads/2017/07/063042-26630-630x470.jpg 630w, https://isux.tencent.com/wp-content/uploads/2017/07/063042-26630-310x231.jpg 310w, https://isux.tencent.com/wp-content/uploads/2017/07/063042-26630.jpg 688w"
                  sizes="(max-width: 590px) 100vw, 590px" />
                  <noscript>
                      &lt;img className="alignnone size-medium wp-image-25557" src="https://isux.tencent.com/wp-content/uploads/2017/07/063042-26630-590x440.jpg"
                      alt="" width="590" height="440" srcSet="https://isux.tencent.com/wp-content/uploads/2017/07/063042-26630-590x440.jpg
                      590w, https://isux.tencent.com/wp-content/uploads/2017/07/063042-26630-630x470.jpg
                      630w, https://isux.tencent.com/wp-content/uploads/2017/07/063042-26630-310x231.jpg
                      310w, https://isux.tencent.com/wp-content/uploads/2017/07/063042-26630.jpg
                      688w" sizes="(max-width: 590px) 100vw, 590px" /&gt;
                  </noscript>
              </p>
              <p>
                  在取渐变色时，可以在Photoshop中制作出色相变化的色带并叠加明度渐变的色带，获得明度和色相均变化的色带。然后根据数据的数量，拉辅助线到取色点的位置，从断点处选取颜色，对渐变进行测试与调整，测试配色在实际运用中的效果，选取最优的配色。
              </p>
              <p>
                  取色的实际应用：
              </p>
              <p>
                  <img className="alignnone size-medium wp-image-25568" src="https://isux.tencent.com/wp-content/uploads/2017/07/063052-91606-590x392.jpg"
                  alt="" width="590" height="392" srcSet="https://isux.tencent.com/wp-content/uploads/2017/07/063052-91606-590x392.jpg 590w, https://isux.tencent.com/wp-content/uploads/2017/07/063052-91606-768x510.jpg 768w, https://isux.tencent.com/wp-content/uploads/2017/07/063052-91606-630x419.jpg 630w, https://isux.tencent.com/wp-content/uploads/2017/07/063052-91606-770x512.jpg 770w, https://isux.tencent.com/wp-content/uploads/2017/07/063052-91606-310x206.jpg 310w, https://isux.tencent.com/wp-content/uploads/2017/07/063052-91606.jpg 960w"
                  sizes="(max-width: 590px) 100vw, 590px" />
                  <noscript>
                      &lt;img className="alignnone size-medium wp-image-25568" src="https://isux.tencent.com/wp-content/uploads/2017/07/063052-91606-590x392.jpg"
                      alt="" width="590" height="392" srcSet="https://isux.tencent.com/wp-content/uploads/2017/07/063052-91606-590x392.jpg
                      590w, https://isux.tencent.com/wp-content/uploads/2017/07/063052-91606-768x510.jpg
                      768w, https://isux.tencent.com/wp-content/uploads/2017/07/063052-91606-630x419.jpg
                      630w, https://isux.tencent.com/wp-content/uploads/2017/07/063052-91606-770x512.jpg
                      770w, https://isux.tencent.com/wp-content/uploads/2017/07/063052-91606-310x206.jpg
                      310w, https://isux.tencent.com/wp-content/uploads/2017/07/063052-91606.jpg
                      960w" sizes="(max-width: 590px) 100vw, 590px" /&gt;
                  </noscript>
              </p>
              <p style={{textAlign: 'center'}}>
                  <em>
                      渐变色取色
                  </em>
              </p>
              <p>
                  <img className="alignnone size-medium wp-image-25563" src="https://isux.tencent.com/wp-content/uploads/2017/07/063046-24305-590x211.jpg"
                  alt="" width="590" height="211" srcSet="https://isux.tencent.com/wp-content/uploads/2017/07/063046-24305-590x211.jpg 590w, https://isux.tencent.com/wp-content/uploads/2017/07/063046-24305-768x274.jpg 768w, https://isux.tencent.com/wp-content/uploads/2017/07/063046-24305-630x225.jpg 630w, https://isux.tencent.com/wp-content/uploads/2017/07/063046-24305-770x275.jpg 770w, https://isux.tencent.com/wp-content/uploads/2017/07/063046-24305-310x111.jpg 310w, https://isux.tencent.com/wp-content/uploads/2017/07/063046-24305.jpg 960w"
                  sizes="(max-width: 590px) 100vw, 590px" />
                  <noscript>
                      &lt;img className="alignnone size-medium wp-image-25563" src="https://isux.tencent.com/wp-content/uploads/2017/07/063046-24305-590x211.jpg"
                      alt="" width="590" height="211" srcSet="https://isux.tencent.com/wp-content/uploads/2017/07/063046-24305-590x211.jpg
                      590w, https://isux.tencent.com/wp-content/uploads/2017/07/063046-24305-768x274.jpg
                      768w, https://isux.tencent.com/wp-content/uploads/2017/07/063046-24305-630x225.jpg
                      630w, https://isux.tencent.com/wp-content/uploads/2017/07/063046-24305-770x275.jpg
                      770w, https://isux.tencent.com/wp-content/uploads/2017/07/063046-24305-310x111.jpg
                      310w, https://isux.tencent.com/wp-content/uploads/2017/07/063046-24305.jpg
                      960w" sizes="(max-width: 590px) 100vw, 590px" /&gt;
                  </noscript>
              </p>
              <p style={{textAlign: 'center'}}>
                  <em>
                      渐变色应用案例
                  </em>
              </p>
              <h3>
                  字体设计
              </h3>
              <p>
                  文字是数据可视化的核心内容之一，文字和数字是数据信息传达的重要组成部分，为了更加清晰精确的传达信息，增加信息的可读性，从字体选择，到字体大小，字体间距都有特定的要求。
              </p>
              <p>
                  <strong>
                      1.
                  </strong>
                  <strong>
                      字体选择
                  </strong>
              </p>
              <p>
                  a.辨识度
              </p>
              <p>
                  UI设计中使用无衬线字体是UI界的共识，但是对于数据可视化设计而言，字体大小的跨度可以非常大，所以在无衬线字体中需要选择辨识度更高的字体，大的宽度比值和较高的X高度值的字体有更高的辨识度，选择字母容易辨识不会产生奇异的字体更有利于用于数据可视化设计。
              </p>
              <p>
                  <img className="alignnone size-full wp-image-25558" src="https://isux.tencent.com/wp-content/uploads/2017/07/063043-11286.jpg"
                  alt="" width="518" height="226" srcSet="https://isux.tencent.com/wp-content/uploads/2017/07/063043-11286.jpg 518w, https://isux.tencent.com/wp-content/uploads/2017/07/063043-11286-310x135.jpg 310w"
                  sizes="(max-width: 518px) 100vw, 518px" />
                  <noscript>
                      &lt;img className="alignnone size-full wp-image-25558" src="https://isux.tencent.com/wp-content/uploads/2017/07/063043-11286.jpg"
                      alt="" width="518" height="226" srcSet="https://isux.tencent.com/wp-content/uploads/2017/07/063043-11286.jpg
                      518w, https://isux.tencent.com/wp-content/uploads/2017/07/063043-11286-310x135.jpg
                      310w" sizes="(max-width: 518px) 100vw, 518px" /&gt;
                  </noscript>
              </p>
              <p>
                  b.更加灵活的字体
              </p>
              <p>
                  字体需要更加灵活，应该支持尽可能多的使用场景，数据可视化项目经常显示在不同大小，不同的终端上，需要选择更加灵活的字体可以在低分辨率的小屏或超大屏幕上运行良好。
              </p>
              <p>
                  c.字间距
              </p>
              <p>
                  宽松的字母间距（字母之间的间距应小于字偶间距）和合适的中文字间距。
              </p>
              <p>
                  <img className="alignnone size-full wp-image-25561" src="https://isux.tencent.com/wp-content/uploads/2017/07/063045-96468.png"
                  alt="" width="382" height="170" srcSet="https://isux.tencent.com/wp-content/uploads/2017/07/063045-96468.png 382w, https://isux.tencent.com/wp-content/uploads/2017/07/063045-96468-310x138.png 310w"
                  sizes="(max-width: 382px) 100vw, 382px" />
                  <noscript>
                      &lt;img className="alignnone size-full wp-image-25561" src="https://isux.tencent.com/wp-content/uploads/2017/07/063045-96468.png"
                      alt="" width="382" height="170" srcSet="https://isux.tencent.com/wp-content/uploads/2017/07/063045-96468.png
                      382w, https://isux.tencent.com/wp-content/uploads/2017/07/063045-96468-310x138.png
                      310w" sizes="(max-width: 382px) 100vw, 382px" /&gt;
                  </noscript>
              </p>
              <p>
                  <strong>
                      2.
                  </strong>
                  <strong>
                      字体大小
                  </strong>
              </p>
              <p>
                  文字的可读性对数据可视化起着至关重要的作用，设置小字体的极限值，以保证在最小显示时不影响对文字的辨认与阅读。
              </p>
              <p>
                  <strong>
                      3.
                  </strong>
                  <strong>
                      中西文间隔
                  </strong>
              </p>
              <p>
                  中西文混排时，要注意中文和西文间的间隔，一般排版的情况都是中文中混排有西文，所以需要在中西文间留有间隔，帮助用户更快速的扫视文字内容。
              </p>
              <p>
                  <img className="alignnone size-full wp-image-25761" src="https://isux.tencent.com/wp-content/uploads/2017/07/112640-44912.jpg"
                  alt="" width="574" height="229" srcSet="https://isux.tencent.com/wp-content/uploads/2017/07/112640-44912.jpg 574w, https://isux.tencent.com/wp-content/uploads/2017/07/112640-44912-310x124.jpg 310w"
                  sizes="(max-width: 574px) 100vw, 574px" />
                  <noscript>
                      &lt;img className="alignnone size-full wp-image-25761" src="https://isux.tencent.com/wp-content/uploads/2017/07/112640-44912.jpg"
                      alt="" width="574" height="229" srcSet="https://isux.tencent.com/wp-content/uploads/2017/07/112640-44912.jpg
                      574w, https://isux.tencent.com/wp-content/uploads/2017/07/112640-44912-310x124.jpg
                      310w" sizes="(max-width: 574px) 100vw, 574px" /&gt;
                  </noscript>
              </p>
              <h3>
                  极限处理
              </h3>
              <p>
                  数据是多种多样不可预知的，所以在可视化时需要处理各种极限问题，才能使数据清晰表达。
              </p>
              <p>
                  <strong>
                      1.
                  </strong>
                  <strong>
                      数据展示细节处理
                  </strong>
              </p>
              <p>
                  如下图，当水平排列数据时，图表空间不够，导致数据不可辨识，对数据进行旋转处理，不利于阅读，可以选择简写的方式来排布展示数据，或通过改变图表形式来解决问题。
              </p>
              <p>
                  <img className="alignnone size-medium wp-image-25560" src="https://isux.tencent.com/wp-content/uploads/2017/07/063044-84795-590x735.jpg"
                  alt="" width="590" height="735" srcSet="https://isux.tencent.com/wp-content/uploads/2017/07/063044-84795-590x735.jpg 590w, https://isux.tencent.com/wp-content/uploads/2017/07/063044-84795-630x785.jpg 630w, https://isux.tencent.com/wp-content/uploads/2017/07/063044-84795-310x386.jpg 310w, https://isux.tencent.com/wp-content/uploads/2017/07/063044-84795.jpg 687w"
                  sizes="(max-width: 590px) 100vw, 590px" />
                  <noscript>
                      &lt;img className="alignnone size-medium wp-image-25560" src="https://isux.tencent.com/wp-content/uploads/2017/07/063044-84795-590x735.jpg"
                      alt="" width="590" height="735" srcSet="https://isux.tencent.com/wp-content/uploads/2017/07/063044-84795-590x735.jpg
                      590w, https://isux.tencent.com/wp-content/uploads/2017/07/063044-84795-630x785.jpg
                      630w, https://isux.tencent.com/wp-content/uploads/2017/07/063044-84795-310x386.jpg
                      310w, https://isux.tencent.com/wp-content/uploads/2017/07/063044-84795.jpg
                      687w" sizes="(max-width: 590px) 100vw, 590px" /&gt;
                  </noscript>
              </p>
              <p>
                  <strong>
                      2.
                  </strong>
                  <strong>
                      选择合适的图表形式
                  </strong>
              </p>
              <p>
                  虽然饼图可以展示份额，但过多的分项已经使饼图不堪重负，不能很好的展示数据占比这个主题，所以使用横向柱状图可以更加清晰的表达这个主题。
              </p>
              <p>
                  <img className="alignnone size-medium wp-image-25573" src="https://isux.tencent.com/wp-content/uploads/2017/07/063058-64914-590x286.jpg"
                  alt="" width="590" height="286" srcSet="https://isux.tencent.com/wp-content/uploads/2017/07/063058-64914-590x286.jpg 590w, https://isux.tencent.com/wp-content/uploads/2017/07/063058-64914-768x372.jpg 768w, https://isux.tencent.com/wp-content/uploads/2017/07/063058-64914-630x305.jpg 630w, https://isux.tencent.com/wp-content/uploads/2017/07/063058-64914-770x373.jpg 770w, https://isux.tencent.com/wp-content/uploads/2017/07/063058-64914-310x150.jpg 310w, https://isux.tencent.com/wp-content/uploads/2017/07/063058-64914.jpg 960w"
                  sizes="(max-width: 590px) 100vw, 590px" />
                  <noscript>
                      &lt;img className="alignnone size-medium wp-image-25573" src="https://isux.tencent.com/wp-content/uploads/2017/07/063058-64914-590x286.jpg"
                      alt="" width="590" height="286" srcSet="https://isux.tencent.com/wp-content/uploads/2017/07/063058-64914-590x286.jpg
                      590w, https://isux.tencent.com/wp-content/uploads/2017/07/063058-64914-768x372.jpg
                      768w, https://isux.tencent.com/wp-content/uploads/2017/07/063058-64914-630x305.jpg
                      630w, https://isux.tencent.com/wp-content/uploads/2017/07/063058-64914-770x373.jpg
                      770w, https://isux.tencent.com/wp-content/uploads/2017/07/063058-64914-310x150.jpg
                      310w, https://isux.tencent.com/wp-content/uploads/2017/07/063058-64914.jpg
                      960w" sizes="(max-width: 590px) 100vw, 590px" /&gt;
                  </noscript>
              </p>
              <p>
                  &nbsp;
              </p>
              <p>
                  <strong>
                      小结
                  </strong>
              </p>
              <p>
                  我们生活在大数据时代，越来越多的数据被可视化。在构建可视化体系时，无论图表、颜色、字体都是承载和传达数据信息的元素，设计的核心是“让数据清晰传达”。
              </p>
              <p>
                  &nbsp;
              </p>
              <p>
                  参考：
                  <a href="https://blog.graphiq.com/finding-the-right-color-palettes-for-data-visualizations-fcd4e707a283">
                      Finding the Right Color Palettes for Data Visualizations
                  </a>
              </p>
              <p>
                  &nbsp;
              </p>
              <p>
              </p>
              <div className="clear">
              </div>
              
              
            </div>
            
            <h2>路由跳转：</h2>
            <p style={{textAlign: 'center',}}>
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

function select(store/*, ownProps*/){ // 1）第一个参数总是state对象，还可以使用第二个参数，代表容器组件的props对象
								  // 2) 侦听 Store，每当state更新的时候，就会自动执行，重新计算 UI 组件的参数，从而触发 UI 组件的重新渲染。
								  // 3）当使用了 ownProps 作为参数后，如果容器组件的参数发生变化，也会引发 UI 组件重新渲染。

	return {
    detailState: store.router.location.detailState
	}
}

function actions(dispatch, ownProps){
	return {
		dispatch
	};
}
module.exports = connect(select, actions)(IndexView);
