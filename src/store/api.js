var boz = require('@317hu/BOZ')
var versionEnv = process.env.RUN_ENV === 'start' ? process.env.VERSION_ENV : boz.env
var branchEnv = process.argv[2] || 'master'
boz['RUN_ENV'] = process.env.RUN_ENV || 'build';
boz['api'] = {};
boz['api']['dev'] = require('./api.dev.js');
boz['api']['sit'] = require('./api.sit.js');
boz['api']['uat'] = require('./api.uat.js');
boz['api']['prod'] = require('./api.prod.js');

var repository = require('../../package.json').name;
var ver = versionEnv;
boz['env'] = versionEnv;

if (boz[`RUN_ENV`] === 'dll' || boz[`RUN_ENV`] === 'local') {
  // '/nurse-training-course/dist/static/';
  boz['assetsPublicPathConfig'] = '/static/';
  boz['loginConfig'] = '';
} else { // dev sit uat
  // 环境变量 移除
  
  // __webpack_public_path__  fe-pub.317hu.com
  __webpack_public_path__ = '//fe-pub.317hu.com/' + repository + '/' + branchEnv + '/' + versionEnv + '/static/'
  
  boz['assetsPublicPathConfig'] = '//fe-pub.317hu.com/' + repository + '/' + branchEnv + '/' + versionEnv + '/static/';
  boz['loginConfig'] = ver === 'prod' ? '//hospital.317hu.com/hospital-admin/317hu-login/login.html' :  '//hospital.' + ver + '.317hu.com/hospital-admin/317hu-login/login.html';
}

module.exports = boz;
