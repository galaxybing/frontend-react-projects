import React, { Component } from 'react';
import { Modal, Button, message } from 'antd';
import { connect } from 'react-redux';

import { fetchReleaseUsers } from '../../actions/common';
import styles from './TrainingsManage.css';
// import ChoosePersonnel from '../UserManage/ChoosePersonnel'; 重复了，所以弃用
import ChoosePersonnel from '../Widgets/UserManage/ChoosePersonnel';

class CheckMemberModal extends Component {
  constructor(props) {
    super(props);
    this.modalProps = {
      width: 960,
      onOk: this.props.handleOk,
      onCancel: this.handleCancel,
    };
    this.noLimitTime = false;

    this.state = {
      trainingsUserData: [],
      loading: true,
      selectNum: 0,
      accountIdMap: new Map([]),
      planEndTime: null,
      planStartTime: null,
      isReleaseAll: false,
      releaseAllQuery: {},
      endOpen: false,
      releaseData: {},
      selectedRowKeys: []
    };
  }
  // componentDidMount () {
  //
  //   const queryData = {"courseId":26758,"pageNum":1,"pageSize":10,"hospitalBranchIds":null,"deptIds":null,"wardIds":null,"levelCode":null,"name":null,"filterPass":false,"comInHospStartDate":null,"comInHospEndDate":null,"title":null,"filterNewEntry":false,"filterPreviousRelease":false,"filterAlreadyRelease":false};
  //   this.loadUserList({ ...queryData, type: 1 });
  // }
  rowSelection = {
    selectedRowKeys: [],
    onChange: (selectedRowKeys, selectedRows) => {
      this.setState({
        selectedRowKeys: selectedRowKeys
      })
    },
    onSelect: (record, selected, selectedRows) => {
      let accountIdMap = this.state.accountIdMap;
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
        accountIdMap.set(record.accountId, param);
      } else {
        accountIdMap.delete(record.accountId);
      }
      this.setState({ accountIdMap, selectNum: accountIdMap.size });
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
      let accountIdMap = this.state.accountIdMap;
      if (selected) {
        for (let account of changeRows) {
          const param = {
            userId: account.accountId,
            userName: account.name,
            deptId: account.deptId,
            deptName: account.deptName,
            wardName: account.wardName ? account.wardName : '',
            wardId: account.wardId ? parseInt(account.wardId) : 0,
            jobNumber: account.jobNumber ? account.jobNumber : ''
          }
          accountIdMap.set(account.accountId, param);
        }
      } else {
        for (let account of changeRows) {
          accountIdMap.delete(account.accountId);
        }
      }
      this.setState({ accountIdMap, selectNum: accountIdMap.size });
    },

    getCheckboxProps: record => ({
      disabled: record.status === 1,    // Column configuration not to be checked
    }),
  };
  onChange = (query) => {
    let releaseAllQueryData = {};
    for (let key in query) {
      if (key !== 'pageNum' && key !== 'pageSize') {
        releaseAllQueryData[key] = query[key]
      }
    }
    this.setState({
      loading: true,
      releaseAllQuery: releaseAllQueryData
    });
    this.loadUserList({ ...query, type: 1 });
  };
  loadUserList = (query) => {
    fetchReleaseUsers(query).then(res => {
      if (!res.data || !res.success) {
        return;
      }
      this.setState({
        trainingsUserData: res.data,
        loading: false
      });
    });
  }
  onSelectedAllCheck = (query) => {
    this.setState({ loading: true });
    this.selectedAllCheckStatus = query.selectedAllCheckStatus;// all 全部人员 condition 按条件查询后的人员

    fetchReleaseUsers({ ...query, type: 1 }).then(res => {
      this.setState({ loading: false });
      if (!res || !res.success) {
        return;
      }
      let accountIdMap = this.state.accountIdMap;
      let memberListData = res.data.result, memberSelectedRowKeys = [];

      for (let account of memberListData) {
        const param = {
          userId: account.accountId,
          userName: account.name,
          deptId: account.deptId,
          deptName: account.deptName,
          wardName: account.wardName ? account.wardName : '',
          wardId: account.wardId ? parseInt(account.wardId) : 0,
          jobNumber: account.jobNumber ? account.jobNumber : ''
        }
        accountIdMap.set(account.accountId, param);
        memberSelectedRowKeys.push(account.accountId);
      }

      this.setState({
        accountIdMap,
        selectNum: memberListData.length,
        selectedRowKeys: memberSelectedRowKeys
      });
    })
  };
  handleCancel = () => {
    this.props.dispatch({
      type: 'trainingsManage/hideCheckMemberModal'
    });
  }
  courseReleaseAllHandler = (e) => {
    this.setState({ isReleaseAll: true }, () => {
      this.handleSubmit();
    });
  }

  render() {
    const { loading, trainingsUserData, selectNum } = this.state;

    const rowSelection = { ...this.rowSelection, selectedRowKeys: this.state.selectedRowKeys };

    return (
      <div>
        <Modal style={{ padding: 20 }} title="选择发布人员" {...this.modalProps} footer={null} visible={this.props.visible} confirmLoading={this.props.loading}>
          <ChoosePersonnel
            onChange={this.onChange}
            loading={loading}
            filter={{ courseId: this.props.courseId }}
            dataSource={trainingsUserData.result}
            totalCount={trainingsUserData.totalCount}
            currentPage={trainingsUserData.pageNumber}
            selectedKeysNum={selectNum}
            rowSelection={rowSelection}
            releaseLoading={this.props.releaseLoading}
            selectedAllCheck={this.onSelectedAllCheck}
            removeAllCheck={() => {
              this.setState({
                selectNum: 0,
                accountIdMap: new Map([]),
                selectedRowKeys: []
              }, () => {
                message.success('清空选择成功')
              })
            }}
            otherProps={{
              filterType: 'trainings',
              filterPreviousRelease: true,
              filterPass: true, filterPassText: '未发布和历次学习未合格人员'
            }}
          />
          <div style={{ marginTop: 20, paddingBottom: 40 }}>
            <div style={{ textAlign: 'center' }}>
              <Button className={styles.releaseBtn} onClick={this.handleCancel} disabled={this.props.loading}>取消</Button>
              <Button
                className={styles.releaseBtn}
                type="primary"
                onClick={() => {
                  const addReleaseStudentReqDTOList = [...this.state.accountIdMap.values()];
                  this.props.handleOk(addReleaseStudentReqDTOList);
                }}
                disabled={!this.state.accountIdMap.size || loading}
              >确认</Button>
            </div>
          </div>
        </Modal>

      </div>
    );
  }
}
function select(state) {
  return {};
}
export default connect(select)(CheckMemberModal);
