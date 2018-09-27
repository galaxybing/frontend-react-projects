var boz = require('@317hu/BOZ')
var versionEnv = process.env.RUN_ENV === 'start' ? process.env.VERSION_ENV : boz.env
var branchEnv = process.argv[2] || 'master'
boz['RUN_ENV'] = process.env.RUN_ENV || 'build';

if(versionEnv == 'sit'){
  boz['api'] = require('./api.sit.js');
}else if(versionEnv == 'uat'){
  boz['api'] = require('./api.uat.js');
}else if(/^v(\d){1,2}\.(\d){1,2}\.(\d){1,4}$/.test(versionEnv)){ // versionEnv=='prod'
  boz['api'] = require('./api.prod.js');
}else{// 包含 dev-local
  boz['api'] = require('./api.dev.js');
}

var repository = require('../../package.json').name;
var ver = versionEnv;
boz['env'] = versionEnv;

if (/^v(\d){1,2}\.(\d){1,2}\.(\d){1,4}$/.test(ver)) {
  // boz['assetsPublicPathConfig'] = '//resources.317hu.com/' + repository + '/' + ver + '/static/';
  // ???
  boz['assetsPublicPathConfig'] = '//resources.317hu.com/' + repository + '/' + ver + '/static/';
  boz['loginConfig'] = '//317hu.com/care-central/page/login';
} else if (boz[`RUN_ENV`] === 'dll') {
  boz['assetsPublicPathConfig'] = '/static';
  boz['loginConfig'] = '';
} else { // dev sit uat
  // boz['assetsPublicPathConfig'] = '//172.16.150.169:8012/' + repository + '/' + ver + '-' + branchEnv + '/' + repository + '/' + ver + '-' + branchEnv + '/static/';
  // 环境变量 移除
  boz['assetsPublicPathConfig'] = '//172.16.150.169:8012/' + repository + '/' + branchEnv + '/' + repository + '/' + branchEnv + '/static/';
  boz['loginConfig'] = '//' + ver + '.317hu.com/care-central/page/login';
}

module.exports = boz;
