'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _desc, _value, _class; // Copyright (c) 2015 Uber Technologies, Inc.

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _autobindDecorator = require('autobind-decorator');

var _autobindDecorator2 = _interopRequireDefault(_autobindDecorator);

var _mapboxGl = require('mapbox-gl');

var _document = require('global/document');

var _document2 = _interopRequireDefault(_document);

var _window = require('global/window');

var _window2 = _interopRequireDefault(_window);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

function noop() {}

var ua = typeof _window2.default.navigator !== 'undefined' ? _window2.default.navigator.userAgent.toLowerCase() : '';
var firefox = ua.indexOf('firefox') !== -1;

function mousePos(el, event) {
  var rect = el.getBoundingClientRect();
  event = event.touches ? event.touches[0] : event;
  return new _mapboxGl.Point(event.clientX - rect.left - el.clientLeft, event.clientY - rect.top - el.clientTop);
}

function touchPos(el, event) {
  var points = [];
  var rect = el.getBoundingClientRect();
  for (var i = 0; i < event.touches.length; i++) {
    points.push(new _mapboxGl.Point(event.touches[i].clientX - rect.left - el.clientLeft, event.touches[i].clientY - rect.top - el.clientTop));
  }
  return points;
}

/* eslint-disable max-len */
// Portions of the code below originally from:
// https://github.com/mapbox/mapbox-gl-js/blob/master/js/ui/handler/scroll_zoom.js
/* eslint-enable max-len */

var PROP_TYPES = {
  width: _react.PropTypes.number.isRequired,
  height: _react.PropTypes.number.isRequired,
  onMouseDown: _react.PropTypes.func,
  onMouseDrag: _react.PropTypes.func,
  onMouseRotate: _react.PropTypes.func,
  onMouseUp: _react.PropTypes.func,
  onMouseMove: _react.PropTypes.func,
  onTouchStart: _react.PropTypes.func,
  onTouchDrag: _react.PropTypes.func,
  onTouchRotate: _react.PropTypes.func,
  onTouchEnd: _react.PropTypes.func,
  onZoom: _react.PropTypes.func,
  onZoomEnd: _react.PropTypes.func
};

var DEFAULT_PROPS = {
  onMouseDown: noop,
  onMouseDrag: noop,
  onMouseRotate: noop,
  onMouseUp: noop,
  onMouseMove: noop,
  onTouchStart: noop,
  onTouchDrag: noop,
  onTouchRotate: noop,
  onTouchEnd: noop,
  onZoom: noop,
  onZoomEnd: noop
};

