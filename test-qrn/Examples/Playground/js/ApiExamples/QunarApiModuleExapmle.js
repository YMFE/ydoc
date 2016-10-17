// -*- mode: web; -*-

'use strict';

import React, {QStatusBar,QHotDogNetWork,UELog,StyleSheet, Text, TouchableHighlight,NativeModules, View, Image, Component} from 'qunar-react-native';
var QRCTPhotoManager = NativeModules.QRCTPhotoManager;
var SchemeManager = NativeModules.QRCTJumpHandleManager;
var ABTestManager = NativeModules.QRCTABTest;
var StorageManager = NativeModules.StorageManager;
var QRCTQpInfoManager = NativeModules.QRCTQpInfoManager;
var QAV = NativeModules.QAV;
var QShareManager = NativeModules.QShareManager;
var QRCTDeviceInfo=NativeModules.QRCTDeviceInfo;

const styles = StyleSheet.create({
    wrapper: {
        borderRadius: 5,
        marginBottom: 5,
    },
    button: {
        backgroundColor: '#1ba9ba',
        padding: 10,
        color:'#1ba9ba',
    },
    text: {
        padding: 10,
    }
});


class QunarApiExample extends Component {
    constructor(props) {
        super(props);
        this.state = {
            threeButtonValue: 'none',
            tooManyButtonValue: 'none',
            imageUrl: '',
        }
    }

    getConsoleButton(arr, stateKey) {
        return arr.map(key => {
            return {
                text: key,
                onPress: () => this.setState({
                    [stateKey]: key
                })
            }
        });
    }

