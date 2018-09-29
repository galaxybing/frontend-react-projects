import React from 'react';
import { connect } from "react-redux";
import ChooseQuestionsComponent from '../Widgets/QuerstionModal/ChooseQuestionsModal';
import { getTestList, getRandomTestList } from '../../actions/questionsManage';
import { PAGE_SIZE } from '../../constants';

function ChooseQuestions({ dispatch, chooseQuestions, filtrate, filtrateItem, selectedRowsMap, selectedOk, questionTotalNum, curQuestionType }) {
  const {
    loading,
    questionsList,
    visible,
    isRandomQuestionsList,
    questionsQuery,
    // curQuestion,
    // payTypeModalVisible
  } = chooseQuestions;
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
        type: 'chooseQuestions/hideModal'
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

      // chooseQuestions/fetchQuestionsList
      getTestList({ ...questionsQuery, sourceId: key, questionId: null, page: 1, hadSelectIds, customTag: null }).then((res) => {
        dispatch({
          type: 'chooseQuestions/isRandomQuestions',
          payload: { isRandomQuestionsList: false },
        });
        dispatch({
          type: 'chooseQuestions/save',
          payload: { questionsList: res.data, questionsQuery: query },
        })
      })
    },
    showPayTypeModal(record) {
      dispatch({
        type: 'chooseQuestions/showPayTypeModal',
        payload: {
          curQuestion: record,
        }
      });
    },
    questionsFiltrateProps: {
      filtrateItem,
      fromPage: 'chooseQuestions',
      onChange(query) {
        // chooseQuestions/fetchQuestionsList
        getTestList({ ...questionsQuery, ...query, hadSelectIds, page: 1 }).then((res) => {
          dispatch({
            type: 'chooseQuestions/isRandomQuestions',
            payload: { isRandomQuestionsList: false },
          });
          dispatch({
            type: 'chooseQuestions/save',
            payload: { questionsList: res.data, questionsQuery: query },
          })
        })
        // dispatch({
        //   type: 'chooseQuestions/fetchQuestionsList',
        //   payload: { query: { ...questionsQuery, ...query, hadSelectIds, page: 1 } }
        // });
      }
    },
    selectedOk: (selectedList, curSelectedList) => {// 新增的？？旧有的代码没有
      dispatch({
        type: 'createExamPaper/saveQuestionsListForChoose',
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
function mapStateToProps(state) {
  // const loading = state.loading.models.chooseQuestions;
  const chooseQuestions = { ...state.chooseQuestions /*, loading*/ };
  const filtrate = { ...state.filtrate };
  return { chooseQuestions, filtrate };
}
export default connect(mapStateToProps)(ChooseQuestions);
