import React, { Component } from 'react';
import { Modal /*, Table */ } from 'antd';
import TestResult from '../Widgets/TestResult';

class TrainingResultModal extends Component {
    constructor(props) {
        super(props);
        const { visible, onCancel } = this.props;
        this.modalProps = {
            footer: null,
            title: '测验结果',
            width: 700,
            visible,
            onCancel
        };
    }

    render() {
        return (
            <Modal {...this.modalProps}>
                {/* <div style={{ padding: 20 }}>
                    <Table
                        columns={this.columns}
                        dataSource={this.props.paperRecordList}
                        rowKey={(record, index) => index}
                        pagination={false}
                    />
                </div> */}
                <TestResult paperRecordList={paperRequestDTO.paperRecordForDetailRspDTOList ? paperRequestDTO.paperRecordForDetailRspDTOList : []} />
            </Modal>
        );
    }
}

export default TrainingResultModal;
