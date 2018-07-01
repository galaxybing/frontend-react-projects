import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { push } from 'react-router-redux';
import { logout } from '../../../src/actions/config';
import { PAGE_SIZE_OPTIONS, PREVIEWURL } from '../../../src/constants';
import serialize from '../../../src/core/_utils/serialize';
import { version as antdVersion, Breadcrumb, Table, Pagination, message, LocaleProvider } from 'antd';
// import LocaleProviderSwitch from '../../../src/components/LocaleProviderSwitch';
// const LocaleProviderSwitch = require('../../../src/components/LocaleProviderSwitch').default
const { LocaleProviderSwitch } = require('../../../src/components/LocaleProviderSwitch');

// 动画
// import { TweenMax } from 'gsap';

// 发请求
// var request = require('request');
// import { fetch } from '../../../src/core/_utils/request';
// 

let fetchDataSource = {"data":{"firstPage":false,"firstResult":10,"hasNextPage":true,"hasPreviousPage":true,"lastPage":false,"lastPageNumber":27,"linkPageNumbers":[1,2,3,4,5,6,7,8,9,10],"nextPageNumber":3,"pageNumber":2,"pageSize":10,"previousPageNumber":1,"result":[{"canEdit":1,"courseClassifyCode":" 1","courseClassifyCodeParent":"4","courseClassifyName":"分类一","createBy":57,"createByName":"姜欢欢","deptId":0,"deptName":"护理部","fileName":"护士培训2.7.3Api.docx","fileType":"docx","hashCode":"Fig7FULsDf3Sif86AcDb36nyC5oX","hospitalId":26,"id":798,"pdfUrl":"http://video.317hu.com/55250163-6316-4707-b07b-e3548e993328.pdf","size":"17KB","status":0,"taskId":"55250163-6316-4707-b07b-e3548e993328","trainClassifyCode":"10000001","trainClassifyName":"N0护士培训-test-1","type":2,"updateTime":"2018-06-12 22:21:56","url":"http://7xtqgc.com1.z0.glb.clouddn.com/Fig7FULsDf3Sif86AcDb36nyC5oX"},{"canEdit":1,"courseClassifyCode":"7","courseClassifyName":"护理前沿","createBy":6002971,"createByName":"这个是主任1","deptId":0,"deptName":"护理部","fileName":"平台应用中心文档    .docx","fileType":"docx","hashCode":"Fosvctgj7S28YylcSOqAiKvh6QQr","hospitalId":26,"id":780,"pdfUrl":"http://video.317hu.com/e2eb7802-0064-4f96-b6f4-7db35f670067.pdf","size":"405KB","status":0,"taskId":"e2eb7802-0064-4f96-b6f4-7db35f670067","trainClassifyCode":"10020002","trainClassifyName":"我是个培训分类","type":2,"updateTime":"2018-06-12 22:11:20","url":"http://7xtqgc.com1.z0.glb.clouddn.com/Fosvctgj7S28YylcSOqAiKvh6QQr"},{"canEdit":1,"courseClassifyCode":" 1","courseClassifyCodeParent":"4","courseClassifyName":"分类一","createBy":7003668,"createByName":"黄测试","deptId":61192,"deptName":"护理部","fileName":"护理分会.docx","fileType":"docx","hashCode":"FiyoYGCdrU3ypD3Bjx-Zql2P0n5g","hospitalId":26,"id":875,"pdfUrl":"http://video.317hu.com/021a28bf-abb5-42aa-98a2-69b353693337.pdf","size":"22KB","status":0,"taskId":"021a28bf-abb5-42aa-98a2-69b353693337","trainClassifyCode":"10000008","trainClassifyName":"fdsafa","transcodingId":"","type":2,"updateTime":"2018-06-12 22:10:27","url":"http://7xtqgc.com1.z0.glb.clouddn.com/FiyoYGCdrU3ypD3Bjx-Zql2P0n5g"},{"canEdit":1,"courseClassifyCode":"888","courseClassifyCodeParent":"4","courseClassifyName":"测试规培课堂","createBy":57,"createByName":"姜欢欢","deptId":0,"deptName":"护理部","fileName":"WeChat_20180611095912.mp4","fileType":"mp4","hashCode":"FtubQt5vnM6g6bRtAJGy-Qe5WeSC","hospitalId":26,"id":878,"returnUrl":"http://7xtqgc.com1.z0.glb.clouddn.com/AEg6E4PN-uXwxpbOIOrYOhs4RHA=/FtubQt5vnM6g6bRtAJGy-Qe5WeSC","size":"603KB","status":1,"trainClassifyCode":"10020003","trainClassifyName":"二位台湾而特","transcodingId":"eqr9Jvo6xRVhU2wsPi3D47281pofyR","type":1,"updateTime":"2018-06-11 11:12:13","url":"http://7xtqgc.com1.z0.glb.clouddn.com/eqr9Jvo6xRVhU2wsPi3D47281pofyR","videoTime":"3000"},{"canEdit":1,"courseClassifyCode":"88","courseClassifyCodeParent":"4","courseClassifyName":"测试规培课堂","createBy":7003668,"createByName":"黄测试","deptId":61192,"deptName":"护理部","fileName":"主观题在错题集里不显示参考答案.mp4","fileType":"mp4","hashCode":"lsZPGyUbnP0j7bbdtvjPh7QbV9yp","hospitalId":26,"id":870,"returnUrl":"http://7xtqgc.com1.z0.glb.clouddn.com/AEg6E4PN-uXwxpbOIOrYOhs4RHA=/lsZPGyUbnP0j7bbdtvjPh7QbV9yp","size":"30M","status":1,"trainClassifyCode":"10000002","trainClassifyName":"N1护士培训","transcodingId":"YxZpUmRQGRAxt8byGauNqL5pNzydSb","type":1,"updateTime":"2018-05-21 14:09:26","url":"http://7xtqgc.com1.z0.glb.clouddn.com/YxZpUmRQGRAxt8byGauNqL5pNzydSb","videoTime":"16000"},{"canEdit":1,"courseClassifyCode":"88","courseClassifyCodeParent":"4","courseClassifyName":"测试规培课堂","createBy":57,"createByName":"姜欢欢","deptId":0,"deptName":"护理部","fileName":"H4.4.mp4","fileType":"mp4","hashCode":"luCHsK1gfg94g7dZoX7PJn5XdEHb","hospitalId":26,"id":865,"returnUrl":"http://7xtqgc.com1.z0.glb.clouddn.com/AEg6E4PN-uXwxpbOIOrYOhs4RHA=/luCHsK1gfg94g7dZoX7PJn5XdEHb","size":"37M","status":1,"trainClassifyCode":"10000007","trainClassifyName":"dsadaS","transcodingId":"U6IzdFhrlPOhRGv2oY0LrjgSDkYl7q","type":1,"updateTime":"2018-04-24 16:21:14","url":"http://7xtqgc.com1.z0.glb.clouddn.com/U6IzdFhrlPOhRGv2oY0LrjgSDkYl7q","videoTime":"501000"},{"canEdit":1,"courseClassifyCode":"112","courseClassifyName":"","createBy":57,"createByName":"姜欢欢","deptId":0,"deptName":"护理部","fileName":"jurassic-world-fallen-k_h720p.mov","fileType":"mov","hashCode":"lpcsQkpLthft98VKCqTJXItIO_K0","hospitalId":26,"id":864,"returnUrl":"http://7xtqgc.com1.z0.glb.clouddn.com/AEg6E4PN-uXwxpbOIOrYOhs4RHA=/lpcsQkpLthft98VKCqTJXItIO_K0","size":"100M","status":1,"trainClassifyCode":"10000007","trainClassifyName":"dsadaS","transcodingId":"G2sij4xVmfcbKHKN68IziLCMBl77HF","type":1,"updateTime":"2018-04-24 16:20:05","url":"http://7xtqgc.com1.z0.glb.clouddn.com/G2sij4xVmfcbKHKN68IziLCMBl77HF","videoTime":"166000"},{"canEdit":1,"courseClassifyCode":"319","courseClassifyName":"3.0.4.1-1","createBy":57,"createByName":"姜欢欢","deptId":0,"deptName":"护理部","fileName":"H2.4.mp4","fileType":"mp4","hashCode":"lr3Xx9IAet-DE8N06YKB17JQW70K","hospitalId":26,"id":863,"returnUrl":"http://7xtqgc.com1.z0.glb.clouddn.com/AEg6E4PN-uXwxpbOIOrYOhs4RHA=/lr3Xx9IAet-DE8N06YKB17JQW70K","size":"62M","status":1,"trainClassifyCode":"10000007","trainClassifyName":"dsadaS","transcodingId":"OhqEGDTWewS4TtQYQzmU0gLsDW7AhU","type":1,"updateTime":"2018-04-19 13:40:09","url":"http://7xtqgc.com1.z0.glb.clouddn.com/OhqEGDTWewS4TtQYQzmU0gLsDW7AhU","videoTime":"780000"},{"canEdit":1,"courseClassifyCode":" 1","courseClassifyCodeParent":"4","courseClassifyName":"分类一","createBy":57,"createByName":"姜欢欢","deptId":0,"deptName":"护理部","fileName":"内存及字符串操作篇.pdf","fileType":"pdf","hashCode":"Ftpse0gcE5i1Rolim73p7wci5wwE","hospitalId":26,"id":852,"size":"98KB","status":0,"trainClassifyCode":"10030001","trainClassifyName":"进修护理人员培训","transcodingId":"","type":2,"updateTime":"2018-02-24 14:10:26","url":"http://7xtqgc.com1.z0.glb.clouddn.com/Ftpse0gcE5i1Rolim73p7wci5wwE"},{"canEdit":1,"courseClassifyCode":"5","courseClassifyName":"品管圈","createBy":57,"createByName":"姜欢欢","deptId":0,"deptName":"护理部","fileName":"进程操作篇.pdf","fileType":"pdf","hashCode":"FjTgU_2Rt4ujFij6_bNOfyl0lutJ","hospitalId":26,"id":851,"size":"129KB","status":0,"trainClassifyCode":"10020004","trainClassifyName":"dfdsfadsewrqer","transcodingId":"","type":2,"updateTime":"2018-02-24 14:09:08","url":"http://7xtqgc.com1.z0.glb.clouddn.com/FjTgU_2Rt4ujFij6_bNOfyl0lutJ"}],"thisPageFirstElementNumber":11,"thisPageLastElementNumber":20,"totalCount":265},"success":true};

