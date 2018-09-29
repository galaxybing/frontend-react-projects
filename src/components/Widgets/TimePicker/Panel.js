import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Combobox from './Combobox';
import moment from 'moment';

function noop() {
}

function generateOptions(length, disabledOptions) {
  const arr = [];
  for (let value = 0; value < length; value++) {
    // if (!disabledOptions || disabledOptions.indexOf(value) < 0 ) {
    //   arr.push(value);
    // }
    arr.push(value);
  }
  return arr;
}

class Panel extends Component {
  static defaultProps = {
    // defaultOpenValue: moment(),
    onChange: noop,
    disabledHours: noop,
    disabledMinutes: noop,
    disabledSeconds: noop,
  };

  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
      selectionRange: [],
    };
  }

  componentWillReceiveProps(nextProps) {
    const value = nextProps.value;
    if (value) {
      this.setState({
        value,
      });
    }
  }

  onChange = (newValue) => {
    this.setState({ value: newValue });
    this.props.onChange(newValue);
  }

  onCurrentSelectPanelChange = (currentSelectPanel) => {
    this.setState({ currentSelectPanel });
  }

  render() {
    const { disabledHours, disabledMinutes, disabledSeconds,
      showHour, showMinute, showSecond, format, disabledSelect } = this.props;
    const {
      value, currentSelectPanel,
    } = this.state;
    const disabledHourOptions = disabledHours();
    const disabledMinuteOptions = disabledMinutes(value ? value.hour() : null);
    const disabledSecondOptions = disabledSeconds(value ? value.hour() : null,
      value ? value.minute() : null);
    const hourOptions = generateOptions(
      24, disabledHourOptions
    );
    const minuteOptions = generateOptions(
      60, disabledMinuteOptions
    );
    const secondOptions = generateOptions(
      60, disabledSecondOptions
    );
    return (
      <Combobox
        value={value}
        format={format}
        onChange={this.onChange}
        showHour={showHour}
        showMinute={showMinute}
        showSecond={showSecond}
        hourOptions={hourOptions}
        minuteOptions={minuteOptions}
        secondOptions={secondOptions}
        disabledHours={disabledHours}
        disabledMinutes={disabledMinutes}
        disabledSeconds={disabledSeconds}
        disabledSelect={disabledSelect}
      />
    );
  }
}

export default Panel;
