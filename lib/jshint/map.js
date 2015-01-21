/*eslint no-console:0, no-inline-comments:0*/
var _ = require('lodash');

module.exports = map;

function map(jshintConf) {
  // todo: map globals, maxerr
  // todo: implement indent
  // todo: find more info for: es3, es5, supernew
  var rulesMap = {
    bitwise: {name: 'no-bitwise', opts: 2},
    camelcase: {name: 'no-bitwise', opts: 2},
    curly: {name: 'curly', opts: [2, 'all']},
    // should I apply def rules here?
    enforceall: {name: null, opts: null},
    eqeqeq: {name: 'eqeqeq', opts: [2], relatedTo: ['eqnull']},
    forin: {name: 'guard-for-in', opts: 2},
    freeze: {name: 'no-extend-native', opts: 2},
    immed: {name: 'wrap-iife', opts: [2, 'inside']},
    //indent: {name: 'no-mixed-spaces-and-tabs', opts: [2, 'inside']},
    latedef: {
      name: 'no-use-before-define', map: function map(v) {
        return v === 'nofunc' ? [2, 'nofunc'] : v;
      }
    },
    maxcomplexity: {name: 'complexity', opts: 'inherit'},
    maxdepth: {name: 'max-depth', opts: 'inherit'},
    maxlen: {name: 'max-len', opts: 'inherit', default: [2, 'inherit', 'indent']},
    maxparams: {name: 'max-params', opts: 'inherit'},
    maxstatements: {name: 'max-statements', opts: 'inherit'},
    newcap: {name: 'new-cap', opts: 2},
    noarg: {name: 'no-caller', opts: 2},
    // todo: check or||and no-comma-dangle
    nocomma: {name: 'no-sequences', opts: 2},
    nonbsp: {name: 'no-irregular-whitespace', opts: 2},
    nonew: {name: 'no-new', opts: 2},
    notypeof: {name: 'valid-typeof', opts: 2},
    quotmark: {name: 'quotes', opts: 2},
    shadow: {
      name: 'no-shadow', map: function map(v) {
        // todo: innner = no-redeclare, outer = no-shadow
        switch (v) {
          case true:
            return 2;
          // same as `inner`
          case false:
          case 'inner':
            return {name: 'no-redeclare', opts: 2};
          case 'outer':
            return 2;
          default:
            return 2;
        }
      }
    },
    singleGroups: {name: 'no-extra-parens', opts: 2},
    undef: {name: 'no-undef', opts: 2},
    unused: {name: 'no-unused-vars', opts: 2},

    // easy
    eqnull: {name: 'eqeqeq', opts: [2, 'smart'], relatedTo: ['eqnull']},
    funcscope: {name: 'block-scoped-var', opts: 1},
    globalstrict: {name: 'global-strict', opts: [2, 'never']},
    iterator: {name: 'no-iterator', opts: 1}
  };

  // todo: update multistr
  var relaxingOptions = {
    asi: {name: 'semi', opts: [0, 'never']},
    /**
     * This option suppresses warnings about multi-line strings. Multi-line
     * strings can be dangerous in JavaScript because all hell breaks loose if
     * you accidentally put a whitespace in between the escape character (`\`)
     * and a new line.
     *
     * Note that even though this option allows correct multi-line strings, it
     * still warns about multi-line strings without escape characters or with
     * anything in between the escape character and a whitespace.
     *
     *     // jshint multistr:true
     *
     *     var text = "Hello\
     *     World"; // All good.
     *
     *     text = "Hello
     *     World"; // Warning, no escape character.
     *
     *     text = "Hello\
     *     World"; // Warning, there is a space after \
     */
    multistr: {name: 'no-multi-str', opts: 0},

    debug: {name: 'no-debugger', opts: 0},
    boss: {name: 'no-cond-assign', opts: [2, 'except-parens']},

    /**
     * This option suppresses warnings about the use of `eval`. The use of
     * `eval` is discouraged because it can make your code vulnerable to
     * various injection attacks and it makes it hard for JavaScript
     * interpreter to do certain optimizations.
     */
    evil: {name: 'no-eval', opts: 0},

    /**
     * This option prohibits the use of unary increment and decrement
     * operators.  Some people think that `++` and `--` reduces the quality of
     * their coding styles and there are programming languages—such as
     * Python—that go completely without these operators.
     */
    plusplus: {name: 'no-plusplus', opts: 2},

    /**
     * This option suppresses warnings about the `__proto__` property.
     */
    proto: {name: 'no-proto', opts: 0},

    /**
     * This option suppresses warnings about the use of script-targeted
     * URLs—such as `javascript:...`.
     */
    scripturl: {name: 'no-script-url', opts: 0},

    /**
     * This option requires all functions to run in ECMAScript 5's strict mode.
     * [Strict mode](https://developer.mozilla.org/en/JavaScript/Strict_mode)
     * is a way to opt in to a restricted variant of JavaScript. Strict mode
     * eliminates some JavaScript pitfalls that didn't cause errors by changing
     * them to produce errors.  It also fixes mistakes that made it difficult
     * for the JavaScript engines to perform certain optimizations.
     *
     * *Note:* This option enables strict mode for function scope only. It
     * *prohibits* the global scoped strict mode because it might break
     * third-party widgets on your page. If you really want to use global
     * strict mode, see the *globalstrict* option.
     */
    strict: {name: 'strict', opts: 2},

    /**
     * This option suppresses warnings about using `[]` notation when it can be
     * expressed in dot notation: `person['name']` vs. `person.name`.
     */
    sub: {name: 'dot-notation', opts: [0, {"allowKeywords": true}]},

    /**
     * This option suppresses warnings about "weird" constructions like
     * `new function () { ... }` and `new Object;`. Such constructions are
     * sometimes used to produce singletons in JavaScript:
     *
     *     var singleton = new function() {
     *       var privateVar;
     *
     *       this.publicMethod  = function () {}
     *       this.publicMethod2 = function () {}
     *     };
     */
    supernew: true,

    /**
     * This option suppresses most of the warnings about possibly unsafe line
     * breakings in your code. It doesn't suppress warnings about comma-first
     * coding style. To suppress those you have to use `laxcomma` (see below).
     */
    laxbreak: true,

    /**
     * This option suppresses warnings about comma-first coding style:
     *
     *     var obj = {
     *         name: 'Anton'
     *       , handle: 'valueof'
     *       , role: 'SW Engineer'
     *     };
     */
    laxcomma: true,

    /**
     * This option suppresses warnings about possible strict violations when
     * the code is running in strict mode and you use `this` in a
     * non-constructor function. You should use this option—in a function scope
     * only—when you are positive that your use of `this` is valid in the
     * strict mode (for example, if you call your function using
     * `Function.call`).
     *
     * **Note:** This option can be used only inside of a function scope.
     * JSHint will fail with an error if you will try to set this option
     * globally.
     */
    validthis: true,

    /**
     * This option suppresses warnings about the use of the `with` statement.
     * The semantics of the `with` statement can cause confusion among
     * developers and accidental definition of global variables.
     *
     * More info:
     *
     * * [with Statement Considered
     *   Harmful](http://yuiblog.com/blog/2006/04/11/with-statement-considered-harmful/)
     */
    withstmt: true,

    /**
     * This options tells JSHint that your code uses Mozilla JavaScript
     * extensions. Unless you develop specifically for the Firefox web browser
     * you don't need this option.
     *
     * More info:
     *
     * * [New in JavaScript
     *   1.7](https://developer.mozilla.org/en-US/docs/JavaScript/New_in_JavaScript/1.7)
     */
    moz: true,

    /**
     * This option suppresses warnings about generator functions with no
     * `yield` statement in them.
     */
    noyield: true,

    /**
     * This option suppresses warnings about `== null` comparisons. Such
     * comparisons are often useful when you want to check if a variable is
     * `null` or `undefined`.
     */
    eqnull: true,

    /**
     * This option suppresses warnings about missing semicolons, but only when
     * the semicolon is omitted for the last statement in a one-line block:
     *
     *     var name = (function() { return 'Anton' }());
     *
     * This is a very niche use case that is useful only when you use automatic
     * JavaScript code generators.
     */
    lastsemic: true,

    /**
     * This option suppresses warnings about functions inside of loops.
     * Defining functions inside of loops can lead to bugs such as this one:
     *
     *     var nums = [];
     *
     *     for (var i = 0; i < 10; i++) {
     *       nums[i] = function (j) {
     *         return i + j;
     *       };
     *     }
     *
     *     nums[0](2); // Prints 12 instead of 2
     *
     * To fix the code above you need to copy the value of `i`:
     *
     *     var nums = [];
     *
     *     for (var i = 0; i < 10; i++) {
     *       (function (i) {
     *         nums[i] = function (j) {
     *             return i + j;
     *         };
     *       }(i));
     *     }
     */
    loopfunc: true,

    /**
     * This option suppresses warnings about the use of expressions where
     * normally you would expect to see assignments or function calls. Most of
     * the time, such code is a typo. However, it is not forbidden by the spec
     * and that's why this warning is optional.
     */
    expr: true,

    /**
     * This option tells JSHint that your code uses ECMAScript 6 specific
     * syntax. Note that these features are not finalized yet and not all
     * browsers implement them.
     *
     * More info:
     *
     * * [Draft Specification for ES.next (ECMA-262 Ed.
     *   6)](http://wiki.ecmascript.org/doku.php?id=harmony:specification_drafts)
     */
    esnext: true,

    /**
     * This option tells JSHint that your code uses ES3 array elision elements,
     * or empty elements (for example, `[1, , , 4, , , 7]`).
     */
    elision: true
  };

  var envOptions = {
    /**
     * This option defines globals available when your core is running inside
     * of the PhantomJS runtime environment. [PhantomJS](http://phantomjs.org/)
     * is a headless WebKit scriptable with a JavaScript API. It has fast and
     * native support for various web standards: DOM handling, CSS selector,
     * JSON, Canvas, and SVG.
     */
    phantom: true,

    /**
     * This option defines globals exposed by the
     * [MooTools](http://mootools.net/) JavaScript framework.
     */
    mootools: true,

    /**
     * This option defines globals exposed by
     * [CouchDB](http://couchdb.apache.org/). CouchDB is a document-oriented
     * database that can be queried and indexed in a MapReduce fashion using
     * JavaScript.
     */
    couch: true,

    /**
     * This option defines globals exposed by [the Jasmine unit testing
     * framework](https://jasmine.github.io/).
     */
    jasmine: true,

    /**
     * This option defines globals exposed by the [jQuery](http://jquery.com/)
     * JavaScript library.
     */
    jquery: true,

    /**
     * This option defines globals available when your code is running inside
     * of the Node runtime environment. [Node.js](http://nodejs.org/) is a
     * server-side JavaScript environment that uses an asynchronous
     * event-driven model. This option also skips some warnings that make sense
     * in the browser environments but don't make sense in Node such as
     * file-level `use strict` pragmas and `console.log` statements.
     */
    node: true,

    /**
     * This option defines globals exposed by [the QUnit unit testing
     * framework](http://qunitjs.com/).
     */
    qunit: true,

    /**
     * This option defines globals available when your code is running inside
     * of the Rhino runtime environment. [Rhino](http://www.mozilla.org/rhino/)
     * is an open-source implementation of JavaScript written entirely in Java.
     */
    rhino: true,

    /**
     * This option defines globals exposed by [the ShellJS
     * library](http://documentup.com/arturadib/shelljs).
     */
    shelljs: true,

    /**
     * This option defines globals exposed by the
     * [Prototype](http://www.prototypejs.org/) JavaScript framework.
     */
    prototypejs: true,

    /**
     * This option defines globals exposed by the [YUI](http://yuilibrary.com/)
     * JavaScript framework.
     */
    yui: true,

    /**
     * This option defines globals exposed by the "BDD" and "TDD" UIs of the
     * [Mocha unit testing framework](http://mochajs.org/).
     */
    mocha: true,

    /**
     * This option defines globals available when your code is running as a
     * script for the [Windows Script
     * Host](http://en.wikipedia.org/wiki/Windows_Script_Host).
     */
    wsh: true,

    /**
     * This option defines globals available when your code is running inside
     * of a Web Worker. [Web
     * Workers](https://developer.mozilla.org/en/Using_web_workers) provide a
     * simple means for web content to run scripts in background threads.
     */
    worker: true,

    /**
     * This option defines non-standard but widely adopted globals such as
     * `escape` and `unescape`.
     */
    nonstandard: true,

    /**
     * This option defines globals exposed by modern browsers: all the way from
     * good old `document` and `navigator` to the HTML5 `FileReader` and other
     * new developments in the browser world.
     *
     * **Note:** This option doesn't expose variables like `alert` or
     * `console`. See option `devel` for more information.
     */
    browser: true,

    /**
     * This option defines globals available when using [the Browserify
     * tool](http://browserify.org/) to build a project.
     */
    browserify: true,

    /**
     * This option defines globals that are usually used for logging poor-man's
     * debugging: `console`, `alert`, etc. It is usually a good idea to not
     * ship them in production because, for example, `console.log` breaks in
     * legacy versions of Internet Explorer.
     */
    devel: true,

    /**
     * This option defines globals exposed by the [Dojo
     * Toolkit](http://dojotoolkit.org/).
     */
    dojo: true,

    /**
     * This option defines globals for typed array constructors.
     *
     * More info:
     *
     * * [JavaScript typed
     *   arrays](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays)
     */
    typed: true
  };

  return _.reduce(jshintConf, function mapJsHintRuleToEsLintRule(res, val, key) {
    var eslintRule = rulesMap[key];
    if (!eslintRule) {
      throw new Error('Unknown jshint rule: ' + key);
    }

    if (key === 'maxlen') {
      res[eslintRule.name] = [2, val, res.indent || 2];
    }

    if (eslintRule.opts === 'inherit') {
      res[eslintRule.name] = [2, val];
      return;
    }

    if (eslintRule.map) {
      // todo: update for `shadow` rule
      res[eslintRule.name] = eslintRule.map(val);
      return;
    }

    var isEnabled = val === true ? 2 : 0;
    if (Number.isNumber(eslintRule.opts)) {
      res[eslintRule.name] = isEnabled;
      return;
    }

    if (Array.isArray(eslintRule.opts)) {
      var opts = eslintRule.opts.slice();
      opts[0] = isEnabled;
      res[eslintRule.name] = opts;
      return;
    }

    console.log(key, val, eslintRule);
    throw new Error('Unhandled jshint rule: ' + key);
  }, {});
}

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

  eqnull: true,
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

var result = map(jshintRules);
console.log(result);
