import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Table, Icon, Pagination, Popconfirm, Input, Checkbox, Tooltip, Row, Col, Button, message, Select, Popover, Switch, InputNumber } from 'antd';
import { PAGE_SIZE_OPTIONS, PREVIEWURL } from '../../../constants';
import { getCache } from '../../../core/_utils/storage';
import { searchStrToObj } from '../../../core/_utils/common';
import serialize from '../../../core/_utils/serialize';

import CommonService from '../../../actions/common';
import CourseWareRequest from '../../../actions/courseWare';

import InsertQuestionsService from '../../../actions/insertQuestions'
import MainLayout from '../../../components/Widgets/MainLayout';
import BreadNavList from '../../../components/Widgets/BreadNavList';
import Filtrate from '../../../components/Widgets/Filtrate';
import CoursewareCreateModal from '../../../components/Widgets/CoursewareCreateModal';
import CoursewareEditModal from '../../../components/Widgets/CoursewareEditModal';
import styles from './style.css';

const ButtonGroup = Button.Group;
const OptionItem = Select.Option;
const Search = Input.Search;
const { courseCenterUrl } = getCache('topNavRest') || {};
const warning = () => {
  message.warning('正在转码中，请稍后刷新查看');
};
const error = () => {
  message.error('转码失败，请检查视频后重新上传');
};
const previewCourseware = (url, type) => {
  // if (hospitalType !== '0') {
  //   window.open(url);
  // } else {
  //   window.open(`${previewUrl}?arg=${encodeURIComponent(url)}&type=${type}`);
  // }
  window.open(`${PREVIEWURL}?arg=${encodeURIComponent(url)}&type=${type}`);
};

const initialFilter = {
  courseClassifyCodeParent: '',
  courseClassifyCode: '',
  trainClassifyCode: '',
  name: '',
  pageSize: 10,
  pageNum: 1,
  type: '1', // 1 全部 | 2 我的课件 
};

