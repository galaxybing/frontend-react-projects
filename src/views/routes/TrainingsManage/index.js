import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Table, Icon, Pagination, Popconfirm, Input, Checkbox, Tooltip, Row, Col, Button, message, Select } from 'antd';
import { PAGE_SIZE_OPTIONS } from '../../../constants';
import { getCache } from '../../../core/_utils/storage';
import { searchStrToObj } from '../../../core/_utils/common';
import serialize from '../../../core/_utils/serialize';
import CommonService, { getDepts, getDicData } from '../../../actions/common';
import { saveCoureseRelease, saveCoureseReleaseAll, hospitalLeaseInfo, fetchCourseList } from '../../../actions/trainingManage';

import InsertQuestionsService from '../../../actions/insertQuestions';
import { deleteCourse } from '../../../actions/trainingManage';
import MainLayout from '../../../components/Widgets/MainLayout';
import BreadNavList from '../../../components/Widgets/BreadNavList';
import TrainingsManageModal from '../../../components/TrainingsManage/TrainingsManageModal';
import InsertQuestionsModal from '../../../components/InsertQuestionsModal';
import styles from './style.css';

import { getDataByDicName } from '../../../constants'
const OptionItem = Select.Option;
const Search = Input.Search;
const { courseCenterUrl } = getCache('topNavRest') || {};
const initialFilter = {
  courseName: null,
  type: '1',
  pageSize: 10,
  pageNum: 1,
  level: -1,  // 级别
  deptId: -1,  // 科室
};

