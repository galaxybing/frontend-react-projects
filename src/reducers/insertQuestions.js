'use strict';

import type { Action, ThunkAction } from '../actions/types';

export type Config = {
    Network: string;
};
const initialState: Config = {
    videoInsertQuestions: {},
    modalVisible: false,
    insertQuestionsList: new Map([]),  // 已经插入的试题
    modalType: 'create',
    insertQuestionsCount: 0
}

function insertQuestions(state: Config = initialState, action: Action) {
    if (action.type === 'insertQuestions/save') {
        return {
            ...state,
            ...action.payload,
        }
    }
    if (action.type === 'insertQuestions/getVideoInsertQuestions') {
        const { data, modalType } = action.payload;
        const insertQuestionsList = new Map();
        const resData = data.data;

        if (resData.videoRespDTOList && resData.videoRespDTOList.length) {
            for (const item of resData.videoRespDTOList) {
                const insertQByVideo = [];   // 每个video下插入的试题
                for (const qItem of item.videoInsertList) {
                    const param = {
                        insertTime: qItem.insertTime,
                        resourceId: qItem.resourceId,
                        exerciseId: qItem.exerciseId,
                        exerciseName: qItem.exerciseName,
                        exerciseAnswer: qItem.exerciseAnswer,
                        exerciseType: qItem.exerciseType,
                        exerciseExplainStr: qItem.exerciseExplainStr,
                        exerciseItem: qItem.exerciseItem
                    };
                    insertQByVideo[insertQByVideo.length] = param;
                }
                insertQuestionsList.set(item.id, insertQByVideo);
            }
        }

        return {
            ...state,
            modalType,
            modalVisible: true,
            videoInsertQuestions: data.data,
            insertQuestionsList
        }
    }
    if (action.type === 'insertQuestions/saveInsertQuestions') {
        const { insertQuestionsList } = state;
        const { questionItem } = action.payload;
        const selectedQuestion = insertQuestionsList.get(questionItem.resourceId);
        selectedQuestion[selectedQuestion.length] = questionItem;
        insertQuestionsList.set(questionItem.resourceId, selectedQuestion);
        return { ...state, insertQuestionsList };
    }
    if (action.type === 'insertQuestions/deleteInsertQuestions') {
        const { insertQuestionsList } = state;
        const { resourceId, exerciseId, index } = action.payload;
        const selectedQuestion = insertQuestionsList.get(resourceId);
        selectedQuestion.splice(index, 1);
        insertQuestionsList.set(resourceId, selectedQuestion);
        return { ...state, insertQuestionsList };
    }
    if (action.type === 'insertQuestions/hideModal') {
        let insertQuestionsListData = state.insertQuestionsList;
        let insertQuestionsCount = 0;
        insertQuestionsListData.forEach((value, key, map) => {
            if (value.length > 0) {
                insertQuestionsCount++;
            }
        });
        return {
            ...state,
            modalVisible: false,
            videoInsertQuestions: {},
            insertQuestionsList: new Map([]),
            insertQuestionsCount
        };
    }
    return state;
}

module.exports = insertQuestions;