class TrainingManage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      filter: initialFilter,
      dataSource: {
        tableList: [],
        pagination: {}
      },
      checked: false,
      modalCreateVisible: false,
      modalCreateLoading: false,
      modalEditVisible: false,
    };
    this.columns = [
      {
        title: '课件名称',
        dataIndex: 'fileName',
        key: 'fileName',
        width: '20%',
        render: (text, record) => {
          if (/pdf/i.test(record.fileType)) {
            return (<a onClick={() => previewCourseware(record.url, 'pdf')}>{text}</a>);
          } else if (record.type === 1) {
            if (record.returnUrl) {
              return (<a onClick={() => previewCourseware(record.returnUrl, 'video')}>{text}</a>);
            } else {
              if (record.status === 0) {
                return (<a onClick={warning}>{text}</a>);
              } else if (record.status === -1) {
                return (<a onClick={error}>{text}</a>);
              }
            }
          } else {
            if (record.pdfUrl) {
              return (<a onClick={() => previewCourseware(record.pdfUrl, 'pdf')}>{text}</a>);
            } else {
              if (record.size && record.size.indexOf('M') > -1) {
                const fileSize = record.size.split('M')[0];
                if (fileSize > 10) {
                  return (<a onClick={warning}>{text}</a>);
                }
              }
              return (<a href={`https://view.officeapps.live.com/op/view.aspx?src=${record.url}`} target="_blank">{text}</a>);
            }
          }
        }
      },
      {
        title: '课件大小',
        dataIndex: 'size',
        key: 'size',
        width: '8%',
      },
      {
        title: '课程分类',
        dataIndex: 'courseClassifyName',
        key: 'courseClassifyName',
        width: '10%',
      },
      {
        title: '培训分类',
        dataIndex: 'trainClassifyName',
        key: 'trainClassifyName',
        width: '12%',
      },
      {
        title: '可见范围',
        dataIndex: 'privateFlag',
        key: 'privateFlag',
        width: '13%',
        render: (text) => {
          if (text === 0) {
            return '管理员可见'
          } else {
            return '仅自己可见'
          }
        }
      },
      {
        title: '创建者',
        dataIndex: 'createByName',
        key: 'createByName',
        width: '10%',
        render: (text, record) => {
          if (text) {
            return (<span>{record.deptName && `${record.deptName}-`}{text}</span>)
          } else {
            return (<span>{record.deptName}</span>)
          }
        }
      },
      {
        title: '更新时间',
        dataIndex: 'updateTime',
        key: 'updateTime',
        // width: '15%',
        render: (text) => {
          if (text) {
            return (
              <span className="table-time">
                <span>{text.split(' ')[0]}&nbsp;&nbsp;</span>
                <span>{text.split(' ')[1]}</span>
              </span>
            );
          } else {
            return null;
          }
        }
      }
    ];

    const { search, hospitalType } = this.props.location;
    this.query = {};
    if (search) {
      this.query = searchStrToObj(search);
    }

    this.hospitalType = this.query.sourceId;// 路由链接查询参数定义 ?sourceId=0

    if (this.hospitalType !== '0') {
      this.columns[this.columns.length] = {
        title: <div className="table-item-right-last">操作</div>,
        width: 150,
        render: (text, record) => (
          <div className="table-item-right-last">
            {record.canEdit === 1 ?
              <span className={styles.operate}>
                <a onClick={() => this.onEdit(record)} title="编辑">编辑</a>
                <span className="ant-divider" />
                <Popconfirm title="确定删除？" onConfirm={() => this.onDel(record.id)}>
                  <a title="删除">删除</a>
                </Popconfirm>
              </span> : <span></span>
            }
          </div>
        ),
      }
    }
    
    // 3.4.0 [新增] App端视频下载权限 + 文档观看时长 + 课件查看权限
    this.coursewarePrivilegeParam = {
      privateFlag: 0,
      downloadFlag: 1,
      needWatchTime: 5 * 60,
      ids: '',
    }

  }
  componentDidMount() {
    this.load(this.query);
    // this._search.input.refs.input.value = this.state.filter.name || '';
    if (this.query && this.query.name) {
      this._search.input.refs.input.value = this.query.name;
    }
  }
  componentWillUpdate(nextProps, nextState) {
    // this._search.input.refs.input.value = nextState.filter.name || '';
    if (this.query && this.query.name) {
      this._search.input.refs.input.value = this.query.name;
    }
  }
  onOperation = (record, type) => {
    /* 江苏省人民医院 - 护士培训课程付费相关业务需要去除
    if (record.from == 3) {
      CourseWareRequest.hospitalLeaseInfo().then(res => {
        if (!res.data.success) {
          if (type !== 'onDetail') {
            message.error(res.data.errMsg);
          } else {
            this.props[type](record);
          }
          return;
        }
        this.setState({
          leaseStartTime: moment(moment(res.data.data.leaseStartTime).format('YYYY-MM-DD')).format('X'),
          leaseEndTime: moment(moment(res.data.data.leaseEndTime).format('YYYY-MM-DD')).format('X'),
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
  
  // 课程详情
  onDetail = (record) => {
    this.props.history.push({
      pathname: '/hospital-admin/nurse-training-course/trainings-manage/course-detail.html',
      search: `?from=${record.from}&courseId=${record.courseId}&contentId=${record.contentId}`
    });
  }
  // 编辑
  onEdit = (record) => {
    const fileList = [];
    let documentMaxSize = false;
    if (record.type === 2 && (!/pdf/i.test(record.fileType))) {
      if (record.size && record.size.indexOf('M') > -1) {
        const fileSize = record.size.split('M')[0];
        if (fileSize > 10) {
          documentMaxSize = true;
        }
      }
    }
    fileList[fileList.length] = {
      uid: '-1',
      name: record.fileName,
      // status: 'done',
      status: record.status,
      url: record.url,
      returnUrl: record.returnUrl,
      pdfUrl: record.pdfUrl,
      taskId: record.taskId,
      documentMaxSize,
      // previewUrl: url,
      type: record.type,
      size: 0,
      fileType: record.fileType,
      fileName: record.fileName,
      hashCode: record.hashCode,
      transcodingId: record.transcodingId ? record.transcodingId : null
    };

    this.setState({
      resource: record,
      fileList,
      modalEditVisible: true,
    });
  }

  // 发布
  onRelease = (record) => {

  }

  onChange = (query) => {
    let filter = this.state.filter;
    filter = Object.assign({}, filter, query);
    this.props.history.push({
      pathname: '/hospital-admin/nurse-training-course/courseware.html',
      search: `?${serialize(filter)}`
    });
  }

  load = (query) => {
    this.setState({ loading: true });
    let filter = this.state.filter;
    filter = Object.assign({}, filter, query);

    CourseWareRequest.fetchList(filter)
      .then(data => {
        this.setState({ loading: false });
        if (!data.success) {
          message.error(data.errMsg);
          return;
        } else {
          let resultData = data.data.result;
          if (data.data.result) {
            this.setState({
              filter,
              dataSource: {
                tableList: resultData, // data.data.result,
                pagination: {
                  total: data.data.totalCount,
                  current: data.data.pageNumber,
                }
              }
            })
          }

        }

      });

  }

  // 视频插题
  showInsertQuestionsModal = (id, modalType) => {
    this.props.dispatch(InsertQuestionsService.getVideoInsertDetail(id, modalType));
  }
  // 上传课件
  showCreateModal = () => {
    this.setState({
      modalCreateVisible: true,
    })
  }
  onDel(id) {
    CourseWareRequest.deleteCourseware(id).then((data) => {
      if (data.success) {
        message.success('删除成功');
        let filter = this.state.filter;
        filter = Object.assign({}, filter);
        this.load(filter);
      } else {
        message.error(data.errMsg);
      }
    })
  }
  setCoursewarePrivilegeHandler = () => {
    let { ids } = this.coursewarePrivilegeParam;
    if (!ids) {
      message.warn('请选择选择课件后，再设置该课件属性');
      return;
    }
    CourseWareRequest.setCoursewarePrivilege({...this.coursewarePrivilegeParam}).then(res => {
      if (res.success) {
        message.success(res.data); // 字段格式
        let filter = this.state.filter;
        filter = Object.assign({}, filter);
        this.load(filter);
      }
    });
  }
  onCoursewarePrivilegeSelected = (selectedRowKeys) => {
    this.coursewarePrivilegeParam.ids = selectedRowKeys.join(',');
    // this.setCoursewarePrivilegeHandler();
  }
  render() {
    const { dataSource, loading, checked } = this.state;
    const { insertQuestions } = this.props;
    const filtrateProps = {
      filtrateItem: ['courseClassify', 'trainClassify'],
      onChange: (query) => {
        let param = {
          courseClassifyCodeParent: query.courseClassify,
          courseClassifyCode: query.courseClassifyChildren,
          trainClassifyCode: query.trainClassifyChildren ? query.trainClassifyChildren : query.trainClassify,
        }
        this.load({ ...param }); // 清空搜索条件
      }
    }
    const coursewareCreateModalProps = {
      visible: this.state.modalCreateVisible,
      loading: this.state.modalCreateLoading,
      onCancel: () => {
        this.setState({
          modalCreateVisible: false,
          modalCreateLoading: false,
        });
      },
      onOk: (param) => {
        this.setState({
          modalCreateLoading: true,
        });
        CourseWareRequest.createCourseware(param).then((res) => {
          if (res.success) {
            this.setState({
              modalCreateVisible: false,
              modalCreateLoading: false,
            });
            message.success('上传课件成功!');
            // this.setState({
            //   modalCreateVisible: false,
            // }, () => {
            let filter = this.state.filter;
            filter = Object.assign({}, filter, { pageNum: 1 });
            this.load(filter);
            // });
          } else {
            message.error(res.errMsg);
            this.setState({
              modalCreateLoading: false,
            })
          }
        });

      }
    }

    const coursewareEditProps = {
      resource: this.state.resource,
      fileList: this.state.fileList,
      visible: this.state.modalEditVisible,
      loading: this.state.modalEditLoading,
      onCancel: () => {
        // 
        this.setState({
          modalEditVisible: false,
          modalEditLoading: false,
        });
      },
      saveFileList: (fileList) => {
        this.setState({
          fileList,
        })
      },
      onOk: (param) => {
        this.setState({
          modalEditLoading: true,
        });
        CourseWareRequest.updateCourseware(param).then((res) => {
          if (res.success) {
            this.setState({
              modalEditVisible: false,
              modalEditLoading: false
            });
            message.success('编辑课件成功!');
            let filter = this.state.filter;
            filter = Object.assign({}, filter);
            this.load(filter);
          } else {
            message.error(res.errMsg);
            this.setState({
              modalEditLoading: false,
            })
            return;
          }
        });

      }
    }

    return (
      <MainLayout>
        <div className="boz-component-header">
          <BreadNavList
            dataSource={[
              { name: '课件库' },
            ]}
          />
        </div>

        <div className="boz-component-body boz-component-body-card padding-0-20">
          <div className={styles.searchbarRows}>
            <Search
              ref={c => this._search = c}
              placeholder="请输入课件名称查询"
              style={{ width: 250 }}
              onSearch={value => this.onChange({ name: value, pageNum: 1, courseClassifyCodeParent: '', courseClassifyCode: '', trainClassifyCode: '' })}
              size='large'
            // key={randomKey ? Math.random() : 1} // randomKey 值为 true | false
            />
            {
              this.hospitalType !== '0' ?
                <Checkbox
                  onChange={e => {
                    const type = e.target.checked ? 2 : 1;
                    this.onChange({ type, pageNum: 1 });
                  }}
                  style={{ marginLeft: 10 }}
                  checked={this.state.filter.type == 2}
                >我的课件</Checkbox> : ''
            }
            <span className={styles.searchResult}>
              共有<span style={{ color: '#1a7aff' }}>{dataSource.pagination.total}</span>个搜索结果
                    </span>
            <div style={{ float: 'right' }}>
              {
                this.hospitalType !== '0' ?
                  <Button type="primary" size="large" onClick={() => this.showCreateModal()}>上传课件</Button> : ''
              }
            </div>

          </div>
          <Filtrate {...filtrateProps} />
          <div style={{marginBottom: 10}}>
            <span>设置：</span>
            <ButtonGroup>
              <Popover placement={'bottom'} content={
                <Switch checkedChildren="开" unCheckedChildren="关" defaultChecked onChange={(val) => {
                  let { downloadFlag } = this.coursewarePrivilegeParam;
                  downloadFlag = val ? 1 : 0;
                  this.coursewarePrivilegeParam.downloadFlag = downloadFlag;
                  this.setCoursewarePrivilegeHandler();
                }} />
              } arrowPointAtCenter trigger={'click'}>
                <Button>App端视频下载权限</Button>
              </Popover>
              <Popover placement={'bottom'} content={
                <div>
                  <InputNumber min={1} max={99} defaultValue={5} onChange={(val) => {
                    this.coursewarePrivilegeParam.needWatchTime = val * 60;
                    this.setCoursewarePrivilegeHandler();
                  }} /> 分钟
                </div>
              } arrowPointAtCenter trigger="click">
                <Button>文档观看时长</Button>
              </Popover>
              <Popover placement={'bottom'} content={
                <Select placeholder="请选择查看权限" defaultValue={'对管理员公开'} style={{ width: 150 }} onChange={(val) => {
                  this.coursewarePrivilegeParam.privateFlag = parseInt(val, 10);
                  this.setCoursewarePrivilegeHandler();
                }}>
                  <OptionItem value="0">管理员可见</OptionItem>
                  <OptionItem value="1">仅自己可见</OptionItem>
                </Select>
              } arrowPointAtCenter trigger="click">
                <Button>课件查看权限</Button>
              </Popover>
              
            </ButtonGroup>
            
          </div>
          <Table
            rowSelection={{
              selections: false,
              onChange: this.onCoursewarePrivilegeSelected
            }}
            columns={this.columns}
            dataSource={dataSource.tableList}
            loading={loading}
            rowKey={record => record.id}
            className="boz-table-form"
            pagination={false}
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
        {this.state.modalCreateVisible ? <CoursewareCreateModal {...coursewareCreateModalProps} /> : ''}
        {this.state.modalEditVisible ? <CoursewareEditModal {...coursewareEditProps} /> : ''}
      </MainLayout>
    );
  }
}

function select(state) {
  return {
    insertQuestions: state.insertQuestions,
  };
}
function actions(dispatch, ownProps) {
  return {
    dispatch,
  };
};
export default connect(select, actions)(TrainingManage);
