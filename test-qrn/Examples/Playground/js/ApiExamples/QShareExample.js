// -*- mode: web; -*-

'use strict';

import React, {QShare, Alert, StyleSheet, Text, TouchableHighlight, View, Component} from 'qunar-react-native';

const styles = StyleSheet.create({
    wrapper: {
        borderRadius: 5,
        marginBottom: 5,
    },
    button: {
        backgroundColor: '#eeeeee',
        padding: 10,
    },
    text: {
        padding: 10,
    }
});


class QShareExample extends Component {
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
                onPress={() => {
                  QShare.doShare({
                    com:{
                      title:'去哪儿网',
                      desc:'聪明你的旅行',
                      link:'http://app.qunar.com/',
                      imgUrl:'http://source.qunarzz.com/common/hf/logo.png'
                    },
                  },(data) => {
                    alert(JSON.stringify(data));
                  }, (err) => {
                    alert(JSON.stringify(err))
                  })
                }}>
                <View style={styles.button}>
                  <Text>Share with common settings</Text>
                </View>
              </TouchableHighlight>
              <TouchableHighlight
                style={styles.wrapper}
                onPress={() => {
                  QShare.doShare({
                    com:{
                      title:'去哪儿网',
                      desc:'聪明你的旅行',
                      link:'http://app.qunar.com/',
                      imgUrl:'http://source.qunarzz.com/common/hf/logo.png'
                    },
                    wechatTimeline:{
                      title:'朋友圈',
                      desc:'朋友圈分享',
                      link:'http://www.qunar.com/',
                      imgUrl:'http://img1.qunarzz.com/p/p78/1601/74/93df1e3741e903f7.jpg'
                    },
                  },(data) => {
                    alert(JSON.stringify(data));
                  }, (err) => {
                    alert(JSON.stringify(err))
                  })
                }}>
                <View style={styles.button}>
                  <Text>Share use special wechatTimeline</Text>
                </View>
              </TouchableHighlight>
              <TouchableHighlight
                style={styles.wrapper}
                onPress={() => {
                  QShare.doShare({
                    com:{
                      title:'去哪儿网',
                      desc:'聪明你的旅行',
                      link:'http://app.qunar.com/',
                      imgUrl:'http://source.qunarzz.com/common/hf/logo.png'
                    }, types:[
                    QShare.wechatTimeline,
                    QShare.sinaWeibo
                    ]
                  },(data) => {
                    alert(JSON.stringify(data));
                  }, (err) => {
                    alert(JSON.stringify(err))
                  })
                }}>
                <View style={styles.button}>
                  <Text>Share only wechatTimeline and sinaWeibo</Text>
                </View>
              </TouchableHighlight>
              <TouchableHighlight
                style={styles.wrapper}
                onPress={() => {
                  QShare.doShare({
                    com:{
                      title:'去哪儿网',
                      desc:'聪明你的旅行',
                      link:'http://app.qunar.com/',
                      imgUrl:'http://source.qunarzz.com/common/hf/logo.png'
                    }, types:[
                    QShare.wechatTimeline,
                    QShare.sinaWeibo,
                    'sinnaweibo'
                    ]
                  },(data) => {
                    alert(JSON.stringify(data));
                  }, (err) => {
                    alert(JSON.stringify(err))
                  })
                }}>
                <View style={styles.button}>
                  <Text>Share with wrong type</Text>
                </View>
              </TouchableHighlight>
            </View>
        );
    }
}


module.exports = {
    title: 'QShare',
    scroll: true,
    examples: [{
        render: function() {
            return (
                <QShareExample />
            );
        }
    }]
};
