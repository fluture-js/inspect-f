# inspect-f

[![NPM Version](https://badge.fury.io/js/inspect-f.svg)](https://www.npmjs.com/package/inspect-f)
[![Dependencies](https://david-dm.org/avaq/inspect-f.svg)](https://david-dm.org/avaq/inspect-f)
[![Build Status](https://travis-ci.org/Avaq/inspect-f.svg?branch=master)](https://travis-ci.org/Avaq/inspect-f)
[![Code Coverage](https://codecov.io/github/Avaq/inspect-f/coverage.svg?branch=develop)](https://codecov.io/github/Avaq/inspect-f/inspect-f.js?branch=develop)

Cast a function to string and adjust its indentation. Intended for rendering
function bodies in `pre`-tags or consoles and what have you.

> `npm install --save inspect-f` <sup>Requires a node 5.0.0 compatible
  environment like modern browsers, transpilers or Node 5+</sup>


## Usage

Let's say we have this deeply indented function which uses a 6-space indentation scheme:

```js
          function someDeeplyIndentedFunction(a, b){
                return (
                      a + b
                );
          }
```

Then the following:

```js
const inspectf = require('inspect-f');
console.log(inspectf(2, someDeeplyIndentedFunction));
```

Would output:

```js
function someDeeplyIndentedFunction(a, b){
  return (
    a + b
  );
}
```
