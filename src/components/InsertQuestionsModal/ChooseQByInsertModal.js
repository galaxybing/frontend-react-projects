import React, { Component } from 'react';
import { Modal, Button, Icon } from 'antd';
import classNames from 'classnames/bind';
import styles from './style.css';

const className = classNames.bind(styles);

class ChooseQByInsertModal extends Component {
    constructor(props) {
        super(props);
        const { visible, onBcak } = props;
        this.modalProps = {
            title: <span className={styles.chooseQModalTitle} onClick={onBcak}><Icon type="left" />返回上一级</span>,
            visible,
            width: 730,
            footer: null,
            closable: false
        };
        this.state = {
            chooseQVisible: false
        };
    }
    chooseQuestion = (item) => {
        const questionItem = {
            // courseId: 545,
            // contentId: 663,
            // insertTime: "8000",
            // resourceId: 1558,
            ...this.props.param,
            exerciseId: item.id,
            exerciseName: item.exerciseName,
            exerciseAnswer: item.exerciseAnswer,
            exerciseType: item.exerciseType,
            exerciseExplainStr: item.exerciseExplainStr,
            exerciseItem: item.exerciseItem
        };
        this.props.saveChooseQuestion(questionItem);
        this.props.onBcak();
    }
    render() {
        const { questionsList, insertQuestionsList } = this.props;
        const selectedQuestionsMap = new Map([]);
        for (const value of insertQuestionsList.values()) {   // 把所有已选择的试题筛选到Map
            for (const item of value) {
                selectedQuestionsMap.set(item.exerciseId, item);
            }
        }
        const questionsItem = questionsList.map((item, index) => {
            const questionsTypeClassName = className({
                'question-type-lable': true,
                single: item.exerciseType === 1,
                multiple: item.exerciseType === 2,
                trueFalse: item.exerciseType === 3,
                fillBlank: item.exerciseType === 4,
            });
            return (
                <li key={item.id}>
                    <div>
                        <span style={{ float: 'left', marginTop: 13, marginRight: 12 }} className={questionsTypeClassName}>
                            {item.exerciseType === 1 ? '单选题' : item.exerciseType === 2 ? '多选题' : item.exerciseType === 3 ? '判断题' : '填空题'}
                        </span>
                        <div className={styles.insertQName}>
                            {index + 1}. {item.exerciseName}
                        </div>
                        <div className={styles.insertQChooseAction}>
                            {
                                selectedQuestionsMap.has(item.id) ?
                                    <span>已选择</span> :
                                    <Button type="primary" onClick={() => this.chooseQuestion(item)}>选择</Button>
                            }
                        </div>
                    </div>
                </li>
            );
        });
        return (
            <Modal {...this.modalProps} className="insert-questions-choose-modal">
                <div className={styles.insertQChooseTitle}>请选择要插入的试题</div>
                <ul className={styles.insertQChooseList}>
                    {
                        questionsList.length ? questionsItem : <p style={{ padding: '15px 0', textAlign: 'center', color: '#999' }}>暂无可选择的试题</p>
                    }
                </ul>
            </Modal>
        );
    }
}

export default ChooseQByInsertModal;
