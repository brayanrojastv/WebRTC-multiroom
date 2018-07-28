const path = require("path");
const argv = require('yargs').argv;

const isDevelopment = argv.mode === 'development';
const isProduction = !isDevelopment;

module.exports = (env) => {
	if (isDevelopment) {
		return require('./webpack/dev.config.js');
	} else if (isProduction) {
		return require('./webpack/prod.config.js')
	}
	console.log("Wrong webpack build parameter. Choose mode: `dev` or `prod`.")
};
