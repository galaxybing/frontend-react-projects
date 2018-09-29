import React from 'react';
import { Row, Col } from 'antd';
import styles from './TrainingSummary.css';

export default function TrainingSummary({ dataSource }) {
  const colorList = ['#8794FF', '#00CDBE', '#288BFF', '#F0493D'];
  const item = dataSource.map((item, index) => {
    const colorIndex = index % (colorList.length);
    const val = item.value;
    const precentVal = parseInt(val[0].value / val[1].value * 100, 10);
    return (
      <Col key={index} span={6} style={{display: 'flex', alignItems: 'stretch'}}>
        {<Row className={styles.statisticsContItem} type={'flex'} align={'middle'} style={{ borderTopColor: colorList[colorIndex] }}>
          <Col span={13} className={styles.statisticsContItemComputed}>
            <div>{val[0].name}{val[0].value}{item.uint}</div>
            <i></i>
            <div>{val[1].name}{val[1].value}{item.uint}</div>
          </Col>
          <Col span={4} style={{fontSize: 24}}>=</Col>
          <Col span={7}>
            <div style={{fontSize: 24}}>{precentVal ? precentVal : 0} %</div>
            <em style={{fontSize: 10, fontStyle: 'normal', color: '#666666'}}>{item.label}</em>
          </Col>
        </Row>}
      </Col>
    );
  })
  return (
    <Row gutter={16} type={'flex'} className={styles.statisticsCont}>
      {item}
    </Row>
  )
}
