var loaderUtils = require("loader-utils");
var Extractor = require('react-inline/extractor');
//var util = require('util');
var path = require('path');
var fs = require('fs');
var babel = require("babel-core");
var mkdirp = require('mkdirp');
//require("babel-core/register");

var cssFileList = [];

function getRixOption( that, rixContext, query ) {

	var fileName = path.basename( that.resourcePath );
	console.log( fileName );
	var option = {
		filename: fileName,
		vendorPrefixes: query.vendorPrefixes,
		minify: query.minify,
		compressClassNames: query.compressClassNames || false,
		mediaMap: query.mediaMap,
		context: rixContext,
		cacheDir: query.cacheDir
		//sourceMapName: that.sourceMap ? fileName + '.map' : null
		//sourceMapName: 'aa.js.map'
	};
	return option;
}

function extractCss( that, css, query ) {

	if( !css ) return;

	var fileName = path.basename( that.resourcePath );
	var extName = path.extname( fileName );
	var reg = new RegExp( extName + '$' );
	var cssDir = path.join( that._compiler.context, query.cssDir || '__css__' );
	var cssFileName = fileName.replace( reg, '.rix.css' );
	var cssFilePath = path.join( cssDir, cssFileName );

	if( cssFileList.indexOf( cssFileName ) < 0 ) {
		cssFileList.push( cssFileName );
		
		var content = cssFileList.map( function( cssFile ) {
			return "require('"+cssFile+"');";
		});
		content = content.join('\n');
		var cssEntryFilePath = path.join( cssDir, query.cssEntryFile );
		fs.writeFileSync( cssEntryFilePath, content );
	}
	
	// extract css
	mkdirp( path.dirname( cssFilePath ), function (err) {

		if (err) { console.error(err); throw err; }
		
		fs.writeFile( cssFilePath, css, function( err ) {
			if( err ) { console.error( err ); throw err; }
		});
	});
}


module.exports = function( content, sourceMap ) {

	//var self = {};
	//for( var key in this ) self[ key ] = this[ key ];
	//console.log(util.inspect( self, { showHidden: true, depth: 2, colors: true }));
	//console.log( sourceMap );
	
	if(this.cacheable) this.cacheable();
	var query = loaderUtils.parseQuery( this.query );
	//console.log('---');
	//console.log( this.resourcePath );

	var callback = this.async();
	if( callback ) {
		// async mode

		var onlyContextExport;
		var babelResult = babel.transformFileSync(this.resourcePath);
		babelResult.ast.program.body.forEach( function( node ) {

			if( node.type !== 'FunctionDeclaration' ) return;
			if( node.id.name !== 'rixContext' ) return;

			var start = node.loc.start.line-1;
			var end = node.loc.end.line-1;
			
			var codeList = content.split('\n');
			codeList = codeList.splice( start, end-start+1 );
			var contextCode = codeList.join('\n');
			var reBabel = babel.transform( contextCode, { ast: false, presets: ["es2015"] });
			onlyContextExport = this.exec( reBabel.code );

		}.bind(this));
		
		var rixContext = (onlyContextExport && typeof onlyContextExport.rixContext === 'function') ? onlyContextExport.rixContext() : {};
		rixContext = typeof rixContext === 'object' ? rixContext : {};

		//var Component = this.exec( babelResult.code, this.resourcePath );
		//var rixContext = typeof Component.rixContext === 'object' ? Component.rixContext : {};
		var option = getRixOption( this, rixContext, query );

		Extractor.transformFile( this.resourcePath, option, function( err, result ) {
			if( err ) {
				console.error( err );
				this.callback( null, (result || {}).code, sourceMap );
				return;
			}

			this.callback( null, result.code, sourceMap );
			extractCss( this, result.css, query );

		}.bind(this));
		
	} else {

		// sync mode
		var babelResult = babel.transformFileSync(this.resourcePath, { ast: false });
		var Component = this.exec( babelResult.code );

		var rixContext = typeof Component.rixContext === 'object' ? Component.rixContext : {};
		var option = getRixOption( this, rixContext, query );
		var result = Extractor.transform( this.resourcePath, option );
		extractCss( this, result.css, query );
		return result.code;
	}

	return;
};
