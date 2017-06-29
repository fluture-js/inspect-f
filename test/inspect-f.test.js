'use strict';

var jsc = require('jsverify');
var expect = require('chai').expect;
var inspectf = require('..');
var pad = function(n) { return (new Array(n + 1)).join(' '); };
var id = function(x) { return x; };

describe('Inspect F', function() {

  it('is a binary function', function() {
    expect(inspectf).to.be.a('function');
    expect(inspectf.length).to.equal(2);
  });

  it('is curried', function() {
    var actual = inspectf(1);
    expect(actual).to.be.a('function');
    expect(actual.length).to.equal(1);
  });

  it('throws a TypeError when not given a number as first argument', function() {
    var xs = [{}, [], 'a', new Date, undefined, null, id];
    var fs = xs.map(function(x) {
      return function() {
        return inspectf(x);
      };
    });
    fs.forEach(function(f) { expect(f).to.throw(TypeError, /inspectf/); });
  });

  it('throws a TypeError when not given a function as second argument', function() {
    var xs = [NaN, {}, [], 1, 'a', new Date, undefined, null];
    var fs = xs.map(function(x) {
      return function() {
        return inspectf(2)(x);
      };
    });
    fs.forEach(function(f) { expect(f).to.throw(TypeError, /inspectf/); });
  });

  it('returns single line functions as they are', function() {
    var f = function (a, b) { return a + b; };
    var actual = inspectf(2, f);
    var expected = 'function (a, b) { return a + b; }';
    expect(actual).to.equal(expected);
  });

  it('adjusts indentation level appropriately', function() {
    var formatFailure = function(expected, actual, input) {
      return ''
        + '\n  Expected: "' + expected + '"'
        + '\n  Actual: "' + actual + '"'
        + '\n  Input: "' + input + '"';
    };
    var fromArbitraryIndentation = jsc.forall('nat', function(x) {
      var f = new Function(pad(x) + 'foo() + bar()');
      var actual = inspectf(2, f).split('\n')[1];
      var expected = pad(x) + 'foo() + bar()';
      return expected === actual || 'Failed fromArbitraryIndentation'
        + formatFailure(expected, actual, x);
    });
    var toArbitraryIndentation = jsc.forall('nat', function(x) {
      var f = new Function('  foo() + bar()');
      var actual = inspectf(x, f).split('\n')[1];
      var expected = pad(x) + 'foo() + bar()';
      return expected === actual || 'Failed toArbitraryIndentation'
        + formatFailure(expected, actual, x);
    });
    jsc.assert(fromArbitraryIndentation);
    jsc.assert(toArbitraryIndentation);
  });

  it('converts tabs to spaces', function() {
    var input = '\tfoo(\n\t\t"bar"\n\t)';
    var f = new Function(input);
    var expected = '  foo(\n    "bar"\n  )';
    var actual = inspectf(2, f);
    expect(actual).to.not.contain(input);
    expect(actual).to.contain(expected);
  });

  it('does not choke on empty functions', function() {
    var f = new Function('\n  \n  \n  ');
    var actual = inspectf(2, f);
    expect(actual).to.contain('\n  \n  \n  ');
  });

  it('does not mess with custom toString functions', function() {
    var f = function() {};
    f.toString = function() { return 'Hello\n    world!'; };
    expect(inspectf(2, f)).to.equal('Hello\n    world!');
  });

});
