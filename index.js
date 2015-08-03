var fs = require('fs');
var _ = require('lodash');
var stripJsonComments = require('strip-json-comments');
var map = require('./lib/jshint').map;

// Parse file path to jshintrc file
var args = process.argv.slice(2);
var jshintFilePath = args[0];

// Check if argument exists
if (!jshintFilePath) {
  console.log('Please specify the path to your .jshintrc file');
  process.exit(1);
}

// Chefk if .jshintrc file exists
if (!fs.existsSync(jshintFilePath)) {
  console.log('The .jshintrc file specified does not exist');
  process.exit(1);
}

// Read jshintrc file
var jshintContents = fs.readFileSync(jshintFilePath);
var jshintRules = JSON.parse(stripJsonComments(jshintContents));

// Disable console.log statements before running this, to ensure we can pipe results only
console.log = function noop() {};

// Convert to eslint json
var eslintResult = map(jshintRules);
var eslintEnv = eslintResult.env;
var eslintGlobals = eslintResult.globals || {};
var eslintRules = sortObject(_.omit(eslintResult, 'env', 'globals'));
var eslintJson = {
  env: eslintEnv,
  globals: eslintGlobals,
  rules: eslintRules
};

// Write output to stdout
var output = JSON.stringify(eslintJson, null, 2);
process.stdout.write(output);

/**
 * Sorts the keys in an object.
 */
function sortObject(obj) {
  var keys = Object.keys(obj);
  var sortedKeys = keys.sort();
  var sortedObj = {};

  sortedKeys.forEach(function x(key) {
    sortedObj[key] = obj[key];
  });

  return sortedObj;
}
