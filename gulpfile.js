'use strict';

var fs = require('fs')
  , pkg = require('./package.json')

  , gulp = require('gulp')
  , concat = require('gulp-concat')
  , rename = require('gulp-rename')
  , uglify = require('gulp-uglify')
  , jshint = require('gulp-jshint')
  , sourcemaps = require('gulp-sourcemaps');


var paths = {
  jsqrcode: [
    "grid.js", "version.js", "detector.js", "formatinf.js",
    "errorlevel.js", "bitmat.js", "datablock.js","bmparser.js",
    "datamask.js","rsdecoder.js","gf256poly.js", "gf256.js",
    "decoder.js", "qrcode.js", "findpat.js", "alignpat.js",
    "databr.js"].map(function (file) { return 'vendor/' + file; })
};

gulp.task('build', function() {
  return gulp.src(paths.jsqrcode.concat(['src/qcode-decoder.js']))
    .pipe(sourcemaps.init())
      .pipe(concat('qcode-decoder.js'))
      .pipe(uglify({mangle: true}))
    .pipe(rename(function (path) {
      path.extname = ".min.js"
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('build'));
});


gulp.task('hint', function () {
  return gulp.src('src/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('default', ['hint', 'build']);
