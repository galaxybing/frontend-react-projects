import React ,{ Component }from 'react';
import { Icon } from 'antd';
import styles from './error.less';

class Error extends Component {
  render(){
    return ( // 317hu.png
      <div className={styles.error}>
        <div style={{float:'left',marginRight:10}}><img width="64" src={require('../../../assets/img/comment.gif')}/></div>
        <div style={{float:'left'}}>
          <p>请检查您的访问地址？</p>
        </div>
      </div>
    )
  }
}
export default Error;