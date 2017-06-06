export default {
    getLength(v1) {
        if (!v1) {
            console.error('getLength error!');
            return;
        }
        return Math.sqrt(v1.x * v1.x + v1.y * v1.y);
    },
    getAngle(v1, v2) {
        if (!v1 || !v2) {
            console.error('getAngle error!');
            return;
        }
        let direction = v1.x * v2.y - v2.x * v1.y;
        direction = direction > 0? 1: -1;
        let len1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
        let len2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y);
        let mr = len1 * len2;
        if (mr === 0)return 0;
        let dot = v1.x * v2.x + v1.y * v2.y;
        let r = dot / mr;
        if (r > 1)
            r = 1;
        if (r < -1)
            r = -1;
        return Math.acos(r) * direction * 180 / Math.PI;
    },
    getBasePoint(el) {
        if (!el) {
            console.error('getBasePoint error!');
            return;
        }
        let x = el.getBoundingClientRect().left + el.getBoundingClientRect().width / 2,
            y = el.getBoundingClientRect().top + el.getBoundingClientRect().width / 2;
        return {x: Math.round(x), y: Math.round(y)};
    },
    setPos(el, transform) {
        let str = JSON.stringify(transform);
        let value = `translate3d(${transform.x}px,${transform.y}px,0px) scale(${transform.scale}) rotate(${transform.rotate}deg)`;
        el = typeof el == 'string'? document.querySelector(el): el;
        el.style.transform = value;
        el.setAttribute('data-mtouch-status', str);
    },
    getPos(el) {
        let defaulTrans;
        let cssTrans = window.getComputedStyle(el,null).transform;
        if(window.getComputedStyle && cssTrans !== 'none'){
            defaulTrans = this.matrixTo(cssTrans);
        }else{
            defaulTrans = {
                x: 0,
                y: 0,
                scale: 1,
                rotate: 0,
            };
        }
        return JSON.parse(el.getAttribute('data-mtouch-status')) || defaulTrans;
    },
    extend(obj1, obj2) {
        for (let k in obj2) {
            if (obj2.hasOwnProperty(k)) {
                if(typeof obj2[k] == 'object'){
                    if(typeof obj1[k] !== 'object' || obj1[k] === null){
                        obj1[k] = {};
                    }
                    this.extend(obj1[k],obj2[k]);
                }else{
                    obj1[k] = obj2[k];
                }
            }
        }
        return obj1;
    },
    getVector(p1, p2) {
        if (!p1 || !p2) {
            console.error('getvector error!');
            return;
        }
        return {
            x: Math.round(p1.x - p2.x),
            y: Math.round(p1.y - p2.y),
        };
    },
    getPoint(ev, index) {
        if (!ev || !ev.touches[index]) {
            console.error('getPoint error!');
            return;
        }
        return {
            x: Math.round(ev.touches[index].pageX),
            y: Math.round(ev.touches[index].pageY),
        };
    },
    getOffset(el){
        el = typeof el == 'string'? document.querySelector(el): el;
        let offset = {};
        offset.width = el.offsetWidth;
        offset.height = el.offsetHeight;
        return offset;
    },
    matrixTo(matrix){
        let arr = (matrix.replace('matrix(','').replace(')','')).split(',');
        let cos = arr[0],
            sin = arr[1],
            tan = sin/cos,
            rotate = Math.atan(tan)*180/Math.PI,
            scale = cos/(Math.cos(Math.PI/180*rotate)),
            trans;
        trans = {
            x:parseInt(arr[4]),
            y:parseInt(arr[5]),
            scale,
            rotate,
        };
        return trans;
    },
};
