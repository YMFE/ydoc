'use strict';
var React = require('qunar-react-native');
var {
    Component,
    Text,
    View,
    ScrollView,
    StyleSheet,
    ProgressBarAndroid,
    AppRegistry,
} = React;

import TimerMixin from 'react-timer-mixin'

const styles = StyleSheet.create({
  box:{
      padding:10,
  },
  text:{
    color:'#333',
    backgroundColor:'#dfdfdf',
    marginBottom:10,
  }
})

const Base = React.createClass({
    render(){
        return(
          <View>
              <View style={styles.box}>
                <Text style={styles.text}>基础</Text>
              
                <ProgressBarAndroid style={styles.bar} />
                <ProgressBarAndroid style={styles.bar} styleAttr='Inverse'/>
              </View>
          </View>
        )
    }
})

const ProgressBarMore = React.createClass({
    mixins: [TimerMixin],
    getInitialState() {
        return {progress: 0.0};
    },
    componentDidMount() {
        this.updateProgress();
    },

    render() {
        return (
            <View>

                <View style={styles.box}>
                  <Text style={styles.text}>不同颜色</Text>
                  <ProgressBarAndroid style={styles.bar} color='#333' progress={this.state.progress} indeterminate={false}/>
                </View>
                <View style={styles.box}>
                  <Text style={styles.text}>不同大小</Text>
                  <ProgressBarAndroid style={styles.bar} progress={this.state.progress} indeterminate={false} styleAttr = 'Small'/>
                  <ProgressBarAndroid style={styles.bar} progress={this.state.progress} indeterminate={false} styleAttr = 'Normal'/>
                  <ProgressBarAndroid style={styles.bar} progress={this.state.progress} indeterminate={false} styleAttr = 'Large'/>
                </View>
                <View style={styles.box}>
                  <Text style={styles.text}>反向</Text>
                  <ProgressBarAndroid style={styles.bar} progress={this.state.progress} indeterminate={false} styleAttr = 'SmallInverse'/>
                  <ProgressBarAndroid style={styles.bar} progress={this.state.progress} indeterminate={false} styleAttr = 'Inverse'/>
                  <ProgressBarAndroid style={styles.bar} progress={this.state.progress} indeterminate={false} styleAttr = 'LargeInverse'/>
                </View>
                <View style={styles.box}>
                  <Text style={styles.text}>Hori</Text>
                  <ProgressBarAndroid style={styles.bar} color='#333' progress={this.state.progress} indeterminate={false} styleAttr = 'Horizontal'/>
                </View>
            </View>
        )
    },


    updateProgress() {

        var progress = this.state.progress >= 1 ? this.state.progress - 1 : this.state.progress;
        progress = progress + 0.01;
        this.setState({progress});
        this.requestAnimationFrame(() => this.updateProgress());
    },
})

const ProgressViewExampleItem = React.createClass({
  render(){
    return(
        <ScrollView>
            <Base/>
            <ProgressBarMore/>
        </ScrollView>
    )
  }
})

AppRegistry.registerComponent('Demo', () => ProgressViewExampleItem)
