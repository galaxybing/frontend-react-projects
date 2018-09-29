import React from "react";
import { connect } from "react-redux";
import { Button, message } from "antd";
import { searchStrToObj } from "../../../core/_utils/common";
import { getCache } from "../../../core/_utils/storage";
import Services from "../../../actions/common";
import MainLayout from "../../../components/Widgets/MainLayout";
import BreadNavList from "../../../components/Widgets/BreadNavList";
import styles from "./style.css";

const { nurseTrainUrl } = getCache("topNavRest") || {};

class QrCode extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      codeImgUrl: "",
      qrCode: []
    };
    const { search } = this.props.location;
    this.query = {};
    if (search) {
      this.query = searchStrToObj(search);
    }
  }
  componentDidMount = () => {
    /**
     * trainingSignOut  现场培训签退
     * trainingSign   现场培训签到
     * examSign  考试签到
     */
    if (this.query.type === "trainingSignOut") {
      Services.trainingSignQRCode({
        releaseId: this.query.releaseId // 培训
      }).then(data => {
        if (!data.success) {
          message.error(data.errMsg);
          return;
        }
        let qrCode = this.state.qrCode;
        qrCode.push({
          url: data.data.url,
          title: "现场培训签到二维码",
          type: "签到"
        });
        this.setState({ qrCode }, () => {
          Services.trainingSignOutQRCode({
            releaseId: this.query.releaseId // 培训
          }).then(data => {
            if (!data.success) {
              message.error(data.errMsg);
              return;
            }
            let qrCode = this.state.qrCode;
            qrCode.push({
              url: data.data.url,
              title: "现场培训签退二维码",
              type: "签退"
            });
            this.setState({ qrCode });
          });
        });
      });
    } else if (
      this.query.type === "trainingSign" ||
      this.query.type === "examSign"
    ) {
      let params = {
        releaseId: this.query.releaseId, // 培训
        releasePaperId: this.query.releaseId // 考试
      }
      let examtitle = '考生签到二维码'
      if (this.query.type === "examSign") {
        examtitle = ''
        params.selectionPattern = this.query.selectionPattern;
        if (this.query.selectionPattern == 0) {
          examtitle = '考试二维码';
        }
      }
      Services[`${this.query.type}QRCode`](params).then(data => {
        if (!data.success) {
          message.error(data.errMsg);
          return;
        }
        let qrCode = this.state.qrCode;
        qrCode.push({
          url: data.data.url,
          title:
            this.query.type === "trainingSign"
              ? "现场培训签到二维码"
              : examtitle,
          type: this.query.type === "examSign" && this.query.selectionPattern == 0 ? '考试' : "签到"
        });
        this.setState({ qrCode });
      });
    } else {
      message.error("打印二维码链接有误！");
    }
  };
  printConfirm = (url, type) => {
    const w = window.open();
    w.document.write(
      `<div style="width: 300px;margin: 30px auto">
                <div style="text-align:center;margin-bottom: 10px">${
      this.query.name
      }${type}二维码</div>
                <img style="width:100%" src=${url} />
            </div>`
    );
    w.print();
    return false;
  };
  render() {
    const qrCodeItem = this.state.qrCode.map((item, index) => (
      <div className={styles.qrCodeCont} key={index}>
        <div className={styles.codeImg}>
          <img src={item.url} />
        </div>
        <p className={styles.codeName}>{item.title}</p>
        <div className={styles.buttonRow}>
          <Button
            type="primary"
            size="large"
            style={{ width: 100, marginRight: 50 }}
            className={styles.buttonGreen}
            onClick={() => {
              location.href = `${item.url}?attname=${this.query.name}${
                item.type
                }二维码.png`;
            }}
          >
            下载
          </Button>
          <Button
            type="primary"
            size="large"
            style={{ width: 100 }}
            onClick={() => this.printConfirm(item.url, item.type)}
          >
            打印
          </Button>
        </div>
      </div>
    ));

    let breadName, breadLink;
    let nurseTrainingModule = '';
    if (this.query.type.indexOf("training") > -1) {
      breadName = "已发布培训";
      breadLink = "trainings";
      nurseTrainingModule = 'nurse-training-course';
    } else if (this.query.type.indexOf("exam") > -1) {
      breadName = "已发布考试";
      breadLink = "exams";
      nurseTrainingModule = 'nurse-training-exam';
    } else {
      breadName = "";
      breadLink = "404";
    }
    return (
      <MainLayout>
        <div className="boz-component-header">
          <BreadNavList
            dataSource={[
              {
                name: breadName,
                link: nurseTrainingModule ? `${nurseTrainUrl}/hospital-admin/${nurseTrainingModule}/${breadLink}.html` : '',
                type: "a"
              },
              { name: "打印二维码" }
            ]}
          />
        </div>
        <div className="boz-component-body boz-component-body-card padding-0-20">
          <div className={styles.qrCode}>
            <p className={styles.codeTitle}>{this.query.name}</p>
            <div style={{ display: "inline-block" }}>{qrCodeItem}</div>
          </div>
        </div>
      </MainLayout>
    );
  }
}

function select(state) {
  return {};
}
function actions(dispatch, ownProps) {
  return {
    dispatch
  };
}
export default connect(select, actions)(QrCode);
