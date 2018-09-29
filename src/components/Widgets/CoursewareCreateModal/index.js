import React, { Component } from 'react';
import { Modal, Button, Form, Upload, Table, message, Row, Col, Select, Icon, Tooltip, Cascader, Progress, Popconfirm, InputNumber } from 'antd';
import styles from './style.css';
import CommonService from '../../../actions/common';
import CourseWareRequest from '../../../actions/courseWare';
import { getCache } from '../../../core/_utils/common';
import { customRequest, beforeUploadByCourseware } from '../../../core/_utils/upload';

const FormItem = Form.Item;
const Option = Select.Option;
let time;
class CoursewareCreateModal extends Component {
  constructor(props) {
    super(props);
    const { visible, loading } = this.props;
    this.modalProps = {
      visible,
      title: '上传课件',
      // width: 700,
      width: 980,
      onCancel: this.handleCancel.bind(this),
      onOk: this.handleSubmit.bind(this),
      confirmLoading: loading,
    };
    this.uploadProps = {
      beforeUpload: beforeUploadByCourseware,
      onChange: this.onChange,
      customRequest,
      // showUploadList: false
    };
    this.uuid = 0;
    this.state = {
      fileList: [],
      uploadingFileList: [],
      coursewareList: new Map(),
      trainingClassification: [],
      courseClassification: [],
      isUploading: false,
    };
    CourseWareRequest.queryTrainClassifyList({ hospitalId: getCache('profile').hospitalId }).then((res) => {
      if (res.success) {
        const trainingClassification = JSON.parse(JSON.stringify(res.data).replace(/name":/g, 'label":').replace(/code":/g, 'value":'));
        this.setState({ trainingClassification });
      } else {
        message.error(res.errMsg);
      }
    });
    CourseWareRequest.queryCourseClassificationList({ "groupId": 3, "type": 0 }).then((res) => {
      if (res.success) {
        const courseClassification = JSON.parse(JSON.stringify(res.data).replace(/name":/g, 'label":').replace(/code":/g, 'value":'));
        this.setState({ courseClassification });
      } else {
        message.error(res.errMsg);
      }
    });
  }
  componentDidMount() {
    /**
     * 在此页面每5分钟调用一次后台接口，防止上传大文件时，session过期
     */
    time = setInterval(() => {
      CommonService.getSystemTime(1);
    }, 5 * 60 * 1000);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.loading !== this.props.loading) {
      this.modalProps.confirmLoading = nextProps.loading;
    }
  }
  componentWillUnmount() {
    clearInterval(time);
  }
  onChange = (info) => {
    const fileList = info.fileList;
    const coursewareFile = info.file;
    let isUploading = false;
    for (let i = 0; i < fileList.length; i++) {
      if (fileList[i].status === 'uploading') {
        isUploading = true;
        break;
      }
    }
    this.setState({ isUploading });
    if (coursewareFile.response) {
      if (/video*/.test(coursewareFile.type) || coursewareFile.type === 'application/pdf') {
        coursewareFile.url = `${coursewareFile.response.domain}${JSON.parse(coursewareFile.response.response).key}`;
        if (/video*/.test(coursewareFile.type)) {
          coursewareFile.createCoursewareFileType = 'video';
        } else {
          coursewareFile.createCoursewareFileType = 'doc';
        }
      } else {
        coursewareFile.url = `https://view.officeapps.live.com/op/view.aspx?src=${coursewareFile.response.domain + JSON.parse(coursewareFile.response.response).key}`;
        coursewareFile.createCoursewareFileType = 'doc';
      }
    }
    const uploadingFileList = fileList.filter((file) => {
      return (file.status === 'uploading');
    });
    this.setState({ fileList, uploadingFileList });
    if (info.file.status === 'done') {
      message.success(`${info.file.name} 上传成功`);
      this.uuid++;
      const { form } = this.props;
      const keys = form.getFieldValue('keys');
      const nextKeys = keys.concat(this.uuid);
      form.setFieldsValue({
        keys: nextKeys,
      });
      const coursewareList = this.state.coursewareList;
      coursewareList.set(this.uuid, coursewareFile);
      this.setState({ coursewareList });
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 上传失败,请检查网络`);
    }
  }
  remove = (k, uid) => {
    const fileList = [];
    for (let file of this.state.fileList) {
      if (file.uid !== uid) {
        fileList.push(file);
      }
    }
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
    const coursewareList = this.state.coursewareList;
    coursewareList.delete(k);
    this.setState({ coursewareList, fileList });
    message.success('删除成功');
  }
  
  handleSubmit() {
    if (this.state.isUploading) {
      message.error('请等待上传完成后再提交!');
      return;
    }
    if (this.state.coursewareList.size !== 0) {
      const { form, type, content } = this.props;
      const { trainingClassification, courseClassification, coursewareList } = this.state;
      form.validateFields((err, values) => {
        if (!err) {
          const createParam = [];
          let paramObj = {};
          for (let i = 0; i < values.keys.length; i++) {
            const key = values.keys[i];
            const courseware = coursewareList.get(key);

            const courseClassifyCode = values[`courseClassification-${key}`][values[`courseClassification-${key}`].length - 1];
            const trainClassifyCode = values[`trainingClassification-${key}`].length > 1 ? values[`trainingClassification-${key}`][1] : values[`trainingClassification-${key}`][0];
            const trainingClassifyParentCode = values[`trainingClassification-${key}`][0];
            let trainClassifyObj = [];
            let courseClassifyObj = [];

            trainClassifyObj = trainingClassification.filter(item => {
              return (item.value == trainingClassifyParentCode)
            })
            if (trainClassifyCode && trainClassifyCode.length > 4) {
              trainClassifyObj.map((item) => {
                if (item.children && item.children.length > 0) {
                  trainClassifyObj = item.children.filter((itemChildren) => {
                    return (itemChildren.value == trainClassifyCode);
                  })
                }
              });
            }

            courseClassifyObj = courseClassification.filter(course => {
              return (course.value == courseClassifyCode);
            });
            if (courseClassifyObj.length === 0) {
              courseClassification.map((course) => {
                if (course.children) {
                  if (courseClassifyObj.length === 0) {
                    courseClassifyObj = course.children.filter((courseChildren) => {
                      return (courseChildren.value == courseClassifyCode);
                    })
                  }
                }
              });
            }
            
            // 获取 课件权限设置的值
            const privateFlag = parseInt(values[`privilegeRead-${key}`], 10);
            const downloadFlag = parseInt(values[`privilegeDownload-${key}`], 10);
            const needWatchTime = parseInt(values[`privilegeDurationTime-${key}`] * 10, 10)/10 * 60;

            paramObj = {
              // 培训分类和课程分类改为选填项，若未选择默归属到其他分类。
              trainClassifyCode: trainClassifyObj[0] ? trainClassifyCode: '10040001',
              trainClassifyName: trainClassifyObj[0] ? trainClassifyObj[0].label : '其他培训',
              courseClassifyCode: courseClassifyObj[0] ? courseClassifyCode : 310,
              fileName: courseware.name,
              url: courseware.response.domain + JSON.parse(courseware.response.response).key,
              // transcodingId:转换id,
              hashCode: JSON.parse(courseware.response.response).hash,
              // type:附件类型 0视频；1文件,
              courseClassifyName: courseClassifyObj[0] ? courseClassifyObj[0].label : '其他',
              sizeNumber: courseware.size,
              
              // 3.4.0 [新增] 课件资源权限属性设置
              privateFlag: privateFlag ? privateFlag : 0,
              downloadFlag: downloadFlag ? downloadFlag: 0,
              needWatchTime: needWatchTime ? needWatchTime : 0,
            };
            if (this.props.fromPage && this.props.fromPage === 'course') {
              // paramObj.id = key;
              // paramObj.templateResourceId = 0;
            }
            if (/video*/.test(courseware.type)) {
              paramObj.type = 1;
              paramObj.transcodingId = JSON.parse(courseware.response.response).key;
              if (this.props.fromPage && this.props.fromPage === 'course') {
                paramObj.fileType = 'mp4';
              }
            } else {
              paramObj.type = 2;
              if (this.props.fromPage && this.props.fromPage === 'course') {
                paramObj.fileType = courseware.name.split('.')[courseware.name.split('.').length - 1];
              }
            }
            createParam[createParam.length] = { ...paramObj };
          }
          this.props.onOk(createParam);
        }
      });
    } else {
      message.warn('请上传课件资源，再提交!');
    }
  }
  handleCancel() {
    if (this.state.isUploading) {
      message.error('还有课件在上传，请先取消上传再关闭窗口！');
      return;
    }
    this.props.onCancel();
  }
  render() {
    const { getFieldDecorator, getFieldValue, setFieldsValue } = this.props.form;
    const { fileList, coursewareList, uploadingFileList, trainingClassification, courseClassification } = this.state;
    // const trainingClassificationOptions = trainingClassification.map(d =>
    //   <Option key={d.code}>{d.name}</Option>
    // );
    let codeArray;
    const { trainClassifyCode } = this.props;
    if (!trainClassifyCode) {
      codeArray = [];
    } else if (trainClassifyCode && trainClassifyCode.length > 4) {
      codeArray = [trainClassifyCode.slice(0, 4), trainClassifyCode];
    } else {
      codeArray = [trainClassifyCode]
    }
    getFieldDecorator('keys', { initialValue: [] });
    const keys = getFieldValue('keys');
    const formItems = keys.map((k, index) => {
      const courseware = coursewareList.get(k);
      return (
        courseware ?
          <div key={k}>
            <Row gutter={16} className={styles.formRow}>
              <Col className={`gutter-row ${styles.formCol}`} span={5}>
                <div className={styles.coursewareName}>
                  <Icon type="paper-clip" />
                  {courseware.name}
                </div>
              </Col>
              <Col className={`gutter-row ${styles.formCol}`} span={8}>
                <FormItem className={styles.formItem}>
                  {getFieldDecorator(`courseClassification-${k}`, {
                    initialValue: this.props.courseClassifyCodeParent ? [this.props.courseClassifyCodeParent, this.props.courseClassifyCode] : this.props.courseClassifyCode ? [this.props.courseClassifyCode] : '',
                    // rules: [{ required: true, message: ' ' }],
                  })(
                    <Cascader style={{ width: 140 }} options={courseClassification} placeholder="请选择课程分类" />
                  )}
                </FormItem>
                <FormItem className={styles.formItem}>
                  {getFieldDecorator(`trainingClassification-${k}`, {
                    initialValue: this.props.trainClassifyCode ? codeArray : [],
                    // rules: [{ required: true, message: ' ' }],
                  })(
                    <Cascader style={{ width: 140 }} options={trainingClassification} placeholder="请选择培训分类" />
                  )}
                </FormItem>
              </Col>
              <Col className={`gutter-row ${styles.formCol}`} span={4}>
                <FormItem className={styles.formItem}>
                  {getFieldDecorator(`privilegeRead-${k}`, {
                    initialValue: '0',
                  })(
                    <Select style={{ width: 135 }}>
                      <Option value={'0'}>管理员可见</Option>
                      <Option value={'1'}>仅自己可见</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col className={`gutter-row ${styles.formCol}`} span={5}>
                {
                  courseware.createCoursewareFileType === 'video' ? (
                    <FormItem className={styles.formItem}>
                      {getFieldDecorator(`privilegeDownload-${k}`, {
                        initialValue: '1',
                      })(
                        <Select style={{ width: 135 }}>
                          <Option value={'1'}>允许下载</Option>
                          <Option value={'0'}>禁止下载</Option>
                        </Select>
                      )}
                      
                    </FormItem>
                  ): (
                    <FormItem className={styles.formItem}>
                      <span style={{marginRight: 8}}>观看时长</span>
                      {getFieldDecorator(`privilegeDurationTime-${k}`, {
                        initialValue: 5,
                      })(
                        <InputNumber min={1} max={99} style={{width: 50}} /*onChange={() => this.updateCoursewarePrivilege(k, courseware.uid)}*/ />
                      )}
                       分钟&nbsp;
                        <Tooltip placement="right" title={'设置课件最短观看时长，学员需达到规定时长才算完成学习！'}>
                         <Icon type="question-circle-o" className={styles.tipsIcon} />
                        </Tooltip>
                    </FormItem>
                  )
                }
              </Col>
              <Col className={`gutter-row ${styles.formCol}`} span={2}>
                <Popconfirm title="确定删除？" onConfirm={() => this.remove(k, courseware.uid)}>
                  <a>删除</a>
                </Popconfirm>
              </Col>
            </Row>
          </div> : ''
      );
    });

    return (
      <div>
        <Modal {...this.modalProps} >
          <div className={styles.modalBody}>
            <div className=''>
              <Upload {...this.uploadProps} fileList={uploadingFileList}>
                <Button type="primary" style={{ marginRight: "10px" }}>选择上传课件</Button>
                <ul className={styles.tipsList}>
                  <li>支持上传视频、PPT或PDF或WORD文件</li>
                  <li>视频大小不超过1G，文件大小不超过50M</li>
                  <li>课件同时上传到本院课件库</li>
                </ul>
              </Upload>
            </div>
            {coursewareList.size !== 0 ?
              <div className={styles.formBody}>
                <div className={styles.formLabel}>
                  <Row gutter={16} className={styles.formRow}>{/* 22 */}
                    <Col className={`gutter-row ${styles.formCol}`} span={5}>课件</Col>
                    <Col className={`gutter-row ${styles.formCol}`} span={8}>分类</Col>
                    <Col className={`gutter-row ${styles.formCol}`} span={4}>可见范围</Col>
                    <Col className={`gutter-row ${styles.formCol}`} span={5}>其他</Col>
                    <Col className={styles.formCol} span={2}>操作</Col>
                  </Row>
                </div>
                <div className={`courseware-form ${styles.formContent}`}>
                  <Form>
                    {formItems}
                  </Form>
                </div>
              </div> : ''}
          </div>
        </Modal>
      </div>
    );
  }
};
export default Form.create()(CoursewareCreateModal);
