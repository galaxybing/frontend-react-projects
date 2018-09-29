'use strict';
/* 已发布培训 列表 */
import type { Action, ThunkAction } from '../actions/types';

export type Config = {
  Network: string;
};

const initialState: Config = {
  courseData: null,
  isRelease: false,
  pageType: null,
  insertQuestionsModalVisible: false,  // 视频插题
  publishModalVisible: false,
  publicHospitalId: null
}

function courseDetails(state: Config = initialState, action: Action) {
  if (action.type === 'courseDetails/showPublishModal') {
    return { ...state, ...action.payload, publishModalVisible: true };
  }
  
  if (action.type === 'courseDetails/hidePublishModal') {
    return { ...state, publishModalVisible: false };
  }
  
  if (action.type === 'courseDetails/save') {
    const { courseData, isRelease } = action.payload;
    return { ...state, courseData, isRelease };
  }
  
  return state;
}
module.exports = courseDetails;
