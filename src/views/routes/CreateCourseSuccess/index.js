import React from 'react';
import { connect } from 'react-redux';
import { Button, Icon, Tooltip, message } from 'antd';
import { Link } from 'react-router-dom';
import { searchStrToObj } from '../../../core/_utils/common';
import BreadNavList from '../../../components/Widgets/BreadNavList';

import { saveCoureseRelease, saveCoureseReleaseAll } from '../../../actions/trainingManage';
import { getVideoInsertDetail } from '../../../actions/insertQuestions';

import MainLayout from '../../../components/Widgets/MainLayout';
import TrainingsManageModal from '../../../components/TrainingsManage/TrainingsManageModal';
import InsertQuestionsModal from '../../../components/TrainingsManage/InsertQuestions';
import styles from './style.css';

function TrainingsManage({ history, location, dispatch, trainingsManage, insertQuestions }) {
  const { list, total, page, num, pageSize, visible, current, loading, releaseLoading, insertQuestionsModalVisible, } = trainingsManage;

  let insertQuestionsCount = insertQuestions.insertQuestionsCount;

  const { search } = location;
  let query = {};
  if (search) {
    query = searchStrToObj(search);
  }
  let queryData = query;
  location.query = queryData; // 兼容处理旧有代码 取值引用

  const trainingsManageModalProps = {
    visible,
    currentData: {
      ...current,
      courseId: query.courseId,
      contentId: query.contentId,
      hadExercise: queryData.hadExercise,
      leaseStartTime: queryData.leaseStartTime,
      leaseEndTime: queryData.leaseEndTime,
      systemTime: queryData.systemTime,
      
      totalScore: queryData.totalScore,

      personnelRequest: decodeURIComponent(queryData.personnelRequest),
      homeWorkFlag: queryData.homeWorkFlag === '1' ? 1 : 0,
      trainModel: queryData.trainModel === '1' ? 1 : 0,
    },
    loading,
    releaseLoading,
    handleOk() {
      dispatch({
        type: 'trainingsManage/showChooseModal'
      });
    },
    handleCancel() {
      dispatch({
        type: 'trainingsManage/hiddenChooseModal'
      });
    },
    courseReleaseHandler(submitParam) {
      saveCoureseRelease({ payload: { submitParam } }).then((res) => {
        if (!res.success) {
          message.error(res.errMsg);
        } else {
          dispatch({
            type: 'trainingsManage/hiddenChooseModal'
          });

          // this.props.history.push({// 跳转 已发布培训
          history.push({
            pathname: '/hospital-admin/nurse-training-course/trainings.html',
          });

          // yield put({ type: 'hiddenChooseModal' });
          // yield put({ type: 'courseDetails/hidePublishModal' });  // 详情页发布弹框
          // message.success('发布成功');
          // yield put(routerRedux.push('/trainings'));
        }
      });
    },
    courseReleaseAllHandler(submitParam) {
      saveCoureseReleaseAll({ payload: { submitParam } }).then((res) => {
        if (res && res.success) {
          dispatch({
            type: 'trainingsManage/hiddenChooseModal'
          });
          // yield put({ type: 'courseDetails/hidePublishModal' });  // 详情页发布弹框
          message.success('发布成功');
          history.push({
            pathname: '/hospital-admin/nurse-training-course/trainings.html',
          });
        } else {
          message.error(res.errMsg);
          dispatch({
            type: 'trainingsManage/showReleaseLoading'
          });
          // yield put({ type: 'showReleaseLoading' });
        }
      })
    },
    onChange(query) {
      dispatch({
        type: 'trainingsManage/fetchTrainingsUserList', // ??没有找到 该 action 配置
        payload: {
          ...query
        }
      });
    },
  };
  const insertQuestionsModalProps = {
    reload() {
      /*
       *
      dispatch({
        type: 'trainingsManage/reload',
      });
      */
    }
  };
  const CheckMemberModalProps = {
    visible,
    current,
    loading,
    releaseLoading
  };

  return (
    <MainLayout location={location}>
      <div className="boz-component-header">
        <BreadNavList
          dataSource={[
            { name: '培训课程', link: '/hospital-admin/nurse-training-course/trainings-manage.html' },
            { name: queryData.type === "add" ? "保存课程" : "编辑课程" }
          ]}
        />
      </div>
      <div className="boz-component-body boz-component-body-card">
        <div className={styles.courseSuccessSprite}>
          <div className={styles.courseSuccessHeader}><Icon type="check-circle" style={{ fontSize: 24, color: '#78c94a' }} />
            {
              queryData.type === "add" ? "恭喜您！培训课程保存成功" : "恭喜您！培训课程编辑成功"
            }</div>
          <p className={styles.courseSuccessMsg}>该课程已保存在《培训管理》中，您可以立即发布该培训课程</p>

          {
            location.query.insertQuestionAbled == '1' ? (() => {
              return (
                insertQuestionsCount === 0 ? (
                  <div className={styles.courseSuccessInsertQuestion}>检测到您已添加视频和试题，现在可以为视频插入试题了&nbsp;&nbsp;
                    <Tooltip title="管理员在视频播放中插入试题，考生观看视频时需答对试题后方可继续观看">
                      <Icon type="question-circle-o" style={{ fontSize: 16, color: '#262626' }} />
                    </Tooltip>
                  </div>
                ) : (
                    <div className={styles.courseSuccessInsertQuestion}>{insertQuestionsCount} 个视频中已插入试题&nbsp;&nbsp;
                    <Tooltip title="管理员在视频播放中插入试题，考生观看视频时需答对试题后方可继续观看">
                        <Icon type="question-circle-o" style={{ fontSize: 16, color: '#262626' }} />
                      </Tooltip>
                    </div>
                  )
              )
            })() : ''
          }

          <Button className={`${styles.courseSubmitBtn}`} onClick={() => {
            dispatch({
              type: 'trainingsManage/showChooseModal',
              // payload: { current: record }
            });
          }}>立即发布培训</Button>
          
          {
            location.query.insertQuestionAbled == '1' ? (() => {
              return (
                insertQuestionsCount === 0 ? (
                  <Button className={`${styles.courseInsertPaperBtn}`} onClick={() => {
                    dispatch(
                      getVideoInsertDetail({ id: location.query.contentId, modalType: 'create' })
                    );
                  }}>设置视频插题</Button>
                ) : (
                  <Button className={`${styles.courseInsertPaperBtn}`} onClick={() => {
                    dispatch(
                      getVideoInsertDetail({ id: location.query.contentId, modalType: 'create' })
                    );
                  }}>继续设置视频插题</Button>
                )
              )
            })() : ''
          }
          
        </div>

        {visible ? <TrainingsManageModal {...trainingsManageModalProps} /> : ''}
        {insertQuestions.modalVisible ? <InsertQuestionsModal {...insertQuestionsModalProps} /> : ''}
      </div>
    </MainLayout>
  );
}
function mapStateToProps(state) {
  // const loading = state.loading.models.trainingsManage;
  const trainingsManage = { ...state.trainingsManage/*, loading*/ };
  const insertQuestions = { ...state.insertQuestions };
  return { trainingsManage, insertQuestions };
}
export default connect(mapStateToProps)(TrainingsManage);
