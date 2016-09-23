'use strict'

import React, {
  Component,
  StyleSheet,
  View,
  Text,
  TextInput,
  Navigator,
  Image,
  ScrollView,
  TouchableOpacity,
  Animated,
  Easing,
  Button,
} from 'qunar-react-native';

import ReactOrigin from 'react-native';

const styles = StyleSheet.create({
  operationContainer: {
    paddingBottom: 5,
    paddingHorizontal: 10,
    flexDirection: 'row',
    height: 30,
  },
  operationText: {
    flex: 1,
    alignSelf: 'center',
  },
  operationTextHighlight: {
    color: '#1ba9ba',
  },
  textInput: {
    flex: 1,
    height: 25,
    margin: 10,
    marginTop: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#eee'
  },
  textContaier: {
    flexDirection: 'row',
  }
});

class KeyboardExample extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      qrn: true,
      keyboardDismissMode: false,
      keyboardShouldPersistTaps: true,
    }
  }

  switch(prop) {
    this.setState({
      [prop]: !this.state[prop],
    })
  }

  render() {

    let ScrollViewComponent = (this.state.qrn ? ScrollView : ReactOrigin.ScrollView);
    let content = new Array(5).fill('').map((item, index) =>
      <View style={{height: 50, backgroundColor: getRandomColor()}} key={index}/>
    );

    return (
      <View style={{flex: 1, paddingTop: 5}}>
        <View style={styles.operationContainer}>
          <Text style={styles.operationText}>· <Text style={styles.operationTextHighlight}>{this.state.qrn ? 'QRN' : 'RN'}</Text> 的ScrollView
          </Text>
          <Button text='切换' onPress={() => this.switch('qrn')} />
        </View>
        <View style={styles.operationContainer}>
          <Text style={styles.operationText}>· keyboardDismissMode: <Text style={styles.operationTextHighlight}>{this.state.keyboardDismissMode ? 'on-drag（非默认）' : 'none（默认）'}</Text>
          </Text>
          <Button text='切换' onPress={() => this.switch('keyboardDismissMode')} />
        </View>
        <View style={styles.operationContainer}>
          <Text style={styles.operationText}>· keyboardShouldPersistTaps: <Text style={styles.operationTextHighlight}>{this.state.keyboardShouldPersistTaps ? 'true（默认）' : 'false（非默认）'}</Text>
          </Text>
          <Button text='切换' onPress={() => this.switch('keyboardShouldPersistTaps')} />
        </View>
        <ScrollViewComponent keyboardShouldPersistTaps={this.state.keyboardShouldPersistTaps} keyboardDismissMode={this.state.keyboardDismissMode ? 'on-drag' : 'none'}>
          <View style={styles.textContaier}>
              <TextInput style={styles.textInput}/><Button onPress={()=> console.log(0)}/>
          </View>
          {content}
          <View style={styles.textContaier}>
              <TextInput style={styles.textInput}/><Button onPress={()=> console.log(0)}/>
          </View>
          {content}
          <View style={styles.textContaier}>
              <TextInput style={styles.textInput}/><Button onPress={()=> console.log(0)}/>
          </View>
          {content}
          <View style={styles.textContaier}>
              <TextInput style={styles.textInput}/><Button onPress={()=> console.log(0)}/>
          </View>
          {content}
          <View style={styles.textContaier}>
              <TextInput style={styles.textInput}/><Button onPress={()=> console.log(0)}/>
          </View>
          {content}
        </ScrollViewComponent>
      </View>
    )
  }
}

function getRandomColor() {
  var letters = '3456789ABC'.split('');
  var color = '#';
  for (var i = 0; i < 6; i++ ) {
    color += letters[Math.floor(Math.random() * 10)];
  }
  return color;
}

module.exports = {
  title: 'ContentInset ScrollView',
  examples: [{
    render: () => {
      return (
        <KeyboardExample />
      );
    },
  }]
};
