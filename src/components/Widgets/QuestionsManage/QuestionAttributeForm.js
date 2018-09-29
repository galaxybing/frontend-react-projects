import React, { Component } from 'react';
import { Radio, Form, message, Checkbox, Row, Col } from 'antd';
import styles from './style.css';
import Service from '../../../actions/common';
import SelectMultipleDept from '../SelectMultipleDept';
import { getSelectedCode } from '../../../core/_utils/common';
import { getDataByDicName } from '../../../constants'

const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;

class QuestionAttributeForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      difficulty: 2,
      levelList: [],  // 层级
      deptList: [],  // 科室
      subjectList: []  // 科目
    };
  }
  componentDidMount() {
    Service.getDicData().then(data => {
      if (!data.success) {
        message.error(data.errMsg);
        return;
      }
      const levelList = JSON.parse(JSON.stringify(getDataByDicName(data.data,'层级')).replace(/name":/g, 'label":').replace(/code":/g, 'value":'));
      this.setState({ levelList });
    });
    Service.getTagDict({ type: 'DEPARTMENT' }).then(data => {
      if (!data.success) {
        message.error(data.errMsg);
        return;
      }
      const deptList = JSON.parse(JSON.stringify(data.data).replace(/name":/g, 'label":').replace(/code":/g, 'value":'));
      this.setState({ deptList });
    });
    Service.getTagDict({ type: 'SUBJECT' }).then(data => {
      if (!data.success) {
        message.error(data.errMsg);
        return;
      }
      const subjectList = JSON.parse(JSON.stringify(data.data).replace(/name":/g, 'label":').replace(/code":/g, 'value":'));
      this.setState({ subjectList });
    });
  }
  strMapToArr = (map) => {
    const mapArr = [];
    for (const [key, value] of map.entries()) {
      if (value) {
        mapArr[mapArr.length] = key;
      }
    }
    return mapArr.sort();
  }
  render() {
    const { curEdit, notInitialValue, form } = this.props;
    const { getFieldDecorator } = form;
    const { levelList, deptList, subjectList } = this.state;
    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 21 },
      colon: false,
      className: styles.formItem,
    };
    const selectMultipleDeptProps = {
      dataSource: deptList,
      onChange: (value, valueStr) => {
        if (this.props.onChange) {
          this.props.onChange(value, 'department');
        }
      }
    };
    const formData = {
      department: deptList,
      subject: subjectList,
      level: levelList
    };
    let editSubjectCode = [];
    let editDeptCode = [];
    if (curEdit) {  // 编辑试题
      if (!this.props.tempSave) {  // 数据是后台返回的需要特殊处理
        editSubjectCode = getSelectedCode(curEdit.subject);
        editDeptCode = getSelectedCode(curEdit.department);
      } else {
        editSubjectCode = curEdit.subject ? curEdit.subject.split(',') : [];
        editDeptCode = curEdit.department ? curEdit.department.split(',') : [];
      }
    }
    return (
      <div className={styles.uploadQuestionsCont}>
        <Form className="upload-questions-form">
          <FormItem>
            {getFieldDecorator('formData', {
              initialValue: formData,  // 默认其他
            })(
              <input type="hidden" />
              )}
          </FormItem>
          <FormItem label="层级" {...formItemLayout} style={{ marginBottom: 8 }} >
            {getFieldDecorator('level', {
              initialValue: curEdit && curEdit.level ? curEdit.level.split(',') : !notInitialValue ? ['N99'] : [],  // 默认其他
            })(
              <CheckboxGroup
                options={levelList}
                onChange={(value) => {
                  if (this.props.onChange) {
                    this.props.onChange(value, 'level');
                  }
                }}
                className="checkbox-group-large"
              />
              )}
          </FormItem>
          <FormItem label="科室" {...formItemLayout} style={{ marginBottom: 8 }} >
            {getFieldDecorator('department', {
              initialValue: curEdit && curEdit.department ? editDeptCode : [],  // 默认其他
            })(
              <SelectMultipleDept {...selectMultipleDeptProps} />
              )}
          </FormItem>
          <FormItem label="科目" {...formItemLayout} style={{ marginBottom: 2 }} >
            {getFieldDecorator('subject', {
              initialValue: curEdit && curEdit.subject ? editSubjectCode : !notInitialValue ? ['32'] : [],  // 默认其他
            })(
              <CheckboxGroup
                options={subjectList}
                onChange={(value) => {
                  if (this.props.onChange) {
                    this.props.onChange(value, 'subject');
                  }
                }}
                className="checkbox-group-large"
              />
              )}
          </FormItem>
          <FormItem label="难易度" {...formItemLayout}>
            {getFieldDecorator('difficulty', {
              initialValue: curEdit && curEdit.difficulty ? curEdit.difficulty : !notInitialValue ? this.state.difficulty : 0,
            })(
              <Radio.Group
                onChange={(e) => {
                  if (this.props.onChange) {
                    this.props.onChange(e.target.value, 'difficulty');
                  }
                }}
                className="radio-group-large"
              >
                <Radio value={1}>容易</Radio>
                <Radio value={2}>一般</Radio>
                <Radio value={3}>困难</Radio>
              </Radio.Group>
              )}
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default Form.create()(QuestionAttributeForm);
