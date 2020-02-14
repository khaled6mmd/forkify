const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	// where to start looking for all deps it should bundle
	entry: ['@babel/polyfill', './src/js/index.js'], 
	// where to save our bundle file
	output: {
		// path needs to be absolute. requires built in node module, 'path'
		// dirname gives working absolute path (the one this file is in)
		path: path.resolve(__dirname, 'dist'),
		filename: 'js/bundle.js'
	},
	// devServer auto reloads the page when our code changes, but doesn't write the changes to disk
	// instead it 'streams' them to the server, so the index.html, bundle.js etc files won't show in 
	// the file explorer. the bundle.js is injected 'on the fly' into index.html
	// running dev or build scripts WILL save the files to disk, however
	devServer: {
		contentBase: './dist'
	},
	// plugins allow us to do complex processing of input files
	plugins: [
		new HtmlWebpackPlugin({
			// copy src html into dist folder when bundling and inclue script
			filename: 'index.html', // inside dist
			template: './src/index.html' // inside src
		})
	],
	//loaders allow us to import (load) different files and process them,
	// like converting sass to css or ES6+ to ES5
	module: {
		rules: [
			{
				test: /\.js$/, // all js files will use babel loader
				exclude: /node_modules/, // except all the js files in node_modules, of course
				use: {
					loader: 'babel-loader'
				}
			}
		]
	}
};