import React, { Component } from 'react';
import { Input, Popover, Checkbox, Row, Col, Tag } from 'antd';
import styles from './style.css';


class SelectMultipleDept extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [], // 数据源
      dataSource_copy: [],   // 数据源copy
      searchValue: null,
      checkedValues: [],
      checkedValuesStr: [],
      notFoundContent: '没有相关数据',  // 当下拉列表为空时显示的内容
      open: false,
    };
    // console.log(defaultCheckedValue)
  }
  componentWillReceiveProps(nextProps) {
    // 实现数组的深拷贝
    // const [...dataList] = nextProps.dataSource;
    // const [...defaultCheckedValue] = this.props.value;
    const checkedValuesStr = [];
    for (const key of nextProps.value) {
      for (const item of nextProps.dataSource) {
        if (item.value === key) {
          checkedValuesStr[checkedValuesStr.length] = {
            value: item.value,
            label: item.label
          };
          break;
        }
      }
    }
    this.setState({
      dataSource: nextProps.dataSource,
      checkedValues: nextProps.value,
      checkedValuesStr
    });
  }
  componentDidUpdate() {
    const inputNode = this.textInput.refs.input;
    const mirrorNode = this.inputMirrorRef;
    if (inputNode.value) {
      inputNode.style.width = '';
      inputNode.style.width = `${mirrorNode.clientWidth}px`;
    } else {
      inputNode.style.width = '';
    }
  }
  onSearchValueChange = (e) => {
    const value = e.target.value;
    let searchOptions;
    if (value) {
      searchOptions = this.props.dataSource.filter(item => item.label.indexOf(value) !== -1);
    }
    this.setState({
      searchValue: value,
      dataSource: value ? searchOptions : this.props.dataSource
    });
  }
  onSelectValueChange = (checkedValues) => {
    const checkedValuesStr = [];
    for (const key of checkedValues) {
      for (const item of this.props.dataSource) {
        if (item.value === key) {
          checkedValuesStr[checkedValuesStr.length] = {
            value: item.value,
            label: item.label
          };
          break;
        }
      }
    }
    this.setState({
      checkedValues,
      checkedValuesStr
    }, () => {
      this.textInput.focus();
      this.setState({
        dataSource: this.props.dataSource
      });
      this.props.onChange(checkedValues, checkedValuesStr);
    });
  }
  delSelectValue = (index) => {
    const checkedValues = this.state.checkedValues.filter(item => item !== index);
    const checkedValuesStr = this.state.checkedValuesStr.filter(item => item.value !== index);
    this.setState({
      checkedValues,
      checkedValuesStr,
      // selectedUserListOther
      // popVisible: true
    }, () => {
      this.textInput.focus();
      this.props.onChange(checkedValues, checkedValuesStr);
    });
  }
  onOuterBlur = (e) => {
    if (this.props.disabled) {
      e.preventDefault();
      return;
    }
    if (this.state.searchValue) {
      // this.state.searchValue = this.textInput.refs.input.value = '';
      this.setState({
        searchValue: ''
      });
    }
  };
  onTagClick = () => {
    this.delTagClick = true;
  }
  handleVisibleChange = (visible) => {
    if (!visible) {
      this.textInput.blur();
    } else {
      this.setState({
        dataSource: this.props.dataSource
      });
    }
    if (!this.delTagClick) {
      this.setState({ open: visible });
    } else if (this.delTagClick && !this.state.open) {
      this.setState({ open: true });
    }
    this.delTagClick = false;
  }
  render() {
    const { searchValue, dataSource, checkedValues, checkedValuesStr } = this.state;
    const multipleItem = dataSource.map((item, index) => {
      return (
        <Col span={6} title={item.label} key={index} className={styles.optionItem}>
          <Checkbox value={item.value}>{item.label}</Checkbox>
        </Col>
      );
    });
    const tagItem = checkedValuesStr.map((item) => {
      return (
        <li key={item.value}>
          <Tag
            onClick={this.onTagClick}
            closable
            afterClose={() => this.delSelectValue(item.value)}
          >
            {item.label}
          </Tag>
        </li>
      );
    });
    const selectMultiple = (
      <div className={styles.selectOptionCont}>
        {dataSource.length ?
          <Checkbox.Group value={checkedValues} onChange={this.onSelectValueChange}>
            <Row>
              {multipleItem}
            </Row>
          </Checkbox.Group> :
          <div className={styles.dropdownMenuDisable}>{this.state.notFoundContent}</div>
        }
      </div>
    );
    const showPlaceholde = checkedValuesStr.length || searchValue;
    return (
      <Popover
        content={selectMultiple}
        trigger="click"
        visible={this.state.open}
        onVisibleChange={this.handleVisibleChange}
        placement="bottomLeft"
        overlayClassName="select-multiple"
        getPopupContainer={trigger => trigger.parentNode}
      >
        <div
          className={styles.selectMultiple}
          onClick={() => {
            this.textInput.focus();
          }}
          onBlur={this.onOuterBlur}
          style={this.props.style}
        >
          <div className={styles.selectMultipleCont}>
            <div className={styles.selectPlaceholde} style={{ display: showPlaceholde ? 'none' : 'block' }}>搜索科室</div>
            <ul style={{ overflow: 'hidden' }}>
              {tagItem}
              <li className={styles.selectSearch}>
                <Input
                  // autocomplete="off"
                  className={`${styles.selectSearchInput} ant-input-clear-style`}
                  onChange={this.onSearchValueChange}
                  value={searchValue}
                  ref={input => this.textInput = input}
                />
                <span
                  className={styles.selectSearchField}
                  ref={input => this.inputMirrorRef = input}
                >
                  {searchValue}&nbsp;
                </span>
              </li>
            </ul>
          </div>
        </div>
      </Popover>
    );
  }
}

export default SelectMultipleDept;
