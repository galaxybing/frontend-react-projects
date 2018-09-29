import React, { Component } from 'react';
import moment from 'moment';
import { Row, Col, Icon, Input, Radio, Checkbox, Button, Pagination, Table, message, Tabs, Popconfirm } from 'antd';
import { getCache } from '../../core/_utils/storage';
import { INNER_HOSPITALID, PREVIEWURL } from '../../constants';
import trainingsManageService from '../../actions/trainingManage';
import Service from '../../actions/courseDetail';
import CommonService from '../../actions/common';
import RenderQuestionModal from '../../components/Widgets/ExamPaper/RenderTest';
import styles from './style.css';
import { Link } from 'react-router-dom';

const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
const TabPane = Tabs.TabPane;
const TextArea = Input.TextArea;

const { hospitalId } = getCache('profile') || {};
const innerFromPage = getCache('innerFromPage') || {};
const previewUrl = getCache('previewUrl');
const timeFormat = 'MM/DD HH:mm';

class CourseDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            courseDetail: {},
            tabKey: null,
            courseMessageList: [],
            pagination: {
                pageNum: 1,
                pageSize: 10,
                total: 0,
            },
            loading: false,
        };
        this.query = {};
        if (this.props.query) {
            this.query = this.props.query;
        }
        this.columns = [{
            dataIndex: 'title',
            width: '100%',
            render: (text, item, index) => {
                return <div key={index} className={styles.msgItem}>
                    <div>
                        <p>{item.content}</p>
                    </div>
                    <div>
                        <span>{item.createName}</span>
                        <span>{moment(item.createTime).format(timeFormat)}</span>
                        {/* <Link
                            to={{
                                pathname: '/hospital-admin/nurse-training-course/trainings-manage/course-detail.html',
                                search: `?courseId=${item.courseId}`
                            }}
                            target="_blank"><span>{item.courseName}</span></Link> */}
                        <div className={styles.operationBtn}>
                            {
                                item.status ?
                                    <span style={{ color: '#999999', paddingRight: 10 }} onClick={() => this.switchShow(item.id)}>已回复<Icon className={this.state[`show-${item.id}`] ? styles.fold : styles.unfold} /></span>
                                    : <span onClick={() => this.handleToReply(item.id)}><Icon type="message" className={styles.replyBtn} />&nbsp;回复</span>
                            }
                            <Popconfirm title="确定要删除留言吗？" onConfirm={() => this.handleDelete(item.id)}>
                                <span><Icon type="delete" className={styles.deleteBtn} />&nbsp;删除</span>
                            </Popconfirm>
                        </div>
                    </div>
                    {this.state[`visible-${item.id}`]
                        ? <div className={styles.replyTextArea}>
                            <TextArea
                                autoFocus={true}
                                placeholder="输入回复内容"
                                className={styles.content}
                                autosize={{ minRows: 1, maxRows: 5 }}
                                maxLength={50}
                                onChange={(e) => { item.reply = e.target.value }}
                                onBlur={() => this.handleCancelReply(item.id)}
                            />
                            <Button onMouseDown={() => { this.confirmReply(item.id, item.reply) }} className={styles.release}>完成</Button>
                        </div>
                        : null}
                    {
                        this.state[`show-${item.id}`] ?
                            <div className={styles.replyContent}>
                                <p>{item.replyName + '的'}回复： {item.reply}</p>
                            </div> : null
                    }
                </div>
            }
        }];
    }

    getCourseMessage = () => {
        let params = {
            id: this.query.contentId,
            pageSize: this.state.pagination.pageSize,
            pageNum: this.state.pagination.pageNum
        }
        Service.getCourseMessage(params).then((res) => {
            if (!res.success) {
                message.error(data.errMsg);
                return;
            }
            let pagination = this.state.pagination
            pagination.total = res.data.totalCount;
            this.setState({ courseMessageList: res.data.result, pagination });
        })
    }
    componentDidMount() {
        Service.getCourseDetail({ courseId: this.query.courseId, contentId: this.query.contentId }).then(data => {
            if (!data.success) {
                message.error(data.errMsg);
                return;
            }
            let key = '1';
            if (!data.data.prePaperResponseDTO.exerciseRspDTOList){key = '2'}
            if (!data.data.prePaperResponseDTO.exerciseRspDTOList&&!data.data.paperResponseDTO.exerciseRspDTOList){key = '3'}
            if (!data.data.prePaperResponseDTO.exerciseRspDTOList&&!data.data.paperResponseDTO.exerciseRspDTOList&&!data.data.homeWorkRespDTO.homeWork){key = '4'}
            if (!data.data.prePaperResponseDTO.exerciseRspDTOList&&!data.data.paperResponseDTO.exerciseRspDTOList&&!data.data.homeWorkRespDTO.homeWork&&!data.data.questionnaireRespDTO.questionnaireName){key = null}

            this.setState({ courseDetail: data.data ,tabKey: key});
            // this.props.getCourseDetailData(data.data);
            this.props.dispatch({
                type: 'courseDetails/save',
                payload: {
                    courseData: data.data,
                    // isRelease: false,
                }
            })
        });
        this.getCourseMessage();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.contentId) {
            this.setState({
                contentLength: nextProps.resourceRespDTOList ? nextProps.resourceRespDTOList.length : ''
            })
        }
    }

    goTrainingsManage = (query) => {
        if (this.props.from == 3) {
            trainingsManageService.hospitalLeaseInfo().then(data => {
                if (!data.success) {
                    message.error(data.errMsg);
                    return;
                }
                this.setState({
                    leaseStartTime: moment(moment(data.data.leaseStartTime).format('YYYY-MM-DD')).format('X'),
                    leaseEndTime: moment(moment(data.data.leaseEndTime).format('YYYY-MM-DD')).format('X'),
                }, () => {
                    CommonService.getSystemTime(1).then(data => {
                        if (!data.success) {
                            return;
                        }
                        this.setState({
                            systemTime: data.data ? moment(moment(data.data).format('YYYY-MM-DD')).format('X') : 0
                        }, () => {
                            const { leaseStartTime, leaseEndTime, systemTime } = this.state;
                            if (leaseStartTime > systemTime) {  // 包年开始时间大于当前时间
                                message.error('课程包年还未开始');
                            } else if (systemTime > leaseEndTime) {
                                message.error('课程包年已到期');
                            } else {
                                this.props.goTrainingsManage({ ...query, leaseStartTime, leaseEndTime, systemTime });
                            }
                        });
                    });
                });
            });
        } else {
            this.props.goTrainingsManage({ ...query });
        }
    }
    handleToReply = (id) => {
        let param = {};
        param[`visible-${id}`] = true;
        this.setState({ ...param })
    }
    handleCancelReply = (id) => {
        let param = {};
        param[`visible-${id}`] = false;
        this.setState({ ...param })
    }
    handleDelete = (id) => {
        Service.deleteMessage(id).then((data) => {
            if (!data.success) {
                message.error(data.errMsg);
                return;
            }
            message.success('删除成功');
            this.getCourseMessage();
        });
    }
    confirmReply = (id, content) => {
        if (content.replace(/\s+/g, "") == '' || content == undefined) {
            message.error('请输入回复内容');
            return false;
        }
        Service.replyMessage({ id, content }).then((res) => {
            if (res.success) {
                message.success('回复成功');
                let param = {};
                param[`visible-${id}`] = false;
                this.setState({ ...param })
                this.getCourseMessage();
            } else {
                message.error('操作失败');
            }
        })
    }
    switchShow = (id) => {
        let param = {}
        param[`show-${id}`] = !this.state[`show-${id}`];
        this.setState({ ...param })
    }

    render() {
        const { courseDetail } = this.state;
        let { prePaperResponseDTO, paperResponseDTO, homeWorkRespDTO, questionnaireRespDTO } = courseDetail;

        const renderQuestionModalProp = {
            questionList: this.state.tabKey == '1' ? prePaperResponseDTO && prePaperResponseDTO.exerciseRspDTOList : paperResponseDTO && paperResponseDTO.exerciseRspDTOList,
            canEditDelete: false
        };
        const totalScore = this.state.tabKey == '1' ? prePaperResponseDTO && (prePaperResponseDTO.totalScore).toFixed(1) : paperResponseDTO && (paperResponseDTO.totalScore).toFixed(1);
        const passScore = this.state.tabKey == '1' ? prePaperResponseDTO && prePaperResponseDTO.passScore : paperResponseDTO && paperResponseDTO.passScore;
        const totalNum = this.state.tabKey == '1' ? prePaperResponseDTO && prePaperResponseDTO.totalNum : paperResponseDTO && paperResponseDTO.totalNum;

        const warning = () => {
            message.warning('正在转码中，请稍后刷新查看');
        };
        const error = () => {
            message.error('转码失败，请检查视频后重新上传');
        };
        const previewCourseware = (url, type, curHospitalId) => {
            window.open(`${PREVIEWURL}?arg=${encodeURIComponent(url)}&type=${type}`);
        };

        return (
            <div>
                <div className="boz-component-body-card padding-0-20">
                    <div className={styles.courseTypeSprite}>
                        {
                            courseDetail.trainModel == 0 ?
                                <span className={styles.courseTypeName}>在线培训</span> :
                                <span className={`${styles.courseTypeName} ${styles.offline}`}>现场培训</span>
                        }
                        <p className={styles.name}>{courseDetail.courseName}</p>
                    </div>
                    {
                        courseDetail.cover ? (
                            <div className={styles.coverPicSprite}><img src={courseDetail.cover} className={styles.coverPic} /></div>
                        ) : ''
                    }
                    <p className={styles.intro}>{courseDetail.introduction}</p>
                    <p className={styles.intro}>
                        主讲人：{JSON.parse(courseDetail.lecturer?courseDetail.lecturer:'[]').map((item,index)=>{
                            return <span key={index}>{`${item.lecturerName}（${item.lecturerCredit}）`}</span>
                        })}
                    </p>
                </div>
                {
                    courseDetail.resourceRespDTOList && courseDetail.resourceRespDTOList.length > 0 ? (
                        <div className={`boz-component-body-card ${styles.courseDetailCont}`}>
                            <div className={styles.title}>
                                <p className={styles.name}>课件</p>
                            </div>
                            <div className={`padding-0-20 ${styles.resourceItemSprite}`}>
                                {
                                    courseDetail.resourceRespDTOList.map((item, index) => {
                                        let fileName = item.fileName;
                                        let fileTpl = '';
                                        if (/pdf/i.test(item.fileType)) {
                                            fileTpl = (<a onClick={() => previewCourseware(item.url, 'pdf')} href="javascript:;">{fileName}</a>);
                                        } else if (item.type === 1) {
                                            if (item.returnUrl) {
                                                fileTpl = (<a onClick={() => previewCourseware(item.returnUrl, 'video')} href="javascript:;">{fileName}</a>);
                                            } else {
                                                if (item.status === 0) {
                                                    fileTpl = (<a onClick={warning}>{fileName}</a>);
                                                    // } else if (item.status === -1) {
                                                } else {
                                                    fileTpl = (<a onClick={error}>{fileName}</a>);
                                                }
                                            }
                                        } else {
                                            if (item.pdfUrl) {
                                                fileTpl = (<a onClick={() => previewCourseware(item.pdfUrl, 'pdf')} href="javascript:;">{fileName}</a>);
                                            } else {
                                                if (item.size && item.size.indexOf('M') > -1) {
                                                    const fileSize = item.size.split('M')[0];
                                                    if (fileSize > 10) {
                                                        fileTpl = (<a onClick={warning}>{fileName}</a>);
                                                    } else {
                                                        fileTpl = (<a href={`https://view.officeapps.live.com/op/view.aspx?src=${item.url}`} target="_blank">{fileName}</a>);
                                                    }
                                                } else {
                                                    fileTpl = (<a href={`https://view.officeapps.live.com/op/view.aspx?src=${item.url}`} target="_blank">{fileName}</a>);
                                                }

                                            }
                                        }
                                        return <div key={fileName + '_' + index} className={styles.resourceItemLink}>{index + 1}. {fileTpl}</div>;
                                    })
                                }
                            </div>
                        </div>
                    ) : ''
                }
                {/*Tabs
                  courseDetail.paperResponseDTOList ?
                    <div className={`boz-component-body-card ${styles.courseDetailCont}`}>
                        <div className={styles.title}>
                            <p className={styles.name}>
                                随堂测验<span className={styles.explain}>共有试题
                            <b style={{ color: '#1A92FF' }}>{totalNum}</b>道，
                            总分：<b style={{ color: '#2DD37F' }}>{totalScore}</b></span>
                            </p>
                        </div>
                    </div>
                    : ''
                */}
                {!this.state.tabKey ? null:
                <div className={`boz-component-body-card ${styles.courseDetailCont}`}>
                    <Tabs activeKey={this.state.tabKey} defaultActiveKey="1" onChange={(key) => { this.setState({ tabKey: key }) }}>

                        {prePaperResponseDTO && prePaperResponseDTO.exerciseRspDTOList ?
                            <TabPane tab="课前评估" key="1">
                                <div className={styles.examPaper}>
                                    <RenderQuestionModal {...renderQuestionModalProp} />
                                </div>
                            </TabPane>
                            : ''
                        }
                        {paperResponseDTO && paperResponseDTO.exerciseRspDTOList ?
                            <TabPane tab="随堂测试" key="2">
                                <div className={styles.examPaper}>
                                    <RenderQuestionModal {...renderQuestionModalProp} />
                                </div>
                            </TabPane>
                            : ''
                        }
                        {
                            questionnaireRespDTO && questionnaireRespDTO.questionnaireName ? <TabPane tab="满意度问卷" key="4"><p style={{padding: '0px 20px 20px'}}><a href={`/hospital-admin/employee-satisfaction-paper/employee/paperDetail?paperId=${questionnaireRespDTO.questionnaireId}`} style={{ padding: '0 20px 20px' }} target="_blank">{questionnaireRespDTO.questionnaireName}</a></p></TabPane> : ''
                        }
                        {
                            homeWorkRespDTO && homeWorkRespDTO.homeWork ? <TabPane tab="课后作业" key="3"><p style={{ padding: '0 20px 20px' }}>{homeWorkRespDTO.homeWork}</p></TabPane> : ''
                        }
                    </Tabs>
                    <i className={styles.icoTitleBar}></i>
                    {this.state.tabKey == '1' || this.state.tabKey == '2' ?
                        <span className={styles.explainTips}>共有试题<b style={{ color: '#1A92FF' }}>{totalNum}</b>道，总分：<b style={{ color: '#2DD37F' }}>{totalScore}</b></span> : null
                    }
                </div>}

                <div className={`boz-component-body-card ${styles.courseDetailCont}`} style={{ boxShadow: 'none' }}>
                    <div className={styles.title}>
                        <p className={styles.name}>
                            课程留言<span className={styles.summary}>共有{this.state.pagination.total}条留言</span>
                        </p>
                    </div>

                    <Table
                        // className={styles.profileList}
                        columns={this.columns}
                        dataSource={this.state.courseMessageList}
                        loading={this.state.loading}
                        bordered={false}
                        rowKey={(record, index) => index}
                        pagination={false}
                        showHeader={false}
                    />
                    <Pagination
                        className="ant-table-center-pagination"
                        onChange={(pageNum) => {
                            let pagination = this.state.pagination; pagination.pageNum = pageNum; this.setState({ pagination }, () => {
                                this.getCourseMessage();
                            })
                        }}
                        // onShowSizeChange={(pageNum, pageSize) => this.load({ pageNum, pageSize })}
                        {...this.state.pagination}
                    />
                </div>

                {/* v3.4.0 新需求删除发布按钮 */}
                {/* {
                    hospitalId !== INNER_HOSPITALID && !innerFromPage.fromPage && this.props.fromPlanning != 'planning' ?
                        <div className={`boz-component-body-card ${styles.buttonRow}`}>
                            <Button type='primary' className={styles.returnBtn} onClick={() => this.goTrainingsManage({ totalScore })}>发布</Button>
                        </div>
                        : ''
                } */}
            </div>
        );
    }
}

export default CourseDetail;
