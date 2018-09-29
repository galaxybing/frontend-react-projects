import React, { Component } from 'react'
import { Icon } from 'antd';
import { strOrNumConvert } from '../../../core/_utils/common';
import styles from './style.css';

export default function RenderTestComponent(props) {
  let { questionList } = props;
  function paperResponseDTOListFun() {
    let testStr = '';
    if (questionList) {
      questionList = JSON.parse(JSON.stringify(questionList).replace(/exerciseRspDTOList":/g, 'exerciseDOList":').replace(/exerciseItemRspDTOList":/g, 'exerciseItemDOList":'));
      for (let i = 0; i < questionList.length; i++) {
        testStr = [...testStr, randerTestQuestion(questionList[i], questionList[i].type, i)];
      }
    }
    return testStr;
  }

  function randerTestQuestion(data, type, index) {
    let answerStr = null;
    if (type == 2) {  // 多选
      answerStr = data.exerciseItemDOList.map(d => {
        let icon = (<Icon className={styles.checkboxIcon} type="check-square" />);
        if (data.answer.indexOf(d.no) === -1) {
          icon = (<span className={styles.checkbox} />);
        }
        const key = index + d.no;
        return (<div key={key}>{icon}{d.no}.{d.name}</div>);
      });
    } else if (type == 4) {  // 填空
      answerStr = data.exerciseItemDOList.map((d, idx) => {
        const key = index + d.no;
        return (<div key={key}>第{strOrNumConvert(idx + 1)}处答案：{d.name}</div>);
      });
    } else {  // 单选、判断
      answerStr = data.exerciseItemDOList.map(d => {
        let icon = (<span className={`${styles.circle} ${styles.circleChecked}`}><span className={styles.inCircle} /></span>);
        if (data.answer.indexOf(d.no) === -1) {
          icon = (<span className={styles.circle} />);
        }
        const key = index + d.no;
        return (<div key={key}>{icon}{d.no}.{d.name}</div>);
      });
    }

    let rightAnswers = '';
    if (data.answer.indexOf(',') > -1) {
      rightAnswers = data.answer;
    } else {
      rightAnswers = data.answer.split('').join(',');
    }

    return (
      <div key={index} className={styles.question}>
        {renderQuestionType(type)}
        <div className={styles.questionTitle}>
          <p style={{ marginBottom: 10 }}>{index + 1}.&nbsp;{data.name}</p>
          {answerStr}
          {
            type != 4 ? <p style={{ marginTop: 10 }}>正确答案：{rightAnswers}</p> : ''
          }
        </div>
      </div>
    );
  }

  function renderQuestionType(type) {
    let tpl = '';
    if (type == 1) {
      tpl = (<span className="question-type-lable single">单选题</span>);
    } else if (type == 2) {
      tpl = (<span className="question-type-lable multiple">多选题</span>);
    } else if (type == 3) {
      tpl = (<span className="question-type-lable trueFalse">判断题</span>);
    } else if (type == 4) {
      tpl = (<span className="question-type-lable fillBlank">填空题</span>);
    }
    return tpl;
  }

  return (
    <div>
      {paperResponseDTOListFun()}
    </div>
  );
}
