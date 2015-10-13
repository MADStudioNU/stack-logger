var gulp        = require('gulp')
  , gutil       = require('gulp-util')
  , browserify  = require('browserify')
  , watchify    = require('watchify')
  , source      = require('vinyl-source-stream')
  , buffer      = require('vinyl-buffer')
  , karma       = require('karma')
  , extend      = require('object-extend')
  , del         = require('del')

function browserifySrc (options) {
  var b = browserify(extend({
    debug: true,
    entries: 'src/index.js'
  }, options))

  b.on('error', gutil.log)

  return b
}

function browserifyTests (options) {
  var b = browserify(extend({
    entries: 'tests/stack-logger.spec.js',
    paths  : [ '.' ]
  }, options))

  b.on('error', gutil.log)

  return b
}

function bundler (b, name, dest) {
  return function () {
    return b.bundle()
      .pipe(source(name))
      .pipe(buffer())
      .pipe(gulp.dest(dest || 'dist'))
  }
}

function karmaServer (done, options) {
  return new karma.Server(extend({
    configFile: __dirname + '/karma.conf.js'
  }, options), done)
}

gulp.task('bundle:src', function () {
  var b = browserifySrc()
  var bundle = bundler(b, 'stack-logger.js')
  return bundle()
})

gulp.task('bundle:src:watch', function () {
  var b = browserifySrc()
  b     = watchify(b)

  var bundle = bundler(b, 'stack-logger.js')

  b.on('update', bundle)
  b.on('log', gutil.log)

  bundle()
})

gulp.task('bundle:test', function () {
  var b = browserifyTests()

  var bundle = bundler(b, 'stack-logger.spec.js', 'dist/tests')

  return bundle()
})

gulp.task('bundle:test:watch', function () {
  var b = browserifyTests()
  b = watchify(b)

  var bundle = bundler(b, 'stack-logger.spec.js', 'dist/tests')

  b.on('update', bundle)
  b.on('log', gutil.log)

  bundle()
})

gulp.task('clean', function () {
  return del('dist/*.js')
})

function gulpThen (nexts) {
  return function () {
    return gulp.start(nexts)
  }
}

gulp.task('bundle', ['clean'], gulpThen([ 'bundle:test', 'bundle:src' ]))
gulp.task('bundle:watch', ['clean'], gulpThen([ 'bundle:test:watch', 'bundle:src:watch' ]))

gulp.task('tdd', [ 'bundle:test:watch' ], function (done) {
  var server = karmaServer(done)

  return server.start()
})

gulp.task('test', [ 'bundle:test' ], function (done) {
  var server = karmaServer(done, {
    singleRun : true
  })

  return server.start()
})

gulp.task('test:travis', [ 'bundle:test' ], function (done) {
  var server = karmaServer(done, {
    singleRun: true,
    browsers : [ 'Firefox', 'PhantomJS' ]
  })

  return server.start()
})
