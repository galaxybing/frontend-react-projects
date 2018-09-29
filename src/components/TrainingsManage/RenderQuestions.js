import React from 'react';
import { Form } from 'antd';
import { QUESTION_TYPE } from '../../constants';
import RenderTestComponent from '../Widgets/RenderTest/RenderCreatePaperTest';

class RenderQuestions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            scoreType: '1',  // 1: 按空数  0: 按题数
        }
    }
    componentDidMount() { }
    componentWillReceiveProps() { }
    render() {
        const formItem = QUESTION_TYPE.map((item) => {
            const checkedQuestionsKeyMap = new Map([]);
            const questionsList = questionsListMap.get(item.id) || [];
            const questionsScore = questionsScoreMap.get(item.id) || '';
            const checkedQuestion = checkedQuestionItemMap.get(item.id) || '';
            const allQuestionsOpen = allQuestionsOpenMap.get(item.id) || false;
            const questionsScoreByType = getFieldValue(`questionsScore${item.id}`) || 0;
            // 传给预览页面
            for (const id of checkedQuestion) {
                checkedQuestionsKeyMap.set(id);
            }
            const renderQuestionModal = {
                allQuestionList,
                questionList: questionsList,
                accessPath: item.id,
                questionType: item.type,
                checkedQuestionsKeyMap,
                allQuestionsOpen,
                checkedQuestionItem: list => this.props.saveCheckedQuestion(list, item.id)
            };

            let scoreTypeStr = '题';
            let fillBlankCount = 0, questionListCount = questionsList.length;
            let scoreTypeStr2 = '道';
            if (item.value === 4 && this.state.scoreType === '1') {
                scoreTypeStr = '空';
                scoreTypeStr2 = '空';
                for (const value of questionsList) {
                    fillBlankCount += value.exerciseItemDOList.length;
                }
                questionListCount = fillBlankCount;
            }

            return (
                <Item key={item.type} style={{ margin: 0 }} className="form-item-create-exam-paper">
                    <div className={styles.questionItemHeader}>
                        <span className={styles.qitemTitle}>{item.label}</span>
                        { // 填空题
                            item.value === 4 ?
                                <Select style={{ width: 80, marginLeft: 10 }} value={this.state.scoreType} onChange={(value) => this.setState({ scoreType: value })}>
                                    <Select.Option value="1">按空数</Select.Option>
                                    <Select.Option value="0">按题数</Select.Option>
                                </Select> : ''
                        }
                        <div className={styles.qitemContent}>
                            总{scoreTypeStr}数:<span className="primary-color">{questionListCount}</span>{scoreTypeStr2}
                            <span style={{ marginLeft: 20 }}>每小{scoreTypeStr}分数&nbsp;
                      <Tooltip trigger={['focus']} title="分数设置支持小数点保留1位，且不得超过100">
                                    {
                                        getFieldDecorator(`questionsScore${item.id}`, {
                                            initialValue: questionsScore,
                                            rules: [
                                                {
                                                    required: questionsList.length > 0,
                                                    message: ' '
                                                },
                                                { validator: this.handleNum }
                                            ],
                                        })(
                                            <Input style={{ width: 60 }} />
                                        )
                                    }
                                </Tooltip>&nbsp;分
                    </span>
                            <span style={{ marginLeft: 10 }}>
                                共:<span className="primary-color">{getFieldValue(`questionsScore${item.id}`) && (!isNaN(getFieldValue(`questionsScore${item.id}`))) ? (questionListCount * getFieldValue(`questionsScore${item.id}`)).toFixed(1) : '-'}</span>分
                    </span>
                        </div>
                    </div>
                    <div className={styles.questionItemContent}>
                        {questionsList.length ?
                            <div className={styles.renderBox}>
                                <div className={styles.renderBoxHeader}>
                                    <span>
                                        <Checkbox
                                            indeterminate={checkedQuestion.length > 0 && (checkedQuestion.length !== questionsList.length)}
                                            onChange={e => this.onCheckAllChange(e, item.id, questionsList)}
                                            checked={checkedQuestion.length === questionsList.length}
                                        >
                                            全选
                        </Checkbox>
                                    </span>
                                    <Popconfirm title="确认删除试题?" onConfirm={() => this.props.deleteQuestionByType(item.id)}>
                                        <span>删除</span>
                                    </Popconfirm>
                                    <span
                                        onClick={() => {
                                            allQuestionsOpenMap.set(item.id, !allQuestionsOpen);
                                            this.setState({ allQuestionsOpenMap });
                                        }}
                                        style={{ userSelect: 'none' }}
                                    >{allQuestionsOpen ? '收起全部试题' : '展开全部试题'}</span>
                                    <div style={{ float: 'right' }}>
                                        {this.renderAddQuestionButton(item.id)}
                                    </div>
                                </div>
                                <RenderTestComponent {...renderQuestionModal} />
                            </div> :
                            <div style={{ textAlign: 'center' }}>
                                {this.renderAddQuestionButton(item.id)}
                            </div>}
                    </div>
                </Item>
            );
        })
        return (
            <Form style={{ marginTop: 1 }}>
                {formItem}
            </Form>
        );
    }
}

export default Form.create()(RenderQuestions);