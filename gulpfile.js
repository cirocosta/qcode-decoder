'use strict';

var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var _ = require('lodash');

var paths = {
  scripts: ['src/**/*.js'],
  jsqrcode: _.map(["grid.js", "version.js", "detector.js", "formatinf.js",
             "errorlevel.js", "bitmat.js", "datablock.js","bmparser.js",
             "datamask.js","rsdecoder.js","gf256poly.js", "gf256.js",
             "decoder.js", "qrcode.js", "findpat.js", "alignpat.js",
             "databr.js"], function (file) {
              return 'vendor/' + file;
             })
};

gulp.task('jsqrcode', function () {
  return gulp.src(paths.jsqrcode)
    .pipe(uglify())
    .pipe(concat('jsqrcode.min.js'))
    .pipe(gulp.dest('build'));
});

gulp.task('scripts', function() {
  // Minify and copy all JavaScript (except vendor scripts)
  return gulp.src(paths.scripts)
    .pipe(uglify())
    .pipe(concat('main.min.js'))
    .pipe(gulp.dest('build/js'));
});


// Copy all static images
gulp.task('images', function() {
 return gulp.src(paths.images)
    // Pass in options to the task
    .pipe(gulp.dest('build/img'));
});

// Rerun the task when a file changes
gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['scripts']);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['scripts', 'watch'])
