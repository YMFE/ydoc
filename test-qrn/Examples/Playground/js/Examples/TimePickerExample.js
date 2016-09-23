'use strict'

import React, { TimePicker, View, Component, StyleSheet, Text, Button } from 'qunar-react-native';

const styles = StyleSheet.create({
    operationContainer: {
        paddingBottom: 5,
        paddingHorizontal: 10,
        flexDirection: 'row',
    },
    operationText: {
        flex: 1,
        alignSelf: 'center',
    },
    operationTextHighlight: {
        color: '#1ba9ba',
    },
    itemText: {
        padding: 5,
        color: '#fff',
        alignSelf:'flex-end',
        fontSize: 32,
        fontWeight: 'bold'
    }
});

class TimePickerExample extends Component {
  constructor(props){
    super(props);

    this.state = {
      date: new Date(),
      minimumDate: this.props.mode === 'time' ? getRandomMinTime() : getRandomMinDate(),
      maximumDate: this.props.mode === 'time' ? getRandomMaxTime() : getRandomMaxDate(),
      minuteInterval: 1,
    }
  }

  render() {
    return (
      <View style={{flex:1}}>
        <View style={styles.operationContainer}>
          <Text style={styles.operationText}>最小值：<Text style={styles.operationTextHighlight}>{this.state.minimumDate ? formatDate(this.state.minimumDate) : 'None'}</Text>
          </Text>
          <Button text='切换' onPress={() => this.setState({minimumDate: this.state.minimumDate ? null : ( this.props.mode === 'time' ? getRandomMinTime() : getRandomMinDate())})} />
        </View>
        <View style={styles.operationContainer}>
          <Text style={styles.operationText}>最大值：<Text style={styles.operationTextHighlight}>{this.state.maximumDate ? formatDate(this.state.maximumDate) : 'None'}</Text>
          </Text>
          <Button text='切换' onPress={() => this.setState({maximumDate: this.state.maximumDate ? null : ( this.props.mode === 'time' ? getRandomMaxTime() : getRandomMaxDate())})} />
        </View>
        <View style={styles.operationContainer}>
          <Text style={styles.operationText}>minuteInterval：<Text style={styles.operationTextHighlight}>{this.state.minuteInterval}</Text>
          </Text>
          <Button text='切换' onPress={() => this.setState({minuteInterval: getRandomInterval()})} />
        </View>
        <TimePicker
          mode={this.props.mode}
          date={this.state.date}
          onDateChange={(currentDate) => {console.log(currentDate); this.setState({date: currentDate})}}
          minimumDate={this.state.minimumDate}
          maximumDate={this.state.maximumDate}
          minuteInterval={this.state.minuteInterval}
        />
      </View>
    );
  }
}

function getRandomInterval() {
    const intervals = [1, 2, 3, 5, 6, 10, 12, 15, 20, 30, 1];
    return intervals[Math.floor(Math.random() * 10)];
}

function getRandomMinDate() {
    let date = new Date();

    date.setFullYear(date.getFullYear() - Math.floor(Math.random() * 5));
    date.setMonth(date.getMonth() - Math.floor(Math.random() * 12));
    date.setDate(date.getDate() - Math.floor(Math.random() * 31));
    date.setHours(Math.floor(Math.random() * 24));
    date.setMinutes(Math.floor(Math.random() * 60));

    return date;
}

function getRandomMaxDate() {
    let date = new Date();

    date.setFullYear(date.getFullYear() + Math.floor(Math.random() * 5));
    date.setMonth(date.getMonth() + Math.floor(Math.random() * 12));
    date.setDate(date.getDate() + Math.floor(Math.random() * 31));
    date.setHours(Math.floor(Math.random() * 24));
    date.setMinutes(Math.floor(Math.random() * 60));

    return date;
}

function getRandomMinTime() {
    let date = new Date(),
        _date = date.getDate(),
        _hour = date.getHours(),
        _minute = date.getMinutes();

    let _isYesterday = Math.random() > 0.5

    date.setDate( _isYesterday ? _date - 1 : _date);
    date.setHours(Math.floor(Math.random() * (_isYesterday ? 24 : _hour)));
    date.setMinutes(Math.floor(Math.random() * _minute));

    return date;
}

function getRandomMaxTime() {
    let date = new Date(),
        _hour = date.getHours(),
        _minute = date.getMinutes();

    date.setHours(_hour + Math.floor(Math.random() * (24 - _hour)));
    date.setMinutes(_minute + Math.floor(Math.random() * (60 - _minute)));

    return date;
}

function formatDate(date) {
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes();
}

module.exports = {
    title: 'TimePicker',
    scroll: true,
    examples: [
    {
        subtitle: 'Default settings',
        render: () => {
            return (
            <View>
              <TimePickerExample />
              <TimePickerExample mode={'time'}/>
              <TimePickerExample mode={'date'}/>
            </View>
          )
        },
    }
    ],
};
