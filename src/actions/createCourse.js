import request from '../core/_utils/request';
import { getCache } from '../core/_utils/storage';
import { IEVersion } from '../core/_utils/common';
import serialize from '../core/_utils/serialize';
import { PAGE_SIZE } from '../constants';

import { message } from 'antd';
import { } from '../actions/'

const { hospitalId, userId, roleId, depts } = getCache('profile').roleId ? getCache('profile') : window[`GET_ADMIN_INFO`][`profile`];
const { fromPage, hospitalId: innerHospitalId } = getCache('innerFromPage') || {};

/* 
  计算 试卷 数据的存储值：
 */
const computedEditPaperData = function (currentCoursePaperResponse, source) {
  // 兼容处理旧有代码逻辑 取值
  const data = Object.assign({}, { data: source }); // const examPeperDetail = {

  // 单选  single  1
  // 多选  many  2
  // 判断  judge  3
  // 填空  completion  4
  // let currentCoursePaperResponse = res.data.paperResponseDTO, // 3.4.0 [替换] res.data.paperResponseDTOList 数组,
  let currentCoursePaperResponseData = {}, paperListData = null;

  let singleScore = '';
  let manyScore = '';
  let judgeScore = '';
  let completionScore = '';
  let singleListRes = [];
  let manyListRes = [];
  let judgeListRes = [];
  let completionRes = [];

  if (typeof currentCoursePaperResponse !== 'undefined') {
    // 3.4.0 [更新] currentCoursePaperResponse 更新为数组数据
    // currentCoursePaperResponseData = currentCoursePaperResponse[0].exerciseRspDTOList;
    currentCoursePaperResponseData = currentCoursePaperResponse.exerciseRspDTOList ? currentCoursePaperResponse.exerciseRspDTOList : [];

    currentCoursePaperResponseData.map((item) => {
      switch (item.type) {
        case 1:
          singleScore = item.score;
          singleListRes.push(item);
          break;
        case 2:
          manyScore = item.score;
          manyListRes.push(item);
          break;
        case 3:
          judgeScore = item.score;
          judgeListRes.push(item);
          break;
        case 4:
          completionScore = item.score;
          completionRes.push(item);
          break;
        default:
          break;
      }
    });

    let singleList = [], manyList = [], judgeList = [], completionList = [];
    let selectedSingleRowsMap = new Map([]), selectedManyRowsMap = new Map([]), selectedJudgeRowsMap = new Map([]), selectedCompletionRowsMap = new Map([]);
    for (const record of singleListRes) {
      const selectList = [];
      record.exerciseItemRspDTOList.map((checkItem) => {
        const doList = {
          hiddenNo: checkItem.hiddenNo,
          no: checkItem.no,
          name: checkItem.name
        };
        selectList.push(doList);
      });
      const template = {
        type: record.type,
        name: record.name,
        answer: record.answer,
        explainStr: record.explainStr,
        id: record.id,
        difficulty: record.difficulty,
        level: record.level,
        exerciseItemDOList: selectList,
        exerciseClassifyCode: record.exerciseClassifyCode,
        exerciseClassifyName: record.exerciseClassifyName,
        templateExerciseId: record.templateExerciseId,
      };
      if (record.templateExerciseId) {
        selectedSingleRowsMap.set(record.templateExerciseId, template);
      }
      singleList[singleList.length] = template;
    }

    for (const record of manyListRes) {
      const selectList = [];
      record.exerciseItemRspDTOList.map((checkItem) => {
        const doList = {
          hiddenNo: checkItem.hiddenNo,
          no: checkItem.no,
          name: checkItem.name
        };
        selectList.push(doList);
      });
      const template = {
        type: record.type,
        name: record.name,
        answer: record.answer,
        explainStr: record.explainStr,
        id: record.id,
        difficulty: record.difficulty,
        level: record.level,
        exerciseItemDOList: selectList,
        exerciseClassifyCode: record.exerciseClassifyCode,
        exerciseClassifyName: record.exerciseClassifyName,
        templateExerciseId: record.templateExerciseId,
      };
      if (record.templateExerciseId) {
        selectedManyRowsMap.set(record.templateExerciseId, template);
      }
      manyList[manyList.length] = template;
    }

    for (const record of judgeListRes) {
      let selectList = [];
      record.exerciseItemRspDTOList.map((checkItem) => {
        const doList = {
          hiddenNo: checkItem.hiddenNo,
          no: checkItem.no,
          name: checkItem.name
        };
        selectList.push(doList);
      });
      const template = {
        type: record.type,
        name: record.name,
        answer: record.answer,
        explainStr: record.explainStr,
        id: record.id,
        difficulty: record.difficulty,
        level: record.level,
        exerciseItemDOList: selectList,
        exerciseClassifyCode: record.exerciseClassifyCode,
        exerciseClassifyName: record.exerciseClassifyName,
        templateExerciseId: record.templateExerciseId,
      };
      if (record.templateExerciseId) {
        selectedJudgeRowsMap.set(record.templateExerciseId, template);
      }
      judgeList[judgeList.length] = template;
    }

    for (const record of completionRes) {
      const selectList = [];
      record.exerciseItemRspDTOList.map((checkItem) => {
        const doList = {
          hiddenNo: checkItem.hiddenNo,
          no: checkItem.no,
          name: checkItem.name
        };
        selectList.push(doList);
      });
      const template = {
        type: record.type,
        name: record.name,
        answer: record.answer,
        explainStr: record.explainStr,
        id: record.id,
        difficulty: record.difficulty,
        level: record.level,
        exerciseItemDOList: selectList,
        exerciseClassifyCode: record.exerciseClassifyCode,
        exerciseClassifyName: record.exerciseClassifyName,
        templateExerciseId: record.templateExerciseId,
        answerMatchType: record.answerMatchType  // 选择填空题时需要
      };
      if (record.templateExerciseId) {
        selectedCompletionRowsMap.set(record.templateExerciseId, template);
      }
      completionList[completionList.length] = template;
    }
    const selectedAllQuestionsMap = new Map([
      ['1', selectedSingleRowsMap],
      ['2', selectedManyRowsMap],
      ['3', selectedJudgeRowsMap],
      ['4', selectedCompletionRowsMap],
    ]);
    const questionsListMap = new Map([
      ['1', singleList],
      ['2', manyList],
      ['3', judgeList],
      ['4', completionList],
    ]);
    const questionsScoreMap = new Map([
      ['1', singleScore],
      ['2', manyScore],
      ['3', judgeScore],
      ['4', completionScore],
    ]);
    const examPeperDetail = { // ？？已废弃
      paperId: data.data.id,
      describe: data.data.describe,
      cover: data.data.cover,
      name: data.data.name,
      level: data.data.level,
      sourceId: data.data.sourceId,
    };
    return { examPeperDetail, selectedAllQuestionsMap, questionsListMap, questionsScoreMap };
  }
}

