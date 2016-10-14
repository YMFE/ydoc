const ALLOWANCE = 20;
const AniCss = {
    handleData(aniObj, children) {
        return children
    },
    touchstart() {},
    touchend(aniObj) {
        const {
            touchstartLocation,
            touchendLocation,
            pageNow
        } = aniObj;
        const locatinoChange = touchstartLocation[0] - touchendLocation[0];
        const change = locatinoChange > 0 ? pageNow + 1 : pageNow - 1;
        return this._checkAni(aniObj, change);
    },
    touchmove() {},
    touchcancel() {},
    _checkAni(aniObj, num) {
        const {
            loop,
            pagesNum
        } = aniObj;
        if (!loop) {
            num < 1 ? num = 1 : '';
            num > pagesNum ? num = pagesNum : '';
        } else {
            num < 1 ? num = pagesNum : '';
            num > pagesNum ? num = 1 : '';
        }
        return num;
    },
    next(aniObj) {
        return this._checkAni(aniObj, aniObj.pageNow + 1);
    },
    arrive(aniObj, num) {
        return num;
    },
    prev(aniObj) {
        return this._checkAni(aniObj, aniObj.pageNow - 1);
    }
};

export default AniCss;
