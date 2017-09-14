module.exports = {
  "version": "dev",
  // mock
  // 'withCredentials': false,// 是因为使用了 mock_nurseTrainApi 所以不能携带 cookie
  "mock_nurseTrainApi": "//rap.317hu.com/mockjsdata/4",
  // proxy
  "nurseTrainApi": "//nursetraindev.317hu.com",
    // 172.16.120.18  shengbing.317hu.com
    // 172.16.120.32  hongkangjie.317hu.com
    // 172.16.110.54  liuxianliang.317hu.com
  "www_form_urlencoded_nurseTrainApi": "//nursetraindev.317hu.com",
  "careCentralApi": "//dev.317hu.com",
  "privilegeApi": "//privilegesit.317hu.com:8081",
  "tradeApi": "//tc.dev.317hu.com"
}