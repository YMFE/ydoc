
const logger = require('../logger')
const utils = require('../utils')
require('../ydoc')
const runner = require('../run')

module.exports = {
  setOptions: function (yargs) {
    yargs.option('verbose', {
      describe: 'show debug info.',
      default: false
    })
  },
  run: async function (argv) {
    utils.log = new logger(argv.verbose ? 'debug' : 'info');
    await runner()
  },
  desc: 'Generate the document site'
}