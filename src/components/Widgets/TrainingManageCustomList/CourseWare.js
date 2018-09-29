import React, { Component } from 'react';
import { getCache } from '../../../core/_utils/common';
import { Form, Icon, Row, Col, Button, message, } from 'antd';
import LinkSprite from './LinkSprite';
import styles from './style.css';

const FormItem = Form.Item;

export default class CourseWare extends Component {
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
  handleValidateCourseWare = (rule, value, callback) => {
    // if (this.props.currentCourse && this.props.currentCourse.resourceRespDTOList.length === 0) {
    if (!value || value === ' ' || value.length === 0) {
      callback('请选择在线培训的课件');
      message.warn('请选择在线培训的课件');
    } else {
      callback();
    }
  }
  render () {
    const { fileList, form, currentCourse, dataSource } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    
    const warning = () => {
      message.warning('正在转码中，请稍后');
    };
    const previewUrl = getCache('previewUrl');
    const previewCourseware = (url, type, hospitalId) => { 
      window.open(`${previewUrl}?arg=${encodeURIComponent(url)}&type=${type}`);
    };

    /* 处理课件 */
    const coursewareFile = [];
    for (let i = 0; i < fileList.length; i++) {
      const resource = fileList[i];
      coursewareFile[coursewareFile.length] = {
        isEdit: true,
        uid: i + 1,
        id: resource.id,
        hashCode: resource.hashCode,
        name: resource.fileName,
        status: 'done',
        url: resource.url,
        returnUrl: resource.returnUrl,
        type: resource.type,
        fileType: resource.fileType,
        fileName: resource.fileName,
        transcodingId: resource.transcodingId,
        templateResourceId: resource.templateResourceId,
        pdfUrl: resource.pdfUrl,
        taskId: resource.taskId,
        sizeNumber: resource.transcodingId ? 0 : resource.sizeNumber,
        hospitalId: resource.hospitalId  // 用来判断是否是公共医院的
      };
    }
    
    const uploadFileList = coursewareFile.map((file, index) => {
      let fileTpl = '';
      if (/pdf/i.test(file.fileType)) {
        fileTpl = <a onClick={() => previewCourseware(file.url, 'pdf', file.hospitalId)}>{file.fileName}</a>;
      } else if (file.type === 1) {
        if (file.returnUrl) {
          fileTpl = <a onClick={() => previewCourseware(file.returnUrl, 'video', file.hospitalId)}>{file.fileName}</a>;
        } else {
          fileTpl = <a onClick={warning}>{file.fileName}</a>;
        }
      } else {
        if (file.pdfUrl) {
          fileTpl = <a onClick={() => previewCourseware(file.pdfUrl, 'pdf', file.hospitalId)}>{file.fileName}</a>;
        } else {
          if (file.sizeNumber && (file.sizeNumber / 1024 / 1024 > 10)) {
            fileTpl = <a onClick={warning}>{file.fileName}</a>;
          } else {
            fileTpl = <a href={`https://view.officeapps.live.com/op/view.aspx?src=${file.url}`} target="_blank">{file.fileName}</a>;
          }
        }
      }
      return (
        <div key={index} className={styles.courseFileSprite}>
          <Col span={20} >
            {index + 1}.&nbsp;
            {fileTpl}
          </Col>
          <Col span={4} style={{ textAlign: 'right', paddingRight: 30 }}>
            <a title="删除" onClick={() => this.props.removeUploadFile(index, file.templateResourceId)}>删除</a>
          </Col>
        </div>
      )
    });

    return (
      <div className={this.state.switchPannel ? `${styles.createCourseItemSprite} ${styles.createCourseItemSpriteClosePannel} ${styles.createCourseContentFileList}` : `${styles.createCourseItemSprite} ${styles.createCourseContentFileList}`}>
        <span className={styles.icoStepNumber}>{dataSource.ind}</span>
        <div className={styles.createCourseTitle}>
          <LinkSprite switchPannel={this.switchPannelHandler} deletePannel={this.props.deletePannel} deleteAble={!dataSource.required} linkTabName={dataSource.tab} />
          {dataSource.required ? <span className={styles.icoRequired} style={{ marginLeft: 0, }}></span> : ''}
          课件
        </div>
        <div className={styles.createCourseItemContent}>
          {/*
            required: true, message: '请选择在线培训的课件!'
          */}
          <FormItem label="课件">
            {getFieldDecorator('courseContent', {
              initialValue: currentCourse && currentCourse.resourceRespDTOList ? currentCourse.resourceRespDTOList : (coursewareFile ? coursewareFile : []),
              rules: (this.props.trainModel === 'online' ? [{
                validator: this.handleValidateCourseWare
              }] : [{ required: false, message: '请选择现场培训的课件!' }]),
            })(
              <div className={styles.createCourseText}>
                <div className={styles.createCourseBtnSprite} style={uploadFileList && uploadFileList.length > 0 ? { textAlign: "right" } : null}>
                  <Button type="primary" onClick={this.props.openChooseCoursewareModal} ghost>添加课件</Button>
                  <Button type="primary" onClick={this.props.openCreateCoursewareModal} style={{ marginLeft: 10 }} ghost>上传课件</Button>
                </div>
                <div className={styles.uploadFileList}>
                  {uploadFileList}
                </div>
              </div>

            )}
          </FormItem>
        </div>
      </div>
    )
  }
}