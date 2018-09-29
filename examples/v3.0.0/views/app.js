import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as RouterContainer } from 'react-router-dom';
import MainTemplateLayout from '@317hu/MainTemplateLayout';
import RootRouter from './router';
const boz = require('../../config').BOZ;

import { getAdminInfo } from '../actions/config';

class App extends Component{
  constructor(props) {
    super(props)
    props.dispatch(getAdminInfo()).then(data => {
      //
    });
  }
  render(){
    const supportsHistory = 'pushState' in window.history;
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

function select(state) {
  return {}
}

function actions(dispatch, ownProps) {
  return { dispatch }
}

export default connect(select, actions)(App)
