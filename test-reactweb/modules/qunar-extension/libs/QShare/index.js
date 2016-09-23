/**
 * @providesModule QShare
 */
/**
 * 分享
 *
 * @component QShare
 * @description `QShare` QShare的web端实现，require("qunar-react-native").QShare
 */



'use strict';

let React = require('react-native')
let {View, Text, AppRegistry, Component ,StyleSheet, TouchableWithoutFeedback, Image, Dimensions} = React
let {utils} = AppRegistry
let ReactDOM = require('ReactDOM')
let Popover = require('UPopover')


StyleSheet.inject(`
   .share-sinaWeibo{
        background-position:0rem 0;
   }
   .share-tencentWeibo{
        background-position:-0.42rem 0;
   }
  .share-QQZone{
        background-position:-0.84rem 0;
   }
   .share-QQFriend{
        background-position:-1.26rem 0;
   }
   .qrcode-view{
        position: fixed;
        top: 50%;
        left: 50%;
        margin-top: -0.8rem;
        margin-left: -0.8rem;
        width:1.6rem;
        height:1.6rem;
    }
    `
);

const WIDTH = Dimensions.get('window').width;
const ICONWIDTH = 42;

const styles = StyleSheet.create({
    popover:{
        height:130,
        bottom:0,
        left:0,
        right:0,
        borderRadius:0,
        backGround:'#f4f4f4',
        flexDirection:'column',

    },
    shareView:{
        flexDirection: 'row',
        flexWrap: 'wrap',
        height:90,
        paddingTop:12,
    },
    shareIcon:{
        backgroundImage:'url("//s.qunarzz.com/react-web/images/share.png")',
        backgroundSize: 'auto 0.42rem',
        backgroundRepeat:'no-repeat',
        width: 42,
        height: 60,
        paddingTop: 48,
        alignItems: 'center',
        justifyContent: 'center',
        textDecoration: 'none',
        marginHorizontal: ((WIDTH-4)/4-ICONWIDTH)/2,
        boxSizing:'border-box',

    },
    shareIconText:{
        color: '#333',
        fontSize: 12,
        marginHorizontal: -((WIDTH-4)/4-ICONWIDTH)/2,
    },
    cancelButton:{
        height:40,
        borderTopWidth:1,
        borderTopStyle:'solid',
        borderTopColor:'#ccc',
        alignItems:'center',
        justifyContent:'center',
    },
    cancelButtonText:{
        color:'#1ba9ba',
    },
    
})


const TEMPLATES = {
    QQZone: 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url={{LINK}}&title={{TITLE}}&desc={{DESC}}&summary={{DESC}}&site={{LINK}}',
    QQFriend: 'http://connect.qq.com/widget/shareqq/index.html?url={{LINK}}&title={{TITLE}}&source={{LINK}}&desc={{DESC}}&pics={{IMGURL}}',
    tencentWeibo: 'http://share.v.t.qq.com/index.php?c=share&a=index&title={{TITLE}}&url={{LINK}}&pic={{IMGURL}}',
    sinaWeibo: 'http://service.weibo.com/share/share.php?url={{LINK}}&title={{TITLE}}&pic={{IMGURL}}&appkey={{WEIBOKEY}}',
};

const NAME = {
   QQZone: 'QQ空间',
   QQFriend:'QQ好友',
   tencentWeibo:'腾讯微博',
   sinaWeibo:'新浪微博',
}

const SITE = ['sinaWeibo', 'tencentWeibo',  'QQZone', 'QQFriend'];


class QShareComponent extends Component {
    constructor(props) {
        super(props);
        this.templates = Object.assign({},TEMPLATES);
        this.initTemplates(this.props.options)      
    }
    componentWillReceiveProps(nextProps){
       this.initTemplates(this.props.options)  
    }
    componentWillUnmount(nextProps){
       // console.log(1); 
    }
    initTemplates(options){
        let config = {
            link: options.com.link, 
            title: options.com.title,
            desc: options.com.desc, 
            imgUrl: options.com.imgUrl,           
        };
        this.sites = [];
        if(options.types){
            options.types.forEach((item)=>{
                if(SITE.indexOf(item) != -1 && this.sites.indexOf(item) == -1){
                    this.sites.push(item);
                }
            })
        }else{
            this.sites = SITE;
        }
        this.sites.forEach((name)=>{
            let data = Object.assign({},config,options[name])
            let info = this.makeUrl(name,data)
            if (info) {
                this.templates[name] = info
            }
        })
    }

