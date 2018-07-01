import React from 'react';
import IndexView from './Index.js';
import ListViewContainer from './routes/ListView.js'; // bundle-loader 返回
import ScrollToTop from '../../../src/components/ScrollToTop';
import DetailView from './routes/DetailView.js';
import Bundle from '../../../src/core/bundle.js';
import { /* matchRoutes, */ renderRoutes } from 'react-router-config';

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
        { // 非 routes 路由
          path: '/index.html',
          exact: true,
          component: IndexView, // require('./Index.js')

          // component: (props, a, method) => {
          //  return <IndexView />;
          // }
        },
        {
          path: '/detail.html',
          // import DetailViewContainer from 'bundle-loader?lazy&name=page-[name]!./routes/detailView.js';
          component: (props) => createChildRouteComponent(DetailView), // DetailViewContainer
        },
        {
          path: '/list/:id/:name.html',
          component: (props, a, method) => {
            return createChildRouteComponent(ListViewContainer, props);
          },
          routes: [
            { 
              path: '/list/:id/:name/info.html',
              component: (props, a, method) => {
                return createChildRouteComponent(ListViewContainer, props);
              }
            }
          ]
        },
        {
          path:'*', // 置于所有路由匹配的最后一项 有效
          exact: true,
          component: (props) => {
            return createChildRouteComponent(require('./routes/Error/404.js'), props);
          },
        }
      ]
    }
  ];
  return <div>{renderRoutes(routes)}</div>;
}

export default RouterConfig;
