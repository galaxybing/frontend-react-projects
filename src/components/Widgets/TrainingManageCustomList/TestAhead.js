import React, { Component } from 'react';
import { connect } from "react-redux";
import {
  Icon, message, Form, Tooltip, Button, Popconfirm, Checkbox, Select, Input, Switch
} from 'antd';
import LinkSprite from './LinkSprite';
import RenderTestComponent from '../RenderTest/RenderCreatePaperTest';
import styles from './style.css';
import { QUESTION_TYPE } from '../../../constants';

const FormItem = Form.Item;

class TestAhead extends Component {
  constructor(props) {
    super(props);
    this.state = {
      switchPannel: false,
      scoreType: '1',  // 1: 按空数  0: 按题数
      allQuestionsOpenMap: new Map([]),
    }
    // 计算 课前评估的题数：初始化状态下
    this.computeQuestionsListTestProcess(props.questionsListMap);
  }
  componentWillReceiveProps(nextProps) {
    // courseTestAhead
    this.computeQuestionsListTestProcess(nextProps.questionsListMap);
    if (
      !_.isEqual(this.questionsListTestProcessTotalNum, nextProps.totalNum)
      || !_.isEqual(this.questionsListTestProcessTotalScore, nextProps.totalScore)
      || !_.isEqual(this.exerciseDOList, nextProps.exerciseDOList)
    ) {
      this.props.dispatch({
        type: 'createTestAhead/saveTotalValue',
        payload: {
          totalNum: this.questionsListTestProcessTotalNum,
          totalScore: this.questionsListTestProcessTotalScore,
          exerciseDOList: this.exerciseDOList
        }
      });
    }

  }
  componentWillUnmount() {
    this.props.dispatch({
      type: 'createTestAhead/resetState'
    })
  }
  computeQuestionsListTestProcess = (listMap) => {
    const { getFieldValue } = this.props.form;
    // 计算 随堂测试的总体属性，以展示：
    let exerciseDOList = [];
    let questionTotalScore = 0;
    this.questionsListTestProcessTotalNum = 0;
    this.questionsListTestProcessTotalScore = 0;
    for (const [key, value] of listMap) {
      let len = (value || []).length;
      // 总题数
      this.questionsListTestProcessTotalNum += len;
      // 总分
      const score = getFieldValue(`questionsTestAheadScore${key}`) || 0;
      let fillBlankCount = 0;
      if (key == 4 && this.state.scoreType === '1') {  // 按空数计算的填空题，总分数是根据空数来决定
        for (const exercise of value) {
          fillBlankCount += exercise.exerciseItemDOList.length;
        }
        questionTotalScore += (score * fillBlankCount);
      } else {
        questionTotalScore += (score * len);
      }
      // 题数列表
      for (let obj of value) {
        obj.score = score;
        if (key == 4) {  // 填空题得分类型
          obj.scoreType = this.state.scoreType;
        }
        exerciseDOList[exerciseDOList.length] = obj;
      }
    }

    this.questionsListTestProcessTotalScore = Number(questionTotalScore.toFixed(1));
    this.exerciseDOList = exerciseDOList;
  }
  switchPannelHandler = () => {
    this.setState({
      switchPannel: !this.state.switchPannel,
    })
  }
  renderAddQuestionButton = (totalNum, id) => {
    return (
      <Tooltip title={totalNum >= 200 ? '最多添加200道试题，请删除部分后再添加' : ''}>
        <Button disabled={totalNum >= 200} onClick={() => this.onChooseTest(id, totalNum)} type="primary" ghost>添加试题</Button>
      </Tooltip>
    );
  }
  handleNum = (rule, value, callback) => {
    if (value && (!/^\d+(\.\d{1})?$/.test(value) || value == 0)) {
      callback(' ');
    } else {
      callback();
    }
  }
  onCheckAllChange = (e, type, list) => {
    const checked = e.target.checked;
    const listKey = [];
    for (const item of list) {
      listKey[listKey.length] = item.templateExerciseId || item.id;
    }
    this.props.saveCheckedQuestion(checked ? listKey : [], type);
  }
  checkRepeat = (name, index, list) => {
    const repeatList = [];
    list.map((value, idx) => {
      if (index !== idx && value.name === name) {
        repeatList[repeatList.length] = value;
      }
    });
    return repeatList;
  }
  onChooseTest = (testType, totalNum) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'createTestAhead/saveTypeNum',
      payload: { curTestType: testType }
    });
    dispatch({
      type: 'chooseTestAheadQuestions/showModal',
    });
    dispatch({
      type: 'createTestAhead/saveOtherData',
      payload: {
        questionTotalNum: totalNum
      }
    })
  }
  render () {
    const { questionsScoreMap, checkedQuestionItemMap, questionsListMap, /*allQuestionsOpenMap, */form, dataSource } = this.props;
    const { allQuestionsOpenMap } = this.state;
    const { getFieldDecorator, getFieldValue } = form;
    
    // 获取所有试题
    const allQuestionList = [];
    for (const value of questionsListMap.values()) {
      value.map((item, index) => {
        item.no = index + 1;
        allQuestionList[allQuestionList.length] = item;
      });
    }
    // 获取所有重复试题
    const repeatQuestionsList = [];
    allQuestionList.map((item, index) => {
      const list = this.checkRepeat(item.name, index, allQuestionList);
      repeatQuestionsList.push.apply(repeatQuestionsList, list);
    });
    
    // 渲染试题类型
    const examPaperFormItem = QUESTION_TYPE.map((item) => {
      const checkedQuestionsKeyMap = new Map([]);
      const questionsList = questionsListMap.get(item.id) || [];
      const questionsScore = questionsScoreMap.get(item.id) || '';
      const checkedQuestion = checkedQuestionItemMap.get(item.id) || '';
      const allQuestionsOpen = allQuestionsOpenMap.get(item.id) || false;
      const questionsScoreByType = getFieldValue(`questionsTestAheadScore${item.id}`) || 0;

      for (const id of checkedQuestion) {
        checkedQuestionsKeyMap.set(id);
      }
      const renderQuestionModal = {
        allQuestionList,
        questionList: questionsList,
        accessPath: item.id,
        questionType: item.type,
        checkedQuestionsKeyMap,
        allQuestionsOpen,
        checkedQuestionItem: list => this.props.saveCheckedQuestion(list, item.id)
      };

      let scoreTypeStr = '题';
      let fillBlankCount = 0, questionListCount = questionsList.length;
      let scoreTypeStr2 = '道';
      if (item.value === 4 && this.state.scoreType === '1') {
        scoreTypeStr = '空';
        scoreTypeStr2 = '空';
        for (const value of questionsList) {
          fillBlankCount += value.exerciseItemDOList.length;
        }
        questionListCount = fillBlankCount;
      }

      return (
        <FormItem key={item.type} style={{ margin: 0 }}>
          <div className={styles.questionItemHeader}>
            <span className={styles.qitemTitle}>{item.label}</span>
            { // 填空题
              item.value === 4 ?
                <Select style={{ width: 80, marginLeft: 10 }} value={`${this.state.scoreType}`} onChange={(value) => this.setState({ scoreType: value })}>
                  <Select.Option value="1">按空数</Select.Option>
                  <Select.Option value="0">按题数</Select.Option>
                </Select> : ''
            }
            <div className={styles.qitemContent}>
              {/*总*/}{scoreTypeStr}数:<span className="primary-color">{questionListCount}</span>{scoreTypeStr2}
              <span style={{ marginLeft: 20 }}>每小{scoreTypeStr}分数&nbsp;
              <Tooltip trigger={['focus']} title="分数设置支持小数点保留1位">
                  {
                    getFieldDecorator(`questionsTestAheadScore${item.id}`, {
                      initialValue: questionsScore,
                      rules: [
                        {
                          required: questionsList.length > 0,
                          message: ' '
                        },
                        { validator: this.handleNum }
                      ],
                      // onChange: e => this.questionsScoreChange(e, item.id)
                    })(
                      <Input style={{ width: 60 }} />
                    )
                  }
                </Tooltip>&nbsp;分
              </span>
              <span style={{ marginLeft: 10 }}>
                共:<span className="primary-color">
                  {questionsScoreByType && (!isNaN(questionsScoreByType)) ? (questionListCount * questionsScoreByType).toFixed(1) : '-'}
                </span>分
                </span>
            </div>
          </div>
          <div className={styles.questionItemContent}>
            {questionsList.length ?
              <div className={styles.renderBox}>
                <div className={styles.renderBoxHeader}>
                  <span>
                    <Checkbox
                      indeterminate={checkedQuestion.length > 0 && (checkedQuestion.length !== questionsList.length)}
                      onChange={e => this.onCheckAllChange(e, item.id, questionsList)}
                      checked={checkedQuestion.length === questionsList.length}
                    >
                      全选
                    </Checkbox>
                  </span>
                  <Popconfirm title="确认删除试题?" onConfirm={() => this.props.deleteQuestionByType(item.id)}>
                    <span>删除</span>
                  </Popconfirm>
                  <span
                    onClick={() => {
                      allQuestionsOpenMap.set(item.id, !allQuestionsOpen);
                      this.setState({ allQuestionsOpenMap });
                    }}
                    style={{ userSelect: 'none' }}
                  >{allQuestionsOpen ? '收起全部试题' : '展开全部试题'}</span>
                  <div style={{ float: 'right' }}>
                    {this.renderAddQuestionButton(this.totalNum, item.id)}
                  </div>
                </div>
                <RenderTestComponent {...renderQuestionModal} />
              </div> :
              <div style={{ textAlign: 'center' }}>
                {this.renderAddQuestionButton(this.totalNum, item.id)}
              </div>}
          </div>
        </FormItem>
      );
    });
    
    return (
      <div className={ this.state.switchPannel ? `${styles.createCourseItemSprite} ${styles.createCourseContent} ${styles.createCourseItemSpriteClosePannel}`: `${styles.createCourseItemSprite} ${styles.createCourseContent}`} style={{ marginBottom: 0 }}>
        <span className={styles.icoStepNumber}>{dataSource.ind}</span>
        <div className={styles.createCourseTitle} style={{ marginBottom: 0 }}>
          <LinkSprite switchPannel={this.switchPannelHandler} deletePannel={this.props.deletePannel} deleteAble={!dataSource.required}  linkTabName={dataSource.tab} />
          课前评估
          <span style={{fontSize: 14, marginLeft: 15}}>总题数:<span className="primary-color">{this.questionsListTestProcessTotalNum}</span>道</span>
          <span style={{ fontSize: 14, marginLeft: 15 }}>总分数:<span className="primary-color">{this.questionsListTestProcessTotalScore}</span>分</span>
        </div>
        <div className={styles.createCourseItemContent}>
          {
            repeatQuestionsList.length ?
              <span className={styles.questionRepeatTips}><Icon type="exclamation-circle" style={{ marginRight: 8 }} className={styles.createPaperTipsIcon} />选择的试题出现重复</span> : ''
          }
          <div style={{ marginTop: 1 }}>
            {examPaperFormItem}
          </div>
        </div>
      </div>
    )
    
  }
}

function select(state) {
  return { ...state.courseTestAhead };
}

function actions(dispatch, ownProps) {
  return {
    dispatch,
  };
};

export default connect(select, actions)(TestAhead);
