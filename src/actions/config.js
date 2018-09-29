'use strict';
import type { Action, ThunkAction } from './types';
const storage = window.localStorage;
module.exports = {
    loadConfig: ():ThunkAction =>{
        //let url = ('http://'+location.host+location.pathname);
        return (dispatch, getState) => {
            dispatch({type:'LOADED_CONFIG_DATA'});
        }
    },
    loadAuth: ()=>{
      var url = window.location.href;
    },
};