    render() {
        return (
            <View>
                <TouchableHighlight
                    style={styles.wrapper}
                    onPress={() => UELog.log(['sss','ddd'])}>
                    <View style={styles.button}>
                        <Text>Uelog.log()</Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight
                    style={styles.wrapper}
                    onPress={() => UELog.logOrigin('llllll')}>
                    <View style={styles.button}>
                        <Text>Uelog.logOrigin()</Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight
                    style={styles.wrapper}
                    onPress={() => this.sendScheme()}>
                    <View style={styles.button}>
                        <Text>sendScheme()</Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight
                    style={styles.wrapper}
                    onPress={() => this.sendABTest()}>
                    <View style={styles.button}>
                        <Text>ABTest()</Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight
                    style={styles.wrapper}
                    onPress={() => this.postRequest()}>
                    <View style={styles.button}>
                        <Text>QHotDogNetWork.postRequest()</Text>
                    </View>
                </TouchableHighlight>

                <TouchableHighlight
                    style={styles.wrapper}
                    onPress={() => this.showError()}>
                    <View style={styles.button}>
                        <Text>showError()</Text>
                    </View>
                </TouchableHighlight>

                <TouchableHighlight
                    style={styles.wrapper}
                    onPress={() => this.share()}>
                    <View style={styles.button}>
                        <Text>share()</Text>
                    </View>
                </TouchableHighlight>

                <TouchableHighlight
                    style={styles.wrapper}
                    onPress={() => this.postRequest2()}>
                    <View style={styles.button}>
                        <Text>QHotDogNetWork.postRequest2()</Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight
                    style={styles.wrapper}
                    onPress={() => this.postRequest3()}>
                    <View style={styles.button}>
                        <Text>QHotDogNetWork.postRequest3()</Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight
                    style={styles.wrapper}
                    onPress={() => this.postRequest4()}>
                    <View style={styles.button}>
                        <Text>QHotDogNetWork.postRequest4()</Text>
                    </View>
                </TouchableHighlight>

                <TouchableHighlight
                    style={styles.wrapper}
                    onPress={() => this.postRequestTrain()}>
                    <View style={styles.button}>
                        <Text>QHotDogNetWork.postRequestTrain()</Text>
                    </View>
                </TouchableHighlight>

                <TouchableHighlight
                    style={styles.wrapper}
                    onPress={() => this.takePhoto()}>
                    <View style={styles.button}>
                        <Text>takePhoto</Text>
                    </View>
                </TouchableHighlight>


                <TouchableHighlight
                    style={styles.wrapper}
                    onPress={() => this.saveData()}>
                    <View style={styles.button}>
                        <Text>StorageManager.saveData()</Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight
                    style={styles.wrapper}
                    onPress={() => this.getData()}>
                    <View style={styles.button}>
                        <Text>StorageManager.getData()</Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight
                    style={styles.wrapper}
                    onPress={() => this.removeData()}>
                    <View style={styles.button}>
                        <Text>StorageManager.removeData()</Text>
                    </View>
                </TouchableHighlight>

                <TouchableHighlight
                    style={styles.wrapper}
                    onPress={() => this.abTestInfo()}>
                    <View style={styles.button}>
                        <Text>abTestInfo</Text>
                    </View>
                </TouchableHighlight>

                <TouchableHighlight
                    style={styles.wrapper}
                    onPress={() => this.getQpInfo()}>
                    <View style={styles.button}>
                        <Text>getQpInfo</Text>
                    </View>
                </TouchableHighlight>


                <TouchableHighlight
                    style={styles.wrapper}
                    onPress={() => this.qavSend()}>
                    <View style={styles.button}>
                        <Text>qavSend</Text>
                    </View>
                </TouchableHighlight>


                <TouchableHighlight
                    style={styles.wrapper}
                    onPress={() => this.qavPageToPage()}>
                    <View style={styles.button}>
                        <Text>qavPageToPage</Text>
                    </View>
                </TouchableHighlight>

                <TouchableHighlight
                    style={styles.wrapper}
                    onPress={() => this.fetchData()}>
                    <View style={styles.button}>
                        <Text>fetchData</Text>
                    </View>
                </TouchableHighlight>

                <TouchableHighlight
                    style={styles.wrapper}
                    onPress={() => this.qavinfo()}>
                    <View style={styles.button}>
                        <Text>qavinfo</Text>
                    </View>
                </TouchableHighlight>

                <TouchableHighlight
                    style={styles.wrapper}
                    onPress={() => this.deviceInfo()}>
                    <View style={styles.button}>
                        <Text>deviceInfo</Text>
                    </View>
                </TouchableHighlight>

                <TouchableHighlight
                    style={styles.wrapper}
                    onPress={() => QStatusBar.setTranslucent(false,(success)=>{console.log(success);},(fail)=>{console.log(fail);})}>
                    <View style={styles.button}>
                        <Text>setTranslucent(false)</Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight
                    style={styles.wrapper}
                    onPress={() => QStatusBar.setColor('#7FFFD4',true,(success)=>{console.log(success);},(fail)=>{console.log(fail);})}>
                    <View style={styles.button}>
                        <Text>setColor(true)</Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight
                    style={styles.wrapper}
                    onPress={() => QStatusBar.setColor('#8A2BE2',false,(success)=>{console.log(success);},(fail)=>{console.log(fail);})}>
                    <View style={styles.button}>
                        <Text>setColor(false)</Text>
                    </View>
                </TouchableHighlight>
                {
                  this.state.imageUrl != '' ? <Image style={{width: 400, height: 400}} source={{uri: this.state.imageUrl}}/> : null
                }
            </View>
        );
    }




deviceInfo(){
  console.log("version:"+QRCTDeviceInfo.qrn_version);
}

fetchData() {
    fetch('http://raw.githubusercontent.com/facebook/react-native/master/docs/MoviesExample.json',
    {headers:{'User-Agent':'android10010',}})
      .then((response) => {console.log("response:");})
      .then((responseData) => {
             console.log("responseDate:");
      })
      .done();
  }

    qavPageToPage(){
      QAV.pageToPage({from:'PageA',to:'PageB'});
    }

    qavinfo(){
       QAV.testQav({id:100});
    }

