import React, { Component } from 'react';
import { version as antdVersion, LocaleProvider } from 'antd';

// 基于版本进行判断：
let zhCN = null;
if (antdVersion.match(/^3\.(.+)/)) {
  zhCN = require('antd/lib/locale-provider/zh_CN');
}

function LocaleProviderSwitch(props, b){
  if (zhCN) {
    return (
      <LocaleProvider locale={zhCN}>
        {props.children}
      </LocaleProvider>
    )
  } else {
    return (
      <div>
        {props.children}
      </div>
    )
  }
}

// export default LocaleProviderSwitch
export { LocaleProviderSwitch }
