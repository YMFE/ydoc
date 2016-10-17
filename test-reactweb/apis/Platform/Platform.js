/*
 * @providesModule Platform
 */

'use strict';

var Platform = {
  OS: 'web',
  UA: navigator.userAgent,
  get Version() {
    return Platform.UA
  },
  select: (obj) => obj && obj.web,
};

module.exports = Platform;
