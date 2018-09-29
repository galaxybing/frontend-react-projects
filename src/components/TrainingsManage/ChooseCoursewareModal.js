import React, { Component } from 'react';
import { Modal, Button, Table, Pagination, Tabs, Input, Icon, message, Popover } from 'antd';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from '../../constants';
import { getCache } from '../../core/_utils/storage';
import styles from './Course.css';

import Filtrate from '../Widgets/Filtrate';

const Search = Input.Search;
const TabPane = Tabs.TabPane;

class ChooseCoursewareModal extends Component {
  constructor(props) {
    super(props);
    const { visible, onCancel, selectedCoursewareMap, coursewareQuery } = this.props;

    const selectedCoursewareObj = this.strMapToObj(selectedCoursewareMap);
    const selectedCoursewareCloneObj = Object.assign({}, selectedCoursewareObj);
    this.modalProps = {
      visible,
      title: '选择课件',
      width: '70%',
      footer: null,
      onCancel,
    };
    this.state = {
      selectedRowKeys: [...selectedCoursewareMap.keys()].map(s => +s),
      coursewareVisible: false,
      selectedCoursewareMap: this.objToStrMap(selectedCoursewareCloneObj),
      curSelectedRowsMap: new Map([])
    };
  }
  strMapToObj(strMap) {   // 把map转换成obj
    const obj = Object.create(null);
    for (const [k, v] of strMap) {
      obj[k] = v;
    }
    return obj;
  }
  objToStrMap(obj) {
    const strMap = new Map();
    for (const k of Object.keys(obj)) {
      strMap.set(parseInt(k, 10), obj[k]); // galaxyw - 修复 添加课件时 与编辑的原有课件重复情况下 去重问题；
    }
    return strMap;
  }
  openCreateCoureaware() {
    this.setState({ coursewareVisible: true });
  }
  hideCreateCourseware() {
    this.setState({ coursewareVisible: false });
  }
  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys, selectedRows });
  }
  onSelect = (record, selected) => {
    const { selectedCoursewareMap, curSelectedRowsMap } = this.state;
    const param = {
      type: record.type,
      fileType: record.fileType,
      url: record.url,
      fileName: record.fileName,
      transcodingId: record.type === 1 ? record.transcodingId : '',
      returnUrl: record.type === 1 ? record.returnUrl : '',
      templateResourceId: record.templateResourceId ? record.templateResourceId : record.id,
      // id: record.templateResourceId ? record.templateResourceId : record.id,
      hashCode: record.hashCode,
      size: record.size,
      courseClassifyCode: record.courseClassifyCode,
      trainClassifyCode: record.trainingClassification,
      courseClassifyName: record.courseClassifyName,
      trainClassifyName: record.trainClassifyName,
      pdfUrl: record.pdfUrl,
      taskId: record.taskId,
      hospitalId: record.hospitalId,  // 用来判断是否是公共医院的
      
      privateFlag: record.privateFlag,
      needWatchTime: record.needWatchTime,
      downloadFlag: record.downloadFlag,
    };
    if (selected) {
      selectedCoursewareMap.set(record.id, param);
      curSelectedRowsMap.set(record.id, param);
    } else {
      selectedCoursewareMap.delete(record.id);
      curSelectedRowsMap.delete(record.id);
    }
    this.setState({ selectedCoursewareMap, curSelectedRowsMap });
  }
  onSelectAll = (selected, selectedRows, changeRows) => {
    const { selectedCoursewareMap, curSelectedRowsMap } = this.state;
    if (selected) {
      for (const record of changeRows) {
        const param = {
          type: record.type,
          fileType: record.fileType,
          url: record.url,
          fileName: record.fileName,
          transcodingId: record.type === 1 ? record.transcodingId : '',
          returnUrl: record.type === 1 ? record.returnUrl : '',
          templateResourceId: record.templateResourceId ? record.templateResourceId : record.id,
          // id: record.templateResourceId ? record.templateResourceId : record.id,
          hashCode: record.hashCode,
          size: record.size,
          courseClassifyCode: record.courseClassifyCode,
          trainClassifyCode: record.trainingClassification,
          courseClassifyName: record.courseClassifyName,
          trainClassifyName: record.trainClassifyName,
          pdfUrl: record.pdfUrl,
          taskId: record.taskId,
          hospitalId: record.hospitalId,  // 用来判断是否是公共医院的
          
          privateFlag: record.privateFlag,
          needWatchTime: record.needWatchTime,
          downloadFlag: record.downloadFlag,
        };
        selectedCoursewareMap.set(record.id, param);
        curSelectedRowsMap.set(record.id, param);
      }
    } else {
      for (const record of changeRows) {
        selectedCoursewareMap.delete(record.id);
        curSelectedRowsMap.delete(record.id);
      }
    }
    
    this.setState({ selectedCoursewareMap, curSelectedRowsMap });
  }
  removeSelectedFile(id) {
    const { selectedCoursewareMap, curSelectedRowsMap } = this.state;
    selectedCoursewareMap.delete(id);
    curSelectedRowsMap.delete(id);
    this.setState({
      selectedRowKeys: [...selectedCoursewareMap.keys()],
      selectedCoursewareMap,
      curSelectedRowsMap
    });
  }
  handleOk() {
    const { selectedCoursewareMap, curSelectedRowsMap } = this.state;
    this.props.saveFileListForChoose(selectedCoursewareMap, curSelectedRowsMap);
    message.success('添加成功');
  }
  searchHandle(value) {
    this.props.fetchCoursewareList({ ...this.props.coursewareQuery, page: 1, name: value });
  }
  onChange(page) {
    this.props.fetchCoursewareList({ ...this.props.coursewareQuery, page });
  }
  onShowSizeChange(current, pageSize) {
    this.props.fetchCoursewareList({ ...this.props.coursewareQuery, page: current, pageSize });
  }
  render() {
    const { selectedRowKeys, selectedCoursewareMap } = this.state;
    const { coursewareList, coursewareQuery } = this.props;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      onSelect: this.onSelect,
      onSelectAll: this.onSelectAll,
    };
    const hasSelected = selectedRowKeys.length > 0;
    const selectedCoursewareList = [...selectedCoursewareMap.values()];
    const selectedRowsList = selectedCoursewareList.map((file, index) => {
      return (
        <li key={index} className={styles.selectedItem}><span title={file.fileName} className={styles.selectedTitle}>{file.fileName}</span><a className={styles.selectedIcon} onClick={() => this.removeSelectedFile(file.templateResourceId)}><Icon type="close" /></a></li>
      );
    });

    const warning = () => {
      message.warning('正在转码中，请稍后');
    };
    const error = () => {
      message.error('转码失败，请检查视频后重新上传');
    };
    const previewUrl = getCache('previewUrl');
    const previewCourseware = (url, type) => {
      window.open(`${previewUrl}?arg=${encodeURIComponent(url)}&type=${type}`);
    };
    const columns = [
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
        width: '10%',
      },
      {
        title: '课程分类',
        dataIndex: 'courseClassifyName',
        key: 'courseClassifyName',
        width: '15%',
      },
      {
        title: '培训分类',
        dataIndex: 'trainClassifyName',
        key: 'trainClassifyName',
        width: '15%',
      },
      {
        title: '来源',
        dataIndex: 'createByName',
        key: 'createByName',
        width: '15%',
        // render: (text, record) => {
        //   if (text) {
        //     return (<span>{record.deptName && `${record.deptName}-`}{text}</span>)
        //   } else {
        //     return (<span>{record.deptName}</span>)
        //   }
        // }
      },
      {
        title: '更新时间',
        dataIndex: 'updateTime',
        key: 'updateTime'
      }
    ];

    return (
      <div>
        <Modal {...this.modalProps} visible={this.props.visible}>
          <div style={{ padding: '20px 20px 0 20px' }}>
            <Filtrate {...this.props.coursewareFiltrateProps} />
          </div>
          <div style={{ height: 10, backgroundColor: '#F3F8FC' }}></div>
          <div style={{ padding: '0 20px' }}>
            <div style={{ padding: '16px 0' }}>
              <Search
                placeholder="请输入课件名称查找"
                style={{ width: 240 }}
                onSearch={value => this.searchHandle(value)}
              />
              <span style={{ marginLeft: 10 }}>
                共有<span className="search-result-num">{coursewareList ? coursewareList.totalCount : 0}</span>个搜索结果
              </span>
            </div>
            <div>
              <Table
                rowSelection={rowSelection}
                columns={columns}
                dataSource={coursewareList ? coursewareList.result : []}
                loading={this.props.loading}
                rowKey={record => record.id}
                pagination={false}
                // bordered
                scroll={coursewareList && coursewareList.result.length > 10 ? { y: 450 } : {}}
              //className={styles.commontable}
              />
              <div className={styles.chooseResult}>
                {hasSelected ?
                  <span className={styles.readySelected}>
                    已选择:
                    <Popover placement="topLeft" content={<ul>{selectedRowsList}</ul>} overlayClassName={styles.selectedList} arrowPointAtCenter>
                      <span>{selectedRowKeys.length}</span>
                    </Popover>
                  </span> : ''}
                <Pagination
                  className={styles.chooseCoursewarePage}
                  total={coursewareList ? coursewareList.totalCount : 0}
                  current={coursewareList ? coursewareList.pageNumber : 1}
                  //pageSize={PAGE_SIZE}
                  onChange={page => this.onChange(page)}
                  showSizeChanger
                  pageSizeOptions={PAGE_SIZE_OPTIONS}
                  onShowSizeChange={(current, pageSize) => this.onShowSizeChange(current, pageSize)}
                />
              </div>
              <div className={styles.modalButtoRow}>
                {hasSelected ? <Button type="primary" style={{ width: 160, height: 40 }} onClick={() => this.handleOk()}>选择完成</Button> :
                  <Button disabled style={{ width: 160, height: 40 }}>选择完成</Button>
                }
              </div>
            </div>
          </div>
          {/*<div className={styles.modalFootRow}>
            <span>如果未查询到相关课件，请</span>
            <Button className={styles.buttonGreen} onClick={() => this.openCreateCoureaware()}>上传课件</Button>
          </div>*/}
        </Modal>
      </div>
    );
  }
};

export default ChooseCoursewareModal;
