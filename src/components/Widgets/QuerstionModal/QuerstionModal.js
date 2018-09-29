import React, { Component } from 'react';
import { Modal, Button, Form, Input, Icon, Radio, Cascader, message, InputNumber, Tooltip } from 'antd';
import { QUESTION_TYPE, DEFAULT_DEPARTMENT_CODE, DEFAULT_SUBJECT_CODE, DEFAULT_LEVEL_CODE } from '../../../constants';
import { formatOption, strOrNumConvert } from '../../../core/_utils/common';

import styles from './questionsModal.css';
import QuestionAttributeForm from '../QuestionsManage/QuestionAttributeForm';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

class QuerstionModal extends Component {
  constructor(props) {
    super(props);
    const { visible, modalType, currentQuestion, questionType, questionNumber } = this.props;
    /**
     * 编辑试题时需要currentQuestion, 因多个地方用这个界面, 统一传入字段,
     * 试题类型 type  题目 name   选项 exerciseItemDOList  答案 answer
     * 层级 level  难易度 difficulty   试题分类 exerciseClassifyCode  试题解析 explainStr
     */
    this.isCreateModal = modalType === 'create';
    this.modalProps = {
      visible,
      width: 700,
      footer: null,
      onCancel: this.props.hideQuestionModal,
      // onOk: this.handleSubmit.bind(this)
    };
    this.state = {
      initQuestionNum: this.isCreateModal ? 4 : currentQuestion.exerciseItemDOList.length,  // 初始选项
      initDeleteNum: 2,
      questionClickFlag: new Map(),
      testType: this.isCreateModal ? (questionType ? parseInt(questionType, 10) : 1) : currentQuestion.type,
      questionNum: this.isCreateModal ? 1 : (questionNumber || ''),
      difficulty: 2,
      initFillBlankNum: this.isCreateModal ? 1 : currentQuestion.exerciseItemDOList.length,  // 填空题初始空白处
      fillBlankExerciseItem: this.isCreateModal ? [] : currentQuestion.exerciseItemDOList.concat(),  // 填空题拷贝一份原始选项，
      showQuestionAttr: false,  // 是否展开属性设置
    };
    this.uuid = 0;
  }
  componentWillMount() {
    const { form } = this.props;
    let keys;
    if (this.isCreateModal) {
      form.getFieldDecorator('keys', { initialValue: [] });
      keys = form.getFieldValue('keys');
      for (let i = 1; i <= this.state.initQuestionNum; i++) {
        keys[keys.length] = i;
      }
      form.setFieldsValue({
        keys
      });
      this.uuid = this.uuid + this.state.initQuestionNum;
    } else {
      const { currentQuestion } = this.props;
      const { answer, exerciseItemDOList } = currentQuestion;

      form.getFieldDecorator('keys', { initialValue: [] });
      keys = form.getFieldValue('keys');
      const keysLength = exerciseItemDOList.length;
      for (let i = 1; i <= keysLength; i++) {
        keys[keys.length] = i;
      }
      form.setFieldsValue({
        keys
      });
      this.uuid = this.uuid + keysLength;
      const questionClickFlag = new Map();

      const answerArr = [];
      for (let i = 0; i < answer.length; i++) {
        answerArr[answerArr.length] = answer.charAt(i);
      }
      if (answerArr.length) {
        answerArr.map((item) => {
          questionClickFlag.set(item, true);
        });
      }
      this.setState({ questionClickFlag });
    }
  }
  onTypeChange = (e) => {
    this.setState({
      testType: e.target.value,
      questionClickFlag: new Map()
    }, () => {
      const { setFieldsValue, getFieldValue } = this.props.form;
      const keys = [];
      if (this.state.testType === 3) {
        setFieldsValue({ keys: [] });
        this.setState({
          initQuestionNum: 4
        });
      } else {
        if (!getFieldValue('keys').length) {
          for (let i = 1; i <= this.state.initQuestionNum; i++) {
            keys[keys.length] = i;
          }
          setFieldsValue({ keys });
        }
      }
    });
  }
  remove = (k) => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
    this.setState({
      questionClickFlag: new Map(),
      initQuestionNum: this.state.initQuestionNum - 1
    });
  }
  add = () => {
    this.uuid++;
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(this.uuid);
    form.setFieldsValue({
      keys: nextKeys
    });
    this.setState({
      questionClickFlag: new Map(),
      initQuestionNum: this.state.initQuestionNum + 1
    });
  }
  questionClick = (value) => {
    const { questionClickFlag } = this.state;
    if (questionClickFlag.get(value)) {
      if (this.state.testType === 2) {
        questionClickFlag.set(value, false);
      }
    } else {
      if (this.state.testType === 2) {
        questionClickFlag.set(value, true);
      } else {
        questionClickFlag.clear();
        questionClickFlag.set(value, true);
      }
    }
    this.setState(questionClickFlag);
  }
  handleSubmit = (type) => {
    const { validateFields, setFieldsValue, resetFields, validateFieldsAndScroll } = this.props.form;
    const { exerciseClassifyList, currentQuestion, fromPage } = this.props;
    const { questionClickFlag } = this.state;

    const questionAnsStr = this.strMapToArr(questionClickFlag).sort().join('');
    setFieldsValue({
      questionAns: questionAnsStr,
    });
    validateFieldsAndScroll((err, values) => {
      if (!err) {
        // 属性设置表单验证
        this.questionAttributeForm.props.form.validateFieldsAndScroll((errRef, valuesRef) => {
          if (!errRef) {
            const deptList = valuesRef.formData.department || [];
            const subjectList = valuesRef.formData.subject || [];
            const levelList = valuesRef.formData.level || [];
            const subjectName = [];
            const deptName = [];
            const levelName = [];
            // 科目
            if (valuesRef.subject && valuesRef.subject.length) {
              for (const code of valuesRef.subject) {
                for (const item of subjectList) {
                  if (code === item.value) {
                    subjectName[subjectName.length] = item.label;
                  }
                }
              }
            }
            // 科室
            if (valuesRef.department && valuesRef.department.length) {
              for (const code of valuesRef.department) {
                for (const item of deptList) {
                  if (code === item.value) {
                    deptName[deptName.length] = item.label;
                  }
                }
              }
            }
            // 层级
            if (valuesRef.level && valuesRef.level.length) {
              for (const code of valuesRef.level) {
                for (const item of levelList) {
                  if (code === item.value) {
                    levelName[levelName.length] = item.label;
                  }
                }
              }
            }

            let exerciseItemDOList = [];
            let answer = null;  // 试题答案
            if (values.testType === 3) {  // 判断题
              exerciseItemDOList = [
                {
                  no: 'A',
                  name: '正确'
                }, {
                  no: 'B',
                  name: '错误'
                }
              ];
              answer = values.questionJudge;
            } else if (values.testType === 4) {  // 填空题
              for (let i = 0; i < values.fbQuestionNum; i++) {
                const arr = {
                  no: formatOption(i),
                  name: values[`fbAnswer-${i}`]
                };
                exerciseItemDOList[exerciseItemDOList.length] = arr;
              }
              answer = '填空题';
            } else {
              for (let i = 0; i < values.keys.length; i++) {
                const key = values.keys[i];
                const arr = {
                  no: formatOption(i),
                  name: values[`question-${key}`]
                };
                exerciseItemDOList[exerciseItemDOList.length] = arr;
              }
              answer = values.questionAns;
            }
            const questionItem = {
              type: values.testType,
              name: values.title,
              answer,
              difficulty: valuesRef.difficulty,
              level: valuesRef.level && valuesRef.level.length ? valuesRef.level.join(',') : DEFAULT_LEVEL_CODE,
              explainStr: values.explain,
              exerciseItemDOList,
              answerMatchType: values.answerMatchType,
              department: valuesRef.department && valuesRef.department.length ? valuesRef.department.join(',') : DEFAULT_DEPARTMENT_CODE,
              departmentName: deptName.length ? deptName.join(',') : '其他',
              subject: valuesRef.subject && valuesRef.subject.length ? valuesRef.subject.join(',') : DEFAULT_SUBJECT_CODE,
              subjectName: subjectName.length ? subjectName.join(',') : '其他'
              // num: currentQuestion.num
            };
            if (this.isCreateModal) {
              // resetFields();
              this.props.saveQuestionByCreate(questionItem, type, (result) => {
                if (result) {  // 创建试题成功清除输入的项，否则保留
                  resetFields();
                  let keys = [];
                  if (this.state.testType === 3 || this.state.testType === 4) {
                    setFieldsValue({ keys: [] });
                    keys = [];
                  } else {
                    for (let i = 1; i <= this.state.initQuestionNum; i++) {
                      keys[keys.length] = i;
                    }
                    setFieldsValue({ keys });
                  }
                  this.setState({
                    levelSelectAll: false,
                    questionClickFlag: new Map(),
                    questionNum: ++this.state.questionNum
                  });
                }
              });
            } else {
              if (currentQuestion.num) {  // 题号（批量上传试题需要）
                questionItem.no = currentQuestion.num;
              }
              if (currentQuestion.id) { // 试题ID（编辑试题需要）
                questionItem.id = currentQuestion.id;
              }
              if (fromPage === 'course' || fromPage === 'create-exam-paper') {
                questionItem.templateExerciseId = 0;
              }
              this.props.saveQuestionByEdit(questionItem);
            }
          }
        });
      }
    });
  }
  handleCloseModal = () => {
    if (this.isCreateModal) {
      this.handleSubmit('end');
      return;
    }
    this.props.hideQuestionModal();
  }
  strMapToArr = (map) => {
    const mapArr = [];
    for (const [key, value] of map.entries()) {
      if (value) {
        mapArr[mapArr.length] = key;
      }
    }
    return mapArr;
  }
  fbQuestionNumChange = (value) => {
    // 如果减少了答案  清除编辑试题时传入的exerciseItemDOList
    if (value <= 3) {
      const { currentQuestion = {} } = this.props;
      const { fillBlankExerciseItem } = this.state;
      const exerciseItemList = (currentQuestion.exerciseItemDOList || []).length;
      if (value < exerciseItemList) {
        const index = exerciseItemList - value;
        fillBlankExerciseItem.splice(fillBlankExerciseItem.length - index, index);
      }
      this.setState({
        initFillBlankNum: value,
        fillBlankExerciseItem
      });
    }
  }
  handleValidateQuestionNum = (rule, value, callback) => {
    if (value && value > 3) {
      callback('最多设置3处答案');
    }
    callback();
  }

  setAttrContHeight = (isShow) => {
    const { showQuestionAttr } = this.state;
    if (!showQuestionAttr || isShow) {
      const questionAttrContRef = this.refs.questionAttrContRef;
      this.refs.questionAttrRef.style.height = `${questionAttrContRef.clientHeight + 15}px`;
      setTimeout(() => {
        this.refs.questionAttrRef.style.overflow = 'visible';
      }, 500);
      this.setState({
        showQuestionAttr: true
      });
    } else {
      this.refs.questionAttrRef.style.height = '40px';
      this.refs.questionAttrRef.style.overflow = 'hidden';
      this.setState({
        showQuestionAttr: false
      });
    }
  }

  getNameByCode = (map, code) => {
    let name = '';
    for (const item of map) {
      if (item.code === code) {
        name = item.name;
        break;
      }
    }
    return name;
  }

  render() {
    const { form, questionTypeDisabled, currentQuestion, fromPage, tempSave } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    const { questionClickFlag, testType } = this.state;
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 19 },
    };
    const fillBlankFormItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
      className: styles.fillBlankFormItem,
      colon: false
    };
    const questionMaxSize = 26;

    const tooltipText = (
      <div className="tooltipWrapper">
        <h3>完全一致</h3>
        <p>文字内容、长度、顺序和参考答案一致才能得分</p>
        <h3 style={{ marginTop: 15 }}>顺序不一致</h3>
        <p>文字内容、长度和参考答案任意匹配就能得分</p>
      </div>
    );

    getFieldDecorator('keys', { initialValue: [] });
    const keys = getFieldValue('keys');
    let formQuestionItems = [];

    if (this.state.testType !== 3 && this.state.testType !== 4) {
      formQuestionItems = keys.map((k, index) => {
        return (
          <FormItem
            label={`选项${formatOption(index)}`}
            key={k}
            {...formItemLayout}
          >
            {getFieldDecorator(`question-${k}`, {
              initialValue: this.isCreateModal ? '' : currentQuestion.exerciseItemDOList[k - 1] ? currentQuestion.exerciseItemDOList[k - 1].name : '',
              rules: [{ required: true, max: 250, whitespace: true, message: '请输入250字以内选项内容' }],
            })(
              <Input style={{ width: '95%', marginRight: 8 }} />
              )}
            {keys.length > 2 ?
              <Icon
                className="dynamic-delete-button"
                type="minus-circle-o"
                onClick={() => this.remove(k)}
              /> : ''}
          </FormItem>
        );
      });
    }
    const formQuestionAnItems = keys.map((k, index) => {
      let answerClassName = `${styles.questionAnItem}`;
      if (questionClickFlag.get(formatOption(index))) {
        answerClassName += ` ${styles.active}`;
      }
      return (
        <div
          key={`questionAnItem-${k}`}
          className={answerClassName}
          onClick={() => this.questionClick(formatOption(index))}
        >
          {formatOption(index)}
        </div>
      );
    });
    // 分试题类型渲染答案设置区 start
    let answerTpl = null;
    if (testType === 3) {  // 判断
      answerTpl = (
        <FormItem
          label="选项"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 18 }}
        >
          {getFieldDecorator('questionJudge', {
            initialValue: this.isCreateModal ? 'A' : this.state.questionClickFlag.get('A') ? 'A' : 'B',
            rules: [{ required: true, message: '请选择答案' }],
          })(
            <RadioGroup onChange={this.judgeHand}>
              <Radio value="A">正确</Radio>
              <Radio value="B">错误</Radio>
            </RadioGroup>
            )}
        </FormItem>
      );
    } else if (testType === 4) {  // 填空
      const fbAnswerItem = [];
      for (let i = 0; i < this.state.initFillBlankNum; i++) {
        const tpl = (
          <FormItem label={`第${strOrNumConvert(i + 1)}处答案`} {...fillBlankFormItemLayout} key={i}>
            {getFieldDecorator(`fbAnswer-${i}`, {
              initialValue: this.state.fillBlankExerciseItem[i] ? this.state.fillBlankExerciseItem[i].name : '',
              rules: [{ required: true, max: 50, whitespace: true, message: `请填写第${strOrNumConvert(i + 1)}处答案(50字以内)` }],
            })(
              <Input size="large" />
              )}
          </FormItem>
        );
        fbAnswerItem.push(tpl);
      }
      answerTpl = (
        <FormItem wrapperCol={{ span: 19, offset: 4 }}>
          <div className={`${styles.fillBlankBox} form-item-fill-blank`}>
            <FormItem label="题目中共有" {...fillBlankFormItemLayout}>
              {getFieldDecorator('fbQuestionNum', {
                initialValue: this.state.initFillBlankNum,
                rules: [
                  { required: true, message: '请设置答案数' },
                  { validator: this.handleValidateQuestionNum }
                ],
                onChange: this.fbQuestionNumChange
              })(
                <InputNumber
                  step={1}
                  min={1}
                  // max={3}
                  style={{ width: 60 }}
                  size="large"
                />
                )}
              处答案
            </FormItem>
            <FormItem label={<span>考生答案与参考<br />答案必须</span>} style={{ marginBottom: 6 }} {...fillBlankFormItemLayout}>
              {getFieldDecorator('answerMatchType', {
                initialValue: currentQuestion.answerMatchType && currentQuestion.answerMatchType != 0 ? currentQuestion.answerMatchType.toString() : '1',
                rules: [{ required: true, message: '请设置考生答案规则' }],
              })(
                <RadioGroup>
                  <Radio value="1">完全一致</Radio>
                  <Radio value="2">顺序不一致</Radio>
                </RadioGroup>
                )}
              <Tooltip placement="right" title={tooltipText}>
                <Icon type="question-circle-o" className={styles.tipsIcon} />
              </Tooltip>
            </FormItem>
            {fbAnswerItem}
            <FormItem style={{ marginBottom: 6 }}>
              <p className={styles.tips}>（若一个空有多个参考答案，每个答案间需用分号；分隔，考生答案匹配任意一个都算正确）</p>
            </FormItem>
          </div>
        </FormItem>
      );
    } else {
      answerTpl = (
        <div>
          {formQuestionItems}
          {keys.length < questionMaxSize ? (
            <FormItem wrapperCol={{ span: 20, offset: 4 }}>
              <Button onClick={this.add} className={styles.addOptionBtn}>
                <Icon type="plus" /> 添加选项
                    </Button>
            </FormItem>
          ) : ''}
          <FormItem
            label="正确答案"
            style={{ marginBottom: 5 }}
            {...formItemLayout}
          >
            {getFieldDecorator('questionAns', {
              rules: [{ required: true, message: '请设置正确答案' }],
            })(
              <div>
                {formQuestionAnItems}
              </div>
              )}
          </FormItem>
        </div>
      );
    }
    // 分试题类型渲染答案设置区 end
    let codeArray = [];  // 试题分类
    if (currentQuestion) {
      if (!currentQuestion.exerciseClassifyCode) {
        codeArray = [];
      } else if (currentQuestion.exerciseClassifyCode.length > 4) {
        codeArray = [currentQuestion.exerciseClassifyCode.slice(0, 4), currentQuestion.exerciseClassifyCode];
      } else {
        codeArray = [currentQuestion.exerciseClassifyCode];
      }
    }

    // 试题选项 start
    const questionTypeItem = QUESTION_TYPE.map((item) => {
      return (
        <Radio.Button
          value={item.value}
          key={item.value}
          disabled={questionTypeDisabled && this.isCreateModal && questionTypeDisabled !== item.value.toString()}
        >{item.label}</Radio.Button>
      );
    });
    // 试题选项 end
    return (
      <div>
        <Modal {...this.modalProps} title={`试题${this.state.questionNum}`} className="modal-questions-form">
          <Form onSubmit={this.handleSubmit} style={{ padding: '20px 0 5px' }}>
            {fromPage !== 'uploadQuestions' ?
              <FormItem
                label="试题类型"
                {...formItemLayout}
              >
                {
                  getFieldDecorator('testType', {
                    initialValue: this.isCreateModal ? this.state.testType : currentQuestion.type,
                    rules: [{ required: true, message: '请选择试题类型' }],
                  })(
                    <Radio.Group onChange={this.onTypeChange}>
                      {questionTypeItem}
                    </Radio.Group>
                    )
                }
              </FormItem> :
              <FormItem>
                {
                  getFieldDecorator('testType', {
                    initialValue: this.state.testType,
                  })(
                    <Input type="hidden" />
                    )
                }
              </FormItem>
            }
            <FormItem
              label="题目"
              {...formItemLayout}
            >
              {getFieldDecorator('title', {
                initialValue: this.isCreateModal ? '' : currentQuestion.name,
                rules: [{ required: true, max: 1800, whitespace: true, message: '请输入1800字以内试题题目' }],
              })(
                <Input type="textarea" autosize={{ minRows: 1, maxRows: 5 }} />
                )}
            </FormItem>
            {answerTpl}
            <FormItem
              label="试题解析"
              {...formItemLayout}
            >
              {getFieldDecorator('explain', {
                initialValue: this.isCreateModal ? '' : currentQuestion.explainStr,
                rules: [{ required: false, max: 1000, message: '请输入1000字以内的试题解析' }],
              })(
                <Input type="textarea" autosize={{ minRows: 2, maxRows: 6 }} />
                )}
            </FormItem>
          </Form>
          <div className={styles.questionAttrCont} ref="questionAttrRef">
            <div ref="questionAttrContRef">
              <div className={styles.qaHeader}>
                <h2>属性设置</h2>
                <span>属性设置将帮助您后期组卷时筛选试题</span>
                <a onClick={() => this.setAttrContHeight()}>{this.state.showQuestionAttr ? '收起' : '展开'}</a>
              </div>
              <div className="question-attr-modal-form">
                <QuestionAttributeForm
                  // ref="questionAttributeForm"
                  wrappedComponentRef={ref => this.questionAttributeForm = ref}
                  onChange={() => this.setAttrContHeight(true)}
                  curEdit={currentQuestion}
                  tempSave={tempSave}
                />
              </div>
            </div>
          </div>
          <div className={styles.modalButtonRow}>
            <Button size="large" onClick={() => this.handleCloseModal()}>{this.isCreateModal ? '保存结束' : '取消'}</Button>
            <Button type="primary" size="large" onClick={() => this.handleSubmit()}>{this.isCreateModal ? '继续创建' : '确认修改'}</Button>
          </div>
        </Modal>
      </div>
    );
  }
}

export default Form.create()(QuerstionModal);
