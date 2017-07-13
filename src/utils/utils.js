module.exports = {
    deepEncode(value) {
        return value.replace(/[\~\:\s\@\/\(\)]/g, '_');
    }
}
