import React from 'react';
import { Icon } from 'antd';
import MainLayout from '../../../components/Widgets/MainLayout';
import styles from './style.css';

export default function Error() {
    return (
        <MainLayout>
            <div className={styles.error}>
                <Icon type="frown-o" style={{ color: '#cccccc', fontSize: 48 }} />
                <h1 style={{color: '#cccccc', fontSize: 14}}>抱歉！您访问的页面不存在</h1>
            </div>
        </MainLayout>
    );
}
