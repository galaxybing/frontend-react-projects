import React, { Component } from 'react';
import { connect } from 'react-redux';

import { login } from '../../../../../src/actions/user'
import styles from './style.css';

export class LoginViewContainer extends Component {
  constructor(props) {
    super(props);
  }
  loginHandler = (e) => {
    e.preventDefault();
    const { dispatch } = this.props;

    dispatch(login({
      userName: this.refs.userName.value,
      isAdmin: this.refs.isAdmin.checked,
    }));
  }
  render() {
    return (
      <div className={styles.loginSprite}>
        <p><input className={styles.userName} type="text" ref="userName" placeholder="请输入您的登录名称" /></p>
        <label className={styles.checkboxSprite}><input className={styles.cb} type="checkbox" ref="isAdmin" />您是否以管理员身份进行操作?</label>
        <div>
          <a href="#" className={styles.btnSprite} onClick={this.loginHandler}>登录</a>
        </div>
      </div>
    )
  }
}

/*
function select(store) {
  return {
    
  }
}
*/

function actions(dispatch, ownProps) {
  return {
    dispatch,
  }
}

// module.exports = connect(null, actions)(LoginViewContainer)
export default LoginViewContainer
