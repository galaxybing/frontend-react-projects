import React, { Component } from 'react';
import { message, Modal, Form, Input, Select, Button, Icon, Row, Col, Tabs, Cascader, Upload, InputNumber } from 'antd';
import { queryTrainClassifyList, queryCourseClassificationList } from '../../../actions/courseWare';
import CommonService from '../../../actions/common';
import styles from './style.css';
import { PREVIEWURL } from '../../../constants';
import { getCache } from '../../../core/_utils/common';
import { customRequest, beforeUploadByCourseware } from '../../../core/_utils/upload';

const FormItem = Form.Item;
const Option = Select.Option;
let time;
class CoursewareEditModal extends Component {
  constructor(props) {
    super(props);
    const { visible, loading } = this.props;
    this.modalProps = {
      title: '编辑课件',
      visible,
      confirmLoading: loading,
      onOk: this.okHandler.bind(this),
      onCancel: this.handleCancel.bind(this),
      width: 700,
      okText: '保存'
    };

    this.uploadProps = {
      beforeUpload: beforeUploadByCourseware,
      onChange: this.onChange,
      customRequest,
      // showUploadList: false
    };

    this.state = {
      trainingClassification: [],
      courseClassification: [],
      editCoursewareFile: this.props.fileList,
      uploadingFileList: [],
      isUploading: false,
      isUploadAgain: false
    };

    queryTrainClassifyList({ hospitalId: getCache('profile').hospitalId }).then((res) => {
      if (res.success) {
        const trainingClassification = JSON.parse(JSON.stringify(res.data).replace(/name":/g, 'label":').replace(/code":/g, 'value":'));
        this.setState({ trainingClassification });
      } else {
        message.error(res.errMsg);
      }
    });

    queryCourseClassificationList({ "groupId": 3, "type": 0 }).then((res) => {
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
    let fileList = info.fileList;
    fileList = fileList.slice(-1);
    let isUploading = false;
    for (let i = 0; i < fileList.length; i++) {
      if (fileList[i].status === 'uploading') {
        isUploading = true;
        break;
      }
    }
    this.setState({ isUploading });
    fileList = fileList.map((file) => {
      if (file.response) {
        // file.sizeNumber = file.size;
        // file.url = file.response.domain + JSON.parse(file.response.response).key;
        file.fileType = file.type;
        file.url = file.response.domain + JSON.parse(file.response.response).key;
        if (!(/video*/.test(file.type)) && file.type !== 'application/pdf') {
          file.documentMaxSize = file.size / 1024 / 1024 > 10;
        }
      }
      return file;
    });
    const uploadingFileList = fileList.filter((file) => {
      return (file.status === 'uploading');
    });
    this.setState({ uploadingFileList });
    this.props.saveFileList(fileList);
    if (info.file.status === 'done') {
      message.success(`${info.file.name} 上传成功`);
      let fileName = fileList[0].name;
      fileName = fileName.substring(0, fileName.lastIndexOf("."));
      this.props.form.setFieldsValue({
        fileName: fileName
      });
      this.setState({ editCoursewareFile: fileList, isUploadAgain: true });
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 上传失败,请检查网络`);
    }
  }

  okHandler() {
    if (this.state.isUploading) {
      message.error('请等待上传完成后再提交!');
      return;
    }
    const { form, type, resource } = this.props;
    const { trainingClassification, courseClassification, coursewareList, editCoursewareFile, isUploadAgain } = this.state;
    form.validateFields((err, values) => {
      if (!err) {
        
        const { privilegeRead, privilegeDownload, privilegeDurationTime } = values;
        
        const trainClassifyCode = values['trainingClassification'].length > 1 ? values['trainingClassification'][1] : values['trainingClassification'][0];
        const trainClassifyParentCode = values['trainingClassification'][0];
        let trainingClassifyObj = [];
        trainingClassifyObj = trainingClassification.filter(item => {
          return (item.value == trainClassifyParentCode)
        })
        if (trainClassifyCode && trainClassifyCode.length > 4) {
          trainingClassifyObj.map((item) => {
            if (item.children && item.children.length > 0) {
              trainingClassifyObj = item.children.filter((itemChildren) => {
                return (itemChildren.value == trainClassifyCode);
              })
            }

          });
        }

        const courseClassifyCode = values.courseClassification[values.courseClassification.length - 1];
        let courseClassifyObj = [];
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
        let s = editCoursewareFile[0].name;
        s = s.substring(s.lastIndexOf("."), s.length);
        let fileName = values.fileName + s;

        const paramObj = {
          id: resource.id,
          trainClassifyCode,
          taskId: !isUploadAgain ? resource.taskId : null,
          pdfUrl: !isUploadAgain ? resource.pdfUrl : null,
          trainClassifyName: trainingClassifyObj[0] ? trainingClassifyObj[0].label : '',
          courseClassifyCode,
          fileName: fileName,
          url: editCoursewareFile[0].url ? editCoursewareFile[0].url : editCoursewareFile[0].response.domain + JSON.parse(editCoursewareFile[0].response.response).key,
          // transcodingId:转换id,
          hashCode: editCoursewareFile[0].hashCode ? editCoursewareFile[0].hashCode : editCoursewareFile[0].response ? JSON.parse(editCoursewareFile[0].response.response).hash : resource.id,
          // type:附件类型 0视频；1文件,
          courseClassifyName: courseClassifyObj[0] ? courseClassifyObj[0].label : '',
          // size: editCoursewareFile[0].size,
          sizeNumber: editCoursewareFile[0].size,
          
          // 3.4.0 新增 下载权限 + 设置时长
          privateFlag: parseInt(privilegeRead, 10),
          downloadFlag: parseInt(privilegeDownload, 10),
          needWatchTime: parseInt(privilegeDurationTime, 10) * 60,
        };
        // if (editCoursewareFile[0].type === 1 || (/video*/.test(editCoursewareFile[0].type))) {
        if (this.editCoursewareFileType === 'video') {
          paramObj.type = 1;
          paramObj.transcodingId = editCoursewareFile[0].transcodingId ? editCoursewareFile[0].transcodingId : JSON.parse(editCoursewareFile[0].response.response).key
        } else {
          paramObj.type = 2;
        }
        this.props.onOk(paramObj);
      }
    });
  }
  handleCancel() {
    if (this.state.isUploading) {
      message.error('还有课件在上传，请先取消上传再关闭窗口！');
      return;
    }
    this.props.onCancel();
  }
  warning = () => {
    message.warning('正在转码中，请稍后预览');
  }
  error = () => {
    message.error('转码失败，请检查视频后重新上传');
  };
  previewCourseware = (url, type) => {
    window.open(`${PREVIEWURL}?arg=${encodeURIComponent(url)}&type=${type}`);
  };
  onContextMenuHandle = (e) => {
    e.preventDefault();
  }
  render() {
    const { trainingClassification, courseClassification, editCoursewareFile, uploadingFileList } = this.state;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { resource, fileList } = this.props;

    const { trainClassifyCode } = resource;
    let fileName = resource.fileName;
    fileName = fileName.substring(0, fileName.lastIndexOf("."));
    let codeArray = [];
    if (!trainClassifyCode) {
      codeArray = [];
    } else if (trainClassifyCode && trainClassifyCode.length > 4) {
      codeArray = [trainClassifyCode.slice(0, 4), trainClassifyCode];
    } else {
      codeArray = [trainClassifyCode];
    }
    
    // 更新 编辑输入项的 下载权限 | 设置时长 选项的显示与否
    if (editCoursewareFile && editCoursewareFile[0].type === 1 || (/video*/.test(editCoursewareFile[0].type))) {
      this.editCoursewareFileType = 'video';
    } else {
      this.editCoursewareFileType = 'doc';
    }
    
    const fileItem = editCoursewareFile.map((file, index) => {
      let fileTpl = '';
      if (/pdf/i.test(file.fileType)) {
        fileTpl = <p style={{ textAlign: 'center' }}><a onClick={() => this.previewCourseware(file.url, 'pdf')} style={{ backgroundImage: `url(${require('./file-icon.png')})` }}></a>{file.name}</p>;
      } else {
        if (file.pdfUrl) {
          fileTpl = <p style={{ textAlign: 'center' }}><a onClick={() => this.previewCourseware(file.pdfUrl, 'pdf')} style={{ backgroundImage: `url(${require('./file-icon.png')})` }}></a>{file.name}</p>;
        } else {
          if (file.documentMaxSize) {
            fileTpl = <a onClick={this.warning} style={{ backgroundImage: `url(${require('./file-icon.png')})` }}></a>
          } else if (file.url &&　file.name){
            fileTpl = <p style={{ textAlign: 'center' }}><a href={`https://view.officeapps.live.com/op/view.aspx?src=${file.url}`} target="_blank" style={{ backgroundImage: `url(${require('./file-icon.png')})`, display: 'block' }}></a>{file.name}</p>
          } else {
            fileTpl = <a href={`https://view.officeapps.live.com/op/view.aspx?src=${file.url}`} target="_blank" style={{ backgroundImage: `url(${require('./file-icon.png')})` }}></a>
          }
        }
      }

      if (file.type === 1 || (/video*/.test(file.type))) {
        if (file.returnUrl) {
          return (
            <div key={index}>
              <div className={styles.fileContent}>
                <video
                  controls
                  name="media"
                  onContextMenu={this.onContextMenuHandle}
                >
                  <source src={file.returnUrl} type="video/mp4"></source>
                </video>
              </div>
              <div className={styles.editModalButtonRow}>

                <Upload {...this.uploadProps} fileList={uploadingFileList}>
                  <Button type="primary" className={styles.buttonGreen} style={{ marginRight: "10px" }}>重新上传</Button>
                </Upload>
              </div>
            </div>
          )
        } else {
          return (
            <div key={index}>
              <div className={styles.fileContent}>
                <div className={styles.transcodingBox}>
                  <Icon type="sync" style={{ marginRight: 5 }} />
                  {file.status === -1 ? '转码失败，请检查视频后重新上传' : '转码中...'}
                </div>
              </div>
              <div className={styles.editModalButtonRow}>

                <Upload {...this.uploadProps} fileList={uploadingFileList}>
                  <Button type="primary" className={styles.buttonGreen} style={{ marginRight: "10px" }}>重新上传</Button>
                </Upload>
              </div>
            </div>
          )
        }
      } else {
        return (
          <div key={index}>
            <div className={styles.fileContent}>
              {fileTpl}
            </div>
            <div className={styles.editModalButtonRow}>
              <Upload {...this.uploadProps} fileList={uploadingFileList}>
                <Button type="primary" className={styles.buttonGreen} style={{ marginRight: 10 }}>重新上传</Button>
              </Upload>
            </div>
          </div>
        );
      }
    });

    return (
      <div>
        <Modal {...this.modalProps}>
          <div className={styles.modalPadding}>
            <Form>
              <div>
                <div className={styles.formItem}>
                  <span className={styles.formTitle}>课件名称</span>
                  <FormItem className={styles.formContent}>
                    {getFieldDecorator(`fileName`, {
                      initialValue: fileName,
                      rules: [{ required: true, message: ' ' }],
                    })(
                      <Input style={{ width: 180 }} placeholder="请输入课件名称" />
                    )}
                  </FormItem>
                </div>
              </div>
              <div className={styles.formItem}>
                <span className={styles.formTitle}>课程分类</span>
                <FormItem className={styles.formContent}>
                  {getFieldDecorator(`courseClassification`, {
                    initialValue: resource.courseClassifyCodeParent ? [resource.courseClassifyCodeParent, resource.courseClassifyCode] : resource.courseClassifyCode ? [resource.courseClassifyCode] : '',
                    // rules: [{ required: true, message: ' ' }],
                  })(
                    <Cascader style={{ width: 180 }} options={courseClassification} placeholder="请选择课程分类" />
                  )}
                </FormItem>
              </div>
              <div className={styles.formItem}>
                <span className={styles.formTitle}>培训分类</span>
                <FormItem className={styles.formContent}>
                  {getFieldDecorator(`trainingClassification`, {
                    initialValue: resource.trainClassifyCode ? codeArray : '',
                    // rules: [{ required: true, message: ' ' }],
                  })(
                    <Cascader style={{ width: 180 }} options={trainingClassification} placeholder="请选择培训分类" />
                  )}
                </FormItem>
              </div>
              
              <div className={styles.formItem}>
                <span className={styles.formTitle}>可见范围</span>
                <FormItem className={styles.formContent}>
                  {getFieldDecorator(`privilegeRead`, {
                    initialValue: resource.privateFlag === 1 ? '1' : '0',
                  })(
                    <Select style={{ width: 180 }}>
                      <Option value={'0'}>管理员可见</Option>
                      <Option value={'1'}>仅自己可见</Option>
                    </Select>
                  )}
                </FormItem>
              </div>
              {
                this.editCoursewareFileType === 'video' ? ( // 视频资源 可设置
                  <div className={styles.formItem}>
                    <span className={styles.formTitle}>下载权限</span>
                    <FormItem className={styles.formContent}>
                      {getFieldDecorator(`privilegeDownload`, {
                        initialValue: resource.downloadFlag === 1 ? '1' : '0',
                      })(
                        <Select style={{ width: 180 }}>
                          <Option value={'1'}>允许下载</Option>
                          <Option value={'0'}>禁止下载</Option>
                        </Select>
                      )}
                    </FormItem>
                  </div>
                ): ( // 文档资源 需要设置观看时长
                  <div className={styles.formItem}>
                    <span className={styles.formTitle}>观看时长</span>
                    <FormItem className={styles.formContent}>
                      {getFieldDecorator(`privilegeDurationTime`, {
                        initialValue: resource.needWatchTime ? parseInt(resource.needWatchTime/60 *10, 10)/10 : '', // 更新 编辑课件时，旧数据没有观看时长时不设置为 5
                      })(
                        <InputNumber min={1} max={99} />
                      )}
                       分钟
                    </FormItem>
                  </div>
                )
              }
              
              <FormItem>
                <div className={styles.fileBox}>
                  {fileItem}
                </div>
              </FormItem>
            </Form>
          </div>
        </Modal>
      </div>
    );
  }

}

export default Form.create()(CoursewareEditModal);

