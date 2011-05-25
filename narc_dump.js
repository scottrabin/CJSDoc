#!/usr/bin/node

var target, depth = 10;

if( process.argv.length === 4 ){
    target = process.argv[3];
    depth = process.argv[2];
} else if( process.argv.length === 3 ){
    target = process.argv[2];
} else {
    console.error( "No target specified\nUsage: node narc_dump.js [output_depth] target" );
    process.exit(1);
}

var narc = require( 'narcissus' ),
pp = require( 'prettyprint' ).prettyprint,
fs = require( 'fs' ),
path = require( 'path' );

console.log(
  pp(
    narc.parser.parse(
      fs.readFileSync( target ),
      path.basename( target )
    ),
    depth
  )
);