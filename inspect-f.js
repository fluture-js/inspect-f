(function(global, f) {

  'use strict';

  /*istanbul ignore next*/
  if(typeof module !== 'undefined') {
    module.exports = f();
  } else if(typeof global.define === 'function' && global.define.amd) {
    global.define([], f);
  } else{
    global.inspectf = f();
  }

}(/*istanbul ignore next*/(global || window || this), () => {

  'use strict';

  function checkn(n) {
    if(typeof n !== 'number') {
      throw new TypeError(
      'inspectf expects its first argument to be a number'
    );
    }
  }

  function checkf(f) {
    if(typeof f !== 'function') {
      throw new TypeError(
      'inspectf expects its second argument to be a function'
    );
    }
  }

  const RSPACE = /^ */;
  const RCODE = /\s*[^\s]/;
  const RTABS = /\t/g;
  const REOL = /\n\r?/;

  function getPadding(line) {
    return line.match(RSPACE)[0].length;
  }

  function guessIndentation(lines) {
    const filtered = lines.filter(x => RCODE.test(x));
    const paddings = filtered.map(getPadding);
    const depth = paddings.reduce((a, b) => Math.min(a, b), Infinity);
    const tabsize = paddings.map(x => x - depth).find(x => x > 1) || 2;
    return {depth, tabsize};
  }

  function pad(n) {
    return (new Array(n + 1)).join(' ');
  }

  function show(f, indentation) {
    return f.toString().replace(RTABS, indentation);
  }

  function toLines(s) {
    return s.split(REOL);
  }

  function fixIndentation(lines, indentation) {
    const info = guessIndentation(lines.slice(1));
    const RPAD = new RegExp(pad(info.tabsize), 'g');
    return lines.map(line =>
      line.slice(Math.min(info.depth, getPadding(line)))
      .replace(RPAD, '\t').replace(RTABS, indentation)
    ).join('\n');
  }

  return function inspectf(n, f) {
    checkn(n);
    if(arguments.length < 2) {return f => inspectf(n, f);}
    checkf(f);
    if(f.toString !== Function.prototype.toString) {return f.toString();}
    const i = pad(n), shown = show(f, i), lines = toLines(shown, i);
    if(lines.length < 2) {return shown;}
    return fixIndentation(lines, i);
  };

}));
