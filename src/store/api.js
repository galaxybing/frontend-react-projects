var boz = require('@317hu/BOZ')
var versionEnv = process.env.RUN_ENV === 'start' ? process.env.VERSION_ENV : boz.env
// var branchEnv = process.argv[2] || 'master' // node 环境变量不支持动态更新
boz['RUN_ENV'] = process.env.RUN_ENV || 'build';
boz['api'] = {};
boz['api']['dev'] = require('./api.dev.js');
boz['api']['sit'] = require('./api.sit.js');
boz['api']['uat'] = require('./api.uat.js');
boz['api']['prod'] = require('./api.prod.js');

var pkg = require('../../package.json');
var repository = pkg.name;
var branchEnv = pkg.branchEnv;
var ver = versionEnv;
boz['env'] = versionEnv;

if (boz[`RUN_ENV`] === 'dll' || boz[`RUN_ENV`] === 'local') {
  // '/nurse-training-course/dist/static/';
  boz['assetsPublicPathConfig'] = '/static/';
  boz['loginConfig'] = '';
} else if (boz[`RUN_ENV`] === 'build') { // dev sit uat
  // 版本变量 -> 从路径里面移除  分支变量？？由开发人员输入时，写入 package.json 属性 
  // __webpack_public_path__  fe-pub.317hu.com
  // http://historyroute.sit.317hu.com/hospital-admin/nurse-training-course/trainings-manage.html
  // http://demo.317hu.com/frontend-react-projects/feature-server-publish/static/vendors.dll.js
  //
  __webpack_public_path__ = '//demo.317hu.com/' + repository + '/' + branchEnv + '/static/'
  
  boz['assetsPublicPathConfig'] = '//demo.317hu.com/' + repository + '/' + branchEnv + '/static/';
  boz['loginConfig'] = ver === 'prod' ? '//hospital.317hu.com/hospital-admin/317hu-login/login.html' :  '//hospital.' + ver + '.317hu.com/hospital-admin/317hu-login/login.html';
}

module.exports = boz;
