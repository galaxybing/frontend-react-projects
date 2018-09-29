import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Select } from 'antd';
import styles from './style.css';

const formatOption = (option, disabledOptions) => {
  let value = `${option}`;
  if (option < 10) {
    value = `0${option}`;
  }
  let disabled = false;
  if (disabledOptions && disabledOptions.indexOf(option) >= 0) {
    disabled = true;
  }
  return {
    value,
    disabled,
  };
};

const formatTimeValue = (option) => {
  let value = `${option}`;
  if (value < 10) {
    value = `0${option}`;
  }
  return value
}

class Combobox extends Component {

  onItemChange = (itemValue, type) => {
    const { onChange, defaultOpenValue } = this.props;
    const value = (this.props.value || defaultOpenValue).clone();
    if (type === 'hour') {
      value.hour(+itemValue);
    } else if (type === 'minute') {
      value.minute(+itemValue);
    } else {
      value.second(+itemValue);
    }
    onChange(value);
  }

  getHourSelect(hour) {
    const value = this.props.value;
    const { hourOptions, disabledHours, showHour, use12Hours, disabledSelect } = this.props;
    if (!showHour) {
      return null;
    }
    const disabledOptions = disabledHours();

    const hourOptionsObj = hourOptions.map(option => formatOption(option, disabledOptions));

    return (
      <Select
        showSearch
        style={{ width: 50 }}
        optionFilterProp="children"
        getPopupContainer={this.getPopupContainer}
        className="time-picker-select"
        dropdownClassName="time-picker-select-dropdown"
        onChange={value => this.onItemChange(value, "hour")}
        defaultValue={`${formatTimeValue(hour)}`}
        disabled={disabledSelect}
      >
      {
        hourOptionsObj.map((item, index) => <Select.Option disabled={item.disabled} value={item.value} key={item.value}>{item.value}</Select.Option>)
      }
      </Select>
    );
  }

  getMinuteSelect(minute) {
    const { minuteOptions, disabledMinutes, defaultOpenValue, showMinute, disabledSelect } = this.props;
    if (!showMinute) {
      return null;
    }
    const value = this.props.value || defaultOpenValue;
    const disabledOptions = disabledMinutes(value.hour());
    const minuteOptionsObj = minuteOptions.map(option => formatOption(option, disabledOptions));
    return (
      <Select
        showSearch
        style={{ width: 50 }}
        optionFilterProp="children"
        getPopupContainer={this.getPopupContainer}
        className="time-picker-select"
        dropdownClassName="time-picker-select-dropdown"
        onChange={value => this.onItemChange(value, "minute")}
        defaultValue={`${formatTimeValue(minute)}`}
        disabled={disabledSelect}
      >
      {
        minuteOptionsObj.map((item, index) => <Select.Option disabled={item.disabled} value={item.value} key={item.value}>{item.value}</Select.Option>)
      }
      </Select>
    );
  }

  getSecondSelect(second) {
    const { disabledSelect, secondOptions, disabledSeconds, showSecond, defaultOpenValue } = this.props;
    if (!showSecond) {
      return null;
    }
    const value = this.props.value || defaultOpenValue;
    const disabledOptions = disabledSeconds(value.hour(), value.minute());
    const secondOptionsObj = secondOptions.map(option => formatOption(option, disabledOptions));
    return (
      <Select
        showSearch
        style={{ width: 50 }}
        optionFilterProp="children"
        getPopupContainer={this.getPopupContainer}
        className="time-picker-select"
        dropdownClassName="time-picker-select-dropdown"
        onChange={value => this.onItemChange(value, "second")}
        defaultValue={`${formatTimeValue(second)}`}
        disabled={disabledSelect}
      >
      {
        secondOptionsObj.map((item, index) => <Select.Option disabled={item.disabled} value={item.value} key={item.value}>{item.value}</Select.Option>)
      }
      </Select>
    );
  }

  getPopupContainer(trigger) {  // 把下拉框定位到日期选择框内部
    return trigger.parentNode;
  }

  render() {
    const value = this.props.value;
    const { showHour, showMinute, showSecond } = this.props;
    return (
      <div className="sherry-combobox">
        {this.getHourSelect(value.hour())}
        {
          showMinute? <span className={styles.colon}>:</span>: ''
        }
        {this.getMinuteSelect(value.minute())}
        {
          showSecond? <span className={styles.colon}>:</span>: ''
        }
        {this.getSecondSelect(value.second())}
      </div>
    );
  }
}

export default Combobox;
