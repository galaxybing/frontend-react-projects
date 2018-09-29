import React, { Component } from 'react';
import { Modal, Button } from 'antd';
import { getCache } from '../../../core/_utils/storage';
import Service from '../../../actions/common';

const { hospitalId, roleId, regionIds = '' } = getCache('profile') || {};
const { careCentralUrl } = getCache('topNavRest') || {};
class UnauthenticationComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            adminName: ''
        };
    }
    componentDidMount() {
        Service.getAdminForHoppital(hospitalId).then(data => {
            if (data.success) {
                this.setState({ adminName: data.data });
            }
        });
    }
    goBack() {
        window.location.href = `${careCentralUrl}/care-central/page/userIndex`;
    }
    render() {
        return (
            <Modal
                title="提示"
                visible
                footer={null}
                closable={false}
            >
                <p style={{ textAlign: 'center', padding: '15px 0' }}>
                    {(roleId === 10001 || roleId === 10003 || roleId === 10004) && !regionIds ? `当前账号没有设置管理范围，请您联系医院管理员${this.state.adminName}进行设置！` : `无权限访问，请您联系医院管理员${this.state.adminName}进行开通！`}
                </p>
                <p style={{ textAlign: 'center', padding: '15px 0 30px' }}><Button type="primary" onClick={this.goBack}>返回到首页</Button></p>
            </Modal>
        );
    }
}

export default UnauthenticationComponent;
