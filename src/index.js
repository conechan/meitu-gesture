import MTouch from '@meitu/mtouch';
import _ from './utils';

window.requestAnimFrame = (function() {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || function(callback) {
        window.setTimeout(callback, 1000 / 60);
    };
})();

export default class MGesture {
    constructor(options) {
        this.freezed = false;
        this.ops = {
            receiver: null,
            operator: null,
            drag:false,
            pinch:false,
            rotate:false,
            singlePinch:false,
            singleRotate:false,
            limit:null,

            // event
            event:{
                touchstart() {},
                touchmove() {},
                touchend() {},

                dragstart() {},
                drag(){},
                dragend() {},

                pinchstart() {},
                pinch(){},
                pinchend() {},

                rotatestart() {},
                rotate(){},
                rotatend() {},

                singlePinchstart(){},
                singlePinch(){},
                singlePinchend(){},

                singleRotatestart(){},
                singleRotate(){},
                singleRotatend(){},
            },

        };

        if(!options.receiver || typeof options.receiver !== 'string'){
            console.error('receiver error,there must be a receiver-selector');
            return;
        }

        if(options.operator && typeof options.operator !== 'string'){
            console.error('operator error, the operator param must be a selector');
            return;
        }

        this.ops = _.extend(this.ops, options);

        // 事件接收器；
        this.receiver = document.querySelector(this.ops.receiver);
        this.receiverStatus = this.receiver.getBoundingClientRect();
        // 事件操纵器；
        if(this.ops.operator){
            this.operator = document.querySelector(this.ops.operator);
        }else{
            this.operator = this.receiver;
        }

        this.operatorStatus = this.operator.getBoundingClientRect();

        if(options.limit === 'crop'){
            let minX = 0 , minY = 0;
            if(this.operatorStatus.width > this.receiverStatus.width){
                minX = (this.operatorStatus.width - this.receiverStatus.width)/this.operatorStatus.width;
            }
            if(this.operatorStatus.height > this.receiverStatus.height){
                minY = (this.operatorStatus.height - this.receiverStatus.height)/this.operatorStatus.height;
            }
            this.ops.limit = {
                x:minX,
                y:minY,
                maxScale:1,
                minScale:1,
            };
        }else if(options.limit === true){
            this.ops.limit = {
                x:0.5,
                y:0.5,
                maxScale:3,
                minScale:0.4,
            };
        }

        this.transform = _.getPos(this.operator);
        this.mtouch = new MTouch({
            // config:
            receiver: this.ops.receiver,
            operator: this.ops.operator,

            // event
            touchstart:this.touchstart.bind(this),
            touchmove:this.ops.event.touchmove,
            touchend:this.ops.event.touchend,

            drag:this.drag.bind(this),
            dragstart:this.ops.event.dragstart,
            dragend:this.ops.event.dragend,

            pinch:this.pinch.bind(this),
            pinchstart:this.ops.event.pinchstart,
            pinchend:this.ops.event.pinchend,

            rotate:this.rotate.bind(this),
            rotatestart:this.ops.event.rotatestart,
            rotatend:this.ops.event.rotatend,

            singlePinch:{
                start:this.ops.event.singlePinchstart,
                pinch:this.singlePinch.bind(this),
                end:this.ops.event.singlePinchend,
                buttonId:this.ops.singlePinch.buttonId,
            },

            singleRotate:{
                start:this.ops.event.singleRotatestart,
                rotate:this.singleRotate.bind(this),
                end:this.ops.event.singleRotatend,
                buttonId:this.ops.singleRotate.buttonId,
            },
        });
    }
    touchstart(ev){
        this.transform = _.getPos(this.operator);
        this.ops.event.touchstart(ev);
    }
    drag(ev){
        if(this.ops.drag && !this.freezed){
            this.transform.x += ev.delta.deltaX;
            this.transform.y += ev.delta.deltaY;
            this.setTransform();
            this.ops.event.drag(ev);
        }
    }
    pinch(ev){
        if(this.ops.pinch && !this.freezed){
            this.transform.scale *= ev.delta.scale;
            this.setTransform();
            this.ops.event.pinch(ev);
        }
    }
    rotate(ev){
        if(this.ops.rotate && !this.freezed){
            this.transform.rotate += ev.delta.rotate;
            this.setTransform();
            this.ops.event.rotate(ev);
        }
    }
    singlePinch(ev){
        if(this.ops.singlePinch && !this.freezed){
            this.transform.scale *= ev.delta.scale;
            this.setTransform();
            this.ops.event.singlePinch(ev);
        }
    }
    singleRotate(ev){
        if(this.ops.singleRotate && !this.freezed){
            this.transform.rotate += ev.delta.rotate;
            this.setTransform();
            this.ops.event.singleRotate(ev);
        }
    }
    setTransform(el = this.operator, transform = this.transform) {
        let trans = JSON.parse(JSON.stringify(transform));
        if (this.ops.limit) {
            trans = this.limitOperator(trans);
        }
        window.requestAnimFrame(()=>{
            _.setPos(el, trans);
        });
    }
    limitOperator(transform) {
        // 实时获取操作元素的状态；
        let {minScale, maxScale} = this.ops.limit;
        if (this.ops.limit.minScale && transform.scale < minScale){
            transform.scale = minScale;
        }
        if (this.ops.limit.maxScale && transform.scale > maxScale){
            transform.scale = maxScale;
        }
        let operatorStatus = _.getOffset(this.operator);
        // 因缩放产生的间隔；
        let spaceX = operatorStatus.width * (transform.scale - 1) / 2;
        let spaceY = operatorStatus.height * (transform.scale - 1) / 2;
        // 参数设置的边界值；
        let boundaryX = operatorStatus.width * transform.scale  * (this.ops.limit.x);
        let boundaryY = operatorStatus.height * transform.scale * (this.ops.limit.y);
        // 4个边界状态；
        let minX = spaceX - boundaryX;
        let minY = spaceX - boundaryY;
        let maxX = this.receiverStatus.width - operatorStatus.width * transform.scale + spaceX + boundaryX;
        let maxY = this.receiverStatus.height - operatorStatus.height * transform.scale + spaceY + boundaryY;

        if(this.ops.limit.x || this.ops.limit.x == 0){
            if(transform.x >= maxX)transform.x = maxX;
            if(transform.x < minX)transform.x = minX;
        }
        if(this.ops.limit.y || this.ops.limit.y == 0){
            if(transform.y > maxY)transform.y = maxY;
            if(transform.y < minY)transform.y = minY;
        }
        return transform;
    }
    switchOperator(el){
        el = typeof el == 'string'? document.querySelector(el):el;
        // 转换操作元素后，也需要重置 mtouch 中的单指缩放基本点 singleBasePoint;
        this.mtouch.switchOperator(el);
        this.operator = el;
        this.freeze(false);
        return this;
    }
    freeze(freeze){
        this.freezed = freeze ? true:false;
        return this;
    }
}
