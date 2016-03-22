/*global define*/
(function(global, f){

  'use strict';

  /*istanbul ignore next*/
  if(typeof module !== 'undefined'){
    module.exports = f();
  }

  else if(typeof define === 'function' && define.amd){
    define([], f);
  }

  else{
    global.inspectf = f();
  }

}(/*istanbul ignore next*/(global || window || this), function(){

  'use strict';

  function checkn(n){
    if(typeof n !== 'number') throw new TypeError(
      'inspectf expects its first argument to be a number'
    );
  }

  function checkf(f){
    if(typeof f !== 'function') throw new TypeError(
      'inspectf expects its second argument to be a function'
    );
  }

  const RSPACE = /^ */;
  const RCODE = /\s*[^\s]/;
  const RTABS = /\t/g;
  const REOL = /\n\r?/;

  function getPadding(line){
    return line.match(RSPACE)[0].length;
  }

  function guessIndentation(lines){
    const filtered = lines.filter(x => RCODE.test(x));
    const paddings = filtered.map(getPadding);
    const depth = paddings.reduce((a, b) => Math.min(a, b), Infinity);
    const tabsize = paddings.map(x => x - depth).find(x => x > 1) || 2;
    return {depth, tabsize};
  }

  function pad(n){
    return (new Array(n + 1)).join(' ');
  }

  return function inspectf(n, f){
    checkn(n);
    if(arguments.length < 2) return f => inspectf(n, f);
    checkf(f);
    const padding = pad(n);
    const shown = f.toString().replace(RTABS, padding);
    const lines = shown.split(REOL);
    if(lines.length < 2) return shown;
    const i = guessIndentation(lines.slice(1));
    const RPAD = new RegExp(pad(i.tabsize), 'g');
    return lines.map(line =>
      line.slice(Math.min(i.depth, getPadding(line)))
      .replace(RPAD, '\t').replace(RTABS, padding)
    ).join('\n');
  }

}));
