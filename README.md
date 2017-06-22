# gesture.js移动端业务手势库1.0.0

> [demo](http://f2er.meitu.com/gxd/meitu-gesture/example/index.html)

> [git](https://gitlab.meitu.com/npm/meitu-gesture)

> [download](http://f2er.meitu.com/gxd/meitu-gesture/dist/gesture.min.js)

### 更新文档；

- 1.1.1 :
    - 修复直接引入时，包名大小写错误的问题；
    - 增加限制对象参数的说明文档;

### 简介

该库是在 MTouch 的基础上进一步进行封装，更加贴近业务，可以更快更便捷的完成项目中需要的手势操作业务；

支持5种操作:

> 1. **拖动事件**：`drag`
> 2. **双指缩放**：`pinch`
> 3. **双指旋转**：`rotate`
> 4. **单指缩放**：`singlePinch`
> 5. **单指旋转**：`singleRotate`

#### 事件类型：

```js
EVENT = [
    'touchstart',
    'touchmove',
    'touchend',
    'drag',
    'dragstart',
    'dragend',
    'pinch',
    'pinchstart',
    'pinchend',
    'rotate',
    'rotatestart',
    'rotatend',
    'singlePinch',
    'singlePinchstart',
    'singlePinchend',
    'singleRotate',·
    'singleRotatestart',
    'singleRotatend'
];
```

### 兼容性

** 移动端全兼容 **

### 使用方式

#### 引入:

##### 1.直接使用公司私有npm进行引入;

在shell直接使用Npm进行安装

```js
npm set registry http://npm.meitu-inc.com
npm install @meitu/gesture --save

```

```js
import Gesture from '@meitu/gesture';

// 或者

let Gesture = required('@meitu/gesture');
```


##### 2.使用`import || required`直接引入;

```js
import Gesture from './gesture.min';

new Gesture( options );

```

##### 3.直接通过`script`标签引入;

```js
<script src="gesture.min.js"></script>

new Gesture( options );
```

#### 使用:

由于对单个元素的操作中，存在着一些无法避免的问题，例如双指操纵元素时单指先离开；单指先触发后，又变换成双指操作；一个在元素上，一个在元素外等等，这些问题会影响到基础手指的确定，会导致操作过程中元素可能出现 **跳动** ；

因此更加推荐 **使用委托** 的方式进行操作元素，能有效的 **避免上述问题**；

如果直接绑定到元素上，则需注意对 **每个需要操作的元素单独创建一个实例**；

```js
new Gesture({

    // 事件监听元素，用于监听所有事件产生；必填；

    receiver:'selector',

    // 事件操纵元素，用于反馈事件所的操作；
    // 该值为可选，如果不填，则操纵元素即为监听元素本身；

    operator:'selector',  

    // 以下开关参数均为可选，默认为关闭状态；

    drag: Boolean,

    pinch: Boolean,

    rotate: Boolean,

    // 开启时传入buttonId，关闭时直接传 false 或者 缺省；

    singlePinch: {
        // 只能传入对应按钮的 `id` 值，不需要 `#`！！！
        // 只能传入对应按钮的 `id` 值，不需要 `#`！！！
        // 只能传入对应按钮的 `id` 值，不需要 `#`！！！
        buttonId: 'id'
    },
    singleRotate: {
        buttonId: 'id'
    },

    // 事件钩子，选填；
    // 包含每个事件对应的start,move,end事件；
    event:{
        dragstart(){},
        drag(){},
        dragend(){},
        ....
    },

    // 元素操作区域的限制；
    // params:
    // false: 操作无限制；

    // true: 开启限制，参数为
    //  {x:0.5,y:0.5,maxScale:4,minScale:0.4};

    // 直接传入个限制对象
    //  {x:1,y:1,maxScale:3,minScale:0.2};

    // x:0.5 x轴可超出系数，代表着 x 轴方向可超出 operator 宽度 * 0.5;

    // 'crop': 图片铺满的裁剪模式；

    limit: Boolean or Object or 'crop';
})
```

#### 使用姿势：

```js
// 所有操作全开启状态；
new MGesture({
    receiver: 'selector',
    operator: 'selector',
    drag: true,
    pinch: true,
    rotate: true,
    singlePinch: {
        buttonId: 'js-button-id',
    },
    singleRotate: {
        buttonId: 'js-button-id',
    },
    limit: true,
});
```


#### 属性：

##### 1.`gesture.mtouch`

存放着对应的 `mtouch` 模块；

##### 2.`gesture.operator`

操作元素的`dom`节点；

##### 3.`gesture.operatorStatus`

记录着操作元素的初始化状态；

##### 4.`gesture.receiver`

接收事件的容器的`dom`节点；

##### 5.`gesture.receiverStatus`

记录着接收元素的初始化状态，包括`width,height,top,right,bottom,left`;

##### 6.`gesture.transform`

记录着操作元素当前的运动状态；



#### API：

##### 1.`switchOperator`

`gesture.switchOperator(el)`;

该方法适用于切换操作元素 `operator`,例如：

    ```js
    $('.js-el').on('tap',function(){
        $('.js-el').removeClass('active');
        $(this).addClass('active');
        gesture.switchOperator(this);
    })
    ```

##### 2.`freeze`

`gesture.freeze(Boolean)`;

该方法用于冻结手势，使其暂时失效；解冻后可继续生效；

```js
    gesture.freeze(true);
```

##### 3.`destory`

`gesture.destory()`;

该方法用于销毁事件绑定，释放内存；

```js
    gesture.destory();
```
