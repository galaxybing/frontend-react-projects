import React from 'react';
import { connect } from "react-redux";
import { message } from 'antd';
import { Link } from "react-router-dom";

import { searchStrToObj } from '../../../core/_utils/common';
import { queryPublicHospital } from '../../../actions';
import {
  queryCourseClassificationList,
  queryTrainClassifyList,
  queryCourseDetailForEdit,
  getQuestionCategorie,
  fetchTeacherList,
  fetchCoursewareList,
  submitCourseData,
  editCourse,
  editTeacher,
  addTeacher,
} from '../../../actions/createCourse';

import MainLayout from "../../../components/Widgets/MainLayout";
import BreadNavList from '../../../components/Widgets/BreadNavList';
import CourseForm from '../../../components/TrainingsManage/CourseForm';
import ChooseTeacherModal from '../../../components/TrainingsManage/ChooseTeacherModal';
import AddTeacherModal from '../../../components/TrainingsManage/AddTeacherModal';
import QuerstionModal from '../../../components/Widgets/QuerstionModal/QuerstionModal';

import ChooseCoursewareModal from '../../../components/TrainingsManage/ChooseCoursewareModal';
import CoursewareCreateModal from '../../../components/Widgets/CoursewareCreateModal';
import ChooseQuestionsModal from '../../../components/TrainingsManage/ChooseQuestions';
import ChooseTestAheadQuestionsModal from '../../../components/TrainingsManage/ChooseTestAheadQuestions';
// import styles from './style.css';

