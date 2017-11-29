import React from 'react';
import IndexView from './Index.js';
import ListViewContainer from './routes/ListView.js'; // bundle-loader 返回
import ScrollToTop from '../../../src/components/ScrollToTop';

import Bundle from '../../../src/core/bundle.js';
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
          path: '/index.html',
          exact: true,
          component: IndexView   // require('./Index.js')
          // component: (props, a, method) => {
          //  return <IndexView />;
          // }
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
          path: '/detail.html',
          component: (props) => createChildRouteComponent(require('./routes/DetailView.js')),// DetailViewContainer
        },
        { 
          path: '/immutability-demo-push.html',
          exact: true,
          component: (props) => createChildRouteComponent(require('./routes/ImmutabilityHelperPushView.js'), props),
        }
      ]
    }
  ];
  return <div>{renderRoutes(routes)}</div>;
}

export default RouterConfig;
