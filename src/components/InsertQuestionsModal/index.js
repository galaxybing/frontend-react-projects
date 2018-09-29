import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Tabs, Button, Icon, Badge, Popconfirm, message } from 'antd';
import Service from '../../actions/insertQuestions';
import ChooseQByInsertModal from './ChooseQByInsertModal';
import styles from './style.css';
import { Server } from 'https';

const TabPane = Tabs.TabPane;

class InsertQuestionsModal extends Component { // 弹层组件，由培训管理界面引用
    constructor(props) {
        super(props);
        const { modalVisible, hideModal, modalType } = props.insertQuestions;
        this.modalProps = {
            title: modalType === 'create' ? '设置' : '修改',
            visible: modalVisible,
            width: 730,
            onCancel: () => {
                this.props.dispatch({
                    type: 'insertQuestions/hideModal',
                });
            },
            footer: null
        };
        this.state = {
            chooseQVisible: false,
            currentTime: null,
            isPlayingMap: new Map(),
            currentVideoData: {},
            hidePlayIconMap: new Map()
            // insertQuestionsList: new Map([]),  // 已经插入的试题
        };
        this.currentTime = null;
    }
    componentDidMount() {
        const { videoInsertQuestions } = this.props.insertQuestions;
        const { currentVideoData } = this.state;
        if (videoInsertQuestions.videoRespDTOList && videoInsertQuestions.videoRespDTOList.length && !currentVideoData.id) {
            this.setState({
                currentVideoData: videoInsertQuestions.videoRespDTOList[0]
            });
        }
    }
    chooseQuestions = () => {
        const { insertQuestionsList } = this.props.insertQuestions;
        const { currentVideoData } = this.state;
        const videoRef = this.refs[currentVideoData.id];
        videoRef.pause();
        const selectedQuestion = insertQuestionsList.get(currentVideoData.id) || [];
        const currentTime = Math.floor(videoRef.currentTime) * 1000;
        let copyQuestion = false;
        for (const item of selectedQuestion) {
            if (item.insertTime === currentTime) {
                message.warning('同一时间不能插入多个试题');
                copyQuestion = true;
                break;
            }
        }
        if (!copyQuestion) {
            this.setState({
                chooseQVisible: true
            });
        }
    }
    hideChooseQuestionsModal = () => {
        this.setState({
            chooseQVisible: false
        }, () => {
            const { currentVideoData } = this.state;
            const videoRef = this.refs[currentVideoData.id];
            videoRef.play();
        });
    }
    videoPlay = () => {
        const { currentVideoData } = this.state;
        const videoRef = this.refs[currentVideoData.id];
        this.setState({
            currentTime: Math.floor(videoRef.currentTime),
        });
    }
    videoPlaying = () => {
        const { currentVideoData } = this.state;
        const videoRef = this.refs[currentVideoData.id];
        this.setState({
            currentTime: Math.floor(videoRef.currentTime)
        });
    }
    videoTimeUpdate = () => {
        // const videoId = document.getElementById('myvideo');
        // const duration = Math.floor(videoId.duration);
        const { isPlayingMap, currentVideoData } = this.state;
        const videoRef = this.refs[currentVideoData.id];
        const currentTime = Math.floor(videoRef.currentTime);
        const isPlaying = isPlayingMap.get(currentVideoData.id);
        if (currentTime > 0 && !isPlaying) {
            isPlayingMap.set(currentVideoData.id, true);
            this.setState({ isPlayingMap });
        } else if (currentTime === 0 && isPlaying) {
            isPlayingMap.set(currentVideoData.id, false);
            this.setState({ isPlayingMap });
        }
    }
    videoPause = () => {
        const { currentVideoData } = this.state;
        const videoRef = this.refs[currentVideoData.id];
        // console.log('被暂停了');
        this.setState({
            currentTime: Math.floor(videoRef.currentTime)
        });
    }

