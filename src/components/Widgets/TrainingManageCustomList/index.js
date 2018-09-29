import React, { Component } from 'react';
import {
  message, Form, Input, Tag, Tooltip, Radio,
  Icon, Cascader, Select, Row, Col,
  Checkbox, Button, InputNumber, Spin, Modal,
  Affix, Popconfirm
} from 'antd';
import CourseWare from './CourseWare';
import TestProcess from './TestProcess';
import TestAhead from './TestAhead';
import TestStatistics from './TestStatistics';
import TestFollowUp from './TestfFollowUp';

import { getValid } from '../../../actions/createCourse';

import styles from './style.css';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

export default class TrainingManageCustomList extends Component {
  constructor(props) {
    super(props);

    let trainingManageCustomListTab = new Map([
      [
        'TestAhead',
        {
          title: '课前评估',
          tab: 'TestAhead',
          selected: false,
          required: false,
        }
      ],
      [
        'CourseWare',
        {
          title: '课件',
          tab: 'CourseWare',
          selected: this.props.trainModel === 'online' ? true : false, // 未预留删除操作，所以初始为 true
          required: this.props.trainModel === 'online' ? true : false,
        }
      ],
      [
        'TestProcess',
        {
          title: '随堂测试',
          tab: 'TestProcess',
          selected: false,
          required: false,
        }
      ],
      [
        'TestStatistics',
        {
          title: '满意度问卷',
          tab: 'TestStatistics',
          selected: false,
          required: false,
        }
      ],
      [
        'TestFollowUp',
        {
          title: '课后作业',
          tab: 'TestFollowUp',
          selected: false,
          required: false,
        }
      ]
    ]);
    this.setStepIcoNumber(trainingManageCustomListTab);
    
    this.state = {
      trainingManageCustomListTabCount: 0,
      trainingManageCustomListTab,
    }
  }
  componentDidMount() {
    const result = getValid();
    result.then((res) => {
      if (res.success) {
        this.setState({
          testStatisticsInfo: res.data
        })
      }
    })
  }
  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(nextProps.currentCourse, this.props.currentCourse)) {
      const data = nextProps.currentCourse;
      const { trainingManageCustomListTab } = this.state;
      // 课前评估
      if (data && data.prePaperResponseDTO && data.prePaperResponseDTO.exerciseRspDTOList && data.prePaperResponseDTO.totalScore > 0) {
        const TestData = trainingManageCustomListTab.get('TestAhead');
        trainingManageCustomListTab.set('TestAhead', {...TestData, selected: true});
      }
      // 课件
      if (data && data.resourceRespDTOList && data.resourceRespDTOList.length > 0) {
        const TestData = trainingManageCustomListTab.get('CourseWare');
        trainingManageCustomListTab.set('CourseWare', {...TestData, selected: true});
      }
      // 随堂测试
      if (data && data.paperResponseDTO && data.paperResponseDTO.exerciseRspDTOList && data.paperResponseDTO.totalScore > 0) { // 总分值大于 表示存在题数
        const TestData = trainingManageCustomListTab.get('TestProcess');
        trainingManageCustomListTab.set('TestProcess', {...TestData, selected: true});
      }
      
      // 满意度问卷
      if (data && data.questionnaireRespDTO && data.questionnaireRespDTO.questionnaireId) {
        const TestData = trainingManageCustomListTab.get('TestStatistics');
        this.props.dispatch({
          type: 'course/saveCurrentSelectedTestStatisticsData',
          payload: {
            currentSelectedTestStatisticsData: { paperId: data.questionnaireRespDTO.questionnaireId, paperName: data.questionnaireRespDTO.questionnaireName }
          }
        })
        trainingManageCustomListTab.set('TestStatistics', {...TestData, selected: true});
      }
      // 课后作业
      if (data && data.homeWorkRespDTO && data.homeWorkRespDTO.homeWork) {
        const TestData = trainingManageCustomListTab.get('TestFollowUp');
        trainingManageCustomListTab.set('TestFollowUp', {...TestData, selected: true});
      }
      this.setStepIcoNumber(trainingManageCustomListTab);
      this.setState({
        trainingManageCustomListTab,
      });
    }
  }
  setStepIcoNumber = (trainingManageCustomListTab) => {
    // 配置 分步数字导航 索引值
    //
    let trainingManageCustomListTabSelected = 0;
    for (let [key, item] of trainingManageCustomListTab) {
      if (item.selected) {
        trainingManageCustomListTabSelected++;
        let dataSelected = trainingManageCustomListTab.get(key);
        trainingManageCustomListTab.set(key, {...dataSelected, ind: trainingManageCustomListTabSelected});
      }
    }
  }
  updateTrainingCustom = (type) => {
    const { trainingManageCustomListTab, trainingManageCustomListTabCount } = this.state;
    let data = trainingManageCustomListTab.get(type);
    trainingManageCustomListTab.set(type, {...data, selected: !data.selected});
    
    // 配置 分步数字导航 索引值
    //
    let trainingManageCustomListTabSelected = 0;
    for (let [key, item] of trainingManageCustomListTab) {
      if (item.selected) {
        trainingManageCustomListTabSelected++;
        let dataSelected = trainingManageCustomListTab.get(key);
        trainingManageCustomListTab.set(key, {...dataSelected, ind: trainingManageCustomListTabSelected});
      }
    }
    
    /*
    if (type === 'TestStatistics' && this.trainingManageCustomListElem) {
      
      Modal.confirm({
        className: 'training-manage-custom-list-wrapper',
        width: 316,
        iconType: 'exclamation-circle',
        // title: '--',
        content: '您还未开通满意度问卷调查功能，开通该功能后，可开展学员对课程、讲师问卷调查，提升培训品质。',
        okText: '开通',
        onOk: () => {
          console.log('申请开通，满意度问卷；')
        },
        cancelText: '取消',
      });
      
     
    }
    */
    this.setState({
      trainingManageCustomListTab,
    });
  }
  deletePannel = (type) => {
    const tab = type;
    this.updateTrainingCustom(tab);
  }
  render() {
    const { questionsScoreMap, checkedQuestionItemMap, /* allQuestionsOpenMap, */ form, questionsListMap } = this.props;
    const { trainingManageCustomListTab = new Map([]) } = this.state;

    const CourseWareProps = {
      trainModel: this.props.trainModel,
      openChooseCoursewareModal: this.props.openChooseCoursewareModal,
      openCreateCoursewareModal: this.props.openCreateCoursewareModal,
      fileList: this.props.fileList,
      form: this.props.form,
      currentCourse: this.props.currentCourse,
      removeUploadFile: this.props.removeUploadFile,
      // 数据源
      dataSource: trainingManageCustomListTab.get('CourseWare'),
      deletePannel: this.deletePannel,
    }
    
    const TestAheadProps = {
      // questionsScoreMap,
      // checkedQuestionItemMap,
      // allQuestionsOpenMap,
      form,
      examPaperSwitchHandler: this.props.examPaperSwitchHandler,
      // onChooseTest: this.props.onChooseTest,
      // 
      // saveCheckedQuestion: this.props.saveTestAheadCheckedQuestion,
      saveCheckedQuestion: (list, type) => {
        this.props.dispatch({
          type: 'createTestAhead/saveCheckedQuestion',
          payload: { questionList: list, type }
        });
      },
      
      // scoreType: this.props.scoreType,
      dataSource: trainingManageCustomListTab.get('TestAhead'),
      deletePannel: this.deletePannel,
      deleteQuestionByType: (type) => {
        this.props.dispatch({
          type: 'createTestAhead/deleteQuestionByType',
          payload: { type }
        });
      }
    }
    
    const TestProcessProps = {
      questionsScoreMap,
      checkedQuestionItemMap,
      // allQuestionsOpenMap,
      form,
      questionsListMap,
      examPaperSwitchHandler: this.props.examPaperSwitchHandler,
      onChooseTest: this.props.onChooseTest,
      saveCheckedQuestion: this.props.saveCheckedQuestion,
      // scoreType: this.props.scoreType,
      dataSource: trainingManageCustomListTab.get('TestProcess'),
      deletePannel: this.deletePannel,
      deleteQuestionByType: (type) => {
        this.props.dispatch({
          type: 'createExamPaper/deleteQuestionByType',
          payload: { type }
        });
      }
    }

    const TestStatisticsProps = {
      form,
      dataSource: trainingManageCustomListTab.get('TestStatistics'),
      deletePannel: this.deletePannel,
    }
    
    const TestFollowUpProps = {
      form,
      dataSource: trainingManageCustomListTab.get('TestFollowUp'),
      deletePannel: this.deletePannel,
    }
    
    const trainingManageCustomListTabArr = [...trainingManageCustomListTab.values()];
    
    const modalTestStatisticsValidProps = {
      visible: this.state.testStatisticsValidVisible,
      width: 730,
      footer: null,
      closable: false
    }
    
    return (
      <div className={styles.trainingManageCustomList} ref={(r) => this.trainingManageCustomListElem = r}>
          {/* 效率
            (() => {
              let tabTemp = [];
              for (const [key, item] of trainingManageCustomListTab) {

                const { title, tab, required, selected } = item;
                if (!required && !selected) {
                  tabTemp.push(
                    <Button key={title} className={styles.btn} size={'large'} type={'primary'} onClick={() => this.updateTrainingCustom(tab)}><Icon type="plus" />{title}</Button>
                  )
                } else {
                  // return null;
                }
              }
              return (
                <div className={styles.trainingManageCustomListTabSprite}>
                  {tabTemp}
                </div>
              )
            })()
            
          */}
        <div className={styles.trainingManageCustomListTabSprite}>
          {
            trainingManageCustomListTabArr.map((item) => {
              const { title, tab, required, selected } = item;
              if (!required && !selected) {// 未进行选中操作，即为可选状态
                const { testStatisticsInfo = {} } = this.state;
                if (item.tab === 'TestStatistics') {
                  if (testStatisticsInfo.status === 0 && testStatisticsInfo.validDateCount > 0) {
                    return (
                      <Button key={title} className={styles.btn} size={'large'} type={'primary'} onClick={() => this.updateTrainingCustom(tab)}><Icon type="plus" />{title}(已开通)</Button>
                    )
                  } else {
                    return (
                      <Button key={title} className={styles.btn} size={'large'} type={'primary'} onClick={() => {
                        Modal.confirm({
                          className: 'training-manage-custom-list-wrapper',
                          width: 316,
                          iconType: 'exclamation-circle',
                          // title: '--',
                          content: '您还未开通满意度问卷调查功能，开通该功能后，可开展学员对课程、讲师问卷调查，提升培训品质。',
                          okText: '开通',
                          onOk: () => {
                            // this.setState({
                            //   testStatisticsValidVisible: true
                            // })
                            
                            window.location.href = '/hospital-admin/course-additional-services/servicesList/detail.html?id=3';
                          },
                          cancelText: '取消',
                        });
                      }}><Icon type="plus" />{title}(未开通)<i className={styles.icoPaly}>付费</i></Button>
                    )
                  }

                }
                return (
                  <Button key={title} className={styles.btn} size={'large'} type={'primary'} onClick={() => this.updateTrainingCustom(tab)}><Icon type="plus" />{title}</Button>
                )
              } else {
                return null;
              }
            })
          }
          <Tooltip placement="right" title={<div>
            <h4 style={{color: '#ffffff'}}>1、课前评估：</h4>
            <p>课程播放前对学员进行课前评估，完成答题后才能进入课程学习。</p>
            <h4 style={{color: '#ffffff'}}>2、随堂测验：</h4>
            <p>学员学完课件后，您可以对学员进行随堂测验。您也可以在学员观看的视频中插入试题，保证学员的学习质量。</p>
            <h4 style={{color: '#ffffff'}}>3、满意度问卷：</h4>
            <p>该功能在学员学习完之后展示，学员可对讲师进行满意度的填写，有益于讲师品质的提升。</p>
            <h4 style={{color: '#ffffff'}}>4、课后作业：</h4>
            <p>该功能在学员学习完之后展示，布置课后作业，提升学员举一反三能力，让学习效率更高。</p>
          </div>}>
            <Icon type="question-circle-o" className={styles.tipsIcon} />
          </Tooltip>
        </div>
        {/* 分步聚顺序固定，按以下： 课前评估、课件、随堂测试、满意度问卷、课后作业 */}
        {
          trainingManageCustomListTab.get('TestAhead').required || trainingManageCustomListTab.get('TestAhead').selected ? <TestAhead {...TestAheadProps} /> : null
        }
        {
          trainingManageCustomListTab.get('CourseWare').required || trainingManageCustomListTab.get('CourseWare').selected ? <CourseWare {...CourseWareProps} /> : null
        }
        {
          trainingManageCustomListTab.get('TestProcess').required || trainingManageCustomListTab.get('TestProcess').selected ? <TestProcess {...TestProcessProps} />: null
        }
        {
          trainingManageCustomListTab.get('TestStatistics').required || trainingManageCustomListTab.get('TestStatistics').selected ? <TestStatistics {...TestStatisticsProps} validDateCount={this.state.testStatisticsInfo ? this.state.testStatisticsInfo.validDateCount : 0} />: null
        }
        {
          trainingManageCustomListTab.get('TestFollowUp').required || trainingManageCustomListTab.get('TestFollowUp').selected ? <TestFollowUp {...TestFollowUpProps} /> : null
        }
        
        {/* <Modal {...modalTestStatisticsValidProps} style={{paddingBottom: 0}}>
          <img style={{display: 'block', width: '100%'}} src={require('../../../assets/img/server-free.png')} />
        </Modal> */}
      </div>
    )
  }
}
