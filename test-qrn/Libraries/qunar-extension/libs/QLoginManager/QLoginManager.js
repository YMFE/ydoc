/** -*- mode: web; -*-
 * @providesModule QLoginManager
 **/

'use strict';

import {QRCTLoginManager} from 'NativeModules';

if (!QRCTLoginManager) {
    console.warn('登录API仅在大客户端环境内可用');
}

module.exports = QRCTLoginManager;
