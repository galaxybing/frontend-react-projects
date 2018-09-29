import React, { Component } from 'react';
import moment from 'moment';
import { DatePicker, Button } from 'antd';
import TimePickerComponent from '../TimePicker';
import { syncTime, rangeTime } from '../../../utils/util';
import styles from './style.css';

const { RangePicker } = DatePicker;
export default class RangePickerComponent extends Component {
  constructor(props) {
    super(props);
    const { value } = this.props;
    this.state = {
      datePickerOpen: false,
      value: value && value.length ? value : [],
    };
  }
  onOpenChange = (status) => {
    this.setState({ datePickerOpen: status });
  }
  getCalendarContainer = (trigger) => {
    return trigger.parentNode;
  }
  onDateValueChange = (dates, dateStrings) => {
    const { showTime } = this.props;
    if (showTime && showTime.defaultValue) {
      const timeDefaultValue = showTime.defaultValue;
      if (!this.state.value[0] && dates[0]) {
        syncTime(timeDefaultValue[0], dates[0]);
      }
      if (!this.state.value[1] && dates[1]) {
        syncTime(timeDefaultValue[1], dates[1]);
      }
    }
    this.setState({ value: dates }, () => {
      this.props.onChange(this.state.value);
    });
  }
  onStartValueChange = (value) => {
    const dateValue = this.state.value;
    if (dateValue && dateValue.length) {
      this.getDateValue(value, dateValue[0], (startValue) => {
        this.setState({
          value: [startValue, dateValue[1]]
        }, () => {
          this.props.onChange(this.state.value);
        });
      });
    }
  }
  onEndValueChange = (value) => {
    const dateValue = this.state.value;
    if (dateValue && dateValue.length) {
      this.getDateValue(value, dateValue[1], (endValue) => {
        this.setState({
          value: [dateValue[0], endValue]
        }, () => {
          this.props.onChange(this.state.value);
        });
      });
    }
  }
  getDateValue = (timeValue, dateValue, callback) => {
    syncTime(timeValue, dateValue);
    callback(dateValue);
  }
  // 当前时间disable
  disabledDateNow = (time, curTime, type) => {  // curTime: startTime  or  endTime
    if (!curTime) return;
    const now = new Date();
    let disabledTime;
    const format = 'YYYY-MM-DD';
    const startDate = moment(time[0]).format(format);
    const endDate = moment(time[1]).format(format);
    const nowDate = moment(now).format(format);
    if (startDate === nowDate && endDate === nowDate) {
      // console.log('开始日期 === 结束日期 === 当前日期');
      let disabledHours,
        disabledMinutes;
      if (type === 'start') {
        disabledTime = now;
        disabledHours = rangeTime(0, 24);
        disabledMinutes = rangeTime(0, 60);
        disabledHours.splice(moment(curTime).format('HH'), moment(time[1]).format('HH') - moment(curTime).format('HH') + 1);
        disabledMinutes.splice(moment(curTime).format('mm'), moment(time[1]).format('mm') - moment(curTime).format('mm') + 1);
      } else {
        disabledTime = time[0];
        disabledHours = rangeTime(0, 24).splice(0, moment(disabledTime).format('HH'));
        disabledMinutes = rangeTime(0, 60).splice(0, parseInt(moment(disabledTime).format('mm')) + 1);
      }
      if (moment(curTime).format('HH') > moment(disabledTime).format('HH')) {
        return {
          disabledHours: () => disabledHours
        };
      }
      return {
        disabledHours: () => disabledHours,
        disabledMinutes: () => disabledMinutes,
      };
    } else if (startDate === nowDate && endDate !== nowDate) {
      // console.log('开始时间 === 当前时间    结束时间 ！== 当前时间');
      if (type === 'start') {
        disabledTime = now;
        const disabledHours = () => rangeTime(0, 24).splice(0, moment(disabledTime).format('HH'));
        const disabledMinutes = () => rangeTime(0, 60).splice(0, moment(disabledTime).format('mm'));
        if (moment(curTime).format('HH') > moment(disabledTime).format('HH')) {
          return {
            disabledHours
          };
        }
        return {
          disabledHours,
          disabledMinutes
        };
      } else {
        return {};
      }
    } else if (startDate === endDate) {
      // console.log('开始时间 === 结束时间    都！==当前时间');
      let currentTime,
        disabledHours,
        disabledMinutes;
      if (type === 'start') {
        disabledTime = time[1];
        currentTime = moment(time[0]).format('HH');
        disabledHours = () => rangeTime(0, 24).splice(parseInt(moment(disabledTime).format('HH')) + 1, 24);
        disabledMinutes = () => rangeTime(0, 60).splice(moment(disabledTime).format('mm'), 60);
      } else {
        disabledTime = time[0];
        currentTime = moment(time[1]).format('HH');
        disabledHours = () => rangeTime(0, 24).splice(0, moment(disabledTime).format('HH'));
        disabledMinutes = () => rangeTime(0, 60).splice(0, parseInt(moment(disabledTime).format('mm')) + 1);
      }
      if (currentTime > moment(disabledTime).format('HH')) {
        return {
          disabledHours
        };
      }
      return {
        disabledHours,
        disabledMinutes,
      };
    }
  }
  disabledStartTime(time) {
    if (!time || !time.length) return;
    if (this.props.disabledDateTimeNow) {
      return this.disabledDateNow(time, time[0], 'start');
    } else if (!this.props.disabledTime) {
      const now = new Date();
      const disabledTime = time[1] || now;
      if (moment(time[0]).format('YYYY-MM-DD') === moment(time[1]).format('YYYY-MM-DD')) {
        if (moment(time[0]).format('HH') > moment(disabledTime).format('HH')) {
          return {
            disabledHours: () => rangeTime(0, 24).splice(parseInt(moment(disabledTime).format('HH')) + 1, 24)
          };
        }
        return {
          disabledHours: () => rangeTime(0, 24).splice(parseInt(moment(disabledTime).format('HH')) + 1, 24),
          disabledMinutes: () => rangeTime(0, 60).splice(moment(disabledTime).format('mm'), 60),
        };
      }
    } else {
      return this.props.disabledTime(time, time[0], 'start');
    }
  }
  disabledEndTime(time) {
    if (!time || !time.length) return;
    if (this.props.disabledDateTimeNow) {
      return this.disabledDateNow(time, time[1], 'end');
    } else if (!this.props.disabledTime) {
      const now = new Date();
      const disabledTime = time[0] || now;
      if (moment(time[0]).format('YYYY-MM-DD') === moment(time[1]).format('YYYY-MM-DD')) {
        if (moment(time[1]).format('HH') > moment(disabledTime).format('HH')) {
          return {
            disabledHours: () => rangeTime(0, 24).splice(0, moment(disabledTime).format('HH'))
          };
        }
        return {
          disabledHours: () => rangeTime(0, 24).splice(0, moment(disabledTime).format('HH')),
          disabledMinutes: () => rangeTime(0, 60).splice(0, parseInt(moment(disabledTime).format('mm')) + 1),
        };
      }
    } else {
      return this.props.disabledTime(time, time[1], 'end');
    }
  }
  render() {
    const { showTime = {}, disabledDate, format = 'YYYY-MM-DD', placeholder } = this.props;
    const { datePickerOpen, value } = this.state;
    const timeDefaultValue = showTime.defaultValue ? showTime.defaultValue : [];

    const disabledStartTime = this.disabledStartTime(value);
    const disabledEndTime = this.disabledEndTime(value);
    const renderExtraFooter = (
      <div className={styles.renderExtraFooter}>
        <div className={styles.timePickerBox}>
          <div>
            <TimePickerComponent
              {...disabledStartTime}
              defaultValue={timeDefaultValue[0]}
              /* disabledHours={() => {
                function range(start, end) {
                  const result = [];
                  for (let i = start; i < end; i++) {
                    result.push(i);
                  }
                  return result;
                }
                const hours = range(0, 24);
                hours.splice(20, 4);
                return hours;
              }} */
              onChange={this.onStartValueChange}
              format={showTime.format}
              disabledSelect={!value || !value.length}
              value={value ? value[0] : null}
            />
          </div>

          <div>
            <TimePickerComponent
              {...disabledEndTime}
              defaultValue={timeDefaultValue[1]}
              onChange={this.onEndValueChange}
              format={showTime.format}
              disabledSelect={!value || !value.length}
              value={value ? value[1] : null}
            // disabledTime={this.disabledEndTime}
            />
          </div>
        </div>
        <div className={styles.footerBtn}>
          <Button type="primary" onClick={() => this.setState({ datePickerOpen: false })}>确定</Button>
        </div>
      </div>
    );
    return (
      <RangePicker
        disabledDate={disabledDate}
        placeholder={placeholder}
        showTime
        value={value}
        format={format}
        open={datePickerOpen}
        renderExtraFooter={() => renderExtraFooter}
        className="has-time-picker"
        getCalendarContainer={this.getCalendarContainer}
        onOpenChange={this.onOpenChange}
        onChange={this.onDateValueChange}
      />
    );
  }
}
