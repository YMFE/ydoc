const ready = require('../util/ready');

module.exports = (config, listener) => {
    let callback = (e) => {
            clearTimeout(timer);
            listener(e.bridge);
        },
        timer;
    document.addEventListener(config.bridgeReadyEvent, callback, false);
    timer = setTimeout(() => {
        document.removeEventListener(config.bridgeReadyEvent, callback);
        listener(null);
    }, config.bridgeReadyTimeout);
};
