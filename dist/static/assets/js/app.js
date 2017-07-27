webpackJsonp([3],{

/***/ 111:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _redux = __webpack_require__(61);

var thunkMiddleware = __webpack_require__(266).default;
var promise = __webpack_require__(130);
var array = __webpack_require__(129);
var analytics = __webpack_require__(128);
var reducers = __webpack_require__(126);

var createWeSiteStore = (0, _redux.applyMiddleware)(thunkMiddleware, promise, array, analytics);

function configureStore(onComplete) {
  var store = (0, _redux.createStore)(reducers, createWeSiteStore);
  return store;
}
module.exports = configureStore;

/***/ }),

/***/ 112:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(4);

var _react2 = _interopRequireDefault(_react);

var _reactRedux = __webpack_require__(29);

var _reactRouterDom = __webpack_require__(62);

var _reactRouterRedux = __webpack_require__(100);

var _bundle = __webpack_require__(123);

var _bundle2 = _interopRequireDefault(_bundle);

var _Index = __webpack_require__(131);

var _Index2 = _interopRequireDefault(_Index);

var _ListView = __webpack_require__(119);

var _ListView2 = _interopRequireDefault(_ListView);

var _DetailView = __webpack_require__(118);

var _DetailView2 = _interopRequireDefault(_DetailView);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var createChildRouteComponent = function createChildRouteComponent(container, props) {
  return _react2.default.createElement(
    _bundle2.default,
    { load: container },
    function (View) {
      return _react2.default.createElement(View, props);
    }
  );
};

var App = function (_Component) {
  _inherits(App, _Component);

  function App() {
    _classCallCheck(this, App);

    return _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).apply(this, arguments));
  }

  _createClass(App, [{
    key: 'render',
    value: function render() {
      var supportsHistory = 'pushState' in window.history;
      return _react2.default.createElement(
        _reactRouterDom.BrowserRouter,
        { basename: '/frontend-react-projects', forceRefresh: !supportsHistory, keyLength: 10 },
        _react2.default.createElement(
          'div',
          null,
          _react2.default.createElement(_reactRouterDom.Route, { name: 'index', path: '/index.html', component: _Index2.default }),
          _react2.default.createElement(_reactRouterDom.Route, { name: 'list', path: '/list/:id/:name.html', page: 'abc', component: function component(props, a, method) {
              return createChildRouteComponent(_ListView2.default, props);
            } }),
          _react2.default.createElement(_reactRouterDom.Route, { name: 'detail', path: '/detail.html', component: function component() {
              return createChildRouteComponent(_DetailView2.default);
            } })
        )
      );
    }
  }]);

  return App;
}(_react.Component);

;

function select(store) {
  return {
    isLoggedIn: true
  };
};
module.exports = (0, _reactRedux.connect)(select)(App);

/***/ }),

/***/ 114:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 115:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 117:
/***/ (function(module, exports) {

module.exports = {
  "nurseTrainApi": "nursetraindev.317hu.com",
  "careCentralApi": "",
  "privilegeApi": "privilegesit.317hu.com:8081",
  "watcher": ""
}

/***/ }),

/***/ 118:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (cb) {
	__webpack_require__.e/* require.ensure */(1).then((function (require) {
		cb(__webpack_require__(280));
	}).bind(null, __webpack_require__)).catch(__webpack_require__.oe);
};

/***/ }),

/***/ 119:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (cb) {
	__webpack_require__.e/* require.ensure */(0).then((function (require) {
		cb(__webpack_require__(281));
	}).bind(null, __webpack_require__)).catch(__webpack_require__.oe);
};

/***/ }),

/***/ 120:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _regenerator = __webpack_require__(36);

