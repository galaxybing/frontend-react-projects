'use strict';

import request from '../core/_utils/request';
import { saveCache, getCache } from '../core/_utils/storage';
const Parse = require('../core/_utils/request');

module.exports = {
  common: (source) => {
    return async (dispatch, getState) => {
      let results = await request({ method: 'login/checkIn', body: source });
      return results;
      /** 或者直接触发存储状态变化
        * Parse.run().then(()=>{
        *  dispatch({type:"LOAD_SITE_INDEX", action: data});
        * })
       */
    }
  },
  checkIn: (source) => {
    return async (dispatch, getState) => {
      await Parse.checkIn();
    }
  },
  getAdminInfo: () => {
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
          saveCache('profile', res.data);  // 存储
          dispatch({ type: "GET_ADMIN_INFO", data: { profile: res.data } });
          window[`GET_ADMIN_INFO`] = { profile: res.data }; // 兼容 处理 护士培训跳转其他项目时，profile 缓存被重置问题；
        }
        return res;
      })
      //return null;
    }
  },
  getTopNavRest: () => {
    return (dispatch) => {
      request({
        url: '/privilege-web/privilege/topNavRest/newGetTopNavInfo', options: {
          method: 'GET',
        }, api: 'privilegeApi'
      }).then((res) => {
        if (res.success) {
          saveCache('topNavRest', res.data);  // 存储
          // dispatch({ type: "GET_TOP_NAV_INFO", data: { topNavRest: res.data } });
        }
      })
    }
  },
  getPrivilegeMemu: () => {
    return (dispatch) => {
      request({
        url: '/nurse-train-web/nursetrain/web/user/v2.4.2/userPrivilegeMemu', options: {
          method: 'GET',
        }, api: 'nurseTrainApi'
      }).then((res) => {
        /*
         * 与 topNavRest 字段功能重复，所以这里移除：
         *
        let result = res.data;
        let hostStr = '';
        for(let i=0, len=result.length; i<len; i++){
          let item = result[i].childPrivilegeRespDTO;
          let reg = /^http(s{0,1}):\/\/([^\/]+)/g;
          let url = '';
          if(item && item.length>0 && item[0].restUrl){
            url = item[0].restUrl;
            hostStr = url.match(reg);
            break;
          }
        }

        saveCache('ENV_HOSTS_NAME', hostStr);  // 存储 且未携带最后的反斜杠 / 
        */
        dispatch({ type: "GET_PRIVILEGE_MENU", data: { menuList: res.data } });
      })
    }
  },
  checkout: (params) => {
    return (dispatch) => {
      Parse.run({
        url: '/nurse-train-web/nursetrain/web/user/logout', options: {
          method: 'POST',
          data: {
            ...params
          }
        }, api: 'nurseTrainApi'
      }).then((res) => {
        if (res.success) {
          window.location.href = res.errMsg;
        } else {
          // message.error(res.errMsg);
        }
      })
    }
  },
  hospitalChange: (hospitalId) => {
    return (dispatch) => {
      request({
        url: '/userCentral-web/user/hospitalACountRest/changeUserHospital',
        options: {
          method: 'POST',
          data: { hospitalId }
        },
        api: 'www_form_urlencoded_usercentralApi'
      }).then((res) => {
        if (!res.success) {
          message.error('切换失败！');
          return;
        }
        window.location.href = res.data.pageIndex;
      })
    }
  },
  getServerTimestamp: (type) => {
    return (dispatch) => {
      return Parse.run({
        url: `/nurse-train-web/nursetrain/web/basic/read/v2.7.3/systemTime/${type}`, options: {
          method: 'GET',
        }, api: 'www_form_urlencoded_nurseTrainApi'
      })
    }
  },
  getFiltrateMenu: (query) => {
    return (dispatch) => {
      return Parse.run({
        url: `/nurse-train-web/nursetrain/web/basic/read/v1.0.1/dataDictionaryList?groupId=${query.groupId}&type=${query.type}&innerFromPage=0`, options: {
          method: 'GET',
        }, api: 'nurseTrainApi'
      })
    }
  },
  queryPublicHospital: () => {
    return (dispatch) => {
      return Parse.run({
        url: `/nurse-train-web/nursetrain/web/basic/read/v2.2.6/publicHospital?innerFromPage=0`, options: {
          method: 'GET',
        }, api: 'nurseTrainApi'
      })
    }
  },
  queryTrainClassifyList: (query) => {
    return (dispatch) => {
      return Parse.run({
        url: `/nurse-train-web/nursetrain/web/basicDict/read/v2.2.7/dict?hospitalId=${query.hospitalId ? query.hospitalId : getCache('profile').hospitalId}&type=TRAINCLASSIFY`, options: {
          method: 'GET',
        }, api: 'nurseTrainApi'
      })
    }
  },
};
