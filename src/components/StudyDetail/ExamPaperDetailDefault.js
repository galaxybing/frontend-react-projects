import React, { Component } from 'react';
import { Icon, Input } from 'antd';
import { strOrNumConvert } from '../../core/_utils/common';
import { QUESTION_TYPE } from '../../constants';
import styles from './ExamPaperDetailDefault.css';

class ExamPaperDetailDefault extends Component {

  renderOptions = (question, type) => {
    return (
      question.exerciseItemDOList.map((item, index) => {
        let str;
        if (type == 1 || type == 3) {
          if (question.answer.indexOf(item.no) === -1) {
            str = <span className={styles.circle} />;
          } else {
            str = <span className={styles.circleCheck}> <span className={styles.circleChecked} /></span>;
          }
        } else if (type == 2) {
          if (question.answer.indexOf(item.no) === -1) {
            str = <span className={styles.square} />;
          } else {
            str = <Icon type="check-square" className={styles.squareCheck} />;
          }
        } else if (type == 4) {
          str = (
            <span>第{strOrNumConvert(index + 1)}处填空：<Input readOnly style={{ width: 200 }} /></span>
          );
        }
        return (
          <p key={index}>
            <span>{str}{item.no}、{item.name}</span>
          </p>
        );
      })
    );
  }
  renderBlankAnswer = (answerList, result) => {  // 渲染填空题答案
    return (
      answerList.map((item, index) => {
        let color = '#00B990';
        if (result !== undefined && !result) {
          color = '#FF0036';
        }
        return (
          <span key={index} style={{ marginRight: 15 }}>
            第{strOrNumConvert(index + 1)}处填空：
            <span
              style={{ color }}
            >{item.name}</span>
          </span>
        );
      })
    );
  }
  renderShareTitleQuestion = (list) => {
    let questionList = [];
    for (const type of QUESTION_TYPE) {
      let exerciseDOList = []
      for (const item of list) {
        item.type = parseInt(item.type);
        if (type.value === item.type) {
          exerciseDOList.push(item);
        }
      }
      if (exerciseDOList.length) {
        let totalCount = exerciseDOList.length, totalScore = 0;
        if (type.value === 4 && exerciseDOList[0].scoreType == 1) {
          let fillBlankCount = 0;
          for (const item of exerciseDOList) {
            fillBlankCount += item.exerciseItemDOList.length;
          }
          totalScore = (exerciseDOList[0].score * fillBlankCount);
        } else if (type.value === 5) {
          for (const item of exerciseDOList) {
            totalScore += item.score;
          }
        } else {
          totalScore = (exerciseDOList[0].score * totalCount)
        }
        questionList.push({
          totalCount,
          totalScore,
          type: type.value,
          exerciseDOList
        });
      }
    }
    return this.renderQuestions(questionList, 'Child');
  }
  renderQuestionType = (type) => {
    let questionTypeStr = null, color = null;
    switch (type) {
      case 1:
        questionTypeStr = '单选题';
        color = 'single';
        break;
      case 2:
        questionTypeStr = '多选题';
        color = 'multiple';
        break;
      case 3:
        questionTypeStr = '判断题';
        color = 'trueFalse';
        break;
      case 4:
        questionTypeStr = '填空题';
        color = 'fillBlank';
        break;
      case 5:
        questionTypeStr = '问答题';
        color = 'subjective';
        break;
      case 6:
        questionTypeStr = '共用题干题';
        color = 'shareQuestionTitle';
        break;
      default:
        questionTypeStr = '未知题型';
        color = 'single';
        break;
    }
    return {
      label: questionTypeStr,
      color
    };
  }
  renderItem = (list = [], type, scoreType) => {
    const { paperDetail } = this.props;
    return (
      list.map((item, index) => {
        item.type = parseInt(item.type, 10);
        let rightAnswer = [];   // 填空题、问答题正确答案
        if (paperDetail['_paperType'] === 4) {  // 答卷详情
          if (type === 4 || type === 5) {
            for (const value of (item.trueNoList || [])) {
              rightAnswer.push({ name: value });
            }
          }
        } else {
          if (type === 4 || type === 5) {
            rightAnswer = item.exerciseItemDOList;
          }
        }
        return (
          <li key={index}>
            <p style={{ padding: '5px 0' }}>
              <span> {index + 1}、{item.name}{((type === 4 && scoreType == 1) || this.props.paperDetail['_paperType'] === 5) ? '' : <span>（{(parseInt(item.score, 10) || 0).toFixed(1)}分）</span>}</span>
            </p>
            {(() => {
              if (item.type === 1 || item.type === 2 || item.type === 3) {
                return this.renderOptions(item, item.type);
              } else if (item.type === 6) {
                return this.renderShareTitleQuestion(item.childList)
              }
            })()}
            <div className={styles.correct}>
              {(() => {
                let tpl;
                if (item.type === 1 || item.type === 2 || item.type === 3) {
                  tpl = (
                    <div>
                      正确答案：<span style={{ color: '#00B990' }}>{item.answer}</span>
                    </div>
                  );
                } else if (item.type === 4) {
                  tpl = (
                    <div>
                      正确答案：<p style={{ marginTop: -8 }}>{this.renderBlankAnswer(rightAnswer)}</p>
                    </div>
                  );
                } else if (item.type === 5) {
                  tpl = (
                    <div>
                      参考答案：<p style={{ marginTop: -8 }}>{rightAnswer[0].name}</p>
                    </div>
                  );
                }
                return tpl;
              })()}
              {(() => {
                let tpl;
                if (item.selfSelectNo || paperDetail['_paperType'] === 4) {
                  if (item.type === 1 || item.type === 2 || item.type === 3) {
                    tpl = (
                      <div style={{ display: 'inline-block' }}>
                        考生答案：<span style={{ color: item.answer == item.selfSelectNo ? '#00B990' : '#FF0036' }}>{item.selfSelectNo}</span>
                      </div>
                    );
                  } else if (item.type === 4) {
                    tpl = (
                      <div style={{ display: 'block' }}>
                        考生答案：<p style={{ marginTop: -8 }}>{this.renderBlankAnswer(item.exerciseItemDOList, item.result)}</p>
                      </div>
                    );
                  } else if (item.type === 5) {
                    tpl = (
                      <div style={{ display: 'block' }}>
                        考生答案：<p style={{ marginTop: -8 }}>{item.exerciseItemDOList[0] ? item.exerciseItemDOList[0].name : ''}</p>
                      </div>
                    );
                  }
                  return tpl;
                }
              })()}
            </div>
          </li >
        );
      })
    );
  }
  renderQuestions = (list, renderType) => {
    return (
      list.map((item, index) => {
        item.type = parseInt(item.type, 10);
        const scoreType = (item.exerciseDOList[0] || {}).scoreType;
        let blankTpl = '';
        if (item.type === 4 && scoreType == 1) {
          blankTpl = `每小空${(parseInt(item.exerciseDOList[0].score, 10) || 0).toFixed(1)}分，`;
        }
        const typeObj = this.renderQuestionType(item.type) || {};
        let renderTypeTpl = '';
        if (renderType) {
          renderTypeTpl = <span className={`question-type-lable ${typeObj.color}`}>{typeObj.label}</span>;
        } else {
          renderTypeTpl = typeObj.label;
        }
        return (
          <div className={styles[`examItem`]} key={index}>
            <div className={styles.headerRow}>
              {renderTypeTpl}
              {(() => {
                if (this.props.paperDetail['_paperType'] === 5) {
                  return `（共${item.totalCount}题）`
                } else {
                  return `（共${item.totalCount}题，${blankTpl}共${(parseInt(item.totalScore, 10) || 0).toFixed(1)}分）`
                }
              })()}
            </div>
            <ul className={styles.questionsList}> {this.renderItem(item.exerciseDOList, item.type, scoreType)} </ul>
          </div>
        );
      })
    );
  }

  render() {
    const { paperDetail } = this.props;
    return (
      <div>{this.renderQuestions(paperDetail.exerciseList)}</div>
    );
  }

}

export default ExamPaperDetailDefault;