export function addCourse(course) {
  return (dispatch) => {
    return request({
      url: `/nurse-train-web/nursetrain/web/course/write/v3.4.0/course`,
      options: {
        method: 'POST',
        data: JSON.stringify(course),
      },
      api: 'nurseTrainApi'
    });
  }

}

export function editCourse(course) {
  return (dispatch) => {
    return request({
      url: `/nurse-train-web/nursetrain/web/course/write/v3.4.0/course`,
      options: {
        method: 'PUT',
        data: JSON.stringify(course),
      },
      api: 'nurseTrainApi'
    })
  }

}

// 查询 课程分类
export function queryCourseClassificationList(query) {
  const params = {
    innerFromPage: fromPage,
  };
  return (dispatch) => {
    return request({
      url: `/nurse-train-web/nursetrain/web/basic/read/v1.0.1/dataDictionaryList`,
      options: {
        method: 'GET',
        data: serialize(query),
      },
      api: 'nurseTrainApi'
    }).then(data => {
      if (!data.success) {
        message.error(data.errMsg);
        return;
      }
      const courseClassification = JSON.parse(JSON.stringify(data.data).replace(/name":/g, 'label":').replace(/code":/g, 'value":'));
      return courseClassification;
    });
  }
}

export function queryTrainClassifyList() {
  const params = {
    innerFromPage: fromPage,
  };
  return (dispatch) => {
    return request({
      url: `/nurse-train-web/nursetrain/web/basic/read/v1.0.1/trainClassifyList/${hospitalId}`,
      options: {
        method: 'GET',
      },
      api: 'nurseTrainApi'
    }).then((data) => {
      const trainClassifyList = data.data
      return trainClassifyList;
    });
  }
}

export function queryCourseDetailForEdit({ courseId }) {
  return (dispatch) => {
    request({
      url: `/nurse-train-web/nursetrain/web/course/read/v3.4.0/searchForEdit/${courseId}`,
      options: {
        method: 'GET',
      },
      api: 'nurseTrainApi'
    }).then((res) => {
      if (res.success) {
        const data = res.data;
        const lecturerObj = JSON.parse(data.courseRespDTO.lecturer);
        let lecturerCreditStatusSwitch = false;
        for (let i in lecturerObj) {
          const { post = '', lecturerCredit = 0 } = lecturerObj[i];
          if (lecturerCredit > 0) {
            lecturerCreditStatusSwitch = true;
          }
        }

        dispatch({
          type: 'course/saveCurrentCourse',
          payload: {
            currentCourse: res.data
          }
        });
        dispatch({
          type: 'course/lecturerCreditStatusSwitch',
          payload: { lecturerCreditStatus: lecturerCreditStatusSwitch }
        });
      }

      const createTestProcessData = computedEditPaperData(res.data.paperResponseDTO, res);
      dispatch({
        type: 'createExamPaper/saveEditPaperData',
        payload: createTestProcessData,
      });

      const createTestAheadData = computedEditPaperData(res.data.prePaperResponseDTO, res);
      dispatch({
        type: 'createTestAhead/saveEditPaperData',
        payload: createTestAheadData,
      });
    });
  }
}


export function getQuestionCategorie() {
  let _t = '';
  if (IEVersion()) {
    _t = Math.random();
  }
  return request({
    url: `/nurse-train-web/nursetrain/web/basicDict/read/v2.2.7/dict?hospitalId=${hospitalId}&type=EXERCISE&_t=${_t}`,
    options: {
      method: 'GET',
    },
    api: 'nurseTrainApi'
  });
}

export function fetchTeacherList(query) {
  if (IEVersion()) {
    return request({
      url: `/nurse-train-web/nursetrain/web/basic/read/v1.0.1/lecturerPage?pageNum=${query.page}&pageSize=${query.pageSize ? query.pageSize : PAGE_SIZE}&name=${query.name ? query.name : ''}&unitTypes=${query.teacherType === "0" ? '' : query.teacherType}&hospitalId=${getCache('profile').hospitalId}&t=${Math.random()}`,
      options: {
        method: 'GET',
      },
      api: 'nurseTrainApi'
    });
  } else {
    return request({
      url: `/nurse-train-web/nursetrain/web/basic/read/v1.0.1/lecturerPage?pageNum=${query.page}&pageSize=${query.pageSize ? query.pageSize : PAGE_SIZE}&name=${query.name ? query.name : ''}&unitTypes=${query.teacherType === "0" ? '' : query.teacherType}&hospitalId=${hospitalId}`,
      options: {
        method: 'GET',
      },
      api: 'nurseTrainApi'
    });
  }

}

export function fetchCoursewareList(query) {
  let _t = '';
  if (IEVersion()) {
    _t = Math.random();
  }
  const params = {
    pageSize: query.pageSize || 10,
    roleId,
    pageNum: query.page || 1,
    hospitalId: query.sourceId || getCache('profile').hospitalId,
    courseClassifyCodeParent: query.courseClassify,
    courseClassifyCode: query.courseClassifyChildren,
    trainClassifyCode: query.trainClassifyChildren || query.trainClassify,
    name: query.name,
    accountId: query.accountId || -1,
    _t,
  };
  return request({
    url: `/nurse-train-web/nursetrain/web/read/template/resource/v2.1.2/resourcePage?${serialize(params)}`,
    options: {
      method: 'GET',
    },
    api: 'nurseTrainApi'
  });
}

export function submitCourseData({ payload: { course, type, props } }) {
  return (dispatch, getState) => {
    const state = getState();
    const locationQuery = state.course.locationQuery;
    let dataHandler = (result) => {
      const data = result.data;
      if (result.success) {
        if (!data) {
          message.error('课程创建失败，请稍后重试！');
          dispatch({
            type: 'course/saveSubmitLoading',
            payload: {
              submitLoading: false
            }
          });
          return;
        }

        if (type === 'add') {
          message.success('创建成功');
        } else {// edit
          message.success('修改成功');
        }
        let isInsertQuestionVideo = false;
        let totalScoreNumber = 0;
        if (course.paperRequestDTO && course.resourceReqDTOList.length > 0) {
          course.resourceReqDTOList.map((item) => {
            if (item.fileType === 'mp4') {
              isInsertQuestionVideo = true;
            }
          });
          // totalScoreNumber = course.paperRequestDTO.totalScore;
        }
        if (course.paperRequestDTO) { // 试题分数值 设置
          totalScoreNumber = course.paperRequestDTO.totalScore;
        }

        const query = {
          courseId: data.courseId,
          contentId: data.id,
          personnelRequest: encodeURIComponent(course.courseReqDTO.trainClassifyName),// 培训课程的应用人员：对象要求
          totalScore: totalScoreNumber, // 创建 培训课程时，传入 总分数
          hadExercise: course.paperRequestDTO ? 1 : 0,
          homeWorkFlag: course.contentReqDTO && course.contentReqDTO.homeWork ? 1 : 0, // 注意，字段名称是： homeWork
          insertQuestionAbled: isInsertQuestionVideo ? '1' : '0',
          trainModel: course.courseReqDTO.trainModel,
          type,
          leaseStartTime: locationQuery.leaseStartTime,
          leaseEndTime: locationQuery.leaseEndTime,
          systemTime: locationQuery.systemTime
        };
        dispatch({
          type: 'course/resetState'
        });

        props.history.push({
          pathname: '/hospital-admin/nurse-training-course/create-course-success.html',
          search: `?${serialize(query)}`
        });

        // yield put(routerRedux.push({
        //   pathname: '/trainings-manage/create-course-success',
        //   query: {
        //     courseId: data.data.courseId,
        //     contentId: data.data.id,
        //     personnelRequest: encodeURIComponent(course.courseReqDTO.trainClassifyName),// 培训课程的应用人员：对象要求
        //     hadExercise: course.paperRequestDTO ? 1 : 0,
        //     insertQuestionAbled: isInsertQuestionVideo ? '1' : '0',
        //     trainModel: course.courseReqDTO.trainModel,
        //     type,
        //     leaseStartTime: locationQuery.leaseStartTime,
        //     leaseEndTime: locationQuery.leaseEndTime,
        //     systemTime: locationQuery.systemTime
        //   }
        // }));

        dispatch({
          type: 'course/saveSubmitLoading',
          payload: {
            submitLoading: false
          }
        });
      } else {
        message.error(result.errMsg);
        dispatch({
          type: 'course/saveSubmitLoading',
          payload: {
            submitLoading: false
          }
        });
      }
    }

    if (type === 'add') {
      dispatch(addCourse(course)).then((res) => {
        dataHandler(res);
      });
    } else {
      dispatch(editCourse(course)).then((res) => {
        dataHandler(res);
      });
    }

  }
}


export function editTeacher({ payload: { teacherValue } }) {
  return (dispatch, getState) => {
    return request({
      url: `/nurse-train-web/nursetrain/web/basic/write/v1.0.1/lecturer`,
      options: {
        method: 'PUT',
        data: JSON.stringify(teacherValue)
      },
      api: 'nurseTrainApi'
    }).then((res) => {
      if (res.success) {
        message.success('修改成功');
      } else {
        message.error(res.errMsg);
      }
      const state = getState();
      const query = state.course.teacherQuery;
      // dispatch()
      return query;
    });

  }
}

export function addTeacher({ payload: { lecturerReqDTOList } }) {
  return (dispatch, getState) => {
    return request({
      url: `/nurse-train-web/nursetrain/web/basic/write/v1.0.1/lecturer`,
      options: {
        method: 'POST',
        // data: serialize(lecturerReqDTOList)
        data: JSON.stringify({ lecturerReqDTOList })
      },
      api: 'nurseTrainApi'
    }).then((res) => {
      if (res.success) {
        message.success('操作成功');
      } else {
        message.error(res.errMsg);
      }
      const state = getState();
      const query = state.course.teacherQuery;
      return query;
    });
  }
}

export function queryTestStatisticsPage(data) {
  return (dispatch) => {
    return request({
      url: '/satisfaction-center-web/satisfactioncenter/empPaperStatus/read/v3.0.0/getUnreleased',
      options: {
        method: 'GET',
        data
      },
      api: 'www_satisfactionApi'
    });
  }
}

export function getValid() { // 非 dispatch 触发
  return request({
    url: '/satisfaction-center-web/satisfactioncenter/employee/read/v3.0.0/getValid',
    options: {
      method: 'GET',
    },
    api: 'www_satisfactionApi'
  });
}
