const boz = require('../config').BOZ;

// 每页条数
export const PAGE_SIZE = 10; // 10

// 培训分类 groupId
export const TRAINING_GROUP_ID = '3';

// 课程分类 groupId
export const COURSE_GROUP_ID = '4';

// 分页
export const PAGE_SIZE_OPTIONS = [ '10', '20', '50', '100' ];

// 内部医院ID
export const INNER_HOSPITALID = 99999999;

// 定制功能（辽省中医）是否展示规培菜单
export const NURSING_DEPT_HOSPITALID = [ 398, 317 ];

// 试题类型
export const QUESTION_TYPE = [
	{
		label: '单选题',
		value: 1,
		id: '1',
		type: 'single'
	},
	{
		label: '多选题',
		value: 2,
		id: '2',
		type: 'many'
	},
	{
		label: '判断题',
		value: 3,
		id: '3',
		type: 'judge'
	},
	{
		label: '填空题',
		value: 4,
		id: '4',
		type: 'fillBlank'
	}
];

// 附件预览地址
export const PREVIEWURL = 'http://widget.317hu.com/viewer/index.html';

// 其他科室、科目、层级code
export const DEFAULT_DEPARTMENT_CODE = '137438953472';
export const DEFAULT_SUBJECT_CODE = '32';
export const DEFAULT_LEVEL_CODE = 'N99';

// 重附一医院ID
const versionEnv = boz[`VERSION_ENV`];
let cfyHosId = 376;
if (versionEnv == 'dev') {
  cfyHosId = 376;
} else if (versionEnv == 'sit') {
  cfyHosId = 1056;
} else {
  cfyHosId = 716;
}
export const CHONGFUTI_HOSPITALID = cfyHosId;
