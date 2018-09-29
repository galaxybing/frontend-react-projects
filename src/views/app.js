import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { BrowserRouter as RouterContainer } from 'react-router-dom';
import 'lodash';
import { Spin, message } from 'antd';
import MainTemplateLayout from '@317hu/MainTemplateLayout';
const boz = require('../../config').BOZ;
import RootRouter from './router';
import { getAdminInfo, getTopNavRest, checkIn } from '../actions';
import Unauthentication from '../components/Widgets/Unauthentication';
// 兼容处理 资源查看组件配置
import { getCache, saveCache } from '../core/_utils/storage';
import { PREVIEWURL } from '../constants';
saveCache('previewUrl', PREVIEWURL);
import { Modal } from 'antd'
const API_CONFIG = require('../store/api')
moment.locale('zh-cn');  // 日历组件中文化
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      privilegeModal: false,
      errMsg: [],
    }
  }
  componentDidMount() {
    this.props.dispatch(getAdminInfo()).then(data => {
      if (!data.success) {
        //根据是否开通，是否在有效期，判断是否有权限
        if (data.errCode == 'SERVICE_UNACCEPTABLE' || data.errCode == 'SERVICE_EXPIRE') {
          let errMsg = data.errCode == 'SERVICE_UNACCEPTABLE' ? ['您当前还未开通此服务','您可以联系客服付费开通'] : ['您的服务已经到期','您可以联系客服续约'];
          this.setState({ privilegeModal: true, errMsg: errMsg });
        } else {
          message.error('登录状态已过期，请重新登录！', 2, () => {
            this.props.dispatch(checkIn());
          });
          return;
        }
      }
    });
    // this.props.dispatch(getTopNavRest());
    // topNavRest
  }
  render() {
    let { dispatch, app } = this.props;
    const { roleId, depts, userId, hospitalId, regionIds } = app.profile || {};

    const supportsHistory = 'pushState' in window.history;

    let versionEnv = boz[`env`];
    if (/^v(\d){1,2}\.(\d){1,2}\.(\d){1,4}$/.test(versionEnv)) {
      versionEnv = 'prod';
    }
    const mainTemplateLayoutProps = {
      env: versionEnv,
      selectedModuleName: '护士培训',
      bar: ['top-menu', 'left-menu'], // 未配置则显示全部导航
    };
    // 有没有权限进入护士培训
    let template;
    if (userId) {  // 用这个来判断用户信息是否已经返回，返回时再来判断是否有权限
      let showTreeMenu = false;
      if (versionEnv == 'dev') {
        if (hospitalId == '376') {
          showTreeMenu = true;
        }
      } else if (versionEnv == 'sit') {
        if (hospitalId == '1056') {
          showTreeMenu = true;
        }
      } else {
        if (hospitalId == '716') {
          showTreeMenu = true;
        }
      }

      if (showTreeMenu) {
        mainTemplateLayoutProps.skin = 'tree';
        document.getElementById('pageTitle') && (document.getElementById('pageTitle').innerHTML = '重附一管理系统');
        document.getElementById('favorIcon') &&
          document.getElementById('favorIcon').setAttribute('href', 'http://image.317hu.com/cfyFavor.ico');
      }

      if (roleId && (roleId === 10000 || (roleId === 10003 && regionIds) || (roleId === 10001 && regionIds) || (roleId === 10004 && regionIds))) {
        template = (
          <MainTemplateLayout {...mainTemplateLayoutProps}>
            <RootRouter />
          </MainTemplateLayout>
        );
      } else {
        template = <Unauthentication />;
      }
    } else {
      template = (
        <Spin size="large" tip="加载中...">
          <div style={{ height: `${document.body.clientHeight}px` }} />
        </Spin>
      );
    }
    return (
      this.state.privilegeModal ? <Modal
        visible={true}
        width={640}
        title="提示"
        maskClosable={false}
        onCancel={() => { window.location.href = API_CONFIG['education'] + '/hospital-admin/course-center-react/indexPage/index.html' }}
        footer={<div>
          <a className="privilegeFoot" onClick={() => { window.location.href = API_CONFIG['payServer'] + '/hospital-admin/course-additional-services/servicesList/list.html' }}>开通</a>
        </div>}
      >
        <div className="privilegeContent">
          <p>{this.state.errMsg[0]}</p>
          <p>{this.state.errMsg[1]}</p>
        </div>
      </Modal> :
        <RouterContainer forceRefresh={!supportsHistory} keyLength={10}>
          {template}
        </RouterContainer>
    );
  }
}
function select(state) {
  return {
    app: state.main,
  };
}
function actions(dispatch, ownProps) {
  return { dispatch };
};
export default connect(select, actions)(App);
