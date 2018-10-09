var boz = require('@317hu/BOZ')
var versionEnv = process.env.RUN_ENV === 'start' ? process.env.VERSION_ENV : boz.env
// var branchEnv = process.argv[2] || 'master' // node 环境变量不支持动态更新
boz['RUN_ENV'] = process.env.RUN_ENV || 'build';
boz['api'] = {};
boz['api']['dev'] = require('./api.dev.js');
boz['api']['sit'] = require('./api.sit.js');
boz['api']['uat'] = require('./api.uat.js');
boz['api']['prod'] = require('./api.prod.js');

var ver = versionEnv;
boz['env'] = versionEnv;
if (boz[`RUN_ENV`] === 'dll' || boz[`RUN_ENV`] === 'local') {
  // '/nurse-training-course/dist/static/';
  boz['assetsPublicPathConfig'] = '/static/';
  boz['loginConfig'] = '';
} else if (boz[`RUN_ENV`] === 'build') { // dev sit uat??构建运行以后的静态部署文件里面，都是 build 值；
                                         // 因为 process.env.RUN_ENV 值会不存在
  var repository = require('../../package.json').name;

  var pubTemp = require('../../pub.json');
  var branchEnv = pubTemp.branchEnv; // 生产环境下，分支环境名称为 hash
  // 版本变量 -> 从路径里面移除  分支变量？？由开发人员输入时，写入 package.json 属性 
  // __webpack_public_path__  fe-pub.317hu.com
  // http://historyroute.sit.317hu.com/hospital-admin/nurse-training-course/trainings-manage.html
  // http://demo.317hu.com/frontend-react-projects/feature-server-publish/static/vendors.dll.js
  
  // 影响 按需加载的资源路径
  // 本地构建 需要移除掉该动态变量；不然 后续的资源路径，将不能保持相对路径，而是使用了下面的地址
  if (ver === 'prod') {
    __webpack_public_path__ = '//resources.317hu.com/' + repository + '/' + branchEnv + '/static/'
  } else {
    __webpack_public_path__ = '//resources-intra.317hu.com/' + repository + '/' + branchEnv + '/static/'
  }

  //
  // 影响 index.html 的资源路径生成（prod 环境时，通过 bone 操作实现 index.html 引用路径的更换？？）
  boz['assetsPublicPathConfig'] = '//resources-intra.317hu.com/' + repository + '/' + branchEnv + '/static/';

  boz['loginConfig'] = ver === 'prod' ? '//hospital.317hu.com/hospital-admin/317hu-login/login.html' :  '//hospital.' + ver + '.317hu.com/hospital-admin/317hu-login/login.html';
}

module.exports = boz;
