/* ================================== 全局配置 ================================== */
var Config = {
    type: 'touch',        // 类型
    indexView: 'index',   // 默认的首屏 View
    animate: TRUE,        // 是否动画
    defaultAnimate: 'moveEnter',   // 默认的动画
    autoInit: TRUE,       // 是否自动初始化视图
    hashRouter: TRUE,     // 是否开启 hash router
    hashSupport: {
        all: TRUE,        // 是否默认全部
        exist: [],        // 白名单
        except: [],       // 黑名单
        usePath: FALSE
    },
    jsonParam: FALSE,     // 是否采用 json 形式参数
    customRoot: TRUE,     // 是否使用自定义的 Root
    preventMove: FALSE,    // 是否阻止 touchMove 事件
    appRoot: NULL,        // Root 节点
    screen: {
        rotate: FALSE,    // 是否支持屏幕旋转
        autoResize: TRUE  // 自动缩放
    },
    root: {               // Root 节点位置和大小配置
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
    },
    logLevel: 1          // 日志等级
};
