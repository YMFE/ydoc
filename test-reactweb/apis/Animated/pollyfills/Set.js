function SetPolyfill() {
  this._cache = [];
}

SetPolyfill.prototype.add = function(e) {
  if (this._cache.indexOf(e) === -1) {
    this._cache.push(e);
  }
};

SetPolyfill.prototype.forEach = function(cb) {
  this._cache.forEach(cb);
};

var nativeSet = window.Set

var useNativeSet = nativeSet && 
        Object.prototype.toString.call(useNativeSet) === '[object Set]'
   

module.exports = useNativeSet ? nativeSet: SetPolyfill
