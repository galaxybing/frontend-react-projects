import React, { Component } from 'react';
import { Modal, Button, Table, Pagination, Radio, Input, message, Popconfirm, Select, Spin, Tooltip } from 'antd';
import { PAGE_SIZE_OPTIONS } from '../../constants';

import styles from './Course.css';
import { getCache } from '../../core/_utils/storage';
import deepClone from '../../core/_utils/deepClone';
import { deleteHospitalTeacher, fetchMemberNameList } from '../../actions/trainingManage';
import { addTeacher, editTeacher, fetchTeacherList } from '../../actions/createCourse';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const Search = Input.Search;

const { hospitalId, roleId, userId } = getCache('profile') || {};

class ChooseTeacherModal extends Component {
  constructor(props) {
    super(props);
    const { visible } = this.props;
    this.modalProps = {
      width: 700,
      onOk: this.handleOk.bind(this),
      onCancel: this.handleCancel.bind(this),
    };
    
    this.teacherListResult = this.props.teacherList ? deepClone(this.props.teacherList.result) : [];
    // 配置 选中项：
    let selectedRowKeys = [];
    for (let [key, value] of this.props.chooseIdMap) {
      selectedRowKeys.push(key);
    }
    this.state = {
      page: 1,
      pageSize: 10,
      teacherName: '',
      teacherType: '0',
      selectedRowKeys,
      selectRowMap: this.props.chooseIdMap ? this.props.chooseIdMap: new Map([]),
      teacherListData: deepClone(this.teacherListResult),
      teacherCreate: { // 新增 讲师的空白数据行 字段：
        id: 0, // id 标识 为0 表示新建

        mobile: '',
        name: '',
        post: '',
        unitName: '本院讲师',
        unitType: 1, // 最终 提交后端的数据时处理成 1,2
        // studentId

        status: 'create', // create | edit | 
        memberCheckType: 'select',
      },
      fetchLoading: false,
      addTeacherBtnStatus: 'active',
    }
  }
  
  componentWillReceiveProps(nextProps) {
    if (nextProps.teacherList) {
      this.setState({
        teacherListData: nextProps.teacherList.result,
      })
    }
  }

