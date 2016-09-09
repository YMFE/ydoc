'use strict'

import React, {QLoadingError, View, Button} from 'qunar-react-native';

module.exports = {
    title: 'QLoadingError',
    scroll: true,
    examples: [{
        subtitle: 'Default settings',
        render: () => {
            return <QLoadingError onPress={() => alert('Press')}/>
        },
    }, {
        subtitle: 'Custom Content',
        render: () => {
            return <QLoadingError titleText='title' hintText='hint' buttonText='button' onPress={() => alert('Press2')}/>
        },
    }, {
        subtitle: 'Hide Content',
        render: () => {
            return <QLoadingError hideTitle hideHint hideButton onPress={() => alert('Press3')}/>
        },
    }, {
        subtitle: 'Custom Style',
        render: () => {
            return <QLoadingError
                        titleStyle={{fontSize: 18, color: 'red'}}
                        hintStyle={{fontSize: 16, color: 'green', marginTop: 10}}
                        buttonStyle={{borderWidth: 1, borderColor: '#1ba9ba', backgroundColor: '#ffffff', borderRadius: 5}}
                        buttonTextStyle={{color: '#1ba9ba'}}
                        onPress={() => alert('Press4')}/>
        },
    }, {
        subtitle: 'Custom Render Function',
        render: () => {
            return <QLoadingError renderButton={() => <Button />} onPress={() => alert('Press5')}/>
        },
    }],
};
