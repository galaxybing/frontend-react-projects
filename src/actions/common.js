'use strict';

import request from '../core/_utils/request';

module.exports = {
  getMethod: (query) => {
    return request({
      url: ``,
      options: {
        method: 'GET'
      },
      api: 'nurseTrainApi'
    })
  },
}
