import React, { Component } from "react";
import moment from "moment";
import { Modal, message } from "antd";
import Service from "../../../actions/studyDetail";
import styles from "./style.css";

class RuleDetailModal extends Component {
  constructor(props) {
    super(props);
    const { visible, onCancel, params } = this.props;
    const typeStr = params.type === 1 ? "考试" : "培训";
    this.modalProps = {
      footer: null,
      title: `查看${typeStr}规则`,
      width: 700,
      visible,
      onCancel
    };
    this.state = {
      ruleDetail: {}
    };
  }
  componentDidMount() {
    Service.getTrainingRule({
      relationId: this.props.params.relationId,
      type: this.props.params.type
    }).then(data => {
      if (!data.success) {
        message.error(data.errMsg);
        return;
      }
      this.setState({
        ruleDetail: data.data
      });
    });
  }

  render() {
    const { ruleDetail } = this.state;
    return (
      <Modal {...this.modalProps}>
        {this.props.params.type === 1 ? (
          <ul className={styles.ruleDetail}>
            <li>
              <span className={styles.rdLabel}>考试名称：</span>
              <span>{ruleDetail.name}</span>
            </li>
            <li>
              <span className={styles.rdLabel}>考试时间：</span>
              <span>
                {moment(ruleDetail.planStartTime).format("YYYY-MM-DD HH:mm")} 至{" "}
                {moment(ruleDetail.planEndTime).format("YYYY-MM-DD HH:mm")}
              </span>
            </li>
            <li>
              <span className={styles.rdLabel}>考试时长：</span>
              <span>{ruleDetail.duration}分钟</span>
            </li>
            <li>
              <span className={styles.rdLabel}>考试总分：</span>
              <span>{ruleDetail.totalScore}分</span>
            </li>
            <li>
              <span className={styles.rdLabel}>及格分数：</span>
              <span>{ruleDetail.passScore}分</span>
            </li>
            <li>
              <span className={styles.rdLabel}>设置学分：</span>
              <span>{ruleDetail.gainCredit}</span>
            </li>
            {// 系统自动公布成绩可显示
              ruleDetail.publishResultType == 0 ? (
                <li>
                  <span className={styles.rdLabel}>不合格重考次数：</span>
                  <span>{ruleDetail.retakeTime}次</span>
                </li>
              ) : (
                  ""
                )}
            <li>
              <span className={styles.rdLabel}>考生查看成绩：</span>
              <span>
                {ruleDetail.publishResultType == 0
                  ? "系统自动公布成绩"
                  : "人工审核公布成绩"}
                {ruleDetail.viewAnswer == 1
                  ? "，考试结束，允许考生查看考试答案"
                  : ""}
              </span>
            </li>
            <li>
              <span className={styles.rdLabel}>&nbsp;</span>
              <span>
                考试过程中离开页面超过&nbsp;{ruleDetail.leaveTime}&nbsp;次，自动结束考试
              </span>
            </li>
          </ul>
        ) : (
            <ul className={styles.ruleDetail}>
              <li>
                <span className={styles.rdLabel}>培训名称：</span>
                <span>{ruleDetail.name}</span>
              </li>
              <li>
                <span className={styles.rdLabel}>培训时间：</span>
                {
                  ruleDetail.timeControll === 0 ? <span>长期有效</span> : (
                    <span>
                      {moment(ruleDetail.planStartTime).format("YYYY-MM-DD HH:mm")} 至{" "}
                      {moment(ruleDetail.planEndTime).format("YYYY-MM-DD HH:mm")}
                    </span>
                  ) 
                }
                
              </li>
              <li>
                <span className={styles.rdLabel}>测验次数：</span>
                <span>{ruleDetail.retakeTime}次</span>
              </li>
              <li>
                <span className={styles.rdLabel}>测验总分：</span>
                <span>{ruleDetail.totalScore}分</span>
              </li>
              <li>
                <span className={styles.rdLabel}>及格分数：</span>
                <span>{ruleDetail.passScore}分</span>
              </li>
              <li>
                <span className={styles.rdLabel}>设置学分：</span>
                <span>{ruleDetail.gainCredit}</span>
              </li>
              <li>
                <span className={styles.rdLabel}>报<i style={{ opacity: 0 }}>报名</i>名：</span>
                <span>{ruleDetail.needSignUp === 0 ? '无' : moment(ruleDetail.signUpEndTime).format("YYYY-MM-DD HH:mm") + ' 截止'}</span>
              </li>
              <li>
                <span className={styles.rdLabel}>签<i style={{ opacity: 0 }}>签到</i>到：</span>
                <span>{ruleDetail.needSign === 0 ? '无' : moment(ruleDetail.signStartTime).format("YYYY-MM-DD HH:mm") + ' 至 ' + moment(ruleDetail.signEndTime).format("HH:mm")}</span>
              </li>
              <li>
                <span className={styles.rdLabel}>签<i style={{ opacity: 0 }}>签退</i>退：</span>
                <span>{ruleDetail.needSignOut === 0 ? '无' : moment(ruleDetail.signOutStartTime).format("YYYY-MM-DD HH:mm") + ' 至 ' + moment(ruleDetail.signOutEndTime).format("HH:mm")}</span>
              </li>
            </ul>
          )}
      </Modal>
    );
  }
}

export default RuleDetailModal;
