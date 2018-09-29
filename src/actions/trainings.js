import { message } from 'antd';
import request from '../core/_utils/request';
import { getCache } from '../core/_utils/storage';
import { IEVersion } from '../core/_utils/common';
import serialize from '../core/_utils/serialize';
import { fetchUserManageList } from './trainingManage';

const { hospitalId, roleId, depts = '', regionIds, userId } = getCache('profile') || {};
const { fromPage, hospitalId: innerHospitalId } = getCache('innerFromPage') || {};

module.exports = {
    getTrainingsList: (query) => {
        let role = 2;
        // 权限
        if (roleId === 10004) {
            role = 3;
        } else if (roleId === 10001) {
            role = 1;
        }

        const params = {
            hospitalId,
            loginUserId: userId,
            depts,
            role,
            ...query
        };
        if (IEVersion()) {
            params.t = Math.random();
        }
        return (dispatch) => {
            dispatch({
                type: 'trainings/save',
                payload: { loading: true }
            });
            request({
                url: `/nurse-train-web/nursetrain/web/course/release/v1.0.1/releases?${serialize(params)}`,
                options: {
                    method: 'GET'
                },
                api: 'nurseTrainApi'
            }).then(data => {
                dispatch({
                    type: 'trainings/save',
                    payload: { loading: false }
                });
                if (!data.success) {
                    message.error(data.errMsg);
                    return;
                }
                dispatch({
                    type: 'trainings/save',
                    payload: {
                        dataSource: {
                            tableList: data.data.result,
                            pagination: {
                                total: data.data.totalCount,
                                current: data.data.pageNumber,
                            }
                        }
                    }
                });
            });
        }
    },
    getReleaseCourseCount: (query) => {
        let role = 2;
        // 权限
        if (roleId === 10004) {
            role = 3;
        } else if (roleId === 10001) {
            role = 1;
        }
        const params = {
            hospitalId,
            loginUserId: userId,
            role,
            ...query
        };
        delete (params.pageNum);
        delete (params.pageSize);
        return (dispatch) => {
            request({
                url: `/nurse-train-web/nursetrain/web/course/release/v1.0.1/counts?${serialize(params)}`,
                options: {
                    method: 'GET'
                },
                api: 'nurseTrainApi'
            }).then(data => {
                if (!data.success) {
                    message.error(data.errMsg);
                    return;
                }
                dispatch({
                    type: 'trainings/save',
                    payload: {
                        releaseCourseCounts: data.data
                    }
                });
            })
        }
    },
    // 撤销培训
    cancelTraining: (releaseId) => {
        const values = {
            loginUserId: userId,
            releaseId
        }
        return request({
            url: '/nurse-train-web/nursetrain/web/course/release/v1.0.1/release',
            options: {
                method: 'PUT',
                data: JSON.stringify(values)
            },
            api: 'nurseTrainApi'
        });
    },
    // 删除已撤销培训
    deleteCancelTraining: (releaseId) => {
        const values = {
            loginUserId: userId,
            roleId,
            depts,
            releaseId
        };
        return request({
            url: '/nurse-train-web/nursetrain/web/course/release/v2.9.3/deleteCourseRelease',
            options: {
                method: 'PUT',
                data: JSON.stringify(values)
            },
            api: 'nurseTrainApi'
        });
    },

    saveChangeUserManage: (source, history) => {
        
        return (dispatch) => {
            return request({
                url: '/nurse-train-web/nursetrain/web/course/release/v2.2.6/releases/students',
                options: {
                    method: 'POST',
                    data: JSON.stringify(source)
                },
                api: 'nurseTrainApi'
            }).then((res) => {
                if (!res.success) {
                    message.error(res.errMsg);
                    return;
                }
                message.success('发布成功');
                dispatch({
                    type: 'trainings/hideModal'
                });
                dispatch({
                  type: 'trainings/courseReleaseLoading'
                });
                history.push({
                    pathname: '/hospital-admin/nurse-training-course/trainings.html',
                });
            });
        }
    },
    fetchReleaseUserList: ({ payload: { ...param } }) => {
        return (dispatch, getState) => {
            const state = getState();
            const defaultSelectedIds = state.trainings.defaultSelectedIds;
            fetchUserManageList({ ...param }).then((res) => {
                if (!res || !res.success) return;

                for (let i = 0; i < res.data.pager.result.length; i++) {
                    const resource = res.data.pager.result[i];
                    if (resource.status === 1) {
                        defaultSelectedIds.set(resource.accountId, resource.accountId);
                    }
                }

                dispatch({
                    type: 'trainings/save',
                    payload: {
                        releasePaperDate: res.data,
                        releaseUserData: res.data.pager,
                        defaultSelectedIds,
                        defaultSelectedRowKeys: [...defaultSelectedIds.keys()]
                    }
                });
            });
        }

    }
}