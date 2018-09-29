import React from 'react';
import { connect } from "react-redux";
import MainLayout from '../../../components/Widgets/MainLayout';
import BreadNavList from '../../../components/Widgets/BreadNavList';
import { Button } from 'antd';
import styles from './style.css';

class ChoosePaperType extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: 0
    }
  }
  componentDidMount() {
    this.props.dispatch({
      type: 'course/resetState',
    });
  }
  next() {
    if (this.state.type === 1) {
      this.props.history.push({
        pathname: '/hospital-admin/nurse-training-course/trainings-manage/create-course.html',
        search: `?type=offline`,
      })
    } else {
      this.props.history.push({
        pathname: '/hospital-admin/nurse-training-course/trainings-manage/create-course.html',
        search: `?type=online`,
      })
    }
  }
  render() {
    return (
      <MainLayout>
        <div className="boz-component-header">
          <BreadNavList
            dataSource={[
              { name: '培训管理', link: '/hospital-admin/nurse-training-course/trainings-manage.html' },
              { name: '新建课程' },
            ]}
          />
        </div>
        <div className="boz-component-body boz-component-body-card">
          <p className={styles.pageTitle}>请选择新建课程类型</p>
          <div style={{ textAlign: 'center' }}>
            <div onClick={() => this.setState({ type: 0 })} className={this.state.type === 0 ? `${styles.paperTypeItem} ${styles.active}` : styles.paperTypeItem}>
              <p className={styles.itemTitle}>在线培训</p>
              <p className={styles.itemContent}>管理员发布在线培训，学员在线参加培训</p>
            </div>
            <div onClick={() => this.setState({ type: 1 })} className={this.state.type === 1 ? `${styles.paperTypeItem} ${styles.active}` : styles.paperTypeItem}>
              <p className={styles.itemTitle}>现场培训</p>
              <p className={styles.itemContent}>管理员发起现场培训，学员至指定地点参加培训</p>
            </div>
          </div>
          <div style={{ textAlign: 'center', padding: '30px 0' }}>
            <Button type="primary" size="large" onClick={this.next.bind(this)}>下一步</Button>
          </div>
        </div>
      </MainLayout>
    );
  }

}

function select(state) {
  return { };
}

function actions(dispatch, ownProps) {
  return {
    dispatch
  };
}
export default connect(select, actions)(ChoosePaperType);
