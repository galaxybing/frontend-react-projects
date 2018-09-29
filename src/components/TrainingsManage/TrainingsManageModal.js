import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { Modal, Button, DatePicker, message, Input, InputNumber, Form, Radio, Tag, Alert, Tooltip, Icon, Checkbox, Switch, TimePicker, Select, Spin } from 'antd';
import RangePickerComponent from '@317hu/rangedatepicker';
import '@317hu/rangedatepicker/lib/style/index';
import { fetchReleaseUsers } from '../../actions/common';
import { fetchAddressName } from '../../actions/trainingManage';
import { getCache } from '../../core/_utils/storage';
import { rangeTime } from '../../core/_utils/common';
import styles from './TrainingsManage.css';
import CheckMemberModal from './CheckMemberModal';

import DatePickerComponent from '../Widgets/DatePicker';

const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const dateFormat = 'YYYY-MM-DD HH:mm';

function getRelativeUnixTime(m) {
  return moment(moment(m).format('YYYY-MM-DD') + ' 00:01').format('X') * 1000;
}

const relationValidateFields = (fieldNames = [], form) => {
  form.validateFields(fieldNames, (err, val) => {
    for (let f in err) {
      let fieldNames = {};
      fieldNames[`${f}`] = form.getFieldValue(f);
      form.setFieldsValue({
        ...fieldNames,
      })
    }
  });
}

