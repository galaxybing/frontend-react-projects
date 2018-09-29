import { message } from 'antd';
import request from '../core/_utils/request';
import { getCache } from '../core/_utils/storage';
import { IEVersion } from '../core/_utils/common';
import serialize from '../core/_utils/serialize';

const { hospitalId, userId, roleId, depts } = getCache('profile') || {};

module.exports = {
    // 获取视频插题详情
    getVideoInsertDetail: ({ id, modalType }) => {
        return (dispatch) => {
            request({
                url: `/nurse-train-web/nursetrain/web/videoInsertTitle/v2.4.2/searchForVideoInsertTitle?contentId=${id}`,
                options: {
                    method: 'GET'
                },
                api: 'nurseTrainApi'
            }).then(data => {
                if (!data.success) {
                    message.error(message.errMsg);
                    return;
                }
                dispatch({
                    type: 'insertQuestions/getVideoInsertQuestions',
                    payload: { data: data, modalType }
                })
            });
        }
    },
    // 视频插题新增
    addVideoInsert: (values) => { // ？？没有找到相关引用的地方 routes/InsertQuestions.js
        return request({
            url: '/nurse-train-web/nursetrain/web/videoInsertTitle/write/v2.4.2/videoInsertTitle',
            options: {
                method: 'POST',
                data: JSON.stringify(values)
            },
            api: 'nurseTrainApi'
        });
    }
}