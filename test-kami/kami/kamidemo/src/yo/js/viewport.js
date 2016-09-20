(function () {

    var win = window,
        doc = win.document,
        docEl = doc.documentElement,
        ua = win.navigator.userAgent,
        metaA = docEl.querySelector('meta[name="viewport"]'),
        isIOS = ua.match(/iphone/gi),
        scale, dpr;

    if (isIOS) {

        dpr = win.devicePixelRatio;
        dpr = dpr >= 3 ? 3 : dpr >= 2 ? 2 : 1;
        scale = (1 / dpr).toFixed(2);

        docEl.setAttribute('data-dpr', dpr);
        docEl.setAttribute('ios', 'true');

        if (!metaA) {
            metaA = doc.createElement('meta');
        }

        metaA.setAttribute('name', 'viewport');
        metaA.setAttribute('content', 'initial-scale=' + scale + ', maximum-scale=' + scale + ', minimum-scale=' + scale + ', user-scalable=no');

        if (!metaA) {
            if (docEl.firstElementChild) {
                docEl.firstElementChild.appendChild(metaA);
            } else {
                var div = doc.createElement("div");
                div.appendChild(metaA);
                doc.write(div.innerHTML);
            }
        }

        win.dpr = dpr;
    }
})();