  columns = [
    {
      title: '单位',
      dataIndex: 'unitName',
      key: 'unitName',
      width: '20%',
      render: (text, record, ind) => {
        const { id, status, unitName } = record;
        if (status === 'create') {
          return (
            <Select defaultValue={unitName} style={{width: '100%'}} onSelect={(val) => {
              let { teacherListData } = this.state;
              teacherListData[`${ind}`][`memberCheckType`] = val === '1' ? 'select': 'input';
              teacherListData[`${ind}`][`unitType`] = val === '1' ? '1': (val === '3' ? '3' : '');
              teacherListData[`${ind}`][`unitName`] = val === '1' ? '本院讲师': (val === '3' ? '其他组织' : '');
              this.setState({
                teacherListData,
              })
            }}>
              <Select.Option data_num={id} value="1">本院讲师</Select.Option>
              <Select.Option data_num={id} value="3">其他组织</Select.Option>
            </Select>
          )
        } else { // 新建
          return text;
        }
      }
    }, {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: '20%',
      render: (text, record, ind) => {
        const { id, status, nameArr = [], memberCheckType, name, accountId } = record;
        let { teacherListData } = this.state;
        if (status === 'create' && memberCheckType === 'select') {
          let defaultValueProps = id === 0 ? {} : {defaultValue: name};
          return (
            <Select showSearch style={{ width: 126 }} placeholder="姓名或工号" /*optionFilterProp="children"*/
              notFoundContent={this.state.fetchLoading ? <Spin size="small" /> : null}
              filterOption={false}
              optionLabelProp={'personName'}
              {...defaultValueProps}
              onSearch={(val) => this.fetchMemberName(val, record, ind)}
              onSelect={(value, option) => {
                const { name, accountId, mobile, titleStr } = nameArr[`${option.props.index}`];
                teacherListData[`${ind}`][`name`] = name;
                teacherListData[`${ind}`][`mobile`] = mobile;
                teacherListData[`${ind}`][`post`] = titleStr ? titleStr : ''; // 后端字段名称为 titleStr
                
                teacherListData[`${ind}`][`studentId`] = accountId;
                this.setState({
                  teacherListData,
                })
              }}
              onChange={(value, option) => {
                // const { name, accountId, mobile, titleStr } = nameArr[`${option.props.index}`];
                // teacherListData[`${ind}`][`name`] = name;
                // teacherListData[`${ind}`][`mobile`] = mobile;
                // teacherListData[`${ind}`][`post`] = titleStr ? titleStr : ''; // 后端字段名称为 titleStr
                // 
                // teacherListData[`${ind}`][`studentId`] = accountId;

                this.setState({
                  teacherListData,
                })
              }}
              getPopupContainer={trigger => trigger.parentNode}
            >
              {
                nameArr.map((item, innerIndex) => {
                  return <Select.Option personName={item.name} value={item.name+'_'+innerIndex} key={item.name} rel={item.accountId}>{item.name}{item.jobNumber ? '-'+ item.jobNumber : ''}{item.deptName ? '-'+item.deptName :'' }</Select.Option>;
                })
              }
            </Select>
          )
        } else if (status === 'create' && memberCheckType === 'input') {
          return (
            <Input defaultValue={name} placeholder="请输入姓名" onChange={(e) => {
              teacherListData[`${ind}`][`name`] = e.target.value;
              this.setState({
                teacherListData,
              })
            }} />
          )
        } else { // 新建
          return text;
        }
      }
    }, {
      title: '职称',
      dataIndex: 'post',
      key: 'post',
      width: '20%',
      render: (text, record, ind) => {
        const { id, status, post } = record;
        let { teacherListData } = this.state;
        if (status === 'create') {
          return (
            <Input value={post ? post : ''} placeholder="请输入职称" onChange={(e) => {
              teacherListData[`${ind}`][`post`] = e.target.value;
              this.setState({
                teacherListData,
              })
            }} />
          )
        } else {
          return text;
        }
      }
      
    }, {
      title: '手机号',
      dataIndex: 'mobile',
      key: 'mobile',
      width: '20%',
      render: (text, record, ind) => {
        const { id, status, mobile } = record;
        let { teacherListData } = this.state;
        if (status === 'create') {
          return (
            <Tooltip visible={teacherListData[`${ind}`][`mobileTooltip`]} title={true ? '请输入正确的手机号码' : ''}>
              <Input value={mobile} placeholder="请输入手机号" onChange={(e) => {
                const mobileNumber = e.target.value;
                if (!/^1[3456789]\d{9}$/.test(mobileNumber)) {
                  teacherListData[`${ind}`][`mobileTooltip`] = true;
                }
                teacherListData[`${ind}`][`mobile`] = mobileNumber;
                this.setState({
                  teacherListData,
                })
              }} onFocus={() => {
                teacherListData[`${ind}`][`mobileTooltip`] = false;
                this.setState({
                  teacherListData,
                })
              }} />
            </Tooltip>
          )
        } else { // 新建
          return text;
        }
      }
    }, {
      title: '操作',
      dataIndex: 'option',
      key: 'option',
      width: '20%',
      render: (text, record, ind) => {
        const { id, status } = record;
        if (status === 'create') {
          return (
            <span>
              <Popconfirm title="确定取消？" onConfirm={() => this.cancelTeacherhandler(ind)}>
                <a href="javascript:;" style={{ display: 'inline-block', marginRight: 5 }}>取消</a>
              </Popconfirm>
              <a onClick={() => this.addTeacherhandler('add', record, ind)}>完成</a>
            </span>
          )
        } else { // 新建
          return (
            <span>
              <Popconfirm title="确定删除？" onConfirm={() => this.deleteTeacherhandler(record.id)}>
                <a href="javascript:;" style={{ display: 'inline-block', marginRight: 5 }}>删除</a>
              </Popconfirm>
              <a onClick={() => this.handleAdd('edit', ind)}>编辑</a>
            </span>
          )
        }
      }
    }
  ];
  
