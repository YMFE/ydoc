module.exports = (listener) => {
    let readyRep = /complete|loaded|interactive/;

    if (readyRep.test(document.readyState) && document.body) {
        listener();
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            listener();
        }, false);
    }
};
