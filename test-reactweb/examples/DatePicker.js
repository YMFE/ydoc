var React = require('react-native');
var range = require('lodash/range');
var {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    DatePicker,
    Picker,
    ScrollView
} = React;

var Demo = React.createClass({
    getInitialState: function(){
        let date = new Date();
        return {
            initialDate: date,
            date: date,
            timeZoneOffsetInMinutes: 0,
            selectedValue: 0,
            maximumDate: new Date(date.valueOf() + 1000 * 60 * 60 * 24 * 359),
            minimumDate: new Date(date.valueOf() - 1000 * 60 * 60 * 24 * 359)
        };
    },
    render: function() {
        return (
            <ScrollView>
                <Text style={styles.title}>初始时间: { this.state.initialDate.toString() }</Text>
                <Text style={styles.title}>当前时间: { this.state.date.toString() }</Text>
                <View>
                    <Text style={styles.title}>时区偏移: { this.state.timeZoneOffsetInMinutes } min</Text>
                    <Picker
                        style={styles.picker}
                        selectedValue={this.state.selectedValue}
                        onValueChange={(value) => {
                            this.setState({
                                timeZoneOffsetInMinutes: value * 60,
                                selectedValue: value
                            });
                        }}
                    >
                        {
                            range(-12, 13).map(offset => {
                                return <Picker.Item  value={offset} label={''+offset} />
                            })
                        }
                    </Picker>
                </View>
                <View className="example"  >
                    <Text style={styles.title}>mode: datetime</Text>
                    <DatePicker
                        style={styles.picker}
                        date={this.state.date}
                        mode="datetime"
                        timeZoneOffsetInMinutes={this.state.timeZoneOffsetInMinutes}
                        minuteInterval={1}
                        onDateChange={(date)=>{
                            this.setState({
                                date: date
                            });
                        }}
                    />
                    <Text style={styles.title}>mode: date</Text>
                    <DatePicker
                        style={styles.picker}
                        date={this.state.date}
                        mode="date"
                        timeZoneOffsetInMinutes={this.state.timeZoneOffsetInMinutes}
                        minuteInterval={1}
                        maximumDate={this.state.maximumDate}
                        minimumDate={this.state.minimumDate}
                        onDateChange={(date)=>{
                            this.setState({
                                date: date
                            });
                        }}
                    />
                    <Text style={styles.title}>mode: time , minuteInterval: 5</Text>
                    <DatePicker
                        style={styles.picker}
                        date={this.state.date}
                        mode="time"
                        timeZoneOffsetInMinutes={this.state.timeZoneOffsetInMinutes}
                        minuteInterval={5}
                        maximumDate={this.state.maximumDate}
                        minimumDate={this.state.minimumDate}
                        onDateChange={(date)=>{
                            this.setState({
                                date: date
                            });
                        }}
                    />
                </View>
            </ScrollView>
        );
    }
});

var styles = StyleSheet.create({
    title:{
        backgroundColor: '#ccc',
        padding: 10
    },
    picker:{
        borderWidth: 1,
        borderColor: '#ccc',
    }
});

AppRegistry.registerComponent('AwesomeProject', () => Demo);
