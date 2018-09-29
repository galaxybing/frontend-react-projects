import React from 'react';
import { connect } from 'react-redux';
// import InsertQuestionsComponent from '../InsertQuestions/InsertQuestions';
import InsertQuestionsComponent from '../InsertQuestionsModal';

function InsertQuestions({ dispatch, insertQuestions, reload }) {
  const {
    modalVisible,
    videoInsertQuestions,
    insertQuestionsList,
    modalType,
  } = insertQuestions;

  const insertQuestionsProps = {
    visible: modalVisible,
    videoInsertQuestions,
    insertQuestionsList,
    modalType,
    saveChooseQuestion(item) {
      dispatch({
        type: 'insertQuestions/saveInsertQuestions',
        payload: { questionItem: item }
      });
    },
    deleteInsertQuestions(resourceId, exerciseId, index) {
      dispatch({
        type: 'insertQuestions/deleteInsertQuestions',
        payload: { resourceId, exerciseId, index }
      });
    },
    hideModal() {
      dispatch({
        type: 'insertQuestions/hideModal'
      });
    },
    saveQuestions(values) {
      dispatch({
        type: 'insertQuestions/saveQuestions',
        payload: { values }
      });
      reload();// 新建课程时，保存课程的重置操作为：获取插入试题的数字
    }
  };
  return (
    <InsertQuestionsComponent {...insertQuestionsProps} />
  );
}
function mapStateToProps(state) {
  // const loading = state.loading.models.insertQuestions;
  const insertQuestions = { ...state.insertQuestions/*, loading */};
  return { insertQuestions };
}
export default connect(mapStateToProps)(InsertQuestions);
