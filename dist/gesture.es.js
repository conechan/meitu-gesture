var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _typeof$1 = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
    return typeof obj === "undefined" ? "undefined" : _typeof2(obj);
} : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof2(obj);
};

var _ = {
    getLength: function getLength(v1) {
        if ((typeof v1 === 'undefined' ? 'undefined' : _typeof$1(v1)) !== 'object') {
            console.error('getLength error!');
            return;
        }
        return Math.sqrt(v1.x * v1.x + v1.y * v1.y);
    },
    getAngle: function getAngle(v1, v2) {
        if ((typeof v1 === 'undefined' ? 'undefined' : _typeof$1(v1)) !== 'object' || (typeof v2 === 'undefined' ? 'undefined' : _typeof$1(v2)) !== 'object') {
            console.error('getAngle error!');
            return;
        }
        var direction = v1.x * v2.y - v2.x * v1.y > 0 ? 1 : -1,
            len1 = this.getLength(v1),
            len2 = this.getLength(v2),
            mr = len1 * len2,
            dot = void 0,
            r = void 0;
        if (mr === 0) return 0;
        dot = v1.x * v2.x + v1.y * v2.y;
        r = dot / mr;
        if (r > 1) r = 1;
        if (r < -1) r = -1;
        return Math.acos(r) * direction * 180 / Math.PI;
    },
    getBasePoint: function getBasePoint(el) {
        if (!el) {
            console.error('getBasePoint error!');
            return;
        }
        var offset = this.getOffset(el);
        var x = offset.left + el.getBoundingClientRect().width / 2,
            y = offset.top + el.getBoundingClientRect().width / 2;
        return { x: Math.round(x), y: Math.round(y) };
    },

    // setPos(el, transform) {
    //     let str = JSON.stringify(transform);
    //     let value = `translate3d(${transform.x}px,${transform.y}px,0px) scale(${transform.scale}) rotate(${transform.rotate}deg)`;
    //     el = typeof el == 'string'? document.querySelector(el): el;
    //     el.style.transform = value;
    //     el.setAttribute('data-mtouch-status', str);
    // },
    // getPos(el) {
    //     let defaulTrans;
    //     let cssTrans = window.getComputedStyle(el,null).transform;
    //     if(window.getComputedStyle && cssTrans !== 'none'){
    //         defaulTrans = this.matrixTo(cssTrans);
    //     }else{
    //         defaulTrans = {
    //             x: 0,
    //             y: 0,
    //             scale: 1,
    //             rotate: 0,
    //         };
    //     }
    //     return JSON.parse(el.getAttribute('data-mtouch-status')) || defaulTrans;
    // },
    extend: function extend(obj1, obj2) {
        for (var k in obj2) {
            if (obj2.hasOwnProperty(k)) {
                if (_typeof$1(obj2[k]) == 'object') {
                    if (_typeof$1(obj1[k]) !== 'object') {
                        obj1[k] = {};
                    }
                    this.extend(obj1[k], obj2[k]);
                } else {
                    obj1[k] = obj2[k];
                }
            }
        }
        return obj1;
    },
    getVector: function getVector(p1, p2) {
        if ((typeof p1 === 'undefined' ? 'undefined' : _typeof$1(p1)) !== 'object' || (typeof p2 === 'undefined' ? 'undefined' : _typeof$1(p2)) !== 'object') {
            console.error('getvector error!');
            return;
        }
        var x = Math.round(p1.x - p2.x),
            y = Math.round(p1.y - p2.y);
        return { x: x, y: y };
    },
    getPoint: function getPoint(ev, index) {
        if (!ev || !ev.touches[index]) {
            console.error('getPoint error!');
            return;
        }
        return {
            x: Math.round(ev.touches[index].pageX),
            y: Math.round(ev.touches[index].pageY)
        };
    },
    getOffset: function getOffset(el) {
        el = typeof el == 'string' ? document.querySelector(el) : el;
        var rect = el.getBoundingClientRect();
        var offset = {
            left: rect.left + document.body.scrollLeft,
            top: rect.top + document.body.scrollTop,
            width: el.offsetWidth,
            height: el.offsetHeight
        };
        return offset;
    },
    matrixTo: function matrixTo(matrix) {
        var arr = matrix.replace('matrix(', '').replace(')', '').split(',');
        var cos = arr[0],
            sin = arr[1],
            tan = sin / cos,
            rotate = Math.atan(tan) * 180 / Math.PI,
            scale = cos / Math.cos(Math.PI / 180 * rotate),
            trans = void 0;
        trans = {
            x: parseInt(arr[4]),
            y: parseInt(arr[5]),
            scale: scale,
            rotate: rotate
        };
        return trans;
    },
    getUseName: function getUseName(evName) {
        var useName = evName.replace('start', '');
        var end = useName.indexOf('rotate') !== -1 ? 'nd' : 'end';
        useName = useName.replace(end, '');
        return useName;
    }
};

