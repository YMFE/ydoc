const fs = require('fs')

/**
 * 复制一个对象的属性到另一个对象
 *
 * @param {any} obj
 * @param {any} props
 * @returns
 */
exports.extend = function extend(obj, props) {
  for (let i in props) {
    if (props.hasOwnProperty(i)) {
      obj[i] = props[i];
    }
  }
  return obj;
}

/**
 * 一个空函数
 *
 * @export
 */
exports.noop = function noop() { }

exports.clearArray = function clearArray(a) {
  return a.splice(0, a.length);
}

exports.fileExist = (filePath) => {
  try {
    return fs.statSync(filePath).isFile();
  } catch (err) {
    return false;
  }
};