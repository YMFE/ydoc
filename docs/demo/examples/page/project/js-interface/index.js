/**
 * 注释头部可以直接编写描述
 *
 * @interface /qhot/v2/addModule
 * @method GET
 * @category 获取用户信息
 * @param {String} name name描述 <1.0.0>
 * @param  {String} [age] age描述 <1.0.0, 2.1.2>
 * @example
 * myOpen({
 *     type: 'user', // 注释
 *     success: function(res) {
 *         console.log('success');
 *         window.open('http://ymfe.tech/');
 *     },
 *     fail: function() {
 *         console.log('fail');
 *     }
 * });
 * @description
 * *斜体* 额外说明的描述文字
 *
 */

/**
 *
 * @interface myOpen
 * @method POST
 * @category 获取用户信息
 * @version 1.0.0
 * @returns {String} 返回值
 * @example
 * getInfo(name, age) {
 *     return ('姓名: ' + name + ', 年龄: ' + age);
 * }
 * myOpen({
 *     type: 'user', // 注释
 *     success: function(res) {
 *         console.log('success');
 *         window.open('http://ymfe.tech/');
 *     },
 *     fail: function() {
 *         console.log('fail');
 *     }
 * });
 * @description
 *
 * | 运行环境  | 是否支持 |
 * | :-----: | :-----: |
 * | h5   |    √    |
 * | wechat  |    √    |
 * | native  |    X    |
 *
 */