  fetchMemberName = (value, record, ind) => {
    let { teacherListData } = this.state;
    teacherListData[`${ind}`][`nameArr`] = []; // 清空 交互体验更好些
    this.setState({ teacherListData, fetchLoading: true });
    fetchMemberNameList(value).then((res) => {
      if (res.success && res.data.length) {
        teacherListData[`${ind}`][`nameArr`] = res.data;
      }
      this.setState({ teacherListData, fetchLoading: false });
    });
  }
  
  addTeacherhandler = (type, data, ind) => { // 'add', record, ind
    const { teacherListData } = this.state;
    let { mobile, name, post, unitName, unitType, studentId, id } = teacherListData[`${ind}`];
    let teacher = {
      mobile,
      name,
      post,
      unitName,
      unitType: parseInt(unitType),
      studentId,
      id,

      accountId: userId,
      hospitalId,
    };
    let lecturerReqDTOList = [];
    lecturerReqDTOList.push(teacher);
    if (!name) {
      message.warn('姓名不能为空')
    /*
     * v2.9.3.1 
     *   职称和电话改为非必填项
    } else if (!post) {
      message.warn('职称不能为空')
    } else if (!/^1[3456789]\d{9}$/.test(mobile)) {
      message.warn('请输入正确的手机号码')
    */
    } else if (mobile && !/^1[3456789]\d{9}$/.test(mobile)) {
      message.warn('请输入正确的手机号码')
    } else {
      if (id === 0) { // 创建 id 为 0 表示新增
        this.props.dispatch(addTeacher({ payload: { lecturerReqDTOList } })).then((res) => {
          this.setState({ page: 1 }, () => this.fetchList()); // 刷新 当前列表数据
        });
      } else {
        this.props.dispatch(editTeacher({ payload: { teacherValue: teacher } })).then((res) => {
          this.setState({ page: 1 }, () => this.fetchList()); // 刷新 当前列表数据
        });
      }
      this.setState({
        addTeacherBtnStatus: 'active',
      })
    }

  }
  cancelTeacherhandler = (index) => {
    let { teacherListData } = this.state;
    if (teacherListData[`${index}`][`id`] === 0) { // 新增 取消
      teacherListData.splice(index, 1);
    } else { // 编辑 取消 - 应用初始化时数据行
      teacherListData[`${index}`] = deepClone(this.props.teacherList.result[`${index}`]);
      teacherListData[`${index}`][`status`] = '';
    }
    this.setState({
      teacherListData,
      addTeacherBtnStatus: 'active',
    })
  }
  deleteTeacherhandler = (id) => {
    deleteHospitalTeacher(id).then((res) => {
      if (res.success) {
        this.fetchList();
      } else {
        res.errMsg ? message.warn(res.errMsg) :  message.warn('删除操作不成功');
      }
    });
  }
  handleAdd = (type, index) => {
    // 新增 一行空白数据
    // 
    let { teacherListData, teacherCreate } = this.state;
    if (type === 'create') {
      // 不直接使用 teacherCreate ，因为会篡改变量：
      teacherListData.unshift({ // 新增 讲师的空白数据行 字段：
        id: 0, // id 标识 为0 表示新建

        mobile: '',
        name: '',
        post: '',
        unitName: '本院讲师',
        unitType: 1, // 最终 提交后端的数据时处理成 1,2
        // studentId

        status: 'create', // create | edit | 
        memberCheckType: 'select',
      }); // create
    } else if (type === 'edit') {
      // if (teacherListData[`${index}`][`unitType`] == 3) { // input
        teacherListData[`${index}`][`memberCheckType`] = 'input';
      // } else {
      //   teacherListData[`${index}`][`memberCheckType`] = 'select';
      // }
      teacherListData[`${index}`][`studentId`] = teacherListData[`${index}`][`accountId`]; // 当前编辑的 accountId 转换成提交完成时的 studentId
      teacherListData[`${index}`][`status`] = 'create';
    }
    this.setState({
      teacherListData,
      addTeacherBtnStatus: '', // 禁用二次新增情况
    })
  }
  
