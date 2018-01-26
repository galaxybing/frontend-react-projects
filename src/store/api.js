var apiConfig = {};
const versionEnv = process.env.VERSION_ENV || 'dev';
const versionLoc = process.env.VERSION_LOC || 'publish'; // local
// const branchEnv = process.env.BRANCH_ENV || 'master';
const paramsEnv = process.argv;
const branchEnv = paramsEnv[2] || 'master';

if(versionEnv=='sit'){
  apiConfig = require('./api.sit.js');
}else if(versionEnv=='uat'){
  apiConfig = require('./api.uat.js');
}else if(/^v(\d){1,2}\.(\d){1,2}\.(\d){1,2}$/.test(versionEnv)){ // versionEnv=='prod'
  apiConfig = require('./api.prod.js');
}else{// 包含 dev-local
  apiConfig = require('./api.dev.js');
}

const repository = require('../../package.json').name;
// apiConfig['repository'] = repository;

const ver = versionEnv;

if(/^v(\d){1,2}\.(\d){1,2}\.(\d){1,2}$/.test(ver)){
  apiConfig['assetsPublicPathConfig'] = `http://resources.317hu.com/${repository}/${ver}/static/`
  apiConfig['loginConfig'] = "http://317hu.com/care-central/page/login";
}else if(versionLoc === 'local'){// dev sit uat
  apiConfig['assetsPublicPathConfig'] = `http://historyroute.317hu.com/static/`
  apiConfig['loginConfig'] = `http://${ver}.317hu.com/care-central/page/login`;
}else{// dev sit uat
  apiConfig['assetsPublicPathConfig'] = `http://172.16.150.169:8012/${repository}/${ver}-${branchEnv}/${repository}/${ver}-${branchEnv}/static/`
  apiConfig['loginConfig'] = `http://${ver}.317hu.com/care-central/page/login`;
}

module.exports = apiConfig;
