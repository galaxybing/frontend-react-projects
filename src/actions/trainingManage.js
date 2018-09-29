import request from '../core/_utils/request';
import { getCache } from '../core/_utils/storage';
import { IEVersion } from '../core/_utils/common';
import serialize from '../core/_utils/serialize';
import { message } from 'antd';

const { hospitalId, userId, roleId, depts } = getCache('profile') || {};

module.exports = {
    fetchCourseList: (query) => {
        let _t = '';
        if (IEVersion()) {
            _t = Math.random();
        }
        let role = 2;
        if (roleId === 10001) {
            role = 1;
        } else if (roleId === 10004) {
            role = 3;
        }
        const params = {
            role,
            accountId: userId,
            hospitalId,
            depts,
            _t,
            ...query
        };
        return request({
            url: `/nurse-train-web/nursetrain/web/course/read/v1.0.1/searchForPage?${serialize(params)}`,
            options: {
                method: 'GET'
            },
            api: 'nurseTrainApi'
        });
    },
    // 3.0.2医院培训租赁信息接口
    hospitalLeaseInfo: () => {
        return request({
            url: '/nurse-train-web/nursetrain/web/hospital/v3.0.2/hospitalLeaseInfo',
            options: {
                method: 'GET'
            },
            api: 'nurseTrainApi'
        });
    },
    
    saveCoureseRelease: ({ payload }) => {
      const { submitParam } = payload;
      return request({
        url: '/nurse-train-web/nursetrain/web/course/release/v1.0.1/release',
        options: {
          method: 'POST',
          data: JSON.stringify(submitParam)
        },
        api: 'nurseTrainApi'
      });
    },
    
    saveCoureseReleaseAll: ({ payload }) =>{
      const { submitParam } = payload;
      const query = submitParam;
      let role = 2;
      if (roleId === 10004) {
        role = 3;
      } else if (roleId === 10001) {
        role = 1;
      }
      const params = {
        role,
        hospitalId,
        ...query
      };
      return request({
        url: '/nurse-train-web/nursetrain/web/course/release/v2.1.1/releases',
        options: {
          method: 'POST',
          data: JSON.stringify(params)
        },
        api: 'nurseTrainApi'
      });
    },
    // 已发布课程列表--人员管理
    fetchUserManageList: (query) => {
      const params = {
        ...query,
        type: 1,
      };
      return request({
          url: '/nurse-train-web/nursetrain/web/course/release/v2.7.9/users/students',
          options: {
              method: 'GET',
              data: serialize(params),
          },
          api: 'nurseTrainApi'
      });
    },
    deleteCourse: ({id, history, filter}) => {
      return (dispatch) => {
        return request({
          url: '/nurse-train-web/nursetrain/web/course/write/v1.0.1/course/' + id,
          options: {
            method: 'DELETE',
          },
          api: 'nurseTrainApi'
        }).then((res) => {
          if (!res || !res.success) {
            message.error(res.errMsg);
            return;
          } else {
            message.success('删除成功');
          }

          // yield put({ type: 'reload' 
          
          history.push({
            pathname: '/hospital-admin/nurse-training-course/trainings-manage.html',
            search: '?' + serialize(filter),
          });
        });
      }
    },
    // 删除讲师 2.9.3
    deleteHospitalTeacher: (id) => {
      return request({
          url: `/nurse-train-web/nursetrain/web/basic/write/v1.0.1/lecturer/${id}`,
          options: {
            method: 'DELETE',
          },
          api: 'www_form_urlencoded_nurseTrainApi'
      });
    },
    fetchMemberNameList: (query) => {
      const params = {
        hospitalId,
        name: query,
      };
      return request({
          // url: '/nurse-train-web/nursetrain/web/user/getAllUserListFilter',
          url: '/nurse-train-web/nursetrain/web/user/getLecturerUserListFilter',
          options: {
            method: 'POST',
            data: JSON.stringify(params),
          },
          api: 'nurseTrainApi'
      });
    },
    fetchAddressName: (query) => {
      const params = {
        hospitalId,
        accountId: userId,
        content: query,
        type: 'train_place',
      };
      return request({
          // url: `/nurse-train-web/nursetrain/web/basic/read/v2.9.3/commonFieldRecord?hospitalId=${hospitalId}&accountId=${userId}&content=${query}&type=train_place`,
          url : `/nurse-train-web/nursetrain/web/basic/read/v2.9.3/commonFieldRecord?${serialize(params)}`,
          options: {
            method: 'GET',
          },
          api: 'nurseTrainApi'
      });
    }
}