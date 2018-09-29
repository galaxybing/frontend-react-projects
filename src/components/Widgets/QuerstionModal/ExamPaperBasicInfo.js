/**
 * 统一试卷和随机试卷的试卷基本信息
 */
import React from 'react';
import { Form, Input } from 'antd';
import styles from './questionsModal.css';

const { Item } = Form;

class ExamPaperBasicInfo extends React.Component {
  // constructor(props) {
  //   super(props);
  // }

  render() {
    const { form, name, describe, readOnly } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 20 },
      colon: false,
    };
    return (
      <div className={styles.createPaperContent}>
        <div className={styles.createPaperTitle}>基本信息</div>
        <Form style={{ padding: '20px 0 5px' }} className="modal-questions-form">
          <Item label="试卷名称" {...formItemLayout} >
            {
              getFieldDecorator('name', {
                initialValue: name || '',
                rules: [
                  {
                    required: true,
                    message: '请输入50字以内试卷名称',
                    min: 1,
                    max: 50,
                    whitespace: true
                  },
                ]
              })(<Input placeholder="请输入试卷名称" readOnly={readOnly} />)
            }
          </Item>
          <Item label="试卷描述" {...formItemLayout} >
            {
              getFieldDecorator('describe', {
                initialValue: describe || '',
                rules: [
                  {
                    // required: true,
                    message: '请输入120字以内试卷描述',
                    // whitespace: true,
                    // min: 1,
                    max: 120,
                  },
                ]
              })(<Input type="textarea" placeholder="请输入试卷描述" readOnly={readOnly} autosize={{ minRows: 3, maxRows: 4 }} />)
            }
          </Item>
          {/* <Item label="考试封面" {...formItemLayout} >
            {getFieldDecorator('cover')(
              <div style={{ display: 'inline-block' }}>
                <Upload
                  {...this.coverUploadProps}
                  className="avatar-uploader"
                  name="avatar"
                  showUploadList={false}
                >
                  {
                    coverImg ?
                      <img src={coverImg} alt="" className="avatar" /> :
                      <Icon type="plus" className="avatar-uploader-trigger" />
                  }
                </Upload>
              </div>
            )}
            <span style={{ color: '#bbb', fontSize: 12, marginLeft: 20 }}>图片大小建议不超过1M，建议尺寸123*70</span>
          </Item> */}
        </Form>
      </div>
    );
  }
}

export default Form.create()(ExamPaperBasicInfo);
