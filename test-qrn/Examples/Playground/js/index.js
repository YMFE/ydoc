/** -*- mode: web; -*-
 * @providesModule DemoApp
 * @flow
 */
'use strict';
import React from 'qunar-react-native';
import '@qnpm/react-native-ext';
import './BasicDemo';

Ext.defaults.indexView = 'BasicDemo';
Ext.defaults.navBar = {
    isShow: true,
};
