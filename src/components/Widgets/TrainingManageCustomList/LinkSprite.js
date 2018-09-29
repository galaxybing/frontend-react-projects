import React, { Component } from 'react';
import { Icon } from 'antd';
import styles from './style.css';

export default function LinkSprite(props) {
  return (
    <div className={styles.linkSprite}>
      {
        props.deleteAble ? <span style={{ userSelect: 'none' }} className={styles.deleteCourseItemSprite} onClick={() => props.deletePannel(props.linkTabName)}>
          <Icon type="delete" />
        </span> : null
      }
      <span style={{ userSelect: 'none' }} className={styles.switchPannelLink} onClick={() => props.switchPannel()}>
        <Icon className={styles.switchPannelArrow} type="down" />
      </span>
    </div>
  )
}