var _createClass$1 = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

function _classCallCheck$1(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var HandlerBus = function () {
    function HandlerBus(el) {
        _classCallCheck$1(this, HandlerBus);

        this.handlers = [];
        this.el = el;
    }

    _createClass$1(HandlerBus, [{
        key: 'add',
        value: function add(handler) {
            this.handlers.push(handler);
            return this;
        }
    }, {
        key: 'del',
        value: function del(handler) {
            var _this = this;

            if (!handler) {
                this.handlers = [];
            } else {
                this.handlers.forEach(function (value, index) {
                    if (value === handler) {
                        _this.handlers.splice(index, 1);
                    }
                });
            }
            return this;
        }
    }, {
        key: 'fire',
        value: function fire() {
            var _this2 = this,
                _arguments = arguments;

            if (!this.handlers || !this.handlers.length === 0) return;
            this.handlers.forEach(function (handler) {
                if (typeof handler === 'function') handler.apply(_this2.el, _arguments);
            });
            return this;
        }
    }]);

    return HandlerBus;
}();

var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
    return typeof obj === "undefined" ? "undefined" : _typeof2(obj);
} : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof2(obj);
};

var EVENT = ['touchstart', 'touchmove', 'touchend', 'drag', 'dragstart', 'dragend', 'pinch', 'pinchstart', 'pinchend', 'rotate', 'rotatestart', 'rotatend'];

var ORIGINEVENT = ['touchstart', 'touchmove', 'touchend', 'touchcancel'];

function MTouch(config, operator) {

    // 兼容不使用 new 的方式；
    if (!(this instanceof MTouch)) return new MTouch(config, operator);

    // options 多态；
    var options = void 0;
    if (typeof config === 'string') {
        options = {};
        options.receiver = config;
        if (operator) {
            options.operator = operator;
        }
    } else if ((typeof config === 'undefined' ? 'undefined' : _typeof(config)) === 'object') {
        options = config;
    }

    this.ops = {
        // config:
        receiver: null,
        operator: null,

        // event
        touchstart: function touchstart() {},
        touchmove: function touchmove() {},
        touchend: function touchend() {},
        drag: function drag() {},
        dragstart: function dragstart() {},
        dragend: function dragend() {},
        pinch: function pinch() {},
        pinchstart: function pinchstart() {},
        pinchend: function pinchend() {},
        rotate: function rotate() {},
        rotatestart: function rotatestart() {},
        rotatend: function rotatend() {},

        singlePinch: {
            start: function start() {},
            pinch: function pinch() {},
            end: function end() {},

            buttonId: null
        },

        singleRotate: {
            start: function start() {},
            rotate: function rotate() {},
            end: function end() {},

            buttonId: null
        }
    };

    // 开关；
    this.use = {
        drag: !!options.drag || !!options.dragstart || !!options.dragend,
        pinch: !!options.pinch || !!options.pinchstart || !!options.pinchend,
        rotate: !!options.rotate || !!options.rotatestart || !!options.rotateend,
        singlePinch: !!options.singlePinch && !!options.singlePinch.buttonId,
        singleRotate: !!options.singleRotate && !!options.singleRotate.buttonId
    };

    this.ops = _.extend(this.ops, options);

    // receiver test;
    if (!this.ops.receiver || typeof this.ops.receiver !== 'string') {
        console.error('receiver error,there must be a receiver-selector');
        return;
    }
    // 事件接收器；
    this.receiver = document.querySelector(this.ops.receiver);

    // 事件操纵器；
    if (this.ops.operator) {
        if (typeof this.ops.operator !== 'string') {
            console.error('operator error, the operator param must be a selector');
            return;
        }
        this.operator = document.querySelector(this.ops.operator);
    } else {
        this.operator = this.receiver;
    }
    // touch状态；
    this.fingers = 0;
    // 初始状态;
    this.draging = this.pinching = this.rotating = this.singleRotating = this.singlePinching = false;

    this.startScale = 1;
    this.startPoint = {};
    this.secondPoint = {};
    this.pinchStartLength = null;
    this.singlePinchStartLength = null;
    this.vector1 = {};
    this.singleBasePoint = {};
    // eventbus
    this.driveBus();
    this.bind();
}

