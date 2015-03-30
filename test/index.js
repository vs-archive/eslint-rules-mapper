/*eslint no-console:0, no-inline-comments:0, max-statements:0*/
var map = require('../lib/jshint').map;

var jshintRules = {
  bitwise: true,      // Prohibits the use of bitwise operators such as ^ (XOR), | (OR)
  camelcase: true,    // Force all variable names to use either camelCase style or UPPER_CASE with underscores
  curly: true,        // Require {} for every new block or scope
  eqeqeq: true,       // Require triple equals (===) for comparison
  forin: true,        // Requires all for in loops to filter object's items
  freeze: true,
  immed: true,        // Require immediate invocations to be wrapped in parens e.g. `(function () { } ());`
  indent: 2,          // Enforces specific tab width for your code
  latedef: 'nofunc',  // Require variables/functions to be defined before being used
  maxcomplexity: 5,
  maxdepth: 3,
  maxlen: 120,
//  maxparams: 3,
  maxstatements: 15,
  newcap: true,       // Require capitalization of all constructor functions e.g. `new F()`
  noarg: true,        // Prohibit use of `arguments.caller` and `arguments.callee`
  //nocomma: true,    // works incorectly
  noempty: true,      // Warns when you have an empty block in your code
  nonbsp: true,
  nonew: true,
  strict: false,      // Requires all functions to run in ECMAScript 5's strict mode
  trailing: true,     // Makes it an error to leave a trailing whitespace in your code
  quotmark: 'single', // Enforces the consistency of quotation marks
  undef: true,        // Require all non-global variables to be declared (prevents global leaks)
  unused: true,       // Warns when you define and never use your variables

  eqnull: false,
  expr: true,
  funcscope: true,

  browser: true,      // browser
  jquery: true,       // jQuery, $
  mocha: true,        // bdd globals: describe, it, before, after ...
  node: true,         // node.js

  globals: {
    _: true,          // lodash
    d3: true,         // d3
    angular: false,   // angular.js
    io: true,         // socket.io
    moment: true      // moment.js
  }
};

var util = require('util');
console.log(util.inspect(map(jshintRules)));
