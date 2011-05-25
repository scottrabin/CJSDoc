#!/usr/bin/node

// Attempt to parse the input parameters
var optParser = require( 'opts/options' ), opts;

try {
    // load the configuration
    optParser.loadConfiguration( './optconf.json' );
    // parse the command line options
    opts = optParser.parse( process.argv.slice( 2 ) );
} catch (x) {
    console.log( "An error occurred while parsing the command line options:\n" + x);
    process.exit( 1 );
}

// help requested or no arguments passed, print help file

if( opts.help || process.argv.length === 2 ){
    console.log( optParser.printHelp() );
    process.exit( 0 );
}

// require needed modules
var fs = require( 'fs' ),
cjsdoc = require( 'cjsdoc' ),
pp = require( 'prettyprint' ).prettyprint,
path = require( 'path' );

// run the test battery
if( opts.test ){
    var run = require( './tests/run' );
    process.exit( 0 );
} else if( opts.ast > 0 ){
    var narc = require( 'narcissus' );
    console.log( pp( narc.parser.parse( fs.readFileSync( opts.target[0] ) ), opts.ast, 0, ['tokenizer'] ) );
    process.exit( 0 );
}

// run the parser against each target
var master = [], tree;
for( var i = 0, l = opts.target.length ; i < l ; ++i ){
    tree = cjsdoc.parse(
	fs.readFileSync( opts.target[i] ),
	path.basename( opts.target[i] ),
	master
    );

    master.push( tree );

}

if( opts['no-translate'] ){
    console.log( pp( master, 20, 0, ['parent'] ) );
} else {
    master = cjsdoc.translate( master );

    console.log( pp( master, 20, 0, ['parent'] ) );
}