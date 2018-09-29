import React, { Component } from "react";
import moment from "moment";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Table, Pagination, Select, Input, Icon, Button, Breadcrumb, message, Alert, Row, Tooltip } from "antd";
import CascaderCheckboxSelect from "@317hu/CascaderCheckboxSelect";
import { getCache } from "../../../core/_utils/storage";
import { searchStrToObj } from "../../../core/_utils/common";
import serialize from '../../../core/_utils/serialize';
import { PAGE_SIZE_OPTIONS, INNER_HOSPITALID } from "../../../constants";
import CommonService from "../../../actions/common";
import Service from "../../../actions/studyDetail";
import MainLayout from "../../../components/Widgets/MainLayout";
import BreadNavList from "../../../components/Widgets/BreadNavList";
import PlanningCrumb from "../../../components/Widgets/BreadNavList/PlanningCrumb";
import GroupCrumb from '../../../components/Widgets/BreadNavList/GroupCrumb';
import TrainingSummary from "../../../components/StudyDetail/TrainingSummary";
import RuleDetailModal from "../../../components/Widgets/RuleDetailModal";
import TrainingResultModal from "../../../components/StudyDetail/TrainingResultModal";
import ExportTrainingResultModal from "../../../components/StudyDetail/ExportTrainingResultModal";
import styles from "./style.css";
import { fail } from "assert";
import { testLink } from '../../../core/_utils/common'
const Search = Input.Search;
const { hospitalId, roleId, regionIds } = getCache("profile") || {};
const innerFromPage = getCache("innerFromPage") || {};
const initialFilter = {
  pageNum: 1,
  pageSize: 10,
  hospitalBranchIds: null,
  deptIds: null,
  wardIds: null,
  status: null,
  signStatus: null,
  testStatus: null,
  compulsoryFlag: null
};

class StudyDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      currentAccountId: null,
      ruleModalVisible: false,
      hospitalTree: [],
      loading: false,
      filter: initialFilter,
      dataSource: {
        tableList: [],
        pagination: {}
      },
      studyDetail: {},
      ruleModalVisible: false,
      resultModalVisible: false,
      exportResultModalVisible: false
    };

    const { search } = this.props.location;
    this.query = {};
    if (search) {
      this.query = searchStrToObj(search);
    }
  }
  componentDidMount() {
    CommonService.fetchHospitalTree().then(data => {
      if (data.success) {
        this.setState({
          hospitalTree: data.data[0].children
        });
      }
    });
    this.load({});
    this.loadResultDetail({});
  }
  load = query => {
    this.setState({ loading: true });
    let filter = this.state.filter;
    filter = Object.assign({}, filter, query);
    /*
    this.setState({ loading: false });
    this.setState({
      filter,
      dataSource: {
        tableList: [{name: 1}],
        pagination: {
          total: 50,
          current: 2,
        }
      }
    });
    */

    Service.getStudyUserList({
      ...filter,
      releaseId: this.query.releaseId
    }).then(data => {
      this.setState({ loading: false });
      if (!data.success) {
        message.error(data.errMsg);
        return;
      }
      this.setState({
        filter,
        dataSource: {
          tableList: data.data.result,
          pagination: {
            total: data.data.totalCount,
            current: data.data.pageNumber
          }
        }
      });
    });

  };
  loadResultDetail = query => {
    Service.getStudyDetail({ releaseId: this.query.releaseId, ...query }).then(
      data => {
        if (!data.success) {
          message.error(data.errMsg);
          return;
        }
        this.setState({
          studyDetail: data.data
        });
      }
    );
  };
  showTrainingResultModal = accountId => {
    CommonService.getPaperRecord({
      releaseId: this.query.releaseId,
      accountId,
      type: 1
    }).then(data => {
      if (!data.success) {
        message.error(data.errMsg);
        return;
      }
      this.setState({
        resultModalVisible: true,
        paperRecordList: data.data
      });
    });
  };
  renderCrumb = () => {  // 分类型渲染面包屑
    let tpl;
    if (this.query.fromPage === "planning" && this.query.planType) {  // 规培
      tpl = (
        <PlanningCrumb
          curBreadcrumbItem="培训详情"
          query={{
            ...this.query
          }}
        />
      );
    } else if (this.query.fromPage === 'group') {  // 分组培训
      tpl = (
        <GroupCrumb
          curBreadcrumbItem="学习详情"
          query={{
            ...this.query
          }}
        />
      );
    } else {
      tpl = (
        <BreadNavList
          dataSource={[
            {
              name: "已发布培训",
              link: '/hospital-admin/nurse-training-course/trainings.html'
            },
            { name: "培训详情" }
          ]}
        />
      );
    }
    return tpl;
  }
  toStudyDetailInfo = (id, name) => {
    const { history } = this.props;
    history.push({
      pathname: '/hospital-admin/nurse-training-course/trainings/study-detail-info.html',
      search: '?' + serialize({ releaseId: this.query.releaseId, studentId: id, accountName: name }),
    });
  }
  render() {
    const {
      filter,
      dataSource,
      loading,
      studyDetail = {},
      locationQuery = {},
      exportResultModalVisible
    } = this.state;

    const linkQuery = {
      innerFromPage: innerFromPage.fromPage,
      hospitalId: innerFromPage.hospitalId
    };
    const summaryData = [
      // { value: studyDetail.planJoinNum, name: "应参加人数", label: "人" },
      // { value: studyDetail.actualJoinNum, name: "实参加人数", label: "人" },
      // { value: studyDetail.qualifiedNum, name: "合格人数", label: "人" },
      // { value: studyDetail.unqualifiedNum, name: "不合格人数", label: "人" }

      { value: [{ name: '实参加人数', value: studyDetail.actualJoinNum }, { name: '应参加人数', value: studyDetail.planJoinNum }], uint: '人', label: "培训率" },
      { value: [{ name: '总答对题数', value: studyDetail.successTotal }, { name: '总题数', value: studyDetail.questionTotal }], uint: '道', label: "课前评估正确率" },
      { value: [{ name: '考生第一次测验合格人数', value: studyDetail.firstPassCount }, { name: '测验人数', value: studyDetail.testPersonNum }], name: "", uint: '人', label: "随堂测验一次合格率" },
      { value: [{ name: '考生合格人数', value: studyDetail.testPersonPassNum }, { name: '测验人数', value: studyDetail.testPersonNum }], uint: '人', label: "随堂测验合格率" },
    ];
    // 处理时间
    const startTimeMoment = moment(studyDetail.planStartTime);
    const endTimeMoment = moment(studyDetail.planEndTime);
    let timeTpl = '';
    if (
      startTimeMoment.format("YYYY-MM-DD") == endTimeMoment.format("YYYY-MM-DD")
    ) {
      timeTpl = `${startTimeMoment.format(
        "YYYY-MM-DD"
      )} ${startTimeMoment.format("HH:mm")}至${endTimeMoment.format("HH:mm")}`;
    } else {
      timeTpl = `${startTimeMoment.format(
        "YYYY-MM-DD HH:mm"
      )}至${endTimeMoment.format("YYYY-MM-DD HH:mm")}`;
    }
    if (studyDetail.timeControll === 0) {
      timeTpl = '长期有效'; //
    }
    // 处理时间 End

    const cascaderRangeProps = {
      dataSource: {
        value: "bizId",
        label: "bizName",
        children: "children",
        regionType:
          roleId === 10003 || roleId === 10000
            ? "B"
            : roleId === 10001 ? "D" : "W",
        selectRole: "W", // 默认使用最低层级权限角色 W
        controllerRegionType: "SELECT_ALL",
        // 10003 10001 10004
        regionIds: regionIds || "", // 如果是院管理员没有该属性字段
        data: this.state.hospitalTree ? this.state.hospitalTree : [] // 直接引用院区层级
      },
      initialValue: [], // 编辑模式时使用
      treeCheckable: true,
      multiple: true,
      fixedHeight: true,
      searchPlaceholder: "请选择院区、科室、病区",
      style: {
        width: 200,
        verticalAlign: "top"
      },
      dropdownStyle: {
        pannelWidth: 136,
        pannelHeight: 320
      },
      selectModel: "child",
      disabledParentAutoSelected: true, // 启用 child 模式时，禁用父级自动勾选功能
      reset: this.state.resetValue ? this.state.resetValue : ['0'],
      onChange: value => {
        let query = {
          hospitalBranchIds: "",
          deptIds: "",
          wardIds: ""
        };
        value.map(val => {
          let item = val.split("-");
          if (item[1] == 1000 && (roleId === 10000 || roleId === 10003)) {
            query.hospitalBranchIds += query.hospitalBranchIds
              ? "," + item[0]
              : item[0];
          } else if (item[1] == 2000 && roleId !== 10004) {
            query.deptIds += query.deptIds ? "," + item[0] : item[0];
          } else if (item[1] == 3000) {
            query.wardIds += query.wardIds ? "," + item[0] : item[0];
          }
        });

        this.load({ ...query, pageNum: 1 });
        this.loadResultDetail({
          hospitalBranchIds: query.hospitalBranchIds,
          deptIds: query.deptIds,
          wardIds: query.wardIds
        });
        this.setState({
          resetValue: value,
        })
      },
      notFoundContent: "暂无数据",
      getPopupContainer: trigger => trigger.parentNode
    };

    this.columns = [
      {
        title: "序号",
        key: "no",
        render: (text, record, index) => {
          const pageIndex = dataSource.pagination.current - 1;
          return index + (pageIndex * filter.pageSize + 1);
        }
      },
      {
        title: "姓名（工号）",
        dataIndex: "accountName",
        key: "accountName",
        render: (text, record) => {
          if (!record.jobNumber) {
            return <span>{record.accountName}</span>;
          } else {
            return (
              <span>
                {record.accountName}&nbsp;&nbsp;({record.jobNumber})
              </span>
            );
          }
        }
      },
      {
        title: "科室/病区",
        dataIndex: "deptName",
        key: "deptName",
        width: "12%",
        render: (text, record) => {
          return (
            <span>
              {text}
              {record.wardName && `/${record.wardName}`}
            </span>
          );
        }
      },
      {
        title: <span>课前评估<br />正确率</span>,
        dataIndex: "assessSuccessCount",
        key: "assessSuccessCount",
        render: (text, record) => {
          const { assessSuccessCount, assessTotalCount = 0 } = record;
          if (assessTotalCount === 0) {
            return '--'
          } else {
            return parseInt(assessSuccessCount / assessTotalCount * 10000, 10) / 100 + '%'
          }
        }
      },
      {
        title: <span>随堂测验分数<br /><i style={{ fontSize: 12, fontStyle: 'normal', color: '#A5A5A5' }}>（显示最高分）</i></span>,
        dataIndex: "scores", // 测验分数： scores 数组 | hadExamNum 次数
        key: "scores",
        render: (text, record) => {
          const { scores, hadExamNum, accountId } = record;
          // const scores = [19, 2, 39, 0];
          let scoreVal = 0;
          let scoreValList = [];
          for (let i = 0, num = scores ? scores.length : 0; i < num; i++) {
            if (scoreVal < scores[i]) {
              scoreVal = scores[i];
            };
          }
          // scoreVal 已获取最大值，以下设置字体颜色
          for (let i = 0, num = scores ? scores.length : 0; i < num; i++) {
            let classNameColor = '';
            if (scoreVal === scores[i]) {
              classNameColor = '#ff0000';
            };
            scoreValList.push(<i key={i} style={{ fontStyle: 'normal', display: 'block', textAlign: 'center', color: classNameColor }}>{scores[i]}</i>);
          }
          if ((scores ? scores.length : 0) > 0 /*&& hadExamNum > 0*/) {
            return (
              <Tooltip placement="right" title={<p>{scoreValList}</p>}>
                <span onClick={() => this.showTrainingResultModal(accountId)}>{scoreVal}</span>
              </Tooltip>
            );
          } else {
            return <span>--</span>;
          }

        }
      },
      {
        title: <span>课后作业<br /><i style={{ fontSize: 12, fontStyle: 'normal', color: '#A5A5A5' }}>分数/等级</i></span>,
        dataIndex: "homeWorkScore",
        key: "homeWorkScore",
        render: (text, record) => {
          const { homeWorkScore, grade } = record;
          if (grade) {
            return grade;
          } else {
            return homeWorkScore;
          }
        }
      },
      {
        title: "完成情况",
        dataIndex: "status",
        key: "status",
        render: text => {
          if (text === 0)
            return <span style={{ color: "#fc5e5e" }}>未学习</span>;
          else if (text === 1)
            return <span style={{ color: "#9f9f9f" }}>学习中</span>;
          else if (text === 2) // 由 9 改成 2
            return <span>已完成</span>;
          else return <span>--</span>;
        }
      },
      {
        title: "完成时间",
        dataIndex: "finishTime",
        key: "finishTime",
        render: text => {
          return text ? moment(text).format('YYYY-MM-DD HH:mm') : '';
        }
      },
      {
        title: "学习类型",
        dataIndex: "compulsoryFlag",
        key: "compulsoryFlag",
        render: text => {
          if (text === 0) return <span>选修</span>;
          else if (text === 1) return <span>必修</span>;
        }
      },
      {
        title: "操作",
        dataIndex: "action",
        key: "action",
        width: 100,
        render: (text, record) => {
          const { accountId, accountName, status } = record;
          if (status === 0) {
            return <span style={{color: '#9f9f9f'}}>学习详情</span>
          } else {
            return <a href="javascript:;" onClick={() => this.toStudyDetailInfo(accountId, accountName)}>学习详情</a>
          }
          
        }
      },

      /*
      {
        title: "最近测验时间",
        dataIndex: "testTime",
        key: "testTime"
      },
      {
        title: "最终测验结果",
        dataIndex: "testStatus",
        key: "testStatus",
        render: text => {
          if (text === -1)
            return <span style={{ color: "#fc5e5e" }}>不合格</span>;
          else if (text === 0)
            return <span style={{ color: "#9f9f9f" }}>未测验</span>;
          else return <span style={{ color: "#1abb69" }}>合格</span>;
        }
      }
      */
    ];

    return (
      <MainLayout>
        <div className="boz-component-header">
          {this.renderCrumb()}
        </div>
        <div className="boz-component-body boz-component-body-card">
          {
            studyDetail.homeWorkFlag === 1 && studyDetail.homeWorkStatus === 0 && studyDetail.status !== -1 ? (
              <Alert
                message={<div className={styles.tipsHomeWork}>本场培训含未批改的课后作业，去<Link className={styles.link} to={`/hospital-admin/nurse-training-course/trainings/study-homework.html?releaseId=${this.query.releaseId}`}>批改</Link></div>}
                type="warning"
                closable
              />
            ) : ''
          }
          <div className={styles.detailInfo}>
            <h2 className={styles.title}>{studyDetail.courseName}</h2>
            <p className={styles.info}>
              <span>
                <i className="boz-icon ico-clock" style={{ marginRight: 8 }} />
                {/*studyDetail.planStartTime ? timeTpl : "-"*/}
                {timeTpl}
              </span>
              {studyDetail.place ? (
                <span>
                  <i
                    className="boz-icon ico-place"
                    style={{ marginRight: 8 }}
                  />
                  {studyDetail.place}
                </span>
              ) : (
                  ""
                )}
            </p>
            {hospitalId === INNER_HOSPITALID || innerFromPage.fromPage ? (
              <p>医院：{studyDetail.hospitalName}</p>
            ) : (
                ""
              )}
            {hospitalId !== INNER_HOSPITALID || !innerFromPage.fromPage ? (
              <span className={styles.infoBtn}>
                <a onClick={() => this.setState({ ruleModalVisible: true })}>
                  查看培训规则
                </a>
              </span>
            ) : (
                ""
              )}
          </div>
          <div className="padding-0-20">
            <div style={{ marginTop: 10, }}>
              <TrainingSummary dataSource={summaryData} />
            </div>
            <div className={styles.filterRow}>
              <div style={{ marginTop: 20, paddingBottom: 15, overflow: "hidden" }}>
                {
                  this.state.hospitalTree && this.state.hospitalTree.length > 0 ? <CascaderCheckboxSelect {...cascaderRangeProps} /> : ''
                }
                <Search
                  ref={c => this._search = c}
                  placeholder="请输入护士名称查找"
                  style={{ width: 240, margin: "0 10px 10px 10px" }}
                  onSearch={value => this.load({ accountName: value, pageNum: 1 })}
                  size="large"
                />
                <Select
                  defaultValue="请选择完成情况"
                  style={{ width: 140, margin: "0 10px 10px 0px" }}
                  className="ant-select-height-30"
                  onChange={status => this.load({ status, pageNum: 1 })}
                >
                  <Select.Option value="-9">全部</Select.Option>
                  <Select.Option value="1">未完成</Select.Option>
                  <Select.Option value="2">已完成</Select.Option>
                </Select>
                <Select
                  defaultValue="请选择学习类型"
                  style={{ width: 140, margin: "0 10px 10px 0" }}
                  className="ant-select-height-30"
                  onChange={compulsoryFlag =>
                    this.load({ compulsoryFlag, pageNum: 1 })
                  }
                >
                  <Select.Option value="">全部</Select.Option>
                  <Select.Option value="1">必修</Select.Option>
                  <Select.Option value="0">选修</Select.Option>
                </Select>
                <Select
                  defaultValue="请选择最终测验结果"
                  style={{ width: 180, margin: "0 10px 10px 0" }}
                  className="ant-select-height-30"
                  onChange={testStatus => this.load({ testStatus, pageNum: 1 })}
                >
                  <Select.Option value="-9">全部</Select.Option>
                  <Select.Option value="0">未测验</Select.Option>
                  <Select.Option value="1">合格</Select.Option>
                  <Select.Option value="-1">不合格</Select.Option>
                </Select>
                <Select
                  defaultValue="请选择签到情况"
                  style={{ width: 140, margin: "0 10px 10px 0px" }}
                  className="ant-select-height-30"
                  onChange={status => this.load({ signStatus: parseInt(status, 10), pageNum: 1 })}
                >
                  <Select.Option value="0">全部</Select.Option>
                  <Select.Option value="1">已报名</Select.Option>
                  <Select.Option value="2">已签到</Select.Option>
                  <Select.Option value="3">已签退</Select.Option>

                </Select>
                <span style={{ wordBreak: "kepp-all", whiteSpace: "nowrap" }}>
                  共找到<b className="search-result-num">
                    {dataSource.pagination.total}
                  </b>人
                </span>
                {hospitalId !== INNER_HOSPITALID && !innerFromPage.fromPage ? (
                  <div className={styles.exportRow}>
                    <Button
                      type="primary"
                      style={{ marginRight: 10, height: 30 }}
                      disabled={!dataSource.pagination.total}
                      onClick={() => {
                        if (dataSource.pagination.total) {
                          this.setState({ exportResultModalVisible: true });
                        }
                      }}
                    >
                      导出学习情况
                    </Button>
                  </div>
                ) : ""}
                {studyDetail.hadExercise === 1 ? ( // 存在 随堂测验 时显示按钮
                  <div className={styles.exportRow}>
                    <Button
                      type="primary"
                      style={{ marginRight: 10, height: 30 }}
                      disabled={!dataSource.pagination.total}
                      onClick={() => {
                        const params = {
                          releasePaperId: this.query.releaseId,
                          // studentName: '',
                          // studentId: '',
                          releasePaperName: studyDetail.courseName,
                        };
                        Service.exportTestProcessResult(params).then((data) => {
                          if (data.success) {
                            testLink(data.data.url, () => {
                              // 给要下载的pdf增加attname, 可以直接下载
                              let arr = data.data.url.split('/');
                              const attname = arr[arr.length - 1];
                              location.href = `${data.data.url}?attname=${attname}`;
                            }, () => {
                              message.error('下载资源暂未生成，请稍后重试，如您急需，请联系客服', 3);
                            });
                          } else {
                            message.error('下载资源暂未生成，请稍后重试，如您急需，请联系客服', 3);
                          }
                        });
                      }}
                    >
                      批量导出（随堂测验试卷）
                    </Button>
                  </div>
                ) : ""}
              </div>
            </div>
            <Table
              columns={this.columns}
              dataSource={dataSource.tableList}
              loading={loading}
              rowKey={(record, index) => index}
              pagination={false}
            />
            <Pagination
              className="ant-table-center-pagination"
              showSizeChanger
              pageSizeOptions={PAGE_SIZE_OPTIONS}
              onChange={pageNum => this.load({ pageNum })}
              onShowSizeChange={(pageNum, pageSize) =>
                this.load({ pageNum, pageSize })
              }
              {...dataSource.pagination}
            />
          </div>
        </div>
        {this.state.ruleModalVisible ? (
          <RuleDetailModal
            visible={this.state.ruleModalVisible}
            onCancel={() => this.setState({ ruleModalVisible: false })}
            params={{
              relationId: this.query.releaseId,
              type: 2
            }}
          />
        ) : (
            ""
          )}
        {this.state.resultModalVisible ? (
          <TrainingResultModal
            visible={this.state.resultModalVisible}
            paperRecordList={this.state.paperRecordList}
            onCancel={() => this.setState({ resultModalVisible: false })}
          />
        ) : (
            ""
          )}
        {exportResultModalVisible ? (
          <ExportTrainingResultModal
            visible={exportResultModalVisible}
            filter={{ ...filter, releaseId: this.query.releaseId }}
            onCancel={() => this.setState({ exportResultModalVisible: false })}
          />
        ) : (
            ""
          )}
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
export default connect(select, actions)(StudyDetail);
