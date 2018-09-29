import { message } from 'antd';
import request from '../core/_utils/request';
import { getCache } from '../core/_utils/storage';
import { IEVersion } from '../core/_utils/common';
import serialize from '../core/_utils/serialize';
// import { localApiConfig } from '../store/parse';
const boz = require('../../config').BOZ

const { hospitalId, userId, roleId, depts } = getCache('profile') || {};
const { fromPage } = getCache('innerFromPage') || {};

module.exports = {
    getStudyUserList: (query) => {
        const params = {
            ...query,
            innerFromPage: fromPage
        };
        return request({
            url: `/nurse-train-web/nursetrain/web/course/read/v1.0.1/studyDetailPage?${serialize(params)}`,
            options: {
                method: 'GET',
            },
            api: 'nurseTrainApi'
        });
    },
    getStudyDetail: (query) => {
        const params = {
            ...query,
            innerFromPage: fromPage
        };
        return request({
            url: `/nurse-train-web/nursetrain/web/course/read/v2.2.7/studyDetail?${serialize(params)}`,
            options: {
                method: 'GET',
            },
            api: 'nurseTrainApi'
        });
    },
    validateCorrectHomeWork: (id) => {
      return request({
          url: `/nurse-train-web/nursetrain/web/courseExtend/read/v3.4.0/validateCorrectHomeWork/${id}`,
          options: {
              method: 'GET',
          },
          api: 'nurseTrainApi'
      });
    },
    queryCorrectHomeWorkDetail: (id) => {
      return request({
          url: `/nurse-train-web/nursetrain/web/courseExtend/read/v3.4.0/queryCorrectHomeWorkDetail/${id}`,
          options: {
              method: 'GET',
          },
          api: 'nurseTrainApi'
      });
    },
    getPaperDetail: (query) => {
      const params = {
        ...query
      };
      return request({
        url: `/nurse-train-web/nursetrain/web/paper/read/v3.4.0/paperDetail?${serialize(params)}`,
        options: {
          method: 'GET'
        },
        api: 'nurseTrainApi'
      });
    },
    getCourseStudyDetail: (query) => {
      const params = {
        ...query
      };
      return request({
        url: `/nurse-train-web/nursetrain/web/courseExtend/read/v3.4.0/courseStudyDetail?${serialize(params)}`,
        options: {
          method: 'GET'
        },
        api: 'nurseTrainApi'
      });
    },
    // 查看培训规则
    getTrainingRule: (query) => {
        return request({
            url: `/nurse-train-web/nursetrain/web/read/exam/releasePaper/v2.7.3/queryExamRule?data=${JSON.stringify(query)}`,
            options: {
                method: 'GET',
            },
            api: 'nurseTrainApi'
        });
    },
    // 导出
    exportResult: (query) => {
      location.href = boz['api'][`${boz['env']}`]['nurseTrainApi'] + `/nurse-train-web/nursetrain/web/course/read/v2.2.7/exportTrainResult?${serialize(query)}`;
        // location.href = `${localApiConfig().nurseTrainApi}/nurse-train-web/nursetrain/web/course/read/v2.2.7/exportTrainResult?${serialize(query)}`;
    },
    // 导出 随堂测验答卷
    exportTestProcessResult: (query) => {
        return request({
            url: `/nurse-train-web/nursetrain/web/paper/read/v2.6.2/downloadPaper?${serialize(query)}`,
            options: {
                method: 'GET',
            },
            api: 'nurseTrainApi'
        });
    },
    // 获取导出字段记录
    exportFieldRecord: () => {
        const params = {
            accountId: userId,
            hospitalId
        };
        return request({
            url: `/nurse-train-web/nursetrain/web/basic/read/v2.9.3/exportFieldRecord?${serialize(params)}`,
            options: {
                method: 'GET',
            },
            api: 'nurseTrainApi'
        });
    },
    queryCorrectHomeWork: (query) => {
        const params = {
            ...query,
        };
        return request({
            url: `/nurse-train-web/nursetrain/web/courseExtend/read/v3.4.0/queryCorrectHomeWork/${params.releaseId}`,
            options: {
                method: 'GET',
            },
            api: 'nurseTrainApi'
        });
    },
    queryHomeWorkPage: (query) => {
        return request({
            url: `/nurse-train-web/nursetrain/web/courseExtend/read/v3.4.0/queryCorrectHomeWorkPage?${serialize(query)}`,
            options: {
                method: 'GET',
            },
            api: 'nurseTrainApi'
        });
    },
    saveCorrectHomeWork: (param) => {
        return request({
            url: `/nurse-train-web/nursetrain/web/courseExtend/write/v3.4.0/saveCorrectHomeWork`,
            options: {
                method: 'POST',
                data: JSON.stringify(param)
            },
            api: 'nurseTrainApi'
        });
    },
    submitCorrectHomeWork: (param) => {
        return request({
            url: `/nurse-train-web/nursetrain/web/courseExtend/write/v3.4.0/submitCorrectHomeWork`,
            options: {
                method: 'POST',
                data: JSON.stringify(param)
            },
            api: 'nurseTrainApi'
        });
    },
}
