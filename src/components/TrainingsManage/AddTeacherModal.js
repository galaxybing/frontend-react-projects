import React from 'react';
import { Modal, Button, Form, Input, Icon, Row, Col, Select } from 'antd';
import { message } from 'antd';
import { getCache } from '../../core/_utils/storage';

import styles from './Course.css';
const FormItem = Form.Item;

let uuid = 0;
class AddTeacherModal extends React.Component { /* 废弃 修改为在列表项，新增一行空白输入项 */
  constructor(props) {
    super(props);
    this.hiddenMap = new Map([[0, this.props.current && this.props.current.unitType === 3 ? 'text' : 'hidden']]);
    const { addVisible, addType, current, loading } = this.props;
    this.modalProps = {
      confirmLoading: loading,
      visible: addVisible,
      width: 700,
      title: addType === "create" ? "新增讲师" : "讲师信息修改",
      onCancel: this.openTeacherModal.bind(this),
      onOk: this.handleSubmit
    };
  }


  remove = (k) => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    // We need at least one passenge

    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  }

  add = () => {
    uuid++;
    this.hiddenMap.set(uuid, 'hidden');
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');

    const nextKeys = keys.concat(uuid);
    if (nextKeys.length > 9) {
      return;
    }

    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys,
    });


  }
  openTeacherModal = () => {
    this.props.openTeacherModal();
  }
  handleSubmit = (e) => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (this.props.addType === 'create') {
          let valueArr = [];
          for (let j = 0; j < values.keys.length; j++) {
            const key = values.keys[j];
            let unitName = values['unitNameInput-' + key]
            if (values['unitName-' + key] === "3" && !values['unitNameInput-' + key]) {
              //message.error('请填写组织名称');
              //return;
              unitName = '其他组织';
            }

            if (values['unitName-' + key] === "1") {
              unitName = '本院护理人员';
            } else if (values['unitName-' + key] === "2") {
              unitName = '本院其他人员';
            }
            valueArr[valueArr.length] = {
              name: values['name-' + key],
              mobile: values['mobile-' + key],
              post: values['post-' + key],
              unitType: values['unitName-' + key],
              unitName: unitName,
              hospitalId: getCache('profile').hospitalId,
              accountId: getCache('profile').userId,
            }
          }

          this.props.addTeacherHandler({ lecturerReqDTOList: valueArr });
        } else {
          let unitName = values['unitNameInput-0']
          if (values['unitName-0'] === "1") {
            unitName = '本院护理人员';
          } else if (values['unitName-0'] === "2") {
            unitName = '本院其他人员';
          } else if (values['unitName-0'] === "3" && !unitName) {
            unitName = '其他组织';
          }
          let valueObj = {
            id: this.props.current.id,
            name: values['name-0'],
            mobile: values['mobile-0'],
            post: values['post-0'],
            unitType: values['unitName-0'],
            unitName: unitName,
            accountId: getCache('profile').userId,
          }

          this.props.editTeacherHandler(valueObj);
        }
      }
    });
  }
  // editSubmit = (e) => {
  //   this.props.form.validateFields((err, values) => {
  //     if (!err) {
  //       let unitName = values['unitNameInput-0']
  //       if (values['unitName-0'] === "1") {
  //         unitName = '本院护理人员';
  //       } else if (values['unitName-0'] === "2") {
  //         unitName = '本院其他人员';
  //       }
  //       let valueObj = {
  //         id: this.props.current.id,
  //         name: values['name-0'],
  //         mobile: values['mobile-0'],
  //         post: values['post-0'],
  //         unitType: values['unitName-0'],
  //         unitName: unitName,
  //         accountId: getCache('profile').userId,
  //       }

  //       this.props.editTeacherHandler(valueObj);

  //     }
  //   });
  // }
  selectSelectHandle = (value, option) => {
    if (value === '3') {
      this.hiddenMap.set(option.props.data_num, 'text');
    } else {
      this.hiddenMap.set(option.props.data_num, 'hidden');
    }
    const { form } = this.props;
    let keys = form.getFieldValue('keys');
    form.setFieldsValue({
      keys: keys,
    });
  }

  render() {
    const { current } = this.props;

    const { getFieldDecorator, getFieldValue } = this.props.form;

    getFieldDecorator('keys', { initialValue: [0] });
    const keys = getFieldValue('keys');
    const formItems = keys.map((k, index) => {
      let ishidden = this.hiddenMap.get(k);
      // if (current && current.unitType === 3 && ishidden === 'text') {
      //   ishidden = 'text';
      // } else {

      // }
      return (
        <div key={k}>
          <Row gutter={16}>
            <Col span={5} className={`gutter-row ${styles.unitName}`}>
              <FormItem className='gutter-box'>
                <div>
                  {getFieldDecorator(`unitName-${k}`, {
                    initialValue: current.unitType ? current.unitType.toString() : '1',
                    rules: [{
                      required: false,
                      whitespace: true,
                      message: "格式输入有误",
                    }]
                  })(
                    <Select onSelect={this.selectSelectHandle}>
                      <Select.Option data_num={k} value="1">本院讲师</Select.Option>
                      <Select.Option data_num={k} value="3">其他组织</Select.Option>
                    </Select>
                  )}
                </div>
              </FormItem>
              <FormItem className='gutter-box'>
                <div>
                  {getFieldDecorator(`unitNameInput-${k}`, {
                    initialValue: current.unitType === 3 ? current.unitName : null,
                    validateTrigger: ['onChange', 'onBlur'],
                    rules: [{
                      required: false,
                      whitespace: true,
                      message: "请输入60字以内的内容",
                      max: 60
                    }],
                  })(
                    <Input id='unitNameInput-${k}' placeholder="请输入组织名称" type={ishidden} />
                  )}
                </div>
              </FormItem>
            </Col>
            <Col span={5} className="gutter-row">
              <FormItem className='gutter-box'>
                <div>
                  {getFieldDecorator(`name-${k}`, {
                    initialValue: current.name,
                    validateTrigger: ['onChange', 'onBlur'],
                    rules: [{
                      required: true,
                      whitespace: true,
                      message: "请输入18字以内的内容",
                      max: 18
                    }],
                  })(
                    <Input placeholder="姓名" />
                  )}
                </div>
              </FormItem>
            </Col>
            <Col span={6} className="gutter-row">
              <FormItem className='gutter-box'>
                <div>
                  {getFieldDecorator(`post-${k}`, {
                    initialValue: current.post,
                    validateTrigger: ['onChange', 'onBlur'],
                    rules: [{
                      required: true,
                      whitespace: true,
                      message: "请输入50字以内的内容",
                      max: 60
                    }],
                  })(
                    <Input placeholder="职称" />
                  )}
                </div>
              </FormItem>
            </Col>
            <Col span={8} className="gutter-row">
              <FormItem className='gutter-box'>
                <div>
                  {getFieldDecorator(`mobile-${k}`, {
                    initialValue: current.mobile,
                    validateTrigger: ['onBlur'],
                    rules: [{
                      // required: true,
                      // whitespace: true,
                      message: '格式输入有误',
                      pattern: /^1[3456789]\d{9}$/
                    }],
                  })(
                    <Input placeholder="手机号" style={{ width: '85%', marginRight: 8 }} />
                  )}
                  {keys.length > 1 ?
                    <Icon
                      className="dynamic-delete-button"
                      type="minus-circle-o"
                      disabled={k === 0}
                      onClick={() => this.remove(k)}
                    /> : null}
                </div>
              </FormItem>
            </Col>
          </Row>
        </div>
      );
    });
    let ishidden = this.hiddenMap.get(1);
    //let ishidden0 = this.hiddenMap.get(0);

    // if (current && current.unitType === 3 && ishidden0 === 'no') {
    //   ishidden0 = 'text';
    // } else if (ishidden0 === 'no') {
    //   ishidden0 = 'hidden';
    // }
    return (
      <div>
        <Modal {...this.modalProps} confirmLoading={this.props.loading}>
          <div style={{ padding: 20 }}>
            <div className={styles.backbtn}>
              <a href='javascript:;' onClick={this.props.openTeacherModal} type='primary'>返回列表</a>
            </div>
            <div className={styles.tabletitle}>
              <Row gutter={16}>
                <Col span={5} className='gutter-row'>
                  单位
              </Col>
                <Col span={5} className='gutter-row'>
                  姓名
              </Col>
                <Col span={6} className='gutter-row'>
                  职称
              </Col>
                <Col span={8} className='gutter-row'>
                  手机号
              </Col>
              </Row>
            </div>
            <div>
              <Form onSubmit={this.handleSubmit} className={styles.addform}>
                {formItems}
                {this.props.addType === 'create' ?
                  <FormItem>
                    <Button type="dashed" onClick={this.add} className={styles.containadd}>
                      <Icon type="plus" /> 继续添加
                </Button>
                  </FormItem> : null}
              </Form>

            </div>
          </div>
        </Modal>
      </div>
    );
  }
};

export default Form.create()(AddTeacherModal);