    showError(){
      throw new error("ll");
    }

        qavSend(){
          QAV.send({type:'avtype',id:'avid',xpath:'avxpath',text:'avtext'});
        }

        getQpInfo(){
          QRCTQpInfoManager.getQpInfo('bnbrn',(success)=>{console.log("success:"+success.version);},(fail)=>{console.log('fail');})
        }


    share(){
      QShareManager.doShare(
      [{
               type:'QQFriend',
               title: 'qunar大放送',
               desc: '优惠券来了~',
               link: 'www.qunar.com',
               imgUrl: 'http://img1.qunarzz.com/p/tts1/1602/b0/71dc30e564657f7.jpg_r_390x260x90_65929027.jpg'
       },
       {
                      type:'QQZone',
                      title: 'qunar大放送',
                      desc: '优惠券来了~',
                      link: 'www.qunar.com',
                      imgUrl: 'http://img1.qunarzz.com/p/tts1/1602/b0/71dc30e564657f7.jpg_r_390x260x90_65929027.jpg'
              },
              {
                             type:'sms',
                             title: 'qunar大放送',
                             desc: '优惠券来了~',
                             link: 'www.qunar.com',
                             imgUrl: 'http://img1.qunarzz.com/p/tts1/1602/b0/71dc30e564657f7.jpg_r_390x260x90_65929027.jpg'
                     },
                     {
                                    type:'wechatTimeline',
                                    title: 'qunar大放送',
                                    desc: '优惠券来了~',
                                    link: 'www.qunar.com',
                                    imgUrl: 'http://img1.qunarzz.com/p/tts1/1602/b0/71dc30e564657f7.jpg_r_390x260x90_65929027.jpg'
                            },
                            {
                                           type:'QQFav',
                                           title: 'qunar大放送',
                                           desc: '优惠券来了~',
                                           link: 'www.qunar.com',
                                           imgUrl: 'http://img1.qunarzz.com/p/tts1/1602/b0/71dc30e564657f7.jpg_r_390x260x90_65929027.jpg'
                                   }
        ],()=>{console.log("success");},()=>{console.log("fail");}
      );
    }

    abTestInfo(){
      var abId = '160616_ho_yhty_innd'; //实验ID
              var simpleName = 'HotelList'; //使用该策略信息的来源(e.g. : vc name or class name),用于记录Log.
              ABTestManager.abTest(abId, simpleName,
                  (ABTestInfo)=>{
                      // console.log(ABTestInfo)
                      // console.log("heihei")
                      //获取成功的回调,获取test结果
                      console.log("success"+ABTestInfo.ab_type);
//                      globalVariable.abTest = ABTestInfo.ab_type;  //策略类型
                      // ABTestInfo.ab_achieve;  //策略信息
                  },(err)=>{
                      //获取失败的回调
                      // console.log(err)
                      // console.log("haha")
                      console.log("fail");
//                      globalVariable.abTest = 'A';
                  });
    }

    takePhoto(){
      QRCTPhotoManager.takePhotoAndSave(
        (data)=>{
          console.log('success=' + JSON.stringify(data));
          this.setState({
            imageUrl: data.uri
          });
          console.log(this.state.imageUrl);},
        (data)=>{console.log('faile=' + JSON.stringify(data))});
    }

    saveData(){
      StorageManager.saveData(
      'qunarone',
      'name',
      {value:'wangtao'},
      ()=>{console.log('save date success')},
      ()=>{console.log('save dtae faile')});
    }

    getData(){
      StorageManager.getData(
      'qunarone',
      'name',
      'string',
      (data)=>{console.log(JSON.stringify(data)+" success")},
      (fail)=>{console.log(JSON.stringify(fail)+" faile")});
    }

    removeData(){
      StorageManager.removeData(
      'qunarone',
      'name'
      );
    }

