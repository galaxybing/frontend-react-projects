import React from 'react';
import { Icon, Checkbox, Popover } from 'antd';
import styles from './RenderCreatePaperTest.css';
import { strOrNumConvert } from '../../../core/_utils/common';

class RenderCreatePaperTest extends React.Component {
  constructor(props) {
    super(props);
    let questionStatusArr = [];
    for (let i = 0; i < props.questionList.length; i++) {
      questionStatusArr.push(false);
    }
    this.state = {
      questionStatusArr: questionStatusArr,
      questionHeightArr: [],
      checkedQuestionsKeyMap: new Map([]),
      allQuestionsOpen: props.allQuestionsOpen
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.allQuestionsOpen) {
      this.state.questionStatusArr.map((item, index) => {
        this.state.questionStatusArr[index] = true;
        this.state.questionHeightArr[index] = this.refs[`questionItem${index}`].clientHeight + 10;
      });
      this.setState({
        allQuestionsOpen: true,
        questionHeightArr: this.state.questionHeightArr
      });
    } else {
      this.state.questionStatusArr.map((item, index) => {
        this.state.questionStatusArr[index] = false;
        this.state.questionHeightArr[index] = 45;
      });
      this.setState({
        allQuestionsOpen: false,
        questionHeightArr: this.state.questionHeightArr
      });
    }
  }
  openQuestionItem = (index) => {
    //if (!this.props.allQuestionsOpen) {
    this.state.questionStatusArr[index] = !this.state.questionStatusArr[index];
    this.state.questionHeightArr[index] = this.refs[`questionItem${index}`].clientHeight + 10;
    this.setState({
      allQuestionsOpen: false
    })
    //}
  }
  checkedQuestion = (e, id) => {
    const checked = e.target.checked;
    const { checkedQuestionsKeyMap } = this.props;
    if (checked) {
      checkedQuestionsKeyMap.set(id);
    } else {
      checkedQuestionsKeyMap.delete(id);
    }
    this.props.checkedQuestionItem([...checkedQuestionsKeyMap.keys()]);
  }

  paperResponseDTOListFun() {
    let { questionList } = this.props;
    let testStr = '';
    if (questionList) {
      questionList = JSON.parse(JSON.stringify(questionList).replace(/exerciseRspDTOList":/g, 'exerciseDOList":').replace(/exerciseItemRspDTOList":/g, 'exerciseItemDOList":'));

      for (let i = 0; i < questionList.length; i++) {
        testStr = [...testStr, this.randerTestQuestion(questionList[i], questionList[i].type, i)];
      }
    }
    return testStr;
  }
  scrollTopByQuestion = (type, index) => {
  }
  randerTestQuestion = (data, type, index) => {
    const { curOpenQuestionKey } = this.state;
    let curOpenQuestionHeight = this.state.questionStatusArr[index] ? this.state.questionHeightArr[index] : 45;

    let answerStr = null;

    if (type === 2) {  // 多选
      answerStr = data.exerciseItemDOList.map(d => {
        let icon = (<Icon className={styles.checkboxIcon} type="check-square" />);
        if (data.answer.indexOf(d.no) === -1) {
          icon = (<span className={styles.checkbox} />);
        }
        const key = index + d.no;
        return (<div key={key} className={styles.questionItem}>{icon}{d.no}.{d.name}</div>);
      });
    } else if (type === 4) {  // 填空
      answerStr = data.exerciseItemDOList.map((d, idx) => {
        const key = index + d.no;
        return (<div key={key} className={styles.questionItem}>第{strOrNumConvert(idx + 1)}处答案：{d.name}</div>);
      });
    } else {  // 单选、判断
      answerStr = data.exerciseItemDOList.map(d => {
        let icon = (<span className={`${styles.circle} ${styles.circleChecked}`}><span className={styles.inCircle} /></span>);
        if (data.answer.indexOf(d.no) === -1) {
          icon = (<span className={styles.circle} />);
        }
        const key = index + d.no;
        return (<div key={key} className={styles.questionItem}>{icon}{d.no}.{d.name}</div>);
      });
    }

    let rightAnswers = '';
    if (data.answer.indexOf(',') > -1) {
      rightAnswers = data.answer;
    } else {
      rightAnswers = data.answer.split('').join(',');
    }
    const checkedQuestionsKey = this.props.checkedQuestionsKeyMap.has(data.templateExerciseId || data.id);
    const repeatQuestionsList = [];
    for (const item of this.props.allQuestionList) {
      if (item.name === data.name) {
        repeatQuestionsList[repeatQuestionsList.length] = item;
      }
    }
    const repeatQuestionsItem = repeatQuestionsList.map((item, ind) => {
      if (item.templateExerciseId !== data.templateExerciseId) {
        return (
          <li key={ind} title={`${item.no}.${item.name}`} onClick={() => this.scrollTopByQuestion(item.type, item.no)}>
            <span className={styles.questionTypeRepeat}>{this.renderQuestionType(item.type)}</span>
            <span className={styles.title}>{item.no}.{item.name}</span>
          </li>
        );
      }
    });

    return (
      <div
        key={index}
        className={repeatQuestionsList.length > 1 ? `${styles.repeatTips} ${styles.createPaperQuestionItem}` : styles.createPaperQuestionItem}
        style={this.state.allQuestionsOpen ? { height: this.state.questionHeightArr[index] } : { height: curOpenQuestionHeight }}
        ref={`questionItem-${data.type}-${index}`}
      >
        <div ref={`questionItem${index}`}>
          <div className={styles.questionItemTitle} onClick={() => this.openQuestionItem(index)}>
            <div className={styles.questionItemTitleCont}>
              <div className={styles.questionItemType}>
                <Checkbox
                  onChange={e => this.checkedQuestion(e, data.templateExerciseId || data.id)}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.nativeEvent.stopImmediatePropagation();
                  }}
                  checked={checkedQuestionsKey}
                />
                {this.renderQuestionType(type)}
              </div>
              <div className={styles.questionItemName}>
                <div>
                  <span>{index + 1}.{data.name}</span>
                  {
                    type !== 4 ? <span className={styles.rightAnswers}>正确答案：{rightAnswers}</span> : ''
                  }
                </div>
                {
                  repeatQuestionsList.length > 1 ?
                    <span style={{ float: 'right' }}>
                      <Popover
                        placement="bottomRight"
                        content={
                          <div>
                            <span style={{ color: '#666' }}>该试题与以下试题出现重复：</span>
                            <ul className={styles.renderRepeatQList}>
                              {repeatQuestionsItem}
                            </ul>
                          </div>
                        }
                        arrowPointAtCenter
                        overlayStyle={{ width: 300 }}
                      >
                        <Icon type="exclamation-circle" className={styles.createPaperTipsIcon} />
                      </Popover>
                    </span> : ''
                }
              </div>
            </div>
          </div>
          <div style={{ marginBottom: 10 }}>
            {answerStr}
          </div>
        </div>
      </div>);
  }
  renderQuestionType = (type) => {
    let tpl = '';
    switch (type) {
      case 1:
        tpl = (<span className="question-type-lable single">单选题</span>);
        break;
      case 2:
        tpl = (<span className="question-type-lable multiple">多选题</span>);
        break;
      case 3:
        tpl = (<span className="question-type-lable trueFalse">判断题</span>);
        break;
      default:
        tpl = (<span className="question-type-lable fillBlank">填空题</span>);
        break;
    }
    return tpl;
  }
  render() {
    return (
      <div>
        {this.paperResponseDTOListFun()}
      </div>
    );
  }
}

export default RenderCreatePaperTest;
