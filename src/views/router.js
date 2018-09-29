import React from 'react';
import ScrollToTop from '../components/ScrollToTop';
import Bundle from '../core/bundle.js';
import { matchRoutes, renderRoutes } from 'react-router-config';

const createChildRouteComponent = (container, props, ) => (
    <Bundle load={container}>
        {(View) => <View {...props} />}
    </Bundle>
);

const Root = ({ route }) => (
    <ScrollToTop>
        {renderRoutes(route.routes)}
    </ScrollToTop>
);
function RouterConfig({ history, app }) {
    const routes = [
        {
            component: Root,
            routes: [
                {  // 培训课程
                    path: '/hospital-admin/nurse-training-course/trainings-manage.html',
                    component: (props) => {
                        return createChildRouteComponent(require('./routes/TrainingsManage'), props);
                    },
                },
                { // 课程库
                    path: '/hospital-admin/nurse-training-course/courseware.html',
                    component: (props) => {
                        return createChildRouteComponent(require('./routes/Courseware'), props);
                    },
                },
                {  // 选择新建课程类型
                    path: '/hospital-admin/nurse-training-course/trainings-manage/choose-training-type.html',
                    component: (props) => {
                        return createChildRouteComponent(require('./routes/ChooseTrainingType'), props);
                    },
                },
                {  // 课程详情
                    path: '/hospital-admin/nurse-training-course/trainings-manage/course-detail.html',
                    component: (props) => {
                        return createChildRouteComponent(require('./routes/CourseDetail'), props);
                    },
                },
                {  // 已发布培训
                    path: '/hospital-admin/nurse-training-course/trainings.html',
                    component: (props) => {
                        return createChildRouteComponent(require('./routes/Trainings'), props);
                    },
                },
                {  // 培训详情
                    path: '/hospital-admin/nurse-training-course/trainings/study-detail.html',
                    component: (props) => {
                        return createChildRouteComponent(require('./routes/StudyDetail'), props);
                    },
                },
                {  // 培训详情 - 学习详情
                    path: '/hospital-admin/nurse-training-course/trainings/study-detail-info.html',
                    component: (props) => {
                        return createChildRouteComponent(require('./routes/StudyDetail/studyDetailInfo'), props);
                    },
                },
                {  // 培训详情 - 课后作业
                    path: '/hospital-admin/nurse-training-course/trainings/study-homework.html',
                    component: (props) => {
                        return createChildRouteComponent(require('./routes/StudyDetail/studyHomeWork'), props);
                    },
                },
                {  // 二维码
                    path: '/hospital-admin/nurse-training-course/qr-code.html',
                    component: (props) => {
                        return createChildRouteComponent(require('./routes/QrCode'), props);
                    },
                },
                { // 新建课程
                    path: '/hospital-admin/nurse-training-course/trainings-manage/create-course.html',
                    component: (props) => {
                        return createChildRouteComponent(require('./routes/CreateCourse'), props);
                    },
                },

                { // 编辑课程成功
                    path: '/hospital-admin/nurse-training-course/create-course-success.html',
                    component: (props) => {
                        return createChildRouteComponent(require('./routes/CreateCourseSuccess'), props);
                    },
                },
                // 404
                {
                    path: '*',
                    component: (props) => {
                        return createChildRouteComponent(require('./routes/Error'), props);
                    },
                }
            ]
        }
    ];
    return <div>{renderRoutes(routes)}</div>;
}

export default RouterConfig;
