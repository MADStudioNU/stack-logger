## Stack Logger
[![Build Status](https://travis-ci.org/mmlc/stack-logger.svg?branch=master)](https://travis-ci.org/mmlc/stack-logger)

Easily build up a log trail while writing modules.

## Usage Notes

```js
// There are 4 StackLogger types, corresponding to console methods
StackLogger.Error
StackLogger.Warn
StackLogger.Info
StackLogger.Log

// These are aliases of the generic StackLogger
StackLogger.Error()
// is the same as
StackLogger('error')

// A StackLogger can be initialized with its topmost message
var _error = StackLogger.Error('My Error Generating Class has an Error:')

// StackLogger combines stacked messages with '\n\t'
_error.log('Bad input.') // equiv.: console.error('My Error Generating Class has an Error:\n\tBad input.')

// StackLogger is meant to be used to build up a trail of information while writing modules
// This helps narrow down where errors are coming from, especially in certain contexts (like async
//   callbacks) where stack traces aren't always that helpful
function method () {
  // StackLogger.push and StackLogger.pop are immutable updates, so _error is unaltered.
  var _methodError = _error.push('Method: [MyErrorGeneratingClass::method]');

  // some time later...
  _methodError.log('That\'s no good. Stop that.');
  // console error output:
  //    'My Error Generating Class has an Error:'
  //    '  Method: [MyErrorGeneratingClass::method]'
  //    '  That\'s no good. Stop that.'

  _error.log('I am still here.')
  // console error output:
  //    'My Error Generating Class has an Error:'
  //    '  I am still here.'

  // Let's try using StackLogger in some async code. We'll need this function:
  function failCallback (logger) {
    return function (response) {
      logger.log('The asynchronous request failed with error code: ' + response.status)
    }
  }

  // Now let's send a GET request from the method we're currently in:
  $.get('my-api/v1.0.3/endpoint')
  .then(function (data) {
    // ...
  })
  .catch(failCallback(_methodError))
  // Now if the GET request fails, our console error will tell use that we were in this method
}

// StackLogger also has #pop()
var _error = _methodError.pop(); // => StackLogger

_error.log('Hello!') // console error output: 'My Error Generating Class has an Error:\n\tHello!'

_error = _error.pop()    // => StackLogger

_error.log('Hello!') // consoler error output: 'Hello!'
```
