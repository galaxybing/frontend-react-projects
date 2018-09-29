import React, { Component } from 'react';
import moment from 'moment';
import { DatePicker, Button } from 'antd';
import TimePickerComponent from '../TimePicker';
import { syncTime, rangeTime } from '../../../core/_utils/common';
import styles from './style.css';

export default class DatePickerComponent extends Component {
  constructor(props) {
    super(props);
    const { value } = props;
    this.state = {
      datePickerOpen: false,
      value: value || null,
    };
  }
  componentWillReceiveProps(nextProps) {
    const { value } = nextProps;
    if ('value' in nextProps) {
      this.setState({
        value,
      });
    }
  }
  onOpenChange = (status) => {
    this.setState({ datePickerOpen: status });
  }
  getCalendarContainer = (trigger) => {
    return trigger.parentNode;
  }
  onDateValueChange = (date, dateString) => {
    const { showTime } = this.props;
    if (showTime && showTime.defaultValue) {
      if (!this.state.value && date) {
        syncTime(showTime.defaultValue, date);
      }
    }
    this.setState({ value: date }, () => {
      this.props.onChange(this.state.value);
    });
  }
  onTimeValueChange = (value) => {
    const dateValue = this.state.value;
    if (dateValue) {
      syncTime(value, dateValue);
      this.setState({
        value: dateValue
      }, () => {
        this.props.onChange(this.state.value);
      });
    }
  }
  // 当前时间disable
  disabledDateNow = (time) => {
    if (!time) return;
    const now = new Date();
    let disabledTime;
    const format = 'YYYY-MM-DD';
    // 选择时间跟当前时间一致
    if (moment(time).format(format) === moment(now).format(format)) {
      // console.log('选择时间跟当前时间一致');
      disabledTime = now;
      if (moment(time).format('HH') > moment(disabledTime).format('HH')) {
        return {
          disabledHours: () => rangeTime(0, 24).splice(0, moment(disabledTime).format('HH'))
        };
      }
      return {
        disabledHours: () => rangeTime(0, 24).splice(0, moment(disabledTime).format('HH')),
        disabledMinutes: () => rangeTime(0, 60).splice(0, moment(disabledTime).format('mm')),
      };
    } else {
      return {};
    }
  }
  disabledTimeDefault(time) {
    if (!time) return;
    if (this.props.disabledDateTimeNow) {
      return this.disabledDateNow(time);
    } else if (!this.props.disabledTime) {  // 不做限制
      return {};
    } else {
      return this.props.disabledTime(time);
    }
  }
  render() {
    const { showTime = {}, disabledDate, format = 'YYYY-MM-DD', placeholder } = this.props;
    const { value, datePickerOpen } = this.state;
    const timeDefaultValue = showTime.defaultValue ? showTime.defaultValue : null;

    const disabledTimeDefault = this.disabledTimeDefault(value);

    const renderExtraFooter = (
      <div className={styles.renderExtraFooter}>
        <div className={styles.timePickerBox}>
          <div className={styles.timePicker}>
            <TimePickerComponent
              {...disabledTimeDefault}
              defaultValue={timeDefaultValue}
              onChange={this.onTimeValueChange}
              format={showTime.format}
              disabledSelect={!value}
              value={value || null}
            />
          </div>
          <div className={styles.footerBtn}>
            <Button type="primary" onClick={() => this.setState({ datePickerOpen: false })}>确定</Button>
          </div>
        </div>
      </div>
    );
    return (
      <DatePicker
        showTime
        format={format}
        disabledDate={disabledDate}
        placeholder={placeholder}
        value={value}
        onChange={this.onDateValueChange}
        className="has-time-picker"
        getCalendarContainer={this.getCalendarContainer}
        renderExtraFooter={() => renderExtraFooter}
        onOpenChange={this.onOpenChange}
        open={datePickerOpen}
      // onOk={onOk}
      />
    );
  }
}
