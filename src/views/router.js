import React from 'react';
import IndexView from './index.js';
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
        { // 非 routes 路由
          path: '/index.html',
          exact: true,
          component: IndexView, // require('./Index.js')

          // component: (props, a, method) => {
          //  return <IndexView />;
          // }
        },
        {
          path: '/demo.html',
          component: (props) => {
            return createChildRouteComponent(require('./routes/Demo'), props);
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
