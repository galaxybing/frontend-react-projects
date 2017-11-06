var apiConfig;
// if(!window['VMCONFIG']){
  const versionEnv = process.env.VERSION_ENV || 'dev';
  // const branchEnv = process.env.BRANCH_ENV || 'master';
  const paramsEnv = process.argv;
  const branchEnv = paramsEnv[2] || 'master';
  if(versionEnv=='sit'||versionEnv=='sit-local'){
    apiConfig = require('./api.sit.js');
  }else if(versionEnv=='uat'){
    apiConfig = require('./api.uat.js');
  }else if(versionEnv=='prod'){
    apiConfig = require('./api.prod.js');
  }else{// 包含 dev-local
    apiConfig = require('./api.dev.js');
  }
/*
}else{
  apiConfig = window['VMCONFIG'];
}
*/
const repository = require('../../package.json').name;
// const ver = apiConfig['version'];
const ver = branchEnv;

if(/^v(\d){1,2}\.(\d){1,2}\.(\d){1,2}$/.test(ver)){
  apiConfig['assetsPublicPathConfig'] = `http://resources.317hu.com/${repository}/${ver}/static/`
  apiConfig['loginConfig'] = "http://317hu.com/care-central/page/login";
}else if(versionEnv=='dev-local'||versionEnv=='sit-local'){// dev sit uat
  apiConfig['assetsPublicPathConfig'] = `http://historyroute.317hu.com/com_317hu/${repository}/dist/static/`
  apiConfig['loginConfig'] = `http://${ver}.317hu.com/care-central/page/login`;
}else{// dev sit uat
  apiConfig['assetsPublicPathConfig'] = `http://172.16.150.169:8012/${repository}/${ver}-${branchEnv}/${repository}/${ver}-${branchEnv}/static/`
  apiConfig['loginConfig'] = `http://${ver}.317hu.com/care-central/page/login`;
}

module.exports = apiConfig;
