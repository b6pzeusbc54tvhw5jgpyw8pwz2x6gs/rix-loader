/* eslint func-names: 0 */
var argv = require('yargs').argv;
var webpack = require('webpack');
var path = require('path');
//var dynamicRequire = require('./src/dynamicRequire');

var PRODUCTION = process.env.NODE_ENV === 'production';

function plugins() {
  var all = [
	new webpack.DefinePlugin({
		__DEVELOPEMENT__: JSON.stringify( argv.prdbuild ? false : true ),
		__PRODUCTION__: JSON.stringify( argv.prdbuild ? true : false ),
		__IS_WEBPACK__: JSON.stringify( true )
	})
  ];

  var production = [
    new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } }),
    new webpack.optimize.DedupePlugin(),
    new webpack.DefinePlugin({ 'process.env': { NODE_ENV: JSON.stringify('production') } })
  ];

  return PRODUCTION ? all.concat(production) : all;
}

var clientConfig = {

  context: path.join( __dirname, 'src' ),
  entry: {
	  javascript: './button.js'
  },

  output: {
    filename: 'bundle.js',
    path: path.join( __dirname, '_build' ),
    publicPath: '_build'
  },

  resolve: {
	modulesDirectories: [ '.', 'src', 'node_modules','../']
  },

  module: {
	loaders: [
		{ test: /\.js$/, loaders: ["babel-loader","rix-loader?cssdir=cssfolder"], exclude: /node_modules/ },
		{ test: /\.html$/, loader: "file?name=[name].[ext]" },
		{
			test: /\.css$/, // Only .css files
			loader: 'style!cssfolder' // Run both loaders
		}
	]
  },

  devtool: 'inline-source-map',
  plugins: plugins()
};

// Notice! webpack-dev-server reads first config of array
module.exports = clientConfig;