const initialFilter = {
  courseClassifyCodeParent: '',
  courseClassifyCode: '',
  trainClassifyCode: '',
  name: '',
  pageSize: 10,
  pageNum: 1,
  type: '1', // 1 全部 | 2 我的课件
};

class IndexView extends Component{
  static contextTypes = {
		router: PropTypes.object.isRequired,
	};
  constructor(props) {
    super(props);
    
    this.state = {
      loading: false,
      dataSource: {
        tableList: [],
        pagination: {}
      },
      filter: initialFilter,
    };
    
    this.columns = [
      {
        title: '课件名称',
        dataIndex: 'fileName',
        key: 'fileName',
        width: '20%',
        render: (text, record) => {
          if (/pdf/i.test(record.fileType)) {
            return (<a onClick={() => previewCourseware(record.url, 'pdf')}>{text}</a>);
          } else if (record.type === 1) {
            if (record.returnUrl) {
              return (<a onClick={() => previewCourseware(record.returnUrl, 'video')}>{text}</a>);
            } else {
              if (record.status === 0) {
                return (<a onClick={warning}>{text}</a>);
              } else if (record.status === -1) {
                return (<a onClick={error}>{text}</a>);
              }
            }
          } else {
            if (record.pdfUrl) {
              return (<a onClick={() => previewCourseware(record.pdfUrl, 'pdf')}>{text}</a>);
            } else {
              if (record.size && record.size.indexOf('M') > -1) {
                const fileSize = record.size.split('M')[0];
                if (fileSize > 10) {
                  return (<a onClick={warning}>{text}</a>);
                }
              }
              return (<a href={`https://view.officeapps.live.com/op/view.aspx?src=${record.url}`} target="_blank">{text}</a>);
            }
          }
        }
      },
      {
        title: '课件大小',
        dataIndex: 'size',
        key: 'size',
        width: '11%',
      },
      {
        title: '课程分类',
        dataIndex: 'courseClassifyName',
        key: 'courseClassifyName',
        width: '13%',
      },
      {
        title: '培训分类',
        dataIndex: 'trainClassifyName',
        key: 'trainClassifyName',
        width: '13%',
      },
      {
        title: '创建者',
        dataIndex: 'createByName',
        key: 'createByName',
        width: '15%',
        render: (text, record) => {
          if (text) {
            return (<span>{record.deptName && `${record.deptName}-`}{text}</span>)
          } else {
            return (<span>{record.deptName}</span>)
          }
        }
      },
      {
        title: '更新时间',
        dataIndex: 'updateTime',
        key: 'updateTime',
        width: '15%',
        render: (text) => {
          if (text) {
            return (
              <span className="table-time">
                <span>{text.split(' ')[0]}&nbsp;&nbsp;</span>
                <span>{text.split(' ')[1]}</span>
              </span>
            );
          } else {
            return null;
          }
        }
      }
    ];

  }
  componentDidMount() {
    this.load(this.query);
  }
  load = (query) => {
    this.setState({ loading: true });
    let filter = this.state.filter;
    filter = Object.assign({}, filter, query);
    
    setTimeout(() => {
      const data = fetchDataSource;
      this.setState({ loading: false });
      if (!data.success) {
        message.error(data.errMsg);
        return;
      } else {
        let resultData = data.data.result;
        if (data.data.result) {
          this.setState({
            filter,
            dataSource: {
              tableList: resultData, // data.data.result,
              pagination: {
                total: data.data.totalCount,
                current: data.data.pageNumber,
              }
            }
          })
        }

      }
    }, 2000);
  }
  onChange = (query) => {
    let filter = this.state.filter;
    filter = Object.assign({}, filter, query);
    this.props.history.push({
      pathname: '/index.html',
      search: `?${serialize(filter)}`
    });
  }
  render() {
    const { dataSource = {}, loading } = this.state;
    return <LocaleProviderSwitch>
      <div className="page-index page-container">
        <h1>版本：v2.2.1</h1>
        <div>
          <Breadcrumb>
            <Breadcrumb.Item>面包屑-首页</Breadcrumb.Item>
            <Breadcrumb.Item><a href="javascript:;">第二级</a></Breadcrumb.Item>
            <Breadcrumb.Item>第三级</Breadcrumb.Item>
          </Breadcrumb>
          <Table
            columns={this.columns}
            dataSource={dataSource.tableList}
            loading={loading}
            rowKey={record => record.id}
            className="boz-table-form"
            pagination={false}
          />
          <Pagination
            className="ant-table-center-pagination"
            showSizeChanger
            pageSizeOptions={PAGE_SIZE_OPTIONS}
            pageSize={this.state.filter.pageSize && parseInt(this.state.filter.pageSize)}
            onChange={(pageNum) => this.onChange({ pageNum })}
            onShowSizeChange={(pageNum, pageSize) => this.onChange({ pageNum, pageSize })}
            {...dataSource.pagination}
          />
        </div>
      </div>
    </LocaleProviderSwitch>
    
  }
}

function select(store/*, ownProps*/) {
  // 1）第一个参数总是state对象，还可以使用第二个参数，代表容器组件的props对象
  // 2) 侦听 Store，每当state更新的时候，就会自动执行，重新计算 UI 组件的参数，从而触发 UI 组件的重新渲染。
  // 3）当使用了 ownProps 作为参数后，如果容器组件的参数发生变化，也会引发 UI 组件重新渲染。
	return {
    basename: store.config.basename,
    detailState: store.router.location && store.router.location.detailState
	}
}

function actions(dispatch, ownProps){
	return {
    logout,
		dispatch
	};
}

export default connect(select, actions)(IndexView);
