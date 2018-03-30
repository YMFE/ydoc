const fs = require('fs-extra');
const path = require('path');
const argv= process.argv;
const commands = [];
const utils = require('./utils');
const _ = require('underscore');

const commandsDir = path.resolve(__dirname, 'commands');
const commandsFile = fs.readdirSync(commandsDir);

commandsFile.forEach(function (file) {
  if (path.extname(file) !== '.js') return null;
  let commandModule = require(path.resolve(commandsDir, file));
  if (!commandModule) {
    throw new Error(`Module isn't exist in the filepath "${commandsDir}/${file}" `);
  }
  let commandName = path.basename(file, '.js');
  commands.push({
    name: commandName,
    module: commandModule
  });
})

if(argv.length === 2){
  argv.push('--help');
}if(argv[2][0] !== '-' && !_.find(commands, {name: argv[2]})){
  utils.log.error(`Command "${argv[2]}" doesn't exist.`);
  argv[2] = '-h';
}

const yargs = require('yargs');

commands.forEach(command=>{
  let m = command.module;
  yargs.command(command.name, m.desc, m.setOptions, m.run);
})

yargs
.usage('Usage: $0 [command]')
.help('h')
.alias('h', 'help')
.argv;
