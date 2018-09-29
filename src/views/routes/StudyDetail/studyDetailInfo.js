import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { Row, Col, Icon, Input, Radio, Checkbox, Button, Pagination, Table, message, Tabs, Popconfirm } from 'antd';
import { getCache } from '../../../core/_utils/storage';
import { INNER_HOSPITALID, PREVIEWURL } from '../../../constants';
import Service from '../../../actions/studyDetail';
import { searchStrToObj } from "../../../core/_utils/common";
import BreadNavList from '../../../components/Widgets/BreadNavList';
import TestResult from '../../../components/Widgets/TestResult';
import ExamPaperDetailDefault from '../../../components/StudyDetail/ExamPaperDetailDefault';
import styles from './style.css';
import { Link } from 'react-router-dom';
import { testLink } from '../../../core/_utils/common'

const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
const TabPane = Tabs.TabPane;
const TextArea = Input.TextArea;

const { hospitalId } = getCache('profile') || {};
const innerFromPage = getCache('innerFromPage') || {};

const timeFormat = 'MM/DD HH:mm';

class StudyDetailInfo extends Component {
    constructor(props) {
      super(props);
      this.state = {
          courseDetail: {},
          tabKey: null,
          courseMessageList: [],
          pagination: {
              pageNum: 1,
              pageSize: 10,
              total: 0,
          },
          loading: false,
      };
      const { search } = props.location;
      this.query = {};
      if (search) {
        this.query = searchStrToObj(search);
      }
    }
    componentDidMount() { // v3.4.0/paperDetail
        Service.getCourseStudyDetail({ releaseId: this.query.releaseId, studentId: this.query.studentId }).then(data => {
            if (!data.success) {
                message.error(data.errMsg);
                return;
            }
            const courseDetail = data.data;
            const { coursePrePaperAnswerRespDTO = {}, coursePaperAnswerRespDTO = {}, } = courseDetail;
            let key = '1';
            if (!coursePrePaperAnswerRespDTO.paperExerciseTypeRespDTOList) {
              key = '2'
            }
            if (!coursePrePaperAnswerRespDTO.paperExerciseTypeRespDTOList && !coursePaperAnswerRespDTO.paperExerciseTypeRespDTOList) {
              key = '3'
            }
            if (!coursePrePaperAnswerRespDTO.paperExerciseTypeRespDTOList && !coursePaperAnswerRespDTO.paperExerciseTypeRespDTOList && !courseDetail.homeWorkDetailRespDTO) {
              key = '4'
            }
            if (!coursePrePaperAnswerRespDTO.paperExerciseTypeRespDTOList && !coursePaperAnswerRespDTO.paperExerciseTypeRespDTOList && !courseDetail.homeWorkDetailRespDTO){
              key = '-1'
            }
            this.setState({ courseDetail, tabKey: key});
            
            // this.props.getCourseDetailData(data.data);
            // 
            // this.props.dispatch({
            //     type: 'courseDetails/save',
            //     payload: {
            //         courseData: data.data,
            //         // isRelease: false,
            //     }
            // })

        });
        // this.getCourseMessage();
    }
    previewCourseware = (url, type) => {
      window.open(`${PREVIEWURL}?arg=${encodeURIComponent(url)}&type=${type}`);
    };
    render() {
        /*
        const { operationStatus, isRelease = false, pageType, canRelease, hospitalName, insertTitleNum, publicHospitalId } = this.props;
        const { courseDetail } = this.props;
        const { courseName, contentReqDTO, courseReqDTO, resourceReqDTOList, paperRequestDTO, prePaperReqDTO } = courseDetail;
        */
        
        const { courseDetail } = this.state;
        const { courseName, coursePrePaperAnswerRespDTO, coursePaperAnswerRespDTO, homeWorkDetailRespDTO } = courseDetail;
        const prePaperReqDTO = coursePrePaperAnswerRespDTO;
        const paperRequestDTO = coursePaperAnswerRespDTO; // 随堂测试
        const contentReqDTO = homeWorkDetailRespDTO;
        
        const showPrePaperReqDTO = (prePaperReqDTO && prePaperReqDTO.paperExerciseTypeRespDTOList && (this.state.tabKey === '1' || !this.state.tabKey));
        const showPaperRequestDTO = (paperRequestDTO && paperRequestDTO.paperExerciseTypeRespDTOList && (this.state.tabKey === '2' || !this.state.tabKey));
        // 配置 随堂测试 | 课前评估 数据
        const tabDataSource = showPrePaperReqDTO ? prePaperReqDTO : (showPaperRequestDTO ? paperRequestDTO: {});
        let exerciseList = tabDataSource && tabDataSource.paperExerciseTypeRespDTOList ? tabDataSource.paperExerciseTypeRespDTOList : [];

        exerciseList = JSON.parse(JSON.stringify(exerciseList).replace(/paperExerciseRespDTOList":/g, 'exerciseDOList":')
          .replace(/totalNum":/g, 'totalCount":')
          .replace(/trueNo":/g, 'answer":')
          .replace(/paperExerciseItemRespDTOList":/g, 'exerciseItemDOList":'));
        for (const item of exerciseList) {
          if (item.type == 4 && item.exerciseDOList[0] && item.exerciseDOList[0].scoreType == 1) {
            let blankCount = 0;
            for (const child of item.exerciseDOList) {
              blankCount += child.exerciseItemDOList.length;
            }
            item.totalScore = item.exerciseDOList[0].score * blankCount;
          }
        }
        const exerciseListProp = {
          paperDetail: {
            _paperType: 4,
            exerciseList,
          }
        };
        const totalScore = tabDataSource && tabDataSource.totalScore ? (tabDataSource.totalScore).toFixed(1) : '';
        // const passScore = tabDataSource ? tabDataSource.passScore : '';
        const totalNum = tabDataSource ? tabDataSource.totalNum : '';

       
        return (
          <div className="boz-component-body-card">
            <div className="boz-component-header">
              <BreadNavList
                dataSource={[
                  { name: '已发布培训', link: `/hospital-admin/nurse-training-course/trainings.html` },
                  { name: '培训详情', link: `/hospital-admin/nurse-training-course/trainings/study-detail.html`, search: `?releaseId=${this.query.releaseId}` },
                  { name: `学习详情` }
                ]}
              />
            </div>
            <div className="boz-component-body">
              <div className={styles.authorHeader}>
                <div className={styles.authorName}>{this.query.accountName}</div>
                <p className={styles.courseName}>{courseName}</p>
              </div>
            </div>
              {(
                !(prePaperReqDTO && prePaperReqDTO.paperExerciseTypeRespDTOList) &&
                !(paperRequestDTO && paperRequestDTO.paperExerciseTypeRespDTOList) &&
                !(contentReqDTO)
              )  ? null:
                <div className={`boz-component-body-card ${styles.courseDetailCont}`}>
                  <Tabs onChange={(key) => { this.setState({ tabKey: key }) }}>
                      {prePaperReqDTO && prePaperReqDTO.paperExerciseTypeRespDTOList ?
                          <TabPane tab={<span>课前评估<i style={{color: '#fd8609', fontStyle: 'normal'}}>（正确率{parseInt(prePaperReqDTO.successCount/ prePaperReqDTO.totalNum * 100, 10)}%）</i></span>} key="1">
                            <div style={{paddingLeft: 20}}>
                              评估时间：{moment(tabDataSource.examStartTime).format('YYYY-MM-DD HH:mm')}<br />
                              正确 {tabDataSource.successCount} 题，错误 {tabDataSource.failCount} 题
                            </div>
                            <div className={styles.examPaper} style={{maxHeight: 'inherit'}}>
                                <ExamPaperDetailDefault {...exerciseListProp} />
                            </div>
                          </TabPane>
                          : ''
                      }
                      {paperRequestDTO && paperRequestDTO.paperExerciseTypeRespDTOList ?
                          <TabPane tab={<span>随堂测试<i style={{color: '#fd8609', fontStyle: 'normal'}}>（{paperRequestDTO.score}分）</i></span>} key="2">
                              <TestResult paperRecordList={paperRequestDTO.paperRecordForDetailRspDTOList ? paperRequestDTO.paperRecordForDetailRspDTOList : []} />
                              <Row style={{paddingLeft: 20, paddingRight: 10}}>
                                <Col span={5}>
                                  答卷详情（最高分）
                                </Col>
                                <Col span={19} style={{textAlign: 'right'}}>
                                  <Button
                                    type="primary"
                                    style={{ marginRight: 10, height: 30 }}
                                    // disabled={!dataSource.pagination.total}
                                    disabled={paperRequestDTO.totalNum === 0}
                                    onClick={() => {
                                      const params = {
                                        releasePaperId: this.query.releaseId,
                                        studentName: this.query.accountName,
                                        studentId: this.query.studentId,
                                        releasePaperName: courseName,
                                      };
                                      Service.exportTestProcessResult(params).then((data)=>{
                                        if (data.success) {
                                          testLink(data.data.url, () => {
                                            // 给要下载的pdf增加attname, 可以直接下载
                                            let arr = data.data.url.split('/');
                                            const attname = arr[arr.length - 1];
                                            location.href = `${data.data.url}?attname=${attname}`;
                                          }, () => {
                                            message.error('下载资源暂未生成，请稍后重试，如您急需，请联系客服', 3);
                                          });
                                        } else {
                                          message.error('下载资源暂未生成，请稍后重试，如您急需，请联系客服', 3);
                                        }
                                      });
                                    }}
                                  >
                                    导出测验试卷
                                  </Button>
                                </Col>
                              </Row>
                              <div className={styles.examPaper} style={{maxHeight: 'inherit'}}>
                                  <ExamPaperDetailDefault {...exerciseListProp} />
                              </div>
                          </TabPane>
                          : ''
                      }
                      {
                          contentReqDTO && contentReqDTO.releaseId ? <TabPane tab={<span>课后作业<i style={{color: '#fd8609', fontStyle: 'normal'}}>（{contentReqDTO.grade ? contentReqDTO.grade : contentReqDTO.score + '分'}）</i></span>} key="3">
                            <div style={{paddingLeft: 20, paddingBottom: 20, lineHeight: 1.8}}>
                              上传时间：{contentReqDTO.uploadTime && moment(contentReqDTO.uploadTime).format('YYYY-MM-DD HH:mm')}<br />
                              {/* 分数： {contentReqDTO.score} 分<br /> */}
                              评语：{contentReqDTO.comment}
                            </div>
                            <div className={styles.homeworkContentText}>
                              <h4 style={{fontSize: 18, paddingBottom: 10}}>课后作业</h4>
                              <div className={styles.homeworkContentTitle}>
                                <div className={styles.tit}>题目：</div>
                                <div className={styles.homeworkContentTitleTxt}>
                                  <pre>
                                    {contentReqDTO.content}
                                  </pre>
                                </div>
                              </div>
                              <div className={styles.homeworkContentResourceList}>
                                {
                                  contentReqDTO.personalHomeWorkRespDTOList.map((file, index) => {
                                    let fileTpl = '';
                                    if (/pdf/i.test(file.fileType)) {
                                      fileTpl = <a onClick={() => this.previewCourseware(file.url, 'pdf')}>{file.fileName + '.pdf'}</a>;
                                    } else {
                                      if (file.pdfUrl) {
                                        fileTpl = <a onClick={() => this.previewCourseware(file.pdfUrl, 'pdf')}>{file.fileName + '.pdf'}</a>;
                                      } else {
                                        if (file.documentMaxSize) {
                                          fileTpl = <a onClick={this.warning}>{file.fileName}</a>
                                        } else if (file.url &&　file.fileName){
                                          fileTpl = <a href={`https://view.officeapps.live.com/op/view.aspx?src=${file.url}`} target="_blank">{file.fileName + '.' + file.fileType}</a>
                                        }
                                      }
                                    }
                                    return <div key={index}>{fileTpl}</div>
                                  })
                                }
                              </div>
                            </div>
                          </TabPane> : ''
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
        );
    }
}

function select(state) {
  return {};
}
function actions(dispatch, ownProps) {
  return {
    dispatch
  };
}
export default connect(select, actions)(StudyDetailInfo);
