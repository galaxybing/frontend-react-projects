import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Modal, Button, Pagination, Tabs, Input, Icon, Select, Popover, DatePicker, InputNumber, Tooltip, message, Alert, Checkbox } from 'antd';
import { PAGE_SIZE_OPTIONS } from '../../../constants';
import styles from './ChooseQuestionsModal.css';
import QuestionsTable from '../QuestionsTableList';
// import Filtrate from '../Filtrate';
import QuestionsFilter from '../../../components/Widgets/QuestionsTableList/QuestionsFilter';
import { getCache } from '../../../core/_utils/storage';
import { strMapToObj, objToStrMap, getSelectedCode, getLabelArraysByValue } from '../../../core/_utils/common';
import CommonService from '../../../actions/common';
import Service from '../../../actions/questionsManage';

const Search = Input.Search;
const { RangePicker } = DatePicker;
const TabPane = Tabs.TabPane;
const Option = Select.Option;

const { hospitalId, userId } = getCache('profile') || {};

class ChooseQuestionsModal extends Component {
  constructor(props) {
    super(props);
    const { visible, onCancel, selectedRowsMap, curQuestionType } = this.props;

    const selectedRowObj = strMapToObj(selectedRowsMap);
    const selectedRowCloneObj = Object.assign({}, selectedRowObj);
    let questionType;
    if (curQuestionType == 1) {
      questionType = '单选题';
    } else if (curQuestionType == 2) {
      questionType = '多选题';
    } else if (curQuestionType == 3) {
      questionType = '判断题';
    } else if (curQuestionType == 4) {
      questionType = '填空题';
    } else if (curQuestionType == 5) {
      questionType = '问答题';
    } else if (curQuestionType == 6) {
      questionType = '共用题干题';
    }
    this.modalProps = {
      visible,
      title: `添加试题-${questionType}`,
      width: 1000,
      footer: null,
      onCancel,
      maskClosable: false
    };
    this.state = {
      dataSource: {
        tableList: [],
        pagination: {}
      },
      filter: {},  // 查询条件
      loading: false,
      isRandom: false,  // 是否随机生成
      selectedRowKeys: [],
      randomNum: -1,  // 设置的随机试题数
      selectedRowsMap: objToStrMap(selectedRowCloneObj),
      curSelectedRowsMap: new Map([]),
      indeterminate: false,
      checkAll: false,
      isShowPopoverMap: new Map([]),
      customTagList: [],  // 试题分组
    };
  }
  load = (query) => {
    this.setState({ loading: true, isRandom: false });
    let filter = this.state.filter;
    filter = Object.assign({}, filter, query);

    Service.getExerciseList(filter).then(data => {
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
    })
  }
  loadRandom = (query) => {
    this.setState({ loading: true });
    Service.getRandomExerciseLis({ ...this.state.filter, ...query }).then(data => {
      this.setState({ loading: false });
      if (!data.success) {
        message.error(data.errMsg);
        return;
      }
      this.setState({
        dataSource: {
          tableList: data.data,
          pagination: {
            total: data.data.length,
            current: 1,
          }
        }
      })
    })
  }
  componentDidMount() {
    CommonService.getTagDict({ type: 'CUSTOMTAG', hospitalId }).then(data => {
      if (!data.success) {
        message.error(data.errMsg);
        return;
      }
      const customTagList = JSON.parse(JSON.stringify(data.data).replace(/name":/g, 'label":').replace(/code":/g, 'value":'));
      this.setState({ customTagList });
    });
    let hadSelectIds = null;  // 剔除已经选过的
    if (this.props.selectedRowsMap && this.props.selectedRowsMap.size > 0) {
      hadSelectIds = [...this.props.selectedRowsMap.keys()].join(',');
    }
    this.load({ type: this.props.curQuestionType, hadSelectIds });
  }
  onDataChange = (date, dateString) => {
    this.load({ pageNum: 1, startTime: `${dateString[0]} 00:00:00`, endTime: `${dateString[1]} 23:59:59` });
  }
  randomNumChange = (value) => {
    if (!value) {
      this.setState({ randomNum: null });
      this.load({ pageNum: 1, });
      return;
    }
    if (!/^\d+(\d)?$/.test(value) || isNaN(value) || value > 100) {
      // message.error('考试分数值只能为 0-100 之间的整数');
      this.setState({ randomNum: null });
    } else {
      this.setState({ randomNum: value });
    }
  }
  exerciseRandomHandle() {
    const { randomNum } = this.state;
    if (!randomNum || randomNum < 0) {
      this.setState({ randomNum: null });
      return;
    }
    this.setState({ isRandom: true }, () => {
      this.loadRandom({ pageSize: randomNum });
    });
  }
  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  }
  onSelect = (record, selected) => {
    const { selectedRowsMap, curSelectedRowsMap } = this.state;
    let param = {
      type: record.type,
      name: record.name,
      answer: record.answer,
      explainStr: record.explainStr,
      id: record.id,  // 3.3.5
      difficulty: record.difficulty,
      level: record.levelName ? record.levelName : record.level,
      exerciseItemDOList: record.exerciseItemDOList,
      exerciseClassifyCode: record.exerciseClassifyCode,
      exerciseClassifyName: record.exerciseClassifyName,
      templateExerciseId: record.templateExerciseId ? record.templateExerciseId : record.id,
      answerMatchType: record.answerMatchType,  // 选择填空题时需要
      publicFlag: this.state.filter.hospitalId == 0 ? 1 : 0,  // 区分是公共试题还是本院试题(1: 公共 0： 本院)
      childList: record.childList,  // 共用题干题下的子题目
      imageUrl: record.imageUrl,
    };
    if (this.state.filter.hospitalId == 0) {
      const levelCode = getSelectedCode(record.levelCode);
      const level = getLabelArraysByValue(levelCode, this.props.filter.publicLevelList);
      const levelName = JSON.parse(JSON.stringify(level).replace(/-/g, ','));
      param.level = levelName.join(',');
    }

    if (selected) {
      selectedRowsMap.set(record.id, param);
      curSelectedRowsMap.set(record.id, param);
    } else {
      selectedRowsMap.delete(record.id);
      curSelectedRowsMap.delete(record.id);
    }
    this.setState({ selectedRowsMap, curSelectedRowsMap });
  }
  onSelectAll = (selected, selectedRows, changeRows) => {
    const { selectedRowsMap, curSelectedRowsMap } = this.state;
    if (selected) {
      for (const record of changeRows) {
        let param = {
          type: record.type,
          name: record.name,
          answer: record.answer,
          explainStr: record.explainStr,
          id: record.id,  // 3.3.5
          difficulty: record.difficulty,
          level: record.levelName ? record.levelName : record.level,
          exerciseItemDOList: record.exerciseItemDOList,
          exerciseClassifyCode: record.exerciseClassifyCode,
          exerciseClassifyName: record.exerciseClassifyName,
          templateExerciseId: record.templateExerciseId ? record.templateExerciseId : record.id,
          answerMatchType: record.answerMatchType,  // 选择填空题时需要
          publicFlag: this.state.filter.hospitalId == 0 ? 1 : 0,  // 区分是公共试题还是本院试题(1: 公共 0： 本院)
          childList: record.childList,  // 共用题干题下的子题目
          imageUrl: record.imageUrl,
        };
        if (this.state.filter.hospitalId == 0) {
          const levelCode = getSelectedCode(record.levelCode);
          const level = getLabelArraysByValue(levelCode, this.props.filter.publicLevelList);
          const levelName = JSON.parse(JSON.stringify(level).replace(/-/g, ','));
          param.level = levelName.join(',');
        }
        selectedRowsMap.set(record.id, param);
        curSelectedRowsMap.set(record.id, param);
      }
    } else {
      for (const record of changeRows) {
        selectedRowsMap.delete(record.id);
        curSelectedRowsMap.delete(record.id);
      }
    }
    this.setState({ selectedRowsMap, curSelectedRowsMap });
  }
  removeSelectedFile = (id) => {
    const { curSelectedRowsMap, selectedRowsMap, dataSource } = this.state;
    curSelectedRowsMap.delete(id);
    selectedRowsMap.delete(id);
    this.setState({
      selectedRowKeys: [...curSelectedRowsMap.keys()],
      curSelectedRowsMap,
      selectedRowsMap,
    }, () => {
      this.setState({
        indeterminate: !!dataSource.tableList.length && (curSelectedRowsMap.size < dataSource.tableList.length),
        checkAll: dataSource.tableList.length === curSelectedRowsMap.size,
      });
    });
  }
  disabledDate = (current) => {
    return current && current.valueOf() > Date.now();
  }
  handleOk() {
    const { selectedRowsMap, curSelectedRowsMap } = this.state;
    this.props.selectedOk(selectedRowsMap, curSelectedRowsMap);
  }
  hospitalChange = (value) => {
    this.setState({
      filter: {
        hospitalId: value,
        type: this.props.curQuestionType,
        hadSelectIds: this.state.filter.hadSelectIds
      }
    }, () => {
      this.load({ hospitalId: value, pageNum: 1, privateFlag: null })
    })
  }
  render() {
    const { curSelectedRowsMap, selectedRowKeys = [], randomNum, dataSource, filter, isRandom } = this.state;
    const { questionTotalNum } = this.props;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      onSelect: this.onSelect,
      onSelectAll: this.onSelectAll,
    };
    const hasSelected = [...curSelectedRowsMap.values()].length > 0;
    const selectedRowsArr = [...curSelectedRowsMap.values()];
    this.mutilLineEllipsis = [];
    const selectedRowsList = selectedRowsArr.map((file) => {
      return (
        <li key={file.templateExerciseId} className={styles.selectedItem}><span title={file.name} className={styles.selectedTitle}>{file.name}</span><a className={styles.selectedIcon} onClick={() => this.removeSelectedFile(file.templateExerciseId)}><Icon type="close" /></a></li>
      );
    });
    const questionsTableProps = {
      isPublicHospital: filter.hospitalId == 0,  // 公共医院
      table: {
        loading: this.state.loading,
        dataSource: dataSource.tableList,
        rowSelection,
        scroll: dataSource.tableList ? dataSource.tableList.length > 10 ? { y: 450 } : {} : {},
        className: 'table-questions-list choose-questions-table'
      }
    };
    const allQuestionTotalMax = (questionTotalNum + ([...curSelectedRowsMap.values()].length)) > 500;
    const customTagItem = this.state.customTagList.map(item => <Option value={item.value} key={item.value}>{item.label}</Option>);
    const pagination = {
      ...dataSource.pagination,
      onChange: (pageNum) => {
        this.load({ pageNum })
      },
      onShowSizeChange: (pageNum, pageSize) => {
        this.load({ pageNum, pageSize });
      }
    }
    return (
      <div>
        <Modal {...this.modalProps}>
          <Tabs
            //onChange={value => this.load({ hospitalId: value, pageNum: 1, privateFlag: null })}
            onChange={this.hospitalChange}
            activeKey={filter.hospitalId || `${hospitalId}`}
          >
            <TabPane tab="本院" key={hospitalId} />
            <TabPane tab={<div>公共<em className={styles.tipsNew}>new</em> </div>} key="0" />
          </Tabs>
          {
            filter.hospitalId == 0 ?
              <Alert style={{ marginBottom: 15 }} message="由于试题均选自市面书籍，虽然已经经过人工审核，试题库中仍难免存在疏漏和不足之处，恳请广大医院和考生批评指正。" type="warning" showIcon /> : ''
          }
          <div className={styles.searchbarRows}>
            {/* 部署版 移除试题分组功能
              filter.hospitalId != 0 ?
                <span>
                  试题分组&nbsp;
                  <Select
                    onChange={value => this.load({ customTag: value, pageNum: 1 })}
                    getPopupContainer={trigger => trigger.parentNode}
                    placeholder="请选择"
                    style={{ width: 200, marginRight: 20 }}
                  >
                    <Option value=" ">请选择</Option>
                    {customTagItem}
                  </Select>
                </span> : ''
            */}
            <Search
              placeholder="请输入试题标题查找"
              style={{ width: 200, marginRight: 20 }}
              onSearch={name => this.load({ name, pageNum: 1 })}
            />
            更新时间<RangePicker
              onChange={this.onDataChange}
              disabledDate={this.disabledDate}
              style={{ width: 210, marginLeft: 5, verticalAlign: 'middle' }}
            />
            {
              filter.hospitalId !== '0' ?
                <Checkbox
                  style={{ marginLeft: 20 }}
                  onChange={e => {
                    const privateFlag = e.target.checked ? 1 : 0;
                    this.load({ privateFlag, pageNum: 1 })
                  }}
                  checked={filter.privateFlag && filter.privateFlag == 1}
                >我的私密试题</Checkbox> : ''
            }
            {
              filter.hospitalId !== '0' ?
                <Checkbox
                  style={{ marginRight: 20 }}
                  onChange={e => {
                    const accountId = e.target.checked ? userId : -1;
                    this.load({ accountId, pageNum: 1 })
                  }}
                  checked={filter.accountId && filter.accountId != -1}
                >我的试题</Checkbox> : ''
            }
          </div>
          <div style={{ padding: '0 20px' }}>
            <QuestionsFilter page="chooseQuestions" key={filter.hospitalId} onChange={(query) => this.load({ ...query, pageNum: 1 })} showType={filter.hospitalId} />
          </div>
          <div style={{ height: 10, backgroundColor: '#F3F8FC' }} />
          <div style={{ padding: '0 20px' }}>
            <div className={styles.searchResult}>
              <span>
                共查询到<b className="search-result-num">{dataSource.pagination.total}</b>个试题，如果没有合适的，您可以进入试题库
                <Link
                  target="_blank"
                  to={{
                    pathname: '/hospital-admin/nurse-training-exam/questions-manage/create-question.html',
                  }}
                >创建试题</Link>。
              </span>
              <a onClick={() => this.load({})}>刷新</a>
              <div className={styles.randomNumberRow}>
                从符合条件的题目中选取
                <span className={!randomNum ? 'has-error' : ''}>
                  <Tooltip trigger={['focus']} title="只能为 1-100 之间的整数">
                    <InputNumber
                      style={{ width: 60, margin: '0 5px' }}
                      onChange={this.randomNumChange}
                    />
                  </Tooltip>
                </span>
                道
                <Button
                  size="small"
                  className={styles.buttonGreen}
                  onClick={() => this.exerciseRandomHandle()}
                  disabled={dataSource.pagination.total < randomNum}
                >随机生成</Button>
              </div>
            </div>
            <div>
              <QuestionsTable {...questionsTableProps} />
              <div className={styles.chooseResult}>
                {hasSelected ? <span className={styles.readySelected}>已选择:
                  <Popover placement="topLeft" content={<ul>{selectedRowsList}</ul>} overlayClassName={styles.selectedList} arrowPointAtCenter>
                    <span>{[...curSelectedRowsMap.values()].length}</span>
                  </Popover>
                </span> : ''}
                {isRandom ? '' :
                  <Pagination
                    className="ant-table-pagination"
                    style={{ margin: 0 }}
                    showSizeChanger
                    pageSizeOptions={PAGE_SIZE_OPTIONS}
                    {...pagination}
                  />
                }
              </div>
              <div className={styles.modalButtoRow}>
                <Tooltip title={allQuestionTotalMax ? '最多添加500道试题，请删除部分后再添加' : ''}>
                  <Button disabled={!hasSelected || allQuestionTotalMax} type="primary" style={{ width: 160, height: 40 }} onClick={() => this.handleOk()}>选择完成</Button>
                </Tooltip>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

function select(state) {
  return {
    filter: state.filter,
  };
}

export default connect(select, null)(ChooseQuestionsModal);
