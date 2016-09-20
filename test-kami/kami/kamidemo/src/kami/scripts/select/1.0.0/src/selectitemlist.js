
 ;(function () {

    /**
     * datasource like
     * [
     *     {vale: value, text:text}
     * ]
     */
   
    
    var SelectItemListTpl = require('./selectitemlist.string');
    var Widget = require('../../../core/1.0.0/index.js');
    var Template = require('../../../template/1.0.0/index.js');
    var $ = require('../../../util/1.0.0/index.js');



    var isBadAndroid = /Android /.test(window.navigator.appVersion) && !(/Chrome\/\d/.test(window.navigator.appVersion));
    var isBadIphone = false;
    var SelectItemList = Widget.extend({

        options: {
            
            datasource: [],
            type: 'select-item-list',
            displayCount: 5,
            curIndex: 0,
            infinite: false,
            use3d: true,
            template: SelectItemListTpl,
            onchangevalue: function (value, prevValue) {

            }
        },
        /**
         *  处理滚动事件
         * @return {[type]} [description]
         */
        renderEvent: function () {
            
            var widget = this;
            
            
            var touchStart =  function (e) {

                e.preventDefault();
                if (!widget.enable) {
                    return;
                }
                widget.isMoving = false;
                widget.prevItem = widget.getValue();
                // console.log('widget.prevItem=' + widget.getValue().value);
            
                // console.log('touchstart');
                var point = e.touches ? e.touches[0] : e;
                

                

                widget.initialte = 1;
                widget.moved = false;

                widget.distX      = 0;
                widget.distY      = 0;
                widget.directionX = 0;
                widget.directionY = 0;

                widget.y = widget._getY();
                widget.x = widget._getX();
                // widget._transitionTime();
                widget._translate(widget.x, widget.y);


                widget.startX    = widget.x;
                widget.startY    = widget.y;
                widget.absStartX = widget.x;
                widget.absStartY = widget.y;
                widget.pointX    = point.pageX;
                widget.pointY    = point.pageY;

                widget.startTime = new Date().getTime();

                widget.scrollX = false;    //滑动方向
                // alert(1)
            };
            
            var touchMove = function (e) {
                
                if (!widget.enable) {
                    return;
                }
                e.preventDefault();
                
                var point       = e.touches ? e.touches[0] : e,
                    deltaX      = point.pageX - widget.pointX,
                    deltaY      = point.pageY - widget.pointY,
                    timestamp   = new Date().getTime(),
                    newX, newY,
                    absDistX, absDistY;
                // console.log(e.touches);
                // console.log('widget.pointX:' + widget.pointX + 'widget.pointY:' + widget.pointY);
                widget.pointX     = point.pageX;
                widget.pointY     = point.pageY;
                // console.log('pointX:' + point.pageX + 'pointY:' + point.pageY);
                widget.distX      += deltaX;
                widget.distY      += deltaY;
                absDistX        = Math.abs(widget.distX);
                absDistY        = Math.abs(widget.distY);

                widget.isMoving = true;
                // console.log('endTime:' + (timestamp - widget.endTime), 'absDistY=' + absDistY);
                // We need to move at least 10 pixels for the scrolling to initiate
                if (timestamp - widget.endTime > 300 && (absDistX < 10 && absDistY < 10)) {
                    // alert(123);
                    // console.log(123)
                    widget.isMoveing = false;
                    return;
                }
                if (widget.scrollX == true) {
                    
                    return;
                }
                if (absDistX > absDistY) {
                    widget.scrollX = true;

                    return;
                }
                deltaX = 0;

                newX = widget.x + deltaX;//0
                newY = widget.y + deltaY;

                // console.log('widget.y=' + widget.y, 'newY=' + newY, 'deltaY=' + deltaY);
                widget.deltaY = deltaY;
                widget.directionY = deltaY > 0 ? -1 : deltaY < 0 ? 1 : 0;

                widget.deltaT = timestamp - widget.startTime;

                

                
                if (widget.infinite) {
                    
                    if (Math.abs(newY - widget.startY) > widget.wrapperHeight) {
                        return;
                    }
                    else {

                        widget._translate(newX, newY);
                        //[处理惯性位移]
                        // if ( timestamp - this.startTime > 300 ) {
                        //     // debugger
                        //     this.startTime = timestamp;
                        //     this.startX = this.x;
                        //     this.startY = this.y;

                        // }
                        widget.scrollItems();
                    }
                    
                    
                }
                else {
                    
                    var offset = 2 * widget.itemHeight;
                    var _newY = newY;
                    if (newY <= widget.limitOffset - offset || newY >= widget.initOffset + offset) {
                        //非infinite的情况下如果是超过最大限最小限那么直接return
                        _newY = (newY - (deltaY * 9 / 9));
                        // return;//return后导致android机器出现 touchend不执行的问题
                    }
                    widget._translate(newX, _newY);
                    widget.slideItems(); 

                    
                }
                
                
            };
            var touchEnd = function (e) {
                
                if (!widget.enable) {
                    return;
                }

                e.preventDefault();
                // debugger
                var point = e.changedTouches ? e.changedTouches[0] : e,
                    momentumX,
                    momentumY,
                    duration = new Date().getTime() - widget.startTime,
                    newX = Math.round(widget.x),
                    newY = Math.round(widget.y),
                    distanceX = Math.abs(newX - widget.startX),
                    distanceY = Math.abs(newY - widget.startY),
                    time = 0,
                    easing = '';

                widget.endTime = new Date().getTime();

                //[处理惯性位移]
                // var speed = widget.deltaY / widget.deltaT;
                // var B = 0.004;
                // // console.log('时间:' + duration);
                // // console.log('速度:' + speed);
                // // console.log('偏移:' + distanceY + '瞬时偏移' + widget.deltaY);
                // var inertiaY = Math.floor(Math.pow(speed, 2) / 2 * B);
                // if (speed < 0) {
                //     inertiaY *= -1;
                // }

                // // console.log('惯性位移' + inertiaY);
                // // console.log('newY' + newY);
                // newY += inertiaY;



                
                
                // console.log('touchEnd');

                
                if (!widget.isMoving) { //表示用户未滚动过， 直接点击
                    
                    var prevValue = widget.getValue();
                    var roleName = e.target.getAttribute('data-role');
                    
                    if (! ('list-item' ===  roleName)) {
                        //not 
                    }
                    else {
                        if (!e.target.classList.contains(widget.get('disableCls'))) {
                            var newValue = e.target.getAttribute('value');

                            if (prevValue.value != newValue) {
                                widget.setValue(e.target.getAttribute('value'));

                            }
                        }
                        
                    }
                    
                }
                else  {
                    if (widget.infinite) {
                        var remainY = (newY % widget.itemHeight);
                        if (remainY != 0) {
                            if (remainY <= Math.floor(widget.itemHeight / 2)) {
                                newY = newY - remainY;
                            }
                            else {
                                newY = newY - remainY + widget.itemHeight;
                            }
                        }
                        widget._translate(newX, newY);  // ensures that the last position is rounded
                        widget.scrollItems();
                    }
                    else {
                        
                        if (newY <= widget.limitOffset) {
                            newY = widget.limitOffset;
                        }
                        else if (newY >= widget.initOffset) {
                            newY = widget.initOffset;
                        }
                        else {
                            var remainY = (newY % widget.itemHeight);
                            if (remainY != 0) {
                                if (remainY <= Math.floor(widget.itemHeight / 2)) {
                                    newY = newY - remainY;
                                }
                                else {
                                    newY = newY - remainY + widget.itemHeight;
                                }
                            }
                        }
                        widget._scrollTo(newX, newY);
                        widget.slideItems();
                    }

                    widget.item = widget.getValue();
                    
                    if (widget.item.value !== widget.prevItem.value) {
                        
                        widget.trigger('changevalue', widget.item, widget.prevItem);
                        
                    }
                }
                
            };
            

            this._start = touchStart;
            this._move = touchMove;
            this._end = touchEnd;

            this.container.addEventListener('touchstart', this._start);
            this.container.addEventListener('touchmove', this._move);
            this.container.addEventListener('touchend', this._end);
            this.container.addEventListener('touchcancel', this._end);
        },
        

        _scrollTo: function (x, y, time, easing) {
            
            var style = 'cubic-bezier(0.1, 0.57, 0.1, 1)';
           
            this._transitionTimingFunction(style);
            this._transitionTime(time);
            this._translate(x, y);
        },
        _getOffset: function (el) {
            var left = -el.offsetLeft,
                top = -el.offsetTop;

            // jshint -W084
            while (el = el.offsetParent) {
                left -= el.offsetLeft;
                top -= el.offsetTop;
            }
            // jshint +W084

            return {
                left: left,
                top: top
            };
        },

        _transitionTime: function (time) {
            var defaultTime = 0;
            if (!this.infinite) {
                defaultTime = 0;
            }
            
            time = time || defaultTime;
            this.itemListContainer.style['-webkit-transition-duration'] = time + 'ms';
            // this.itemListContainer.style['transition-duration'] = time + 'ms';
            
            if (!time && isBadAndroid) {
                this.itemListContainer.style['-webkit-transition-duration'] = '0.001s';
            }



        },
        _translate: function (x, y) {
            var str = 'translateY(' + y + 'px )';
            if (this.get('use3d')) {
                str += this.translatez;
            }
            this.itemListContainer.style['-webkit-transform'] = str;
            this.x = 0;
            this.y = y;
            

        },
        _transitionTimingFunction: function (easing) {
            this.itemListContainer.style['-webkit-transition-timing-function'] = easing;
            // this.itemListContainer.style['transition-timing-function'] = easing;

        },
        _getX: function (el) {
            return 0;
        },
        _setX: function (el, x) {
            // this.x = 0;
            return;
        },
        _setY: function (el, y) {
            if (typeof el === 'string' || typeof el === 'number') {
                y = el;
                el  = this.itemListContainer;
            }

            var str = 'translateY(' + y + 'px )';
            if (this.get('use3d')) {
                str += this.translatez;
            }
            // el.style['-webkit-transform'] = 'translate3d(0, ' + y + 'px, 0)';
            // el.style['transform'] = 'translate3d(0, ' + y + 'px, 0)';
            el.style['-webkit-transform'] = str;
            // el.style['transform'] = str;
            // el.style['-webkit-transform'] = 'translateY(' + y + 'px) translateZ(0px)';
            // el.style['transform'] = 'translateY(' + y + 'px) translateZ(0px)';
            // this.y = y;
        },
        _getY: function (el) {
            el = el || this.itemListContainer;
            // debugger
            var transform = el.style['transform'] || el.style['-webkit-transform'];
            // var match = transform.match(/\s([^,]*)px,/);
            var match = transform.match(/translateY\(([\-0-9]+)px\)/);
            var y = 0;
            if (match && match.length > 1) {
                y = match[1];
            }
            y = parseInt(y, 10);
            return y;
        },
        /**
         * 处理数据
         * @param  {[type]} index [description]
         * @return {[type]}       [description]
         */
        _getData: function (index) {
            index = index || this.curIndex;
            
            
            
            var ds = this.datasource;
            var list = [];
            var size = this.cacheSize;
            if (!this.infinite) {
                size = this.datasource.length;
            }
            
            if (index >= ds.length || index < 0) {
                return [];
            }
            else {
                
                for (var i = 0;i < size; i++) {
                    if (this.infinite) {
                        list.push({value: ' ', text: ' '});    
                    }
                    else {
                        list.push({value: this.datasource[i].value, text: this.datasource[i].text});
                    }
                    
                }
                return list;
            }
        },
        /**
         * 如果不是infinite的形式，那么采用这种方式来进行滚动
         * 
         * @return {[type]} [description]
         */
        slideItems: function () {
            
            var deltaY = this.initOffset - this.y;
            var curIndex = Math.floor(deltaY / this.itemHeight);
            this.curIndex = curIndex;
            for (var i = 0;i<this.itemList.length;i++) {
                $(this.itemList[i]).removeClass('cur-select');
            }
            if (this.curIndex >= 0 && this.curIndex < this.itemList.length) {
                $(this.itemList[i]).addClass('cur-select');
            }
            

        },
        /**
         * 对ios特别版本进行hack
         */
        _addBadIphone: function () {
            setTimeout(function () {}, 0);
        },
        /**
         * infinite 为true的 下拉框的滚动方法
         * 
         * @return {[type]} [description]
         */
        scrollItems: function () {

            
            /**
             * 此处不考虑container的小大和给的总高度不一致的情况
             * @type {[type]}
             */
            //如果滚动没有超过itemHeight，那么是0；
            var curY = this.y;
            curY = parseInt(curY, 10);
            var absY = Math.abs(curY);

            

            if (isBadIphone) {
                // console.log('bad iphone');
                // alert('bad iphone')
                this._addBadIphone(); 
            }
            
            // 1为滚动向上， -1 为向下
            var direction = 1;

            if (curY > 0) {
                direction = -1;
            }
            else {
                direction = 1;
            }
            
            
            var size = this.cacheSize;

            var scrolledItemCount = Math.floor(absY / this.itemHeight);

            

            var curIndex = direction * scrolledItemCount;

            

            this.curIndex = curIndex;


            var tIndexArr = [];
            var halfLength = (size - 1) / 2;
            var i = null;

            // var degArr = [];
            // var degItem = 20;
            // var skew = [];
            // var leftArr = [];
            for (i = halfLength; i >= 0; i--) {
                tIndexArr.push(curIndex - i);
                // degArr.push(degItem * i );
                // skew.push(-i);
                // leftArr.push(i);
            }
            
            for (i = 1; i <= halfLength; i++) {
                tIndexArr.push(curIndex + i);
                
                // degArr.push(degItem * i );
                // skew.push(i);
                // leftArr.push(-i);
            }
            
            //console.log('this.y='+ this.y + ' direction=' +  direction +' scrolledItemCount='+ scrolledItemCount +' curIndex='+ curIndex + ' tIndexArr=' + tIndexArr);

            for (i = 0; i < tIndexArr.length; i++) {

                var domIndex = tIndexArr[i] % size;
                if (domIndex < 0) {
                    domIndex = domIndex + size;
                }
                var dom = this.itemList[domIndex];



                var itemIndex = tIndexArr[i] % (this.datasource.length);
                if (itemIndex < 0) {
                    itemIndex += this.datasource.length;
                }
                var itemData = this.datasource[itemIndex];
                var halfDisplayLength = (this.displayCount - 1) / 2;
                var top = (tIndexArr[i] + halfDisplayLength) * this.itemHeight;
                

                var str = 'translateX(0px) translateY({{top}}px)';
                str = str.replace('{{top}}', top);
                str += this.translatez;
                // console.log(i, halfLength + 1, itemData.text);
                if (i == (halfLength)) {
                    $(dom).removeClass('cur-select');
                }
                else {
                    $(dom).removeClass('cur-select');
                }

                // debugger
                dom.style['-webkit-transform'] = str;


                // if (i==1) {
                //     dom.style['-webkit-mask-image'] = '-webkit-gradient(linear,left top,left bottom,from(rgba(255,255,255,0)),to(rgba(255,255,255,1)))';
                // }
                // else if (i == 5) {
                //     dom.style['-webkit-mask-image'] = '-webkit-gradient(linear,left bottom,left top,from(rgba(255,255,255,0)),to(rgba(255,255,255,1)))';
                // }
                // else {
                //     dom.style['-webkit-mask-image'] = '';
                // }

                // this._setY(dom, top);
            
                
                dom.innerHTML = itemData.text || itemData;
                dom.setAttribute('value', itemData.value == null ? itemData : itemData.value);
                // dom.style.display = 'block';
            }
            tIndexArr.length = 0;


        },
        
        init: function () {

            /**
             * 初始化好数据
             * @type {[type]}
             */
            
            var ds = this.get('datasource') || [];
            
            this.datasource = ds || [];
            this.displayCount = parseInt(this.get('displayCount'), 10);
            this.lineTpl = this.get('lineTpl');
            this.infinite = this.get('infinite');


            
            //displayCount 超过数据的个数，默认设置为数据总个数
            if (ds.length  - this.displayCount < 2) {
                // this.displayCount = ds.length;
                // this.set('displayCount', this.displayCount);
                this.infinite = false;
                this.cacheSize = this.displayCount;
                this.curIndex = 0;
                return;
                
                
            }
            //如果displayCount为偶数，那么先+1
            if (this.displayCount % 2 === 0) {
                this.displayCount++;
                this.set('displayCount', this.displayCount);
            }
            /*如果是设置的displayCount为偶数，或者this.displayCount的个数不够滚动，那么设置this.infinite为false*/
            if (this.displayCount > ds.length) {
                if (this.infinite) {
                    this.displayCount = ds.length;
                    this.set('displayCount', this.displayCount);
                    this.infinite = false;
                    console.log('displayCount is not enough ,so use limit slide automatically!');    
                }
                
            }

            this.cacheSize = this.displayCount;
            if (this.displayCount + 2 <= ds.length) {

                this.cacheSize = this.displayCount + 2;
            }
            
            this.curIndex = 0;
            


        },
        setValue: function (value) {
            // console.log('setValue 了');
            var prevItem = this.getValue();
            var indexOfValue = this._getIndexByValue(value);
            this.curIndex = indexOfValue % this.datasource.length;
            var nowItem = null;
            /**
             * 如果是infinite 的话需要不同的处理方式
             */
             
            if (this.infinite) {
                
                this._translate(0, -1 * this.curIndex * this.itemHeight);

                nowItem = this.getValue();
                
                this.scrollItems();
                
            }
            else  {
                this._translate(0, this.initOffset - 1 * this.curIndex * this.itemHeight);
                nowItem = this.getValue();
                this.slideItems();
            }
            this.trigger('changevalue', nowItem, prevItem);
            

        },
        getValue: function () {
            var index = this.curIndex;
            index = index % this.datasource.length;
            if (index < 0) {
                index += this.datasource.length;
            }
            return this.datasource[index];
        },
        _getIndexByValue: function (value) {
            var widget = this;
            var ds = widget.get('datasource');
            var curIndex = null;
            ds.forEach(function (item, index) {
                var v = item.value == null ? item : item.value;
                if (v == value) {
                    curIndex = index;
                    return false;
                }
            });
            return curIndex;
        },
        /**
         * 重绘组件，重新init,然后调用自身的渲染
         * @param  {[type]} ds [description]
         * @return {[type]}    [description]
         */
        repaint: function (ds) {
            // this.setDataSource(ds);
            this.init();
            this.render();
        },
        /**
         * 设置数据源并且重绘组件
         * @param {[type]} ds [description]
         */
        setDataSource: function (ds) {
            
            this.set('datasource', ds);
            this.datasource = ds;
            var list = $(this.container).find('[data-role=list-wrap]');
            list.remove();
            this.repaint();
        },

        _getElementHtml: function (data) {
            data = data || this.datasource;
            
            // debugger
            var html = Template(this.get('template') || SelectItemListTpl, {
                list: data,
                uiClass: this.getClassName(),
                itemClass: this.getClassName('item'),
                listClass: this.getClassName('list')
            });
            
            var firstElement = null;
            // debugger
            if (this.container.children.length > 0) {
                firstElement = this.container.children[0];
            }
            if (firstElement != null) {
                this.container.insertAdjacentHTML('afterBegin', html);
            }
            else {
                this.container.innerHTML = html;
            }
            
        },
        render: function () {
            
            this.container = this.container.length ? this.container[0] : this.container;

            var ds = this._getData();
            this._getElementHtml(ds);
            
            this._initProp();
            this._initUi();



            var value = this.get('value');
            if (value != null) {
                this.setValue(value);
            }
            if (!this.hasRenderEvent) {
                this.renderEvent();
                this.hasRenderEvent = true;    
            }
            
        },
        _initUi: function () {
            // debugger
            if (this.infinite) {
                this._transitionTime();
                this.scrollItems();
            }
            else {
                this._translate(0, this.initOffset);

                for (var i = 0; i < this.itemList.length; i++) {
                    var item = this.itemList[i];
                    item.style['position'] = 'static';
                }
                this.slideItems();
            }
            
            this.container.style['overflow'] = 'hidden';
        },
        _initProp: function () {
            
            this.itemList = this.container.querySelectorAll('[data-role=list-item]');

            
            
            var item = this.itemList.length > 0 ? this.itemList[0] : null;
            
            this.wrapperHeight = this.container.clientHeight;
            


            this.itemHeight = item ? item.offsetHeight : 0;
            this.itemLength = this.itemList.length;
            
            if (this.itemHeight <= 0) {
                throw new Error(item + '的高度不能为0，请确保组件的容器已经渲染到文档中');
            }
            this.itemListContainer = this.container.querySelector('[data-role=list]');
            this.containerHeight = this.get('height') || this.itemHeight * this.itemLength;
            

            //如果容器的高度比数据的渲染后的高度高，那么直接也直接采用滑动的方式,将infinite设置为false
            // if (this.containerHeight < this.itemListContainer.offsetHeight) {
            //     this.infinite = false;
            // }
            if (!this.infinite) {
                
                this.initOffset = Math.floor(this.displayCount / 2) * this.itemHeight;
                this.limitOffset = this.initOffset - this.itemHeight * (this.itemLength - 1);
            }
            
            this.enable = !!!this.get('disable');
            // console.log('this.enable = ' + this.enable);
            this.x = 0;
            this.y = 0;
            this.endTime = 0;
            this.directionX = 0;
            this.directionY = 0;

            this.translatez = 'translateZ(0px)';
            // console.log(this.itemHeight);

        },
        destroy: function () {
            
            this.container.removeEventListener('touchstart', this._start);
            
            this.container.removeEventListener('touchmove', this._move);
            this.container.removeEventListener('touchend', this._end);

            this.container.innerHTML = '';

            SelectItemList.superClass.destroy.call(this);
        }
    });
    if (typeof module != 'undefined' && module.exports) {
        module.exports = SelectItemList;
    }
}());