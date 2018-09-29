'use strict';

import type { Action, ThunkAction } from '../actions/types';
import { message } from 'antd';

export type Config = {
  Network: string;
};

const initialState: Config = {
  submitLoading: false,
  currentCourse: null,
  courseClassification: [],
  trainingClassification: [],
  exerciseClassifyList: [],
  chooseModalVisible: false,
  addType: 'create',
  // addVisible: false,
  questionModalVisible: false,
  editQuestionModalVisible: false,
  chooseCoursewareModalVisible: false,
  createCoursewareModalVisible: false,
  // chooseQuestionsModalVisible: false,
  chooseTestModalVisible: false,
  clearTypeNum: null,
  current: {},
  currentQuestionIndex: 0,
  currentQuestion: {},
  chooseIdMap: new Map([]),
  accessPath: 'create',
  testType: 1,
  teacherList: [],
  teacherQuery: {},
  questionsQuery: {},
  chooseQuestionsList: [],
  courseClassifyCode: null,
  trainClassifyCode: null,
  courseClassifyCodeParent: null,
  selectedQuestionsMap: new Map([]),
  questionList: [],
  questionsListForSelected: [],
  fileList: [],
  coursewareList: [],  // 课件查询列表
  coursewareQuery: {},  // 课件查询参数
  selectedCoursewareMap: new Map([]),
  questionsListEdit: false,  // 试题是否修改过,
  questionModalType: 'create',
  publicHospitalId: null,
  locationQuery: {},  // url参数
  /* 3.4.0 [新增] */
  currentSelectedTestStatisticsData: null,
}

