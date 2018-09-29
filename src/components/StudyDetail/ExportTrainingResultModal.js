import React from 'react';
import { Modal, Button, Checkbox, Row, Col, message } from 'antd';
import Service from '../../actions/studyDetail';
import styles from './ExportTrainingResultModal.css';

class ExportTrainingResultModal extends React.Component {
  constructor(props) {
    super(props);
    const { onCancel, visible } = this.props;
    this.modalProps = {
      title: '导出',
      width: 660,
      footer: null,
      visible,
      onCancel,
    }
    this.state = {
      curActiveKey: 1,
      exportFields: [1, 5, 11, 12, 17, 21, 6, 8, 9, /*22, 23, 24,*/ 40, 41, 42]
    }
    this.exportFields = [
      { label: '学员卡号', value: 1, key: 'ACCOUNT_CARD_NUM' },
      // { label: '活动时间', value: 2, key: 'ACTIVITY_TIME' },
      // { label: '课题ID', value: 3, key: 'COURSE_TOPIC_ID' },
      // { label: '单位名称', value: 4, key: 'UNIT_NAME' },
      { label: '姓名', value: 5, key: 'NAME' },
      { label: '工号', value: 6, key: 'JOB_NUMBER' },
      { label: '科室', value: 8, key: 'DEPT_NAME' },
      { label: '病区', value: 9, key: 'WARD_NAME' },
      { label: '完成情况', value: 11, key: 'STUDY_STATUS' },
      { label: '学习类型', value: 12, key: 'COMPULSORY_FLAG_STR' },
      { label: '签到时间', value: 13, key: 'SIGN_TIME' },
      { label: '测验时间', value: 14, key: 'EXERCISE_TIME' },
      { label: '测验最高分', value: 21, key: 'MAX_SCORE' },

      { label: '课前评估正确率', value: 40, key: 'TEST_1' }, // 江苏省人民医院迁移至公版
      { label: '课后作业分数', value: 41, key: 'TEST_2' },
      { label: '完成时间', value: 42, key: 'TEST_3' },

      { label: '测验分数', value: 15, key: 'SCORE' },
      { label: '测验结果', value: 17, key: 'EXERCISE_RESULT' },
      { label: '手机号', value: 10, key: 'MOBILE' },
      { label: '职称', value: 7, key: 'PROFESSIONAL_TITLE' },
      { label: '职务', value: 19, key: '' },
      { label: '层级', value: 20, key: '' },
      // { label: '第*次测验', value: 16, key: 'EXERCISE_NUM' },
      // { label: '最终测验结果', value: 18, key: 'FINAL_RESULT' },
    ];
    this.exportType = [
      { label: '国家继教网', key: 0 },
      { label: '自定义', key: 1 },
    ];
  }
  componentDidMount() {
    Service.exportFieldRecord().then(data => {
      if (!data.success) {
        message.error(data.errMsg);
        return;
      }
      if (data.data.exportFields) {
        let arr = data.data.exportFields.split(',');
        arr = arr.filter((i) => {
          const val = +i;
          if (val === 22 || val === 23 || val === 24) { // 兼容处理 后端接口返回旧数据值，导致前端传参错误问题；
            return false;
          } else {
            return true;
          }
        });
        arr = arr.map(i => +i);

        this.setState({
          exportFields: arr
        });
      }
    });
  }
  export = () => {
    const { releaseId, hospitalBranchIds, deptIds, wardIds, compulsoryFlag, testStatus, status } = this.props.filter;
    let params = { releaseId, hospitalBranchIds, deptIds, wardIds, compulsoryFlag, testStatus, status };
    if (this.state.curActiveKey == 1) {  // 自定义
      params = {
        ...params,
        exportType: 2,
        exportFields: this.state.exportFields.join(',')
      }
    } else {
      params = {
        ...params,
        exportType: 1,
        exportFields: null
      }
    }
    Service.exportResult(params);
    this.props.onCancel();
  }
  onExportFieldsChange = (checkedValues) => {
    let lastChar = checkedValues[checkedValues.length - 1];
    if (lastChar === 15) {
      checkedValues = this.removeChar(checkedValues, 21)
    } else if (lastChar === 21) {
      checkedValues = this.removeChar(checkedValues, 15)
    }
    this.setState({
      exportFields: checkedValues
    });
  }
  removeChar(arr, char) {
    let index = arr.indexOf(char);
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
  }
  render() {
    const { curActiveKey } = this.state;
    const exportFieldsItem = this.exportFields.map((item, index) => {
      // <i style={{display: 'block', clear: 'both', width: '100%'}}></i>
      return (
        <Col span={5} className="boz-ant-col-5" key={index}>
          <Checkbox
            value={item.value}
          >{item.label}</Checkbox>
        </Col>
      )
    });
    const exportTypeItem = this.exportType.map((item, index) => (
      <Button
        key={index}
        size="large"
        type={curActiveKey == item.key ? 'primary' : ''}
        ghost={curActiveKey != item.key}
        className={curActiveKey != item.key ? styles.buttonGhost : ''}
        onClick={() => this.setState({ curActiveKey: item.key })}
      >{item.label}</Button>
    ));
    return (
      <Modal {...this.modalProps}>
        <div className={styles.exportExamResultModal}>
          <div className={styles.filterRow}>
            {exportTypeItem}
          </div>
          {
            curActiveKey == 1 ?
              <div className={styles.customBody}>
                <Checkbox.Group
                  className="checkbox-group-large"
                  value={this.state.exportFields}
                  onChange={this.onExportFieldsChange}
                >
                  <Row className={styles.exportFieldsRow}>{exportFieldsItem}</Row>
                </Checkbox.Group>
              </div> : ''
          }
          <div className={styles.modalButtonRow}>
            <Button type="primary" onClick={() => this.export()} disabled={this.state.curActiveKey == 1 && !this.state.exportFields.length}>确认导出</Button>
          </div>
        </div>
      </Modal>
    );
  }
}
export default ExportTrainingResultModal;
