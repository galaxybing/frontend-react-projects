import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { Table, Pagination, Popconfirm, Input, Radio, Tabs, Select, message, Row, Col } from 'antd';
import { searchStrToObj } from '../../../core/_utils/common';
import serialize from '../../../core/_utils/serialize';
import { getCache } from '../../../core/_utils/storage';
import { PAGE_SIZE_OPTIONS, NURSING_DEPT_HOSPITALID } from '../../../constants';

import { getDeptMine } from '../../../actions/common';
import { getStudyDetail } from "../../../actions/studyDetail";
import { saveCoureseRelease, saveCoureseReleaseAll } from '../../../actions/trainingManage';
import {
    getTrainingsList,
    getReleaseCourseCount,
    deleteCancelTraining,
    cancelTraining,
    saveChangeUserManage,
    fetchReleaseUserList,
} from '../../../actions/trainings';

import MainLayout from '../../../components/Widgets/MainLayout';
import BreadNavList from '../../../components/Widgets/BreadNavList';
import TrainingsComponent from '../../../components/Trainings';
import UserManageModal from '../../../components/Trainings/UserManageModal';
import TrainingsManageModal from '../../../components/TrainingsManage/TrainingsManageModal';
import styles from './style.css';

const Search = Input.Search;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const { userId, hospitalId } = getCache('profile') || {};