    makeUrl(name, data){
        return this.templates[name] && this.templates[name].replace(/\{\{(\w*)\}\}/g, function(m, key) {
            let nameKey = key.toLowerCase();
            (nameKey == 'imgurl') && (nameKey = 'imgUrl');
            return encodeURIComponent(data[nameKey] || '');
        });
    }

    goTo(url){
      window.open(url);
    }

    render(){
        let shareContent = this.sites.map((name)=>{
            return this.templates[name] ? (
                <TouchableWithoutFeedback  onPress={this.goTo.bind(this,this.templates[name])}>
                    <View style={styles.shareIcon} className={'share-'+name}>
                        <Text style={styles.shareIconText}>{NAME[name]}</Text>
                    </View>
                </TouchableWithoutFeedback>
            ) : null
        });

        let content = (
            <View>
                <View style={styles.shareView} ref='shareView'>         
                    {shareContent}
                </View>
                <TouchableWithoutFeedback  onPress={this.props.onClose.bind(this)}>
                    <View style={styles.cancelButton}>
                        <Text style={styles.cancelButtonText}>取消</Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        )
        return(
            <Popover 
                visible={true} 
                style={styles.popover} 
                initial={0} 
                onClose = {this.props.onClose.bind(this)}
                content={content}
            />

        )
    }
} 



const shareForHy = {
    wechatTimeline:'onMenuShareTimeline',
    wechatFriends:'onMenuShareAppMessage',
    sinaWeibo:'onMenuShareWeiboApp',      
    sms:'onMenuShareSMS',
    mail:'onMenuShareEmail',             
}


module.exports = {
    wechatTimeline:'wechatTimeline',
    wechatFriends:'wechatFriends',
    sinaWeibo:'sinaWeibo',   
    tencentWeibo:'tencentWeibo',     
    sms:'sms',
    mail:'mail',             
    qunarFriend:'qunarFriend',
    wechatFav:'wechatFav',       
    QQZone:'QQZone',          
    QQFriend:'QQFriend',        
    QQFav:'QQFav', 
    /**
     * @method doShare
     * @type function
     * @param {options} options 分享参数
     * @param {function} successCallback 成功回调
     * @param {function} failCallback 失败回调
     * @description 根据 QShareParam 呼出分享的dialog，用户分享成功走callBack回调，回调的数据中包含了用户分享的类型，分享失败走errCallBack 
     *
     * 其中 options 的数据结构如下
     *  
     * **注意:** 
     */
    doShare(options,successCallback,failureCallback){
        QunarAPI.checkJsApi({
            jsApiList: ['onMenuShare'],
            success(res){        
                if(res.onMenuShare || (res.onMenuShare && res.checkResult.onMenuShare)){
                    QunarAPI.onMenuShare({
                        title: options.com.title, 
                        link: options.com.link, 
                        desc: options.com.desc, 
                        imgUrl: options.com.imgUrl,
                    });
                    for(let i in options){
                        if(shareForHy[i]){
                            QunarAPI[shareForHy[i]]({
                                title: options[i].title || options.com.title, 
                                link: options[i].link || options.com.link, 
                                desc: options[i].desc || options.com.desc, 
                                imgUrl: options[i].imgUrl || options.com.imgUrl,
                            })
                            
                        }
                    }
                    QunarAPI.hy.showShareItems({
                        success(res) {
                            successCallback && successCallback(res)
                        },
                        fail(res){
                            failureCallback && failureCallback(res)
                        }
                    });
                    
                }else{
                    let gid = utils.gid();
                    utils.render(<QShareComponent
                        options = {options}
                        onClose = {(event) => { utils.hideContainer(gid)}} 
                    />, gid) 
                }
            }
        });

        
    }
}






