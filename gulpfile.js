'use strict';

/**
 * Build configuration for qcode-decoder!
 *
 * If you don't want to use the minified version:
 * $ gulp clean && gulp --raw
 */

var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var qunit = require('gulp-qunit');
var gulpif = require('gulp-if');
var rimraf = require('rimraf');
var _ = require('lodash');
var argv = require('minimist')(process.argv.slice(2));

/**
 * Constants
 */

var shouldUglify = argv.raw ? false : true;

var targets = {
  target: 'qcode-decoder.min.js',
  jsqrcode: 'jsqrcode.min.js',
  src: 'src.min.js',
};

var paths = {
  scripts: ['src/**/*.js'],
  jsqrcode: _.map(["grid.js", "version.js", "detector.js", "formatinf.js",
             "errorlevel.js", "bitmat.js", "datablock.js","bmparser.js",
             "datamask.js","rsdecoder.js","gf256poly.js", "gf256.js",
             "decoder.js", "qrcode.js", "findpat.js", "alignpat.js",
             "databr.js"], function (file) {
              return 'vendor/' + file;
             }),
  build: ['build/js/*.js'],
  tests: ['test/**/*.js']
};

var dirs = {
  build: 'build',
  buildSrc: 'build/js',
  testRunner: 'test/runner.html'
};

/**
 * if --raw passed
 */

if (!shouldUglify) {
  for (var i in targets) {
    targets[i] = targets[i].replace('.min', '');
  }
}

/**
 * Building the src and jsqrcode lib
 */

gulp.task('jsqrcode', function () {
  return gulp.src(paths.jsqrcode)
    .pipe(gulpif(shouldUglify,
                 uglify({mangle: true})))
    .pipe(concat(targets.jsqrcode))
    .pipe(gulp.dest(dirs.buildSrc));
});

gulp.task('scripts', function() {
  return gulp.src(paths.scripts)
    .pipe(gulpif(shouldUglify,
                 uglify({mangle: true})))
    .pipe(concat(targets.src))
    .pipe(gulp.dest(dirs.buildSrc));
});

/**
 * Hinting and testing
 */

gulp.task('hinting', function () {
  return gulp.src(_.union(paths.scripts, paths.tests))
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('qunit', function () {
  return gulp.src(dirs.testRunner)
    .pipe(qunit());
});

/**
 * Building all of the project
 */

gulp.task('build', ['jsqrcode', 'scripts'], function () {
  return gulp.src(paths.build)
    .pipe(concat(targets.target))
    .pipe(gulp.dest('build'));
});

/**
 * Auxiliary tasks
 */

gulp.task('clean', function () {
  rimraf(dirs.build, function (err) {
    if (err) {
      process.stdout.write("'clean' gulp task raised an error: ", err);
      process.exit(1);
    }
  });
});


gulp.task('test', ['hinting', 'qunit']);
gulp.task('default', ['test', 'build']);

gulp.task('watch', function() {
  gulp.watch(_.union(paths.scripts, paths.tests, paths.vendor), ['default']);
});
