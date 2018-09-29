import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  message, Form, Input, Tag, Radio,
  Icon, Cascader, Select, Row, Col,
  Checkbox, Button, Upload, InputNumber, Spin, Modal,
  Affix, Switch, Popconfirm
} from 'antd';
// import * as Service from '../../services/course';
import { queryTrainClassifyList } from '../../actions/courseWare';
import { getCache } from '../../core/_utils/common';
// import RenderQuestionModal from '../Widgets/RenderTest/RenderTest';

import CoursePreviewModal from '../Widgets/PreviewModal';
import { customRequest } from '../../core/_utils/upload';
import { QUESTION_TYPE } from '../../constants';
import TrainingManageCustomList from '../Widgets/TrainingManageCustomList';
import styles from './Course.css';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

class CourseForm extends Component {
  constructor(props) {
    super(props);
    // 培训分类
    queryTrainClassifyList({ hospitalId: getCache('profile').hospitalId }).then((res) => {
      if (res.success) {
        const trainingClassification = JSON.parse(JSON.stringify(res.data).replace(/name":/g, 'label":').replace(/code":/g, 'value":'));
        this.setState({ trainingClassification });
      } else {
        message.error(res.errMsg);
      }
    });

    this.saveModalProps = {
      onOk: this.handleSubmit.bind(this),
      onCancel: this.handleCancel
    };
    this.saveType = null;
    this.examPaperParam = {};   // 输入参数\

    // 获取新建的课程类型
    // this.props.trainModel

    this.state = {
      fileListForTest: [],
      fileListForTestBefor: [],
      trainingClassification: [],
      correctRankHide: 'none',
      testUploadText: '上传试题',
      excelLoading: false,
      canSubmit: true,
      submitLoading: false,
      // coverImgUrl: null,

      // 随堂测试
      saveModalVisible: false,
      previewModalVisidle: false,
      // allQuestionsOpenMap: new Map([]),
      examPaperSwitchCheckedStatus: false,
      initialStatus: true,
      scoreType: '1',  // 1: 按空数  0: 按题数
      firstLoad: false
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.currentCourse && nextProps.currentCourse.paperResponseDTOList && !this.state.firstLoad) {
      for (const item of nextProps.currentCourse.paperResponseDTOList[0].exerciseRspDTOList) {
        if (item.type === 4) {
          this.setState({ scoreType: item.scoreType, firstLoad: true });
          break;
        }
      }
    }
  }
  shouldComponentUpdate(nextProps) {
    const tearchId = this.props.form.getFieldValue('teacherId');
    if (!tearchId && nextProps.chooseIdMap.size !== 0) {
      this.props.form.setFieldsValue({ 'teacherId': 1 });
      return false;
    } else {
      return true;
    }
  }
  /*
  onChange = (info) => {
    let canSubmit = true;
    if (info.file.status === 'done') {
      message.success(`${info.file.name} 上传成功`);
      this.setState({ coverImgUrl: info.file.response.domain + JSON.parse(info.file.response.response).key });
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 上传失败,请检查网络`);
    } else if (info.file.status === 'uploading') {
      canSubmit = false;
    }
    this.setState({ canSubmit });
  }
  */

  // handleQuestionMax = (rule, value, callback) => {
  //   const { questionList } = this.props;
  //   const jobRs = /^[0-9]+$/;
  //
  //   if (!jobRs.test(value) || value > questionList.length) {
  //     callback('设置的课题数不正确或超出总试题数，请重新设置！');
  //   }
  //   callback();
  // };
  handleSubmit = (event) => {
    event && event.preventDefault();
    const { testType, fileList, questionsListMap, currentCourse } = this.props;
    // const { coverImgUrl } = this.state;
    // 课件

    const selectedCourseware = [];
    // let resourceRespDTOListData = currentCourse && currentCourse.resourceRespDTOList;
    for (let i = 0; i < fileList.length; i++) {
      // let resourceRespDTOListDataValues = resourceRespDTOListData && resourceRespDTOListData[i] ? {
      //   privateFlag: resourceRespDTOListData[i].privateFlag, // 对管理员公开 0 | 仅对自己可见 1
      //   needWatchTime: resourceRespDTOListData[i].needWatchTime, // 观看时长
      //   downloadFlag: resourceRespDTOListData[i].downloadFlag, // 下载权限标识 0 | 1
      // } : {};

      const fileItem = fileList[i];
      selectedCourseware[selectedCourseware.length] = {
        type: fileList[i].type,
        fileType: fileList[i].fileType,
        url: fileList[i].url,
        fileName: fileList[i].fileName,
        transcodingId: fileList[i].type === 1 ? fileList[i].transcodingId : '',
        returnUrl: fileList[i].type === 1 ? fileList[i].returnUrl : '',
        accountId: getCache('profile').userId,
        templateResourceId: fileList[i].templateResourceId ? fileList[i].templateResourceId : 0,
        hashCode: fileList[i].hashCode,
        sizeNumber: fileList[i].sizeNumber,
        size: fileList[i].size,
        // courseClassifyCode: fileList[i].courseClassifyCode,
        trainClassifyCode: fileList[i].trainClassifyCode,
        courseClassifyName: fileList[i].courseClassifyName,
        trainClassifyName: fileList[i].trainClassifyName,
        pdfUrl: fileList[i].pdfUrl,
        taskId: fileList[i].taskId,
        id: currentCourse ? fileList[i].id : null,  // 编辑课程时需要的课件id

        // [新增] v3.4.0
        privateFlag: fileItem.privateFlag,
        needWatchTime: fileItem.needWatchTime,
        downloadFlag: fileItem.downloadFlag,
      };
    }

    // const isEdit = currentCourse && currentCourse.contentRespDTO.cover;
    // const coverImg = coverImgUrl ? coverImgUrl : isEdit ? currentCourse.contentRespDTO.cover : null;
    if (selectedCourseware && selectedCourseware.length) {
      this.props.form.setFieldsValue({ courseContent: selectedCourseware });
    }

    // this.props.form.setFieldsValue({ cover: coverImg });
    if (!this.state.canSubmit) {
      message.error('请等待上传完成后再提交!');
      return;
    }
    if (this.state.excelLoading) {
      message.error('请等待试题解析完毕后提交!');
      return;
    }
    // ？？[修复] 操作 预览课程 时多余的一次验证表单项，如课件必填限制；
    this.props.form.validateFields({ force: true });
    this.props.form.validateFieldsAndScroll({
      first: true, // 未生效
      // force: true
    }, (err, values) => {

      if (!err) {
        const { courseTestProcess, courseTestAhead } = this.props;
        const { trainingClassification } = this.state;
        let { courseTitle, passScore, courseIntroduction, homeWork } = values;
        // let lecturerId = '';
        // let lecturerName = '';
        let lecturerList = [];

        if (!this.props.chooseIdMap.size) {
          message.error('请选择讲师!');
          return;
        } else if (this.props.chooseIdMap.size > 30) { // 更新： 选择讲师的人数限制为 30 2018-09-27
          message.error('讲师人数，最多选择 30 位!');
          return;
        }
        for (const [key, value] of this.props.chooseIdMap) {
          // lecturerId = key;
          // lecturerName = value;
          lecturerList.push({
            lecturerId: key,
            lecturerName: value.name,
            lecturerCredit: values[`lecturerCredit-${key}`] ? values[`lecturerCredit-${key}`] : 0,
            post: value.post ? value.post : '',
          })
        }
        /*
         * 1）新建 现场培训 操作下，课件资源为非必填；即该字段将出现 undefined 情况；
         * 2）该字段 移除 时间操作处理未使用？？
        const courseContent = values.courseContent;  // 编辑课程时使用
        courseContent.map((item) => {
          delete item.updateTime;
          delete item.createTime;
        });
        */

        const trainClassifyCode = values.trainingClassification.length > 1 ? values.trainingClassification[1] : values.trainingClassification[0];
        const trainClassifyParentCode = values.trainingClassification[0];
        let trainClassifyNameObj = [];
        trainClassifyNameObj = trainingClassification.filter((item) => {
          return (item.value == trainClassifyParentCode);
        });
        if (trainClassifyCode && trainClassifyCode.length > 4) {
          trainClassifyNameObj.map((item) => {
            if (item.children && item.children.length > 0) {
              trainClassifyNameObj = item.children.filter((itemChildren) => {
                return (itemChildren.value == trainClassifyCode);
              })
            }
          });
        }
        const questionnaireData = this.props.course && this.props.course.currentSelectedTestStatisticsData;
        const courseParam = {
          courseReqDTO: {
            // hospitalId: getCache('profile').hospitalId, // [移除] 该字段 v3.4.0
            deptId: getCache('profile').deptId,
            deptName: getCache('profile').deptName ? getCache('profile').deptName : '',
            // accountId: getCache('profile').userId,
            name: courseTitle,
            // level, [移除] 该字段 v3.4.0
            // courseClassifyCode,
            trainClassifyCode,
            // courseClassifyName: courseClassifyObj[0] ? courseClassifyObj[0].label : '',
            trainClassifyName: trainClassifyNameObj[0] ? trainClassifyNameObj[0].label : '',

            // 更新成为： lecturerList
            // lecturerId,
            // lecturerName,
            // lecturerCredit: lecturerCreditNumber,
            lecturerList,

            trainModel: this.props.trainModel === 'online' ? 0 : 1,
          },
          contentReqDTO: {
            // [移除] 该字段 v3.4.0
            // excelDownAddress: this.state.courseTest ? this.state.courseTest.excelDownAddress : null,
            // excelName: this.state.courseTest ? this.state.courseTest.excelName : null,
            //
            // exerciseCreateType: testType, // 后端 废弃 该字段

            introduction: courseIntroduction,
            // [移除] 该字段 v3.4.0
            // accountId: getCache('profile').userId,
            // cover: values.cover

            // [更新] v3.4.0 版本
            homeWork, // [新增] 课后作业
            questionnaireId: questionnaireData ? questionnaireData.paperId : null, // 满意度问卷调查 id 值
            questionnaireName: questionnaireData ? questionnaireData.paperName : '', // 满意度问卷调查名称
          },
          prePaperReqDTO: courseTestAhead && courseTestAhead.exerciseDOList && courseTestAhead.exerciseDOList.length > 0 ? ({
            totalScore: courseTestAhead.totalScore, //  更新为 总分数字段
            // passScore,
            totalNum: courseTestAhead.totalNum,
            exerciseDOList: courseTestAhead.exerciseDOList,
          }) : null, // [新增] 课前评估
          resourceReqDTOList: selectedCourseware, // [更新] 课件资源 选择或上传
          paperRequestDTO: courseTestProcess && courseTestProcess.exerciseDOList && courseTestProcess.exerciseDOList.length > 0 ? ({
            totalScore: courseTestProcess.totalScore, //  更新为 总分数字段
            // passScore,
            totalNum: courseTestProcess.totalNum,
            exerciseDOList: courseTestProcess.exerciseDOList,
          }) : null, // 随堂测试
        };
        if (currentCourse) {
          courseParam.courseReqDTO = {
            ...courseParam.courseReqDTO,
            id: currentCourse.courseRespDTO.id,
            hospitalName: getCache('profile').hospitalName
          };
          courseParam.contentReqDTO = {
            ...courseParam.contentReqDTO,
            id: currentCourse.contentRespDTO.id,
            courseId: currentCourse.contentRespDTO.courseId,
            // [移除] 该字段 v3.4.0
            // versionIteration: currentCourse.contentRespDTO.versionIteration,
            // version: currentCourse.contentRespDTO.version,
          };
        }

        // if (!courseParam.paperRequestDTO.exerciseDOList.length) {
        //   delete courseParam.paperRequestDTO;
        //   delete courseParam.contentReqDTO.exerciseCreateType;
        // }

        if (this.saveType === 'preview') {
          this.courseParam = {
            ...courseParam,
            courseName: this.props.form.getFieldValue('courseTitle'),
          };

          this.setState({
            previewModalVisidle: true,
          });
        } else if (currentCourse) {
          this.props.submitCourseHandler(courseParam, 'edit');
        } else {
          this.props.submitCourseHandler(courseParam, 'add');
        }

      }
    });
  }
  removeUploadFile = (index, coursewareID) => {
    this.props.deleteCoursewareByIndex(index, coursewareID);
  }
  examPaperSwitchHandler = (checkedStatus) => {
    this.setState({
      examPaperSwitchCheckedStatus: checkedStatus,
      initialStatus: false,
    })
  }
  handleValidateInvalidStr = (rule, value, callback) => {
    if (value.indexOf('/') > -1) {
      let msg = '输入的字符中，不能包含 / ';
      callback(msg);
    } else {
      callback();
    }

  }
  trainingChange(value, name) {
    this.trainClassifyName = name;
    this.props.saveTrainClassifyCode(value[value.length - 1])
  }
  handleScore = (rule, value, callback) => {
    const scoreRs = /^[0-9]{1}(\.)?(\d)?$/;
    if (value !== '') {
      if (!scoreRs.test(value) || value > 10) {
        callback('请输入0.1到10的数字,正数且只精确到小数点后一位!');
      }
    }
    callback();
  }
  chooseIdList = () => {
    const { getFieldDecorator } = this.props.form;
    this.tagStr = '';
    const status = this.props.lecturerCreditStatus;
    for (let [key, value] of this.props.chooseIdMap) {
      const { lecturerCredit } = value;
      this.tagStr = [<Tag className={styles.lecturerCreditTag} closable={true} key={key} onClose={(e) => {
        e.stopPropagation();
        if (this.props.chooseIdMap.size == 1) {
          e.preventDefault();
          message.error('至少选择一个');
          return;
        }
        this.props.closeTagHandler(e, key)
      }}><span onClick={(e) => e.stopPropagation()}>{value.name}{
        status ? (<span >
          <i className={styles.tit}>讲师学分</i>
          <FormItem className={styles.lecturerCreditInputSprite}>
            {getFieldDecorator('lecturerCredit-' + key, {
              initialValue: lecturerCredit ? lecturerCredit : '0.0',
              rules: [{
                validator: this.handleScore
              }]
            })(<InputNumber size="large" min={0} max={10} step={0.1} />)}
          </FormItem>

        </span>) : ''
      }</span></Tag>, ...this.tagStr];
    }
    return this.tagStr ? this.tagStr : '请选择讲师'
  };
  render() {
    const { currentCourse, form, /* fileList, */ questionsListEdit, publicHospitalId,
      testAreaSetting, questionsFiltrateProps, testAreaQueryNum,
      // 弃用
      questionList,

      // 随堂测试
      currentCourseId,
      questionsListMap,
    } = this.props;
    const { getFieldDecorator, getFieldValue } = form;

    let { previewModalVisidle } = this.state;

    let examPaperSwitchCheckedStatus = this.state.examPaperSwitchCheckedStatus || (this.state.initialStatus && currentCourseId && currentCourse && currentCourse.paperResponseDTOList && currentCourse.paperResponseDTOList[0].exerciseRspDTOList
      .length > 0) ? true : false;

    // 重置状态
    this.state.examPaperSwitchCheckedStatus = examPaperSwitchCheckedStatus;

    let codeArray = [];
    if (currentCourse) {
      const { trainClassifyCode } = currentCourse.courseRespDTO;
      if (!trainClassifyCode) {
        codeArray = [];
      } else if (trainClassifyCode && trainClassifyCode.length > 4) {
        codeArray = [trainClassifyCode.slice(0, 4), trainClassifyCode];
      } else {
        codeArray = [trainClassifyCode];
      }
      // let trainingClassification = this.state.trainingClassification;
    }

    const formItemLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 18 },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        span: 24,
        offset: 0,
      },
    };
    const warning = () => {
      message.warning('正在转码中，请稍后');
    };


