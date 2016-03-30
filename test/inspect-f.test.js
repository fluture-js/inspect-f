'use strict';

const jsc = require('jsverify');
const expect = require('chai').expect;
const inspectf = require('..');

const pad = n => (new Array(n + 1)).join(' ');

describe('Inspect F', () => {

  it('is a binary function', () => {
    expect(inspectf).to.be.a('function');
    expect(inspectf.length).to.equal(2);
  });

  it('is curried', () => {
    const actual = inspectf(1);
    expect(actual).to.be.a('function');
    expect(actual.length).to.equal(1);
  });

  it('throws a TypeError when not given a number as first argument', () => {
    const xs = [{}, [], 'a', new Date, undefined, null, x => x];
    const fs = xs.map(x => () => inspectf(x));
    fs.forEach(f => expect(f).to.throw(TypeError, /inspectf/));
  });

  it('throws a TypeError when not given a function as second argument', () => {
    const xs = [NaN, {}, [], 1, 'a', new Date, undefined, null];
    const fs = xs.map(x => () => inspectf(2)(x));
    fs.forEach(f => expect(f).to.throw(TypeError, /inspectf/));
  });

  it('returns single line functions as they are', () => {
    const f = (a, b) => a + b;
    const actual = inspectf(2, f);
    const expected = '(a, b) => a + b';
    expect(actual).to.equal(expected);
  });

  it('adjusts indentation level appropriately', () => {
    const fromArbitraryIndentation = jsc.forall('nat', x => {
      const f = new Function(pad(x) + 'foo() + bar()');
      const actual = inspectf(2, f).split('\n')[1];
      const expected = pad(Math.min(2, x)) + 'foo() + bar()';
      return expected === actual || 'Failed fromArbitraryIndentation'
        + `\n  Expected: "${expected}"\n  Actual: "${actual}"\n  Input: ${x}`;
    });
    const toArbitraryIndentation = jsc.forall('nat', x => {
      const f = new Function('  foo() + bar()');
      const actual = inspectf(x, f).split('\n')[1];
      const expected = pad(x) + 'foo() + bar()';
      return expected === actual || 'Failed toArbitraryIndentation'
        + `\n  Expected: "${expected}"\n  Actual: "${actual}"\n  Input: ${x}`;
    });
    jsc.assert(fromArbitraryIndentation);
    jsc.assert(toArbitraryIndentation);
  });

  it('converts tabs to spaces', () => {
    const input = '\tfoo(\n\t\t"bar"\n\t)';
    const f = new Function(input);
    const expected = '  foo(\n    "bar"\n  )';
    const actual = inspectf(2, f);
    expect(actual).to.not.contain(input);
    expect(actual).to.contain(expected);
  });

  it('does not choke on empty functions', () => {
    const f = new Function('\n  \n  \n  ');
    const actual = inspectf(2, f);
    expect(actual).to.contain('\n  \n  \n  ');
  });

  it('does not mess with custom toString functions', () => {
    const f = () => {};
    f.toString = () => 'Hello\n    world!';
    expect(inspectf(2, f)).to.equal('Hello\n    world!');
  });

});
