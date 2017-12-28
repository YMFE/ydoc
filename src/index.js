const fs = require('fs-extra');
const path = require('path');
const yargs = require('yargs');

const commandsDir = path.resolve(__dirname, 'commands');

const commandsFile = fs.readdirSync(commandsDir);
commandsFile.forEach(function (file) {
  if (path.extname(file) !== '.js') return null;
  let commandModule = require(path.resolve(commandsDir, file));
  if (!commandModule) {
    throw new Error(`Module isn't exist in the filepath "${commandsDir}/${file}" `);
  }
  let commandName = path.basename(file, '.js');
  yargs.command(commandName, commandModule.desc, commandModule.setOptions, commandModule.run);
})


yargs.argv;