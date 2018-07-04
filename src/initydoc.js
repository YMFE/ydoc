const readlineSync = require('readline-sync');
const utils = require('./utils');

const initConfig = [{
	name: 'title',
	default: 'ydoc'
}, {
	name: 'description',
		default: 'website description'
}, {
	name: 'author',
		default: 'ymfe'
}];

// 执行 init 命令, 用户可以输入一些默认值
function initYdoc() {
	utils.log.info(`This utility will walk you through creating a ydoc.json file.\nIt only covers the most common items, and tries to guess sensible defaults.\n\nPlease enter your document site config`);
	let config = {};
	initConfig.forEach((item) => {
		const input = readlineSync.question(`Your document ${item.name}: (${item.default}) `);
		if (input) {
			config[item.name] = input;
		}
	})
	return config;
}

module.exports = initYdoc;
