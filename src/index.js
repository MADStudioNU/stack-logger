var Base = require('./base')

StackLogger   = function (logLevel) {
  var initMessages = [].slice.call(arguments, 1)
  return Base(logLevel, initMessages)
}

var StackLoggerFor = function (logLevel) {
  return function () {
    var args = [].slice.call(arguments)
    return StackLogger.apply(null, [ logLevel ].concat(args))
  }
}

StackLogger.Error = StackLoggerFor('error')
StackLogger.Warn  = StackLoggerFor('warn')
StackLogger.Info  = StackLoggerFor('info')
StackLogger.Log   = StackLoggerFor('log')

StackLogger.__setOutputFn__ = function (fn) {
  Base.__outputFn__ = fn
}

module.exports = StackLogger;
