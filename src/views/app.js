// 当前最新版本: v2.0.1
import React, { Component } from 'react';
import { BrowserRouter as RouterContainer } from 'react-router-dom';
import MainTemplateLayout from '@317hu/MainTemplateLayout';
import RootRouter from './router';
const boz = require('../../config').BOZ;
class App extends Component{
  render(){
    const supportsHistory = 'pushState' in window.history;
    console.log('boz......app.js->', boz);

    const mainTemplateLayoutProps = {
      env: boz[`env`],
      selectedModuleName: '护士培训',
      module: 'nurse-training-exam',
      bar: ['top-menu', 'left-menu'], // 未配置则显示全部导航
    };

    return (
      <RouterContainer  basename="/hospital-admin/frontend-react-projects" forceRefresh={!supportsHistory} keyLength={10}>
        <MainTemplateLayout {...mainTemplateLayoutProps}>
          <RootRouter />
        </MainTemplateLayout>
      </RouterContainer>
    );
  }
}

module.exports = App