    const questionsScoreObj = {};
    const examPaperFormItem = QUESTION_TYPE.map((item) => {
      const questionsScore = this.props.questionsScoreMap.get(item.id) || '';
      // 传给预览页面
      questionsScoreObj[item.id] = questionsScore;
    });

    const coursePreviewModalProps = {
      visible: previewModalVisidle,
      questionsListMap,
      questionsScoreObj,
      hospitalName: this.courseParam && this.courseParam.courseReqDTO.hospitalName,
      trainModel: this.props.trainModel,
      scoreType: this.state.scoreType,

      // 整合 以上字段的数据对象：
      courseDetail: this.courseParam,
      onCancel: () => {
        this.setState({ previewModalVisidle: false });
      }
    };

    /* 迁移 至 各独立模块内部 */
    // const colSpan = 100 / (QUESTION_TYPE.length + 1);
    // const questionAffirmStr = QUESTION_TYPE.map((item, index) => {
    //   return (
    //     <span style={{ width: `${colSpan}%` }} key={item.id}>{item.label}</span>
    //   );
    // });
    //
    // const questionAffirmLen = QUESTION_TYPE.map((item, index) => {
    //   return (
    //     <span style={{ width: `${colSpan}%` }} key={item.id}>{questionsLenObj[`questionsLen${item.id}`]}道</span>
    //   );
    // });
    const TrainingManageCustomListProps = {
      dispatch: this.props.dispatch,
      trainModel: this.props.trainModel,
      currentCourse,
      openChooseCoursewareModal: this.props.openChooseCoursewareModal,
      openCreateCoursewareModal: this.props.openCreateCoursewareModal, // 打开 创建
      fileList: this.props.fileList,
      examPaperSwitchCheckedStatus,
      examPaperSwitchHandler: this.examPaperSwitchHandler,

      form: this.props.form,
      // allQuestionsOpenMap: this.state.allQuestionsOpenMap,
      // previewModalVisidle: this.state.previewModalVisidle,
      questionsListMap,
      questionsScoreMap: this.props.questionsScoreMap,
      checkedQuestionItemMap: this.props.checkedQuestionItemMap,
      saveCheckedQuestion: this.props.saveCheckedQuestion,
      // scoreType: this.state.scoreType,
      onChooseTest: this.props.onChooseTest,
      removeUploadFile: this.removeUploadFile,
    }
    return (
      <div>
        <Form onSubmit={this.handleSubmit} ref="courseBasicInfo">
          <div className={styles.createCourseContent}>
            <div className={styles.createCourseTitle}>基本信息</div>
            <FormItem
              {...formItemLayout}
              label="课程名称"
              hasFeedback
            >
              {getFieldDecorator('courseTitle', {
                initialValue: currentCourse ? currentCourse.courseRespDTO.name : '',
                rules: [
                  {
                    required: true,
                    message: '请输入60字以内的标题!',
                    max: 60,
                    whitespace: true,
                  },
                  {
                    validator: this.handleValidateInvalidStr
                  }
                ],
              })(
                <Input placeholder="请输入课程标题" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="课程简介"
            >
              {getFieldDecorator('courseIntroduction', {
                initialValue: currentCourse ? currentCourse.contentRespDTO.introduction : '',
                rules: [{
                  message: '请输入100字以内的简介!', max: 100
                }],
              })(
                <Input type="textarea" placeholder="请输入课程简介" className={styles.textarea} />
              )}
            </FormItem>

            <Row gutter={16}>
              <Col span={3} className={`${styles.formItemLabel} ${styles.required}`}>讲师:</Col>
              <Col span={8}>
                <FormItem>
                  {getFieldDecorator('teacherId', {
                    rules: [{ required: true, message: '请选择讲师!' }],
                  })(
                    <div className={styles.tagDiv} onClick={this.props.openChooseModal}>
                      {this.chooseIdList()}
                    </div>
                  )}
                </FormItem>
              </Col>
              <Col span={8} className={`${styles.formItemLabel}`}>
                <Checkbox
                  // indeterminate={checkedQuestion.length > 0 && (checkedQuestion.length !== questionsList.length)}
                  onChange={e => {
                    this.props.dispatch({
                      type: 'course/lecturerCreditStatusSwitch',
                      payload: { lecturerCreditStatus: !this.props.lecturerCreditStatus }
                    });
                  }}
                  checked={this.props.lecturerCreditStatus ? true : false}
                >
                </Checkbox>
                &nbsp;&nbsp;设置讲师学分&nbsp;&nbsp;
                <span style={{ color: '#bbb', fontSize: 12 }}>(0到10，精确到小数点后一位，例 5.6)</span>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={3} className={`${styles.formItemLabel}`}>培训分类:</Col>
              <Col span={6}>
                <FormItem>
                  {getFieldDecorator('trainingClassification', {
                    // initialValue: currentCourse ? codeArray : [],
                    initialValue: currentCourse ? (() => {
                      if (!this.trainClassifyName) {
                        let arr = this.state.trainingClassification, name;
                        for (let i = 0, len = arr.length; i < len; i++) {
                          if (arr[i].value == codeArray[0]) {
                            name = arr[i].label;

                            if (codeArray[1] && arr[i].children) {
                              for (let j = 0, lenChild = arr[i].children.length; j < lenChild; j++) {
                                if (arr[i].children[j].value == codeArray[1]) {
                                  name = arr[i].children[j].label;
                                }
                              }
                            }

                          }
                        }
                        this.trainClassifyName = name;
                      }
                      return codeArray;
                    })() : [],
                    // rules: [{ required: true, message: '请选择培训分类!' }],
                  })(
                    <Cascader style={{ width: 240 }} options={this.state.trainingClassification} placeholder="请选择培训分类" onChange={(value, selectedOptionArr) => {
                      let trainClassifyName = '';
                      for (let i = 0, len = selectedOptionArr.length; i < len; i++) {
                        trainClassifyName = selectedOptionArr[i].label // 只显示最后一级的名称
                      }
                      this.trainingChange(value, trainClassifyName)
                    }} />
                  )}
                </FormItem>
              </Col>

            </Row>

          </div>

          <TrainingManageCustomList {...TrainingManageCustomListProps} />

          <div className={styles.createPaperFooter}>
            <Affix offsetBottom={0}>
              <FormItem label="">
                <div className={styles.footerCont}>
                  <Button
                    onClick={() => {
                      this.saveType = 'preview';
                      this.handleSubmit();
                    }}
                    type="primary"
                    // disabled={!totalNum}
                    className={styles.savePaperBtn}
                    ghost
                  >预览课程</Button>
                  <Button
                    loading={this.props.submitLoading}
                    onClick={() => {
                      this.saveType = 'save';
                      this.handleSubmit();
                    }}
                    // type="primary"
                    // disabled={!totalNum}
                    className={`${styles.savePaperBtn} ${styles.btnColorG}`}
                  >保存课程</Button>
                </div>
              </FormItem>
            </Affix>
          </div>
          <Modal
            {...this.saveModalProps}
            visible={this.state.saveModalVisible}
            title={'保存课程'}
            confirmLoading={this.props.loading}
          >
            <div className={styles.saveAffirmModal}>
              <p>您确定结束编辑，保存课程{this.saveType === 'publish' ? '并发布' : ''}吗?</p>

            </div>
          </Modal>
          {previewModalVisidle ? <CoursePreviewModal {...coursePreviewModalProps} /> : ''}

        </Form>
      </div>
    );
  }
}

function select(state) {
  const { course, courseTestAhead } = state;
  return { course, courseTestProcess: state.createExamPaper, courseTestAhead };
}

export default Form.create()(connect(select, null)(CourseForm));
