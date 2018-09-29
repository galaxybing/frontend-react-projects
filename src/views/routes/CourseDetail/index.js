import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Breadcrumb, message } from "antd";
import { getCache } from "../../../core/_utils/storage";
import { searchStrToObj } from "../../../core/_utils/common";
import { INNER_HOSPITALID } from "../../../constants";
import MainLayout from "../../../components/Widgets/MainLayout";
import BreadNavList from "../../../components/Widgets/BreadNavList";
import CourseDetailComponent from "../../../components/CourseDetail";
import { toCopy } from '../../../actions/courseDetail';
import { saveCoureseRelease, saveCoureseReleaseAll } from '../../../actions/trainingManage';

import TrainingsManageModal from '../../../components/TrainingsManage/TrainingsManageModal';  // 课程详情页发布
import PlanningCrumb from "../../../components/Widgets/BreadNavList/PlanningCrumb";

const { hospitalId } = getCache("profile") || {};
const innerFromPage = getCache("innerFromPage") || {};

class CourseDetail extends React.Component {
  constructor(props) {
    super(props);
    const { search } = this.props.location;

    this.query = {};
    if (search) {
      this.query = searchStrToObj(search);
    }

    this.state = {
      courseDetails: {},
    }
  }
  render() {
    const { dispatch, courseDetails = {}, history } = this.props;
    const { courseData = {}, isRelease, pageType, publishModalVisible, currentPublish, publicHospitalId } = courseDetails;

    const courseDetailComponentProp = {
      dispatch: this.props.dispatch,

      ...courseData, // 课程类型字段，则后端提供 trainModel: location.query.trainModel,
      isRelease,
      pageType,
      publicHospitalId,

      query: this.query,
      fromPlanning: this.query.type,
      goTrainingsManage: (query) => {

        dispatch({
          type: 'courseDetails/showPublishModal',
          payload: {
            currentPublish: {
              contentId: courseData.contentId,
              courseId: courseData.courseId,
              courseName: encodeURIComponent(courseData.courseName),
              hadExercise: courseData.paperResponseDTOList && courseData.paperResponseDTOList.length ? 1 : 0,
              personnelRequest: courseData.personnelRequest,
              // trainModel: parseInt(location.query.trainModel),
              trainModel: courseData.trainModel,
              ...query
            }
          }
        });
      },
      copyCourse(query) {
        dispatch(toCopy(query));

      },
      // 从子组件内获取课程详情数据
      getCourseDetailData: (data) => {
        // this.setState({
        //   courseDetails: data,
        // })
      }
    };

    const trainingsManageModalProps = {
      visible: publishModalVisible,
      currentData: currentPublish,
      handleOk() {
        dispatch({
          type: 'trainingsManage/showChooseModal'
        });
      },
      handleCancel() {
        dispatch({
          type: 'courseDetails/hidePublishModal'
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
            dispatch({
              type: 'courseDetails/hidePublishModal',
            })
            message.success('发布成功');
            history.push({
              pathname: '/hospital-admin/nurse-training-course/trainings.html',
            });
          }
        });
      },
      courseReleaseAllHandler(submitParam) {

        saveCoureseReleaseAll({ payload: { submitParam } }).then((res) => {
          if (res && res.success) {
            dispatch({
              type: 'trainingsManage/hiddenChooseModal'
            });
            dispatch({
              type: 'courseDetails/hidePublishModal',
            });
            message.success('发布成功');
            history.push({
              pathname: '/hospital-admin/nurse-training-course/trainings.html',
            });
          } else {
            message.error(res.errMsg);
            dispatch({
              type: 'trainingsManage/showReleaseLoading'
            });
          }
        });
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
    // 针对运营后台的面包屑跳转
    const innerFromPage = getCache('innerFromPage') || {};
    const linkQuery = {
      innerFromPage: innerFromPage.fromPage,
      hospitalId: innerFromPage.hospitalId
    };

    let breadNavListDataSource = [{ name: "课程详情" }];
    if (this.query.menuName === "trainings.html") {
      breadNavListDataSource.splice(0, 0, {
        name: "已发布培训",
        link: "/hospital-admin/nurse-training-course/trainings.html"
      });
    } else {
      breadNavListDataSource.splice(0, 0, {
        name: "培训课程",
        link: "/hospital-admin/nurse-training-course/trainings-manage.html"
      });
    }
    return (
      <MainLayout>
        <div className="boz-component-header">
          {(() => {
            let tpl;
            if (this.query.type === "planning" && this.query.planType) {
              tpl = (
                <PlanningCrumb
                  curBreadcrumbItem="课程详情"
                  query={{
                    ...this.query
                  }}
                />
              );
            } else {
              tpl = <BreadNavList dataSource={breadNavListDataSource} />;
            }
            return tpl;
          })()}
        </div>
        <div className="boz-component-body">
          <CourseDetailComponent {...courseDetailComponentProp} />
          {publishModalVisible ? <TrainingsManageModal {...trainingsManageModalProps} /> : ''}
        </div>
      </MainLayout>
    );
  }
}
function select(state) {
  // const loading = state.loading.models.courseDetails;
  const courseDetails = { ...state.courseDetails /*, loading */ };
  // const insertQuestions = { ...state.insertQuestions };
  const trainingsManage = { ...state.trainingsManage };
  return { courseDetails, trainingsManage };
}
function actions(dispatch, ownProps) {
  return {
    dispatch
  };
}
export default connect(select, actions)(CourseDetail);