var _regenerator2 = _interopRequireDefault(_regenerator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var storage = window.localStorage;
var Parse = __webpack_require__(63);
module.exports = {
    loadConfig: function loadConfig() {
        return function (dispatch, getState) {
            dispatch({ type: 'LOADED_CONFIG_DATA' });
        };
    },
    loadAuth: function loadAuth() {
        var url = window.location.href;
    },
    loginCodeCheck: function loginCodeCheck(source) {
        var results = Parse.run({ method: 'login/getCode', body: source });
        return results;
    },

    loginCheck: function loginCheck(source) {
        return function () {
            var _ref = _asyncToGenerator(_regenerator2.default.mark(function _callee(dispatch) {
                var results;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return Parse.run({ method: 'login/mobileLogin', body: source });

                            case 2:
                                results = _context.sent;
                                return _context.abrupt('return', results);

                            case 4:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, undefined);
            }));

            return function (_x) {
                return _ref.apply(this, arguments);
            };
        }();
    }
};

/***/ }),

/***/ 121:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var configActions = __webpack_require__(120);
var mainActions = __webpack_require__(122);

module.exports = _extends({}, configActions, mainActions);

/***/ }),

/***/ 122:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _regenerator = __webpack_require__(36);

var _regenerator2 = _interopRequireDefault(_regenerator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var Parse = __webpack_require__(63);

module.exports = {
  common: function common(source) {
    return function () {
      var _ref = _asyncToGenerator(_regenerator2.default.mark(function _callee(dispatch, getState) {
        var results;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return Parse.run({ method: 'login/checkIn', body: source });

              case 2:
                results = _context.sent;
                return _context.abrupt('return', results);

              case 4:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, undefined);
      }));

      return function (_x, _x2) {
        return _ref.apply(this, arguments);
      };
    }();
  },
  vedioListAndUrlQuery: function vedioListAndUrlQuery() {
    return function (dispatch) {
      return Parse.run({ method: 'privilege-web/privilege/privilegeWeb/vedioListAndUrlQuery', body: {} });
    };
  }
};

/***/ }),

/***/ 123:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(4);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Bundle = function (_React$Component) {
  _inherits(Bundle, _React$Component);

  function Bundle() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Bundle);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Bundle.__proto__ || Object.getPrototypeOf(Bundle)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      mod: null
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Bundle, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.load(this.props);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.load !== this.props.load) {
        this.load(nextProps);
      }
    }
  }, {
    key: 'load',
    value: function load(props) {
      var _this2 = this;

      this.setState({
        mod: null
      });

      props.load(function (mod) {
        _this2.setState({
          mod: mod.default ? mod.default : mod
        });
      });
    }
  }, {
    key: 'render',
    value: function render() {
      if (!this.state.mod) return false;
      return this.props.children(this.state.mod);
    }
  }]);

  return Bundle;
}(_react2.default.Component);

exports.default = Bundle;

/***/ }),

/***/ 124:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(4);

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__(116);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactRedux = __webpack_require__(29);

var _propTypes = __webpack_require__(6);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _createReactClass = __webpack_require__(113);

var _createReactClass2 = _interopRequireDefault(_createReactClass);

var _configureStore = __webpack_require__(111);

var _configureStore2 = _interopRequireDefault(_configureStore);

var _app = __webpack_require__(112);

var _app2 = _interopRequireDefault(_app);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

__webpack_require__(115);
__webpack_require__(114);

var Root = function (_Component) {
    _inherits(Root, _Component);

    function Root(props) {
        _classCallCheck(this, Root);

        var _this = _possibleConstructorReturn(this, (Root.__proto__ || Object.getPrototypeOf(Root)).call(this, props));

        _this.state = {
            userName: "galaxyw",
            store: (0, _configureStore2.default)()
        };
        return _this;
    }

    _createClass(Root, [{
        key: 'render',
        value: function render() {
            var props = this.props;
            return _react2.default.createElement(
                _reactRedux.Provider,
                { store: this.state.store },
                _react2.default.createElement(_app2.default, null)
            );
        }
    }]);

    return Root;
}(_react.Component);

Root.defaultProps = {
    demo: false
};
;