// function Course({ location, dispatch, course, chooseQuestions, filtrate, createExamPaper }) {
class Course extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalCreateCoursewareLoading: false,
    }
  }
  componentDidMount() {
    const dispatch = this.props.dispatch;

    const { search } = this.props.location;
    let query = {};
    if (search) {
      query = searchStrToObj(search);
    }
    this.props.dispatch({ // 清除 讲师选择项
      type: 'course/resetLecturerIdMap',
    });
    // ?获取公共医院id
    dispatch(queryPublicHospital());
    if (query.currentCourseId) {
      dispatch(queryCourseDetailForEdit({ courseId: query.currentCourseId }));
      dispatch({  // 保存url参数，主要是租赁课程需要
        type: 'course/save',
        payload: { locationQuery: query }
      })
    } else { // 新建 培训课程界面时；移除 上传课件留存情况
      dispatch({  // 保存url参数，主要是租赁课程需要
        type: 'course/resetCoursewareResources'
      })
    }

    dispatch(queryCourseClassificationList({ "groupId": 3, "type": 0 })).then((courseClassification) => {
      dispatch(queryTrainClassifyList()).then((trainingClassification) => {
        dispatch({
          type: 'course/courseClassification',
          payload: {
            courseClassification,
            trainingClassification,
          }
        });
      });
    });

    // 
    getQuestionCategorie().then((res) => {
      let exerciseClassifyList = JSON.parse(JSON.stringify(res.data).replace(/name":/g, 'label":').replace(/code":/g, 'value":'));
      dispatch({
        type: 'course/exerciseClassify',
        payload: {
          exerciseClassifyList,
        }
      })
    });

  }
  render() {
    
    const { location, dispatch, course, chooseQuestions, chooseTestAheadQuestions, filtrate, courseTestAhead, createExamPaper } = this.props;
    const { currentCourse, fileList, trainingClassification, courseClassification,
      chooseModalVisible, loading, addType, current, chooseIdMap, teacherList, questionModalVisible, currentQuestion, currentQuestionIndex, testType, chooseCoursewareModalVisible,
      createCoursewareModalVisible, coursewareList, coursewareQuery,
      submitLoading, selectedCoursewareMap, questionsListEdit, exerciseClassifyList, trainClassifyCode,
      courseClassifyCode, courseClassifyCodeParent, questionList, questionModalType, publicHospitalId,
      // selectedQuestionsMap
      lecturerCreditStatus,
    } = course;
    const { examPeperDetail, questionsListMap, questionsScoreMap, checkedQuestionItemMap, selectedAllQuestionsMap, curTestType, questionTotalNum } = createExamPaper;
    const selectedQuestionsMap = selectedAllQuestionsMap.get(curTestType);

    let trainModel = 'offline'; // 默认值 现场培训
    const { search } = this.props.location;
    let query = {};
    if (search) {
      query = searchStrToObj(search);
    }
    trainModel = query.type;
    const currentCourseId = query.currentCourseId;
    // const trainModel = location.query.type;
    // const currentCourseId = location.query ? location.query.currentCourseId : undefined;

    const _that = this;
    const formProps = {
      dispatch,
      lecturerCreditStatus,
      currentCourse,
      fileList,
      chooseIdMap,
      courseClassification,
      courseClassifyCode,
      trainingClassification,
      loading,
      submitLoading,
      questionList,
      testType,
      questionsListEdit,
      chooseCoursewareModalVisible,
      publicHospitalId,
      openChooseModal() {
        const query = {
          page: 1,
          teacherName: '',
          teacherType: ''
        };
        fetchTeacherList(query).then((res) => {
          dispatch({
            type: 'course/showChooseTeacherModal',
            payload: { teacherList: res.data, teacherQuery: query }
          });
        });
      },
      closeTagHandler(e, lecturerKey) {
        e.stopPropagation();
        dispatch({
          type: 'course/deleteLecturerIdMap',
          payload: { lecturerKey }
        });
      },
      deleteCoursewareByIndex(index, coursewareID) {
        dispatch({
          type: 'course/deleteCoursewareByIndex',
          payload: { index, coursewareID }
        });
      },
      submitCourseHandler(course, type) {
        dispatch({
          type: 'course/saveSubmitLoading',
          payload: {
            submitLoading: true
          }
        });
        
        dispatch(submitCourseData({ payload: { course, type, props: _that.props } }));
      },
      openCreateQuestion() {
        dispatch({
          type: 'course/showCreateQuestionModal',
          payload: { questionModalType: 'create' }
        });
      },
      openChooseCoursewareModal() {
        fetchCoursewareList({}).then((res) => {
          dispatch({
            type: 'course/showChooseCoursewareModal',
            payload: { coursewareList: res.data, coursewareQuery: query }
          });
        });
      },
      openCreateCoursewareModal() {
        dispatch({
          type: 'course/showCreateCoursewareModal'
        });
      },
      /*
      openChooseQuestionsModal() {
        dispatch({
          type: 'chooseQuestions/fetchQuestionsList',
          payload: { query: { hadSelectIds: [...selectedQuestionsMap.keys()].join(',') } }
        });
      },
      */
      saveTrainClassifyCode(code) {
        dispatch({
          type: 'course/saveTrainClassifyCode',
          payload: { trainClassifyCode: code }
        });
      },
      saveCourseClassifyCode(code, codeParent) {
        dispatch({
          type: 'course/saveCourseClassifyCode',
          payload: { courseClassifyCode: code, courseClassifyCodeParent: codeParent }
        });
      },
      renderQuestionModalForChooseProps: {  // 选择试题
        canEditDelete: true,
        questionList,
        accessPath: 'choose',
        deleteQuestionByIndex(index, accessPath, questionsId) {
          dispatch({
            type: 'course/deleteQuestionByIndex',
            payload: { index, questionsId }
          });
        },
        editQuestionByIndex(index, accessPath) {
          dispatch({
            type: 'course/editQuestionByIndex',
            payload: { index, accessPath }
          });
        }
      },

      currentCourseId,
      trainModel,
      /* 随堂测试 props 配置 */
      examPeperDetail,
      questionsListMap,
      questionsScoreMap,
      checkedQuestionItemMap,
      onChooseTest(testType, totalNum) {
        dispatch({
          type: 'createExamPaper/saveTypeNum',
          payload: { curTestType: testType }
        });
        dispatch({
          type: 'chooseQuestions/showModal',
        });
        dispatch({
          type: 'createExamPaper/saveOtherData',
          payload: {
            questionTotalNum: totalNum
          }
        })
      },
      onCreateTest(num) {
        dispatch({
          type: 'createExamPaper/saveTypeNum',
          payload: { curTestType: num }
        });
        dispatch({
          type: 'createExamPaper/showCreateQuestionModal',
          payload: { questionModalType: 'create' }
        });
      },
      clearTestByType(num) {
        dispatch({
          type: 'createExamPaper/showClearTestModal',
          payload: {
            clearTypeNum: num
          }
        });
      },
      onCreateExamPaper(paper, saveType) {
        dispatch({
          type: 'createExamPaper/savePaper',
          payload: { paper, saveType }
        });
      },
      onEditExamPaper(paper, saveType) {
        dispatch({
          type: 'createExamPaper/editPaper',
          payload: { paper, saveType }
        });
      },
      deleteQuestionByIndex(index, QaccessPath, questionsId) {
        dispatch({
          type: 'createExamPaper/deleteQuestionByIndex',
          payload: { index, accessPath: QaccessPath, questionsId }
        });
      },
      editQuestionByIndex(index, QaccessPath) {
        dispatch({
          type: 'createExamPaper/editQuestionByIndex',
          payload: { index, accessPath: QaccessPath }
        });
      },
      // 保存复选框选中的试题（2.6.2)
      saveCheckedQuestion(list, type) {
        dispatch({
          type: 'createExamPaper/saveCheckedQuestion',
          payload: { questionList: list, type }
        });
      },
      deleteQuestionByType(type) {
        dispatch({
          type: 'createExamPaper/deleteQuestionByType',
          payload: { type }
        });
      }
    };
    const chooseTeacherModalProps = {
      visible: chooseModalVisible,
      loading,
      chooseIdMap,
      teacherList,
      teacherListResult: teacherList.result,
      dispatch,
      handleCancel() {
        dispatch({
          type: 'course/hideChooseTeacherModal'
        })
      },
      handleOk(selectRowMap) {
        dispatch({
          type: 'course/saveChooseTeacherModal',
          payload: { selectRowMap }
        })
      },
      fetchTercherList(query) {
        fetchTeacherList(query).then((res) => {
          dispatch({
            type: 'course/showChooseTeacherModal',
            payload: { teacherList: res.data, teacherQuery: query }
          });
        });
        // dispatch({
        //   type: 'course/fetchTeacherList',
        //   payload: { query }
        // })
      },
    };
    const questionModalProps = {
      visible: questionModalVisible,
      modalType: questionModalType,
      exerciseClassifyList,
      currentQuestion,
      fromPage: 'course',  // 当前页面是课程页
      hideQuestionModal() {
        dispatch({
          type: 'course/hideCreateQuestionModal'
        });
      },
      saveQuestionByCreate(questionItem, type) {
        dispatch({
          type: 'course/saveQuestionForCreate',
          payload: { questionItem, type }
        });
      },
      saveQuestionByEdit(questionItem) {
        dispatch({
          type: 'course/submitEditQuestion',
          payload: { questionItem, index: currentQuestionIndex }
        });
      },
    };

    // 课件 选择
    const chooseCoursewareModalProps = {
      visible: chooseCoursewareModalVisible,
      loading,
      coursewareList,
      coursewareQuery,
      fileList,
      selectedCoursewareMap,
      onCancel() {
        dispatch({
          type: 'course/hideChooseCoursewareModal'
        })
        dispatch({
          type: 'filtrate/resetState'
        })
      },
      saveFileListForChoose(selectedList, curSelectedList) {
        dispatch({
          type: 'course/saveFileListForChoose',
          payload: { selectedList, curSelectedList }
        });
        chooseCoursewareModalProps.onCancel();
      },
      fetchCoursewareList(query) {
        fetchCoursewareList(query).then((res) => {
          dispatch({
            type: 'course/showChooseCoursewareModal',
            payload: { coursewareList: res.data, coursewareQuery: query }
          })
        });

        // dispatch({
        //   type: 'course/fetchCoursewareList',
        //   payload: { query }
        // });
      },
      hospitalChange(key) {
        const { isShowSubFiltrateMap, selectedOptionsMap } = filtrate;
        selectedOptionsMap.set('sourceId', key).set('trainingId', null).set('questionId', null);
        isShowSubFiltrateMap.set('trainingId', false).set('questionId', false);
        dispatch({
          type: 'filtrate/saveSelectedByHospital',
          payload: {
            isShowSubFiltrateMap,
            selectedOptionsMap,
          }
        });

        fetchCoursewareList({ ...coursewareQuery, sourceId: key, trainingId: null, page: 1 }).then((res) => {
          dispatch({
            type: 'course/showChooseCoursewareModal',
            payload: { coursewareList: res.data, coursewareQuery: query }
          })
        });
        // dispatch({
        //   type: 'course/fetchCoursewareList',
        //   payload: { query: { ...coursewareQuery, sourceId: key, trainingId: null, page: 1 } }
        // });
      },
      coursewareFiltrateProps: {
        filtrateItem: ['courseClassify', 'trainClassify'],
        onChange(query) {
          fetchCoursewareList({ ...coursewareQuery, ...query, page: 1 }).then((res) => {
            dispatch({
              type: 'course/showChooseCoursewareModal',
              payload: { coursewareList: res.data, coursewareQuery: query }
            })
          });
          // dispatch({
          //   type: 'course/fetchCoursewareList',
          //   payload: { query: { ...coursewareQuery, ...query, page: 1 } }
          // });
        }
      }
    };
    // 课件 上传
    const createCoursewareModalProps = {
      visible: createCoursewareModalVisible,
      loading: this.state.modalCreateCoursewareLoading,
      fromPage: 'course',
      trainClassifyCode,
      courseClassifyCode,
      courseClassifyCodeParent,
      onCancel: () => {
        this.setState({
          modalCreateCoursewareLoading: false,
        });
        dispatch({
          type: 'course/hideCreateCoursewareModal'
        });
      },
      onOk: (fileItem) => {
        this.setState({
          modalCreateCoursewareLoading: true,
        });
        dispatch({
          type: 'course/saveFileListForUpload',
          payload: { fileItem }
        });
        createCoursewareModalProps.onCancel();
      },
    };

    const chooseQuestionsModalProps = {
      filtrateItem: ['level', 'department', 'subject', 'difficulty'],
      selectedRowsMap: selectedQuestionsMap,
      questionTotalNum,
      curQuestionType: curTestType,
      selectedOk(selectedList, curSelectedList) {
        dispatch({
          type: 'createExamPaper/saveQuestionsListForChoose',
          payload: { selectedList, curSelectedList }
        });
      },
    };
    
    const chooseTestAheadQuestionsModalProps = {
      filtrateItem: ['level', 'department', 'subject', 'difficulty'],
      selectedRowsMap: courseTestAhead.selectedQuestionsMap, // ?
      questionTotalNum: courseTestAhead.questionTotalNum,
      curQuestionType: courseTestAhead.curTestType, // ? courseTestAhead
      selectedOk(selectedList, curSelectedList) {
        dispatch({
          type: 'createTestAhead/saveQuestionsListForChoose',
          payload: { selectedList, curSelectedList }
        });
      },
    };

    const pageBreadTitle = trainModel === 'offline' ? '现场培训' : '在线培训';
    return (
      <MainLayout location={location}>
        <div className="boz-component-header">
          <BreadNavList
            dataSource={[
              { name: '培训课程', link: '/hospital-admin/nurse-training-course/trainings-manage.html' },
              { name: currentCourseId ? `编辑${pageBreadTitle}` : `新建${pageBreadTitle}` }
            ]}
          />
        </div>
        <div className="boz-component-body">
          <CourseForm {...formProps} />
        </div>

        {chooseModalVisible ? <ChooseTeacherModal {...chooseTeacherModalProps} /> : ''}
        {questionModalVisible ? <QuerstionModal {...questionModalProps} /> : ''}
        {chooseCoursewareModalVisible ? <ChooseCoursewareModal {...chooseCoursewareModalProps} /> : ''}
        {createCoursewareModalVisible ? <CoursewareCreateModal {...createCoursewareModalProps} /> : ''}
        {chooseQuestions.visible ? <ChooseQuestionsModal {...chooseQuestionsModalProps} /> : ''}
        {chooseTestAheadQuestions.visible ? <ChooseTestAheadQuestionsModal {...chooseTestAheadQuestionsModalProps} /> : ''}
      </MainLayout>
    );
  }
}

function select(state) {
  const course = { ...state.course, /* loading */ };
  const chooseQuestions = { ...state.chooseQuestions };
  const chooseTestAheadQuestions = { ...state.chooseTestAheadQuestions };
  const filtrate = { ...state.filtrate };

  // 随堂测试
  const createExamPaper = { ...state.createExamPaper };
  const courseTestAhead = { ...state.courseTestAhead };
  return { course, chooseQuestions, chooseTestAheadQuestions, filtrate, courseTestAhead, createExamPaper };
}
function actions(dispatch, ownProps) {
  return {
    dispatch,
  };
};

export default connect(select, actions)(Course);