function course(state: Config = initialState, action: Action) {
  if (action.type === 'course/save') {
    return {
      ...state,
      ...action.payload,
    }
  }

  if (action.type === 'course/resetState') { // 初始 培训课程的数据模型
    return {
      ...initialState,
    }
  }

  if (action.type === 'course/savePublicHospitalId') {
    return {
      ...state,
      ...action.payload,
    }
  }
  if (action.type === 'course/courseClassification') {
    return {
      ...state,
      ...action.payload,
    }
  }
  if (action.type === 'course/saveCurrentCourse') { // 编辑界面 请求数据后 进行同步
    const { currentCourse } = action.payload;
    let questionList = [];
    let fileList = [];
    if (currentCourse.paperResponseDTOList) {
      questionList = JSON.parse(JSON.stringify(currentCourse.paperResponseDTOList[0].exerciseRspDTOList).replace(/exerciseRspDTOList":/g, 'exerciseDOList":').replace(/exerciseItemRspDTOList":/g, 'exerciseItemDOList":'));
    }

    if (currentCourse.resourceRespDTOList) {
      fileList = currentCourse.resourceRespDTOList;
    }
    //3.4.0修改讲师的数据格式
    const chooseIdMap = new Map();
    let lecturerObj = JSON.parse(currentCourse.courseRespDTO.lecturer);
    for(let i in lecturerObj){
      const { post = '', lecturerCredit = 0} = lecturerObj[i];
      chooseIdMap.set(lecturerObj[i].lecturerId, { name: lecturerObj[i].lecturerName, post, lecturerCredit });
    }
    const selectedQuestionsMap = new Map();
    const selectedCoursewareMap = new Map();

    // v2.3.6重构（课件）
    for (const resource of fileList) {
      const template = {
        type: resource.type,
        fileType: resource.fileType,
        url: resource.url,
        fileName: resource.fileName,
        transcodingId: resource.type === 1 ? resource.transcodingId : '',
        returnUrl: resource.type === 1 ? resource.returnUrl : '',
        templateResourceId: resource.templateResourceId,
        // id: resource.templateResourceId ? resource.templateResourceId : resource.id,
        id: resource.id,
        hashCode: resource.hashCode,
        sizeNumber: resource.sizeNumber,
        size: resource.size,
        courseClassifyCode: resource.courseClassifyCode,
        trainClassifyCode: resource.trainingClassification,
        courseClassifyName: resource.courseClassifyName,
        trainClassifyName: resource.trainClassifyName,
        pdfUrl: resource.pdfUrl,
        taskId: resource.taskId,
        hospitalId: resource.templateHospitalId,  // 用来判断是否是公共医院的
        
        privateFlag: resource.privateFlag, // 新增 字段 3.4.0
        needWatchTime: resource.needWatchTime,
        downloadFlag: resource.downloadFlag,
      };
      if (resource.templateResourceId) {
        selectedCoursewareMap.set(resource.templateResourceId, template);
      }
    }
    // v2.3.6重构（试题）
    for (const record of questionList) {
      const template = {
        type: record.type,
        name: record.name,
        answer: record.answer,
        explainStr: record.explainStr,
        id: record.id,
        difficulty: record.difficulty,
        level: record.level,
        exerciseItemDOList: record.exerciseItemDOList,
        exerciseClassifyCode: record.exerciseClassifyCode,
        exerciseClassifyName: record.exerciseClassifyName,
        templateExerciseId: record.templateExerciseId,
        imageUrl: record.imageUrl,
      };
      if (record.templateExerciseId) {
        selectedQuestionsMap.set(record.templateExerciseId, template);
      }
    }
    let courseCode = [];
    if (currentCourse.courseRespDTO && currentCourse.courseRespDTO.courseClassifyCode) {
      courseCode = currentCourse.courseRespDTO.courseClassifyCode.split(',');
    }

    let courseClassifyCodeParent = null;
    let courseClassifyCode = null;
    if (courseCode.length > 1) {
      courseClassifyCodeParent = courseCode[0];
      courseClassifyCode = courseCode[courseCode.length - 1];
    } else {
      courseClassifyCode = courseCode[courseCode.length - 1];
    }
    const trainClassifyCode = currentCourse.courseRespDTO.trainClassifyCode;
    return {
      ...state,
      currentCourse,
      questionList,
      chooseIdMap,
      fileList,
      selectedCoursewareMap,
      courseClassifyCode,
      trainClassifyCode,
      courseClassifyCodeParent,
      selectedQuestionsMap,
    };
  }

  if (action.type === 'course/resetCoursewareResources') {
    return {
      ...state,
      fileList: [],
    };
  }

  if (action.type === 'course/saveCourseClassifyCode') {
    const { courseClassifyCodeParent, courseClassifyCode } = action.payload;
    return { ...state, courseClassifyCodeParent, courseClassifyCode }
  }

  if (action.type === 'course/exerciseClassify') {
    return {
      ...state,
      ...action.payload,
    }
  }

  // 获取 讲师数据，且弹出选择层
  if (action.type === 'course/showChooseTeacherModal') {
    const { teacherList, teacherQuery } = action.payload;
    return { ...state, teacherList, teacherQuery, chooseModalVisible: true, /* addVisible: false */ };
  }

  if (action.type === 'course/showChooseCoursewareModal') {
    const { coursewareList, coursewareQuery } = action.payload;
    return { ...state, coursewareList, coursewareQuery, chooseCoursewareModalVisible: true };
  }

  if (action.type === 'course/showCreateCoursewareModal') {
    return { ...state, ...action.payload, createCoursewareModalVisible: true };
  }

  if (action.type === 'course/deleteCoursewareByIndex') {
    const { index, coursewareID } = action.payload;

    const { fileList, selectedCoursewareMap } = state;
    selectedCoursewareMap.delete(coursewareID);
    fileList.splice(index, 1);
    message.success('删除成功');
    return { ...state, selectedCoursewareMap, fileList, questionsListEdit: true };
  }

  if (action.type === 'course/saveSubmitLoading') {
    const { submitLoading } = action.payload;
    return { ...state, submitLoading };
  }

  if (action.type === 'course/hideChooseTeacherModal') {
    return { ...state, /* addVisible: false, */ chooseModalVisible: false };
  }

  if (action.type === 'course/saveChooseTeacherModal') {
    const { selectRowMap } = action.payload;
    return { ...state, chooseIdMap: selectRowMap, chooseModalVisible: false }
  }
  if (action.type === 'course/deleteLecturerIdMap') {
    let { lecturerKey } = action.payload;
    state.chooseIdMap.delete(lecturerKey);
    return { ...state }
  }
  if (action.type === 'course/resetLecturerIdMap') { // 重置 为空选择
    return { ...state, chooseIdMap: new Map([])}
  }
  if (action.type === 'course/lecturerCreditStatusSwitch') {
    let { lecturerCreditStatus } = action.payload;
    return { ...state, lecturerCreditStatus }
  }
  // 废弃： addVisible 变量？
  // if (action.type === 'course/addTeacherModal') {
  //   const { addType, current = {} } = action.payload;
  //   return { ...state, addType, current, addVisible: true };
  // }

  // 新增讲师


  // 编辑讲师信息
  if (action.type === 'course/hideEditTeacherModal') {
    return { ...state, chooseModalVisible: true, /*addVisible: false */ };
  }

  // 添加课件 弹层
  if (action.type === 'course/hideChooseCoursewareModal') {
    return { ...state, chooseCoursewareModalVisible: false };
  }
  // 选择课件
  if (action.type === 'course/saveFileListForChoose') {
    const { selectedList/*, curSelectedList*/ } = action.payload;
    const { fileList } = state;
    const fileListForUpload = [];
    for (const record of fileList) {
      // const template = {
      //   type: record.type,
      //   name: record.name,
      //   answer: record.answer,
      //   explainStr: record.explainStr,
      //   id: record.id,
      //   difficulty: record.difficulty,
      //   level: record.level,
      //   exerciseItemDOList: record.exerciseItemDOList,
      //   exerciseClassifyCode: record.exerciseClassifyCode,
      //   exerciseClassifyName: record.exerciseClassifyName,
      //   templateExerciseId: record.templateExerciseId,
      // };
      if (!record.templateResourceId) {
        fileListForUpload.push(record);
      }
    }
    fileListForUpload.push.apply(fileListForUpload, [...selectedList.values()]);
    // fileList.push.apply(fileList, [...curSelectedList.values()]);
    return { ...state, selectedCoursewareMap: selectedList, fileList: fileListForUpload };
  }


  if (action.type === 'course/hideCreateCoursewareModal') {
    return { ...state, createCoursewareModalVisible: false };
  }

  if (action.type === 'course/saveFileListForUpload') {
    const { fileItem } = action.payload;
    const { fileList } = state;
    fileList.push.apply(fileList, fileItem);
    return { ...state, fileList };
  }
  if (action.type === 'course/saveCurrentSelectedTestStatisticsData') {
    const { currentSelectedTestStatisticsData } = action.payload;
    return { ...state, currentSelectedTestStatisticsData };
  }

  return state;
}
module.exports = course;