    postRequestTrain(){

          QHotDogNetWork.postRequest({ serviceType:"",
                          url:"http://searchtouch.qunar.com/travelbook/routeList.json?destType=1&destId=299861&query=%E5%8D%97%E4%BA%AC",
                          param:{},
                          useCache:false,
                          cacheKey:"",
                          successCallback:(sucess)=>{ console.log(sucess+"sucess")},
                          failCallback:(fail)=>{console.log(fail+"fail")},
                          cacheCallback:(cache)=>{console.log(cache+"cache")}
                      });
    }



    postRequest(){
            QHotDogNetWork.postRequest({ serviceType:"aroundtravel_",
                url:"http://wap1.beta.cn0.qunar.com/fca",
                param:{"latitude":"40.003774","length":20,"locationCity":"北京","longitude":"116.349656","queryCity":"","requestId":"DE5A565E-F862-7728-5562-8D3BCF72627F_1460791232842","start":0},
                useCache:true,
                cacheKey:"ss",
                successCallback:(sucess)=>{ console.log(sucess+"sucess")},
                failCallback:(fail)=>{console.log(fail+"fail")},
                cacheCallback:(cache)=>{console.log(cache+"cache")}
            });
        }

    sendScheme(){
        SchemeManager.sendScheme('qunaraphone://react/open?hybridId=bnbrn&moduleName=bnbrn',{},'',(data)=>{console.log(data)});
    }
    sendABTest(){
        ABTestManager.abTest('123','love',()=>{console.log("success")},()=>{console.log("fail")});
    }

    postRequest2(){
        let param = {
                        source: 'StatusPage'
                    };
                    QHotDogNetWork.postRequest({
                        serviceType: 'f_homepage_banner',
                        url: "http://pitcher.corp.qunar.com/fca/",
                        param: param,
                        useCache: false,
                        cacheKey: "",
                        successCallback:(sucess)=>{ console.log(sucess+"sucess")},
                                        failCallback:(fail)=>{console.log(fail+"fail")},
                                        cacheCallback:(cache)=>{console.log(cache+"cache")}
                    });
    }

    postRequest3(){

        let b={
                cityUrl: "beijing_city",
                cityTag: "beijing_city",
                fromDate: "2016-05-24",
                toDate: "2016-05-25",
                ids: "beijing_city_32164", //hotelseq
                currLatitude: "0.000000",
                currLongitude: "0.000000",
                fromForLog:60,
                uuid: "",
                userName: "",
                userId: "",
                coordConvert: 0 ,
                cs: "bnb"
            };
                QHotDogNetWork.postRequest({ serviceType:"h_hdetailpriceinn",
                    url:"",
                    param:b,
                    useCache:false,
                    cacheKey:'',
                    successCallback:(sucess)=>{ console.log(sucess+"sucess3")},
                    failCallback:(fail)=>{console.log(fail+"fail3")},
                    cacheCallback:(cache)=>{console.log(cache+"cache3")}
                });
            }

    postRequest4(){

            let b={
                    cityUrl: "beijing_city",
                    cityTag: "beijing_city",
                    fromDate: "2016-05-24",
                    toDate: "2016-05-25",
                    ids: "beijing_city_32164", //hotelseq
                    currLatitude: "0.000000",
                    currLongitude: "0.000000",
                    fromForLog:60,
                    uuid: "",
                    userName: "",
                    userId: "",
                    coordConvert: 0 ,
                    cs: "bnb"
                };
                    QHotDogNetWork.postRequest({ serviceType:"h_hdetail",
                        url:"",
                        param:b,
                        useCache:false,
                        cacheKey:'',
                        successCallback:(sucess)=>{ console.log(sucess+"sucess3")},
                        failCallback:(fail)=>{console.log(fail+"fail3")},
                        cacheCallback:(cache)=>{console.log(cache+"cache3")}
                    });
                }

}


module.exports = {
    title: 'QunarApi',
    scroll: true,
    examples: [{
        render: function() {
            return (
                <QunarApiExample />
            );
        }
    }]
};
