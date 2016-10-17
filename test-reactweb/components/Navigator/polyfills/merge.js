'use strict';

function merge(one, two) {
  return {...one, ...two};
}

module.exports = merge;