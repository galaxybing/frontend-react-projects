import React, { Component } from 'react';
import { Modal, Table } from 'antd';

function TestResult(props) {
  let columns = [
      {
          title: '第*次测验',
          dataIndex: 'testNumber',
          key: 'testNumber',
      },
      {
          title: '测验时间',
          dataIndex: 'testTime',
          key: 'testTime',
      },
      {
          title: '答对几题',
          dataIndex: 'rightNum',
          key: 'rightNum',
      },
      {
          title: '答错几题',
          dataIndex: 'wrongNum',
          key: 'wrongNum',
      },
      {
          title: '测验结果',
          dataIndex: 'result',
          key: 'result',
          render: (text) => {
              if (text === -1) {
                  return (<span style={{ color: '#fc5e5e' }}>不合格</span>);
              } else {
                  return (<span style={{ color: '#1abb69' }}>合格</span>);
              }
          }
      }
  ];
  if (props.paperRecordList[0].totalScore) {
      columns.splice(2, 1,
          {
              title: '测验总分',
              dataIndex: 'totalScore',
              key: 'totalScore',
          },
      );
      columns.splice(3, 1,
          {
              title: '及格分数',
              dataIndex: 'passScore',
              key: 'passScore',
          },
      );
      columns.splice(4, 0,
          {
              title: '测验分数',
              dataIndex: 'score',
              key: 'score',
          },
      );
  }
  return (
    <div style={{ padding: 20 }}>
        <Table
            columns={columns}
            dataSource={props.paperRecordList}
            rowKey={(record, index) => index}
            pagination={false}
        />
    </div>
  );
}

export default TestResult;
