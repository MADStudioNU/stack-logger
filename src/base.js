var Classy         = require('classy-js')
  , ImmutableStack = require('immutable-stack')

var StackLoggerBase = Classy(function (self, logLevel, pushMessages, messageStack) {

  var messageStack = messageStack || ImmutableStack()

  if (pushMessages && pushMessages.length)
    messageStack = messageStack.push(pushMessages)

  self.log = function () {
    var messages     = messageStack.stack()
      , finalMessage = [].slice.call(arguments)

    if (finalMessage && finalMessage.length)
      messages.push(finalMessage)

    return __outputToConsole__(logLevel, messages)
  }

  self.push = function () {
    var args = [].slice.call(arguments)

    return StackLoggerBase(logLevel, args, messageStack)
  }

  self.pop = function () {
    return StackLoggerBase(logLevel, null, messageStack.pop())
  }
})

StackLoggerBase.__processMessages__ = function (messages) {
  return messages = messages.map(function (m) {
    return m.join(' ')
  }).join('\n\t')
}

StackLoggerBase.__outputFn__ = function (level) {
  return console[level]
}

function __outputToConsole__ (level, messages) {
  messages = StackLoggerBase.__processMessages__(messages)
  return StackLoggerBase.__outputFn__(level)(messages)
}

module.exports = StackLoggerBase
