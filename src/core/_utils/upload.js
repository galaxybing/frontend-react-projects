import { message } from 'antd';
import * as Service from '../../actions/common';
import { randomWord } from '../../core/_utils/common';

export function customRequest(info) {
  let bucket = 'file';
  let type = 1;
  if (/video*/.test(info.file.type)) {
    bucket = 'video';
    type = 2;
  }
  Service.commonToken({ bucket, type }).then((data) => {
    if (!data.success) {
      message.error(data.errMsg);
      info.onError();
      return;
    }
    const token = data.uptoken;
    Service.domainUrl({ bucket }).then((data) => {
      if (!data.success) {
        message.error(data.errMsg);
        info.onError();
        return;
      }
      const domain = data.url;
      const key = randomWord(30);
      const oMyForm = new FormData();
      oMyForm.append('domain', domain);
      oMyForm.append('token', token);
      if (/video*/.test(info.file.type)) {
        Service.addResourceTemp(key);
        oMyForm.append('key', key);
      }
      oMyForm.append('file', info.file);
      const oReq = new XMLHttpRequest();
      oReq.upload.onprogress = function (e) {
        if (e.total > 0) {
          e.percent = (e.loaded / e.total) * 100;
        }
        info.onProgress(e);
      };
      oReq.open('POST', '//upload.qiniup.com');
      oReq.onload = function (oEvent) {
        if (oReq.status === 200) {
          info.onSuccess({ response: oReq.response, domain });
        } else {
          info.onError(oReq.response);
        }
      };
      oReq.onerror = function (oEvent) {
        info.onError(oReq.response);
      };
      oReq.send(oMyForm);
    }).catch((err) => {
      console.log(err);
      info.onError();
    });
  }).catch((err) => {
    info.onError();
  });
}
export function beforeUploadByCourseware(file) {
  let isType = false;
  let isLength = false;
  if (file && file.name) {
    isLength = file.name.length > 50;
    if (isLength) {
      message.error('课件名称过长（50个字符以内）!');
    }
  }
  if (file && file.type) {
    isType = (/video*/.test(file.type) || file.type === 'application/pdf'
      || /word*/.test(file.type)
      || /powerpoint*/.test(file.type)
      || /officedocument.presentationml.presentation*/.test(file.type));
  } else if (file && file.name) {
    const fileName = file.name.split('.')[file.name.split('.').length - 1];
    isType = (/(docx?|pptx?|pdf)/i.test(fileName));
  }
  if (!isType) {
    message.error('只接受视频或PDF/PPT/WORD文档上传！');
  }
  let isSize = true;
  if (/video*/.test(file.type)) {
    isSize = file.size / 1024 / 1024 < 1000;
    if (!isSize) {
      message.error('视频大小必须控制在1G以内!');
    }
  } else {
    isSize = file.size / 1024 / 1024 < 50;
    if (!isSize) {
      message.error('文档大小必须控制在50MB以内!');
    }
  }
  return isType && isSize && !isLength;
}
