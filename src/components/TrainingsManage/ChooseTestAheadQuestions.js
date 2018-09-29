import React from 'react';
import { connect } from "react-redux";
import ChooseQuestionsComponent from '../Widgets/QuerstionModal/ChooseQuestionsModal';
import { getTestList, getRandomTestList } from '../../actions/questionsManage';
import { PAGE_SIZE } from '../../constants';

function ChooseTestAheadQuestions({ dispatch, chooseTestAheadQuestions, filtrate, filtrateItem, selectedRowsMap, selectedOk, questionTotalNum, curQuestionType }) {
  const {
    loading,
    questionsList,
    visible,
    isRandomQuestionsList,
    questionsQuery,
    // curQuestion,
    // payTypeModalVisible
  } = chooseTestAheadQuestions;
  let hadSelectIds = null;
  if (selectedRowsMap && selectedRowsMap.size > 0) {
    hadSelectIds = [...selectedRowsMap.keys()].join(',');
  }
  const { exerciseTrade, publicQuestionClassifyList, isShowPayPopoverMap, isPopoverVisibleMap, balanceFee, payLoading } = filtrate;
  const chooseQuestionsProps = {
    loading,
    questionsList,
    visible,
    isRandomQuestionsList,
    questionsQuery,
    selectedRowsMap: selectedRowsMap || new Map([]),
    exerciseTrade,
    publicQuestionClassifyList,
    isShowPayPopoverMap,
    isPopoverVisibleMap,
    questionTotalNum,
    curQuestionType,
    onCancel() {
      dispatch({ type: 'filtrate/resetState' });
      dispatch({
        type: 'chooseTestAheadQuestions/hideModal'
      });
    },
    saveQuestionsListForSelected(selected, curSelect) {
      selectedOk(selected, curSelect);
      chooseQuestionsProps.onCancel();
    },
    hospitalChange(key) {
      const { isShowSubFiltrateMap, selectedOptionsMap, exerciseTrade } = filtrate;
      selectedOptionsMap.set('sourceId', key).set('trainingId', null).set('questionId', null);
      isShowSubFiltrateMap.set('trainingId', false).set('questionId', false);
      dispatch({
        type: 'filtrate/saveSelectedByHospital',
        payload: {
          isShowSubFiltrateMap,
          selectedOptionsMap,
        }
      });

      getTestList({ ...questionsQuery, sourceId: key, questionId: null, page: 1, hadSelectIds, customTag: null }).then((res) => {
        dispatch({
          type: 'chooseTestAheadQuestions/isRandomQuestions',
          payload: { isRandomQuestionsList: false },
        });
        dispatch({
          type: 'chooseTestAheadQuestions/save',
          payload: { questionsList: res.data, questionsQuery: query },
        })
      })
    },
    showPayTypeModal(record) {
      dispatch({
        type: 'chooseTestAheadQuestions/showPayTypeModal',
        payload: {
          curQuestion: record,
        }
      });
    },
    questionsFiltrateProps: {
      filtrateItem,
      fromPage: 'chooseTestAheadQuestions',
      onChange(query) {
        getTestList({ ...questionsQuery, ...query, hadSelectIds, page: 1 }).then((res) => {
          dispatch({
            type: 'chooseTestAheadQuestions/isRandomQuestions',
            payload: { isRandomQuestionsList: false },
          });
          dispatch({
            type: 'chooseTestAheadQuestions/save',
            payload: { questionsList: res.data, questionsQuery: query },
          })
        })
      }
    },
    selectedOk: (selectedList, curSelectedList) => {// 新增的？？旧有的代码没有
      dispatch({
        type: 'createTestAhead/saveQuestionsListForChoose',
        payload: { selectedList, curSelectedList }
      });
      chooseQuestionsProps.onCancel();// 隐藏掉选择试题弹层
    }
  };

  return (
    <div>
      <ChooseQuestionsComponent {...chooseQuestionsProps} />
    </div>
  );
}
function select(state) {
  const chooseTestAheadQuestions = { ...state.chooseTestAheadQuestions };
  const filtrate = { ...state.filtrate };
  return { chooseTestAheadQuestions, filtrate };
}
export default connect(select)(ChooseTestAheadQuestions);
