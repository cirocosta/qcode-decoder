'use strict';

var fs = require('fs')
  , pkg = require('./package.json')
  , gulp = require('gulp')
  , concat = require('gulp-concat')
  , rename = require('gulp-rename')
  , uglify = require('gulp-uglify')
  , header = require('gulp-header')
  , jshint = require('gulp-jshint');

var paths = {
  jsqrcode: [
    "grid.js", "version.js", "detector.js", "formatinf.js",
    "errorlevel.js", "bitmat.js", "datablock.js","bmparser.js",
    "datamask.js","rsdecoder.js","gf256poly.js", "gf256.js",
    "decoder.js", "qrcode.js", "findpat.js", "alignpat.js",
    "databr.js"].map(function (file) { return 'vendor/' + file; })
};


gulp.task('build-vendor', function () {
  var vendorHeader = fs.readFileSync(__dirname + '/vendor/header.txt');

  return gulp.src(paths.jsqrcode)
    .pipe(concat('jsqrcode.js'))
    .pipe(gulp.dest('build/vendor'))
    .pipe(uglify({mangle: true}))
    .pipe(header(vendorHeader))
    .pipe(rename(function (path) {
      path.extname = ".min.js"
    }))
    .pipe(gulp.dest('build/vendor'));
});

gulp.task('build', ['build-vendor'], function() {
  return gulp.src([
      'build/vendor/jsqrcode.js',
      'src/qcode-decoder.js'])
    .pipe(concat('qcode-decoder.js'))
    .pipe(gulp.dest('build'))
    .pipe(uglify({mangle: true}))
    .pipe(rename(function (path) {
      path.extname = ".min.js"
    }))
    .pipe(gulp.dest('build'));
});

// /**
//  * Hinting and testing
//  */

gulp.task('hint', function () {
  return gulp.src('src/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('default', ['hint', 'build']);
