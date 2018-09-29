import React, { Component } from "react";
import moment from "moment";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Table, Pagination, Select, Icon, Button, Breadcrumb, message, Form, Input, InputNumber, Affix, Modal, Row, Col, Radio, Popconfirm } from "antd";

import { getCache } from "../../../core/_utils/storage";
import serialize from '../../../core/_utils/serialize';
import { searchStrToObj } from "../../../core/_utils/common";
import { PAGE_SIZE_OPTIONS, INNER_HOSPITALID } from "../../../constants";
import Service from "../../../actions/studyDetail";
import MainLayout from "../../../components/Widgets/MainLayout";
import BreadNavList from "../../../components/Widgets/BreadNavList";
import styles from "./style.css";
import { fail } from "assert";

const Search = Input.Search;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;

const { hospitalId, roleId, regionIds } = getCache("profile") || {};
const innerFromPage = getCache("innerFromPage") || {};
const initialFilter = {
  pageNum: 1,
  pageSize: 10,
  studentName: null,
  // releaseId: null,
};

export const PREVIEWURL = 'http://widget.317hu.com/viewer/index.html';

class StudyHomeWork extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalStudyHomeworkVisible: false,
      modalStudyHomeworkLoading: false,
      modalStudyHomeworkTitle: '',
      homeworkTabType: 'score',
      loading: false,
      filter: initialFilter,
      dataSource: {
        tableList: [],
        pagination: {}
      },
      studyDetail: {},
    };
    
    this.modalStudyHomeworkProps = {
      width: 1060,
      footer: null,
      onOk: this.handleOk,
      onCancel: () => {
        this.setState({
          modalStudyHomeworkVisible: false,
          score: 0,
          grade: '0',
          comment: '',
        }, () => {
          this.cancelAutoSubmitTimer()
        });
      },
    }
    this.homeWorkCurrent = {};
    this.score = 0;
    this.grade = '0';
    
    const { search } = this.props.location;
    this.query = {};
    if (search) {
      this.query = searchStrToObj(search);
    }
  }
  componentDidMount() {
    this.load({});
    this.loadResultDetail({});
  }
  componentWillUnmount() {
    this.cancelAutoSubmitTimer();
  }
  cancelAutoSubmitTimer() {
    this.autoSubmitTimeId && clearInterval(this.autoSubmitTimeId);
    this.autoSubmitTimeId = null;
  }
  queryHomeWorkPageHandler = (query) => {
    let filter = this.state.filter;
    let param = {...filter, ...query, releaseId: this.query.releaseId};
    // 进入其他界面 使用 history 操作
    // this.props.history.push({
    //   pathname: '/hospital-admin/nurse-training-course/trainings/study-homework.html',
    //   search: `?${serialize(param)}`
    // });
    
    // 未跳转界面 使用当前刷新：
    this.load(param);
  }
  load = query => {
    this.setState({ loading: true });
    let filter = this.state.filter;
    filter = Object.assign({}, filter, query);
    // queryHomeWorkPage
    Service.queryHomeWorkPage({
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
    Service.queryCorrectHomeWork({ releaseId: this.query.releaseId, }).then(
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
  renderCrumb = () => {  // 分类型渲染面包屑
    let tpl = (
      <BreadNavList
        dataSource={[
          {
            name: "已发布培训",
            link: '/hospital-admin/nurse-training-course/trainings.html'
          },
          {
            name: "培训详情",
            link: `/hospital-admin/nurse-training-course/trainings/study-detail.html`,
            search: `?releaseId=${this.query.releaseId}`,
          },
          { name: '课后作业批改' }
        ]}
      />
    );
    return tpl;
  }
  
  toSaveScoreHomeWork = (url, type, data, ind) => {
    this.homeWorkCurrent = {...data, index: ind};
    const { accountName, scoreStatus, grade, score } = data;
    if (scoreStatus === 1) {
      Service.queryCorrectHomeWorkDetail(this.homeWorkCurrent.homeWorkId).then((res) => {
        if (res.success && res.data) {
          const comment = res.data.comment;
          this.homeWorkCurrent.comment = comment;
          this.setState({
            modalStudyHomeworkTitle: accountName,
            modalStudyHomeworkVisible: true,
            homeworkTabType: grade ? 'grade' : 'score',
            score,
            grade,
            comment,
          }, () => {
            if (!this.autoSubmitTimeId) {
              this.autoSubmitTimeId = setInterval(() => {
                this.saveScoreHandler('auto');
              }, 3*60*1000);
            }
            const previewUrl = `${PREVIEWURL}?arg=${encodeURIComponent(url)}&type=${type}`;
            this.studyHomeWorkElem.src = previewUrl;
          });
        }
      });
    } else {
      this.setState({
        modalStudyHomeworkTitle: accountName,
        modalStudyHomeworkVisible: true,
        homeworkTabType: 'score',
      }, () => {
        if (!this.autoSubmitTimeId) {
          this.autoSubmitTimeId = setInterval(() => {
            this.saveScoreHandler('auto');
          }, 3*60*1000);
        }
        const previewUrl = `${PREVIEWURL}?arg=${encodeURIComponent(url)}&type=${type}`;
        this.studyHomeWorkElem.src = previewUrl;
      });
    }

  }
  onHomeworkTabTypeChange = (e) => {
    const val = e && e.target.value;
    this.setState({
      homeworkTabType: val,
    });
  }
  selectGradeHandler = (val) => {
    this.setState({
      grade: val,
    });
    this.grade = val;
  }
  saveScoreHandler = (type) => {
    const { score, grade, comment, homeWorkCurrent } = this;
    const { homeworkTabType } = this.state;
    const { homeWorkId } = homeWorkCurrent;
    if (homeworkTabType === 'grade' && this.grade === '0') {
      type !== 'auto' && message.warn('请选择评分等级');
      return;
    }
    if (!/^[0-9]{1,2}(\.)?(\d{1})?$/.test(score) || score > 100) {
      type !== 'auto' && message.warn('请输入0到100的数字,正数且只精确到小数点后一位');
      return;
    }
    if (comment && comment.length > 1000) {
      type !== 'auto' && message.warn('评语字数不能超过 1000 个字符');
      return;
    }
    let params = {};
    if (homeworkTabType === 'grade') {
      params = { // 评等级
        homeWorkId,
        grade: homeworkTabType === 'grade' ? grade : null,
        comment,
      }
    } else { // 评分
      params = {
        homeWorkId,
        score: homeworkTabType === 'score' ? score : 0,
        comment,
      }
    }

    Service.saveCorrectHomeWork({...params}).then((res) => {
      if (!res.success) {
        message.error(res.errMsg);
        return;
      }
       
      message.success(type !== 'auto' ? '保存成功' : '自动保存成功', 3, () => {
        if (type !== 'auto') {// 为 手动操作 保存时，关闭评分窗口
          this.setState({
            modalStudyHomeworkVisible: false,
            score: 0,
            grade: '0',
            comment: '',
          }, this.cancelAutoSubmitTimer);
        }
        this.load({});
      })
    });
  }
  previewUrlSwitch = (pageType) => {
    const { personalHomeWorkRespDTOList } = this.homeWorkCurrent;
    if (pageType === 'prev') {
      this.homeWorkCurrent.index = this.homeWorkCurrent.index - 1;
    } else if (pageType === 'next') {
      this.homeWorkCurrent.index = this.homeWorkCurrent.index + 1;
    }
    const file = personalHomeWorkRespDTOList[this.homeWorkCurrent.index];
    let url = '';
    let type = '';
    if (/pdf/i.test(file.fileType)) {
      url = file.url;
      type = 'pdf';
    } else if (file.type === 1) {
      if (file.returnUrl) {
        url = file.returnUrl;
        type = 'video';
      } else {
        url = 'warning';
      }
    } else {
      if (file.pdfUrl) {
        url = file.pdfUrl;
        type = 'pdf';
      } else {
        if (file.sizeNumber && (file.sizeNumber / 1024 / 1024 > 10)) {
          url = 'warning';
        } else {
          url = 'ppt';
        }
      }
    }
    const previewUrl = `${PREVIEWURL}?arg=${encodeURIComponent(url)}&type=${type}`;
    this.studyHomeWorkElem.src = previewUrl;
    this.forceUpdate()
  }
  
  handleSubmit = () => {
    const param = {releaseId: this.query.releaseId};

    Service.validateCorrectHomeWork(this.query.releaseId).then((res) => {
      if (res.success) {
        if (res.data && res.data.completeFlag === 0){
          Modal.confirm({
            content: `存在未评分作业，继续提交？`,
            onOk: () => {
              Service.submitCorrectHomeWork(param).then((res) => {
                if (res.success) {
                  message.success(res.data ? res.data : '提交成功', 1.5, () => {
                    this.props.history.replace({
                      pathname: '/hospital-admin/nurse-training-course/trainings/study-detail.html',
                      search: `?${serialize(param)}`
                    });
                  });
                }
              });
            },
            onCancel: () => {
              
            }
          });
        } else {
          Service.submitCorrectHomeWork(param).then((res) => {
            if (res.success) {
              message.success(res.data ? res.data : '提交成功', 1.5, () => {
                this.props.history.replace({
                  pathname: '/hospital-admin/nurse-training-course/trainings/study-detail.html',
                  search: `?${serialize(param)}`
                });
              });
            }
          });
        }
        
      }
    });
    
  }
  
  render() {
    const {
      filter,
      dataSource,
      loading,
      studyDetail = {},
      homeworkTabType = 'score',
      score = 0,
      grade = '0',
      comment = '',
    } = this.state;

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
        title: "姓名",
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
        title: "作业",
        dataIndex: "personalHomeWorkRespDTOList",
        key: "personalHomeWorkRespDTOList",
        width: "12%",
        render: (text, record) => {
          const { personalHomeWorkRespDTOList } = record;
          let fileTplArr = [];
          fileTplArr = personalHomeWorkRespDTOList.map((file, ind) => {
            const index = ind + 1;
            let fileTpl = '';
            if (/pdf/i.test(file.fileType)) {
              fileTpl = <a key={index} onClick={() => this.toSaveScoreHomeWork(file.url, 'pdf', record, index)}>{index}. {file.fileName}</a>;
            } else if (file.type === 1) {
              if (file.returnUrl) {
                fileTpl = <a key={index} onClick={() => this.toSaveScoreHomeWork(file.returnUrl, 'video', record, index)}>{index}. {file.fileName}</a>;
              } else {
                fileTpl = <a key={index} onClick={() => this.toSaveScoreHomeWork('warning', 'other', record, index)}>{index}. {file.fileName}</a>;
              }
            } else {
              if (file.pdfUrl) {
                fileTpl = <a key={index} onClick={() => this.toSaveScoreHomeWork(file.pdfUrl, 'pdf', record, index)}>{index}. {file.fileName}</a>;
              } else {
                if (file.sizeNumber && (file.sizeNumber / 1024 / 1024 > 10)) {
                  fileTpl = <a key={index} onClick={() => this.toSaveScoreHomeWork('warning', 'other', record, index)}>{index}. {file.fileName}</a>;
                } else {
                  fileTpl = <a key={index} onClick={() => this.toSaveScoreHomeWork('ppt', 'pdf', record, index)}>{index}. {file.fileName}</a>;
                }
              }
            }
            return fileTpl
          });

          return (
            <div className={styles.fileTplSprite}>
              {fileTplArr}
            </div>
          );
        }
      },
      {
        title: "状态",
        dataIndex: "scoreStatus",
        key: "scoreStatus",
        render: text => {
          if (text === 0)
            return <span style={{ color: "#fc5e5e" }}>未评分</span>;
          else if (text === 1)
            return <span style={{ color: "#9f9f9f" }}>已保存</span>;
          else return <span>已提交</span>;
        }
      },
      {
        title: "分数/等级",
        dataIndex: "score",
        key: "score",
        render: (text, record) => {
          const { score, grade } = record;
          return grade ? grade : (score ? score: 0 );
        }
      },
      {
        title: "操作",
        dataIndex: "action",
        key: "action",
        width: 100,
        render: (text, record) => {
          const { scoreStatus, personalHomeWorkRespDTOList } = record;
          if (!personalHomeWorkRespDTOList || personalHomeWorkRespDTOList.length === 0) {
            return '-';
          }
          let fileTpl = null;
          let btnStr = '';
          if (scoreStatus === 0) {
            btnStr = '去评分';
          } else {
            btnStr = '去查看';
          }
          const file = personalHomeWorkRespDTOList[0];
          
          if (/pdf/i.test(file.fileType)) {
            fileTpl = <a onClick={() => this.toSaveScoreHomeWork(file.url, 'pdf', record, 0)}>{btnStr}</a>;
          } else if (file.type === 1) {
            if (file.returnUrl) {
              fileTpl = <a onClick={() => this.toSaveScoreHomeWork(file.returnUrl, 'video', record)}>{btnStr}</a>;
            } else {
              fileTpl = <a onClick={() => this.toSaveScoreHomeWork('warning', 'other', record, 0)}>{btnStr}</a>;
            }
          } else {
            if (file.pdfUrl) {
              fileTpl = <a onClick={() => this.toSaveScoreHomeWork(file.pdfUrl, 'pdf', record, 0)}>{btnStr}</a>;
            } else {
              if (file.sizeNumber && (file.sizeNumber / 1024 / 1024 > 10)) {
                fileTpl = <a onClick={() => this.toSaveScoreHomeWork('warning', 'other', record, 0)}>{btnStr}</a>;
              } else {
                fileTpl = <a onClick={() => this.toSaveScoreHomeWork('ppt', 'pdf', record, 0)}>{btnStr}</a>;
              }
            }
          }

          return fileTpl;
        }
      },
    ];

    const { personalHomeWorkRespDTOList } = this.homeWorkCurrent;

    return (
      <MainLayout>
        <div className="boz-component-header">
          {this.renderCrumb()}
        </div>
        <div className="boz-component-body boz-component-body-card">
          <div className={styles.detailInfo}>
            <h2 className={styles.title}>{'课后作业'}</h2>
            {
              studyDetail.content ? <pre>{studyDetail.content}</pre> : ''
            }
          </div>
          <div className="padding-0-20">
            <div className={styles.filterRow}>
              <div style={{ marginTop: 10, marginBottom: 10, overflow: "hidden" }}>
                <Search
                  ref={c => this._search = c}
                  placeholder="请输入学员姓名"
                  style={{ width: 240 }}
                  onSearch={value => this.queryHomeWorkPageHandler({ studentName: value, pageNum: 1 })}
                  size="large"
                />
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
        <div className={styles.fixedPaperFooter}>
          <Affix offsetBottom={0}>
            <div className={styles.footerCont}>
            <Popconfirm title="确定要提交评分结果吗？" onConfirm={() => this.handleSubmit()}>
              <Button
                loading={this.props.submitLoading}
                className={`${styles.savePaperBtn} ${styles.btnColorG}`}
              >提交评分结果</Button>
            </Popconfirm>
            </div>
          </Affix>
        </div>
        <Modal
          {...this.modalStudyHomeworkProps}
          style={{ padding: 20 }}
          visible={this.state.modalStudyHomeworkVisible}
          confirmLoading={this.state.modalStudyHomeworkLoading}
          title={`作业批改-${this.state.modalStudyHomeworkTitle}`}
        >
          <div style={{ margin: '20px auto 0', padding: '0 20px 40px', }}>
            <Row>
              <Col span={18}>
                <iframe ref={(r) => this.studyHomeWorkElem = r} src="" width="100%" height="546" frameBorder="0" allowFullScreen="allowfullscreen">
                </iframe>
              </Col>
              <Col span={6}>
                <div style={{ paddingLeft: 10, }}>
                  <RadioGroup onChange={this.onHomeworkTabTypeChange} value={this.state.homeworkTabType}>
                    <Radio value={'score'}>分数</Radio>
                    <Radio value={'grade'}>等级</Radio>
                  </RadioGroup>
                  <div className={styles.tabTypeValueSprite}>
                    {
                      homeworkTabType === 'score' ? (
                        <span><InputNumber value={score} style={{ width: 60 }} min={0} max={100} precision={1} size="large" defaultValue={0} onChange={(value) => {
                          this.setState({
                            score: value,
                          })
                          this.score = value;
                        }} /> 分</span>
                      ) : (
                        <Select onSelect={this.selectGradeHandler} style={{width: 120}} size="large" value={grade}>
                          <Select.Option value="0">请选择</Select.Option>
                          <Select.Option value="优秀">优秀</Select.Option>
                          <Select.Option value="一般">一般</Select.Option>
                          <Select.Option value="及格">及格</Select.Option>
                          <Select.Option value="不及格">不及格</Select.Option>
                        </Select>
                      )
                    }
                    
                  </div>
                  <div className={styles.tabTypeCommentSprite}>
                    <p>评语：</p>
                    <Input type="textarea" autosize={{ minRows: 8, maxRows: 15 }} value={comment} onChange={(e) => {
                      const val = e.target.value;
                      if (val &&　val.length > 1000) {
                        message.warn('评语字数不能超过 1000 个字符')
                      }
                      this.setState({
                        comment: val,
                      });
                      this.comment = val;
                    }} />
                  </div>
                  <div className={styles.tabTypeBtnSprite}>
                    <Button style={{display: 'inline-block', marginRight: 10}} type="dashed" onClick={() => {
                      this.setState({
                        modalStudyHomeworkVisible: false,
                        score: 0,
                        grade: '0',
                        comment: '',
                      }, () => {
                        this.cancelAutoSubmitTimer()
                      });
                    }}>
                      关闭
                    </Button>
                    <Button type="primary" onClick={this.saveScoreHandler}>
                      保存
                    </Button>
                  </div>
                  {
                    personalHomeWorkRespDTOList && personalHomeWorkRespDTOList.length > 1 ? (
                      <Row className={styles.previewUrlpagination}>
                        <Col span={12}>{
                          this.homeWorkCurrent.index > 0 ? <span className={styles.link} onClick={() => this.previewUrlSwitch('prev')}>&lt;上一篇</span> : ''
                        }</Col>
                        <Col span={12} style={{textAlign: 'right'}}>{
                          this.homeWorkCurrent.index < personalHomeWorkRespDTOList.length - 1 ? <span className={styles.link} onClick={() => this.previewUrlSwitch('next')}>下一篇&gt;</span> : ''
                        }</Col>
                        
                      </Row>
                    ) : ''
                  }
                  
                </div>
              </Col>
            </Row>
          </div>
        </Modal>
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
export default connect(select, actions)(StudyHomeWork);
