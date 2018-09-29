import { message } from 'antd';
import request from '../core/_utils/request';
import { getCache } from '../core/_utils/storage';
import { IEVersion } from '../core/_utils/common';
import serialize from '../core/_utils/serialize';

const { roleId, userId, hospitalId, deptId, deptName, name, urseId } = getCache('profile') || {};
const { fromPage } = getCache('innerFromPage') || {};

module.exports = {
  // 创建试卷
  createExamPaper: (values) => {
    return request({
      url: '/nurse-train-web/nursetrain/web/paper/write/v2.1.2/paper',
      options: {
        method: 'POST',
        data: JSON.stringify(values)
      },
      api: 'nurseTrainApi'
    });
  },
  // 修改试卷
  editExamPaper: (values) => {
    return request({
      url: '/nurse-train-web/nursetrain/web/paper/write/v2.1.2/paper',
      options: {
        method: 'PUT',
        data: JSON.stringify(values)
      },
      api: 'nurseTrainApi'
    });
  },
  // 根据层级，试题分类查询试题 分类总数
  getExerciseCountsOld: (query) => {
    const params = {
      hospitalId,
      levelName: query.levelName,
      levelCode: query.level,
      typeName: query.exerciseClassifyChildrenName || query.exerciseClassifyName,
      exerciseClassifyCode: query.exerciseClassifyChildren || query.exerciseClassify
    };
    return (dispatch) => {
      request({
        url: `/nurse-train-web/nursetrain/web/read/template/exercise/v2.6.2/exerciseCounts?data=${JSON.stringify(params)}`,
        options: {
          method: 'GET'
        },
        api: 'nurseTrainApi'
      }).then(data => {
        if (!data.success) {
          message.error(message.errMsg);
          return
        }
        const testAreaQueryNum = {
          single: data.data.singleChoices,
          many: data.data.multipleChoices,
          judge: data.data.trueOrFalses,
          completion: data.data.completions
        };
        dispatch({
          type: 'createExamPaperRand/save',
          payload: {
            testAreaSetting: query,
            testAreaQueryNum,
            loadTestAreaSetting: true
          }
        });
      });
    }
  },
  // 获取符合条件的试题数目(2.7.4)
  getExerciseCounts: (query) => {
    return (dispatch) => {
      request({
        url: `/nurse-train-web/nursetrain/web/read/template/exercise/v2.7.4/exerciseCounts?${serialize(query)}`,
        options: {
          method: 'GET'
        },
        api: 'nurseTrainApi'
      }).then(data => {
        if (!data.success) {
          message.error(data.errMsg);
          return;
        }
        dispatch({
          type: 'createExamPaperRand/save',
          payload: { exerciseCounts: data.data, filter: query }
        })
      })
    }
  },
  // 随机试卷详情(旧版)
  getOldRandomPaperDetail: (query) => {
    const params = {
      innerFromPage: fromPage,
      roleId,
      accountId: userId,
      ...query
    };
    return (dispatch) => {
      request({
        url: `/nurse-train-web/nursetrain/web/paper/read/v2.6.2/randomPaper?data=${JSON.stringify(params)}`,
        options: {
          method: 'GET'
        },
        api: 'nurseTrainApi'
      }).then(data => {
        if (!data.success) {
          message.error(data.errMsg);
          return;
        }
        if (data.success && !data.data) {
          message.error('试卷不存在!');
          return;
        }
        let exerciseClassify,
          exerciseClassifyChildren,
          exerciseClassifyChildrenName,
          exerciseClassifyName;
        if (data.data.exerciseClassifyCode) {
          if (data.data.exerciseClassifyCode.length > 4) {
            exerciseClassifyChildren = data.data.exerciseClassifyCode;
            exerciseClassify = (data.data.exerciseClassifyCode + '').substring(0, 4);
          } else {
            exerciseClassify = data.data.exerciseClassifyCode;
          }
        }
        if (data.data.exerciseClassifyName) {
          let exerciseClassifyArray = data.data.exerciseClassifyName.split('||');
          exerciseClassifyName = exerciseClassifyArray[0];
          exerciseClassifyChildrenName = exerciseClassifyArray[1];
        }
        const param = {
          level: data.data.levelCode,
          levelName: data.data.levelClassifyName,
          exerciseClassify,
          exerciseClassifyChildren,
          exerciseClassifyChildrenName,
          exerciseClassifyName
        };
        dispatch(module.exports.getExerciseCountsOld(param));
        dispatch({
          type: 'createExamPaperRand/save',
          payload: {
            paperDetail: data.data,
          }
        });
      });
    }
  },

  // 随机试卷详情(新版)
  getNewRandomPaperDetail: (query) => {
    const params = {
      innerFromPage: fromPage,
      roleId,
      ...query
    };
    return (dispatch) => {
      request({
        url: `/nurse-train-web/nursetrain/web/paper/read/v2.7.4/randomPaper?${serialize(params)}`,
        options: {
          method: 'GET'
        },
        api: 'nurseTrainApi'
      }).then(data => {
        if (!data.success) {
          message.error(data.errMsg);
          return;
        }
        const subjectCode = [];
        for (const item of data.data.subjectPercentList) {
          subjectCode.push(item.code)
        }
        const param = {
          level: data.data.levelCode,
          department: data.data.department || '',
          customTag: data.data.customTag,
          updateStartTime: data.data.updateStartTime,
          updateEndTime: data.data.updateEndTime,
          subject: subjectCode.join(','),
        };
        dispatch(module.exports.getExerciseCounts(param));
        dispatch({
          type: 'createExamPaperRand/save',
          payload: {
            paperDetail: {
              _paperType: 3,
              paperId: query.id,
              ...data.data,
            },
          }
        });
      });
    }
  },

  // 新增随机组卷(2.7.4)
  createRandomPaper: (values) => {
    let role = 2;
    if (roleId === 10001) {
      role = 1;
    } else if (roleId === 10004) {
      role = 3;
    }
    const params = {
      deptId,
      deptName,
      createName: name,
      publishLevel: role,
      ...values,
    };
    return request({
      url: '/nurse-train-web/nursetrain/web/paper/write/v2.7.4/newRandomPaper',
      options: {
        method: 'POST',
        data: JSON.stringify(params)
      },
      api: 'nurseTrainApi'
    })
  },

  // 修改随机组卷(2.7.4)
  editRandomPaper: (values) => {
    return request({
      url: '/nurse-train-web/nursetrain/web/paper/write/v2.7.4/newRandomPaper',
      options: {
        method: 'PUT',
        data: JSON.stringify(values)
      },
      api: 'nurseTrainApi'
    })
  }
}