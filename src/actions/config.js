import request from '../core/_utils/request';

export function logout() {
  return {
    type: 'USER_LOGGED_OUT'
  }
}

export function getAdminInfo() {
  return (dispatch) => {
    return request({
      url: '/nurse-train-web/nursetrain/web/user/getAdminInfo',
      options: {
        method: 'POST',
        data: {}
      },
      api: 'nurseTrainApi'
    }).then((res) => {
      if (res && res.success) {
        dispatch({ type: "GET_ADMIN_INFO", data: { profile: res.data } });
      }
      return res;
    })
    //return null;
  }
}


