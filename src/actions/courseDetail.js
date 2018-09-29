import { message } from 'antd';
import request from '../core/_utils/request';
import { getCache } from '../core/_utils/storage';
import { IEVersion } from '../core/_utils/common';
import serialize from '../core/_utils/serialize';

const { hospitalId, userId, roleId, depts = '', regionIds } = getCache('profile') || {};
const { fromPage, hospitalId: innerHospitalId } = getCache('innerFromPage') || {};

module.exports = {
  getCourseDetail: (query) => {
    const params = {
      innerFromPage: fromPage,
      ...query
    };
    return request({
      url: `/nurse-train-web/nursetrain/web/course/read/v3.4.0/searchForDetail?${serialize(params)}`,
      options: {
        method: 'GET'
      },
      api: 'nurseTrainApi'
    });
  },
  //获取课程留言（分页）
  getCourseMessage: (query) => {
    return request({
      url: `/nurse-train-web/nursetrain/web/trainComment/read/v3.4.0/trainCommentList`,
      options: {
        method: 'GET',
        data: query
      },
      api: 'www_form_urlencoded_nurseTrainApi'
    });
  },
  // 回复留言
  replyMessage: (query) => {
    const params = {
      name,
      ...query
    }
    return request({
      url: `/nurse-train-web/nursetrain/web/trainComment/write/v3.4.0/reply`,
      options: {
        method: 'POST',
        data: JSON.stringify(params),
      },
      api: 'nurseTrainApi'
    });
  },
  //删除留言
  deleteMessage: (params) => {
    return request({
      url: `/nurse-train-web/nursetrain/web/trainComment/write/v3.4.0/del`,
      options: {
        method: 'PUT',
        data: JSON.stringify(params)
      },
      api: 'nurseTrainApi'
    });
  },
  toCopy: (query) => {
    return (dispatch) => {
      const { courseId } = query;
      let level = 2;
      if (roleId === 10001) {
        level = 1;
      } else if (roleId === 10004) {
        level = 3;
      }
      const param = {
        courseIds: courseId,
        hospitalId,
        accountId: userId,
        level
      };
      return request({
        url: '/nurse-train-web/nursetrain/web/course/write/v2.2.6/course/copy',
        options: {
          method: 'POST',
          data: JSON.stringify(param)
        },
        api: 'nurseTrainApi'
      }).then((copydata) => {
        if (!copydata.success) {
          message.error(copydata.errMsg);
          return;
        }
        message.success('课程复制成功');
        // yield put(routerRedux.push({
        //   pathname: '/trainings-manage/publicCourse'
        // }));

        alert('跳转发布培训课程？？？')
        // props.history.push({
        //   pathname: '/hospital-admin/nurse-training-course/create-course-success.html',
        // });
      });
    }
  }
}