    formatTime = (time) => {
        let tpl = '';
        const hours = parseInt((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60), 10);
        const minutes = parseInt((time % (1000 * 60 * 60)) / (1000 * 60), 10);
        const seconds = (time % (1000 * 60)) / 1000;
        if (hours > 0) {
            const hoursTpl = hours > 9 ? hours.toString() : `0${hours.toString()}`;
            tpl += `${hoursTpl}:`;
        }
        const minutesTpl = minutes > 9 ? minutes.toString() : `0${minutes.toString()}`;
        tpl += `${minutesTpl}:`;
        tpl += seconds > 9 ? seconds.toString() : `0${seconds.toString()}`;
        return tpl;
    }
    videoChange = (key) => {
        const { videoRespDTOList } = this.props.insertQuestions.videoInsertQuestions;
        let currentVideoData = {};
        for (const item of videoRespDTOList) {
            if (item.id.toString() === key) {
                currentVideoData = item;
                break;
            }
        }
        this.setState({
            currentVideoData,
            hidePlayIconMap: new Map()
        });
    }
    checkPlayIcon = () => {
        const { hidePlayIconMap, currentVideoData } = this.state;
        const videoRef = this.refs[currentVideoData.id];
        if (videoRef.paused) {
            videoRef.play();
        } else {
            videoRef.pause();
        }
        hidePlayIconMap.set(currentVideoData.id, true);
        this.setState({ hidePlayIconMap });
    }
    saveInsertQuestions = () => {
        const { insertQuestionsList } = this.props.insertQuestions;
        const { currentVideoData } = this.state;

        const selectedInsertQList = [];
        for (const value of insertQuestionsList.values()) {
            for (const item of value) {
                item.contentId = currentVideoData.contentId;
                item.courseId = currentVideoData.courseId;
                selectedInsertQList[selectedInsertQList.length] = item;
            }
        }
        const param = {
            contentId: currentVideoData.contentId,
            addVideoInsertTitleReqDTOList: selectedInsertQList
        };
        Service.addVideoInsert(param).then(data => {
            if (!data || !data.success) {
                message.error(data.errMsg);
                return;
            }
            message.success('视频插题成功！');
            this.props.dispatch({
                type: 'insertQuestions/hideModal',
            });
            if(this.props.reload) {
                this.props.reload();  // 列表插题成功之后重新请求数据（不要删！！）
            }
        });
        // this.props.saveQuestions(param);
    }
    onContextMenuHandle = (e) => {
        e.preventDefault();
    }
    deleteInsertQuestions = (resourceId, exerciseId, index) => {
        this.props.dispatch({
            type: 'insertQuestions/deleteInsertQuestions',
            payload: { resourceId, exerciseId, index }
        });
    }
    render() {
        const { chooseQVisible, currentTime, isPlayingMap, currentVideoData, hidePlayIconMap } = this.state;
        const { videoInsertQuestions, insertQuestionsList } = this.props.insertQuestions;
        const { videoRespDTOList = [], exerciseForVideoRespDTO = [] } = videoInsertQuestions;
        const isPlaying = isPlayingMap.get(currentVideoData.id);
        const hidePlayIcon = hidePlayIconMap.get(currentVideoData.id);

        const currentInsertQ = insertQuestionsList.get(currentVideoData.id) || [];   // 当前播放视频已插入的试题

        const chooseQModalProps = {
            visible: chooseQVisible,
            onBcak: this.hideChooseQuestionsModal,
            questionsList: exerciseForVideoRespDTO,
            insertQuestionsList: insertQuestionsList,
            saveChooseQuestion: (questionItem) => {
                this.props.dispatch({
                    type: 'insertQuestions/saveInsertQuestions',
                    payload: { questionItem }
                })
            },
            param: {
                insertTime: Math.floor(currentTime * 1000),
                resourceId: currentVideoData.id
            }
        };
        const videoItem = videoRespDTOList.map((item) => {
            const currentSelectedQ = insertQuestionsList.get(item.id) || [];
            return (
                <TabPane
                    tab={
                        <Badge count={currentSelectedQ ? currentSelectedQ.length : 0} style={{ backgroundColor: '#3ED086', fontWeight: 100, fontSize: 12 }}>
                            <span title={item.fileName}>{item.fileName}</span>
                        </Badge>
                    }
                    key={item.id}
                />
            );
        });

        const insertQItem = currentInsertQ.map((item, index) => {
            const insertTime = this.formatTime(item.insertTime);
            return (
                <li key={item.exerciseId}>
                    <label>{insertTime}</label>
                    <span title={item.exerciseName}>{item.exerciseName}</span>
                    <Popconfirm title="确定删除？" onConfirm={() => this.deleteInsertQuestions(item.resourceId, item.exerciseId, index)}>
                        <Icon type="close-circle" className={styles.insertQDel} />
                    </Popconfirm>
                </li>
            );
        });

        const videoRef = currentVideoData.id;
        return (
            <Modal {...this.modalProps}>
                <div className={styles.insertQStudyTime}>学员须在<span style={{ color: '#FFB030' }}>5分钟</span>内完成答题，超时需重新学习</div>
                <Tabs
                    className="insert-questions-tabs"
                    activeKey={currentVideoData.id ? `${currentVideoData.id}` : null}
                    onChange={this.videoChange}
                >
                    {videoItem}
                </Tabs>
                <div className={styles.insertQVideo}>
                    {
                        currentVideoData.returnUrl ?
                            <div className={styles.insertQVideoCont}>
                                <video
                                    src={`${currentVideoData.returnUrl}?_vid=${currentVideoData.id}`}
                                    controls="controls"
                                    ref={videoRef}
                                    onClick={() => {
                                        this.refs[videoRef].paused ? this.refs[videoRef].play() : this.refs[videoRef].pause();
                                    }}
                                    onPlay={this.videoPlay}
                                    onPause={this.videoPause}
                                    onPlaying={this.videoPlaying}
                                    onTimeUpdate={this.videoTimeUpdate}
                                    onContextMenu={this.onContextMenuHandle}
                                >
                                    您的浏览器不支持此视频播放，请切换浏览器
                </video>
                                {
                                    !hidePlayIcon ?
                                        <div className={styles.insertQPlayBg}>
                                            <Icon
                                                type="play-circle"
                                                className={styles.insertQPlayIcon}
                                                onClick={this.checkPlayIcon}
                                            />
                                        </div> : ''
                                }
                            </div> :
                            <div className={styles.transcodingBox}>
                                <Icon type="sync" style={{ marginRight: 5 }} className={`${styles.aniTransVideoRun}`} />转码中...(请在转码完成后再插入试题)
              </div>
                    }
                    <p style={{ margin: '10px 0' }}>
                        在视频开始播放后，找到希望插入试题的画面点击按钮插入试题
          </p>
                    <p>
                        <Button
                            onClick={() => this.chooseQuestions()}
                            type="primary"
                            style={{ width: 160, height: 40, marginBottom: 15 }}
                            disabled={!isPlaying}
                        >插入试题</Button>
                    </p>
                </div>
                <div style={{ height: 10, background: '#F3F8FC' }}></div>
                {
                    currentInsertQ && currentInsertQ.length ?
                        <div className={styles.insertQList}>
                            <span>该视频已插入试题：</span>
                            <ul>
                                {insertQItem}
                            </ul>
                        </div> : ''
                }
                <div className={styles.insertQFooter}>
                    <Button type="primary" ghost style={{ width: 160, height: 40, marginTop: 10 }} onClick={this.saveInsertQuestions}>保存</Button>
                </div>
                {chooseQVisible ? <ChooseQByInsertModal {...chooseQModalProps} /> : ''}
            </Modal>
        );
    }
}

function select(state) {
    return {
        insertQuestions: state.insertQuestions,
    };
}
function actions(dispatch, ownProps) {
    return {
        dispatch,
    };
};
export default connect(select, actions)(InsertQuestionsModal);