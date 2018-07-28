const path = require("path");
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const config = require('../config.json');

module.exports = {
	context: path.resolve(__dirname, "../app"),
	resolve: {
		extensions: [".js", ".jsx"]
	},
	entry: "./index.jsx",
	module: {
		rules: [
			{
				enforce: 'pre',
				test: /\.js[x]$/,
				exclude: /node_modules/,
				loader: 'eslint-loader',
				options: {
					configFile: '.eslintrc',
					failOnWarning: false,
					failOnError: false
				}
			},
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				use: [{
					loader: "babel-loader"
				}]
			},
			{
				test: /\.(ttf|eot|svg|woff|png)$/,
				loader: "file-loader",
				options: {
					name: "[path][name].[ext]?[hash]"
				}
			}
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			title: "rtc",
			hash: true,
			template: path.resolve(__dirname, "../index.html")
		}),
		new webpack.HotModuleReplacementPlugin()
	],
	devServer: {
		port: config.basePort,
		hot: true,
		open: true
	}
};