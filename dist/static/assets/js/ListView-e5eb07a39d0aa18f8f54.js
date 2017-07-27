webpackJsonp([0],{

/***/ 281:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(4);

var _react2 = _interopRequireDefault(_react);

var _reactRedux = __webpack_require__(29);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ListView = function (_Component) {
  _inherits(ListView, _Component);

  function ListView() {
    _classCallCheck(this, ListView);

    return _possibleConstructorReturn(this, (ListView.__proto__ || Object.getPrototypeOf(ListView)).apply(this, arguments));
  }

  _createClass(ListView, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      console.log('this.props.match.params->', this.props.match.params);
      console.log('this.context.router->', this.context.router);
      console.log('this.props->', this.props);
    }
  }, {
    key: 'goBack',
    value: function goBack() {
      var loc = this.context.router.history;
      loc.goBack();
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      return _react2.default.createElement(
        'div',
        { style: { textAlign: 'center', color: '#ff0000' }, onClick: function onClick() {
            return _this2.goBack();
          } },
        '[\u8FD4\u56DE\u4E0A\u9875\u53BB\u5427]'
      );
    }
  }]);

  return ListView;
}(_react.Component);

ListView.contextTypes = {
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

module.exports = (0, _reactRedux.connect)(select, actions)(ListView);

/***/ })

});