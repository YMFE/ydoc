/* 
 * @providesModule clamp
 * @typechecks
 */

 /**
  * @param {number} value
  * @param {number} min
  * @param {number} max
  * @return {number}
  */
function clamp(min, value, max) {
  if (value < min) {
    return min;
  }
  if (value > max) {
    return max;
  }
  return value;
}

module.exports = clamp;