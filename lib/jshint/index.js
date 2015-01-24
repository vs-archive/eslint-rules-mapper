/*eslint no-console:0, no-inline-comments:0, max-statements:0*/
var _ = require('lodash');

var rulesMap = require('./jshintRulesMap');

module.exports.map = map;

function map(jshintConf) {
  if (!jshintConf) {
    throw new Error('JSHint config is required!');
  }

  var enforceAll = jshintConf.enforceall;

  var result = {globals: jshintConf.globals};

   _.reduce(rulesMap, mapJsHintRulesToEsLintRules, result);

  return result;

  function mapJsHintRulesToEsLintRules(res, eslintRule, key) {
    var val = jshintConf[key];

    if (enforceAll && _.isBoolean(val)) {
      val = true;
    }

    // skip relaxing options in enforce mode
    if (enforceAll && eslintRule.isRelaxing) {
      return res;
    }

    // report not supported properties
    if (eslintRule.notSupported) {
      if (typeof val !== 'undefined') {
        console.log('Unsupported jshint rule: ' + key);
      }

      return res;
    }

    // value options
    if (eslintRule.opts === 'inherit') {
      if (!val) {
        return res;
      }

      if (!_.isNumber(val)) {
        throw new Error('Incorrect value for ' + key +
        ', expected Number, got: ' + val);
      }

      if (key === 'maxlen') {
        res[eslintRule.name] = [2, val, jshintConf.indent || 2];
        return res;
      }

      res[eslintRule.name] = [2, val];
      return res;
    }

    if (eslintRule.map) {
      res[eslintRule.name] = eslintRule.map(val);
      return res;
    }

    // is rule enabled
    var isRuleEnabled = isEnabled(val);

    // skip disabled relaxing rules
    if (eslintRule.isRelaxing && isRuleEnabled !== 2) {
      return res;
    }

    if (_.isFunction(eslintRule)) {
      var rule = eslintRule(val);
      res[rule.name] = isRuleEnabled;
      return res;
    }

    if (_.isNumber(eslintRule.opts)) {
      res[eslintRule.name] = isRuleEnabled;
      return res;
    }

    if (_.isArray(eslintRule.opts)) {
      var opts = eslintRule.opts.slice();
      if (!eslintRule.isRelaxing) {
        opts[0] = isRuleEnabled;
      }

      res[eslintRule.name] = opts;
      return res;
    }

    // environment variables
    if (eslintRule.isEnv) {
      res.env = res.env || {};
      res.env[eslintRule.name] = val !== false;
      return res;
    }

    console.log(key, val, eslintRule);
    throw new Error('Unhandled jshint rule: ' + key);

    function isEnabled(v) { return v === false ? 0 : 2; }
  }
}

