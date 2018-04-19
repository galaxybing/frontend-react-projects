import React ,{ Component }from 'react';
import { Icon } from 'antd';
import styles from './error.less';

class Error extends Component {
  render(){
    return (
      <div className={styles.error}>
        <div style={{float:'left',marginRight:40}}><img src={require('../../../../../src/assets/img/404.svg')}/></div>
        <div style={{float:'left'}}>
          <h1>404</h1>
          <h3>抱歉！您访问的页面不存在</h3>
        </div>
      </div>
    )
  }
}
export default Error;