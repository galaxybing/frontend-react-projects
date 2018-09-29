import request from '../core/_utils/request';
import { getCache } from '../core/_utils/storage';
import { IEVersion } from '../core/_utils/common';
import serialize from '../core/_utils/serialize';

const { hospitalId, userId, roleId, depts } = getCache('profile') || {};
const { fromPage, hospitalId: innerHospitalId } = getCache('innerFromPage') || {};

module.exports = {
    fetchList: (query) => {
        let _t = '';
        if (IEVersion()) {
            _t = Math.random();
        }
        const params = {
            roleId,
            accountId: query.type === '2' ? userId : -1,
            hospitalId,
            _t,
            ...query
        };
        return request({
            url: `/nurse-train-web/nursetrain/web/read/template/resource/v2.1.2/resourcePage?${serialize(params)}`,
            options: {
                method: 'GET'
            },
            api: 'nurseTrainApi'
        });
    },
    // 3.0.2医院培训租赁信息接口
    hospitalLeaseInfo: () => {
        return request({
            url: 'nurse-train-web/nursetrain/web/hospital/v3.0.2/hospitalLeaseInfo',
            options: {
                method: 'GET'
            },
            api: 'nurseTrainApi'
        });
    },
    queryCourseClassificationList: (query) => {  // 层级：2   课程分类3
      const params = {
        innerFromPage: fromPage,
        ...query,
      };
      return request({
        url: `/nurse-train-web/nursetrain/web/basic/read/v1.0.1/dataDictionaryList?${serialize(params)}`,
        options: {
          method: 'GET'
        },
        api: 'nurseTrainApi'
      });
    },
    queryTrainClassifyList: (query) => {
      const params = {
        innerFromPage: fromPage,
        hospitalId: query.hospitalId || hospitalId,
        type: 'TRAINCLASSIFY'
      };
      return request({
        url: `/nurse-train-web/nursetrain/web/basicDict/read/v2.2.7/dict?${serialize(params)}`,
        options: {
          method: 'GET'
        },
        api: 'nurseTrainApi'
      });
    },
    createCourseware: (param) => {
      return request({
        url: '/nurse-train-web/nursetrain/web/write/template/resource/v2.1.2/resource',
        options: {
          method: 'POST',
          data: JSON.stringify(param)
        },
        api: 'nurseTrainApi'
      });
    },
    deleteCourseware: (id) => {
      return request({
        url: `/nurse-train-web/nursetrain/web/write/template/resource/v2.1.2/resource/${id}`,
        options: {
          method: 'DELETE',
        },
        api: 'nurseTrainApi'
      });
    },
    updateCourseware: (param) => {
      return request({
        url: '/nurse-train-web/nursetrain/web/write/template/resource/v2.1.2/resource',
        options: {
          method: 'PUT',
          data: JSON.stringify(param)
        },
        api: 'nurseTrainApi'
      });
    },
    setCoursewarePrivilege: (param) => {
      return request({
        url: '/nurse-train-web/nursetrain/web/write/template/resource/v3.4.0/batchSetTemplateCourse',
        options: {
          method: 'PUT',
          data: JSON.stringify(param)
        },
        api: 'nurseTrainApi'
      });
    },
}