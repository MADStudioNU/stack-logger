var Classy         = require('classy-js')
  , ImmutableStack = require('immutable-stack')

var StackLoggerBase = Classy(function (self, logLevel, pushMessages, messageStack, baseLog) {

  var messageStack = messageStack || ImmutableStack()
  var baseLog = baseLog || StackLoggerBase.__outputFn__(logLevel)

  if (pushMessages && pushMessages.length) {
    messageStack = messageStack.push(pushMessages)
  }

  var prefix = StackLoggerBase.__processMessages__(messageStack.stack())

  // Create a copy including the log stack at its start.
  self.log = baseLog.bind(
    baseLog,
    prefix + (prefix.length ? StackLoggerBase.__delimiter__ : '')
  )

  self.push = function () {
    var args = [].slice.call(arguments)

    return StackLoggerBase(logLevel, args, messageStack, baseLog)
  }

  self.pop = function () {
    return StackLoggerBase(logLevel, null, messageStack.pop(), baseLog)
  }
})

StackLoggerBase.__delimiter__ = '\n\t'

StackLoggerBase.__processMessages__ = function (messages) {
  return messages = messages.map(function (m) {
    return m.join(' ')
  }).join(StackLoggerBase.__delimiter__)
}

StackLoggerBase.__outputFn__ = function (level) {
  return console[level].bind(window.console)
}

module.exports = StackLoggerBase