class TrainingManage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      levelList: [],
      deptList: [],
      filter: initialFilter,
      currentData: null,
      dataSource: {
        tableList: [],
        pagination: {}
      },
      leaseStartTime: null,
      leaseEndTime: null,
      systemTime: null
    };
    this.columns = [{
      dataIndex: 'trainings-manage-index',
      key: 'trainings-manage-key',
      render: (text, record) => {
        let { courseId, contentId, courseName, level, courseSourceDept, courseSource,
          updateTime, insertTitleNum, praiseNum, trainModel, publishCount
        } = record;
        let listData = {};
        listData.url = '/trainings-manage/course-details';
        if (level == 1) {
          listData.level = '科级';
        } else if (level == 2) {
          listData.level = '院级';
        } else if (level == 3) {
          listData.level = '病区';
        }

        if (updateTime) {
          listData.updateTime = updateTime;
        } else {
          listData.updateTime = null;
        }
        listData.courseSourcePeople = record.courseSourcePeople;

        let overlayVideoTips = '';
        if (!record.hadExercise || !record.hadVideoResource) {
          overlayVideoTips = '请先设置视频和试题';
        }
        insertTitleNum = insertTitleNum ? insertTitleNum : 0;
        let operationCol = (
          <div>
            {
              record.canEdit === 1 ?
                <span>
                  <a title="发布" onClick={() => this.onOperation(record, 'onRelease')}>发布</a>
                  <span className="ant-divider" />
                  <a title="编辑" onClick={() => this.onOperation(record, 'onEdit')}>编辑</a>
                  <span className="ant-divider" />
                  <Popconfirm title="确定删除？" onConfirm={() => this.onDel(record.courseId)}>
                    <a title="删除">删除</a>
                  </Popconfirm>
                </span>
                : ''
            }
          </div>
        )

        return (
          <div className="table-form-content">
            <div className="mian-info-row">
              <div className="main-info-title">
                {
                  record.trainModel === 0 ?
                    <span className="main-info-type main-info-type-green">在线培训</span> :
                    <span className="main-info-type">现场培训</span>
                }
                <a className="main-info-name" onClick={() => this.onOperation({ from: record.from, courseId, contentId }, 'onDetail')}>
                  {record.courseName}
                </a>
              </div>
            </div>
            <Row type="flex" justify="space-around" align="middle" className="detail-info-row">
              <Col span={16}>
                <div className={styles.tagSource}>
                  <span className={styles.tag}><em className={styles.tit}>级别：</em>{listData.level}</span>
                  <span className={styles.tag}><em className={styles.tit}>创建科室：</em>{courseSourceDept}</span>
                  <span className={styles.tag}><em className={styles.tit}>点赞数：</em>{praiseNum}</span><br />

                  <span className={styles.tag}><em className={styles.tit}>创建者：</em>{listData.courseSourcePeople}</span>
                  <span className={styles.tag}><em className={styles.tit}>更新时间：</em>{listData.updateTime}</span>
                  <span className={styles.tag}><em className={styles.tit}>发布次数：</em>{publishCount}次</span>

                </div>
              </Col>
              <Col span={4}>
                <p>
                  视频插题：{record.insertTitleNum || 0} 题
                                    {record.canEdit === 1 ?
                    <Tooltip title={overlayVideoTips} overlayClassName={styles.overlayVideo} placement="topLeft">
                      <Icon
                        type="edit"
                        className={overlayVideoTips ? styles.icoVideoDisabled : styles.icoVideoEdit}
                        onClick={() => {
                          if (!overlayVideoTips) {
                            this.showInsertQuestionsModal(record.contentId, 'edit');
                          }
                        }}
                      />
                    </Tooltip> : ''
                  }
                </p>
              </Col>
              <Col span={4} className="detail-info-col-last">
                {operationCol}
              </Col>
            </Row>
          </div>
        );
      }
    }];
    const { search } = this.props.location;
    this.query = {};
    if (search) {
      this.query = searchStrToObj(search);
    }

    getDicData().then((d) => {
      if (!d.success) {
        return;
      }
      this.setState({ levelList: getDataByDicName(d.data,'层级')});
    });
    getDepts().then((d) => {
      if (!d.success) {
        return;
      }
      this.setState({ deptList: d.data });
    });
  }
  componentDidMount() {
    this.load(this.query);
    // this._search.input.refs.input.value = this.state.filter.name || '';

    if (this.query && this.query.courseName) {
      this._search.input.refs.input.value = this.query.courseName;
    }
    const topNavRest = getCache('topNavRest');
    if (topNavRest && topNavRest.topNavMenuModelList) {
      topNavRest.topNavMenuModelList.map((item) => {
        if (item.name === '课程分享') {
          this.linkToCourseAbled = true;
        }
      });
    }
    this.props.dispatch({
      type: 'course/resetState'
    });
  }
  componentWillUpdate(nextProps, nextState) {
    // this._search.input.refs.input.value = nextState.filter.name || '';
    if (this.query && this.query.courseName) {
      this._search.input.refs.input.value = this.query.courseName;
    }
  }
  onOperation = (record, type) => {
    /* 江苏省人民医院 - 护士培训课程付费相关业务需要去除
      if (record.from == 3) {  // from：3表示是租赁的课程，发布时需要判断是否已到期
          hospitalLeaseInfo().then(data => {
              if (!data.success) {
                  if (type !== 'onDetail') {
                      message.error(data.errMsg);
                  } else {
                      this.props[type](record);
                  }
                  return;
              }
              this.setState({
                  leaseStartTime: moment(moment(data.data.leaseStartTime).format('YYYY-MM-DD')).format('X'),
                  leaseEndTime: moment(moment(data.data.leaseEndTime).format('YYYY-MM-DD')).format('X'),
              }, () => {
                  CommonService.getSystemTime(1).then(data => {
                      if (!data.success) {
                          return;
                      }
                      this.setState({
                          systemTime: data.data ? moment(moment(data.data).format('YYYY-MM-DD')).format('X') : 0
                      }, () => {
                          const { leaseStartTime, leaseEndTime, systemTime } = this.state;
                          if (type !== 'onDetail') {
                              if (leaseStartTime > systemTime) {  // 包年开始时间大于当前时间
                                  message.error('课程包年还未开始');
                              } else if (systemTime > leaseEndTime) {
                                  message.error('课程包年已到期');
                              } else {
                                  this[type](record, { leaseStartTime, leaseEndTime, systemTime });
                              }
                          } else {
                              this[type](record, { leaseStartTime, leaseEndTime, systemTime });
                          }
                      });
                  });
              });
          });
      } else {
          this[type](record);
      }
    */
    this[type](record);
  }
  onDel = (courseId) => {
    this.props.dispatch(deleteCourse({ id: courseId, history: this.props.history, filter: this.query }));
  }
  // 课程详情
  onDetail = (record) => {
    this.props.history.push({
      pathname: '/hospital-admin/nurse-training-course/trainings-manage/course-detail.html',
      search: `?from=${record.from}&courseId=${record.courseId}&contentId=${record.contentId}`
    });
  }
  // 编辑
  onEdit = (record, time) => {
    const params = {
      type: record.trainModel == 1 ? 'offline' : 'online',
      currentCourseId: record.courseId,
      ...time,  // 租赁的课程，在编辑成功发布时需要验证是否已过期
    }
    this.props.history.push({
      pathname: '/hospital-admin/nurse-training-course/trainings-manage/create-course.html',
      search: `?${serialize(params)}`
    });
  }

  // 发布
  onRelease = (record, time) => {
    this.setState({
      currentData: { ...record, ...time }
    });
    this.props.dispatch({
      type: 'trainingsManage/showChooseModal',
      // payload: { current: { ...record, ...time } }
    });
  }

  onChange = (query) => {
    let filter = this.state.filter;
    filter = Object.assign({}, filter, query);
    this.props.history.push({
      pathname: '/hospital-admin/nurse-training-course/trainings-manage.html',
      search: `?${serialize(filter)}`
    });
  }

  load = (query) => {
    this.setState({ loading: true });
    let filter = this.state.filter;
    filter = Object.assign({}, filter, query);
    fetchCourseList(filter)
      .then(data => {
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
              current: data.data.pageNumber,
            }
          }
        })
      });
  }

  // 视频插题
  showInsertQuestionsModal = (id, modalType) => {
    this.props.dispatch(InsertQuestionsService.getVideoInsertDetail({ id, modalType }));
  }
  render() {
    const _this = this;
    const { dataSource, loading, levelList, deptList } = this.state;
    const { insertQuestions, trainingsManage, dispatch, history } = this.props;
    const { list, total, page, num, pageSize, visible, current, releaseLoading, filter } = trainingsManage;
    // 列表 发布课程弹层
    const trainingsManageModalProps = {
      visible: visible,
      currentData: this.state.currentData,
      loading,
      releaseLoading,
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
        // ??没有找到 该 action 配置
        dispatch({
          type: 'trainingsManage/fetchTrainingsUserList', // ??没有找到 该 action 配置
          payload: {
            ...query
          }
        });
      },
    };
    const insertQuestionsModalProps = {
      reload: () => {
        this.load(this.query);
      }
    }

    const deptItem = deptList.map(item => {
      let str = '', str2 = '';
      if (item.parentId) {
        str2 = ` (${item.parentName})`;
        str = <span style={{ fontSize: 12, color: '#888' }}>({item.parentName})</span>
      }
      return (
        <OptionItem value={`${item.id}`} key={item.id} title={`${item.name}${str2}`} filter={item.name}>{item.name}&nbsp;{str}</OptionItem>
      );
    });

    return (
      <MainLayout>
        <div className="boz-component-header">
          <BreadNavList
            dataSource={[
              { name: '培训课程' },
            ]}
          />
        </div>
        <div className="boz-component-body boz-component-body-card padding-0-20">
          {
            this.linkToCourseAbled ? (
              <div className={styles.share}>分享培训课程,有偿提供其他医院使用 <a href={`${courseCenterUrl}/course-center-web/shareCourse/shareCourseList.htm?t=1`}>进入分享培训课程</a></div>
            ) : ''
          }
          <div className={styles.searchbarRows}>
            <Select
              style={{ width: 150, marginRight: 15 }}
              onChange={value => this.onChange({ pageNum: 1, level: parseInt(value) })}
              placeholder="请选择级别"
              size="large"
              value={`${this.state.filter.level}`}
            >
              <OptionItem value="-1">全部级别</OptionItem>
              <OptionItem value="3">病区</OptionItem>
              <OptionItem value="1">科级</OptionItem>
              <OptionItem value="2">院级</OptionItem>
            </Select>
            <Select
              showSearch
              optionFilterProp="filter"
              filterOption={(input, option) => option.props.filter.indexOf(input) >= 0}
              style={{ width: 150, marginRight: 15 }}
              onChange={value => this.onChange({ pageNum: 1, deptId: parseInt(value) })}
              placeholder="请选择科室"
              size="large"
              value={`${this.state.filter.deptId}`}
            >
              <OptionItem value="-1" filter="全部科室">全部科室</OptionItem>
              {deptItem}
            </Select>
            <Search
              ref={c => this._search = c}
              placeholder="请输入课程名称查找"
              style={{ width: 250 }}
              onSearch={value => this.onChange({ courseName: value, pageNum: 1 })}
              size="large"
            />
            <Checkbox
              onChange={e => {
                const type = e.target.checked ? 2 : 1;
                this.onChange({ type, pageNum: 1 });
              }}
              style={{ marginLeft: 10 }}
              checked={this.state.filter.type == 2}
            >我的课程</Checkbox>
            <Checkbox
              onChange={e => {
                const unPublishFlag = e.target.checked ? 1 : 0;
                this.onChange({ unPublishFlag, pageNum: 1 });
              }}
              style={{ marginLeft: 10 }}
              checked={parseInt(this.state.filter.unPublishFlag) == 1}
            >未发布课程</Checkbox>
            <span style={{ marginLeft: 20 }}>共有<b className='search-result-num'>{dataSource.pagination.total}</b>个搜索结果</span>
            <div style={{ float: 'right' }}>
              {
                this.linkToCourseAbled ? (
                  <span className={styles.news}><a href={`${courseCenterUrl}/course-center-web/shareCourse/shareCourse.htm?t=1`}>选择公共课程</a><em className={styles.tipsNew}>new</em></span>
                ) : ''
              }
              <Link to='/hospital-admin/nurse-training-course/trainings-manage/choose-training-type.html'><Button type="primary">新建课程</Button></Link>
            </div>
          </div>
          <Table
            columns={this.columns}
            dataSource={dataSource.tableList}
            loading={loading}
            pagination={false}
            rowKey={(record, index) => index}
            showHeader={false}
            className="boz-table-form"
          />
          <Pagination
            className="ant-table-center-pagination"
            showSizeChanger
            pageSizeOptions={PAGE_SIZE_OPTIONS}
            pageSize={this.state.filter.pageSize && parseInt(this.state.filter.pageSize)}
            onChange={(pageNum) => this.onChange({ pageNum })}
            onShowSizeChange={(pageNum, pageSize) => this.onChange({ pageNum, pageSize })}
            {...dataSource.pagination}
          />
        </div>
        {
          visible ? <TrainingsManageModal {...trainingsManageModalProps} /> : ''
        }
        {
          insertQuestions.modalVisible ? <InsertQuestionsModal {...insertQuestionsModalProps} /> : ''
        }
      </MainLayout>
    );
  }
}

function select(state) {
  // const loading = state.loading.models.trainingsManage;
  const trainingsManage = { ...state.trainingsManage/*, loading */ };
  return {
    insertQuestions: state.insertQuestions,
    trainingsManage,
  };
}
function actions(dispatch, ownProps) {
  return {
    dispatch,
  };
};
export default connect(select, actions)(TrainingManage);
