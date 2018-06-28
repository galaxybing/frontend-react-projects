/* 监控客户端插件 */
import Raven from 'raven-js';

window.onerror = function(msg, url, lineNo, columnNo, error) {
  if (msg != "Script error." && !url) {
    return true;
  }
  if (!error) { // Non-Error exception captured with keys: col, line, url
    return true;
  }
  setTimeout(function() {
    var data = {};
    data.url = url;
    data.line = lineNo;
    data.col = columnNo || (window.event && window.event.errorCharacter) || 0;
    if (!!error && !!error.stack) {
      data.msg = error.stack.toString();
    } else { // Non-Error exception captured with keys: col, line, url
      data.url = null;
      data.line = null;
      data.col = null;
      data.msg = null;
      data.galaxyw = 'author';
    }
    Raven.captureException(data, {
      level: 'info', // one of 'info', 'warning', or 'error'
      logger: 'window',
      tags: { git_commit: 'window' }
    });
    //把data上报到后台！
  }, 0);
  return true;
}

window.$Raven = Raven; // 这是为了方便后续捕捉异步操作和接口中的异常
// Raven
//     .config('http://f15f9169a5b34024a64bfd696b89d1fa@sentry.317hu.com/3')
//     .install();
export default window.$Raven;
