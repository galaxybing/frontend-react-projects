import React from 'react';
import { Breadcrumb } from 'antd';
import { getCache } from '../../../core/_utils/storage';
import serialize from '../../../core/_utils/serialize';
import BreadNavList from './index';

export default function (props) {
  const { curBreadcrumbItem, query } = props;
  const { nurseTrainUrl } = getCache('topNavRest') || {};
  const detailParams = {
    id: query.planId,
    trainType: query.planType
  };
  const crumb = {};
  let prePageUrl = 'planning-detail.html';
  let prePageName = '计划详情';
  if (query.prePageUrl && query.prePageUrl == 'editPlanning') {
    prePageUrl = 'edit-planning.html';
    prePageName = '编辑计划';
  }
  const palnDetailUrl = `/hospital-admin/nurse-training-group/planning/${prePageUrl}?${serialize(detailParams)}`;
  if (query.planType == 1) {
    crumb.planTypeStr = '岗前培训计划';
    crumb.planTypeUrl = '/hospital-admin/nurse-training-group/planning/start.html';
  } else if (query.planType == 2) {
    crumb.planTypeStr = '基地培训计划';
    crumb.planTypeUrl = '/hospital-admin/nurse-training-group/planning/hospital.html';
  } else if (query.planType == 3) {
    crumb.planTypeStr = '定向培训计划';
    crumb.planTypeUrl = '/hospital-admin/nurse-training-group/planning/target.html';
  }
  return (
    <BreadNavList
      dataSource={[
        { name: crumb.planTypeStr, link: `${nurseTrainUrl}${crumb.planTypeUrl}`, type: 'a' },
        { name: prePageName, link: `${nurseTrainUrl}${palnDetailUrl}`, type: 'a' },
        { name: curBreadcrumbItem },
      ]}
    />
  );
}