class TrainingsManageModal extends Component {
  constructor(props) {
    super(props);
    this.modalProps = {
      width: 960,
      onOk: this.handleSubmitHandler,
      onCancel: this.props.handleCancel.bind(this),
    };
    this.noLimitTime = false;
    const { trainModel } = props.currentData;
    this.trainModelStatus = trainModel === 0 ? 'online' : 'offline';

    // 处理 重新发布的自定义人员列表显示
    const resetSubmitDataSource = props.resetSubmitDataSource;
    this.state = {
      trainingsUserData: [],
      loading: true,
      selectNum: 0,
      // accountIdMap: new Map([]),
      planEndTime: null,
      planStartTime: null,
      visible: false,
      isReleaseAll: true,// false
      releaseAllQuery: {},
      endOpen: false,
      releaseData: {},

      addReleaseStudentReqDTOList: resetSubmitDataSource && resetSubmitDataSource.contentStudentRelationRespDTOList ? resetSubmitDataSource.contentStudentRelationRespDTOList : [],
      addReleaseStudentShowStatus: 'close',

      // showCheckMember: this.trainModelStatus === 'online' || false,  // 在线培训默认为自定义人员
      // memberRangeStatus: this.trainModelStatus === 'online' ? 1 : 0,
      showCheckMember: true,
      memberRangeStatus: 1, // 现场培训、在线培训 都默认为 自定义人员

      addressListData: [], // 地点查询数据
      fetchLoading: false,
    };

    this.signupTimeChange = false;
  }
  componentDidMount() {
    fetchAddressName('').then((res) => {
      let addressListData = []
      if (res.success && res.data.length) {
        addressListData = res.data;
      }
      this.setState({ addressListData, fetchLoading: false });
    });
  }
  saveCheckMember = (data) => {
    let addReleaseStudentReqDTOListState = this.state.addReleaseStudentReqDTOList;
    let addReleaseStudentReqDTOList;
    addReleaseStudentReqDTOListState = addReleaseStudentReqDTOListState.concat(data);
    function arrayReduceRepeat(arr, key) {
      let listData = arr, obj = {}, result = [];
      if (key) {
        for (var i = 0; i < listData.length; i++) {
          if (!obj[listData[i][key]]) {
            result.push(listData[i]);
            obj[listData[i][key]] = 1;
          }
        }
      } else {
        for (var i = 0; i < listData.length; i++) {
          if (!obj[listData[i]]) {
            result.push(listData[i]);
            obj[listData[i]] = 1;
          }
        }
      }

      return result;
    }
    addReleaseStudentReqDTOList = arrayReduceRepeat(addReleaseStudentReqDTOListState, 'userId');
    setTimeout(() => {
      if (addReleaseStudentReqDTOListState.length !== addReleaseStudentReqDTOList.length) {
        message.warning('添加的人员有重复，已去重显示', 2)
      }
    }, 1000);

    this.setState({ isReleaseAll: false, addReleaseStudentReqDTOList: addReleaseStudentReqDTOList, addReleaseStudentShowStatus: 'close' }, () => {
      this.props.dispatch({
        type: 'trainingsManage/hideCheckMemberModal'
      });
    })
  };
  onChange = (query) => {
    let releaseAllQueryData = {};
    for (let key in query) {
      if (key !== 'pageNum' && key !== 'pageSize') {
        releaseAllQueryData[key] = query[key]
      }
    }
    this.setState({
      loading: true,
      releaseAllQuery: releaseAllQueryData
    });
    fetchReleaseUsers({ ...query, type: 1 }).then(data => {
      if (!data.data || !data.data.success) {
        return;
      }
      this.setState({
        trainingsUserData: data.data.data,
        loading: false
      });
    })
  };
  showCheckMemberModal = () => {
    this.props.dispatch({
      type: 'trainingsManage/showCheckMemberModal',
      payload: { current: this.props.currentData }
    });
  }
  handleSubmitHandler = () => {
    let isReleaseAll;
    if (this.state.memberRangeStatus === 0) {
      isReleaseAll = true;
    } else {
      isReleaseAll = false;
    }
    this.setState({ isReleaseAll }, function () {
      this.handleSubmit();
    });

  }
  courseReleaseAllHandler = (e) => {
    this.setState({ isReleaseAll: true }, function () {
      this.handleSubmit();
    })
  }
  handleSubmit = () => {
    const { releaseAllQuery, memberRangeStatus } = this.state;
    this.props.form.validateFields((err, values) => {
      if (err) {
        return;
      }
      let releaseData = {};
      let releaseDataAdditional = { trainModel: 0 };
      if (this.trainModelStatus === 'offline') {
        // 发布 现场培训 时报名截止时间为必填项
        //
        // if (typeof values[`signupDate`] == 'undefined') {
        //
        // }
        releaseDataAdditional = {
          trainPlace: values['addressName'],
          signUpEndTime: values.signupDate ? values.signupDate.format('YYYY-MM-DD HH:mm') : '',
          signUpLimit: values['signupLimit'],
          needSign: values[`needSignUpFlag`] ? 1 : 0, // 是否需要签到（0-不需要；1-需要）
          needSignUp: values[`signUpSwitched`] ? 1 : 0, // 是否需要报名（0-不需要；1-需要）
          trainModel: 1
        };
      }

      // 签到时间
      let signStartTime;
      let signEndTime;
      if (values[`signupRealDateDay`] && values[`signupRealDateStartTime`] && values[`signupRealDateEndTime`]) {
        signStartTime = moment(values[`signupRealDateDay`]).format('YYYY-MM-DD') + ' ' + moment(values[`signupRealDateStartTime`]).format('HH:mm');
        ;
        signEndTime = moment(values[`signupRealDateDay`]).format('YYYY-MM-DD') + ' ' + moment(values[`signupRealDateEndTime`]).format('HH:mm');
      }


      // 签退时间
      let signOutStartTime;
      let signOutEndTime;
      if (values[`signoutDateDay`] && values[`signoutDateStartTime`] && values[`signoutDateEndTime`]) {
        signOutStartTime = moment(values[`signoutDateDay`]).format('YYYY-MM-DD') + ' ' + moment(values[`signoutDateStartTime`]).format('HH:mm');
        ;
        signOutEndTime = moment(values[`signoutDateDay`]).format('YYYY-MM-DD') + ' ' + moment(values[`signoutDateEndTime`]).format('HH:mm');
      }

      const currentDataSource = this.props.currentData;
      const { courseId, /* personnelRequest, */ contentId, totalScore, planEndTime, planStartTime } = currentDataSource;

      if (this.state.isReleaseAll) {
        let { comInHospEndDate, comInHospStartDate, deptIds, levelCode, name, wardIds, filterPass, filterNewEntry, filterPreviousRelease } = releaseAllQuery;
        let params = { comInHospEndDate, comInHospStartDate, deptIds, levelCode, name, wardIds, filterPass, filterNewEntry, filterPreviousRelease };
        releaseData = {
          loginUserId: getCache('profile').userId,
          courseId,
          // studentRequest: personnelRequest,
          contentId,
          planEndTime: this.noLimitTime ? '' : values.planTime[1].format(dateFormat),
          planStartTime: this.noLimitTime ? '' : values.planTime[0].format(dateFormat),
          retakeTime: values.retakeTime,
          // 江苏省人民医院迁移至公版 移除 微信通知功能
          // wechatNotice: values.wechatNotice ? 1 : 0,  // 微信通知
          credit: values.creditScore,
          passScore: values.passScore,
          totalScore,

          signStartTime,
          signEndTime,

          needSignOut: values.signOutSwitched ? 1 : 0,
          signOutStartTime,
          signOutEndTime,
          homeWorkEndTime: values.homeworkDateDay ? moment(values.homeworkDateDay).format('YYYY-MM-DD') + ' 23:59' : null,

          ...params,
          ...releaseDataAdditional
        };
      } else {
        releaseData = {
          ...releaseData,
          hospitalId: getCache('profile').hospitalId,
          loginUserId: getCache('profile').userId,
          courseId,
          // studentRequest: personnelRequest,
          contentId,
          // addReleaseStudentReqDTOList: [...this.state.accountIdMap.values()],
          addReleaseStudentReqDTOList: this.state.addReleaseStudentReqDTOList,
          // planEndTime: this.noLimitTime ? '' : this.state.planEndTime,
          // planStartTime: this.noLimitTime ? '' : this.state.planStartTime,
          planEndTime: this.noLimitTime ? '' : values.planTime[1].format(dateFormat),
          planStartTime: this.noLimitTime ? '' : values.planTime[0].format(dateFormat),
          retakeTime: values.retakeTime,
          // 江苏省人民医院迁移至公版 移除 微信通知功能
          // wechatNotice: values.wechatNotice ? 1 : 0,  // 微信通知
          credit: values.creditScore,
          passScore: values.passScore,
          totalScore,
          signStartTime,
          signEndTime,

          needSignOut: values.signOutSwitched ? 1 : 0,
          signOutStartTime,
          signOutEndTime,
          homeWorkEndTime: values.homeworkDateDay ? moment(values.homeworkDateDay).format('YYYY-MM-DD') + ' 23:59:59' : null,

          ...releaseDataAdditional
        };
        if (this.trainModelStatus === 'online') {
          releaseData = {
            ...releaseData,
            pubElectiveEnable: memberRangeStatus === 2 || values.pubElectiveEnable ? 1 : 0,  // 是否可以公开选修, 1 可以公开选修(自定义人员有)
          }
        }
      }

      this.setState({ releaseData, visible: true })
    });
  }
  checkHandleOk = (e) => {
    const { loading } = this.props;
    const { releaseData } = this.state;
    if (loading) return;

    this.setState({
      visible: false,
    });

    if (this.state.isReleaseAll) {
      this.props.courseReleaseAllHandler(releaseData);
    } else {
      this.props.courseReleaseHandler(releaseData);
    }
  }
  checkHandleCancel = (e) => {
    this.setState({
      visible: false
    });
  }
  onSignupChange = (value) => {
    this.signupTimeChange = true;
  }
  handleValidateSignupDate = (rule, value, callback) => {
    const { getFieldValue } = this.props.form;
    const planStartTime = getFieldValue('planTime') ? getFieldValue('planTime')[0] : null;
    const planSignupTime = getFieldValue('signupDate');

    if (planStartTime && value && planSignupTime.valueOf() > planStartTime.valueOf()) {
      callback('报名截止时间，必须早于培训开始时间');
    } else if (value && planSignupTime.valueOf() < moment().valueOf()) {
      callback('报名截止时间，必须晚于当前时间');
      // } else if (typeof planSignupTime === 'undefined') {
    } else if (!planSignupTime) {
      callback('您已开启报名，截止时间为必填项');
    } else {
      callback();
    }

  }
  handleValidateSignupRealDate = ({ rule, value, callback, type }) => { // 签到时间 type : day | startTime | endTime
    const { getFieldValue, validateFields } = this.props.form;
    const { needSignOutStatus } = this.state;
    let msg = '';
    switch (type) {
      case 'day':
        const dayTimeVal = moment(moment(value).format('YYYY-MM-DD') + ' 00:01').format('X') * 1000;
        const planStartTime = getFieldValue('planTime') ? getRelativeUnixTime(getFieldValue('planTime')[0]) : null;
        const planEndTime = getFieldValue('planTime') ? getRelativeUnixTime(getFieldValue('planTime')[1]) : null;
        if (dayTimeVal < planStartTime) {
          msg = '签到日期，不能早于培训开始日期';
        }
        if (dayTimeVal > planEndTime) {
          msg = '签到日期，不能晚于培训结束日期';
        }
        if (needSignOutStatus && getFieldValue('signoutDateDay')) {
          if (getRelativeUnixTime(value) > getRelativeUnixTime(getFieldValue('signoutDateDay'))) {// 日期取当天 时间取当前
            msg = '签到日期，不能晚于签退日期';
          };
          // if (getRelativeUnixTime(value) === getRelativeUnixTime(getFieldValue('signoutDateDay'))){
          //   msg = '签到日期，等于签退日期';
          // }
          // relationValidateFields(['signoutDateDay'], this.props.form);
        }
        break;
      case 'startTime':
        if (getFieldValue('signupRealDateEndTime') && getFieldValue('signupRealDateEndTime')) {
          if (value > getFieldValue('signupRealDateEndTime').valueOf()) {
            msg = '签到开始时间，不能晚于签到结束时间';
          }
        }
        // relationValidateFields(['signupRealDateEndTime'], this.props.form);
        break;
      case 'endTime':
        if (getFieldValue('signupRealDateStartTime')) {
          if (value < getFieldValue('signupRealDateStartTime').valueOf()) {
            msg = '签到结束时间，不能早于签到开始时间';
          }
        }
        if (needSignOutStatus && getFieldValue('signoutDateDay') && getFieldValue('signupRealDateDay')) {
          // 签退日期，等于签到日期，即同一天内
          if (getRelativeUnixTime(getFieldValue('signoutDateDay')) === getRelativeUnixTime(getFieldValue('signupRealDateDay'))) {

            if (getFieldValue('signoutDateStartTime') && value > getFieldValue('signoutDateStartTime').valueOf()) {
              msg = '签到结束时间，不能晚于签退开始时间';
            }
          };
        }

        relationValidateFields(['signoutDateStartTime', 'signupRealDateStartTime'], this.props.form);
        break;
      default:
        break;
    }

    if (msg) {
      callback(msg);
    } else {
      callback();
    }
  }
  handleValidateSignupOutDate = ({ rule, value, callback, type }) => { // 签退时间
    const { getFieldValue, validateFields, setFieldsValue } = this.props.form;
    const { needSignOutStatus } = this.state;
    let msg = '';
    switch (type) {
      case 'day':
        const dayTimeVal = moment(moment(value).format('YYYY-MM-DD') + ' 00:01').format('X') * 1000;
        const planStartTime = getFieldValue('planTime') ? getRelativeUnixTime(getFieldValue('planTime')[0]) : null;
        const planEndTime = getFieldValue('planTime') ? getRelativeUnixTime(getFieldValue('planTime')[1]) : null;
        if (dayTimeVal < planStartTime) {
          msg = '签退日期，不能早于培训开始日期';
        }
        if (dayTimeVal > planEndTime) {
          msg = '签退日期，不能晚于培训结束日期';
        }
        if (needSignOutStatus && getFieldValue('signupRealDateDay')) {
          if (getRelativeUnixTime(value) < getRelativeUnixTime(getFieldValue('signupRealDateDay'))) {// 日期取当天 时间取当前
            msg = '签退日期，不能早于签到日期';
          };
          relationValidateFields(['signupRealDateDay'], this.props.form);
        }
        break;
      case 'startTime':

        if (getFieldValue('signoutDateEndTime') && value > getFieldValue('signoutDateEndTime').valueOf()) {
          msg = '签退开始时间，不能晚于签退结束时间';
        }
        if (getFieldValue('signupRealDateDay') && getFieldValue('signoutDateDay')) {
          // 签退日期，等于签到日期，即同一天内
          if (getRelativeUnixTime(getFieldValue('signoutDateDay')) === getRelativeUnixTime(getFieldValue('signupRealDateDay'))) {

            if (getFieldValue('signupRealDateEndTime') && value < getFieldValue('signupRealDateEndTime').valueOf()) {
              msg = '签退开始时间，不能早于签到结束时间';
            }
          };
        }
        // 验证
        // relationValidateFields(['signoutDateEndTime', 'signupRealDateEndTime'], this.props.form);
        break;
      case 'endTime':
        if (getFieldValue('signoutDateStartTime') && value < getFieldValue('signoutDateStartTime').valueOf()) {
          msg = '签退结束时间，不能早于签退开始时间';
        }
        relationValidateFields(['signoutDateStartTime'], this.props.form);
        break;
      default:
        break;
    }

    if (msg) {
      callback(msg);

    } else {
      callback();
    }
  }
  getCalendarContainer = (trigger) => {
    return trigger.parentNode;
  }
  deleteReleaseStudentHandler = (index) => {
    let addReleaseStudentReqDTOList = this.state.addReleaseStudentReqDTOList;
    addReleaseStudentReqDTOList.splice(index, 1);
    this.setState({
      addReleaseStudentReqDTOList: addReleaseStudentReqDTOList
    })
  }
  handleValidateDate = (rule, value, callback) => {
    if (value && value.length) {
      if (value[0].valueOf() >= value[1].valueOf) {
        callback('结束时间必须晚于开始时间');
      } else if (value[1] && (value[1].valueOf() <= Date.now())) {
        callback('结束时间必须晚于当前时间');
      }
    }
    callback();
  }
  disabledDate = (current) => {
    const { leaseStartTime, leaseEndTime, systemTime } = this.props.currentData;
    const currentString = moment(current).format('YYYY-MM-DD');
    const currentUnix = moment(currentString).format('X');
    if (leaseStartTime && leaseEndTime && leaseEndTime) {
      return current && ((currentUnix < systemTime) || (currentUnix > leaseEndTime));
    }
    return current && moment(current).format('YYYY-MM-DD') < moment(new Date()).format('YYYY-MM-DD');
  }
  disabledSignupDate = (current) => {
    const planTime = this.props.form.getFieldValue('planTime');
    if (!current) {
      return false;
    }
    return moment(current).format('YYYY-MM-DD') < moment(new Date()).format('YYYY-MM-DD') || (planTime && planTime.length && (moment(current).format('YYYY-MM-DD') > moment(planTime[0]).format('YYYY-MM-DD')));
  }
  disabledSignupTime = (time) => {
    if (!time) return;
    const now = new Date();
    let disabledTime;
    const format = 'YYYY-MM-DD';
    const planTime = this.props.form.getFieldValue('planTime') ? this.props.form.getFieldValue('planTime') : {};
    // 开始日期跟当前日期一致（选择日期就必须与他们一致）
    if (planTime && planTime.length && (moment(planTime[0]).format(format) == moment(now).format(format))) {
      // 可选时间为当前时间跟开始时间之内（其余不可选）
      const disabledHours = rangeTime(0, 24);
      const disabledMinutes = rangeTime(0, 60);
      disabledHours.splice(moment(now).format('HH'), moment(planTime[0]).format('HH') - moment(now).format('HH') + 1);
      if (moment(planTime[0]).format('HH') > moment(time).format('HH')) {
        return {
          disabledHours: () => disabledHours
        };
      }
      // 三个小时相等    分钟在开始时间和当前时间之内
      if (moment(planTime[0]).format('HH') == moment(now).format('HH') && moment(now).format('HH') == moment(time).format('HH')) {
        disabledMinutes.splice(moment(now).format('mm'), moment(planTime[0]).format('mm') - moment(now).format('mm') + 1);
      } else {
        disabledMinutes.splice(0, moment(planTime[0]).format('mm'));
      }
      return {
        disabledHours: () => disabledHours,
        disabledMinutes: () => disabledMinutes,
      };
    } else if (moment(time).format(format) == moment(now).format(format)) {
      // 截止日期跟当前日期一致 （只判断当前时间之前不可选）
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
    } else if (planTime && moment(time).format(format) == moment(planTime[0]).format(format)) {
      // 截止日期跟开始日期一致 （只判断开始时间之后不可选）
      disabledTime = planTime[0];
      if (moment(time).format('HH') < moment(disabledTime).format('HH')) {
        return {
          disabledHours: () => rangeTime(0, 24).splice(parseInt(moment(disabledTime).format('HH')) + 1, 24)
        };
      }
      return {
        disabledHours: () => rangeTime(0, 24).splice(parseInt(moment(disabledTime).format('HH')) + 1, 24),
        disabledMinutes: () => rangeTime(0, 60).splice(moment(disabledTime).format('mm'), 60)
      };
    } else {
      return {};
    }
  }
  rangePickerChange = (value) => { // 处理 后面相关时间（与，签到时间、签退时间、报名截止时间的关联）
    const { form } = this.props;
    const { isFieldTouched, getFieldValue, setFieldsValue } = form;
    const { signUpStatus, needSignOutStatus } = this.state; // null | moment
    if (value && value.length) {
      if (this.trainModelStatus === 'offline') {
        let signupDate;
        const nowValueOf = moment(moment(new Date()).format(dateFormat), dateFormat).valueOf();
        const planStart = value[0].valueOf();
        const planEnd = value[1].valueOf();

        if (getFieldValue('needSignUpFlag')) { // 已开启签到
          let fieldValueObj = {
            // 重置 签到时间
            /*
            signupRealDateDay: getFieldValue('signupRealDateDay') ? null : moment(moment(planStart).format('YYYY-MM-DD'), 'YYYY-MM-DD'),

            signupRealDateStartTime: getFieldValue('signupRealDateStartTime') ? null : this.signInitialValue(planStart, moment(planStart).format('X') * 1000 - 20*60*1000),

            signupRealDateEndTime: getFieldValue('signupRealDateEndTime') ? null : this.signInitialValue(planStart, moment(planStart).format('X') * 1000 + 10*60*1000),
             */
            signupRealDateDay: moment(moment(planStart).format('YYYY-MM-DD'), 'YYYY-MM-DD'),

            signupRealDateStartTime: this.signInitialValue(planStart, moment(planStart).format('X') * 1000 - 20 * 60 * 1000),

            signupRealDateEndTime: this.signInitialValue(planStart, moment(planStart).format('X') * 1000 + 10 * 60 * 1000),
          };


          if (signUpStatus) { // 已开启报名
            // 开启了签到和报名时，签到截止时间不能早于报名开始时间 ？直接重置
            getFieldValue('signupDate') ? (Object.assign(fieldValueObj, {
              signupDate: (
                moment(moment(planStart).format('YYYY-MM-DD HH:mm'), 'YYYY-MM-DD HH:mm')
              )
            })) : '';
          }
          if (needSignOutStatus) {
            // 重置 签退时间
            Object.assign(fieldValueObj, {
              signoutDateDay: moment(moment(planEnd).format('YYYY-MM-DD'), 'YYYY-MM-DD'),
              signoutDateStartTime: this.signInitialValue(planEnd, moment(planEnd).format('X') * 1000 - 10 * 60 * 1000),
              signoutDateEndTime: this.signInitialValue(planEnd, moment(planEnd).format('X') * 1000 + 20 * 60 * 1000),
            });
          }

          setFieldsValue({
            ...fieldValueObj,
          });
        }
      }
    }
  }
  validateCredit = (rule, value, callback) => {
    if (value && (!/^[0-9]{1}(\.)?(\d{1})?$/.test(value) || value > 10)) {
      callback('请输入0到10的数字,正数且只精确到小数点后一位');
    } else {
      callback();
    }
  }
  validatePassScore = (rule, value, callback) => {
    const { totalScore } = this.props.currentData;
    if (value && (!/^\d+(\.\d{1})?$/.test(value) || value == 0)) {
      callback(' ');
    } else if (value && (!/^\d+(\.\d{1})?$/.test(value) || value > Number(totalScore))) {
      message.warning(`及格分数不能高于总分数：${totalScore} 分`);//
      callback(' ');
    } else {
      callback();
    }

  }
  validateRetakeTime = (rule, value, callback) => {
    const { hadExercise } = this.props.currentData;
    const retaketimeReg = /^[1-9]\d*$/;
    if (hadExercise == 1 && (!retaketimeReg.test(value) || value > 100)) {
      callback('测验次数为正整数，且不得超过100');
    }
    callback();
  }

