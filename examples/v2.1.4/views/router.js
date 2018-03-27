import React from 'react';
import IndexView from './Index.js';
import ListViewContainer from './routes/ListView.js'; // bundle-loader 返回
import ScrollToTop from '../../../src/components/ScrollToTop';
import DetailView from './routes/DetailView.js';
import Bundle from '../../../src/core/bundle.js';
//import DetailViewContainer from 'bundle-loader?lazy&name=page-[name]!./routes/detailView.js';
import { userIsAuthenticatedRedir, userIsNotAuthenticatedRedir, userIsNotAuthenticatedRedir2, userIsAdministratorRedir, userIsAuthenticated, userIsNotAuthenticated } from '../../../src/core/auth';
import { /* matchRoutes, */ renderRoutes } from 'react-router-config';
// const LoginView = userIsNotAuthenticatedRedir(require('./routes/Login'));
import LoginView from './routes/Login'
import LoginAfterView from './routes/LoginAfter'

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

// const LoginAuthenticatedView = userIsNotAuthenticatedRedir2(createChildRouteComponent(LoginView));
const LoginAuthenticatedView = createChildRouteComponent(LoginView);

function RouterConfig({ history, app }) {
  const routes = [
    {
      component: Root,
      routes: [
        { // 分离 与 路由鉴权
          path: '/login.html',
          exact: true,
          component: userIsNotAuthenticatedRedir(props => createChildRouteComponent(LoginView, props))
        },
        {
          path: '/login-after.html',
          component: userIsAuthenticatedRedir(props => createChildRouteComponent(LoginAfterView, props))
        },

        {// 非 routes 路由
          path: '/index.html',
          exact: true,
          component: IndexView // require('./Index.js')
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
          component: (props) => createChildRouteComponent(DetailView),// DetailViewContainer
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
