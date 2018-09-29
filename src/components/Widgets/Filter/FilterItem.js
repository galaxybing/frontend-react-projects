import React from 'react';
import classnames from 'classnames';
import { Icon } from 'antd';
import { arrayTreeFilter, shallowEqualArrays } from '../../../core/_utils/common';

import './style.css';

export default class FilterItem extends React.Component {
  static defaultProps = {
    prefixCls: 'boz-filter',
    options: [],
    disabled: false,
    style: {},
    onChange() { },
  }
  constructor(props) {
    super(props);
    let initialValue = [];
    if ('value' in props) {
      initialValue = props.value || [];
    } else if ('defaultValue' in props) {
      initialValue = props.defaultValue || [];
    }
    this.state = {
      dataList: [],
      activeValue: initialValue,
      value: initialValue,
      showActionBtn: false,  // 是否显示展开按钮
      showAll: false,  // 展示完全数据
    }
  }
  componentDidMount() {
  }
  componentWillReceiveProps(nextProps) {
    // console.log(shallowEqualArrays(nextProps.defaultValue, this.state.activeValue))
    // if ('defaultValue' in nextProps && shallowEqualArrays(nextProps.defaultValue, this.state.activeValue)) {
    //   this.setState({ activeValue: nextProps.defaultValue });
    // }

    if ('value' in nextProps) {
      this.setState({ activeValue: nextProps.value || [] });
    }
    if ('options' in nextProps) {
      this.setState({
        dataList: nextProps.options
      }, () => {
        this.showActionBtn();
      });
    }
  }
  showActionBtn() {
    const ref = this[`${this.props.prefixCls}-menu-0`];
    if (ref) {
      this.setState({
        showActionBtn: ref.offsetHeight > 45
      });
    }
  }
  getActiveOptions(values) {
    const activeValue = values || this.state.activeValue;
    const options = this.props.options;
    return arrayTreeFilter(options, (o, level) => o.value === activeValue[level]);
  }
  getShowOptions() {
    const { options } = this.props;
    const result = this.getActiveOptions()
      .map(activeOption => activeOption.children)
      .filter(activeOption => !!activeOption && activeOption.length);
    result.unshift(options);
    return result;
  }
  valueSelected = (targetOption, menuIndex, e) => {
    if (!targetOption || targetOption.disabled) {
      return;
    }
    let { activeValue } = this.state;
    activeValue = activeValue.slice(0, menuIndex + 1);
    activeValue[menuIndex] = targetOption.value;
    if (menuIndex === 0 && targetOption.children && targetOption.children.length) {
      activeValue[menuIndex + 1] = targetOption.children[0].value;
    }
    const activeOptions = this.getActiveOptions(activeValue);
    // console.log(activeOptions)
    this.setState({ activeValue });
    this.props.onChange(activeValue, activeOptions);
  }
  isActiveOption(option, menuIndex) {
    const { activeValue = [] } = this.state;
    return activeValue[menuIndex] === option.value;
  }
  getOption(option, menuIndex) {
    const { prefixCls } = this.props;

    let menuItemCls = `${prefixCls}-item`;
    if (this.isActiveOption(option, menuIndex)) {
      menuItemCls += ` ${prefixCls}-item-selected`;
    }
    if (option.disabled) {
      menuItemCls += ` ${prefixCls}-menu-item-disabled`;
    }
    return (
      <li
        key={option.value}
        onClick={() => this.valueSelected(option, menuIndex)}
        className={menuItemCls}
      >
        {option.label}
      </li>
    );
  }
  render() {
    const { dataList, showActionBtn, showAll } = this.state;
    const itemCls = classnames(this.props.className, {
      [`${this.props.prefixCls}`]: true,
    });
    return (
      <div className={itemCls} style={{ ...this.props.style }}>
        <div className={`${this.props.prefixCls}-label`}>
          <label>{this.props.label}</label>
        </div>
        <div className={`${this.props.prefixCls}-control-wrapper`}>
          {this.getShowOptions().map((options, menuIndex) => {
            return (
              <div
                className={`${this.props.prefixCls}-control`}
                key={menuIndex}
                ref={ref => this[`${this.props.prefixCls}-control-${menuIndex}`] = ref}
              >
                <ul
                  className={`${this.props.prefixCls}-menu`}
                  ref={ref => this[`${this.props.prefixCls}-menu-${menuIndex}`] = ref}
                >
                  {options.map(option => this.getOption(option, menuIndex))}
                </ul>
                {
                  menuIndex === 0 && showActionBtn ?
                    <span
                      className={`${this.props.prefixCls}-control-action`}
                      onClick={() => {
                        this.setState({ showAll: !showAll }, () => {
                          if (this.state.showAll) {
                            this[`${this.props.prefixCls}-control-0`].style.height = this[`${this.props.prefixCls}-menu-0`].offsetHeight + 'px';
                          } else {
                            this[`${this.props.prefixCls}-control-0`].style.height = 40 + 'px';
                          }
                        });
                      }}
                    >
                      {showAll ? '收起' : '展开'}
                      <Icon type={showAll ? 'up' : 'down'} style={{ marginLeft: 5 }} />
                    </span> : ''
                }
                {menuIndex === 0 && this.props.renderAction ? <div className={`${this.props.prefixCls}-control-action-btn`}>{this.props.renderAction()}</div> : ''}
              </div>
            );
          }
          )}

        </div>
      </div>
    );
  }
}
