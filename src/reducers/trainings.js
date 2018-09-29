'use strict';
/* 已发布培训 列表 */
import type { Action, ThunkAction } from '../actions/types';

const initialFilter = {
  levelCode: '0',  // 0: 全部； 1: 科级别； 2: 院级别
  rangeType: '0',  // 0: 本月计划；2: 后续计划；3: 已结束
  type: '0',       // 0: 全部；1: 我的
  name: null,      // 课程名称
  pageNum: 1,
  pageSize: 10
};

export type Config = {
  Network: string;
};

const initialState: Config = {
  loading: false,
  releaseCourseCounts: {},
  filter: initialFilter,
  deptList: [],
  dataSource: {
    tableList: [],
    pagination: {}
  },
}

function trainings(state: Config = initialState, action: Action) {
  if (action.type === 'trainings/save') {
    return {
      ...state,
      ...action.payload,
    }
  }

  if (action.type === 'trainings/resetState') {  // 清除state
    return {
      ...state,
      loading: false,
      releaseCourseCounts: {},
      filter: initialFilter,
      dataSource: {
        tableList: [],
        pagination: {}
      }
    }
  }

  if (action.type === 'trainings/showModal') {
    return { ...state, ...action.payload, userManageModalVisible: true };
  }
  if (action.type === 'trainings/hideModal') {
    return {
      ...state,
      userManageModalVisible: false,
      releasePaperDate: {},
      releaseUserData: {},
      defaultSelectedIds: new Map([])
    };
  }
  if (action.type === 'trainings/formatDepts') {
    const { data } = action.payload;
    let depts = [];
    for (const item of data) {
      for (const child of item.children) {
        let param = {
          id: child.id,
          name: child.name,
        }
        if (data.length > 1) {
          param = {
            ...param,
            parentName: item.name,
            parentId: item.id
          }
        }
        depts.push(param);
      }
    }
    return {
      ...state,
      deptList: depts
    }
  }
  if (action.type === 'trainings/courseReleaseLoading') {
    const { loading } = state;
    return {
      ...state,
      loading: !loading,
    }
  }
  // if (action.type === 'trainings/saveChangeUserManage') {
  // 
  // }
  return state;
}
module.exports = trainings;
