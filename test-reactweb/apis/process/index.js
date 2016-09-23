/**
 * @providesModule process
 * @author qianjun.yang
 */
window.process = window.process || {
    env: {
        NODE_ENV: 'production'
    },
    iosSafari: !!navigator.userAgent.match(/(iPhone|iPad)[\s\S]*(Safari)/gi),
};
module.exports = process
