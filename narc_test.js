#!/usr/bin/node

// Attempt to parse the input parameters
var optParser = require( 'opts/options' ), opts;

try {
    // load the configuration
    optParser.loadConfiguration( './optconf.json' );
    // parse the command line options
    opts = optParser.parse( process.argv.slice( 2 ) );
} catch (x) {
    console.log( "An error occurred while parsing the command line options:\n" + x.message );
    process.exit( 1 );
}

// help requested or no arguments passed, print help file
if( opts.help || process.argv.length === 2 ){
    console.log( optParser.printHelp() );
    process.exit( 0 );
}

var Narcissus = require( 'narcissus' ),
fs = require( 'fs' ),
prettyprint = require( 'prettyprint' ).prettyprint;

var src = fs.readFileSync( opts._[0] ),
ast = Narcissus.parser.parse( src, '', 1 ),
node = null;

function copy_object( obj, depth, blacklist ){
    if( isNaN( depth ) ){
	depth = 1;
    }
    if( Object.prototype.toString.call( blacklist ) !== "[object Array]" ){
	blacklist = [];
    }
    var type = Object.prototype.toString.call( obj );

    if( type === "[object Object]" ){
	if( depth < 0 )
	    return type;
	var r = {};
	for( var x in obj ){
	    if( blacklist.indexOf(x) > -1 ){ continue; }
	    r[x] = copy_object( obj[x], depth - 1, blacklist );
	}
	return r;
    } else if( type === "[object Array]" ){
	if( depth < 0 )
	    return type;
	var r = [];
	for( var i = 0, l = obj.length; i < l ; ++i ){
	    r[i] = copy_object( obj[i], depth - 1, blacklist );
	}
	return r;
    }
    else if( type !== "[object Function]" ){
	return obj;
    } else {
	return type;
    }
}

function parseAST( ast, blacklist ){
    blacklist = blacklist || [];
    var nodes = [], nodeProp;
    for( var i = 0, l = ast.children.length ; i < l ; ++i ){
	nodes[i] = copy_object( ast.children[i], 10, blacklist );
    }
    return nodes;
}

var newast = parseAST( ast, ['tokenizer'] );
console.log( prettyprint( newast, 10 ) );

function typeToName(type) {
    var name;
    if (name = typeToName.types[type]) {
        return name;
    }
    return type;
}
typeToName.types = ['END', 'NEWLINE', 'SEMICOLON', 'COMMA', 'ASSIGN', 'HOOK', 'COLON', 'CONDITIONAL', 'OR', 'AND', 'BITWISE_OR', 'BITWISE_XOR', 'BITWISE_AND', 'EQ', 'NE', 'STRICT_EQ', 'STRICT_NE', 'LT', 'LE', 'GE', 'GT', 'LSH', 'RSH', 'URSH', 'PLUS', 'MINUS', 'MUL', 'DIV', 'MOD', 'NOT', 'BITWISE_NOT', 'UNARY_PLUS', 'UNARY_MINUS', 'INCREMENT', 'DECREMENT', 'DOT', 'LEFT_BRACKET', 'RIGHT_BRACKET', 'LEFT_CURLY', 'RIGHT_CURLY', 'LEFT_PAREN', 'RIGHT_PAREN', 'SCRIPT', 'BLOCK', 'LABEL', 'FOR_IN', 'CALL', 'NEW_WITH_ARGS', 'INDEX', 'ARRAY_INIT', 'OBJECT_INIT', 'PROPERTY_INIT', 'GETTER', 'SETTER', 'GROUP', 'LIST', 'LET_BLOCK', 'ARRAY_COMP', 'GENERATOR', 'COMP_TAIL', 'IDENTIFIER', 'NUMBER', 'STRING', 'REGEXP', 'BREAK', 'CASE', 'CATCH', 'CONST', 'CONTINUE', 'DEBUGGER', 'DEFAULT', 'DELETE', 'DO', 'ELSE', 'EXPORT', 'FALSE', 'FINALLY', 'FOR', 'FUNCTION', 'IF', 'IMPORT', 'IN', 'INSTANCEOF', 'LET', 'MODULE', 'NEW', 'NULL', 'RETURN', 'SWITCH', 'THIS', 'THROW', 'TRUE', 'TRY', 'TYPEOF', 'VAR', 'VOID', 'YIELD', 'WHILE', 'WITH'];