const path = require('path');
const fs = require('fs-extra');

module.exports = {
  setOptions: function (yargs) {},
  run: function (argv) {
    console.log(argv)
  },
  desc: 'Initialize a document site'
}