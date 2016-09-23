'use strict'

import React, {Component, StyleSheet, View, Text, TouchableCustomFeedback} from 'qunar-react-native';

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    }
});

module.exports = {
    title: 'TouchableCustomFeedback',
    scroll: true,
    examples: [{
        subtitle: 'Default settings(abled & disabled)',
        render: () => {
            return (
                <View style={styles.container}>
                    <TouchableCustomFeedback
                        defaultContent={<View style={{borderWidth:1,borderRadius:5,padding:5,borderColor:'black'}}><Text style={{color:'black'}}>你点我呀</Text></View>}
                        activeContent={<View style={{borderWidth:1,borderRadius:5,padding:5,borderColor:'red'}}><Text style={{color:'red'}}>你点我了</Text></View>}
                        disabledContent={<View style={{borderWidth:1,borderRadius:5,padding:5}}><Text style={{color:'#ddd'}}>你点我呀</Text></View>}
                        onPress={()=>console.log('onPress')}
                        onLongPress={()=>console.log('onLongPress')}
                        onPressIn={()=>console.log('onPressIn')}
                        onPressOut={()=>console.log('onPressOut')}
                        />
                    <TouchableCustomFeedback
                        disabled={true}
                        defaultContent={<View style={{borderWidth:1,borderRadius:5,padding:5}}><Text>你点不到我</Text></View>}
                        activeContent={<View style={{borderWidth:1,borderRadius:5,padding:5}}><Text>你点不到我</Text></View>}
                        disabledContent={<View style={{borderWidth:1,borderRadius:5,padding:5,borderColor:'#ddd'}}><Text style={{color:'#ddd'}}>你点不到我</Text></View>}
                        onPress={()=>console.log('onPress')}
                        onLongPress={()=>console.log('onLongPress')}
                        onPressIn={()=>console.log('onPressIn')}
                        onPressOut={()=>console.log('onPressOut')}
                        />
                </View>
            )
        }
    }],
};