function startApp() {
    _reactDom2.default.render(_react2.default.createElement(Root, { name: 'demo-react-router-redux' }), document.getElementById('app'));
}
startApp();

/***/ }),

/***/ 125:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var storage = window.localStorage;

var initialState = {
    wifiNetwork: 'wifi',
    baseURL: ""
};

function config() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
    var action = arguments[1];

    if (action.type === 'LOADED_CONFIG_DATA') {
        return _extends({}, state, {
            tokenVerified: true
        });
    }
    if (action.type === 'LOGIN_ID_NAME') {
        return {
            id: action.data.id,
            name: encodeURIComponent(action.data.name)
        };
    }
    return state;
}

module.exports = config;

/***/ }),

/***/ 126:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _reactRouterRedux = __webpack_require__(100);

var _require = __webpack_require__(61),
    combineReducers = _require.combineReducers;

module.exports = combineReducers({
    config: __webpack_require__(125),
    main: __webpack_require__(127),
    router: _reactRouterRedux.routerReducer });

/***/ }),

/***/ 127:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var initialState = {
    res: {},
    wifiNetwork: 'wifi'
};

function main() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
    var action = arguments[1];

    if (action.type === 'SET_ECODE_PIC') {
        return _extends({}, state, {
            ecodePic: action.data.ecodePic
        });
    }
    if (action.type === 'LOAD_SITE_INDEX') {
        var res = action.res;
        if (!res.data.list) {
            return {
                res: res.data,
                list: [],
                end: true
            };
        } else {
            return {
                res: res.data,
                list: res.data.list,
                end: false
            };
        }
    }

    if (action.type === 'LOAD_SITE_INDEX_MORE') {
        var _res = action.res;
        if (!_res.data.list) {
            return _extends({}, state, {
                res: _res.data,
                list: state.list,
                end: true
            });
        } else {
            return _extends({}, state, {
                res: _res.data,
                list: state.list.concat(_res.data.list),
                end: false
            });
        }
    }

    return state;
}

module.exports = main;

/***/ }),

/***/ 128:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (store) {
  return function (next) {
    return function (action) {
      return next(action);
    };
  };
};

/***/ }),

/***/ 129:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (store) {
  return function (next) {
    return function (action) {
      return Array.isArray(action) ? action.map(next) : next(action);
    };
  };
};

/***/ }),

/***/ 130:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function warn(error) {
  console.warn(error.message || error);
  throw error;
}

module.exports = function (store) {
  return function (next) {
    return function (action) {
      return typeof action.then === 'function' ? Promise.resolve(action).then(next, warn) : next(action);
    };
  };
};

/***/ }),

/***/ 131:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(4);

var _react2 = _interopRequireDefault(_react);

var _reactRedux = __webpack_require__(29);

var _reactRouterDom = __webpack_require__(62);

var _actions = __webpack_require__(121);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LoginView = function (_Component) {
  _inherits(LoginView, _Component);

  function LoginView() {
    _classCallCheck(this, LoginView);

    return _possibleConstructorReturn(this, (LoginView.__proto__ || Object.getPrototypeOf(LoginView)).apply(this, arguments));
  }

  _createClass(LoginView, [{
    key: 'toPageList',
    value: function toPageList() {
      var loc = this.context.router.history;

      loc.push({ pathname: '/list/100153/hospital.html' });
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {}
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      return _react2.default.createElement(
        'div',
        { className: 'page-index' },
        _react2.default.createElement(
          'p',
          { style: { textAlign: 'center' } },
          _react2.default.createElement(
            'a',
            { href: 'http://www.317hu.com/', target: '_blank' },
            '317\u62A4\u54AF'
          )
        ),
        _react2.default.createElement(
          'div',
          { className: '' },
          _react2.default.createElement(
            'a',
            { href: 'javascript:;', onClick: function onClick() {
                return _this2.toPageList();
              } },
            '\u52A8\u6001\u8DF3\u8F6C\u8DEF\u7531\u94FE\u63A5 - list'
          )
        ),
        _react2.default.createElement(
          _reactRouterDom.Link,
          { to: '/detail.html' },
          'Link \u6807\u7B7E\u8DF3\u8F6C\u8DEF\u7531\u94FE\u63A5 - detail'
        )
      );
    }
  }]);

  return LoginView;
}(_react.Component);

