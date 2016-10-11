/**
 *
 * 实现了无穷模式,在数据源较大时能够提升滚动的性能并避免内存溢出
 * - 无穷模式支持给定高度(所有列表项的高度已知)和不给定高度(完全不提供列表项的高度)两种模式
 * - 给定高度的意思是并不是要求所有的列表项等高,而是需要显式地传入每个列表项的高度
 *   可以通过组件的属性itemHeight来指定每一个项的高度,这样所有的列表项会是等高的;也可以给dataSource的每一个元素指定height属性
 * - 所谓不给定高度,是指列表项的高度在渲染进浏览器之前完全未知,在这种模式下,可以支持一些特殊的业务场景例如:微博/朋友圈形式的列表
 *   这种模式下有一定的性能损耗,每次更新节点时比定高模式多一次重排(访问dom节点的offsetHeight),整体稍差于给定高度模式
 * - 实现了列表项独特的手势系统(需要考虑滚动)
 * - 实现了列表内图片的懒加载(需要用LazyImage组件替换<img/>)
 *
 * 使用列表组件实现的组件:Grouplist,Calendar,SwipeMenuList,所有使用List实现的组件,全部支持无穷模式(定高/不定高)
 */
 module.exports = {
    checkJsApi: {
        hy: (() => {
            let name2KeyMap = {},
                key2NameMap = {};
            return {
                optHandle: function(opt) {
                    opt.jsApiList = opt.jsApiList.map((item) => {
                        if (!name2KeyMap[item]) {
                            let cf = this._apis[item] && this._apis[item].hy;
                            name2KeyMap[item] = (cf && cf.key) || item;
                            key2NameMap[name2KeyMap[item]] = item;
                        }
                        return name2KeyMap[item];
                    });
                    return opt;
                },
                resHandle: (res) => {
                    let checkResult = res.data || {},
                        rs = {};
                    for (let key in checkResult) {
                        rs[key2NameMap[key]] = checkResult[key];
                    }
                    return rs;
                }
            }
        })(),
        wechat: {
            successHandle: (res) => res.checkResult
        },
        h5: {
            handle: (opt, sdk) => {
                let data = {};
                let jsApiList = opt.jsApiList || [];
                jsApiList.forEach((v) => {
                    // h5暂时不支持事件，将所有事件都置为false
                    if (/^on[^Menu]|off/.test(v)) return data[v] = false;
                    return data[v] = !!sdk.h5[v]
                });
                opt.success(data);
            }
        }
    }
};
