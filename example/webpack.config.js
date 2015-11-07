/* eslint func-names: 0 */
var argv = require('yargs').argv;
var webpack = require('webpack');
var path = require('path');
var fs = require('fs');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var PRODUCTION = process.env.NODE_ENV === 'production';
var mkdirp = require('mkdirp');
var SRC_DIR = 'src';

// 자동으로 생성되는 css폴더도 webpack compiler 시점에서는 bundle 전의 파일들이기 때문에
// _build 디렉토리 보다는 src 디렉토리에 위치하는게 좋습니다.
// 다만 webpack. 이라는 prefix 를 사용하여 webpack 이 자동으로 생성하는 파일임을 명시하고
// 직접 수정을 방지합니다.
var cssDir = 'webpack.css';
var cssEntryFile = 'cssEntry.webpack.js';
var cssBundleFile = 'style.css';

function plugins() {
  var all = [
	new webpack.DefinePlugin({
		__DEVELOPEMENT__: JSON.stringify( argv.prdbuild ? false : true ),
		__PRODUCTION__: JSON.stringify( argv.prdbuild ? true : false ),
		__IS_WEBPACK__: JSON.stringify( true )
	}),
	new webpack.HotModuleReplacementPlugin(),
	new ExtractTextPlugin( cssBundleFile )
  ];

  var production = [
    new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } }),
    new webpack.optimize.DedupePlugin(),
    new webpack.DefinePlugin({ 'process.env': { NODE_ENV: JSON.stringify('production') } })
  ];

  return PRODUCTION ? all.concat(production) : all;
}

// CSS load 를 위한 entry 파일생성
// html, body 등의 css속성을 가지고 있는 파일을 넣어도됨.
// 근데 그럴려면 entry가 앞에 하나 더 있어야하겠네...
/*
          entry
	        |
	|---------------|
    |               |
body스타일      지금entry
*/
mkdirp( path.join( __dirname, SRC_DIR, cssDir ), function (err) { if(err) console.error(err); });
var emptyCssFileName = 'empty.webpack.css';	 
var cssEntryContent = "require('"+emptyCssFileName+"');";
fs.writeFileSync( path.join( __dirname, SRC_DIR, cssDir, emptyCssFileName ), "" );
fs.writeFileSync( path.join( __dirname, SRC_DIR, cssDir, cssEntryFile ), cssEntryContent );

var clientConfig = {

  context: path.join( __dirname, SRC_DIR ),
  entry: {
	  javascript: './button.js',
	  css: path.join( cssDir, cssEntryFile )
  },
  //entry: [
	  //'webpack-dev-server/client?http://localhost:3000',
	  //'webpack/hot/only-dev-server',
	  //'./src/button'
  //],

  output: {
    filename: 'bundle.js',
    path: path.join( __dirname, '_build' ),
    publicPath: '_build'
  },

  resolve: {
	modulesDirectories: ['.', 'src', 'node_modules','../']
  },

  module: {
	loaders: [
		{
			test: /\.js$/,
			//loaders: ["react-hot","babel"],
			loaders: [
				"babel",
				"rix-loader?cssDir="+cssDir+"&cssEntryFile="+cssEntryFile
			],
			exclude: /node_modules/
		},

		//{ test: /\.html$/, loader: "file?name=[name].[ext]" },
		{ test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader","css-loader") }
	]
  },

  devtool: 'inline-source-map',
  plugins: plugins()
};

// Notice! webpack-dev-server reads first config of array
module.exports = clientConfig;
