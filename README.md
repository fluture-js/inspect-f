# inspect-f

Cast a function to string and adjust its indentation. Intended for rendering
function bodies in a `pre`-tags or console and what have you.

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
