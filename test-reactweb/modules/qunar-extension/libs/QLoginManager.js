/**
 * @providesModule QLoginManager
 * @author qianjun.yang
 */
/**
 * QLoginManager
 *
 * @component QLoginManager
 * @description `QLoginManager` QLoginManager的web端空实现，require("qunar-react-native").QLoginManager
 * ```
 * // 为了保持页面状态，不能走微信登陆，如果想走微信登陆，请调用以下接口，并且业务需要自己想办法保存页面状态
 * var QLoginManager = require('QLoginManager')
 * if (QLoginManager.changeWeixinAuth) QLoginManager.changeWeixinAuth(true)
 * ```
 */
var React = require('react-native')
var ReactDOM = require('ReactDOM')
var {View, Text, AppRegistry, TouchableWithoutFeedback} = React
var {utils} = AppRegistry
var StyleSheet = require('StyleSheet');
var RNLogin="RNLogin"
var loginFormEle, gid, instance, isHy = QunarAPI.sniff.qunar
var weixinAuth = false
var reset = function() {}
var flexStyle = StyleSheet.fix({
    flex: 1
})


StyleSheet.inject(`

.rn-login{
    position: fixed;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    padding:0.15rem;
    background: #fff;
    width: 95%;
    max-width: 3rem;
    margin-top: -.4rem;
    color: #19a9ba;
    font-size:0.14rem;
    border-radius: .03rem;
}
.rn-login a{
    text-decoration:none;
}
.rn-login-btn{
    color: #fff;
    text-align: center;
    line-height: .3rem;
    width: 100%;
    display: block;
    background: #25a4bb;
    border-radius: 3px;
}
.rn-login-legend{
    text-align: center;
    padding: 0.05rem 0;
}
.rn-login-btn.disabled {
    background: #85d1db;
}
#btn-getVcode{
    display: block;
    position: absolute;
    top: 50%;
    right: 0px;
    width:.8rem;
    height: .3rem;
    -webkit-transform: translateY(-50%);
    transform: translateY(-50%);
    line-height: .3rem;
    text-align:center;
    color: #00afc7;
    border: 1px solid;
    border-radius: 0.03rem;
}
#btn-getVcode.disabled{
    color: #ccc;
}
.form-control {
    border-bottom: 1px solid #ddd;
    line-height: 0.45rem;
}
.control-label {
    width: 0.6rem;
    display: block;
    float: left;
}
.control-container {
    margin-left: 0.6rem;
    border: 0;
    position: relative;
}
.control-text {
    line-height: 1.5;
    border: 0;
    width: 1.5rem;
    color: #000;
    outline: 0;
}
.error-message{
    text-align: left;
    line-height: 0.2rem;
    color: red;
    margin: 0.1rem 0;
}
`, 'ensure');



var loginSuccess = function() {
        utils.hideContainer(null, !!"force")
    }, loginFail = function() {}
