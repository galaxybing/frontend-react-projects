import request from '../core/_utils/request';
import { getCache } from '../core/_utils/storage';
import { IEVersion } from '../core/_utils/common';
import serialize from '../core/_utils/serialize';

const { hospitalId, roleId } = getCache('profile').roleId ? getCache('profile') : window[`GET_ADMIN_INFO`][`profile`];
module.exports = {
  // 获取试题列表
  getExerciseList: (query) => {
    let _t = '';
    if (IEVersion()) {
      _t = Math.random();
    }
    const type = query.type && query.type[0] ? query.type[0] : query.type;
    const params = {
      pageNum: query.pageNum || 1,
      pageSize: query.pageSize || 10,
      hospitalId: query.hospitalId || hospitalId,
      // exerciseClassifyCode: query.exerciseClassifyChildren || query.exerciseClassify,
      name: query.name,
      roleId,
      accountId: query.accountId || -1,
      startTime: query.startTime,
      endTime: query.endTime,
      hadSelectIds: query.hadSelectIds,
      customTag: query.customTag,
      privateFlag: query.privateFlag,
      type: type || -1,
      difficulty: query.difficulty && query.difficulty[0] || -1,
      levelName: query.level && query.level[0] || '',
      level: query.hospitalId == 0 && query.level && query.level[0] || 0,
      department: query.department && query.department[0] || '',
      subject: query.subject && query.subject[0] || '',
      correctRate: query.accuracy && query.accuracy[0] || -1,
      shareType: query.customClassify && query.customClassify[0] || 0,
      privateClassifyIds: query.customClassify && query.customClassify[1] ? query.customClassify[1] : '',
      sourceId: query.source && query.source[0] || 0,  // 来源
      // _t
    };
    return request({
      url: '/nurse-train-web/nursetrain/web/read/template/exercise/v2.1.2/exercise',
      options: {
        method: 'POST',
        data: JSON.stringify(params)
      },
      api: 'nurseTrainApi'
    });
    // return request({
    //   url: `/nurse-train-web/nursetrain/web/read/template/exercise/v2.1.2/exercise?${serialize(params)}`,
    //   options: {
    //     method: 'GET'
    //   },
    //   api: 'nurseTrainApi'
    // });
  },
  // 获取随机试题列表
  getRandomExerciseLis: (query) => {
    const type = query.type && query.type[0] ? query.type[0] : query.type;
    const params = {
      pageNum: query.pageNum || 1,
      pageSize: query.pageSize || 10,
      hospitalId: query.hospitalId || hospitalId,
      // exerciseClassifyCode: query.exerciseClassifyChildren || query.exerciseClassify,
      name: query.name,
      roleId,
      accountId: query.accountId || -1,
      startTime: query.startTime,
      endTime: query.endTime,
      hadSelectIds: query.hadSelectIds,
      customTag: query.customTag,
      privateFlag: query.privateFlag,
      type: type || -1,
      difficulty: query.difficulty && query.difficulty[0] || -1,
      levelName: query.level && query.level[0] || '',
      level: query.hospitalId == 0 && query.level && query.level[0] || 0,
      department: query.department && query.department[0] || '',
      subject: query.subject && query.subject[0] || '',
      correctRate: query.accuracy && query.accuracy[0] || -1,
      shareType: query.customClassify && query.customClassify[0] || 0,
      privateClassifyIds: query.customClassify && query.customClassify[1] ? query.customClassify[1] : '',
      sourceId: query.source && query.source[0] || 0,  // 来源
    };
    return request({
      url: '/nurse-train-web/nursetrain/web/read/template/exercise/v2.1.2/exerciseRandom',
      options: {
        method: 'POST',
        data: JSON.stringify(params)
      },
      api: 'nurseTrainApi'
    });
  },
  deleteQuestions: (id) => {
    return request({
      url: `/nurse-train-web/nursetrain/web/write/template/exercise/v2.1.2/exercise/${id}`,
      options: {
        method: 'DELETE'
      },
      api: 'nurseTrainApi'
    });
  },
  addQuestions: (values) => {
    return request({
      url: '/nurse-train-web/nursetrain/web/write/template/exercise/v2.1.2/exercise',
      options: {
        method: 'POST',
        data: JSON.stringify([values])
      },
      api: 'nurseTrainApi'
    });
  },
  editQuestions: (values) => {
    return request({
      url: '/nurse-train-web/nursetrain/web/write/template/exercise/v2.1.2/exercise',
      options: {
        method: 'PUT',
        data: JSON.stringify(values)
      },
      api: 'nurseTrainApi'
    });
  },
  // 批量设置试题属性
  batchUpdateExercise: (values) => {
    return request({
      url: '/nurse-train-web/nursetrain/web/write/template/exercise/v2.7.4/batchUpdateExercise',
      options: {
        method: 'PUT',
        data: JSON.stringify(values)
      },
      api: 'nurseTrainApi'
    });
  },
  // 批量删除
  batchDeleteExercise: (values) => {
    return request({
      url: '/nurse-train-web/nursetrain/web/write/template/exercise/v3.1.3/batchDeleteExercise',
      options: {
        method: 'DELETE',
        data: JSON.stringify(values)
      },
      api: 'nurseTrainApi'
    });
  }
}
