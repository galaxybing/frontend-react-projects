webpackJsonp([1],{

/***/ 280:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(4);

var _react2 = _interopRequireDefault(_react);

var _reactRedux = __webpack_require__(29);

var _reactRouterDom = __webpack_require__(62);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DetailView = function (_Component) {
  _inherits(DetailView, _Component);

  function DetailView(props) {
    _classCallCheck(this, DetailView);

    return _possibleConstructorReturn(this, (DetailView.__proto__ || Object.getPrototypeOf(DetailView)).call(this, props));
  }

  _createClass(DetailView, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      console.log('render detail ...');
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'p',
        { style: { textAlign: 'center' } },
        _react2.default.createElement(
          _reactRouterDom.Link,
          { to: '/index.html' },
          '[\u8FD4\u56DE\u4E0A\u9875]'
        )
      );
    }
  }]);

  return DetailView;
}(_react.Component);

function select(store) {
  return {};
}

function actions(dispatch, ownProps) {
  return {
    dispatch: dispatch
  };
}

module.exports = (0, _reactRedux.connect)(select, actions)(DetailView);

/***/ })

});