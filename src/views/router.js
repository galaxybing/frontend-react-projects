import React from 'react';
import IndexView from './Index.js';
import ListViewContainer from './routes/ListView.js'; // bundle-loader 返回
// import DetailViewContainer from './routes/DetailView.js';
import ScrollToTop from '../components/ScrollToTop';

import Bundle from '../core/bundle.js';
//import DetailViewContainer from 'bundle-loader?lazy&name=page-[name]!./routes/detailView.js';

import { matchRoutes, renderRoutes } from 'react-router-config';
const createChildRouteComponent = (container, props,) => (
    <Bundle load={container}>
        {(View) => <View {...props} />}
    </Bundle>
);

const Root = ({ route }) => (
  <ScrollToTop>{/* <div> */}
    {renderRoutes(route.routes)}
  </ScrollToTop>
);

function RouterConfig({ history, app }) {
  const routes = [
    {
      component: Root,
      routes: [
        {
          path: '/',
          exact: false,
          component: IndexView
        },
        { 
          path: '/list/:id/:name.html',
          component: (props, a, method) => {
            return createChildRouteComponent(ListViewContainer, props);
          },
          routes: [
            { path: '/list/:id/:name/info.html',
              component: (props, a, method) => {
                return createChildRouteComponent(ListViewContainer, props);
              }
            }
          ]
        },
        { 
          path: '/detail.html',
          component: () => createChildRouteComponent(require('./routes/DetailView.js')),// DetailViewContainer
        }
      ]
    }
  ];
  return <div>{renderRoutes(routes)}</div>;
}

export default RouterConfig;
