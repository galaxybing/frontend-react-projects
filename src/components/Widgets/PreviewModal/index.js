import React, { Component } from 'react';
import { Icon, Radio, Checkbox, Button, Carousel, message, Tabs, Tooltip, Modal } from 'antd';
import { getCache } from '../../../core/_utils/storage';
import { INNER_HOSPITALID } from '../../../constants';
import styles from './style.css';
import RenderQuestionModal from '../RenderTest/RenderTest';

const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
const TabPane = Tabs.TabPane;

const { hospitalId } = getCache('profile');

class CourseDetailPreview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabKey: null,
    };
    const { visible, onCancel } = this.props;
    this.modalProps = {
      title: '预览',
      width: 800,
      visible,
      footer: null,
      onCancel,
      wrapClassName: styles.coursePreviewModal
    };
  }
  render() {
    const { operationStatus, isRelease = false, pageType, canRelease, hospitalName, insertTitleNum, publicHospitalId } = this.props;
    const { courseDetail } = this.props;
    const { courseName, contentReqDTO, courseReqDTO, resourceReqDTOList, paperRequestDTO, prePaperReqDTO } = courseDetail;
    
    const showPrePaperReqDTO = (prePaperReqDTO && prePaperReqDTO.exerciseDOList && (this.state.tabKey === '1' || !this.state.tabKey));
    const showPaperRequestDTO = (paperRequestDTO && paperRequestDTO.exerciseDOList && (this.state.tabKey === '2' || !this.state.tabKey));
    // 配置 随堂测试 | 课前评估 数据
    const tabDataSource = showPrePaperReqDTO ? prePaperReqDTO : (showPaperRequestDTO ? paperRequestDTO: {});
    const renderQuestionModalProp = {
      questionList: tabDataSource ? tabDataSource.exerciseDOList : [],
      canEditDelete: false
    };
    const totalScore = tabDataSource && tabDataSource.totalScore ? (tabDataSource.totalScore).toFixed(1) : '';
    const passScore = tabDataSource ? tabDataSource.passScore : '';
    const totalNum = tabDataSource ? tabDataSource.totalNum : '';


    const hadExercise = paperRequestDTO && paperRequestDTO.exerciseDOList.length > 0; // 是否有试题
    let hadVideoResource = false;

    const warning = () => {
      message.warning('正在转码中，请稍后刷新查看');
    };
    const error = () => {
      message.error('转码失败，请检查视频后重新上传');
    };
    const previewUrl = getCache('previewUrl');
    const previewCourseware = (url, type, curHospitalId) => {
      window.open(`${previewUrl}?arg=${encodeURIComponent(url)}&type=${type}`);
    };
    
    return (
      <Modal {...this.modalProps}>
        <div className={styles.normal}>
          {hospitalId !== INNER_HOSPITALID ?
            <div>
              {((operationStatus === 1 || operationStatus === 4) && !pageType && (canRelease === 1)) ?
                <div className={styles.insertQuestionsWrap}>
                  {insertTitleNum ?
                    `已在视频播放中插入${insertTitleNum}个试题` :
                    '您可以在视频播放中插入试题，考生观看视频时需回答该问题后方可继续观看。'
                  }
                  {hadExercise && hadVideoResource ?
                    <Button ghost style={{ marginLeft: 20 }} className={styles.settingButton} onClick={this.props.showInsertQuestionsModal}>
                      {insertTitleNum ? '修改' : '设置'}
                    </Button> :
                    <Tooltip title="请先设置视频和试题">
                      <Button ghost style={{ marginLeft: 20 }} disabled>
                        设置
                      </Button>
                    </Tooltip>
                  }

                </div>
                : ''}
            </div>
            : ''
          }

          <div className={styles.tab}>
            <div className={styles.courseTypeSprite}>
              {
                this.props.trainModel == 'online' ? (
                  <span className={styles.courseTypeName}>在线培训</span>
                ) : (
                    <span className={styles.courseTypeNameOffline}>现场培训</span>
                  )
              }

              <p className={styles.name}>{courseName}</p>
            </div>
            <p className={styles.intro}>{ contentReqDTO && contentReqDTO.introduction ? contentReqDTO.introduction : ''}</p>
            <p className={styles.classify}>
              培训分类：<span>{courseReqDTO && courseReqDTO.trainClassifyName}</span>
              <span className={styles.line}></span>
              主讲人：
              <span>
                {
                  courseReqDTO && courseReqDTO.lecturerList.map((item,index)=>{
                    return <span key={index}>{`${item.lecturerName}（${item.lecturerCredit}）`}</span>
                  })
                }
              </span>
              {
                hospitalId === INNER_HOSPITALID ?
                  <div style={{ display: 'inline-block' }}>
                    <span className={styles.line}></span>
                    医院：<span>{hospitalName}</span>
                  </div>
                  : ''
              }
            </p>
          </div>
          <div className={styles.bkgSplit}></div>
          {
            resourceReqDTOList && resourceReqDTOList.length > 0 ? (
              <div>
                <div className={styles.tab} ref='tabWidth'>
                  <p className={styles.contentTitle}>课件</p>
                </div>

                <div className={styles.resourceItemSprite} style={{ border: 0 }}>
                  {
                    resourceReqDTOList.map((item, index) => {
                      let fileName = (index + 1) + '）' + item.fileName;
                      let fileNameKeyIndex = index + 1;

                      if (/pdf/i.test(item.fileType)) {
                        return (<a key={fileNameKeyIndex} className={styles.resourceItemLink} onClick={() => previewCourseware(item.url, 'pdf')} href="javascript:;">{fileName}</a>);
                      } else if (item.type === 1) {
                        if (item.returnUrl) {
                          return (<a key={fileNameKeyIndex} className={styles.resourceItemLink} onClick={() => previewCourseware(item.returnUrl, 'video')} href="javascript:;">{fileName}</a>);
                        } else {
                          if (item.status === 0) {
                            return (<a key={fileNameKeyIndex} className={styles.resourceItemLink} onClick={warning}>{fileName}</a>);
                            // } else if (item.status === -1) {
                          } else {
                            return (<a key={fileNameKeyIndex} className={styles.resourceItemLink} onClick={error}>{fileName}</a>);
                          }
                        }
                      } else {
                        if (item.pdfUrl) {
                          return (<a key={fileNameKeyIndex} className={styles.resourceItemLink} onClick={() => previewCourseware(item.pdfUrl, 'pdf')} href="javascript:;">{fileName}</a>);
                        } else {
                          if (item.size && item.size.indexOf('M') > -1) {
                            const fileSize = item.size.split('M')[0];
                            if (fileSize > 10) {
                              return (<a key={fileNameKeyIndex} className={styles.resourceItemLink} onClick={warning}>{fileName}</a>);
                            } else {
                              return (<a key={fileNameKeyIndex} href={`https://view.officeapps.live.com/op/view.aspx?src=${item.url}`} target="_blank">{fileName}</a>);
                            }
                          }
                          return (<a key={fileNameKeyIndex} className={styles.resourceItemLink} href={`https://view.officeapps.live.com/op/view.aspx?src=${item.url}`} target="_blank">{fileName}</a>);
                        }
                      }


                    })
                  }
                </div>

                <div className={styles.bkgSplit}></div>
              </div>

            ) : ''
          }
          {
            (
              !(prePaperReqDTO && prePaperReqDTO.exerciseDOList) &&
              !(paperRequestDTO && paperRequestDTO.exerciseDOList) &&
              !(contentReqDTO && contentReqDTO.homeWork) &&
              !(contentReqDTO && contentReqDTO.questionnaireName)
            )  ? null:
              <div className={`boz-component-body-card ${styles.courseDetailCont}`}>
                <Tabs onChange={(key) => { this.setState({ tabKey: key }) }}>
                    {prePaperReqDTO && prePaperReqDTO.exerciseDOList ?
                        <TabPane tab="课前评估" key="1">
                            <div className={styles.examPaper}>
                                <RenderQuestionModal {...renderQuestionModalProp} />
                            </div>
                        </TabPane>
                        : ''
                    }
                    {paperRequestDTO && paperRequestDTO.exerciseDOList ?
                        <TabPane tab="随堂测试" key="2">
                            <div className={styles.examPaper}>
                                <RenderQuestionModal {...renderQuestionModalProp} />
                            </div>
                        </TabPane>
                        : ''
                    }
                    {
                        contentReqDTO && contentReqDTO.questionnaireName ? <TabPane tab="满意度问卷" key="4"><p style={{ padding: '0 20px 20px' }}>{contentReqDTO.questionnaireName}</p></TabPane> : ''
                    }
                    {
                        contentReqDTO && contentReqDTO.homeWork ? <TabPane tab="课后作业" key="3"><pre style={{ padding: '0 20px 20px' }}>{contentReqDTO.homeWork}</pre></TabPane> : ''
                    }
                </Tabs>
                <i className={styles.icoTitleBar}></i>
                {
                  showPrePaperReqDTO || showPaperRequestDTO ?
                    <span className={styles.explainTips}>共有试题<b style={{ color: '#1A92FF' }}>{totalNum}</b>道，总分：<b style={{ color: '#2DD37F' }}>{totalScore}</b></span> : null
                }
            </div>
          }

        </div>
      </Modal>
    );
  }
}

export default CourseDetailPreview;