LoginView.contextTypes = {
  router: _react2.default.PropTypes.object.isRequired
};


function select(store) {
  return {};
}

function actions(dispatch, ownProps) {
  return {
    dispatch: dispatch
  };
}
module.exports = (0, _reactRedux.connect)(select, actions)(LoginView);

/***/ }),

/***/ 279:
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 63:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _regenerator = __webpack_require__(36);

var _regenerator2 = _interopRequireDefault(_regenerator);

var loadFetchQueryAwait = function () {
    var _ref = _asyncToGenerator(_regenerator2.default.mark(function _callee(query) {
        var method, body, params, results;
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        method = query.method, body = query.body;

                        method = 'http://' + config.privilegeApi + '/' + method;

                        if (typeof body == 'string') {
                            if (body.indexOf('=') < 0) {
                                body = JSON.parse(body);
                            };
                        }
                        params = typeof body == 'string' ? body : Object.keys(body).map(function (k) {
                            return encodeURIComponent(k) + '=' + encodeURIComponent(body[k]);
                        }).join('&');
                        _context.next = 6;
                        return fetch(method, {
                            method: 'POST',
                            body: params,
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded'
                            },
                            credentials: 'include'
                        }).then(function (response) {
                            return response;
                        }).then(function (response) {
                            return response.json();
                        });

                    case 6:
                        results = _context.sent;

                        if (results.state == "token") {
                            alert("请使用微信进行登录吧～");
                        }
                        return _context.abrupt('return', results);

                    case 9:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function loadFetchQueryAwait(_x) {
        return _ref.apply(this, arguments);
    };
}();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var Promise = __webpack_require__(132).polyfill();
var fetch = __webpack_require__(149);
if (!window.Promise) {
    window.Promise = Promise;
}

var config = __webpack_require__(117);

function loadFetchQuery(query) {
    var method = query.method,
        body = query.body,
        methodType = query.methodType,
        hostType = query.hostType;

    method = 'http://' + config.privilegeApi + '/' + method;

    if (typeof body == 'string') {
        if (body.indexOf('=') < 0) {
            body = JSON.parse(body);
        };
    }
    var params = typeof body == 'string' ? body : Object.keys(body).map(function (k) {
        return encodeURIComponent(k) + '=' + encodeURIComponent(body[k]);
    }).join('&');
    return fetch(method, {
        method: "POST",
        body: params,
        async: false,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        credentials: 'include'
    }).then(function (response) {
        return response.json();
    });
};

function getFetchQuery(query) {
    var method = query.method,
        body = query.body,
        methodType = query.methodType,
        hostType = query.hostType;

    if (typeof body == 'string') {
        if (body.indexOf('=') < 0) {
            body = JSON.parse(body);
        };
    }
    var params = typeof body == 'string' ? body : Object.keys(body).map(function (k) {
        return encodeURIComponent(k) + '=' + encodeURIComponent(body[k]);
    }).join('&');
    method = 'http://' + config.privilegeApi + '/' + method + '?' + params;
    return new Promise(function (resolve, reject) {
        fetch(method, {
            method: 'GET',
            async: false,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function (response) {
            return response.json();
        }).then(function (res) {
            resolve(res);
        });
    });
}

module.exports = {
    run: loadFetchQuery,
    runAwait: function runAwait(url, query) {
        return loadFetchQueryAwait(url, query);
    },
    runQuery: function runQuery(url, query, method) {
        return getFetchQuery(url, query, method);
    }
};

/***/ })

},[124]);