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
Narcissus = require( 'narcissus' ),
pp = require( 'prettyprint' ).prettyprint,
path = require( 'path' );

// run the test battery
if( opts.test ){
    var sandbox = {
	"Narcissus": Narcissus,
	"tests": {}
    };

    var unitnode = require( 'unitnode' ), results = unitnode.runTests();
    unitnode.displayTestResults( results );
    
    process.exit( 0 );
}

// run the parser against each target
for( var i = 0, l = opts.target.length ; i < l ; ++i ){
    var tree = require( 'cjsdoc' ).parse( fs.readFileSync( opts.target[i] ), path.basename( opts.target[i] ) );
    console.log( pp(tree,20,['node']) );
}