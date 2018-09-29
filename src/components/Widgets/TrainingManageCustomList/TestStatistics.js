import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Icon, message, Form, Tooltip, Button, Popconfirm, Checkbox, Select, Input, Switch, Row, Col
} from 'antd';
import AddTestStatisticsModal from './AddTestStatisticsModal';
import LinkSprite from './LinkSprite';
import styles from './style.css';

const FormItem = Form.Item;

class TestStatistics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      switchPannel: false,
      selectModalVisible: false,
    }
    this.state = {
      currentSelectedItemData: props.course.currentSelectedTestStatisticsData ? props.course.currentSelectedTestStatisticsData: null　
    }
  }
  switchPannelHandler = () => {
    this.setState({
      switchPannel: !this.state.switchPannel,
    })
  }
  checkTestStatisticPaper = () => {
    this.setState({
      selectModalVisible: true,
    })
  }
  removeCurrentSelectedItemData = () => {
    this.props.dispatch({
      type: 'course/saveCurrentSelectedTestStatisticsData',
      payload: {
        currentSelectedTestStatisticsData: null,
      }
    })
    this.setState({
      currentSelectedItemData: null,
    })
  }
  render () {
    const { examPaperSwitchCheckedStatus, questionsScoreMap, checkedQuestionItemMap, allQuestionsOpenMap, form, questionsListMap, dataSource, validDateCount } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    const current = this.state.currentSelectedItemData;
    return (
      <div className={this.state.switchPannel ? `${styles.createCourseItemSprite} ${styles.createCourseItemSpriteClosePannel}`: `${styles.createCourseItemSprite}`} style={{ marginBottom: 0 }}>
        <span className={styles.icoStepNumber}>{dataSource.ind}</span>
        <div className={styles.createCourseTitle} style={{ marginBottom: 0 }}>
          <LinkSprite switchPannel={this.switchPannelHandler} deletePannel={(type) => {
            this.props.dispatch({
              type: 'course/saveCurrentSelectedTestStatisticsData',
              payload: {
                currentSelectedTestStatisticsData: null,
              }
            })
            this.props.deletePannel(type);
          }} deleteAble={!dataSource.required} linkTabName={dataSource.tab} />
          满意度问卷
        </div>
        <div className={`${styles.createCourseItemContent} ${styles.createTestStatisticsContent}`}>
          {
            validDateCount > 0 && validDateCount < 15 ? (
              <div className={styles.toTipsSprite}>
                <p className={styles.tips}>服务有效期还剩<i style={{color: '#ff0000'}}>{validDateCount}</i>天，<a href="/hospital-admin/course-additional-services/servicesList/detail.html?id=3" target="_blank">我要继续使用</a></p>
              </div>
            ) : null
          }
          
          {
            current ? (
              <Row className={styles.listTestStatistics}>
                <Col span={20}><a href={`/hospital-admin/employee-satisfaction-paper/employee/paperDetail?paperId=${current.paperId}`} style={{color: '#1A92FF', cursor: 'pointer'}} target="_blank">{current.paperName}</a></Col>
                <Col className={styles.linkSprite}>
                  <Popconfirm title="确定删除？" onConfirm={() => this.removeCurrentSelectedItemData()}>
                    <a className={styles.link}>{/*<Icon type="delete" />*/}删除</a>
                  </Popconfirm>
                  {/* <span className={styles.link}><Icon type="reload" />重新选择</span> */}
                </Col>
              </Row>
            ) : ''
          }
          
          <div className={styles.btnCheckSprite}>
            <Button type='primary' className={styles.btnCheck} onClick={() => this.checkTestStatisticPaper()}>
              {
                current ? `重新选择问卷` : `选择调查问卷`
              }
            </Button>
          </div>
        </div>
        {this.state.selectModalVisible ? <AddTestStatisticsModal onClose={(data) => {
          this.setState({
            selectModalVisible: false,
            currentSelectedItemData: data ? data.currentSelectedItemData : null
          })
        }} /> : ''
        }
      </div>
    )
    
  }
}

function select(state) {
  const { course } = state;
  return { course };
}
function actions(dispatch, ownProps) {
  return {
    dispatch,
  };
}

export default connect(select, actions)(TestStatistics);
