
const logger = require('../logger')
const utils = require('../utils')
const runner = require('../index')

module.exports = {
  setOptions: function (yargs) {
    yargs.option('verbose', {
      describe: 'show debug info.',
      default: false
    })
    yargs.option('mode', {
      default: 'prd'
    })
  },
  run: async function (argv) {
    utils.log = new logger(argv.verbose ? 'debug' : 'info');
    if(argv.mode === 'prd') process.env.NODE_ENV = 'production'
    else process.env.NODE_ENV = 'development'
    await runner()
  },
  desc: 'Generate the document site'
}