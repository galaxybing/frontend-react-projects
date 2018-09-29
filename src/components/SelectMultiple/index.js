import React, { Component } from 'react';
import { connect } from 'react-redux';
import { message, Input, Tree, Button, Icon, Popover, Checkbox, Dropdown, Menu, Row, Col } from 'antd';
import styles from './SelectMultiple.css';
import classNames from 'classnames/bind';

let className = classNames.bind(styles);
const Search = Input.Search;
const TreeNode = Tree.TreeNode;
const CheckboxGroup = Checkbox.Group;

class SelectMultiple extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: '',  // 搜索词
      checkedKeys: [], // 选中的key
      dataSource: [], // 数据源
      dataSource_copy: [],   // 数据源copy
      visible: false,   //
      selectedValue: '',   // 选中的value
      isNoData: false,    // 没有数据时显示
      notFoundContent: 'Not Found',
      defaultCheckedList: [],
      checkedList: [],
      indeterminate: false,
      checkAll: false,
      checkConfirm: false,   // 是否点击确定按钮
      idSelectChange: false,  // select是否change
    };
  }
  componentWillReceiveProps(nextProps) {
    this.setState({ dataSource: this.props.dataSource });
    const { defaultCheckedKeys, dataSource, clearAllMultiple } = this.props;
    if (!this.state.checkConfirm && defaultCheckedKeys && defaultCheckedKeys.length) {
      const selectedValues = this.getTitleById(defaultCheckedKeys, dataSource);
      this.setState({
        checkedList: defaultCheckedKeys,
        defaultCheckedList: defaultCheckedKeys,
        selectedValue: selectedValues.join(',')
      });
    }

    if (clearAllMultiple) {
      this.resetState();
    }
  }
  // componentWillMount() {
  //   // const { defaultCheckedKeys, dataSource } = this.props;
  //   // if (defaultCheckedKeys && defaultCheckedKeys.length) {
  //   //   const selectedValues = this.getTitleById(defaultCheckedKeys, dataSource);
  //   //   this.setState({
  //   //     checkedList: defaultCheckedKeys,
  //   //     defaultCheckedList: defaultCheckedKeys,
  //   //     selectedValue: selectedValues.join(',')
  //   //   });
  //   // }
  // }
  resetState = () => {
    this.setState({
      searchValue: '',  // 搜索词
      checkedKeys: [], // 选中的key
      dataSource: [], // 数据源
      dataSource_copy: [],   // 数据源copy
      visible: false,   //
      selectedValue: '',   // 选中的value
      isNoData: false,    // 没有数据时显示
      notFoundContent: 'Not Found',
      defaultCheckedList: [],
      checkedList: [],
      indeterminate: false,
      checkAll: false,
      checkConfirm: false,   // 是否点击确定按钮
      idSelectChange: false,  // select是否change
    });
  }
  onSearchChange = (e) => {
    const value = e.target.value;
    let selectOptions;
    if (value) {
      selectOptions = this.props.dataSource.filter(item => item.label.indexOf(value) !== -1);
    }
    this.setState({
      dataSource: value ? selectOptions : this.props.dataSource,
      searchValue: value,
      isNoData: value && !selectOptions.length ? true : false
    });
  }
  handleVisibleChange = (flag) => {
    if (this.props.disabled) {
      this.setState({ visible: false });
      return;
    }
    this.setState({ visible: flag }, () => {
      this.clearData();
    });
  }
  handleConfirm = () => {
    const selectedValues = [];
    const { checkedList } = this.state;
    for (const key of checkedList) {
      for (const item of this.props.dataSource) {
        if (item.value === key) {
          selectedValues[selectedValues.length] = item.label;
        }
      }
    }
    this.setState({
      selectedValue: this.state.checkAll ? '全部' : selectedValues.join(','),
      visible: false,
      // dataSource_copy: this.props.dataSource,
      checkConfirm: true,
      defaultCheckedList: checkedList
    }, () => {
      this.props.onConfirm(this.state.checkedList, this.state.checkAll);
    });
  }
  onChange = (checkedList) => {
    // const multipleSource = this.state.dataSource.length || this.state.isNoData ? this.state.dataSource : this.props.dataSource;
    const { dataSource } = this.props;
    this.setState({
      checkedList,
      indeterminate: !!checkedList.length && (checkedList.length < dataSource.length),
      checkAll: dataSource.length > 1 ? checkedList.length === dataSource.length : false,
      checkConfirm: false
    });
  }
  onCheckAllChange = (e) => {
    const multipleSource = this.state.dataSource.length || this.state.isNoData ? this.state.dataSource : this.props.dataSource;
    const checkedValue = [];
    for (const item of multipleSource) {
      checkedValue[checkedValue.length] = item.value;
    }
    this.setState({
      checkedList: e.target.checked ? checkedValue : [],
      indeterminate: false,
      checkAll: e.target.checked,
      checkConfirm: false
    });
  }
  clearData = () => {
    const { defaultCheckedList } = this.state;
    const { dataSource } = this.state;
    // const multipleSource = this.state.dataSource.length || this.state.isNoData ? this.state.dataSource : this.props.dataSource;
    // const checkedList = defaultCheckedList.length ? defaultCheckedList : [];
    const indeterminate = defaultCheckedList.length && (defaultCheckedList.length < dataSource.length);
    const checkAll = dataSource.length > 1 ? defaultCheckedList.length === dataSource.length : false;
    if (this.props.clearData) { // 针对科室病区联动
      this.setState({
        checkedList: [],
        indeterminate: false,
        checkAll: false,
        // searchValue: '',
        // isNoData: false
      });
    } else {
      if (!this.state.checkConfirm) {
        this.setState({
          checkedList: defaultCheckedList,
          indeterminate,
          checkAll,
          // searchValue: '',
          // dataSource: this.props.dataSource,
          // isNoData: false
        });
      }
    }
    this.setState({
      searchValue: '',
      dataSource: this.props.dataSource,
      isNoData: false
    });
  }

  getTitleById = (checkedList, dataSource) => {  // 根据id获取当前选中的title
    const selectedValues = [];
    for (const key of checkedList) {
      for (const item of dataSource) {
        if (item.value === key) {
          selectedValues[selectedValues.length] = item.label;
        }
      }
    }
    return selectedValues;
  }

  render() {
    const { searchValue, dataSource, selectedValue, isNoData, checkedList } = this.state;
    // const multipleSource = dataSource.length || isNoData ? dataSource : this.props.dataSource;
    const multipleItem = dataSource.map((item) => {
      return (
        <Col span={24} title={item.label} key={item.value}><Checkbox value={item.value}>{item.label}</Checkbox></Col>
      );
    });
    const selectMultiple = (
      <div className={styles.selectMultiple}>
        {!this.props.isShowLinkage ?
          <div>
            <div className={styles.selectOptions} style={this.props.style ? { width: this.props.style.width } : { width: 160 }}>
              <div className={styles.optionsSearch}>
                <Search
                  size={this.props.searchSize ? this.props.searchSize : 'default'}
                  placeholder={this.props.searchPlaceholder}
                  onChange={this.onSearchChange}
                  value={searchValue}
                />
              </div>
              <div className={styles.treeContent}>
                {isNoData || !dataSource.length ? <span className={styles.noDataSource}>{this.props.notFoundContent ? this.props.notFoundContent : this.state.notFoundContent}</span> : ''}
                {dataSource.length > 1 && (!searchValue) ?
                  <Checkbox
                    indeterminate={this.state.indeterminate}
                    onChange={this.onCheckAllChange}
                    checked={this.state.checkAll}
                  >全部</Checkbox> : ''
                }
                <CheckboxGroup value={checkedList} onChange={this.onChange}>
                  <Row>
                    {multipleItem}
                  </Row>
                </CheckboxGroup>
                {/*<CheckboxGroup options={multipleSource} value={checkedList} onChange={this.onChange} />*/}
              </div>
              <div></div>
              <div className={styles.treeFooter}>
                {checkedList.length ? <span>已选择 <span style={{ color: '#1A92FF' }}>{checkedList.length}</span></span> : ''}
                <Button type="primary" size="small" onClick={this.handleConfirm} style={{ float: 'right' }}>确定</Button>
              </div>
            </div>
          </div> : <div><div className={styles.selectOptions} style={this.props.style ? this.props.style : { width: 160 }}><span style={{ padding: '6px 10px', display: 'block' }}>请先选择科室</span></div></div>
        }
      </div>
    );
    let multipleSelectClass = className({
      'multipleSelect': true,
      'multipleSelectOpen': this.state.visible,
      'multipleSelectDisabled': this.props.disabled,
      'multipleSelectLg': this.props.size === 'large',
      'multipleSelectSm': this.props.size === 'small',
    });
    // this.compareData();
    return (
      <Popover
        content={selectMultiple}
        trigger="click"
        visible={this.state.visible}
        onVisibleChange={this.handleVisibleChange}
        placement="bottomLeft"
        overlayClassName="select-multiple"
        getPopupContainer={trigger => trigger.parentNode}
      >
        <div className={multipleSelectClass} style={this.props.style ? this.props.style : { width: 160 }} onClick={this.handleVisibleChange}>
          <div className={styles.multipleSelectSelection} style={this.props.style ? { width: this.props.style.width, height: this.props.style.height } : { width: 160 }}>
            <div className={styles.multipleSelectSelectionRendered}>
              {/*{this.props.defaultValue ?
                <div className={styles.multipleSelectValue} title={selectedValue ? selectedValue : this.props.defaultValue}>{selectedValue ? selectedValue : this.props.defaultValue}</div> :
                <div className={styles.multipleSelectPlaceholder} title={this.props.placeholder}>{this.props.placeholder}</div>
              }*/}
              <div className={styles.multipleSelectValue}
                title={selectedValue && !this.props.disabled && !this.props.clearData && !this.props.clearAllMultiple ? selectedValue : this.props.defaultValue}
              >
                {selectedValue && !this.props.disabled && !this.props.clearData && !this.props.clearAllMultiple ? selectedValue : this.props.defaultValue}
              </div>
            </div>
            <Icon type="down" className={styles.selectArrow} />
          </div>
        </div>
      </Popover>
    );
  }
}

export default SelectMultiple;
