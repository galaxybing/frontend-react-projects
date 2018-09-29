import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Table, Pagination, Popconfirm, Input, Radio, Tabs, Select, message, Row, Col } from 'antd';
import { getCache } from '../../core/_utils/storage';
import { searchStrToObj } from '../../core/_utils/common';
import { PAGE_SIZE_OPTIONS, NURSING_DEPT_HOSPITALID } from '../../constants';
import serialize from '../../core/_utils/serialize';
import Service from '../../actions/trainings';
import styles from './style.css';

const Search = Input.Search;
const Option = Select.Option;
const TabPane = Tabs.TabPane;

const { userId, hospitalId } = getCache('profile') || {};

class Exams extends React.Component { /* 该已发布培训 列表 ？？ 未引用到*/
    constructor(props) {
        super(props);
        this.columns = [{
            dataIndex: 'name',
            key: 'name',
            width: '100%',
            render: (text, record) => {

                const paperLink = {
                    pathname: '/hospital-admin/nurse-training-course/exam-paper-manage/exam-paper-detail.html',
                    search: `?${serialize({ releaseId: record.paperId, menuName: 'tests', paperType: record.randomStatus })}`
                    // query: { releaseId: record.paperId, menuName: 'tests', paperType: record.randomStatus }  // menuName左侧菜单选中的项
                };
                const urlExamLink = {
                    pathname: '/hospital-admin/nurse-training-course/exams/exam-detail.html',
                    search: `?${serialize({ releaseId: record.id, releaseStatus: this.props.filter.status, isEndPage: this.props.filter.status == 3 ? 'yes' : '' })}`
                    // query: { releaseId: record.id, releaseStatus: this.props.filter.status, isEndPage: this.props.filter.status == 3 ? 'yes' : '' }
                };
                const paperTpl = record.canEdit === 1 ? <Link to={paperLink}>{record.paperName}</Link> : record.paperName;
                const urlExam = <Link to={urlExamLink}>考试详情</Link>;
                let levelStr = '';  // 级别
                if (record.level == 1) {
                    levelStr = '科级';
                } else if (record.level == 2) {
                    levelStr = '院级';
                } else if (record.level == 3) {
                    levelStr = '病区';
                }
                let publishResultTypeTpl = '';
                switch (record.publishResultType) {
                    case 0:
                        publishResultTypeTpl = <span>系统公布</span>;
                        break;
                    case 1:
                        if (record.publishResultStatus !== 9) {
                            publishResultTypeTpl = (
                                <span>
                                    人工公布<span style={{ color: '#FF771E', fontSize: 12 }}>(待公布成绩)</span>
                                </span>
                            );
                        } else {
                            publishResultTypeTpl = <span>人工公布</span>;
                        }
                        break;
                    default:
                        break;
                }
                let actionTpl = '';
                if (record.releaseStatus === 9) {
                    if (record.canEdit === 1) {
                        if (this.props.filter.status == 1) {
                            actionTpl = (
                                <div style={{ lineHeight: 1.8 }}>
                                    {urlExam}
                                    <br />
                                    <Popconfirm title="确认撤销考试？" onConfirm={() => this.cancelExam(record)}>
                                        <a title="撤销考试">撤销考试</a>
                                    </Popconfirm>
                                    <br />
                                    <Link
                                        to={{
                                            pathname: '/hospital-admin/nurse-training-course/exam-paper-manage/exam-user-manage.html',
                                            // query: { releaseId: record.id, paperId: record.paperId }
                                            search: `?releaseId=${record.id}&paperId=${record.paperId}`
                                        }}
                                    >人员管理</Link>
                                    <br />
                                    <a title="导出试卷" style={{ color: '#ccc' }} onClick={() => { message.info('请于考试时间结束后导出'); }}>导出试卷</a>
                                </div>
                            );
                        } else if (this.props.filter.status == 2) {
                            actionTpl = (
                                <div style={{ lineHeight: 1.8 }}>
                                    {urlExam}
                                    <br />
                                    <Popconfirm title="确认撤销考试？" onConfirm={() => this.cancelExam(record)}>
                                        <a title="撤销考试">撤销考试</a>
                                    </Popconfirm>
                                    <br />
                                    <Link
                                        to={{
                                            pathname: '/hospital-admin/nurse-training-course/exam-paper-manage/exam-user-manage.html',
                                            // query: { releaseId: record.id, paperId: record.paperId }
                                            search: `?releaseId=${record.id}&paperId=${record.paperId}`
                                        }}
                                    >人员管理</Link>
                                </div>
                            );
                        } else if (this.props.filter.status == 3) {
                            actionTpl = (
                                <div style={{ lineHeight: 1.8 }}>
                                    {urlExam}
                                    <br />
                                    <a onClick={() => this.exportPaperPdf(record)}>导出试卷</a>
                                </div>);
                        } else {
                            actionTpl = (
                                <div style={{ lineHeight: 1.8 }}>
                                    {urlExam}
                                    <br />
                                    <Popconfirm title="确认删除?" onConfirm={() => this.deleteCancelExam(record)}>
                                        <a>删除</a>
                                    </Popconfirm>
                                </div>
                            );
                        }
                    } else {
                        actionTpl = urlExam;
                    }
                } else {
                    actionTpl = '发布中';
                }

                return (
                    <div>
                        {
                            this.props.filter.status === '4' ?
                                <Row>
                                    <div className={styles.basicinfoDesc}>
                                        <div className={styles.revokeInfoRow}>
                                            <span>撤销时间：<em>{record.revokeTime}</em></span>
                                            <span>撤销人员：<em>{record.revokeName}</em></span>
                                        </div>
                                    </div>
                                </Row> : ''
                        }
                        <Row type="flex" justify="space-around" align="middle" className={styles.listDiv}>
                            <Col span={12} className="boz-table-form-basicinfo">
                                <div className={`${styles['listItemTitle-public']}`}>{record.name}</div>
                                <div className={styles.basicinfoDesc}>
                                    <div>
                                        <span>考试时间：<em>{record.planStartTime}&nbsp;-&nbsp;{record.planEndTime}</em></span>
                                    </div>
                                    <div>
                                        <span>
                                            试卷名称：{paperTpl}
                                        </span>
                                    </div>
                                    {
                                        NURSING_DEPT_HOSPITALID.indexOf(hospitalId) > -1 && record.planName ?
                                            <div>
                                                <span>所属计划：<em>{record.planName}</em></span>
                                            </div> : ''
                                    }
                                    <div>
                                        <span>级别：<em>{levelStr}</em></span>
                                        <span>发布者：<em>{record.releaseName}</em></span>
                                        {
                                            NURSING_DEPT_HOSPITALID.indexOf(hospitalId) > -1 ?
                                                <span>成绩公布方式：<em>{publishResultTypeTpl}</em></span> : ''
                                        }
                                    </div>
                                </div>
                            </Col>
                            <Col span={7}>
                                <div className={styles.basicinfoDesc}>
                                    <div>
                                        <span>完成情况：<em>{record.planStartTime > new Date().getTime() ? '未开始' : `${record.examStudent}/${record.totalSudent}人`}</em></span>
                                    </div>
                                    {
                                        record.scanSignIn === 1 ?
                                            <div>
                                                <Link to="/tests/signCode" query={{ releaseId: record.id, testName: record.name }}>打印考试签到二维码</Link>
                                            </div>
                                            : ''
                                    }
                                </div>
                            </Col>
                            <Col span={5} style={{ textAlign: 'right' }}>
                                {actionTpl}
                            </Col>
                        </Row>
                    </div>
                );
            }
        }];
    }
    componentDidMount() {
    }
    deleteCancelExam = (record) => {
        Service.deleteCancelExam(record.id).then(data => {
            if (!data.success) {
                message.error(data.errMsg);
                return;
            }
            message.success('删除成功');
            this.props.onChange({});
        });
    }
    cancelExam = (record) => {
        Service.cancelExam(record.id).then(data => {
            if (!data.success) {
                message.error(data.errMsg);
                return;
            }
            message.success('撤销成功');
            this.props.onChange({});
        });
    }
    render() {
        const { loading, filter, dataSource, releasePaperCounts } = this.props;
        const thisMonNum = releasePaperCounts.thisMonNum || 0;
        const followUpNum = releasePaperCounts.followUpNum || 0;
        const completeNum = releasePaperCounts.completeNum || 0;
        const rescindedNum = releasePaperCounts.rescindedNum || 0;
        const pagination = {
            ...dataSource.pagination,
            onChange: (pageNum) => {
                this.props.onChange({ pageNum })
            },
            onShowSizeChange: (pageNum, pageSize) => {
                this.props.onChange({ pageNum, pageSize });
            }
        }
        return (
            <div className="boz-component-body">
                <div style={{ marginBottom: 15, marginTop: 15 }}>
                    <Radio.Group
                        value={filter.accountId}
                        onChange={e => this.props.onChange({ accountId: e.target.value, pageNum: 1 })}
                    >
                        <Radio.Button value="-1">({releasePaperCounts.allCount})</Radio.Button>
                        <Radio.Button value={`${userId}`}>我的({releasePaperCounts.persionCount})</Radio.Button>
                    </Radio.Group>
                </div>
                <div className="boz-component-body-card">
                    <Tabs
                        onChange={value => this.props.onChange({ status: value, pageNum: 1 })}
                        className={styles.rangeTab}
                        activeKey={filter.status}
                    >
                        <TabPane tab={`本月计划 (${thisMonNum})`} key="1" />
                        <TabPane tab={`后续计划 (${followUpNum})`} key="2" />
                        <TabPane tab={`已结束 (${completeNum})`} key="3" />
                        <TabPane tab={`已撤销 (${rescindedNum})`} key="4" />
                    </Tabs>
                    <div className="padding-0-20" style={{ marginBottom: 10 }}>
                        <span style={{ color: '#a5a5a5' }}>级别</span>
                        <Select
                            style={{ width: 150, marginLeft: 15, marginRight: 15 }}
                            onChange={value => this.props.onChange({ level: value, pageNum: 1 })}
                            placeholder="请选择级别"
                            size="large"
                            value={filter.level}
                        >
                            <Option value="-1">全部</Option>
                            <Option value="3">病区</Option>
                            <Option value="1">科级</Option>
                            <Option value="2">院级</Option>
                        </Select>
                        <Search
                            ref={c => this._search = c}
                            placeholder="请输入考试名称查找"
                            style={{ width: 240 }}
                            onSearch={value => this.props.onChange({ name: value, pageNum: 1 })}
                            size="large"
                        />
                    </div>
                    <Table
                        columns={this.columns}
                        dataSource={dataSource.tableList}
                        loading={loading}
                        rowKey={record => record.id}
                        pagination={false}
                        showHeader={false}
                        className="boz-table-form"
                    />
                    <Pagination
                        className="ant-table-center-pagination"
                        showSizeChanger
                        pageSizeOptions={PAGE_SIZE_OPTIONS}
                        {...pagination}
                    />
                </div>
            </div>
        );
    }
}

function select(state) {
    return {
        exams: state.exams,
    };
}
function actions(dispatch, ownProps) {
    return {
        dispatch,
    };
};

export default connect(select, actions)(Exams);