/**
 * The examples provided by Facebook are for non-commercial testing and
 * evaluation purposes only.
 *
 * Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN
 * AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * @flow
 */
'use strict';

var React = require('react-native');
var {
    Switch,
    Text,
    View
    } = React;

var BasicSwitchExample = React.createClass({
    getInitialState() {
        return {
            trueSwitchIsOn: true,
            falseSwitchIsOn: false,
        };
    },
    render() {
        return (
            <View>
                <Switch
                    onValueChange={(value) => this.setState({falseSwitchIsOn: value})}
                    style={{marginBottom: 10}}
                    value={this.state.falseSwitchIsOn}/>
                <Switch
                    onValueChange={(value) => this.setState({trueSwitchIsOn: value})}
                    value={this.state.trueSwitchIsOn}/>
            </View>
        );
    }
});

var DisabledSwitchExample = React.createClass({
    render() {
        return (
            <View>
                <Switch
                    disabled={true}
                    style={{marginBottom: 10}}
                    value={true}/>
                <Switch
                    disabled={true}
                    value={false}/>
            </View>
        );
    },
});

var ColorSwitchExample = React.createClass({
    getInitialState() {
        return {
            colorTrueSwitchIsOn: true,
            colorFalseSwitchIsOn: false,
        };
    },
    render() {
        return (
            <View>
                <Switch
                    onValueChange={(value) => this.setState({colorFalseSwitchIsOn: value})}
                    onTintColor="#1BA9BA"
                    style={{marginBottom: 10}}
                    thumbTintColor="#0000ff"
                    tintColor="#ff0000"
                    value={this.state.colorFalseSwitchIsOn}/>
                <Switch
                    onValueChange={(value) => this.setState({colorTrueSwitchIsOn: value})}
                    onTintColor="#1BA9BA"
                    thumbTintColor="#0000ff"
                    tintColor={"#ff0000"}
                    value={this.state.colorTrueSwitchIsOn}/>
            </View>
        );
    },
});

var EventSwitchExample = React.createClass({
    getInitialState() {
        return {
            eventSwitchIsOn: false,
            eventSwitchRegressionIsOn: true,
        };
    },
    render() {
        return (
            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                <View>
                    <Switch
                        onValueChange={(value) => this.setState({eventSwitchIsOn: value})}
                        style={{marginBottom: 10}}
                        value={this.state.eventSwitchIsOn}/>
                    <Switch
                        onValueChange={(value) => this.setState({eventSwitchIsOn: value})}
                        style={{marginBottom: 10}}
                        value={this.state.eventSwitchIsOn}/>
                    <Text>{this.state.eventSwitchIsOn ? 'On' : 'Off'}</Text>
                </View>
                <View>
                    <Switch
                        onValueChange={(value) => this.setState({eventSwitchRegressionIsOn: value})}
                        style={{marginBottom: 10}}
                        value={this.state.eventSwitchRegressionIsOn}/>
                    <Switch
                        onValueChange={(value) => this.setState({eventSwitchRegressionIsOn: value})}
                        style={{marginBottom: 10}}
                        value={this.state.eventSwitchRegressionIsOn}/>
                    <Text>{this.state.eventSwitchRegressionIsOn ? 'On' : 'Off'}</Text>
                </View>
            </View>
        );
    }
});

module.exports = {
    title: 'Switch',
    scroll: true,
    examples: [
        {
            subtitle: 'Switches can be set to true or false',
            render: function() {
                return <BasicSwitchExample />;
            }
        },
        {
            subtitle: 'Switches can be disabled',
            render: function() {
                return <DisabledSwitchExample />;
            }
        },
        {
          subtitle: 'Switch with custom color',
          render: function() {
            return <ColorSwitchExample />
          }
        },
        {
            subtitle: 'Change events can be detected',
            render: function() {
                return <EventSwitchExample />;
            }
        },
        {
            subtitle: 'Switches are controlled components',
            render: function() {
                return <Switch />;
            }
        }
    ]
};
