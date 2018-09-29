import React, { Component } from 'react';
import { Modal, Button, Table, Pagination, Icon, DatePicker, Select, message, Input, Checkbox } from 'antd';
import moment from 'moment';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from '../../constants';
import { fetchUserManageList } from '../../actions/trainingManage';
import { getCache } from '../../core/_utils/storage';
import styles from '../TrainingsManage/TrainingsManage.css';
import ChoosePersonnel from '../Widgets/UserManage/ChoosePersonnel';

const { MonthPicker, RangePicker } = DatePicker;
const { Search } = Input;
const dateFormat = 'YYYY-MM-DD HH:mm';

class UserManageModal extends Component {
  constructor(props) {
    super(props);

    const { visible } = this.props;
    this.modalProps = {
      width: 960,
      title: '发布培训（人员管理）',
      footer: null,
      onOk: this.handleOk,
      onCancel: this.props.handleCancel.bind(this),
    };

    this.state = {
      addUserIds: new Map([]),
      removeUserIds: new Map([]),
      selectedRowKeys: [],
      isSelectedRow: false,
      cannotDeleteUser: [],
      defaultSelectedIds: new Map([]),
      releaseUserData: {},
      selectedUserTotal: null,
      loading: false,
      releasePaperDate: {}
    };
  }
  shouldComponentUpdate(nextProps) {
    if (this.props.current.courseId !== nextProps.current.courseId) {
      const { deptId, name, title, levelCode } = this.state;
      const { courseId } = nextProps.current;
      this.loadList({ page: 1, deptId, name, title, levelCode, courseId });
      return false;
    }

    return true;
  }
  loadList = (query) => {
    this.setState({
      loading: true
    });
    const { defaultSelectedIds, selectedRowKeys, addUserIds, removeUserIds, } = this.state;
    fetchUserManageList(query).then(d => {
      if (!d || !d.success || (d.success && !d.data)) {
        this.setState({
          loading: false
        });
        return;
      }
      const data = d.data;
      for (let i = 0; i < data.pager.result.length; i++) {
        const resource = data.pager.result[i];
        if (resource.status === 1) {
          defaultSelectedIds.set(resource.accountId, resource.accountId);
        }
      }
      this.setState({
        selectedUserTotal: data.pager.result.length ? data.count : this.state.selectedUserTotal,
        defaultSelectedIds,
        selectedRowKeys: [...defaultSelectedIds.keys()],
        personnelRequest: data.personnelRequest,
        releaseUserData: data.pager,
        releasePaperDate: data,
        loading: false
      });
    })
  };
  handleOk = () => {
    const { removeUserIds } = this.state;
    let cannotDeleteUser = [];
    this.setState({ visible: true }, function () {
      if (removeUserIds.size > 0) {
        for (let value of removeUserIds.values()) {
          if (value.learnFlag === 1) {
            // cannotDeleteUser[cannotDeleteUser.length] = {
            //   userId: value.userId,
            //   userName: value.userName
            // }
            cannotDeleteUser[cannotDeleteUser.length] = value.userName;
          }
        }
        this.setState({ cannotDeleteUser })
      }
    })
  }
  checkHandleOk = (e) => {
    const { loading } = this.props;
    const { addUserIds } = this.state;
    if (loading) return;
    let removeUserIds = [];
    for (let value of this.state.removeUserIds.values()) {
      removeUserIds[removeUserIds.length] = {
        userId: value.userId,
        userName: value.userName,
        deptId: value.deptId,
        deptName: value.deptName,
        // wardName: value.wardName?value.wardName:'',
        // wardId: value.wardId?parseInt(value.wardId):0,
        // jobNumber: value.jobNumber?value.jobNumber:''
      }
    }
    let submitParam = {
      accountId: getCache('profile').userId,
      releaseId: this.props.current.id,
      hospitalId: getCache('profile').hospitalId,
      addReleaseStudentReqDTOList: [...addUserIds.values()],
      removeReleaseStudentReqDTOList: removeUserIds,
    }

    this.setState({
      visible: false,
    }, () => {
      this.props.dispatch({
        type: 'trainings/courseReleaseLoading'
      });
      this.props.courseReleaseHandler(submitParam);
    });
  }
  checkHandleCancel = (e) => {
    this.setState({
      visible: false
    });
  }
  disabledDate(current) {
    return current && current.valueOf() < Date.now() - 86400000;
  }
  removeByValue = (arr, val) => {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] == val) {
        arr.splice(i, 1);
      }
    }
  }
  onSelect = (record, selected, selectedRows) => {
    const { addUserIds, removeUserIds, defaultSelectedIds } = this.state;
    // const { defaultSelectedIds } = this.props;
    this.setState({ selectedRowKeys: [...defaultSelectedIds.keys()], isSelectedRow: true })
    const param = {
      userId: record.accountId,
      userName: record.name,
      deptId: record.deptId,
      deptName: record.deptName,

      wardName: record.wardName ? record.wardName : '',
      wardId: record.wardId ? parseInt(record.wardId) : 0,
      jobNumber: record.jobNumber ? record.jobNumber : ''
    }
    if (selected) {
      if (removeUserIds.has(record.accountId)) {
        removeUserIds.delete(record.accountId);
      }
      if (!defaultSelectedIds.has(record.accountId)) {
        addUserIds.set(record.accountId, param);
      }
    } else {
      param.learnFlag = record.learnFlag;
      if (defaultSelectedIds.has(record.accountId)) {
        removeUserIds.set(record.accountId, param);
      }
      if (addUserIds.has(record.accountId)) {
        addUserIds.delete(record.accountId);
      }
    }
    this.setState({
      addUserIds, removeUserIds
    }, () => {
      this.setSelectedRowKeys();
    })
  }
  onSelectAll = (selected, selectedRows, changeRows) => {
    const { addUserIds, removeUserIds, defaultSelectedIds } = this.state;
    //const { defaultSelectedIds } = this.props;
    this.setState({ selectedRowKeys: [...defaultSelectedIds.keys()], isSelectedRow: true });
    if (selected) {
      for (let row of changeRows) {
        const param = {
          userId: row.accountId,
          userName: row.name,
          deptId: row.deptId,
          deptName: row.deptName,
          
          wardName: row.wardName ? row.wardName : '',
          wardId: row.wardId ? parseInt(row.wardId) : 0,
          jobNumber: row.jobNumber ? row.jobNumber : ''
        }
        if (!defaultSelectedIds.has(row.accountId)) {
          addUserIds.set(row.accountId, param);
        }
        if (removeUserIds.has(row.accountId)) {
          removeUserIds.delete(row.accountId);
        }
      }
    } else {
      for (let row of changeRows) {
        const param = {
          userId: row.accountId,
          userName: row.name,
          deptId: row.deptId,
          deptName: row.deptName,
          learnFlag: row.learnFlag
        }
        if (defaultSelectedIds.has(row.accountId)) {
          removeUserIds.set(row.accountId, param);
        }
        if (addUserIds.has(row.accountId)) {
          addUserIds.delete(row.accountId);
        }
      }
    }
    this.setState({
      addUserIds, removeUserIds
    }, () => {
      this.setSelectedRowKeys();
    });
  }
  setSelectedRowKeys() {
    const { removeUserIds, addUserIds, selectedRowKeys } = this.state;
    for (let key of removeUserIds.keys()) {
      this.removeByValue(selectedRowKeys, key);
    }
    for (let key of addUserIds.keys()) {
      selectedRowKeys[selectedRowKeys.length] = key;
    }
    this.setState({ selectedRowKeys })
  }
  render() {
    const { current, releasePaperId } = this.props;
    const { removeUserIds, addUserIds, selectedRowKeys, cannotDeleteUser, isSelectedRow, loading, selectedUserTotal, defaultSelectedIds, releaseUserData, releasePaperDate } = this.state;
    const { courseId, id } = this.props.current;
    for (let key of removeUserIds.keys()) {
      this.removeByValue(selectedRowKeys, key);
    }
    for (let key of addUserIds.keys()) {
      selectedRowKeys[selectedRowKeys.length] = key;
    }
    const rowSelection = {
      selectedRowKeys,
      onSelect: this.onSelect,
      onSelectAll: this.onSelectAll,
      selections: false
    };
    const selectedKeysNum = releasePaperDate.count - (removeUserIds.size) + (addUserIds.size);
    return (
      <div>
        <Modal
          {...this.modalProps}
          style={{ padding: 20 }}
          visible={this.props.visible}
          confirmLoading={this.props.loading}
        >
          <div>
            <div className={styles.options}>
              <p>
                <span className={styles.title}>计划时间  </span>
                <RangePicker
                  disabledDate={this.disabledDate}
                  onChange={this.onDataChange}
                  defaultValue={[moment(current.planStartTime, dateFormat), moment(current.planEndTime, dateFormat)]}
                  disabled
                  format={dateFormat}
                />
              </p>
              {
                releasePaperDate.personnelRequest ? <p><span className={styles.title}>对象要求</span>{releasePaperDate.personnelRequest}</p> : ''
              }
              <p><span className={styles.title}>测验次数</span><Input style={{ width: 60 }} value={releasePaperDate.retakeTime} disabled /></p>
            </div>
            <div className={styles.bkg} />
            <div className={styles.selectPerson}>
              <span className={styles.selectText}>选择必修人员</span>
            </div>
          </div>

          <div>
            <ChoosePersonnel
              onChange={this.loadList}
              loading={loading}
              filter={{ courseId, releaseId: id }}
              dataSource={releaseUserData.result}
              totalCount={releaseUserData.totalCount}
              currentPage={releaseUserData.pageNumber}
              selectedKeysNum={selectedKeysNum}
              rowSelection={rowSelection}
              otherProps={{
                filterType: 'trainings',
                filterPreviousRelease: true,
                filterAlreadyRelease: true,
                filterPass: true, filterPassText: '未发布和历次学习未合格人员'
              }}
            />
          </div>

          <div style={{ marginTop: 20, paddingBottom: 40 }}>
            <div style={{ textAlign: "center" }}>
              <Button className={styles.releaseBtn} onClick={this.props.handleCancel} disabled={this.props.loading}>取消</Button>
              <Button className={styles.releaseBtn} type="primary" onClick={this.handleOk} disabled={selectedKeysNum === 0} loading={(this.props.loading === true) ? true : false}>发布</Button>
            </div>
          </div>
        </Modal>
        <Modal
          title="课程发布"
          visible={this.state.visible}
          onOk={this.checkHandleOk}
          onCancel={this.checkHandleCancel}
          width={600}
        >
          <p className={styles.checkWord}>
            {cannotDeleteUser.length ?
              <span style={{ fontSize: 16 }}>
                您选择删除的{cannotDeleteUser[0]}等{cannotDeleteUser.length}人已在学习中，是否确认删除并发布？
            </span> : '确认发布课程？'}
          </p>
        </Modal>
      </div>
    );
  }
};

export default UserManageModal;
