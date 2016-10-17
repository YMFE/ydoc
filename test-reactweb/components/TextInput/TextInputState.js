/**
 * @providesModule TextInputState
 * @flow
 */

var TextInputState = {
    _currentFocus: null,
    currentFocus: function() {
        return this._currentFocus;
    },
    blur: function(node) {
        if (node === this._currentFocus && node !== null) {
            try {
                node.blur();
            } catch (e) {}
            this._currentFocus = null;
        }
    },
    focus: function(node) {
        if (this._currentFocus !== node && node !== null) {
            try {
                node.focus();
            } catch (e) {}
            this._currentFocus = node;
        }
    }
};

module.exports = TextInputState;