class Trainings extends React.Component { /* 已发布培训 列表 */
    constructor(props) {
        super(props);
        const { search } = this.props.location;
        this.query = {};
        if (search) {
            this.query = searchStrToObj(search);
        }
        this.columns = [{
            dataIndex: 'courseId',
            key: 'courseId',
            width: '100%',
            render: (text, record) => {
              const { timeControll } = record;
                const studyDetailTpl = (
                    <Link
                        to={{
                            pathname: '/hospital-admin/nurse-training-course/trainings/study-detail.html',
                            search: `?releaseId=${record.id}`
                        }}
                    >培训详情</Link>
                );
                let actionDiv;
                if (record.status === 9) { // 已结束
                    if (record.operationPrivilege === 1) { // 判断操作权限
                        if (this.props.trainings.filter.rangeType != 2 && this.props.trainings.filter.rangeType != 3) {
                            actionDiv =
                                <div>
                                    {studyDetailTpl}
                                    <br />
                                    <Popconfirm
                                        title="确认撤销发布？"
                                        onConfirm={() => this.cancelTraining(record.id)}
                                    >
                                        <a title="撤销发布">撤销发布</a>
                                    </Popconfirm>
                                    <br />
                                    <a title="人员管理" className={styles.actionLinkItem} onClick={() => this.showUserManage(record)}>人员管理</a>
                                </div>
                                ;
                        } else {
                            actionDiv = studyDetailTpl;
                        }
                    } else {
                        actionDiv = studyDetailTpl;
                    }
                } else if (record.status === -1) { // 已撤销
                    if (record.operationPrivilege === 1) {
                        actionDiv = (
                            <div style={{ lineHeight: 1.8 }}>
                                <Popconfirm title="确认删除?" onConfirm={() => this.deleteCancelTraining(record.id)}>
                                    <a>删除</a>
                                </Popconfirm>
                                <br />
                                <a title="重新发布" className={styles.actionLinkItem} onClick={() => this.showResetSubmit(record)}>重新发布</a>
                            </div>
                        );
                    }
                } else {
                    actionDiv = <span>发布中</span>;
                }
                return (
                    <div className="table-form-content">
                        {
                            this.props.trainings.filter.rangeType == 3 ?
                                <div className="form-cancel-row">
                                    <span>撤销时间：{record.revokeTime}</span>
                                    <span>撤销人员：{record.revokeName}</span>
                                </div> : ''
                        }
                        <div className="mian-info-row">
                            <div className="main-info-title">
                                {
                                    record.trainModel === 0 ?
                                        <span className="main-info-type main-info-type-green">在线培训</span> :
                                        <span className="main-info-type">现场培训</span>
                                }
                                <Link
                                    to={{
                                        pathname: '/hospital-admin/nurse-training-course/trainings-manage/course-detail.html',
                                        search: `?courseId=${record.courseId}&contentId=${record.contentId}&menuName=trainings.html`
                                    }}
                                    className="main-info-name">
                                    {record.courseName}
                                </Link>
                                {record.homeWorkFlag === 1 && record.homeWorkStatus === 0 && record.status !== -1 ? <span style={{display: 'inline-block', marginLeft: 5, color: '#ff0000'}}>[待批改]</span> : ''}
                            </div>
                        </div>
                        <Row type="flex" justify="space-around" align="middle" className="detail-info-row">
                            <Col span={10}>
                                <p>
                                  <span>
                                    培训时间：
                                    <em>
                                      {
                                        timeControll === 1 ? moment(record.planStartTime).format('YYYY-MM-DD HH:mm') + ' 至 ' + moment(record.planEndTime).format('YYYY-MM-DD HH:mm') : '长期有效'
                                      }
                                      {/* {record.planStartTime}&nbsp;-&nbsp;{record.planEndTime} */}
                                    </em>
                                  </span>
                                </p>
                                {
                                    record.trainPlace ?
                                        <p>
                                            <span>培训地点：<em title={record.trainPlace}>{record.trainPlace}</em></span>
                                        </p> : ''
                                }
                                <p>
                                    <span>级别：<em>{record.levelName}</em></span>
                                    <span>发布者：<em>{record.createName}</em></span>
                                    <span>发布科室：<em>{record.deptName}</em></span>
                                </p>
                            </Col>
                            {record.trainModel ?
                                <Col span={8}>
                                    <p>报名情况：{record.signProgress}人</p>
                                    <p>完成情况：{record.learnedProgress}人</p>
                                    {(() => {
                                        if (record.needSign === 1 && userId === record.releaseBy) {
                                            let params = {
                                                releaseId: record.id,
                                                name: record.courseName,
                                                type: record.needSignOut == 1 ? 'trainingSignOut' : 'trainingSign'
                                            }
                                            return (
                                                <Link
                                                    to={{
                                                        pathname: '/hospital-admin/nurse-training-course/qr-code.html',
                                                        search: `?${serialize(params)}`
                                                    }}
                                                    target="_blank"
                                                >打印现场培训二维码</Link>
                                            );
                                        }
                                    })()}
                                </Col> :
                                <Col span={8}>
                                    <p>必修完成情况：{record.requiredProgress}人</p>
                                    <p>选修完成情况：{record.selectedProgress}人</p>
                                </Col>
                            }
                            <Col span={6} className="detail-info-col-last">
                                {actionDiv}
                            </Col>
                        </Row>
                    </div>
                )
            }
        }];
        
        this.state = {
          resetSubmitDataSource: null
        }
    }
    componentWillMount() {
    }
    componentDidMount() {
        this.load(this.query);
        this.loadReleaseCourseCount(this.query);
        this._search.input.refs.input.value = this.props.trainings.filter.name || '';
        if (!this.props.trainings.deptList.length) {
          this.props.dispatch(getDeptMine());
        }
    }
    componentWillUpdate(nextProps, nextState) {
        this._search.input.refs.input.value = nextProps.trainings.filter.name || '';
    }
    componentWillUnmount() {
        // 组件卸载时清空reducers
        this.props.dispatch({
            type: 'trainings/resetState'
        });
    }
    showUserManage = (record) => {
        const { courseId, id, planEndTime, planStartTime } = record;
        const current = { courseId, id, planEndTime, planStartTime };

        this.props.dispatch({
            type: 'trainings/showModal',
            payload: { current }
        })
    }
    showResetSubmit = (record) => { // 已撤销培训课程 重新发布 操作
      const { id, planEndTime, planStartTime, courseId } = record;
      getStudyDetail({releaseId: id}).then((res) => {
        if (res.success) {
          const data = res.data;
          let studentListArr = data.contentStudentRelationRespDTOList;
          studentListArr = studentListArr.map((item) => {
            let { userId, userName, deptId, wardName, wardId, jobNumber } = item;
            return { userId, userName, deptId, wardName, wardId, jobNumber };
          })
          this.setState({
            resetSubmitDataSource: {...data, contentStudentRelationRespDTOList: studentListArr},
            currentData: { ...record },
          });
          this.props.dispatch({
            type: 'trainingsManage/showChooseModal',
            // payload: { current: {}}
          });
        }
        
      });
    }
    load = (query) => {
        let filter = this.props.trainings.filter;
        filter = Object.assign({}, filter, query);
        this.props.dispatch({
            type: 'trainings/save',
            payload: { filter }
        })
        this.props.dispatch(getTrainingsList(filter));
    }
    loadReleaseCourseCount = (query) => {
        let filter = this.props.trainings.filter;
        filter = Object.assign({}, filter, query);
        this.props.dispatch({
            type: 'trainings/save',
            payload: { filter }
        })
        this.props.dispatch(getReleaseCourseCount(filter));
    }
    onChange = (query) => {
        this.props.history.push({
            pathname: '/hospital-admin/nurse-training-course/trainings.html',
            search: `?${serialize({ ...this.props.trainings.filter, ...query })}`
        });
    }
    deleteCancelTraining = (id) => {
        deleteCancelTraining(id).then(data => {
            if (!data.success) {
                message.error(data.errMsg);
                return;
            }
            message.success('删除成功');
            this.onChange({});
        });
    }
    cancelTraining = (id) => {
        cancelTraining(id).then(data => {
            if (!data.success) {
                message.error(data.errMsg);
                return;
            }
            message.success('撤销成功');
            this.onChange({});
        });
    }
    render() {
        const { trainings, dispatch, history, trainingsManage } = this.props;
        const { loading, filter, dataSource, releaseCourseCounts, userManageModalVisible,
            list, // ?? 以下待定
            total,

            trainingClassification,
            courseClassification,
            trainingsCounts,

            current,
            defaultSelectedIds,
            defaultSelectedRowKeys,
            releaseUserData,
            releasePaperDate,
        } = trainings;

        const trainingsManageModalVisible = trainingsManage.visible; // 显示 重新发布弹层组件
        const trainingsManageModalProps = {
          visible: trainingsManageModalVisible,
          currentData: this.state.currentData,
          resetSubmitDataSource: this.state.resetSubmitDataSource, // 
          loading: trainingsManage.loading,
          releaseLoading: trainingsManage.releaseLoading,
          handleOk() {
            dispatch({
              type: 'trainingsManage/showChooseModal'
            });
          },
          handleCancel() {
            dispatch({
              type: 'trainingsManage/hiddenChooseModal'
            });
          },
          courseReleaseHandler(submitParam) {
              saveCoureseRelease({ payload: { submitParam } }).then((res) => {
                  if (!res.success) {
                      message.error(res.errMsg);
                  } else {
                      dispatch({
                          type: 'trainingsManage/hiddenChooseModal'
                      });
                      dispatch({
                          type: 'courseDetails/hidePublishModal',
                      })
                      message.success('发布成功');
                      history.push({
                          pathname: '/hospital-admin/nurse-training-course/trainings.html',
                      });
                  }
              });
          },
          courseReleaseAllHandler(submitParam) {
              saveCoureseReleaseAll({ payload: { submitParam } }).then((res) => {
                  if (res && res.success) {
                      dispatch({
                          type: 'trainingsManage/hiddenChooseModal'
                      });
                      dispatch({
                          type: 'courseDetails/hidePublishModal',
                      });
                      message.success('发布成功');
                      history.push({
                          pathname: '/hospital-admin/nurse-training-course/trainings.html',
                      });
                  } else {
                      message.error(res.errMsg);
                      dispatch({
                          type: 'trainingsManage/showReleaseLoading'
                      });
                  }
              });

          },
          onChange(query) {
            dispatch({
              type: 'trainingsManage/fetchTrainingsUserList', // ??没有找到 该 action 配置
              payload: {
                ...query
              }
            });
          },
        };

        const thisMonNum = releaseCourseCounts.thisMonNum || 0;
        const followUpNum = releaseCourseCounts.followUpNum || 0;
        const completeNum = releaseCourseCounts.completeNum || 0;
        const rescindedNum = releaseCourseCounts.rescindedNum || 0;
        const pagination = {
            ...dataSource.pagination,
            onChange: (pageNum) => {
                this.onChange({ pageNum })
            },
            onShowSizeChange: (pageNum, pageSize) => {
                this.onChange({ pageNum, pageSize });
            }
        }

        const userManageModalProps = {
            visible: userManageModalVisible,
            loading,
            current,
            defaultSelectedIds,
            defaultSelectedRowKeys,
            releaseUserData,
            releasePaperDate,
            dispatch,
            handleCancel() {
                dispatch({
                    type: 'trainings/hideModal'
                });
            },
            courseReleaseHandler(submitParam) {
              dispatch(saveChangeUserManage(submitParam, history));
            },
            onChange(query) {
                dispatch(fetchReleaseUserList({ payload: { ...query } }));
            },
        };

        const deptItem = this.props.trainings.deptList.map(item => {
          let str = '', str2 = '';
          if (item.parentId) {
            str2 = ` (${item.parentName})`;
            str = <span style={{ fontSize: 12, color: '#888' }}>({item.parentName})</span>
          }
          return (
            <Option value={`${item.id}`} key={item.id} title={`${item.name}${str2}`} filter={item.name}>{item.name}&nbsp;{str}</Option>
          );
        });

        return (
            <MainLayout>
                <div className="boz-component-header">
                    <BreadNavList
                        dataSource={[
                            { name: '已发布培训' },
                        ]}
                    />
                </div>
                <div className="boz-component-body">
                    <div style={{ marginBottom: 15, marginTop: 15 }}>
                        <Radio.Group
                            value={filter.type}
                            onChange={e => this.onChange({ type: e.target.value, pageNum: 1 })}
                        >
                            <Radio.Button value="0">全部({releaseCourseCounts.allCounts})</Radio.Button>
                            <Radio.Button value="1">我的({releaseCourseCounts.myCounts})</Radio.Button>
                        </Radio.Group>
                    </div>
                    <div className="boz-component-body-card">
                        <Tabs
                            onChange={value => this.onChange({ rangeType: value, pageNum: 1 })}
                            className={styles.rangeTab}
                            activeKey={filter.rangeType}
                        >
                            <TabPane tab={`本月计划 (${thisMonNum})`} key="0" />
                            <TabPane tab={`后续计划 (${followUpNum})`} key="1" />
                            <TabPane tab={`已结束 (${completeNum})`} key="2" />
                            <TabPane tab={`已撤销 (${rescindedNum})`} key="3" />
                        </Tabs>
                        <div className="padding-0-20" style={{ marginBottom: 10 }}>
                            <Select
                                style={{ width: 150, marginLeft: 15, marginRight: 15 }}
                                onChange={value => this.onChange({ levelCode: value || '0', pageNum: 1 })}
                                placeholder="请选择级别"
                                size="large"
                                value={filter.levelCode}
                            >
                                <Option value="0">全部级别</Option>
                                <Option value="3">病区</Option>
                                <Option value="1">科级</Option>
                                <Option value="2">院级</Option>
                            </Select>
                            <Select
                              showSearch
                              optionFilterProp="filter"
                              filterOption={(input, option) => option.props.filter.indexOf(input) >= 0}
                              style={{ width: 150, marginRight: 15 }}
                              onChange={value => this.onChange({ pageNum: 1, deptId: parseInt(value) })}
                              placeholder="请选择科室"
                              size="large"
                              value={`${filter.deptId ? filter.deptId: -1}`}
                            >
                              <Option value="-1" filter="全部科室">全部科室</Option>
                              {deptItem}
                            </Select>
                            <Search
                                ref={c => this._search = c}
                                placeholder="请输入课程名称查找"
                                style={{ width: 240 }}
                                onSearch={value => this.onChange({ name: value, pageNum: 1 })}
                                size="large"
                            />
                        </div>
                        <Table
                            columns={this.columns}
                            dataSource={dataSource.tableList}
                            loading={loading}
                            rowKey={record => record.id}
                            pagination={false}
                            showHeader={false}
                            className="boz-table-form"
                        />
                        <Pagination
                            className="ant-table-center-pagination"
                            showSizeChanger
                            pageSizeOptions={PAGE_SIZE_OPTIONS}
                            pageSize={filter.pageSize && parseInt(filter.pageSize)}
                            {...pagination}
                        />
                    </div>
                </div>
                {userManageModalVisible ? <UserManageModal {...userManageModalProps} /> : ''}
                {trainingsManageModalVisible ? <TrainingsManageModal {...trainingsManageModalProps} /> : ''}
            </MainLayout>
        );
    }
}

function select(state) {
  const { trainings, trainingsManage } = state;
    return {
        trainings,
        trainingsManage,
    };
}
function actions(dispatch, ownProps) {
    return {
        dispatch,
    };
};

export default connect(select, actions)(Trainings);