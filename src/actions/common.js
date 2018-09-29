import request from '../core/_utils/request';
import { getCache } from '../core/_utils/storage';
import serialize from '../core/_utils/serialize';

const { hospitalId, roleId, userId, depts = '', regionIds } = getCache('profile') || {};
const { fromPage, hospitalId: innerHospitalId } = getCache('innerFromPage') || {};

module.exports = {
  // 课程分类
  getCategories: (query) => {
    const params = {
      innerFromPage: fromPage,
      ...query
    }
    return request({
      url: `/nurse-train-web/nursetrain/web/basic/read/v1.0.1/dataDictionaryList?${serialize(params)}`,
      options: {
        method: 'GET'
      },
      api: 'nurseTrainApi'
    })
  },
  // 层级，职称，职务数据字典
  getDicData: () => {
    return request({
      url: '/nurse-train-web/nursetrain/web/basicDict/read/v3.5.3.1/dic',
      options: {
        method: 'GET'
      },
      api: 'nurseTrainApi'
    })
  },
  // 分类
  getClassifyList: (query) => {
    const params = {
      innerFromPage: fromPage,
      hospitalId: query.hospitalId || hospitalId,
      ...query
      // type: 'TRAINCLASSIFY'
    };
    return request({
      url: `/nurse-train-web/nursetrain/web/basicDict/read/v2.2.7/dict?${serialize(params)}`,
      options: {
        method: 'GET'
      },
      api: 'nurseTrainApi'
    })
  },
  // 获取公共医院
  getPublicHospital: () => {
    const params = {
      innerFromPage: fromPage,
    };
    return request({
      url: `/nurse-train-web/nursetrain/web/basic/read/v2.2.6/publicHospital?${serialize(params)}`,
      options: {
        method: 'GET'
      },
      api: 'nurseTrainApi'
    })
  },
  // 获取tag类型的字典(科室、科目)
  getTagDict: (query) => {
    const params = {
      hospitalId: -1,
      ...query
    };
    return request({
      url: `/nurse-train-web/nursetrain/web/basicDict/read/v2.7.3/tagDict?${serialize(params)}`,
      options: {
        method: 'GET'
      },
      api: 'nurseTrainApi'
    });
  },
  // 课程/试卷发布--选择参与人员
  fetchReleaseUsers: (query) => {
    return request({
      url: `/nurse-train-web/nursetrain/web/course/release/v2.7.9/users?${serialize(query)}`,
      options: {
        method: 'GET'
      },
      api: 'nurseTrainApi'
    })
  },
  // 获取组织架构树
  fetchHospitalTree: () => {
    const params = {
      innerFromPage: fromPage,
    };
    return request({
      url: `/nurse-train-web/nursetrain/web/hospital/v2.7.9/hospitalTree?${serialize(params)}`,
      options: {
        method: 'GET'
      },
      api: 'nurseTrainApi'
    });
  },
  // 获取科室
  getDepts: (query = {}) => {
    let role = 2;
    let deptIds = '';
    if (roleId == 10001) {
      role = 1;
      deptIds = regionIds;
    } else if (roleId == 10004) {
      role = 3;
    }
    let params = {
      innerFromPage: fromPage,
      hospitalId,
      role,
      depts: deptIds
    };
    if (fromPage) {
      params.hospitalId = innerHospitalId;
    } else if (query.hospitalId) {
      params.hospitalId = query.hospitalId;
    }
    return request({
      url: `/nurse-train-web/nursetrain/web/basic/read/v1.0.1/deptList?${serialize(params)}`,
      options: {
        method: 'GET'
      },
      api: 'nurseTrainApi'
    });

  },
  // 获取病区
  getWards: (query) => {
    let params = {
      innerFromPage: fromPage,
      hospitalId,
      deptId: query
    };
    if (fromPage) {
      params.hospitalId = innerHospitalId;
    }
    return request({
      url: `/nurse-train-web/nursetrain/web/course/release/v1.0.1/wards?${serialize(params)}`,
      options: {
        method: 'GET'
      },
      api: 'nurseTrainApi'
    });
  },
  // 获取系统时间
  getSystemTime: (type) => {
    return request({
      url: `/nurse-train-web/nursetrain/web/basic/read/v2.7.3/systemTime/${type}`,
      options: {
        method: 'GET'
      },
      api: 'www_form_urlencoded_nurseTrainApi'
    });
  },
  // 获取考试次数结果
  getPaperRecord: (query) => {
    const params = {
      innerFromPage: fromPage,
      ...query,
    };
    return request({
      url: `/nurse-train-web/nursetrain/web/exercise/v2.2.7/getPaperRecord?${serialize(params)}`,
      options: {
        method: 'GET'
      },
      api: 'nurseTrainApi'
    });
  },
  // 上传相关
  addResourceTemp: (id) => {
    const params = {
      transcodingId: id,
      accountId: userId,
    }
    return request({
      url: '/nurse-train-web/nursetrain/web/course/write/v1.0.1/resourceTemp',
      options: {
        method: 'POST',
        data: JSON.stringify(params),
      },
      api: 'nurseTrainApi'
    });
  },
  // 获取当前医院的管理员
  getAdminForHoppital: (id) => {
    return request({
      url: `/nurse-train-web/nursetrain/web/user/v2.2.5/hospitalAdmin/${id}`,
      options: {
        method: 'GET'
      },
      api: 'nurseTrainApi'
    });
  },
  // 上传相关
  domainUrl: (bucket) => {
    return request({
      url: '/nurse-train-web/nursetrain/qiniu/domainUrl',
      options: {
        method: 'POST',
        data: JSON.stringify(bucket)
      },
      api: 'nurseTrainApi'
    });
  },
  // 上传相关
  commonToken: (values) => {
    return request({
      url: '/nurse-train-web/nursetrain/qiniu/getToken',
      options: {
        method: 'POST',
        data: JSON.stringify(values)
      },
      api: 'nurseTrainApi'
    });
  },
  // 获取二维码 (考试签到)
  examSignQRCode: (query) => {
    return request({
      url: `/nurse-train-web/nursetrain/web/read/exam/releasePaper/v2.6.2/QRCode?${serialize(query)}`,
      options: {
        method: 'GET'
      },
      api: 'nurseTrainApi'
    });
  },
  // 获取现场培训二维码（签到）
  trainingSignQRCode: (query) => {
    return request({
      url: `/nurse-train-web/nursetrain/web/course/read/v2.6.3/QRCode?${serialize(query)}`,
      options: {
        method: 'GET'
      },
      api: 'nurseTrainApi'
    });
  },
  // 获取现场培训二维码（签退）
  trainingSignOutQRCode: (query) => {
    return request({
      url: `/nurse-train-web/nursetrain/web/course/read/v2.9.3/SignOutQRCode?${serialize(query)}`,
      options: {
        method: 'GET'
      },
      api: 'nurseTrainApi'
    });
  },
  // 获取公共医院ID
  queryPublicHospital: () => {
    const params = {
      innerFromPage: fromPage,
    };
    return (dispatch) => {
      request({
        url: `/nurse-train-web/nursetrain/web/basic/read/v2.2.6/publicHospital?${serialize(params)}`,
        options: {
          method: 'GET'
        },
        api: 'nurseTrainApi'
      }).then(data => {
        if (!data.success) {
          message.error(data.errMsg || '试卷不存在!');
          return;
        }
        dispatch({
          type: 'course/savePublicHospitalId',
          payload: { publicHospitalId: data.data.hospitalIds[0] }
        })
      });
    }
  },
  // 技术类别
  getUserTreeGroup: () => {
    return request({
      url: '/nurse-train-web/nursetrain/web/read/standard/train/user/v2.5.9/userTreeGroup',
      options: {
        method: 'GET'
      },
      api: 'www_form_urlencoded_nurseTrainApi'
    });
  },
  // 我的分类列表
  getPrivateClassifyList: () => {
    return request({
      url: `/nurse-train-web/nursetrain/web/privateClassify/read/v3.1.3/privateClassifyForList?accountId=${userId}`,
      options: {
        method: 'GET'
      },
      api: 'nurseTrainApi'
    });
  },
  // 获取院内分享
  fetchSharelist: () => {
    return request({
      url: '/nurse-train-web/nursetrain/web/privateClassify/read/v3.1.3/sharelist',
      options: {
        method: 'GET'
      },
      api: 'nurseTrainApi'
    });
  },
  // 获取公共试题筛选
  getPublicBasicDict: (types) => {
    const params = {
      hospitalId: -1,
      types
    };
    return request({
      url: '/nurse-train-web/nursetrain/web/basicDict/read/v3.0.8/collectionSimpleQuery',
      options: {
        method: 'GET',
        data: params
      },
      api: 'www_form_urlencoded_nurseTrainApi'
    });
  },
  // 获取来源
  getExerciseSourceList: (query) => {
    return request({
      url: '/nurse-train-web/nursetrain/web/publicExerciseSourceRead/v3.0.8/queryPublicExerciseSource',
      options: {
        method: 'GET',
        data: query
      },
      api: 'www_form_urlencoded_nurseTrainApi'
    });
  },
  // 获取当前账号管理范围内的科室
  getDeptMine: () => {
    return (dispatch) => {
      return request({
        url: '/nurse-train-web/nursetrain/web/read/department/v3.1.4/mine',
        options: {
          method: 'GET',
        },
        api: 'www_form_urlencoded_nurseTrainApi'
      }).then(res => {
        if (!res.success) {
          return;
        }
        dispatch({ type: "trainings/formatDepts", payload: { data: res.data } });
      });
    }

  }
}
