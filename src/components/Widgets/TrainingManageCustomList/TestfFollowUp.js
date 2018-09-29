import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Icon, message, Form, Tooltip, Button, Popconfirm, Checkbox, Select, Input, InputNumber, Switch, Row, Col
} from 'antd';

import LinkSprite from './LinkSprite';
import styles from './style.css';

const FormItem = Form.Item;
const TextArea = Input.TextArea;

class TestfFollowUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      switchPannel: false,
    }
  }
  switchPannelHandler = () => {
    this.setState({
      switchPannel: !this.state.switchPannel,
    })
  }
  checkTestStatisticPaper = () => {
    
  }
  handleValidateHomeWork = (rules, value, callback) => {
    if (value && value.length > 500) {
      callback('课后作业的内容，不能超过 500 字符以上');
    } else {
      callback();
    }
  }
  render () {
    const { course /* 培训课程数据 */, examPaperSwitchCheckedStatus, questionsScoreMap, checkedQuestionItemMap, allQuestionsOpenMap, form, questionsListMap, dataSource } = this.props;
    const { currentCourse } = course;
    const { getFieldDecorator, getFieldValue } = form;

    return (
      <div className={this.state.switchPannel ? `${styles.createCourseItemSprite} ${styles.createCourseItemSpriteClosePannel}`: `${styles.createCourseItemSprite}`} style={{ marginBottom: 0 }}>
        <span className={styles.icoStepNumber}>{dataSource.ind}</span>
        <div className={styles.createCourseTitle} style={{ marginBottom: 0 }}>
          <LinkSprite switchPannel={this.switchPannelHandler} deletePannel={this.props.deletePannel} deleteAble={!dataSource.required} linkTabName={dataSource.tab} />
          课后作业
        </div>
        <div className={`${styles.createCourseItemContent} ${styles.createTestFollowUpContent}`}>
          <FormItem className={styles.submitContentStr}>
            <FormItem>
              {
                getFieldDecorator('homeWork', {
                  initialValue: currentCourse && currentCourse.homeWorkRespDTO && currentCourse.homeWorkRespDTO.homeWork ? currentCourse.homeWorkRespDTO.homeWork : '',
                  rules: [{
                    required: true, message: '课后作业的内容，不能为空'
                  },{
                    validator: this.handleValidateHomeWork
                  }]
                })(<TextArea autosize={{ minRows: 4, maxRows: 8 }} />)
              }
            </FormItem>
          </FormItem>
          {/*
            <Row className={styles.toTipsSprite}>
              <div className={styles.tips}>
                作业上交期限：<span>培训结束后&nbsp;
                <FormItem>
                  {
                    getFieldDecorator('')(<InputNumber defaultValue={3} min={0} max={30} step={1} />)
                  }
                  天截止。
                </FormItem>
                </span>
              </div>
            </Row>
            */}
        </div>
      </div>
    )
    
  }
}

function select(state) {
  const { course } = state;
  return { course };
}

export default connect(select, null)(TestfFollowUp);
