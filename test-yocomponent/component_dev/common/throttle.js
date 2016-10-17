/**
 * 节流阀函数
 * 接收四个参数:原函数,this绑定,间隔时间,最后间隔时间
 * 接收原函数为参数,返回一个间隔一定时间才能触发一次的新函数
 */
export default function throttle(origHandler, context, gap, endGap) {

    let lastTriggerTime;
    //这个变量用来保存当前的实参
    let args;
    //这个变量用于判断是否是首次触发
    //如果orgHandler尚未被触发过，则直接触发
    let hasTriggered = false;

    context = context || window;

    if (gap && gap < 50) {
        console.warn('throttle: 设置的间隔值过小!自动调整为50ms');
        gap = 50;
    }

    if (endGap && endGap < gap) {
        console.warn('throttle: 设置的endGap过小!自动调整为一倍gap');
        endGap = gap;
    }

    //工具函数，在context上触发orgHandler并且重置lastTriggerTime
    var trigger = function (now, trigger) {
        lastTriggerTime = now;
        trigger && origHandler.apply(context, args);
    };

    return function () {
        const now = new Date().valueOf();
        //用于监控结束时刻的定时器
        let endWatcher;

        args = Array.prototype.slice.apply(arguments);
        if (hasTriggered) {
            if (now - lastTriggerTime > gap) {
                trigger(now, gap);
            }
        }
        else {
            hasTriggered = true;
            trigger(now, gap);

            if (endGap) {
                endWatcher = setInterval(function () {
                    const now = new Date().valueOf();
                    if (now - lastTriggerTime >= endGap) {
                        trigger(now, endGap);
                        clearInterval(endWatcher);
                        hasTriggered = false;
                    }
                }, 50);
            }
        }
    }
}