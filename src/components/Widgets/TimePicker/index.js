import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import styles from './style.css';
import Panel from './Panel';

export function generateShowHourMinuteSecond(format) {
  return {
    showHour: (
      format.indexOf('H') > -1 ||
      format.indexOf('h') > -1 ||
      format.indexOf('k') > -1
    ),
    showMinute: format.indexOf('m') > -1,
    showSecond: format.indexOf('s') > -1,
  };
}
function noop() {
}

function refFn(field, component) {
  this[field] = component;
}
export default class TimePicker extends Component {
  
  constructor(props) {
    super(props);
    const { defaultValue, value } = props;
    // console.log(value, defaultValue)
    this.state = {
      value: value || defaultValue,
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

  setValue(value) {
    if (!('value' in this.props)) {
      this.setState({
        value,
      });
    }
    this.props.onChange(value);
  }

  onPanelChange = (value) => {
    this.setValue(value);
  }

  render() {
    const { format = 'HH:mm:ss' } = this.props;
    const { disabledHours, disabledMinutes, disabledSeconds, defaultOpenValue, disabledSelect } = this.props;
    return (
      <Panel
        {...generateShowHourMinuteSecond(format) }
        value={this.state.value}
        onChange={this.onPanelChange}
        format={format}
        disabledHours={disabledHours}
        disabledMinutes={disabledMinutes}
        disabledSeconds={disabledSeconds}
        disabledSelect={disabledSelect}
      />
    );
  }
}
