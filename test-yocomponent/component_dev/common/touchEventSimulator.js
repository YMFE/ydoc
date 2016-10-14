/**
 * 使用鼠标事件模拟移动端touch事件
 * 稍有不足的地方是鼠标移出container以后无法继续触发touchmove,因为不会触发mousemove,无法模拟
 * 折中的办法是鼠标移出container范围后(监听document.body的mouseleave)触发touchcancel
 * @param container 目标容器dom,默认为document.body
 */
function touchEventSimulator(container = document.body) {
    function isMobile() {
        return navigator.userAgent.toLowerCase().search(/iphone|android|mobile/) !== -1;
    }

    function createTouchEvent(evt, name) {
        const {screenX, screenY, pageX, pageY, clientX, clientY}=evt;
        const touchEvent = document.createEvent('UIEvent');

        touchEvent.initEvent(name, true, true);
        touchEvent.touches = touchEvent.changedTouches = [{screenX, screenY, pageX, pageY, clientX, clientY}];

        return touchEvent;
    }

    let hasTrigger = false, target = null;

    if (!isMobile()) {
        document.body.addEventListener('mousedown', (evt)=> {
            if (evt.which === 1) {
                target = evt.target;
                target.dispatchEvent(createTouchEvent(evt, 'touchstart'));
                hasTrigger = true;
            }
        });

        document.body.addEventListener('mousemove', (evt)=> {
            //mousemove可能会触发文本框聚焦
            evt.preventDefault();
            if (hasTrigger) {
                target.dispatchEvent(createTouchEvent(evt, 'touchmove'));
            }
        });

        document.body.addEventListener('mouseup', (evt)=> {
            if (hasTrigger && target) {
                target.dispatchEvent(createTouchEvent(evt, 'touchend'));
                hasTrigger = false;
                target = null;
            }
        });

        document.body.addEventListener('mouseleave', (evt)=> {
            evt.preventDefault();
            hasTrigger = false;
            if (target) {
                target.dispatchEvent(createTouchEvent(evt, 'touchend'));
                target = null;
            }
        });

        const nodes = document.querySelectorAll('a,img'), len = nodes.length;
        for (let i = 0; i < len; i++) {
            nodes[i].ondragstart = evt=> {
                evt.preventDefault();
                return false;
            };
        }
    }
};

document.addEventListener('DOMContentLoaded', ()=> {
    touchEventSimulator();
});