MTouch.prototype.driveBus = function () {
    var _this = this;

    EVENT.forEach(function (eventName) {
        _this[eventName] = new HandlerBus(_this.receiver).add(_this.ops[eventName] || function () {});
    });
    this.singlePinchstart = new HandlerBus(this.receiver).add(this.ops.singlePinch.start || function () {});
    this.singlePinch = new HandlerBus(this.receiver).add(this.ops.singlePinch.pinch || function () {});
    this.singlePinchend = new HandlerBus(this.receiver).add(this.ops.singlePinch.end || function () {});
    this.singleRotatestart = new HandlerBus(this.receiver).add(this.ops.singleRotate.start || function () {});
    this.singleRotate = new HandlerBus(this.receiver).add(this.ops.singleRotate.rotate || function () {});
    this.singleRotatend = new HandlerBus(this.receiver).add(this.ops.singleRotate.end || function () {});
};

MTouch.prototype.bind = function () {
    var _this2 = this;

    ORIGINEVENT.forEach(function (evName) {
        var fn = evName == 'touchcancel' ? 'end' : evName.replace('touch', '');
        // 需要存下 bind(this) 后的函数指向，用于 destroy;
        _this2[fn + '_bind'] = _this2[fn].bind(_this2);
        _this2.receiver.addEventListener(evName, _this2[fn + '_bind'], false);
    });
};
MTouch.prototype.destroy = function () {
    var _this3 = this;

    ORIGINEVENT.forEach(function (evName) {
        var fn = evName == 'touchcancel' ? 'end' : evName.replace('touch', '');
        _this3.receiver.removeEventListener(evName, _this3[fn + '_bind'], false);
    });
};
MTouch.prototype.start = function (ev) {
    if (!ev.touches || ev.type !== 'touchstart') return;

    this.fingers = ev.touches.length;
    this.startPoint = _.getPoint(ev, 0);
    this.singleBasePoint = _.getBasePoint(this.operator);

    if (this.fingers > 1) {
        this.secondPoint = _.getPoint(ev, 1);
        this.vector1 = _.getVector(this.secondPoint, this.startPoint);
        this.pinchStartLength = _.getLength(this.vector1);
    } else if (this.use.singlePinch) {
        var pinchV1 = _.getVector(this.startPoint, this.singleBasePoint);
        this.singlePinchStartLength = _.getLength(pinchV1);
    }

    this.touchstart.fire({ origin: ev, eventType: 'touchstart' });
};
MTouch.prototype.move = function (ev) {
    if (!ev.touches || ev.type !== 'touchmove') return;
    var curPoint = _.getPoint(ev, 0),
        curFingers = ev.touches.length,
        rotateV1 = void 0,
        rotateV2 = void 0,
        pinchV2 = void 0,
        pinchLength = void 0,
        singlePinchLength = void 0;

    // 当从原先的两指到一指的时候，可能会出现基础手指的变化，导致跳动；
    // 因此需屏蔽掉一次错误的touchmove事件，待重新设置基础指后，再继续进行；
    if (curFingers < this.fingers) {
        this.startPoint = curPoint;
        this.fingers = curFingers;
        return;
    }

    // 两指先后触摸时，只会触发第一指一次touchstart，第二指不会再次触发touchstart；
    // 因此会出现没有记录第二指状态，需要在touchmove中重新获取参数；
    if (curFingers > 1 && (!this.secondPoint || !this.vector1 || !this.pinchStartLength)) {
        this.secondPoint = _.getPoint(ev, 1);
        this.vector1 = _.getVector(this.secondPoint, this.startPoint);
        this.pinchStartLength = _.getLength(this.vector1);
    }

    // 双指时，需触发pinch和rotate事件；
    if (curFingers > 1) {
        var curSecPoint = _.getPoint(ev, 1),
            vector2 = _.getVector(curSecPoint, curPoint);
        // pinch
        if (this.use.pinch) {
            pinchLength = _.getLength(vector2);
            this.eventFire('pinch', {
                delta: {
                    scale: pinchLength / this.pinchStartLength
                },
                origin: ev
            });
            this.pinchStartLength = pinchLength;
        }
        // rotate
        if (this.use.rotate) {
            this.eventFire('rotate', {
                delta: {
                    rotate: _.getAngle(this.vector1, vector2)
                },
                origin: ev
            });
            this.vector1 = vector2;
        }
    } else {
        // singlePinch;
        if (this.use.singlePinch && ev.target.id == this.ops.singlePinch.buttonId) {
            pinchV2 = _.getVector(curPoint, this.singleBasePoint);
            singlePinchLength = _.getLength(pinchV2);
            this.eventFire('singlePinch', {
                delta: {
                    scale: singlePinchLength / this.singlePinchStartLength
                },
                origin: ev
            });
            this.singlePinchStartLength = singlePinchLength;
        }
        // singleRotate;
        if (this.use.singleRotate && ev.target.id == this.ops.singleRotate.buttonId) {
            rotateV1 = _.getVector(this.startPoint, this.singleBasePoint);
            rotateV2 = _.getVector(curPoint, this.singleBasePoint);
            this.eventFire('singleRotate', {
                delta: {
                    rotate: _.getAngle(rotateV1, rotateV2)
                },
                origin: ev
            });
        }
    }
    if (this.use.drag) {
        if (ev.target.id !== this.ops.singlePinch.buttonId && ev.target.id !== this.ops.singleRotate.buttonId) {
            this.eventFire('drag', {
                delta: {
                    deltaX: curPoint.x - this.startPoint.x,
                    deltaY: curPoint.y - this.startPoint.y
                },
                origin: ev
            });
        }
    }
    this.startPoint = curPoint;
    this.touchmove.fire({ eventType: 'touchmove', origin: ev });
    ev.preventDefault();
};
MTouch.prototype.end = function (ev) {
    var _this4 = this;

    if (!ev.touches && ev.type !== 'touchend' && ev.type !== 'touchcancel') return;
    ['pinch', 'drag', 'rotate', 'singleRotate', 'singlePinch'].forEach(function (evName) {
        _this4.eventEnd(evName, { origin: ev });
    });
    this.touchend.fire({ eventType: 'touchend', origin: ev });
};
MTouch.prototype.eventFire = function (evName, ev) {
    var ing = evName + 'ing';
    var start = evName + 'start';
    if (!this[ing]) {
        ev.eventType = start;
        this[start].fire(ev);
        this[ing] = true;
    } else {
        ev.eventType = evName;
        this[evName].fire(ev);
    }
};
MTouch.prototype.eventEnd = function (evName, ev) {
    var ing = evName + 'ing',
        end = void 0;
    if (evName == 'rotate' || evName == 'singleRotate') {
        end = evName + 'nd';
    } else {
        end = evName + 'end';
    }
    if (this[ing]) {
        ev.eventType = end;
        this[end].fire(ev);
        this[ing] = false;
    }
};
MTouch.prototype.switchOperator = function (el) {
    this.operator = el;
};
MTouch.prototype.on = function (evName, handler) {
    this.use[_.getUseName(evName)] = true;
    this[evName].add(handler);
};
MTouch.prototype.off = function (evName, handler) {
    this[evName].del(handler);
};