var LoginView = React.createClass({
    getDefaultProps: function(){
        return {
            style: {},
            visible: false,
        }
    },
    getInitialState: function(){
        return {
            visible: this.props.visible,
        }
    },
    close: function() {
        this.setState({
            visible: false
        })
        utils.hideContainer(gid)
    },
    render: function() {
        var {state} = this
        if (!state.visible) return null
        return (
            <View className="rn-flex" style={flexStyle}>
                <TouchableWithoutFeedback onPress={()=>this.close()}>
                    <View
                        style={{position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)'}}
                    >
                    </View>
                </TouchableWithoutFeedback>
                <div
                    ref={RNLogin}>
                </div>
            </View>
        )
    },
    componentDidMount: function() {
        var ele = ReactDOM.findDOMNode(this.refs[RNLogin])
        ele.appendChild(loginFormEle)
        // reset()
    },
    componentWillUnmount: function() {
        getById('rn-hidden').appendChild(ReactDOM.findDOMNode(this.refs[RNLogin]))
    },
})
function getById(id) {
    return document.getElementById(id)
}
function formatUserinfo(data) {
    var {username, uid, nickname, email, headMsg, userid} = data
    return {
        userName: username,
        userID: uid,
        userEmail: email, // 接口未返回
        userNickname: nickname,
        userAvatar: headMsg,
        userUserID: userid, // 接口未返回
    }
}
var forH5 = {
    getLoginInfo: function(callBack, errCallBack) {
        if (!loginFormEle) LoginManager.init()
        instance.getUserInfo(function(data) {
            if (data.data) {
                callBack && callBack(formatUserinfo(data.data))
            } else {
                errCallBack && errCallBack(data)
            }
        })
    },
    login: function(callBack, errCallBack) {
        if (!loginFormEle) LoginManager.init()
        if (weixinAuth && QunarAPI.sniff.wechat) return // 走微信登陆，则不弹出登陆框了
        gid = utils.gid()
        loginSuccess = function(data) {
            callBack && callBack(formatUserinfo(data.data))
            utils.hideContainer(gid)
        }
        loginFail = function(data) {
            errCallBack(data)
        }
        utils.render(LoginView, gid, {visible: true})
    },
    loginOut: function(callBack, errCallBack) {
        instance.logout(function(res){
             if (res.errmsg) {
                errCallBack && errCallBack(res)
             } else {
                callBack && callBack(res)
             }
        });
    },
    init: function() {
        var ele = utils.addContainer('div', {
            id: "rn-hidden",
            className: "rn-hidden",
        })
        ele.innerHTML = `
<div class="rn-login">
    <form>
        <div class="rn-login-legend"><b>登陆</b></div>
        <div class="form-control">
            <label class="control-label">手机号</label>
            <div class="control-container">
                <input class="control-text" placeholder="请输入手机号" autocomplete="off" value="" id="mobile" type="text"><a id="btn-getVcode" href="javascript:;">获取验证码</a>
            </div>
        </div>
        <div class="form-control" style="display:none" id="captcha-area">
            <img style="width:1.05rem;height:0.35rem;cursor:pointer;float:left;margin-top:0.05rem;" src="about:blank" id="captcha" alt="">
            <div class="control-container" style="margin-left:1.2rem;">
                <input type="text" class="control-text" id="captcha_input">
            </div>
        </div>
        <div class="form-control">
            <label class="control-label">验证码</label>
            <div class="control-container">
                <input type="text" placeholder="请输入验证码" class="control-text vcode" id="smscode">
            </div>
        </div>
        <div id="errmsg" class="error-message"></div>
        <a id="btn-login" class="rn-login-btn" href="javascript:;">登录</a>
    </form>
</div>`
        loginFormEle = ele.firstElementChild
        instance = ucAPI.quickLogin.create({
            origin: 'testdemo', //页面标识
            mobileInput: getById('mobile'), //手机号输入框
            syncLoginStatus: true, //登录成功后是否同步登录态到大客户端
            weixinAuth: weixinAuth,
            registerAuto:true
        });
        if (weixinAuth && QunarAPI.sniff.wechat) return // 走微信登陆，则不弹出登陆框了
        var smslocker
        function showMessage(msg) {
            var ele = getById('errmsg')
            ele.innerHTML = msg || ''
        }

        function check(value, type, name) {
            name = name || ''
            switch (type) {
                case 'mobile':return value.match(/^1[0-9]{10}$/g) ? '' : '手机号格式错误';
                default:return value.trim() ? '' : name + '不能为空';
            }
        }

        instance.on('needShowCaptcha', function() {
            getById('captcha').src = instance.getCaptchaUrl();
            getById('captcha-area').style.display = 'block'
        })
        instance.on('needHideCaptcha', function() {
            getById('captcha-area').style.display = 'none'
        })
        var smsBtn = getById('btn-getVcode'),
            captchaEle = getById('captcha')
        function sixtySec(a, forceStop) {
            var cnt=60
            clearInterval(smslocker)
            if (forceStop === 'forceStop') {
                cnt = 0
                return cb()
            }
            function cb() {
                cnt--
                if (cnt > 0) {
                    smsBtn.innerHTML =  cnt + '秒重发'
                } else {
                    smsBtn.innerHTML = '获取验证码'
                    utils.removeClass(smsBtn, 'disabled')
                    clearInterval(smslocker)
                }
            }
            smslocker = setInterval(cb, 1000)
        }
        smsBtn.onclick = function() {
            if (this.className.match(/disabled/g)) return
            var mobile = getById('mobile').value,
                captcha = getById('captcha_input').value,
                msg = check(mobile, 'mobile')
            if (captchaEle.src.indexOf('http') > -1) msg = check(captcha, '', '图片验证码')
            showMessage(msg)
            if (msg) return
            utils.addClass(smsBtn, 'disabled')
            instance.sendSMSCode({
                mobile: mobile,
                captcha: captcha,
                onsuccess: function(data) {
                    sixtySec()
                },
                onfail: function(data) {
                    showMessage(data.errmsg)
                    if (data.errmsg.indexOf('一分钟') > -1) sixtySec()
                }
            })
        }
        instance.getCaptchaUrl();
        captchaEle.onclick = function() {
            captchaEle.src = instance.getCaptchaUrl();
        }
        getById('btn-login').onclick = function() {

            var mobile = getById('mobile').value,
                captcha = getById('captcha_input').value,
                smscode = getById('smscode').value,
                msg = check(mobile, 'mobile') || check(smscode, '', '短信验证码')
            showMessage(msg)
            if (msg) return
            instance.login({
                mobile: mobile,
                smscode: smscode,
                captcha: captcha,
                onsuccess: function(data) {
                    reset()
                    loginSuccess(data)
                },
                onfail: function(data) {
                    showMessage(data.errmsg)
                    loginFail(data)
                }
            })
        }
        reset = function() {
            getById('mobile').value = ''
            getById('smscode').value = ''
            getById('captcha_input').value = ''
            sixtySec('', 'forceStop')
        }
        // getById('btn-logout').onclick = function() {
        //     instance.logout(function(res){
        //         console.log(res)
        //     });
        // }
    }
}
// for Hy
// 登陆不check了，妥妥的有
var forHy = {
    login: function(callBack, errCallBack) {
        QunarAPI.hy.login({
            shouldOpenLogin: true, // 指示是否允许弹登录界面，不允许时未登录直接返回登录失败,true=允许, false=不允许
            success: callBack,
            fail: errCallBack
        });
    },
    getLoginInfo: function(callBack, errCallBack) {
        QunarAPI.hy.login({
            shouldOpenLogin: false, // 获取登录状态
            success: callBack,
            fail: errCallBack
        });
    },
    loginOut: function(callBack, errCallBack) {
        callBack && callBack({msg: '似乎不支持'})
    }
}
var LoginManager = module.exports = isHy ? forHy : forH5
module.exports.changeWeixinAuth = function(bool) {
    weixinAuth = bool
}
