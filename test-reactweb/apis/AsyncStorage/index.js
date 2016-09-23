/**
 * Copyright (c) 2015-present, Nicolas Gallagher.
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 * @providesModule AsyncStorage
 */

const mergeLocalStorageItem = (key, value) => {
  const oldValue = window.localStorage.getItem(key)
  const oldObject = JSON.parse(oldValue)
  const newObject = JSON.parse(value)
  const nextValue = JSON.stringify({ ...oldObject, ...newObject })
  window.localStorage.setItem(key, nextValue)
}


/**
 * 异步存储
 *
 * @component AsyncStorage
 * @description `AsyncStorage` 是一个简单的、异步的、持久性的键-值型的存储系统，它作用于整个应用
 * 应该用它来代替 `LocalStorage`。
 *
 * 建议在 `AsyncStorage` 上面做一层封装而不是直接使用它。
 *
 * `AsyncStorage` 的 JavaScript 代码是一个简单的封装提供了清晰的 API，出错时返回真正的 `Error` 对象
 * 以及提供简单的单项数据操作函数。每个方法都返回 `Promise` 对象。
 */
class AsyncStorage {
  /**
   * @method clear
   * @description 删除 `AsyncStorage` 中全部的数据。通常不应该调用该方法，使用 `removeItem`
   * 或者 `multiRemove` 来删除需要删除的 key。返回 Promise。
   *
   * ```
   * AsyncStorage.clear();
   * ```
   */
  static clear() {
    return new Promise((resolve, reject) => {
      try {
        window.localStorage.clear()
        resolve(null)
      } catch (err) {
        reject(err)
      }
    })
  }

  /**
   * @method getAllKeys
   * @description 获取应用中所有的数据的键值，不需要参数。返回 Promise。
   *
   * ```
   * AsyncStorage.getAllKeys() -> ['key1','key2']
   * ```
   */
  static getAllKeys() {
    return new Promise((resolve, reject) => {
      try {
        const numberOfKeys = window.localStorage.length
        const keys = []
        for (let i = 0; i < numberOfKeys; i += 1) {
          const key = window.localStorage.key(i)
          keys.push(key)
        }
        resolve(keys)
      } catch (err) {
        reject(err)
      }
    })
  }

  /**
   * @method getItem
   * @param {string} key 键
   * @return {Promise}
   * @description 通过键获取到对应的值。
   *
   * ```
   * AsyncStorage.getItem('key1') -> 'value1'
   * ```
   */
  static getItem(key: string) {
    return new Promise((resolve, reject) => {
      try {
        const value = window.localStorage.getItem(key)
        resolve(value)
      } catch (err) {
        reject(err)
      }
    })
  }

  /**
   * @method mergeItem
   * @param {string} key 键
   * @param {string} value 值，该值应该是 JSON 字符串
   * @return {Promise}
   * @description 合并一个存在的值和一个新值，两个值都应该是 JSON 字符串，然后将 parse 得到的
   * 两个对象合并，之后再 stringify 为字符串并存储。
   */
  static mergeItem(key: string, value: string) {
    return new Promise((resolve, reject) => {
      try {
        mergeLocalStorageItem(key, value)
        resolve(null)
      } catch (err) {
        reject(err)
      }
    })
  }

  /**
   * @method multiGet
   * @param {Array} keys 一组键
   * @return {Promise}
   * @description 获取 keys 中所有键对应的值。
   *
   * ```
   * AsyncStorage.multiGet(['k1', 'k2']) -> [['k1', 'val1'], ['k2', 'val2']]
   * ```
   */
  static multiGet(keys: Array<string>) {
    const promises = keys.map((key) => AsyncStorage.getItem(key))

    return Promise.all(promises).then(
      (result) => Promise.resolve(result.map((value, i) => [ keys[i], value ])),
      (error) => Promise.reject(error)
    )
  }

  /**
   * @method multiMerge
   * @param {Array<Pair<key,value>>} keyValuePairs 一组需要合并的键值对，与 mergeItem 类似，value 需要
   * 是 JSON 字符串。
   * @return {Promise}
   * @description
   * ```
   * AsyncStorage.multiMerge([['k1', 'val1'], ['k2', 'val2']])
   * ```
   */
  static multiMerge(keyValuePairs: Array<Array<string>>) {
    const promises = keyValuePairs.map((item) => AsyncStorage.mergeItem(item[0], item[1]))

    return Promise.all(promises).then(
      () => Promise.resolve(null),
      (error) => Promise.reject(error)
    )
  }

  /**
   * @method multiRemove
   * @param {Array<string>} keys 一组键
   * @return {Promise}
   * @description 删除所有存在于 keys 中的 key-value 对。
   */
  static multiRemove(keys: Array<string>) {
    const promises = keys.map((key) => AsyncStorage.removeItem(key))

    return Promise.all(promises).then(
      () => Promise.resolve(null),
      (error) => Promise.reject(error)
    )
  }

  /**
   * @method multiSet
   * @param {array} keyValuePairs 一组键值对
   * @return {Promise}
   * @description 设置一组键值对
   *
   * ```
   * AsyncStorage.multiSet([['k1', 'val1'], ['k2', 'val2']])
   * ```
   */
  static multiSet(keyValuePairs: Array<Array<string>>) {
    const promises = keyValuePairs.map((item) => AsyncStorage.setItem(item[0], item[1]))

    return Promise.all(promises).then(
      () => Promise.resolve(null),
      (error) => Promise.reject(error)
    )
  }

  /**
   * @method removeItem
   * @param {string} key 要被移除的 key
   * @return {Promise}
   * @description 移除对应的 key-value 对。
   */
  static removeItem(key: string) {
    return new Promise((resolve, reject) => {
      try {
        window.localStorage.removeItem(key)
        resolve(null)
      } catch (err) {
        reject(err)
      }
    })
  }

  /**
   * @method setItem
   * @param {string} key key
   * @param {string} value value
   * @return {Promise}
   * @description 设置一组键值对
   */
  static setItem(key: string, value: string) {
    return new Promise((resolve, reject) => {
      try {
        window.localStorage.setItem(key, value)
        resolve(null)
      } catch (err) {
        reject(err)
      }
    })
  }

  /**
   * @method flushGetRequests
   * @description 清除所有进行中的查询操作 - do nothing
   */
  static flushGetRequests() {
    
  }

}

module.exports = AsyncStorage