var _typeof$1$1 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _$1 = {
    // getLength(v1) {
    //     if (!v1) {
    //         console.error('getLength error!');
    //         return;
    //     }
    //     return Math.sqrt(v1.x * v1.x + v1.y * v1.y);
    // },
    // getAngle(v1, v2) {
    //     if (!v1 || !v2) {
    //         console.error('getAngle error!');
    //         return;
    //     }
    //     let direction = v1.x * v2.y - v2.x * v1.y;
    //     direction = direction > 0? 1: -1;
    //     let len1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
    //     let len2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y);
    //     let mr = len1 * len2;
    //     if (mr === 0)return 0;
    //     let dot = v1.x * v2.x + v1.y * v2.y;
    //     let r = dot / mr;
    //     if (r > 1)
    //         r = 1;
    //     if (r < -1)
    //         r = -1;
    //     return Math.acos(r) * direction * 180 / Math.PI;
    // },
    // getBasePoint(el) {
    //     if (!el) {
    //         console.error('getBasePoint error!');
    //         return;
    //     }
    //     let x = el.getBoundingClientRect().left + el.getBoundingClientRect().width / 2,
    //         y = el.getBoundingClientRect().top + el.getBoundingClientRect().width / 2;
    //     return {x: Math.round(x), y: Math.round(y)};
    // },
    setPos: function setPos(el, transform) {
        var str = JSON.stringify(transform);
        var value = 'translate3d(' + transform.x + 'px,' + transform.y + 'px,0px) scale(' + transform.scale + ') rotate(' + transform.rotate + 'deg)';
        el = typeof el == 'string' ? document.querySelector(el) : el;
        el.style.transform = value;
        el.setAttribute('data-mtouch-status', str);
    },
    getPos: function getPos(el) {
        var defaulTrans = void 0;
        var cssTrans = window.getComputedStyle(el, null).transform;
        if (window.getComputedStyle && cssTrans !== 'none') {
            defaulTrans = this.matrixTo(cssTrans);
        } else {
            defaulTrans = {
                x: 0,
                y: 0,
                scale: 1,
                rotate: 0
            };
        }
        return JSON.parse(el.getAttribute('data-mtouch-status')) || defaulTrans;
    },
    extend: function extend(obj1, obj2) {
        for (var k in obj2) {
            if (obj2.hasOwnProperty(k)) {
                if (_typeof$1$1(obj2[k]) == 'object') {
                    if (_typeof$1$1(obj1[k]) !== 'object' || obj1[k] === null) {
                        obj1[k] = {};
                    }
                    this.extend(obj1[k], obj2[k]);
                } else {
                    obj1[k] = obj2[k];
                }
            }
        }
        return obj1;
    },

    // getVector(p1, p2) {
    //     if (!p1 || !p2) {
    //         console.error('getvector error!');
    //         return;
    //     }
    //     return {
    //         x: Math.round(p1.x - p2.x),
    //         y: Math.round(p1.y - p2.y),
    //     };
    // },
    // getPoint(ev, index) {
    //     if (!ev || !ev.touches[index]) {
    //         console.error('getPoint error!');
    //         return;
    //     }
    //     return {
    //         x: Math.round(ev.touches[index].pageX),
    //         y: Math.round(ev.touches[index].pageY),
    //     };
    // },
    getOffset: function getOffset(el) {
        el = typeof el == 'string' ? document.querySelector(el) : el;
        var offset = {};
        offset.width = el.offsetWidth;
        offset.height = el.offsetHeight;
        return offset;
    },
    matrixTo: function matrixTo(matrix) {
        var arr = matrix.replace('matrix(', '').replace(')', '').split(',');
        var cos = arr[0],
            sin = arr[1],
            tan = sin / cos,
            rotate = Math.atan(tan) * 180 / Math.PI,
            scale = cos / Math.cos(Math.PI / 180 * rotate),
            trans = void 0;
        trans = {
            x: parseInt(arr[4]),
            y: parseInt(arr[5]),
            scale: scale,
            rotate: rotate
        };
        return trans;
    }
};

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

