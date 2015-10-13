var StackLogger = require('src')

describe('stack-logger', function () {

  beforeAll(function () {
    StackLogger.__setOutputFn__(function () {
      // NOTE(jordan): return instead of calling out to `console`
      return function (messages) {
        return messages
      }
    })
  })

  it('creates a logger [sanity check]', function () {
    var _logger       = StackLogger.Log()
      , _warner       = StackLogger.Warn()
      , _informer     = StackLogger.Info()
      , _errorLogger  = StackLogger.Error()

    var loggers = [ _logger, _warner, _informer, _errorLogger ]

    loggers.forEach(function(l) {
      expect(Object.keys(l)).toEqual([ 'log', 'push', 'pop' ])
    })
  })

  it('can be initalized with its first message', function () {
    var _logger = StackLogger.Log('Hello', 'World')

    expect(_logger.log()).toEqual('Hello World')
  })

  it('has immutable push', function () {
    var logger            = StackLogger.Log()
      , helloLogger       = logger.push('Hello,')
      , helloWorldLogger  = helloLogger.push('World')

    expect(logger).not.toEqual(helloLogger)
    expect(logger.log('test')).toEqual('test')
    expect(helloLogger.log('test')).toEqual('Hello,\n\ttest')
    expect(helloWorldLogger.log('!')).toEqual('Hello,\n\tWorld\n\t!')
  })

  it('implements the same push API as Array#push', function () {
    var longLogger = StackLogger
      .Log()
      .push('Hello', 'there')
      .push('sir!')
      .push('This should be indented.')

    var logs = [ 'Hello there', 'sir!', 'This should be indented.' ]
      , expectedLongLog = logs.join('\n\t')
      , expectedPopLog  = logs.slice(0, 2).join('\n\t')
      , expected2PopLog = logs[0]

    expect(longLogger.log()).toEqual(expectedLongLog)
    expect(longLogger.pop().log()).toEqual(expectedPopLog)
    expect(longLogger.pop().pop().log()).toEqual(expected2PopLog)
  })

})