var MapInteractions = (_class = function (_Component) {
  _inherits(MapInteractions, _Component);

  function MapInteractions(props) {
    _classCallCheck(this, MapInteractions);

    var _this = _possibleConstructorReturn(this, (MapInteractions.__proto__ || Object.getPrototypeOf(MapInteractions)).call(this, props));

    _this.state = {
      startPos: null,
      pos: null,
      mouseWheelPos: null,
      pinchZoom: 0,
      fingerDist: 0
    };
    return _this;
  }

  _createClass(MapInteractions, [{
    key: '_getMousePos',
    value: function _getMousePos(event) {
      var el = this.refs.container;
      return mousePos(el, event);
    }
  }, {
    key: '_getTouchPos',
    value: function _getTouchPos(event) {
      var el = this.refs.container;
      return touchPos(el, event).reduce(function (prev, curr, i, arr) {
        return prev.add(curr.div(arr.length));
      }, new _mapboxGl.Point(0, 0));
    }
  }, {
    key: '_onMouseDown',
    value: function _onMouseDown(event) {
      var pos = this._getMousePos(event);
      this.setState({
        startPos: pos,
        pos: pos,
        metaKey: Boolean(event.metaKey)
      });
      this.props.onMouseDown({ pos: pos });
      _document2.default.addEventListener('mousemove', this._onMouseDrag, false);
      _document2.default.addEventListener('mouseup', this._onMouseUp, false);
    }
  }, {
    key: '_onTouchStart',
    value: function _onTouchStart(event) {
      var pos = this._getTouchPos(event);
      var scaling = false;
      var fingerDist = 0;
      if (event.touches.length == 2) {
        fingerDist = Math.sqrt((event.touches[0].clientX - event.touches[1].clientX) * (event.touches[0].clientX - event.touches[1].clientX) + (event.touches[0].clientY - event.touches[1].clientY) * (event.touches[0].clientY - event.touches[1].clientY));
        scaling = true;
      }
      this.setState({
        startPos: pos,
        pos: pos,
        scaling: scaling,
        fingerDist: fingerDist,
        metaKey: Boolean(event.metaKey)
      });
      this.props.onTouchStart({ pos: pos });
      _document2.default.addEventListener('touchmove', this._onTouchDrag, false);
      _document2.default.addEventListener('touchend', this._onTouchEnd, false);
    }
  }, {
    key: '_onMouseDrag',
    value: function _onMouseDrag(event) {
      var pos = this._getMousePos(event);
      this.setState({ pos: pos });
      if (this.state.metaKey) {
        var startPos = this.state.startPos;

        this.props.onMouseRotate({ pos: pos, startPos: startPos });
      } else {
        this.props.onMouseDrag({ pos: pos });
      }
    }
  }, {
    key: '_onTouchDrag',
    value: function _onTouchDrag(event) {
      var pos = this._getTouchPos(event);
      var obj = { pos: pos };
      var prevFingerDist = this.state.fingerDist;
      var currentFingerDist = 0;
      if (this.state.scaling) {
        currentFingerDist = Math.sqrt((event.touches[0].clientX - event.touches[1].clientX) * (event.touches[0].clientX - event.touches[1].clientX) + (event.touches[0].clientY - event.touches[1].clientY) * (event.touches[0].clientY - event.touches[1].clientY));
        if (currentFingerDist > prevFingerDist) {
          this._zoom(this.state.pinchZoom + 20, pos);
        } else {
          this._zoom(this.state.pinchZoom - 20, pos);
        }
        if (currentFingerDist !== prevFingerDist) {
          obj = {
            pos: pos,
            fingerDist: currentFingerDist
          };
        }
      }
      this.setState(obj);
      if (this.state.metaKey) {
        var startPos = this.state.startPos;

        this.props.onTouchRotate({ pos: pos, startPos: startPos });
      } else {
        this.props.onTouchDrag({ pos: pos });
      }
      event.preventDefault();
    }
  }, {
    key: '_onMouseUp',
    value: function _onMouseUp(event) {
      _document2.default.removeEventListener('mousemove', this._onMouseDrag, false);
      _document2.default.removeEventListener('mouseup', this._onMouseUp, false);
      var pos = this._getMousePos(event);
      this.setState({ pos: pos });
      this.props.onMouseUp({ pos: pos });
    }
  }, {
    key: '_onTouchEnd',
    value: function _onTouchEnd(event) {
      _document2.default.removeEventListener('touchmove', this._onTouchDrag, false);
      _document2.default.removeEventListener('touchend', this._onTouchEnd, false);
      var pos = this._getTouchPos(event);
      var obj = { pos: pos };
      if (this.state.scaling) {
        obj = {
          pos: pos,
          scaling: false
        };
      }
      this.setState(obj);
      this.props.onTouchEnd({ pos: pos });
    }
  }, {
    key: '_onMouseMove',
    value: function _onMouseMove(event) {
      var pos = this._getMousePos(event);
      this.props.onMouseMove({ pos: pos });
    }

    /* eslint-disable complexity, max-statements */

  }, {
    key: '_onWheel',
    value: function _onWheel(event) {
      event.stopPropagation();
      event.preventDefault();
      var value = event.deltaY;
      // Firefox doubles the values on retina screens...
      if (firefox && event.deltaMode === _window2.default.WheelEvent.DOM_DELTA_PIXEL) {
        value /= _window2.default.devicePixelRatio;
      }
      if (event.deltaMode === _window2.default.WheelEvent.DOM_DELTA_LINE) {
        value *= 40;
      }

      var type = this.state.mouseWheelType;
      var timeout = this.state.mouseWheelTimeout;
      var lastValue = this.state.mouseWheelLastValue;
      var time = this.state.mouseWheelTime;

      var now = (_window2.default.performance || Date).now();
      var timeDelta = now - (time || 0);

      var pos = this._getMousePos(event);
      time = now;

      if (value !== 0 && value % 4.000244140625 === 0) {
        // This one is definitely a mouse wheel event.
        type = 'wheel';
        // Normalize this value to match trackpad.
        value = Math.floor(value / 4);
      } else if (value !== 0 && Math.abs(value) < 4) {
        // This one is definitely a trackpad event because it is so small.
        type = 'trackpad';
      } else if (timeDelta > 400) {
        // This is likely a new scroll action.
        type = null;
        lastValue = value;

        // Start a timeout in case this was a singular event, and delay it by up
        // to 40ms.
        timeout = _window2.default.setTimeout(function setTimeout() {
          var _type = 'wheel';
          this._zoom(-this.state.mouseWheelLastValue, this.state.mouseWheelPos);
          this.setState({ mouseWheelType: _type });
        }.bind(this), 40);
      } else if (!this._type) {
        // This is a repeating event, but we don't know the type of event just
        // yet.
        // If the delta per time is small, we assume it's a fast trackpad;
        // otherwise we switch into wheel mode.
        type = Math.abs(timeDelta * value) < 200 ? 'trackpad' : 'wheel';

        // Make sure our delayed event isn't fired again, because we accumulate
        // the previous event (which was less than 40ms ago) into this event.
        if (timeout) {
          _window2.default.clearTimeout(timeout);
          timeout = null;
          value += lastValue;
        }
      }

      // Slow down zoom if shift key is held for more precise zooming
      if (event.shiftKey && value) {
        value = value / 4;
      }

      // Only fire the callback if we actually know what type of scrolling device
      // the user uses.
      if (type) {
        this._zoom(-value, pos);
      }

      this.setState({
        mouseWheelTime: time,
        mouseWheelPos: pos,
        mouseWheelType: type,
        mouseWheelTimeout: timeout,
        mouseWheelLastValue: lastValue
      });
    }
    /* eslint-enable complexity, max-statements */

  }, {
    key: '_zoom',
    value: function _zoom(delta, pos) {

      // Scale by sigmoid of scroll wheel delta.
      var scale = 2 / (1 + Math.exp(-Math.abs(delta / 100)));
      if (delta < 0 && scale !== 0) {
        scale = 1 / scale;
      }
      this.props.onZoom({ pos: pos, scale: scale });
      _window2.default.clearTimeout(this._zoomEndTimeout);
      this._zoomEndTimeout = _window2.default.setTimeout(function _setTimeout() {
        this.props.onZoomEnd();
      }.bind(this), 200);
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        {
          ref: 'container',
          onMouseMove: this._onMouseMove,
          onMouseDown: this._onMouseDown,
          onTouchStart: this._onTouchStart,
          onContextMenu: this._onMouseDown,
          onWheel: this._onWheel,
          style: {
            width: this.props.width,
            height: this.props.height,
            position: 'relative'
          } },
        this.props.children
      );
    }
  }]);

  return MapInteractions;
}(_react.Component), (_applyDecoratedDescriptor(_class.prototype, '_onMouseDown', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class.prototype, '_onMouseDown'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, '_onTouchStart', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class.prototype, '_onTouchStart'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, '_onMouseDrag', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class.prototype, '_onMouseDrag'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, '_onTouchDrag', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class.prototype, '_onTouchDrag'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, '_onMouseUp', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class.prototype, '_onMouseUp'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, '_onTouchEnd', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class.prototype, '_onTouchEnd'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, '_onMouseMove', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class.prototype, '_onMouseMove'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, '_onWheel', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class.prototype, '_onWheel'), _class.prototype)), _class);
exports.default = MapInteractions;


