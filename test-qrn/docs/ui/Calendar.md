Calendar
========

日历组件
**Author: yuhao.ju**

![](http://7xkm02.com1.z0.glb.clouddn.com/Calendar.gif)

Install
-------
qnpm install @qnpm/react-native-ui-calendar



Props
-----
Prop                  | Type     | Default                   | Required | Description
--------------------- | -------- | ------------------------- | -------- | -----------
startTime|array|moment()|No|日历开始日期，格式为YYYY-MM-DD的字符串。
endTime|array|moment().add(5, 'month')|No|日历终止日期，格式为YYYY-MM-DD的字符串。
holiday|object||No|节日数据。
active|object||No|特殊样式日期数据，样式类型只能为fill/border。
note|object||No|日期提示文字数据。
onPress|func||No|点击单个日期的回调，回调中会返回该日期的信息。

Example:
--------
```javascript

import React, {Component, StyleSheet, View} from 'react-native';

import Calendar from '@qnpm/react-native-ui-calendar'

class CalendarExample extends Component {
    constructor(props) {
        super(props)

        // prepare options
        const today = new Date(),
            todayStr = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate(),
            aWeekLater = new Date(today.getTime() +  7 * 24 * 60 * 60 * 1000),
            aWeekLaterStr = aWeekLater.getFullYear() + '-' + (aWeekLater.getMonth() + 1) + '-' + aWeekLater.getDate()

        // Options
        this.state = {
            holiday: {
                '2016-09-10': '教师节',
                '2016-09-15': '中秋节',
            },

            active: {
                [todayStr]: 'fill',
                [aWeekLaterStr]: 'fill',
                '2016-07-25': 'border',
                '2016-08-25': 'border',
            },

            note: {
                [todayStr]: '出发',
                [aWeekLaterStr]: '返程',
                '2016-07-25': '特价',
                '2016-08-25': '特价',
            }
        }
    }

    render() {
        const {holiday, active, note} = this.state
        return (
            <View style={styles.container}>
                <Calendar
                    holiday={holiday}
                    active={active}
                    note={note}
                    startTime='2016-05-01'
                    endTime='2016-09-01'
                    onPress={this.showDate}
                />
            </View>
        )
    }

    showDate(d) {
        alert(d.date)
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    }
})

```