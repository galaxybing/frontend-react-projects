import React ,{ Component }from 'react';
import { Icon } from 'antd';
import styles from './error.less';

class Error extends Component {
  render(){
    return ( // 317hu.png
      <div className={styles.error}>
        {/* <div style={{float:'left',marginRight:10}}><img width="64" src={require('../../../assets/img/comment.gif')}/></div> */}
        {/* <div style={{float:'left'}}> */}
        <div>
          <p>抱歉，您访问的页面不存在？</p>
        </div>
      </div>
    )
  }
}
export default Error;