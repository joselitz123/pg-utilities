const webpack = require('webpack');
const path = require('path');

const build_dir = path.resolve('public/js');

const app_dir = path.resolve('src');

const config = {
	entry: app_dir + '/index.js',
	output: {
		path: build_dir,
		filename: 'app.js',
	},
	module : {
    loaders : [
      {
        test : /\.js?/,
        include : app_dir,
        loader : 'babel-loader',
        exclude: /node_modules/
      }
    ]
  }
}

module.exports = config;