window.requestAnimFrame = function () {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || function (callback) {
        window.setTimeout(callback, 1000 / 60);
    };
}();

var MGesture = function () {
    function MGesture(options) {
        _classCallCheck(this, MGesture);

        this.freezed = false;
        this.ops = {
            receiver: null,
            operator: null,
            drag: false,
            pinch: false,
            rotate: false,
            singlePinch: false,
            singleRotate: false,
            limit: null,

            // event
            event: {
                touchstart: function touchstart() {},
                touchmove: function touchmove() {},
                touchend: function touchend() {},
                dragstart: function dragstart() {},
                drag: function drag() {},
                dragend: function dragend() {},
                pinchstart: function pinchstart() {},
                pinch: function pinch() {},
                pinchend: function pinchend() {},
                rotatestart: function rotatestart() {},
                rotate: function rotate() {},
                rotatend: function rotatend() {},
                singlePinchstart: function singlePinchstart() {},
                singlePinch: function singlePinch() {},
                singlePinchend: function singlePinchend() {},
                singleRotatestart: function singleRotatestart() {},
                singleRotate: function singleRotate() {},
                singleRotatend: function singleRotatend() {}
            }

        };

        if (!options.receiver || typeof options.receiver !== 'string') {
            console.error('receiver error,there must be a receiver-selector');
            return;
        }

        if (options.operator && typeof options.operator !== 'string') {
            console.error('operator error, the operator param must be a selector');
            return;
        }

        this.ops = _$1.extend(this.ops, options);

        // 事件接收器；
        this.receiver = document.querySelector(this.ops.receiver);
        this.receiverStatus = this.receiver.getBoundingClientRect();
        // 事件操纵器；
        if (this.ops.operator) {
            this.operator = document.querySelector(this.ops.operator);
        } else {
            this.operator = this.receiver;
        }

        this.operatorStatus = this.operator.getBoundingClientRect();

        if (options.limit === 'crop') {
            var minX = 0,
                minY = 0;
            if (this.operatorStatus.width > this.receiverStatus.width) {
                minX = (this.operatorStatus.width - this.receiverStatus.width) / this.operatorStatus.width;
            }
            if (this.operatorStatus.height > this.receiverStatus.height) {
                minY = (this.operatorStatus.height - this.receiverStatus.height) / this.operatorStatus.height;
            }
            this.ops.limit = {
                x: minX,
                y: minY,
                maxScale: 1,
                minScale: 1
            };
        } else if (options.limit === true) {
            this.ops.limit = {
                x: 0.5,
                y: 0.5,
                maxScale: 3,
                minScale: 0.4
            };
        }

        this.transform = _$1.getPos(this.operator);
        this.mtouch = new MTouch({
            // config:
            receiver: this.ops.receiver,
            operator: this.ops.operator,

            // event
            touchstart: this.touchstart.bind(this),
            touchmove: this.ops.event.touchmove,
            touchend: this.ops.event.touchend,

            drag: this.drag.bind(this),
            dragstart: this.ops.event.dragstart,
            dragend: this.ops.event.dragend,

            pinch: this.pinch.bind(this),
            pinchstart: this.ops.event.pinchstart,
            pinchend: this.ops.event.pinchend,

            rotate: this.rotate.bind(this),
            rotatestart: this.ops.event.rotatestart,
            rotatend: this.ops.event.rotatend,

            singlePinch: {
                start: this.ops.event.singlePinchstart,
                pinch: this.singlePinch.bind(this),
                end: this.ops.event.singlePinchend,
                buttonId: this.ops.singlePinch.buttonId
            },

            singleRotate: {
                start: this.ops.event.singleRotatestart,
                rotate: this.singleRotate.bind(this),
                end: this.ops.event.singleRotatend,
                buttonId: this.ops.singleRotate.buttonId
            }
        });
    }

    _createClass(MGesture, [{
        key: 'touchstart',
        value: function touchstart(ev) {
            this.transform = _$1.getPos(this.operator);
            this.ops.event.touchstart(ev);
        }
    }, {
        key: 'drag',
        value: function drag(ev) {
            if (this.ops.drag && !this.freezed) {
                this.transform.x += ev.delta.deltaX;
                this.transform.y += ev.delta.deltaY;
                this.setTransform();
                this.ops.event.drag(ev);
            }
        }
    }, {
        key: 'pinch',
        value: function pinch(ev) {
            if (this.ops.pinch && !this.freezed) {
                this.transform.scale *= ev.delta.scale;
                this.setTransform();
                this.ops.event.pinch(ev);
            }
        }
    }, {
        key: 'rotate',
        value: function rotate(ev) {
            if (this.ops.rotate && !this.freezed) {
                this.transform.rotate += ev.delta.rotate;
                this.setTransform();
                this.ops.event.rotate(ev);
            }
        }
    }, {
        key: 'singlePinch',
        value: function singlePinch(ev) {
            if (this.ops.singlePinch && !this.freezed) {
                this.transform.scale *= ev.delta.scale;
                this.setTransform();
                this.ops.event.singlePinch(ev);
            }
        }
    }, {
        key: 'singleRotate',
        value: function singleRotate(ev) {
            if (this.ops.singleRotate && !this.freezed) {
                this.transform.rotate += ev.delta.rotate;
                this.setTransform();
                this.ops.event.singleRotate(ev);
            }
        }
    }, {
        key: 'setTransform',
        value: function setTransform() {
            var el = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.operator;
            var transform = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.transform;

            var trans = JSON.parse(JSON.stringify(transform));
            if (this.ops.limit) {
                trans = this.limitOperator(trans);
            }
            window.requestAnimFrame(function () {
                _$1.setPos(el, trans);
            });
        }
    }, {
        key: 'limitOperator',
        value: function limitOperator(transform) {
            // 实时获取操作元素的状态；
            var _ops$limit = this.ops.limit,
                minScale = _ops$limit.minScale,
                maxScale = _ops$limit.maxScale;

            if (this.ops.limit.minScale && transform.scale < minScale) {
                transform.scale = minScale;
            }
            if (this.ops.limit.maxScale && transform.scale > maxScale) {
                transform.scale = maxScale;
            }
            var operatorStatus = _$1.getOffset(this.operator);
            // 因缩放产生的间隔；
            var spaceX = operatorStatus.width * (transform.scale - 1) / 2;
            var spaceY = operatorStatus.height * (transform.scale - 1) / 2;
            // 参数设置的边界值；
            var boundaryX = operatorStatus.width * transform.scale * this.ops.limit.x;
            var boundaryY = operatorStatus.height * transform.scale * this.ops.limit.y;
            // 4个边界状态；
            var minX = spaceX - boundaryX;
            var minY = spaceX - boundaryY;
            var maxX = this.receiverStatus.width - operatorStatus.width * transform.scale + spaceX + boundaryX;
            var maxY = this.receiverStatus.height - operatorStatus.height * transform.scale + spaceY + boundaryY;

            if (this.ops.limit.x || this.ops.limit.x == 0) {
                if (transform.x >= maxX) transform.x = maxX;
                if (transform.x < minX) transform.x = minX;
            }
            if (this.ops.limit.y || this.ops.limit.y == 0) {
                if (transform.y > maxY) transform.y = maxY;
                if (transform.y < minY) transform.y = minY;
            }
            return transform;
        }
    }, {
        key: 'switchOperator',
        value: function switchOperator(el) {
            el = typeof el == 'string' ? document.querySelector(el) : el;
            // 转换操作元素后，也需要重置 mtouch 中的单指缩放基本点 singleBasePoint;
            this.mtouch && this.mtouch.switchOperator(el);
            this.operator = el;
            return this;
        }
    }, {
        key: 'freeze',
        value: function freeze(_freeze) {
            this.freezed = _freeze ? true : false;
            return this;
        }
    }, {
        key: 'destory',
        value: function destory() {
            this.mtouch && this.mtouch.destroy();
            this.mtouch = null;
        }
    }]);

    return MGesture;
}();

export default MGesture;
//# sourceMappingURL=gesture.es.js.map