  switchSignContent = (isShow) => {
    if (isShow) {
      this.signContentElem.style.display = 'block'
    } else {
      this.signContentElem.style.display = 'none';
    }
  }

  signInitialValue = (tTime, unixTime) => { // 取时间值，且比较与 当天最大时间
    let initialValue = null;
    if (tTime) {
      let timeVal = moment(unixTime).format('X') * 1000;
      let dayTimeVal = moment(moment(tTime).format('YYYY-MM-DD') + ' 23:59').format('X') * 1000;
      if (timeVal > dayTimeVal) {
        return moment(moment(dayTimeVal).format('HH:mm'), 'HH:mm');
      } else {
        return moment(moment(timeVal).format('HH:mm'), 'HH:mm');
      }
    }
    return initialValue;
  }

  render() {
    const { loading, trainingsUserData, selectNum, planStartTime, planEndTime, endOpen, signupDate } = this.state;
    const resetSubmitStatus = this.props.resetSubmitDataSource ? true : false;
    const currentDataTrainingsManage = { ...this.props.currentData, ...this.props.resetSubmitDataSource };
    const { hadExercise, trainModel, totalScore, homeWorkFlag, contentStudentRelationRespDTOList } = currentDataTrainingsManage;

    const { visible, current, /* loading, */ releaseLoading } = this.props.trainingsManage;
    this.CheckMemberModalProps = {
      visible: true,
      courseId: this.props.currentData && this.props.currentData.courseId ? this.props.currentData.courseId : null,
      loading: this.props.trainingsManage.loading, // 处理
      releaseLoading,
      handleOk: this.saveCheckMember
    };

    let { checkMemberModalVisible } = this.props.trainingsManage;
    const rowSelection = this.rowSelection;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 19 },
    };
    // let trainingsManageModalTitle = trainModel === 0 ? '发布在线培训' : '发布现场培训';

    let addReleaseStudentCount = this.state.addReleaseStudentReqDTOList.length;
    let addReleaseStudentReqDTOList = this.state.addReleaseStudentReqDTOList;
    addReleaseStudentReqDTOList = this.state.addReleaseStudentShowStatus === 'close' ? addReleaseStudentReqDTOList.slice(0, 13) : addReleaseStudentReqDTOList;

    const nowTime = moment(new Date()).format('HH:mm');

    const courseStartTime = getFieldValue('planTime') ? getFieldValue('planTime')[0] : null;
    const courseEndTime = getFieldValue('planTime') ? getFieldValue('planTime')[1] : null;

    let homeworkDateDay = null;
    if (courseEndTime) {//  且存在 课后作业
      const homeworkDateTime = moment(courseEndTime).format('X') * 1000 + 3 * 24 * 60 * 60 * 1000;
      homeworkDateDay = moment(moment(homeworkDateTime).format('YYYY-MM-DD'), 'YYYY-MM-DD');
    }

    // 配置 仅当重新发布时，才应用 initialValue 属性，以避免初始触发表单的验证
    const planTimeInitialValue = resetSubmitStatus ? {
      initialValue: (() => {
        let rangDateArr = [];
        if (resetSubmitStatus) {
          const { planStartTime, planEndTime } = currentDataTrainingsManage;
          const dateFormat = 'YYYY-MM-DD HH:mm';
          rangDateArr = [moment(moment(planStartTime).format(dateFormat), dateFormat), moment(moment(planEndTime).format(dateFormat), dateFormat)]
        }
        return rangDateArr;
      })(),
      rules: [{
        // type: 'array',
        required: true,
        message: '请选择培训时间'
      }, {
        validator: this.handleValidateDate
      }],
    } : {
        rules: [{
          // type: 'array',
          required: true,
          message: '请选择培训时间'
        }, {
          validator: this.handleValidateDate
        }],
      };

    return (
      <div>
        <Modal style={{ padding: 20 }} title="发布培训" {...this.modalProps} footer={null} visible={this.props.visible} confirmLoading={this.props.loading}>
          <div className={styles.trainingsManageModalContent}>
            {
              this.trainModelStatus === 'offline' ? (
                <Alert message="管理员发起现场培训，学员需至指定地点参加培训。" banner closable />
              ) : ''
            }
            <div className={styles.options}>
              {/*<p><span className={styles.title}>对象要求  </span>{this.props.current.personnelRequest}</p>*/}
              <Form onSubmit={this.checkHandleOk}>
                <Form.Item {...formItemLayout} label="培训时间">
                  {getFieldDecorator('planTime', planTimeInitialValue)(
                    <RangePickerComponent
                      showTime={{
                        defaultValue: [moment(nowTime, 'HH:mm'), moment('23:59', 'HH:mm')],
                        format: 'HH:mm'
                      }}
                      placeholder={['开始时间', '结束时间']}
                      format="YYYY-MM-DD HH:mm"
                      disabledDate={this.disabledDate}
                      onChange={this.rangePickerChange}
                      disabledDateTimeNow  // 当前时间disable
                    />
                  )}
                </Form.Item>
                {/*
                  <Form.Item label="对象要求" {...formItemLayout}>
                    {getFieldDecorator('personnelRequest')(
                      <span>{personnelRequest}</span>
                    )}
                  </Form.Item>
                  */}

                {
                  this.trainModelStatus === 'offline' ? (
                    <Form.Item label="培训地点" {...formItemLayout}>
                      {getFieldDecorator('addressName', {
                        initialValue: resetSubmitStatus && currentDataTrainingsManage.trainPlace ? currentDataTrainingsManage.trainPlace : '',
                        rules: [{
                          required: true,
                          message: '请输入培训地点，字数在100字以内!',
                          max: 100,
                          whitespace: true,
                        }]
                      })(
                        <Select showSearch style={{ width: 170 }} mode="combobox" placeholder="请输入培训地点" optionFilterProp="children"
                          key={'address'}
                          optionLabelProp={'optionValue'}
                          notFoundContent={this.state.fetchLoading ? <Spin size="small" /> : null}
                          filterOption={false}
                          onSearch={(val) => {
                            let { addressListData } = this.state;
                            addressListData = [];
                            this.setState({ addressListData, fetchLoading: true });
                            fetchAddressName(val).then((res) => {
                              if (res.success && res.data.length) {
                                addressListData = res.data;
                              }
                              this.setState({ addressListData, fetchLoading: false });
                            });
                          }}
                        >
                          {
                            this.state.addressListData && this.state.addressListData.map((item, innerIndex) => {
                              return <Select.Option optionValue={item.content} value={item.content} key={innerIndex}>{item.content}</Select.Option>;
                            })
                          }
                        </Select>
                      )}
                    </Form.Item>
                  ) : ''
                }
                <Form.Item label="设置学分" {...formItemLayout}>
                  {getFieldDecorator('creditScore', {
                    initialValue: resetSubmitStatus && currentDataTrainingsManage.studentCredit ? currentDataTrainingsManage.studentCredit : 0,
                    rules: [{
                      validator: this.validateCredit
                    }]
                  }
                  )(
                    <InputNumber
                      style={{ width: 60 }}
                      size="large"
                    />
                  )} 支持小数点后一位，例5.6
                </Form.Item>
                {
                  hadExercise != 0 ? (
                    <Form.Item label="及格分数(随堂测试)" {...formItemLayout}>
                      {getFieldDecorator('passScore', {
                        initialValue: totalScore ? Math.floor((totalScore * 60) / 100 * 10) / 10 : 0,
                        rules: [{
                          required: true,
                          message: '请填写及格分数'
                        }, {
                          validator: this.validatePassScore
                        }]
                      }
                      )(
                        <InputNumber
                          style={{ width: 60 }}
                          size="large"
                        // disabled
                        />
                      )} 支持小数点后一位，且不得超过本培训课程的随堂测试总分数({Math.floor(totalScore * 10) / 10}分)
                    </Form.Item>
                  ) : ''
                }
                {
                  hadExercise != 0 ? (
                    <Form.Item label="测验次数(随堂测试)" {...formItemLayout}>
                      {getFieldDecorator('retakeTime', {
                        initialValue: hadExercise == 1 ? 3 : 0,
                        rules: [{
                          required: true,
                          message: '请填写测验次数'
                        }, {
                          validator: this.validateRetakeTime
                        }]
                      }
                      )(
                        hadExercise == 1 ?
                          <InputNumber
                            // min={1}
                            // max={100}
                            step={1}
                            style={{ width: 60 }}
                            size="large"
                          /> :
                          <InputNumber
                            style={{ width: 60 }}
                            size="large"
                            disabled
                          />
                      )}次
                    </Form.Item>
                  ) : ''
                }
                {
                  homeWorkFlag === 1 ? (
                    <Form.Item label="上传作业截止时间" {...formItemLayout}>
                      {getFieldDecorator(`homeworkDateDay`, {
                        initialValue: homeworkDateDay ? homeworkDateDay : null,
                        rules: [{
                          required: true, message: '上传作业截止时间，为必选项'
                        }]
                      })(
                        <DatePicker disabledDate={this.disabledDate} style={{ width: 170 }} onChange={(dates, dateStrings) => {
                          const { setFieldsValue } = this.props.form;
                          setFieldsValue({ 'signupOutDate': !!dates ? true : false })
                        }} />
                      )}
                    </Form.Item>
                  ) : null
                }
                {/* 江苏省人民医院迁移至公版 移除 微信通知功能 */}
                {/* <Form.Item label="消息通知" {...formItemLayout}>
                  {getFieldDecorator('wechatNotice', {
                    valuePropName: 'checked',
                    initialValue: true,
                  })(
                    <Checkbox>发送微信通知</Checkbox>
                  )}
                </Form.Item> */}

                {
                  this.trainModelStatus === 'offline' ? (
                    <div>
                      <Form.Item label="签到" {...formItemLayout}>
                        {getFieldDecorator('needSignUpFlag', {
                          //
                          // rules: [{
                          //   validator: this.validateRetakeTime
                          // }]
                        }
                        )(
                          <Switch onChange={(status) => this.switchSignContent(status)} />
                        )}
                      </Form.Item>
                      <div className={styles.formSet} ref={(r) => this.signContentElem = r}>
                        <div ref="formSetContainerRef">
                          <div className={styles.formSetCont} style={{ width: 850, paddingTop: 15 }}>
                            <Form.Item {...formItemLayout} label="是否报名">
                              {getFieldDecorator('signUpSwitched')(
                                <Switch onChange={() => {
                                  this.setState({
                                    signUpStatus: !this.state.signUpStatus,
                                  });
                                }} />
                              )}
                            </Form.Item>
                            {
                              this.state.signUpStatus ? (
                                <div>
                                  <Form.Item label="报名截止时间" {...formItemLayout}>
                                    {getFieldDecorator('signupDate', {
                                      initialValue: courseStartTime ? moment(moment(courseStartTime).format('YYYY-MM-DD HH:mm'), 'YYYY-MM-DD HH:mm') : null,
                                      rules: [{
                                        required: true,
                                        // message: ' ',
                                        validator: this.handleValidateSignupDate
                                      }]
                                    }
                                    )(
                                      <DatePickerComponent
                                        showTime={{
                                          defaultValue: moment('23:59', 'HH:mm'),
                                          format: 'HH:mm'
                                        }}
                                        placeholder="请选择时间"
                                        format="YYYY-MM-DD HH:mm"
                                        disabledDate={this.disabledSignupDate}
                                        onChange={this.onSignupChange}
                                        disabledTime={this.disabledSignupTime}
                                      />
                                    )}
                                  </Form.Item>
                                  {
                                    (this.state.memberRangeStatus !== 2) ? (
                                      <div className={styles.formItemBlankLabel}>
                                        <Form.Item label=" " {...formItemLayout}>
                                          {
                                            <div>若场地受限，您可以限制报名人数为 {
                                              getFieldDecorator(`signupLimit`, {
                                                //initialValue: 0,
                                                rules: [
                                                  { required: false, message: '限制报名的人数为非必填项' },
                                                  {
                                                    validator: (rule, value, callback) => {
                                                      const jobRs = /^\d+?$/;
                                                      if (value && (!jobRs.test(value) || value == 0)) {
                                                        callback('请输入非0的正整数');
                                                      }
                                                      callback();
                                                    }
                                                  }
                                                ]
                                              })(
                                                <Input style={{ width: 60 }} />
                                              )
                                            } 人</div>
                                          }
                                        </Form.Item>
                                      </div>
                                    ) : ''
                                  }

                                </div>
                              ) : ''
                            }
                            <Form.Item label="签到时间" {...formItemLayout}>
                              {getFieldDecorator('signupRealDate', {
                                rules: [
                                  {
                                    required: true, validator: (rule, value, callback) => {
                                      //
                                      const { getFieldValue } = this.props.form;
                                      const signupRealDateDayValue = getFieldValue('signupRealDateDay');
                                      const signupRealDateStartTimeValue = getFieldValue('signupRealDateStartTime');
                                      const signupRealDateEndTimeValue = getFieldValue('signupRealDateEndTime');
                                      if (!signupRealDateDayValue || !signupRealDateStartTimeValue || !signupRealDateEndTimeValue) {
                                        callback('您已开启签到，签到时间为必填项');
                                      } else {
                                        callback();
                                      }
                                    }
                                  }
                                ]
                              })(
                                <div className={styles.formDateTimePicker} style={{ height: 33 }}>
                                  <Form.Item style={{ marginRight: 10, marginBottom: 0, float: 'left', }}>
                                    {getFieldDecorator(`signupRealDateDay`, {
                                      initialValue: courseStartTime ? moment(moment(courseStartTime).format('YYYY-MM-DD'), 'YYYY-MM-DD') : null,
                                      rules: [{
                                        // required: true,
                                        validator: (rule, value, callback) => this.handleValidateSignupRealDate({ rule, value, callback, type: 'day' })
                                      }]
                                    })(
                                      <DatePicker disabledDate={this.disabledDate} style={{ width: 170 }} onChange={(dates, dateStrings) => {
                                        const { setFieldsValue } = this.props.form;
                                        setFieldsValue({ 'signupRealDate': !!dates ? true : false })
                                      }} />
                                    )}
                                  </Form.Item>
                                  <Form.Item style={{ marginBottom: 0, float: 'left' }}>
                                    <span>
                                      {getFieldDecorator(`signupRealDateStartTime`, {
                                        // 培训开始前 20 分钟 至 开始后 10 分钟
                                        initialValue: (() => this.signInitialValue(courseStartTime, moment(courseStartTime).format('X') * 1000 - 20 * 60 * 1000))(),
                                        rules: [{
                                          // required: true,
                                          validator: (rule, value, callback) => this.handleValidateSignupRealDate({ rule, value, callback, type: 'startTime' })
                                        }]
                                      })(
                                        <TimePicker format='HH:mm' onChange={(time, timeString) => {
                                          const { setFieldsValue } = this.props.form;
                                          setFieldsValue({ 'signupRealDate': !!time ? true : false })
                                        }} size={'large'} placeholder="开始时间" style={{ width: 130 }} />
                                      )}
                                    </span>
                                  </Form.Item>
                                  <span style={{ margin: '0 5px', float: 'left' }}>至</span>
                                  <Form.Item style={{ marginBottom: 0, float: 'left' }}>
                                    <span>
                                      {getFieldDecorator(`signupRealDateEndTime`, {
                                        // 培训开始前 20 分钟 至 开始后 10 分钟
                                        initialValue: (() => this.signInitialValue(courseStartTime, moment(courseStartTime).format('X') * 1000 + 10 * 60 * 1000))(),
                                        rules: [{
                                          // required: true,
                                          validator: (rule, value, callback) => this.handleValidateSignupRealDate({ rule, value, callback, type: 'endTime' })
                                        }]
                                      })(
                                        <TimePicker format='HH:mm' onChange={(time, timeString) => {
                                          const { setFieldsValue } = this.props.form;
                                          setFieldsValue({ 'signupRealDate': !!time ? true : false })
                                        }} size={'large'} placeholder="结束时间" style={{ width: 130 }} />
                                      )}
                                    </span>
                                  </Form.Item>
                                </div>
                              )}
                            </Form.Item>
                            <Form.Item {...formItemLayout} label="是否签退">
                              {getFieldDecorator('signOutSwitched')(// needSignOut
                                <Switch onChange={() => {
                                  this.setState({
                                    needSignOutStatus: !this.state.needSignOutStatus,
                                  })
                                }} />
                              )}
                            </Form.Item>
                            {
                              this.state.needSignOutStatus ? (
                                <Form.Item label="签退时间" {...formItemLayout}>
                                  {getFieldDecorator('signupOutDate', {
                                    rules: [
                                      {
                                        required: true, validator: (rule, value, callback) => {
                                          //
                                          const { getFieldValue } = this.props.form;
                                          const day = getFieldValue('signoutDateDay');
                                          const startTimeValue = getFieldValue('signoutDateStartTime');
                                          const endTimeValue = getFieldValue('signoutDateEndTime');
                                          if (!day || !startTimeValue || !startTimeValue) {
                                            callback('您已开启签退，签退时间为必填项');
                                          } else {
                                            callback();
                                          }
                                        }
                                      }
                                    ]
                                  })(
                                    <div className={styles.formDateTimePicker} style={{ height: 33 }}>
                                      <Form.Item style={{ marginRight: 10, marginBottom: 0, float: 'left', }}>
                                        {getFieldDecorator(`signoutDateDay`, {
                                          initialValue: courseEndTime ? moment(moment(courseEndTime).format('YYYY-MM-DD'), 'YYYY-MM-DD') : null,
                                          rules: [{
                                            validator: (rule, value, callback) => this.handleValidateSignupOutDate({ rule, value, callback, type: 'day' })
                                          }]
                                        })(
                                          <DatePicker disabledDate={this.disabledDate} style={{ width: 170 }} onChange={(dates, dateStrings) => {
                                            const { setFieldsValue } = this.props.form;
                                            setFieldsValue({ 'signupOutDate': !!dates ? true : false })
                                          }} />
                                        )}
                                      </Form.Item>
                                      <Form.Item style={{ marginBottom: 0, float: 'left' }}>
                                        <span>
                                          {getFieldDecorator(`signoutDateStartTime`, {
                                            // 培训结束前 10 分钟 至 结束后 20 分钟
                                            initialValue: (() => this.signInitialValue(courseEndTime, moment(courseEndTime).format('X') * 1000 - 10 * 60 * 1000))(),
                                            rules: [{
                                              validator: (rule, value, callback) => this.handleValidateSignupOutDate({ rule, value, callback, type: 'startTime' })
                                            }]
                                          })(
                                            <TimePicker format='HH:mm' size={'large'} placeholder="开始时间" style={{ width: 130 }} onChange={(time, timeString) => {
                                              const { setFieldsValue } = this.props.form;
                                              setFieldsValue({ 'signupOutDate': !!time ? true : false })
                                            }} />
                                          )}
                                        </span>
                                      </Form.Item>
                                      <span style={{ margin: '0 5px', float: 'left' }}>至</span>
                                      <Form.Item style={{ marginBottom: 0, float: 'left' }}>
                                        <span>
                                          {getFieldDecorator(`signoutDateEndTime`, {
                                            // 培训结束前 10 分钟 至 结束后 20 分钟
                                            initialValue: (() => this.signInitialValue(courseEndTime, moment(courseEndTime).format('X') * 1000 + 20 * 60 * 1000))(),
                                            rules: [{
                                              validator: (rule, value, callback) => this.handleValidateSignupOutDate({ rule, value, callback, type: 'endTime' })
                                            }]
                                          })(
                                            <TimePicker format='HH:mm' size={'large'} placeholder="结束时间" style={{ width: 130 }} onChange={(time, timeString) => {
                                              const { setFieldsValue } = this.props.form;
                                              setFieldsValue({ 'signupOutDate': !!time ? true : false })
                                            }} />
                                          )}
                                        </span>
                                      </Form.Item>
                                    </div>

                                  )}</Form.Item>
                              ) : ''

                            }

                          </div>
                        </div>
                      </div>
                    </div>
                  ) : ''
                }


                <Form.Item label={this.trainModelStatus === "online" ? "选择人员" : "培训通知人员"} {...formItemLayout}>

                  {
                    this.trainModelStatus === 'online' ? (
                      getFieldDecorator('memberGroup', {
                        initialValue: this.state.memberRangeStatus, // 默认初始化时，为 自定义人员
                        rules: [{
                          required: true,
                          message: '请选择培训的人员'
                        }]
                      }
                      )(
                        <RadioGroup name="radiogroup" onChange={(e) => {
                          let val = e.target.value;
                          this.setState({
                            showCheckMember: val === 1 ? true : false,
                            memberRangeStatus: val,
                            addReleaseStudentReqDTOList: val === 2 ? [] : this.state.addReleaseStudentReqDTOList
                          })
                        }}>
                          <RadioButton value={0}>全部必修</RadioButton>
                          <RadioButton value={1}>自定义人员</RadioButton>
                          <RadioButton value={2}>全部选修</RadioButton>
                        </RadioGroup>
                      )
                    ) : getFieldDecorator('memberGroup', {
                      initialValue: this.state.memberRangeStatus,// memberRangeStatus 默认初始化时，为 全部人员
                      rules: [{
                        required: true,
                        message: '请选择培训的通知人员'
                      }]
                    }
                    )(
                      <RadioGroup name="radiogroup" onChange={(e) => {
                        let val = e.target.value;
                        this.setState({
                          showCheckMember: val === 1 ? true : false,
                          memberRangeStatus: val
                        })
                      }}>
                        <RadioButton value={0}>全部人员</RadioButton>
                        <RadioButton value={1}>自定义人员</RadioButton>
                      </RadioGroup>
                    )
                  }

                  {
                    this.state.showCheckMember ? (
                      <div className={styles.checkMemberSprite}>
                        <Button type="dashed" icon="plus" onClick={this.showCheckMemberModal}>添加人员</Button>
                        <p className={styles.checkMemberTitle}>已添加 <em className={styles.memberCount}>{addReleaseStudentCount}</em> 人 <a className={styles.memberRemoveAll} href="javascript:;" onClick={() => {
                          this.setState({
                            addReleaseStudentReqDTOList: [],
                            addReleaseStudentShowStatus: 'close'
                          }, () => {
                            message.success('清空选择成功')
                          })
                        }}>清空选择</a></p>
                        {/* style={{height: (this.state.addReleaseStudentShowStatus==='close'?96:'inherit')}} */}
                        <div className={styles.memberReleaseStudentList}>
                          {
                            addReleaseStudentReqDTOList.map((item, index) => {
                              return (
                                <Tag key={item.userName + index} closable onClose={this.deleteReleaseStudentHandler.bind(this, index)}>{item.userName}</Tag>
                              )
                            })
                          }

                        </div>
                        {
                          addReleaseStudentCount > 13 ? (// 配置初始化时，显示数据条数为 13 条
                            <div className={styles.checkMemberMoreBar} onClick={() => {
                              this.setState({
                                addReleaseStudentShowStatus: this.state.addReleaseStudentShowStatus === 'close' ? 'open' : 'close'
                              })
                            }}>
                              {
                                this.state.addReleaseStudentShowStatus === 'close' ? (
                                  <span>展开剩余 {addReleaseStudentCount - 13} 人<i className={styles.icoArrow}></i></span>
                                ) : (
                                    <span>收起显示列表<i className={styles.icoArrowOpen}></i></span>
                                  )
                              }

                            </div>
                          ) : ''
                        }
                      </div>
                    ) : ''
                  }
                </Form.Item>

                {
                  this.trainModelStatus === 'online' && this.state.memberRangeStatus === 1 ?
                    <Form.Item label="公开选修" {...formItemLayout}>
                      {
                        getFieldDecorator('pubElectiveEnable', {
                          valuePropName: 'checked',
                          initialValue: currentDataTrainingsManage.pubElectiveEnable === 1 ? true : false, // 默认初始化时，为 自定义人员
                        }
                        )(
                          <Switch />,
                        )
                      }
                      <Tooltip placement="right" title={'开启选修，则指定人员以外的，将成为选修人员'}>
                        <Icon type="question-circle-o" className={styles.tipsIcon} style={{ marginLeft: 5, position: 'relative', top: 2 }} />
                      </Tooltip>
                    </Form.Item> : ''
                }
              </Form>
            </div>

          </div>

          <div style={{ marginTop: 20, paddingBottom: 40 }}>
            <div style={{ textAlign: "center" }}>
              <Button className={styles.releaseBtn} onClick={this.props.handleCancel} disabled={this.props.loading}>取消</Button>
              <Button
                className={styles.releaseBtn}
                loading={this.props.loading}
                type="primary"
                onClick={this.handleSubmitHandler}
                // disabled={ !this.state.accountIdMap.size || !planStartTime || !planEndTime || loading}
                disabled={(this.state.addReleaseStudentReqDTOList.length == 0 && this.state.memberRangeStatus == 1)}
              >发布</Button>
            </div>
          </div>
        </Modal>
        {checkMemberModalVisible ? <CheckMemberModal {...this.CheckMemberModalProps} /> : ''}
        <Modal title="课程发布"
          visible={this.state.visible}
          onOk={this.checkHandleOk}
          onCancel={this.checkHandleCancel}
        >
          <p className={styles.checkWord}>是否发布课程？</p>
        </Modal>

      </div>
    );
  }
};
function select(state) {
  const trainingsManage = { ...state.trainingsManage };
  return { trainingsManage };
}
export default connect(select)(Form.create()(TrainingsManageModal));
