import React from 'react';
import { Breadcrumb } from 'antd';
import { getCache } from '../../../core/_utils/storage';
import serialize from '../../../core/_utils/serialize';
import BreadNavList from './index';

export default function GroupCrumb(props) {
  const { curBreadcrumbItem, query } = props;
  const { nurseTrainUrl } = getCache('topNavRest') || {};

  return (
    <BreadNavList
      dataSource={[
        // { name: query.name, link: `${nurseTrainUrl}${palnDetailUrl}`, type: 'a' },
        { name: query.name },
        { name: curBreadcrumbItem },
      ]}
    />
  );
}
