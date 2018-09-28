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
  boz['assetsPublicPathConfig'] = '/static/';
  boz['loginConfig'] = '';
} else { // dev sit uat
  // 环境变量 移除
  boz['assetsPublicPathConfig'] = '//fe-pub.317hu.com/' + repository + '/' + branchEnv + '/static/';
  boz['loginConfig'] = '//hospital.' + ver + '.317hu.com/hospital-admin/317hu-login/login.html';
}

module.exports = boz;
