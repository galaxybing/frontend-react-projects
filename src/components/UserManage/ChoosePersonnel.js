import React, { Component } from 'react';
import { DatePicker, Input, Table, Pagination, Tooltip, Icon, Checkbox } from 'antd';
import classNames from 'classnames/bind';
import CascaderCheckboxSelect from '@317hu/CascaderCheckboxSelect';
import { getCache } from '../../core/_utils/storage';
// import * as Service from '../../services/common/common';
import { getDicData, getDepts, fetchHospitalTree } from '../../actions/common';
import { PAGE_SIZE_OPTIONS } from '../../constants';
import SelectMultiple from '../SelectMultiple';
import styles from './ChoosePersonnel.css';
import { getDataByDicName } from '../../constants'

const { RangePicker } = DatePicker;
const { roleId, regionIds } = getCache('profile');
const Search = Input.Search;
const className = classNames.bind(styles);
class ChoosePersonnel extends Component { // <重复了，所以弃用 >
  constructor(props) {
    super(props);
    this.state = {
      deptList: [],
      levelList: [],
      wardList: [],
      titleList: [],
      deptCheckedKeys: [],
      deptCheckAll: false,
      wardClearData: false,
      showMoreSearchText: false,
      showMoreSearch: false,
      filterQuery: {
        pageNum: 1,
        pageSize: 10,
        // 人员列表的筛选条件
        hospitalBranchIds: null,
        deptIds: null,
        wardIds: null,
        levelCode: null,
        name: null,
        filterPass: false,
        comInHospStartDate: null,
        comInHospEndDate: null,
        title: null,  // 职称
        filterNewEntry: false,  // 是否过滤新入职的
        filterPreviousRelease: false,  // 过滤是否是历次已发布人员
        filterAlreadyRelease: false,  // 本场考试已选人员
      },
    };

    getDepts().then((d) => {
      if (!d.success) {
        return;
      }
      this.setState({ deptList: d.data });
    });
    getDicData().then((d) => {
      if (!d.success) {
        return;
      }
      this.setState({ levelList: getDataByDicName(d.data, '层级'), titleList: getDataByDicName(res.data, '职称') });
    });
  }
  componentWillMount() {
    const { filterQuery } = this.state;
    const { onChange, filter } = this.props;
    onChange({
      ...filter,
      ...filterQuery,
    });
  }
  componentDidMount() {
    fetchHospitalTree()
      .then((res) => {
        if (res.success) {
          this.setState({
            hospitalTree: res.data[0].children
          });
        }
      });
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      showMoreSearchText: this.refs.filtrateContent.clientHeight > 45
    });
  }
  /*
  deptChangeHandler = (checkedKeys, checkAll) => {
    const { filterQuery } = this.state;
    const { onChange, filter } = this.props;
    let wardClearData = false;
    if ((checkedKeys.length === 1 && checkedKeys.length === this.state.deptCheckedKeys.length)) {
      if (checkedKeys[0] !== this.state.deptCheckedKeys[0]) {
        wardClearData = true;
      }
    } else if (checkedKeys.length !== this.state.deptCheckedKeys.length) {
      wardClearData = true;
    }
    if (checkedKeys.length === 1) {
      Service.getWards(checkedKeys[0]).then(data => {
        this.setState({
          wardList: data.data.data,
        })
      })
    }
    filterQuery.deptIds = checkAll ? null : checkedKeys.join(',');
    filterQuery.wardIds = null;
    filterQuery.pageNum = 1;
    this.setState({
      deptCheckedKeys: checkedKeys,
      deptCheckAll: checkAll,
      wardClearData,
      filterQuery
      // deptId: checkAll ? null : checkedKeys.join(','),
      // wardId: null
    }, () => {
      console.log({
        ...filter,
        ...filterQuery
      });
      onChange({
        ...filter,
        ...filterQuery
      });
    });
  }
  wardChangeHandler = (checkedKeys, checkAll) => {
    const { filterQuery } = this.state;
    const { onChange, filter } = this.props;
    filterQuery.wardIds = checkAll ? null : checkedKeys.join(',');
    filterQuery.pageNum = 1;
    this.setState({
      wardClearData: false,
      filterQuery
    }, () => {
      onChange({
        ...filter,
        ...filterQuery
      });
    });
  }
  */

  levelChangeHandler = (checkedKeys, checkAll) => {
    const { filterQuery } = this.state;
    const { onChange, filter } = this.props;
    filterQuery.levelCode = checkAll ? null : checkedKeys.join(',');
    filterQuery.pageNum = 1;
    this.setState({ filterQuery }, () => {
      onChange({
        ...filter,
        ...filterQuery
      });
    })
  }
  titleChangeHandler = (checkedKeys, checkAll) => {
    const { filterQuery } = this.state;
    const { onChange, filter } = this.props;
    filterQuery.title = checkAll ? null : checkedKeys.join(',');
    filterQuery.pageNum = 1;
    this.setState({ filterQuery }, () => {
      onChange({
        ...filter,
        ...filterQuery
      });
    });
  }
  searchName = (name) => {
    const { filterQuery } = this.state;
    const { onChange, filter } = this.props;
    filterQuery.name = name;
    filterQuery.pageNum = 1;
    this.setState({ filterQuery }, () => {
      onChange({
        ...filter,
        ...filterQuery
      });
    });
  }
  onSearchChange = (e) => {  // 搜索关键字删除后调用接口
    const value = e.target.value;
    const { filterQuery } = this.state;
    const { onChange, filter } = this.props;
    if (!value) {
      filterQuery.name = null;
      filterQuery.pageNum = 1;
      this.setState({ filterQuery }, () => {
        onChange({
          ...filter,
          ...filterQuery
        });
      });
    }
  }
  onDataChange = (date, dateString) => {
    const { filterQuery } = this.state;
    const { onChange, filter } = this.props;
    filterQuery.comInHospEndDate = dateString[1];
    filterQuery.comInHospStartDate = dateString[0];
    filterQuery.pageNum = 1;
    this.setState({
      filterQuery
    }, () => {
      onChange({
        ...filter,
        ...filterQuery
      });
    });
  }
  pageChange = (pageNum) => {
    const { filterQuery } = this.state;
    const { onChange, filter } = this.props;
    filterQuery.pageNum = pageNum;
    this.setState({ filterQuery }, () => {
      onChange({
        ...filter,
        ...filterQuery
      });
    });
  }
  onShowSizeChange = (current, pageSize) => {
    const { filterQuery } = this.state;
    const { onChange, filter } = this.props;
    filterQuery.pageNum = current;
    filterQuery.pageSize = pageSize;
    this.setState({ filterQuery }, () => {
      onChange({
        ...filter,
        ...filterQuery
      });
    });
  }
  clickMoreHandler = () => {
    const { showMoreSearch } = this.state;
    if (showMoreSearch) {
      this.setState({ showMoreSearch: false })
    } else {
      this.setState({ showMoreSearch: true })
    }
  }
  disabledDate(current) {
    return current && current.valueOf() > Date.now();
  }
  filterCheckBoxChange = (type, e) => {  // checkbox单选change
    const value = e.target.checked;
    const { filterQuery } = this.state;
    const { onChange, filter } = this.props;
    filterQuery[type] = value;
    if (type === 'filterPass') {  // 未发布和历次考试未合格人员
      filterQuery.filterPreviousRelease = value ? false : filterQuery.filterPreviousRelease;
      filterQuery.filterAlreadyRelease = value ? false : filterQuery.filterAlreadyRelease;
    } else if (type === 'filterPreviousRelease') {  // 未发布人员
      filterQuery.filterPass = value ? false : filterQuery.filterPass;
      filterQuery.filterAlreadyRelease = value ? false : filterQuery.filterAlreadyRelease;
    } else if (type === 'filterAlreadyRelease') {  // 本场考试已选人员
      filterQuery.filterPreviousRelease = value ? false : filterQuery.filterPreviousRelease;
      filterQuery.filterPass = value ? false : filterQuery.filterPass;
    }
    filterQuery.pageNum = 1;
    this.setState({
      filterQuery
    }, () => {
      onChange({
        ...filter,
        ...filterQuery
      });
    });
  }
  disabledDate(current) {
    return current && current.valueOf() > Date.now();
  }
  checkSelectedAllCheck() {// 检测 全部选择的类型
    let filterQuery = this.state.filterQuery;
    let initFilterQuery = {
      // 人员列表的筛选条件
      deptIds: null,
      wardIds: null,
      levelCode: null,
      name: null,
      filterPass: false,
      comInHospStartDate: null,
      comInHospEndDate: null,
      title: null,  // 职称
      filterNewEntry: false,  // 是否过滤新入职的
      filterPreviousRelease: false  // 过滤是否是历次已发布人员
    };
    let selectedAllCheckStatus = 'all';
    for (let key in initFilterQuery) {
      // let val = filterQuery[key];
      // return !val && val!==0 && (typeof val).toLowerCase())!=="boolean"?true:false;
      if (filterQuery[key]) {
        selectedAllCheckStatus = 'condition';
        break;
      }
    }
    return selectedAllCheckStatus;
  }
  componentWillReceiveProps(nextProps) {
    this.setState({ showMoreSearchText: this.refs.filtrateContent.clientHeight > 45 ? true : false })
  }
  render() {
    const _this = this;
    const { dataSource, loading, totalCount, currentPage, selectedKeysNum, rowSelection, otherProps } = this.props;
    const { deptList, levelList, wardList, titleList, showMoreSearchText, showMoreSearch } = this.state;
    /*
    const deptSelectMultipleProps = {
      searchPlaceholder: '请输入科室查找',
      placeholder: '科室',
      defaultValue: '请选择科室',
      notFoundContent: '没有匹配的科室',
      dataSource: JSON.parse(JSON.stringify(deptList).replace(/name":/g, 'label":').replace(/id":/g, 'value":')),
      onConfirm(checkedKeys, checkAll) {
        _this.deptChangeHandler(checkedKeys, checkAll);
      }
    };
    */
    const levelSelectMultipleProps = {
      searchPlaceholder: '请输入层级查找',
      placeholder: '科室',
      defaultValue: '请选择层级',
      notFoundContent: '没有匹配的层级',
      dataSource: JSON.parse(JSON.stringify(levelList).replace(/name":/g, 'label":').replace(/code":/g, 'value":')),
      onConfirm(checkedKeys, checkAll) {
        _this.levelChangeHandler(checkedKeys, checkAll);
      }
    };
    /*
    const wardSelectMultipleProps = {
      searchPlaceholder: '请输入病区查找',
      placeholder: '科室',
      defaultValue: '请选择病区',
      notFoundContent: '没有匹配的病区',
      dataSource: JSON.parse(JSON.stringify(wardList).replace(/hospitalWardName":/g, 'label":').replace(/hospitalWardId":/g, 'value":')),
      disabled: this.state.deptCheckedKeys.length > 1 && !this.state.deptCheckAll ? true : false,
      isShowLinkage: this.state.deptCheckedKeys.length && !this.state.deptCheckAll ? false : true,
      clearData: this.state.wardClearData,
      onConfirm(checkedKeys, checkAll) {
        _this.wardChangeHandler(checkedKeys, checkAll);
      }
    };
    */
    const titleSelectMultipleProps = {
      searchPlaceholder: '请输入职称查找',
      placeholder: '职称',
      defaultValue: '请选择职称',
      notFoundContent: '没有匹配的职称',
      dataSource: JSON.parse(JSON.stringify(titleList).replace(/name":/g, 'label":').replace(/code":/g, 'value":')),
      onConfirm(checkedKeys, checkAll) {
        _this.titleChangeHandler(checkedKeys, checkAll);
      }
    };
    const columns = [
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
        width: '12%'
      }, {
        title: '科室／病区',
        dataIndex: 'deptName',
        key: 'deptName',
        width: '12%',
        render: (text, record) => (<span>{text}{record.wardName ? ` / ${record.wardName}` : ''}</span>)
      }, {
        title: '职务',
        dataIndex: 'postStr',
        key: 'postStr',
        width: '10%',
      }, {
        title: '职称',
        dataIndex: 'titleName',
        key: 'titleName',
        width: '10%',
      },
      {
        title: '层级',
        dataIndex: 'levelName',
        key: 'levelName',
        width: '10%',
      }, {
        title: '手机号',
        dataIndex: 'mobile',
        key: 'mobile',
        width: '15%',
      }, {
        title: '最高学历',
        dataIndex: 'educationStr',
        key: 'educationStr',
        width: '11%',
      }, {
        title: '入院日期',
        dataIndex: 'arrivalDate',
        key: 'arrivalDate',
      }
    ];
    const filtrateClass = className({
      choosePersonnelFiltrate: true,
      choosePersonnelFiltrateAuto: showMoreSearch
    });
    const tooltipText = (
      <div className="tooltipWrapper">
        <h3>未发布人员</h3>
        <p>该{otherProps.filterType !== 'trainings' ? '试卷' : '课程'}从未发布过的学员</p>
        <h3 style={{ marginTop: 15 }}>未发布和历次{otherProps.filterType !== 'trainings' ? '考试' : '学习'}未合格人员</h3>
        <p>该{otherProps.filterType !== 'trainings' ? '试卷' : '课程'}从未发布过和参加{otherProps.filterType !== 'trainings' ? '考试' : '学习'}但未合格的学员</p>
        {
          otherProps.filterAlreadyRelease ?
            <div style={{ marginTop: 15 }}>
              <h3>本场已发布人员</h3>
              <p>本场{otherProps.filterType !== 'trainings' ? '考试' : '培训'}已发布的学员</p>
            </div> : ''
        }
      </div>
    );

    const cascaderRangeProps = {
      dataSource: {
        value: 'bizId',
        label: 'bizName',
        children: 'children',
        regionType: roleId == '10003' || roleId == '10000' ? 'B' : roleId == '10001' ? 'D' : 'W',
        selectRole: 'W', // 默认使用最低层级权限角色 W
        controllerRegionType: 'SELECT_ALL',
        // 10003 10001 10004
        regionIds: regionIds || '', // 如果是院管理员没有该属性字段
        data: this.state.hospitalTree ? this.state.hospitalTree : [], // 直接引用院区层级
      },
      initialValue: [], // 编辑模式时使用
      treeCheckable: true,
      multiple: true,
      fixedHeight: true,
      searchPlaceholder: '请选择院区、科室、病区',
      style: {
        width: 200,
      },
      dropdownStyle: {
        pannelWidth: 136,
        pannelHeight: 320,
      },
      selectModel: 'child',
      disabledParentAutoSelected: true, // 启用 child 模式时，禁用父级自动勾选功能
      reset: this.state.resetValue ? this.state.resetValue : ['0'],
      onChange: (value) => {
        const { onChange, filter } = this.props;
        let { filterQuery } = this.state;
        filterQuery.hospitalBranchIds = '';
        filterQuery.deptIds = '';
        filterQuery.wardIds = '';
        value.map((val) => {
          let item = val.split('-');
          if (item[1] == 1000 && (roleId === 10000 || roleId === 10003)) {  // 院管理员
            filterQuery.hospitalBranchIds += (filterQuery.hospitalBranchIds ? ',' + item[0] : item[0]);
          } else if (item[1] == 2000 && (roleId !== 10004)) {  // 除病区管理员之外
            filterQuery.deptIds += (filterQuery.deptIds ? ',' + item[0] : item[0]);
          } else if (item[1] == 3000) {
            filterQuery.wardIds += (filterQuery.wardIds ? ',' + item[0] : item[0]);
          }
        });
        filterQuery.pageNum = 1;
        this.setState({
          filterQuery,
          resetValue: value,
        }, () => {
          onChange({
            ...filter,
            ...filterQuery
          });
        });
      },
      notFoundContent: "暂无数据",
      getPopupContainer: (trigger) => trigger.parentNode,
    };
    return (
      <div className={styles.choosePersonnel}>
        <div className={filtrateClass} style={{ overflow: 'visible', height: 'auto' }}>
          <div className={styles.filtrateContent} ref="filtrateContent">
            <div>
              <SelectMultiple {...levelSelectMultipleProps} style={{ width: 160 }} />
            </div>
            <div>
              <SelectMultiple {...titleSelectMultipleProps} style={{ width: 160 }} />
            </div>
            {/*
              <div>
                <SelectMultiple {...deptSelectMultipleProps} style={{ width: 160 }} />
              </div>
              <div>
                <SelectMultiple {...wardSelectMultipleProps} style={{ width: 160 }} />
              </div>
              */}
            <div>
              <CascaderCheckboxSelect {...cascaderRangeProps} />
            </div>
            <div className={styles.searchInput}>
              <Search
                placeholder="请输入姓名查询"
                style={{ width: 200 }}
                onSearch={this.searchName}
                onChange={this.onSearchChange}
              />
            </div>
            <div>
              <span className={styles.selectTitle}>入院日期</span>
              <RangePicker onChange={this.onDataChange} disabledDate={this.disabledDate} />
            </div>
            <div style={{ marginLeft: 15 }}>
              <Checkbox
                className={styles.filterCheck}
                onChange={e => this.filterCheckBoxChange('filterNewEntry', e)}
              >
                新入职（一年内）
              </Checkbox>
            </div>
            <div>
              <Checkbox
                className={styles.filterCheck}
                onChange={e => this.filterCheckBoxChange('filterPreviousRelease', e)}
                checked={this.state.filterQuery.filterPreviousRelease}
              >
                未发布人员
              </Checkbox>
            </div>
            <div>
              <Checkbox
                className={styles.filterCheck}
                onChange={e => this.filterCheckBoxChange('filterPass', e)}
                checked={this.state.filterQuery.filterPass}
              >
                未发布和历次{otherProps.filterType !== 'trainings' ? '考试' : '学习'}未合格人员
              </Checkbox>
            </div>
            {
              otherProps.filterAlreadyRelease ?
                <div>
                  <Checkbox
                    className={styles.filterCheck}
                    onChange={e => this.filterCheckBoxChange('filterAlreadyRelease', e)}
                    checked={this.state.filterQuery.filterAlreadyRelease}
                  >
                    本场已发布人员
                  </Checkbox>
                </div> : ''
            }
            <Tooltip placement="right" title={tooltipText}>
              <Icon type="question-circle-o" style={{ fontSize: 16, color: '#ffbf00', cursor: 'pointer' }} />
            </Tooltip>
          </div>

          {
            showMoreSearchText ?
              <span className={styles.moreSearch} onClick={this.clickMoreHandler}>更多<Icon type={showMoreSearch ? "up" : 'down'} style={{ marginLeft: 5 }} /></span>
              : ''
          }
        </div>
        <div style={showMoreSearch ? { margin: '0 30px 20px' } : { margin: '10px 30px 20px' }}>共有<b className="search-result-num">{totalCount}</b>个搜索结果</div>
        <div className={styles.choosePersonnelTable}>
          <Table
            rowSelection={rowSelection}
            columns={columns}
            rowKey={record => record.accountId}
            dataSource={dataSource}
            pagination={false}
            defaultValue={1}
            // bordered
            loading={loading || this.props.releaseLoading}
            className="hide-selection-down"
            scroll={dataSource ? dataSource.length > 10 ? { y: 500 } : {} : {}}
          />
          <div className={styles.page}>
            <span>已经选择:<span className="search-result-num">{selectedKeysNum || 0}</span>人</span>
            {
              this.props.selectedAllCheck ? <a
                className={styles.allCheckLink}
                onClick={() => {
                  if (!loading) {  // 防止后台返回数据慢时多次点击发送请求
                    const status = this.checkSelectedAllCheck();
                    const { filter } = this.props;
                    const { filterQuery } = this.state;
                    this.setState({
                      filterQuery
                    }, () => {
                      this.props.selectedAllCheck({
                        ...filter,
                        ...filterQuery,
                        pageNum: 1,
                        pageSize: totalCount || 10000,  // (给后台传入最大pageSize为条件查询出来的总数目)
                        selectedAllCheckStatus: status,
                      });
                    });
                  }
                }}
                href="javascript:;"
              >全部选择</a> : ''
            }
            {
              this.props.removeAllCheck ? <a className={styles.allCheckLink} onClick={this.props.removeAllCheck} href="javascript:;">清空选择</a> : ''
            }
            <div className={styles.pageRight}>
              <Pagination
                defaultCurrent={1}
                total={totalCount}
                current={currentPage}
                onChange={this.pageChange}
                showSizeChanger
                pageSizeOptions={PAGE_SIZE_OPTIONS}
                // defaultPageSize={this.state.pageSize ? parseInt(this.state.pageSize) : 10}
                onShowSizeChange={this.onShowSizeChange}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default ChoosePersonnel;