MapInteractions.propTypes = PROP_TYPES;
MapInteractions.defaultProps = DEFAULT_PROPS;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9tYXAtaW50ZXJhY3Rpb25zLnJlYWN0LmpzIl0sIm5hbWVzIjpbIm5vb3AiLCJ1YSIsIm5hdmlnYXRvciIsInVzZXJBZ2VudCIsInRvTG93ZXJDYXNlIiwiZmlyZWZveCIsImluZGV4T2YiLCJtb3VzZVBvcyIsImVsIiwiZXZlbnQiLCJyZWN0IiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwidG91Y2hlcyIsImNsaWVudFgiLCJsZWZ0IiwiY2xpZW50TGVmdCIsImNsaWVudFkiLCJ0b3AiLCJjbGllbnRUb3AiLCJ0b3VjaFBvcyIsInBvaW50cyIsImkiLCJsZW5ndGgiLCJwdXNoIiwiUFJPUF9UWVBFUyIsIndpZHRoIiwibnVtYmVyIiwiaXNSZXF1aXJlZCIsImhlaWdodCIsIm9uTW91c2VEb3duIiwiZnVuYyIsIm9uTW91c2VEcmFnIiwib25Nb3VzZVJvdGF0ZSIsIm9uTW91c2VVcCIsIm9uTW91c2VNb3ZlIiwib25Ub3VjaFN0YXJ0Iiwib25Ub3VjaERyYWciLCJvblRvdWNoUm90YXRlIiwib25Ub3VjaEVuZCIsIm9uWm9vbSIsIm9uWm9vbUVuZCIsIkRFRkFVTFRfUFJPUFMiLCJNYXBJbnRlcmFjdGlvbnMiLCJwcm9wcyIsInN0YXRlIiwic3RhcnRQb3MiLCJwb3MiLCJtb3VzZVdoZWVsUG9zIiwicGluY2hab29tIiwiZmluZ2VyRGlzdCIsInJlZnMiLCJjb250YWluZXIiLCJyZWR1Y2UiLCJwcmV2IiwiY3VyciIsImFyciIsImFkZCIsImRpdiIsIl9nZXRNb3VzZVBvcyIsInNldFN0YXRlIiwibWV0YUtleSIsIkJvb2xlYW4iLCJhZGRFdmVudExpc3RlbmVyIiwiX29uTW91c2VEcmFnIiwiX29uTW91c2VVcCIsIl9nZXRUb3VjaFBvcyIsInNjYWxpbmciLCJNYXRoIiwic3FydCIsIl9vblRvdWNoRHJhZyIsIl9vblRvdWNoRW5kIiwib2JqIiwicHJldkZpbmdlckRpc3QiLCJjdXJyZW50RmluZ2VyRGlzdCIsIl96b29tIiwicHJldmVudERlZmF1bHQiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwic3RvcFByb3BhZ2F0aW9uIiwidmFsdWUiLCJkZWx0YVkiLCJkZWx0YU1vZGUiLCJXaGVlbEV2ZW50IiwiRE9NX0RFTFRBX1BJWEVMIiwiZGV2aWNlUGl4ZWxSYXRpbyIsIkRPTV9ERUxUQV9MSU5FIiwidHlwZSIsIm1vdXNlV2hlZWxUeXBlIiwidGltZW91dCIsIm1vdXNlV2hlZWxUaW1lb3V0IiwibGFzdFZhbHVlIiwibW91c2VXaGVlbExhc3RWYWx1ZSIsInRpbWUiLCJtb3VzZVdoZWVsVGltZSIsIm5vdyIsInBlcmZvcm1hbmNlIiwiRGF0ZSIsInRpbWVEZWx0YSIsImZsb29yIiwiYWJzIiwic2V0VGltZW91dCIsIl90eXBlIiwiYmluZCIsImNsZWFyVGltZW91dCIsInNoaWZ0S2V5IiwiZGVsdGEiLCJzY2FsZSIsImV4cCIsIl96b29tRW5kVGltZW91dCIsIl9zZXRUaW1lb3V0IiwiX29uTW91c2VNb3ZlIiwiX29uTW91c2VEb3duIiwiX29uVG91Y2hTdGFydCIsIl9vbldoZWVsIiwicG9zaXRpb24iLCJjaGlsZHJlbiIsInByb3BUeXBlcyIsImRlZmF1bHRQcm9wcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OzJCQUFBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVBLFNBQVNBLElBQVQsR0FBZ0IsQ0FBRTs7QUFFbEIsSUFBTUMsS0FBSyxPQUFPLGlCQUFPQyxTQUFkLEtBQTRCLFdBQTVCLEdBQ1QsaUJBQU9BLFNBQVAsQ0FBaUJDLFNBQWpCLENBQTJCQyxXQUEzQixFQURTLEdBQ2tDLEVBRDdDO0FBRUEsSUFBTUMsVUFBVUosR0FBR0ssT0FBSCxDQUFXLFNBQVgsTUFBMEIsQ0FBQyxDQUEzQzs7QUFFQSxT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dUMsR0FBTCxDQUFTLENBQUN2QyxLQUFLK0IsR0FBTCxDQUFTTSxRQUFRLEdBQWpCLENBQVYsQ0FBVCxDQUFaO0FBQ0EsVUFBSUEsUUFBUSxDQUFSLElBQWFDLFVBQVUsQ0FBM0IsRUFBOEI7QUFDNUJBLGdCQUFRLElBQUlBLEtBQVo7QUFDRDtBQUNELFdBQUs5RCxLQUFMLENBQVdKLE1BQVgsQ0FBa0IsRUFBQ08sUUFBRCxFQUFNMkQsWUFBTixFQUFsQjtBQUNBLHVCQUFPSCxZQUFQLENBQW9CLEtBQUtLLGVBQXpCO0FBQ0EsV0FBS0EsZUFBTCxHQUF1QixpQkFBT1IsVUFBUCxDQUFrQixTQUFTUyxXQUFULEdBQXVCO0FBQzlELGFBQUtqRSxLQUFMLENBQVdILFNBQVg7QUFDRCxPQUZ3QyxDQUV2QzZELElBRnVDLENBRWxDLElBRmtDLENBQWxCLEVBRVQsR0FGUyxDQUF2QjtBQUdEOzs7NkJBRVE7QUFDUCxhQUNFO0FBQUE7QUFBQTtBQUNFLGVBQUksV0FETjtBQUVFLHVCQUFjLEtBQUtRLFlBRnJCO0FBR0UsdUJBQWMsS0FBS0MsWUFIckI7QUFJRSx3QkFBZSxLQUFLQyxhQUp0QjtBQUtFLHlCQUFnQixLQUFLRCxZQUx2QjtBQU1FLG1CQUFVLEtBQUtFLFFBTmpCO0FBT0UsaUJBQVE7QUFDTnZGLG1CQUFPLEtBQUtrQixLQUFMLENBQVdsQixLQURaO0FBRU5HLG9CQUFRLEtBQUtlLEtBQUwsQ0FBV2YsTUFGYjtBQUdOcUYsc0JBQVU7QUFISixXQVBWO0FBYUksYUFBS3RFLEtBQUwsQ0FBV3VFO0FBYmYsT0FERjtBQWtCRDs7Ozs7a0JBN1BrQnhFLGU7OztBQWdRckJBLGdCQUFnQnlFLFNBQWhCLEdBQTRCM0YsVUFBNUI7QUFDQWtCLGdCQUFnQjBFLFlBQWhCLEdBQStCM0UsYUFBL0IiLCJmaWxlIjoibWFwLWludGVyYWN0aW9ucy5yZWFjdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAxNSBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG5cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cblxuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCBSZWFjdCwge1Byb3BUeXBlcywgQ29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgYXV0b2JpbmQgZnJvbSAnYXV0b2JpbmQtZGVjb3JhdG9yJztcbmltcG9ydCB7UG9pbnR9IGZyb20gJ21hcGJveC1nbCc7XG5pbXBvcnQgZG9jdW1lbnQgZnJvbSAnZ2xvYmFsL2RvY3VtZW50JztcbmltcG9ydCB3aW5kb3cgZnJvbSAnZ2xvYmFsL3dpbmRvdyc7XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5jb25zdCB1YSA9IHR5cGVvZiB3aW5kb3cubmF2aWdhdG9yICE9PSAndW5kZWZpbmVkJyA/XG4gIHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCkgOiAnJztcbmNvbnN0IGZpcmVmb3ggPSB1YS5pbmRleE9mKCdmaXJlZm94JykgIT09IC0xO1xuXG5mdW5jdGlvbiBtb3VzZVBvcyhlbCwgZXZlbnQpIHtcbiAgY29uc3QgcmVjdCA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICBldmVudCA9IGV2ZW50LnRvdWNoZXMgPyBldmVudC50b3VjaGVzWzBdIDogZXZlbnQ7XG4gIHJldHVybiBuZXcgUG9pbnQoXG4gICAgZXZlbnQuY2xpZW50WCAtIHJlY3QubGVmdCAtIGVsLmNsaWVudExlZnQsXG4gICAgZXZlbnQuY2xpZW50WSAtIHJlY3QudG9wIC0gZWwuY2xpZW50VG9wXG4gICk7XG59XG5cbmZ1bmN0aW9uIHRvdWNoUG9zKGVsLCBldmVudCkge1xuICBjb25zdCBwb2ludHMgPSBbXTtcbiAgY29uc3QgcmVjdCA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGV2ZW50LnRvdWNoZXMubGVuZ3RoOyBpKyspIHtcbiAgICBwb2ludHMucHVzaChuZXcgUG9pbnQoXG4gICAgICBldmVudC50b3VjaGVzW2ldLmNsaWVudFggLSByZWN0LmxlZnQgLSBlbC5jbGllbnRMZWZ0LFxuICAgICAgZXZlbnQudG91Y2hlc1tpXS5jbGllbnRZIC0gcmVjdC50b3AgLSBlbC5jbGllbnRUb3BcbiAgICApKTtcbiAgfVxuICByZXR1cm4gcG9pbnRzO1xufVxuXG4vKiBlc2xpbnQtZGlzYWJsZSBtYXgtbGVuICovXG4vLyBQb3J0aW9ucyBvZiB0aGUgY29kZSBiZWxvdyBvcmlnaW5hbGx5IGZyb206XG4vLyBodHRwczovL2dpdGh1Yi5jb20vbWFwYm94L21hcGJveC1nbC1qcy9ibG9iL21hc3Rlci9qcy91aS9oYW5kbGVyL3Njcm9sbF96b29tLmpzXG4vKiBlc2xpbnQtZW5hYmxlIG1heC1sZW4gKi9cblxuY29uc3QgUFJPUF9UWVBFUyA9IHtcbiAgd2lkdGg6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgaGVpZ2h0OiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gIG9uTW91c2VEb3duOiBQcm9wVHlwZXMuZnVuYyxcbiAgb25Nb3VzZURyYWc6IFByb3BUeXBlcy5mdW5jLFxuICBvbk1vdXNlUm90YXRlOiBQcm9wVHlwZXMuZnVuYyxcbiAgb25Nb3VzZVVwOiBQcm9wVHlwZXMuZnVuYyxcbiAgb25Nb3VzZU1vdmU6IFByb3BUeXBlcy5mdW5jLFxuICBvblRvdWNoU3RhcnQ6IFByb3BUeXBlcy5mdW5jLFxuICBvblRvdWNoRHJhZzogUHJvcFR5cGVzLmZ1bmMsXG4gIG9uVG91Y2hSb3RhdGU6IFByb3BUeXBlcy5mdW5jLFxuICBvblRvdWNoRW5kOiBQcm9wVHlwZXMuZnVuYyxcbiAgb25ab29tOiBQcm9wVHlwZXMuZnVuYyxcbiAgb25ab29tRW5kOiBQcm9wVHlwZXMuZnVuY1xufTtcblxuY29uc3QgREVGQVVMVF9QUk9QUyA9IHtcbiAgb25Nb3VzZURvd246IG5vb3AsXG4gIG9uTW91c2VEcmFnOiBub29wLFxuICBvbk1vdXNlUm90YXRlOiBub29wLFxuICBvbk1vdXNlVXA6IG5vb3AsXG4gIG9uTW91c2VNb3ZlOiBub29wLFxuICBvblRvdWNoU3RhcnQ6IG5vb3AsXG4gIG9uVG91Y2hEcmFnOiBub29wLFxuICBvblRvdWNoUm90YXRlOiBub29wLFxuICBvblRvdWNoRW5kOiBub29wLFxuICBvblpvb206IG5vb3AsXG4gIG9uWm9vbUVuZDogbm9vcFxufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWFwSW50ZXJhY3Rpb25zIGV4dGVuZHMgQ29tcG9uZW50IHtcblxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgc3RhcnRQb3M6IG51bGwsXG4gICAgICBwb3M6IG51bGwsXG4gICAgICBtb3VzZVdoZWVsUG9zOiBudWxsLFxuICAgICAgcGluY2hab29tOiAwLFxuICAgICAgZmluZ2VyRGlzdDogMFxuICAgIH07XG4gIH1cblxuICBfZ2V0TW91c2VQb3MoZXZlbnQpIHtcbiAgICBjb25zdCBlbCA9IHRoaXMucmVmcy5jb250YWluZXI7XG4gICAgcmV0dXJuIG1vdXNlUG9zKGVsLCBldmVudCk7XG4gIH1cblxuICBfZ2V0VG91Y2hQb3MoZXZlbnQpIHtcbiAgICBjb25zdCBlbCA9IHRoaXMucmVmcy5jb250YWluZXI7XG4gICAgcmV0dXJuIHRvdWNoUG9zKGVsLCBldmVudCkucmVkdWNlKChwcmV2LCBjdXJyLCBpLCBhcnIpID0+IHtcbiAgICAgIHJldHVybiBwcmV2LmFkZChjdXJyLmRpdihhcnIubGVuZ3RoKSk7XG4gICAgfSwgbmV3IFBvaW50KDAsIDApKTtcbiAgfVxuXG4gIEBhdXRvYmluZFxuICBfb25Nb3VzZURvd24oZXZlbnQpIHtcbiAgICBjb25zdCBwb3MgPSB0aGlzLl9nZXRNb3VzZVBvcyhldmVudCk7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBzdGFydFBvczogcG9zLFxuICAgICAgcG9zLFxuICAgICAgbWV0YUtleTogQm9vbGVhbihldmVudC5tZXRhS2V5KVxuICAgIH0pO1xuICAgIHRoaXMucHJvcHMub25Nb3VzZURvd24oe3Bvc30pO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMuX29uTW91c2VEcmFnLCBmYWxzZSk7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMuX29uTW91c2VVcCwgZmFsc2UpO1xuICB9XG5cbiAgQGF1dG9iaW5kXG4gIF9vblRvdWNoU3RhcnQoZXZlbnQpIHtcbiAgICBjb25zdCBwb3MgPSB0aGlzLl9nZXRUb3VjaFBvcyhldmVudCk7XG4gICAgbGV0IHNjYWxpbmcgPSBmYWxzZTtcbiAgICBsZXQgZmluZ2VyRGlzdCA9IDA7XG4gICAgaWYoZXZlbnQudG91Y2hlcy5sZW5ndGggPT0gMikge1xuICAgICAgZmluZ2VyRGlzdCA9XG4gICAgICBNYXRoLnNxcnQoXG4gICAgICAoZXZlbnQudG91Y2hlc1swXS5jbGllbnRYLWV2ZW50LnRvdWNoZXNbMV0uY2xpZW50WCkgKiAoZXZlbnQudG91Y2hlc1swXS5jbGllbnRYLWV2ZW50LnRvdWNoZXNbMV0uY2xpZW50WCkgK1xuICAgICAgKGV2ZW50LnRvdWNoZXNbMF0uY2xpZW50WS1ldmVudC50b3VjaGVzWzFdLmNsaWVudFkpICogKGV2ZW50LnRvdWNoZXNbMF0uY2xpZW50WS1ldmVudC50b3VjaGVzWzFdLmNsaWVudFkpKTtcbiAgICAgIHNjYWxpbmcgPSB0cnVlO1xuICAgIH1cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHN0YXJ0UG9zOiBwb3MsXG4gICAgICBwb3M6IHBvcyxcbiAgICAgIHNjYWxpbmc6IHNjYWxpbmcsXG4gICAgICBmaW5nZXJEaXN0OiBmaW5nZXJEaXN0LFxuICAgICAgbWV0YUtleTogQm9vbGVhbihldmVudC5tZXRhS2V5KVxuICAgIH0pO1xuICAgIHRoaXMucHJvcHMub25Ub3VjaFN0YXJ0KHsgcG9zOiBwb3MgfSk7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgdGhpcy5fb25Ub3VjaERyYWcsIGZhbHNlKTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIHRoaXMuX29uVG91Y2hFbmQsIGZhbHNlKTtcbiAgfVxuXG4gIEBhdXRvYmluZFxuICBfb25Nb3VzZURyYWcoZXZlbnQpIHtcbiAgICBjb25zdCBwb3MgPSB0aGlzLl9nZXRNb3VzZVBvcyhldmVudCk7XG4gICAgdGhpcy5zZXRTdGF0ZSh7cG9zfSk7XG4gICAgaWYgKHRoaXMuc3RhdGUubWV0YUtleSkge1xuICAgICAgY29uc3Qge3N0YXJ0UG9zfSA9IHRoaXMuc3RhdGU7XG4gICAgICB0aGlzLnByb3BzLm9uTW91c2VSb3RhdGUoe3Bvcywgc3RhcnRQb3N9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5wcm9wcy5vbk1vdXNlRHJhZyh7cG9zfSk7XG4gICAgfVxuICB9XG5cbiAgQGF1dG9iaW5kXG4gIF9vblRvdWNoRHJhZyhldmVudCkge1xuICAgIGNvbnN0IHBvcyA9IHRoaXMuX2dldFRvdWNoUG9zKGV2ZW50KTtcbiAgICBsZXQgb2JqID0geyBwb3M6IHBvcyB9O1xuICAgIGNvbnN0IHByZXZGaW5nZXJEaXN0ID0gdGhpcy5zdGF0ZS5maW5nZXJEaXN0O1xuICAgIGxldCBjdXJyZW50RmluZ2VyRGlzdCA9IDA7XG4gICAgaWYgKHRoaXMuc3RhdGUuc2NhbGluZykge1xuICAgICAgY3VycmVudEZpbmdlckRpc3QgPSBNYXRoLnNxcnQoXG4gICAgICAoZXZlbnQudG91Y2hlc1swXS5jbGllbnRYIC0gZXZlbnQudG91Y2hlc1sxXS5jbGllbnRYKSAqIChldmVudC50b3VjaGVzWzBdLmNsaWVudFggLSBldmVudC50b3VjaGVzWzFdLmNsaWVudFgpICtcbiAgICAgIChldmVudC50b3VjaGVzWzBdLmNsaWVudFkgLSBldmVudC50b3VjaGVzWzFdLmNsaWVudFkpICogKGV2ZW50LnRvdWNoZXNbMF0uY2xpZW50WSAtIGV2ZW50LnRvdWNoZXNbMV0uY2xpZW50WSkpO1xuICAgICAgaWYgKGN1cnJlbnRGaW5nZXJEaXN0ID4gcHJldkZpbmdlckRpc3QpIHtcbiAgICAgICAgdGhpcy5fem9vbSh0aGlzLnN0YXRlLnBpbmNoWm9vbSArIDIwLCBwb3MpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fem9vbSh0aGlzLnN0YXRlLnBpbmNoWm9vbSAtIDIwLCBwb3MpO1xuICAgICAgfVxuICAgICAgaWYgKGN1cnJlbnRGaW5nZXJEaXN0ICE9PSBwcmV2RmluZ2VyRGlzdCkge1xuICAgICAgICBvYmogPSB7XG4gICAgICAgICAgcG9zOiBwb3MsXG4gICAgICAgICAgZmluZ2VyRGlzdDogY3VycmVudEZpbmdlckRpc3RcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5zZXRTdGF0ZShvYmopO1xuICAgIGlmICh0aGlzLnN0YXRlLm1ldGFLZXkpIHtcbiAgICAgIGNvbnN0IHN0YXJ0UG9zID0gdGhpcy5zdGF0ZS5zdGFydFBvcztcblxuICAgICAgdGhpcy5wcm9wcy5vblRvdWNoUm90YXRlKHsgcG9zOiBwb3MsIHN0YXJ0UG9zOiBzdGFydFBvcyB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5wcm9wcy5vblRvdWNoRHJhZyh7IHBvczogcG9zIH0pO1xuICAgIH1cbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICB9XG5cbiAgQGF1dG9iaW5kXG4gIF9vbk1vdXNlVXAoZXZlbnQpIHtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLl9vbk1vdXNlRHJhZywgZmFsc2UpO1xuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLl9vbk1vdXNlVXAsIGZhbHNlKTtcbiAgICBjb25zdCBwb3MgPSB0aGlzLl9nZXRNb3VzZVBvcyhldmVudCk7XG4gICAgdGhpcy5zZXRTdGF0ZSh7cG9zfSk7XG4gICAgdGhpcy5wcm9wcy5vbk1vdXNlVXAoe3Bvc30pO1xuICB9XG5cbiAgQGF1dG9iaW5kXG4gIF9vblRvdWNoRW5kKGV2ZW50KSB7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgdGhpcy5fb25Ub3VjaERyYWcsIGZhbHNlKTtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIHRoaXMuX29uVG91Y2hFbmQsIGZhbHNlKTtcbiAgICBjb25zdCBwb3MgPSB0aGlzLl9nZXRUb3VjaFBvcyhldmVudCk7XG4gICAgbGV0IG9iaiA9IHsgcG9zOiBwb3MgfVxuICAgIGlmICh0aGlzLnN0YXRlLnNjYWxpbmcpIHtcbiAgICAgIG9iaiA9IHtcbiAgICAgICAgcG9zOiBwb3MsXG4gICAgICAgIHNjYWxpbmc6IGZhbHNlXG4gICAgICB9O1xuICAgIH1cbiAgICB0aGlzLnNldFN0YXRlKG9iaik7XG4gICAgdGhpcy5wcm9wcy5vblRvdWNoRW5kKHsgcG9zOiBwb3MgfSk7XG4gIH1cblxuICBAYXV0b2JpbmRcbiAgX29uTW91c2VNb3ZlKGV2ZW50KSB7XG4gICAgY29uc3QgcG9zID0gdGhpcy5fZ2V0TW91c2VQb3MoZXZlbnQpO1xuICAgIHRoaXMucHJvcHMub25Nb3VzZU1vdmUoe3Bvc30pO1xuICB9XG5cbiAgLyogZXNsaW50LWRpc2FibGUgY29tcGxleGl0eSwgbWF4LXN0YXRlbWVudHMgKi9cbiAgQGF1dG9iaW5kXG4gIF9vbldoZWVsKGV2ZW50KSB7XG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICBsZXQgdmFsdWUgPSBldmVudC5kZWx0YVk7XG4gICAgLy8gRmlyZWZveCBkb3VibGVzIHRoZSB2YWx1ZXMgb24gcmV0aW5hIHNjcmVlbnMuLi5cbiAgICBpZiAoZmlyZWZveCAmJiBldmVudC5kZWx0YU1vZGUgPT09IHdpbmRvdy5XaGVlbEV2ZW50LkRPTV9ERUxUQV9QSVhFTCkge1xuICAgICAgdmFsdWUgLz0gd2luZG93LmRldmljZVBpeGVsUmF0aW87XG4gICAgfVxuICAgIGlmIChldmVudC5kZWx0YU1vZGUgPT09IHdpbmRvdy5XaGVlbEV2ZW50LkRPTV9ERUxUQV9MSU5FKSB7XG4gICAgICB2YWx1ZSAqPSA0MDtcbiAgICB9XG5cbiAgICBsZXQgdHlwZSA9IHRoaXMuc3RhdGUubW91c2VXaGVlbFR5cGU7XG4gICAgbGV0IHRpbWVvdXQgPSB0aGlzLnN0YXRlLm1vdXNlV2hlZWxUaW1lb3V0O1xuICAgIGxldCBsYXN0VmFsdWUgPSB0aGlzLnN0YXRlLm1vdXNlV2hlZWxMYXN0VmFsdWU7XG4gICAgbGV0IHRpbWUgPSB0aGlzLnN0YXRlLm1vdXNlV2hlZWxUaW1lO1xuXG4gICAgY29uc3Qgbm93ID0gKHdpbmRvdy5wZXJmb3JtYW5jZSB8fCBEYXRlKS5ub3coKTtcbiAgICBjb25zdCB0aW1lRGVsdGEgPSBub3cgLSAodGltZSB8fCAwKTtcblxuICAgIGNvbnN0IHBvcyA9IHRoaXMuX2dldE1vdXNlUG9zKGV2ZW50KTtcbiAgICB0aW1lID0gbm93O1xuXG4gICAgaWYgKHZhbHVlICE9PSAwICYmIHZhbHVlICUgNC4wMDAyNDQxNDA2MjUgPT09IDApIHtcbiAgICAgIC8vIFRoaXMgb25lIGlzIGRlZmluaXRlbHkgYSBtb3VzZSB3aGVlbCBldmVudC5cbiAgICAgIHR5cGUgPSAnd2hlZWwnO1xuICAgICAgLy8gTm9ybWFsaXplIHRoaXMgdmFsdWUgdG8gbWF0Y2ggdHJhY2twYWQuXG4gICAgICB2YWx1ZSA9IE1hdGguZmxvb3IodmFsdWUgLyA0KTtcbiAgICB9IGVsc2UgaWYgKHZhbHVlICE9PSAwICYmIE1hdGguYWJzKHZhbHVlKSA8IDQpIHtcbiAgICAgIC8vIFRoaXMgb25lIGlzIGRlZmluaXRlbHkgYSB0cmFja3BhZCBldmVudCBiZWNhdXNlIGl0IGlzIHNvIHNtYWxsLlxuICAgICAgdHlwZSA9ICd0cmFja3BhZCc7XG4gICAgfSBlbHNlIGlmICh0aW1lRGVsdGEgPiA0MDApIHtcbiAgICAgIC8vIFRoaXMgaXMgbGlrZWx5IGEgbmV3IHNjcm9sbCBhY3Rpb24uXG4gICAgICB0eXBlID0gbnVsbDtcbiAgICAgIGxhc3RWYWx1ZSA9IHZhbHVlO1xuXG4gICAgICAvLyBTdGFydCBhIHRpbWVvdXQgaW4gY2FzZSB0aGlzIHdhcyBhIHNpbmd1bGFyIGV2ZW50LCBhbmQgZGVsYXkgaXQgYnkgdXBcbiAgICAgIC8vIHRvIDQwbXMuXG4gICAgICB0aW1lb3V0ID0gd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24gc2V0VGltZW91dCgpIHtcbiAgICAgICAgY29uc3QgX3R5cGUgPSAnd2hlZWwnO1xuICAgICAgICB0aGlzLl96b29tKC10aGlzLnN0YXRlLm1vdXNlV2hlZWxMYXN0VmFsdWUsIHRoaXMuc3RhdGUubW91c2VXaGVlbFBvcyk7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe21vdXNlV2hlZWxUeXBlOiBfdHlwZX0pO1xuICAgICAgfS5iaW5kKHRoaXMpLCA0MCk7XG4gICAgfSBlbHNlIGlmICghdGhpcy5fdHlwZSkge1xuICAgICAgLy8gVGhpcyBpcyBhIHJlcGVhdGluZyBldmVudCwgYnV0IHdlIGRvbid0IGtub3cgdGhlIHR5cGUgb2YgZXZlbnQganVzdFxuICAgICAgLy8geWV0LlxuICAgICAgLy8gSWYgdGhlIGRlbHRhIHBlciB0aW1lIGlzIHNtYWxsLCB3ZSBhc3N1bWUgaXQncyBhIGZhc3QgdHJhY2twYWQ7XG4gICAgICAvLyBvdGhlcndpc2Ugd2Ugc3dpdGNoIGludG8gd2hlZWwgbW9kZS5cbiAgICAgIHR5cGUgPSBNYXRoLmFicyh0aW1lRGVsdGEgKiB2YWx1ZSkgPCAyMDAgPyAndHJhY2twYWQnIDogJ3doZWVsJztcblxuICAgICAgLy8gTWFrZSBzdXJlIG91ciBkZWxheWVkIGV2ZW50IGlzbid0IGZpcmVkIGFnYWluLCBiZWNhdXNlIHdlIGFjY3VtdWxhdGVcbiAgICAgIC8vIHRoZSBwcmV2aW91cyBldmVudCAod2hpY2ggd2FzIGxlc3MgdGhhbiA0MG1zIGFnbykgaW50byB0aGlzIGV2ZW50LlxuICAgICAgaWYgKHRpbWVvdXQpIHtcbiAgICAgICAgd2luZG93LmNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICAgICAgdGltZW91dCA9IG51bGw7XG4gICAgICAgIHZhbHVlICs9IGxhc3RWYWx1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBTbG93IGRvd24gem9vbSBpZiBzaGlmdCBrZXkgaXMgaGVsZCBmb3IgbW9yZSBwcmVjaXNlIHpvb21pbmdcbiAgICBpZiAoZXZlbnQuc2hpZnRLZXkgJiYgdmFsdWUpIHtcbiAgICAgIHZhbHVlID0gdmFsdWUgLyA0O1xuICAgIH1cblxuICAgIC8vIE9ubHkgZmlyZSB0aGUgY2FsbGJhY2sgaWYgd2UgYWN0dWFsbHkga25vdyB3aGF0IHR5cGUgb2Ygc2Nyb2xsaW5nIGRldmljZVxuICAgIC8vIHRoZSB1c2VyIHVzZXMuXG4gICAgaWYgKHR5cGUpIHtcbiAgICAgIHRoaXMuX3pvb20oLXZhbHVlLCBwb3MpO1xuICAgIH1cblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgbW91c2VXaGVlbFRpbWU6IHRpbWUsXG4gICAgICBtb3VzZVdoZWVsUG9zOiBwb3MsXG4gICAgICBtb3VzZVdoZWVsVHlwZTogdHlwZSxcbiAgICAgIG1vdXNlV2hlZWxUaW1lb3V0OiB0aW1lb3V0LFxuICAgICAgbW91c2VXaGVlbExhc3RWYWx1ZTogbGFzdFZhbHVlXG4gICAgfSk7XG4gIH1cbiAgLyogZXNsaW50LWVuYWJsZSBjb21wbGV4aXR5LCBtYXgtc3RhdGVtZW50cyAqL1xuXG4gIF96b29tKGRlbHRhLCBwb3MpIHtcblxuICAgIC8vIFNjYWxlIGJ5IHNpZ21vaWQgb2Ygc2Nyb2xsIHdoZWVsIGRlbHRhLlxuICAgIGxldCBzY2FsZSA9IDIgLyAoMSArIE1hdGguZXhwKC1NYXRoLmFicyhkZWx0YSAvIDEwMCkpKTtcbiAgICBpZiAoZGVsdGEgPCAwICYmIHNjYWxlICE9PSAwKSB7XG4gICAgICBzY2FsZSA9IDEgLyBzY2FsZTtcbiAgICB9XG4gICAgdGhpcy5wcm9wcy5vblpvb20oe3Bvcywgc2NhbGV9KTtcbiAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KHRoaXMuX3pvb21FbmRUaW1lb3V0KTtcbiAgICB0aGlzLl96b29tRW5kVGltZW91dCA9IHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uIF9zZXRUaW1lb3V0KCkge1xuICAgICAgdGhpcy5wcm9wcy5vblpvb21FbmQoKTtcbiAgICB9LmJpbmQodGhpcyksIDIwMCk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXZcbiAgICAgICAgcmVmPVwiY29udGFpbmVyXCJcbiAgICAgICAgb25Nb3VzZU1vdmU9eyB0aGlzLl9vbk1vdXNlTW92ZSB9XG4gICAgICAgIG9uTW91c2VEb3duPXsgdGhpcy5fb25Nb3VzZURvd24gfVxuICAgICAgICBvblRvdWNoU3RhcnQ9eyB0aGlzLl9vblRvdWNoU3RhcnQgfVxuICAgICAgICBvbkNvbnRleHRNZW51PXsgdGhpcy5fb25Nb3VzZURvd24gfVxuICAgICAgICBvbldoZWVsPXsgdGhpcy5fb25XaGVlbCB9XG4gICAgICAgIHN0eWxlPXsge1xuICAgICAgICAgIHdpZHRoOiB0aGlzLnByb3BzLndpZHRoLFxuICAgICAgICAgIGhlaWdodDogdGhpcy5wcm9wcy5oZWlnaHQsXG4gICAgICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZSdcbiAgICAgICAgfSB9PlxuXG4gICAgICAgIHsgdGhpcy5wcm9wcy5jaGlsZHJlbiB9XG5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuTWFwSW50ZXJhY3Rpb25zLnByb3BUeXBlcyA9IFBST1BfVFlQRVM7XG5NYXBJbnRlcmFjdGlvbnMuZGVmYXVsdFByb3BzID0gREVGQVVMVF9QUk9QUztcbiJdfQ==