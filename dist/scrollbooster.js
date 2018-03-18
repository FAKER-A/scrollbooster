(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("ScrollBooster", [], factory);
	else if(typeof exports === 'object')
		exports["ScrollBooster"] = factory();
	else
		root["ScrollBooster"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ScrollBooster = function () {
  function ScrollBooster() {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, ScrollBooster);

    if (!props.viewport || !(props.viewport instanceof Element)) {
      console.error('"viewport" config property must be present and must be Element');
      return;
    }

    var defaults = {
      handle: props.viewport,
      content: props.viewport.children[0],
      bounce: true,
      onUpdate: function onUpdate() {}
    };

    this.props = _extends({}, defaults, props);

    if (!this.props.content) {
      console.error('Viewport does not have any content');
      return;
    }

    this.viewport = {
      width: this.props.viewport.clientWidth,
      height: this.props.viewport.clientHeight
    };
    this.content = {
      width: getFullWidth(this.props.content),
      height: getFullHeight(this.props.content)
    };

    this.position = { x: 0, y: 0 };
    this.velocity = { x: 0, y: 0 };
    this.friction = 0.95;

    this.isDragging = false;
    this.dragStartPosition = { x: 0, y: 0 };
    this.dragPosition = _extends({}, this.position);

    this.isScrollEnabled = !!this.props.emulateScroll;
    this.isScrolling = false;
    this.scrollOffset = { x: 0, y: 0 };

    this.bounce = this.props.bounce;

    this.boundX = {
      from: Math.min(-this.content.width + this.viewport.width, 0),
      to: 0
    };
    this.boundY = {
      from: Math.min(-this.content.height + this.viewport.height, 0),
      to: 0
    };

    this.mode = {
      x: this.props.mode == 'x',
      y: this.props.mode == 'y',
      xy: this.props.mode !== 'x' && this.props.mode !== 'y'
    };

    this.isRunning = false;
    this.rafID = null;

    this.events = {};

    this.animate();
    this.handleEvents();
  }

  _createClass(ScrollBooster, [{
    key: 'run',
    value: function run() {
      var _this = this;

      this.isRunning = true;
      cancelAnimationFrame(this.rafID);
      this.rafID = requestAnimationFrame(function () {
        return _this.animate();
      });
    }
  }, {
    key: 'animate',
    value: function animate() {
      var _this2 = this;

      if (!this.isRunning) {
        return;
      }
      this.update();
      this.notify();
      this.rafID = requestAnimationFrame(function () {
        return _this2.animate();
      });
    }
  }, {
    key: 'update',
    value: function update() {
      this.applyBoundForce();
      this.applyDragForce();
      this.applyScrollForce();

      this.velocity.x *= this.friction;
      this.velocity.y *= this.friction;

      if (!this.mode.y) {
        this.position.x += this.velocity.x;
      }
      if (!this.mode.x) {
        this.position.y += this.velocity.y;
      }

      if (!this.bounce || this.isScrolling) {
        this.position.x = Math.max(Math.min(this.position.x, this.boundX.to), this.boundX.from);
        this.position.y = Math.max(Math.min(this.position.y, this.boundY.to), this.boundY.from);
      }

      if (!this.isDragging && !this.isScrolling && Math.abs(this.velocity.x) < 0.005 && Math.abs(this.velocity.y) < 0.005) {
        this.isRunning = false;
      }
    }
  }, {
    key: 'applyForce',
    value: function applyForce(force) {
      this.velocity.x += force.x;
      this.velocity.y += force.y;
    }
  }, {
    key: 'applyBoundForce',
    value: function applyBoundForce() {
      if (!this.bounce) {
        return;
      }
      if (this.isDragging) {
        return;
      }

      var pastLeft = this.position.x < this.boundX.from;
      var pastRight = this.position.x > this.boundX.to;
      var pastTop = this.position.y < this.boundY.from;
      var pastBottom = this.position.y > this.boundY.to;

      var resultForce = { x: 0, y: 0 };

      if (pastLeft || pastRight) {
        var bound = pastLeft ? this.boundX.from : this.boundX.to;
        var distance = bound - this.position.x;

        var force = distance * 0.1;
        var restX = this.position.x + (this.velocity.x + force) / (1 - this.friction);

        if (!(pastLeft && restX < this.boundX.from || pastRight && restX > this.boundX.to)) {
          force = distance * 0.1 - this.velocity.x;
        }

        resultForce.x = force;
      }

      if (pastTop || pastBottom) {
        var _bound = pastTop ? this.boundY.from : this.boundY.to;
        var _distance = _bound - this.position.y;

        var _force = _distance * 0.1;
        var restY = this.position.y + (this.velocity.y + _force) / (1 - this.friction);

        if (!(pastTop && restY < this.boundY.from || pastBottom && restY > this.boundY.to)) {
          _force = _distance * 0.1 - this.velocity.y;
        }

        resultForce.y = _force;
      }

      this.applyForce(resultForce);
    }
  }, {
    key: 'applyDragForce',
    value: function applyDragForce() {
      if (!this.isDragging) {
        return;
      }
      var dragVelocity = {
        x: this.dragPosition.x - this.position.x,
        y: this.dragPosition.y - this.position.y
      };
      var dragForce = {
        x: dragVelocity.x - this.velocity.x,
        y: dragVelocity.y - this.velocity.y
      };

      this.applyForce(dragForce);
    }
  }, {
    key: 'applyScrollForce',
    value: function applyScrollForce() {
      if (!this.isScrolling) {
        return;
      }

      var scrollForce = {
        x: this.scrollOffset.x - this.velocity.x,
        y: this.scrollOffset.y - this.velocity.y
      };

      this.scrollOffset.x = 0;
      this.scrollOffset.y = 0;

      this.applyForce(scrollForce);
    }
  }, {
    key: 'setPosition',
    value: function setPosition() {
      var newPosition = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      this.velocity.x = 0;
      this.velocity.y = 0;

      this.position.x = -newPosition.x || 0;
      this.position.y = -newPosition.y || 0;

      this.run();
    }
  }, {
    key: 'getUpdate',
    value: function getUpdate() {
      return {
        position: {
          x: -this.position.x,
          y: -this.position.y
        },
        viewport: _extends({}, this.viewport),
        content: _extends({}, this.content)
      };
    }
  }, {
    key: 'notify',
    value: function notify() {
      this.props.onUpdate(this.getUpdate());
    }
  }, {
    key: 'updateMetrics',
    value: function updateMetrics() {
      this.viewport.width = this.props.viewport.clientWidth;
      this.viewport.height = this.props.viewport.clientHeight;

      this.content.width = getFullWidth(this.props.content);
      this.content.height = getFullHeight(this.props.content);

      this.boundX.from = Math.min(-this.content.width + this.viewport.width, 0);
      this.boundY.from = Math.min(-this.content.height + this.viewport.height, 0);

      this.run();
    }
  }, {
    key: 'handleEvents',
    value: function handleEvents() {
      var _this3 = this;

      var vp = this.props.viewport;
      var scroll = { x: 0, y: 0 };
      var mousedown = { x: 0, y: 0 };

      var isTouch = false;

      var setDragPosition = function setDragPosition(event) {
        var pageX = void 0,
            pageY = void 0;
        if (isTouch) {
          pageX = event.touches[0].pageX;
          pageY = event.touches[0].pageY;
        } else {
          pageX = event.pageX;
          pageY = event.pageY;
        }

        var moveX = pageX - mousedown.x;
        var moveY = pageY - mousedown.y;
        _this3.dragPosition.x = _this3.dragStartPosition.x + moveX;
        _this3.dragPosition.y = _this3.dragStartPosition.y + moveY;
        if (!isTouch) {
          event.preventDefault();
        }
      };

      this.events.pointerdown = function (event) {
        var pageX = void 0,
            pageY = void 0,
            clientX = void 0,
            clientY = void 0;

        isTouch = !!(event.touches && event.touches[0]);

        if (isTouch) {
          pageX = event.touches[0].pageX;
          pageY = event.touches[0].pageY;
          clientX = event.touches[0].clientX;
          clientY = event.touches[0].clientY;
        } else {
          pageX = event.pageX;
          pageY = event.pageY;
          clientX = event.clientX;
          clientY = event.clientY;
        }

        console.log(pageX - vp.offsetLeft, vp.clientLeft + vp.clientWidth);
        var rect = vp.getBoundingClientRect();
        // click on vertical scrollbar
        if (clientX - rect.left >= vp.clientLeft + vp.clientWidth) {
          console.log('lol x');
          return;
        }

        // click on horizontal scrollbar
        if (clientY - rect.top >= vp.clientTop + vp.clientHeight) {
          console.log('lol y');
          return;
        }

        _this3.isDragging = true;
        if (scroll.x || scroll.y) {
          _this3.position.x = scroll.x;
          _this3.position.y = scroll.y;
          scroll.x = 0;
          scroll.y = 0;
        }
        mousedown.x = pageX;
        mousedown.y = pageY;
        _this3.dragStartPosition.x = _this3.position.x;
        _this3.dragStartPosition.y = _this3.position.y;
        setDragPosition(event);
        _this3.run();

        var pointerUp = void 0,
            removeEvents = void 0;

        removeEvents = function removeEvents(event) {
          _this3.isDragging = false;
          if (isTouch) {
            window.removeEventListener('touchmove', setDragPosition);
            window.removeEventListener('touchend', pointerUp);
          } else {
            window.removeEventListener('mousemove', setDragPosition);
            window.removeEventListener('mouseup', pointerUp);
          }
        };

        if (isTouch) {
          pointerUp = window.addEventListener('touchend', removeEvents);
          window.addEventListener('touchmove', setDragPosition);
        } else {
          pointerUp = window.addEventListener('mouseup', removeEvents);
          window.addEventListener('mousemove', setDragPosition);
        }
      };

      var scrollTimer = null;
      this.events.wheel = function (event) {
        _this3.velocity.x = 0;

        if (!_this3.isScrollEnabled) {
          return;
        }
        _this3.isScrolling = true;

        _this3.scrollOffset.x = -event.deltaX;
        _this3.scrollOffset.y = -event.deltaY;

        _this3.run();

        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(function () {
          return _this3.isScrolling = false;
        }, 80);

        event.preventDefault();
      };

      this.events.scroll = function (event) {
        var sl = _this3.props.viewport.scrollLeft;
        var st = _this3.props.viewport.scrollTop;
        if (Math.abs(_this3.position.x + sl) > 3) {
          _this3.position.x = -sl;
          _this3.velocity.x = 0;
        }
        if (Math.abs(_this3.position.y + st) > 3) {
          _this3.position.y = -st;
          _this3.velocity.y = 0;
        }
        scroll.x = -_this3.props.viewport.scrollLeft;
        scroll.y = -_this3.props.viewport.scrollTop;
      };

      this.events.resize = this.updateMetrics.bind(this);

      this.props.handle.addEventListener('mousedown', this.events.pointerdown);
      this.props.handle.addEventListener('touchstart', this.events.pointerdown);
      this.props.viewport.addEventListener('wheel', this.events.wheel);
      this.props.viewport.addEventListener('scroll', this.events.scroll);
      window.addEventListener('resize', this.events.resize);
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.props.handle.removeEventListener('mousedown', this.events.pointerdown);
      this.props.handle.removeEventListener('touchstart', this.events.pointerdown);
      this.props.viewport.removeEventListener('wheel', this.events.wheel);
      this.props.viewport.removeEventListener('scroll', this.events.scroll);
      window.removeEventListener('resize', this.events.resize);
    }
  }]);

  return ScrollBooster;
}();

exports.default = ScrollBooster;


function getFullWidth(elem) {
  return Math.max(elem.offsetWidth, elem.scrollWidth);
}

function getFullHeight(elem) {
  return Math.max(elem.offsetHeight, elem.scrollHeight);
}
module.exports = exports['default'];

/***/ })
/******/ ]);
});
//# sourceMappingURL=scrollbooster.js.map