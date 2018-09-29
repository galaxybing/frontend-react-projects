'use strict';

import type { Action, ThunkAction } from '../actions/types';

export type Config = {
    Network: string;
};

const initialState: Config = {
    initCheckValue: {},//需要初始化选中的值，传入进来的
    isShowMoreMap: new Map([]),   // 是否显示多行
    isShowSubFiltrateMap: new Map([]),  // 是否显示子级
    subFiltrateMap: new Map([]),   // 子级list
    selectedOptionsMap: new Map([]),
    courseClassificationList: [],
    questionClassifyList: [],
    tiersList: [],
    trainClassifyList: [],
    publicTrainClassifyList: [],
    publicQuestionClassifyList: [],
    publicDeptList: [],  // 科室（2.7.4）
    publicSubjectList: [],  // 科目（2.7.4）
    filtrateItem: [],
    selectedList: [],
    isShowPayPopoverMap: new Map([]),
    isPopoverVisibleMap: new Map([]),
    payCodeVisible: false,  // 支付二维码弹框
    orderInfo: {},  // 支付订单信息
    qrcode: null,  // 支付二维码
    exerciseTrade: {},  // 剩余免费
    payCodeModalType: 'alipay',
    payStatus: null,
    payStatusModalVisible: false,
    publicHospitalId: null,
    balanceFee: null,
    balanceConfirmLoading: false,  // 余额支付确认loading
    payLoading: false,
}

function filtrate(state: Config = initialState, action: Action) {
    if (action.type === 'filtrate/resetState') {
        return {
          ...state,
          initCheckValue: {}, // 需要初始化选中的值，传入进来的
          isShowMoreMap: new Map([]),   // 是否显示多行
          isShowSubFiltrateMap: new Map([]),  // 是否显示子级
          subFiltrateMap: new Map([]),   // 子级list
          selectedOptionsMap: new Map([]),
          // courseClassificationList: [],
          // questionClassifyList: [],
          // tiersList: [],
          // trainClassifyList: [],
          // publicTrainClassifyList: [],
          // publicQuestionClassifyList: [],
          // filtrateItem: [],
          // selectedList: [],
          isShowPayPopoverMap: new Map([]),
          isPopoverVisibleMap: new Map([]),
          payCodeVisible: false,  // 支付二维码弹框
          orderInfo: {},  // 支付订单信息
          qrcode: null,  // 支付二维码
          exerciseTrade: {},  // 剩余免费
          payCodeModalType: 'alipay',
          payStatus: null,
          payStatusModalVisible: false,
          publicHospitalId: null,
          balanceFee: null,
          balanceConfirmLoading: false,  // 余额支付确认loading
          payLoading: false
        }
    }
    
    if (action.type === 'filtrate/saveSelectedByHospital') {
      const { isShowSubFiltrateMap, selectedOptionsMap } = action.payload;
      return { ...state, isShowSubFiltrateMap, selectedOptionsMap };
    }
    
    return state;
}
module.exports = filtrate;