  onSelectChange = (selectedKeys) => {
    if (selectedKeys.length > 30) { // 最多选择 30 位讲师； 更新： 选择讲师的人数限制为 30 2018-09-27
      return;
    }
    this.setState({ selectedRowKeys: selectedKeys });
  }
  onSelect = (record, selected, selectedRows) => {
    let { selectRowMap } = this.state;
    if (selected && selectRowMap.size >= 30) { // 更新： 选择讲师的人数限制为 30 2018-09-27
      message.warn('最多选择 30 位讲师');
      return;
    }
    selected ? selectRowMap.set(record.id, {name: record.name, post: record.post}): selectRowMap.delete(record.id);
    this.setState({ selectRowMap: selectRowMap });
  }

  handleOk = () => {
    this.props.handleOk(this.state.selectRowMap);
  }

  handleCancel = () => {
    this.props.handleCancel();
  }

  typeChangeHandler = (e) => {
    let teacherType = e.target.value;
    this.setState({ page: 1, teacherType, addTeacherBtnStatus: 'active' }, () => this.fetchList());
  }
  pageChangeHandler = (page) => {
    this.setState({ page, addTeacherBtnStatus: 'active' }, () => this.fetchList());
  }
  onShowSizeChange = (current, pageSize) => {
    this.setState({ page: current, pageSize }, () => this.fetchList());
  }
  searchHandler = (name) => {
    this.setState({ page: 1, teacherName: name }, () => this.fetchList());
  }
  fetchList() {
    let teacherType = this.state.teacherType;
    if (teacherType == 1) {
      teacherType += ',2';
    }
    this.props.fetchTercherList({
      name: this.state.teacherName,
      teacherType,
      page: this.state.page,
      pageSize: this.state.pageSize
    });
  }
  render() {
    let { selectedRowKeys, teacherListData, teacherCreate } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      onSelect: this.onSelect,
      getCheckboxProps: record => ({
        // disabled: !record.name,
        disabled: record.id === 0
      }),
    };
    const { teacherList } = this.props; // totalCount | pageNumber
    return (
      <div>
        <Modal title="选择讲师" {...this.modalProps} visible={this.props.visible}>
          <div style={{ padding: '20px 20px 0' }}>
            <div>
              <RadioGroup value={this.state.teacherType} size="large" onChange={this.typeChangeHandler}>
                <RadioButton value="0">全部讲师</RadioButton>
                <RadioButton value="1">本院讲师</RadioButton>
                <RadioButton value="3">其他组织</RadioButton>
              </RadioGroup>
            </div>
            <p style={{ overflow: 'hidden', margin: '10px 0' }}>
              <Search
                placeholder="请输入姓名查找"
                style={{ width: 250 }}
                onSearch={this.searchHandler}
              />
              <Button type="primary" onClick={() => this.handleAdd('create', 0)} disabled={this.state.addTeacherBtnStatus === 'active' ? false : true } style={{ float: 'right' }} ghost>新增讲师</Button>
            </p>
            <Table
              rowSelection={rowSelection}
              columns={this.columns}
              // dataSource={teacherList ? teacherList.result : []}
              dataSource={teacherListData}
              loading={this.props.loading}
              rowKey={(record, ind) => {
                // return record.id + '_' + ind;
                return record.id;
              }}
              pagination={false}
              bordered={false}
              className={`${styles.commontable} ${styles.commontableMinPadding}`}
              scroll={this.state.pageSize > 10 ? { y: 450 } : {}}
            />
            <Pagination
              style={{ float: 'right', margin: '10px 0 0' }}
              total={teacherList ? teacherList.totalCount : []}
              current={teacherList ? teacherList.pageNumber : []}
              //pageSize={PAGE_SIZE}
              onChange={this.pageChangeHandler}
              showSizeChanger
              pageSizeOptions={PAGE_SIZE_OPTIONS}
              onShowSizeChange={(current, pageSize) => this.onShowSizeChange(current, pageSize)}
            />
            <div style={{clear: 'both'}} />
          </div>
        </Modal>
      </div>
    );
  }
};

export default ChooseTeacherModal;
