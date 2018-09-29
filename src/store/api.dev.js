module.exports = {
  "version": "dev",
  // mock
  // 'withCredentials': false,// 是因为使用了 mock_nurseTrainApi 所以不能携带 cookie
  "mock_nurseTrainApi": "//rap.317hu.com/mockjsdata/4",
  // 护士培训产品线
  "nurseTrainApi": "//nursetraindev.317hu.com",
  "www_form_urlencoded_nurseTrainApi": "//nursetraindev.317hu.com",
  // 课程中心
  "careCentralApi": "//dev.317hu.com",
  // 权限中心
  "privilegeApi": "//privilegesit.317hu.com:8081",
  // 交易中心
  "tradeApi": "//tc.dev.317hu.com",
  "satisfactionApi": "//survey.dev.317hu.com",
  "www_satisfactionApi": "//survey.dev.317hu.com",
  // 用户中心
  'userCentralApi': '//usercentral.dev.317hu.com:8081',
  'www_form_urlencoded_userCentralApi': '//usercentral.dev.317hu.com:8081',
  //增值服务的域名
  "payServer": "http://course.dev.317hu.com",
  //宣教
  "education": 'http://hospital.dev.317hu.com',
}
