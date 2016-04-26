var parsers = module.exports = [
    require('./js'),
    require('./css'),
    require('./sass'),
    require('./markdown')
];

parsers.load = function(config) {

};
