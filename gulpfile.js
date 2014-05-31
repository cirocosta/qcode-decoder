'use strict';

var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rimraf = require('rimraf');
var _ = require('lodash');

/**
 * Paths and dirs
 */

var paths = {
  scripts: ['src/**/*.js'],
  jsqrcode: _.map(["grid.js", "version.js", "detector.js", "formatinf.js",
             "errorlevel.js", "bitmat.js", "datablock.js","bmparser.js",
             "datamask.js","rsdecoder.js","gf256poly.js", "gf256.js",
             "decoder.js", "qrcode.js", "findpat.js", "alignpat.js",
             "databr.js"], function (file) {
              return 'vendor/' + file;
             }),
  build: ['build/js/*.js']
};

var dirs = {
  buildSrc: 'build/js'
};

/**
 * Building the jsqrcode lib
 */

gulp.task('jsqrcode', function () {
  return gulp.src(paths.jsqrcode)
    .pipe(uglify({mangle: true}))
    .pipe(concat('jsqrcode.min.js'))
    .pipe(gulp.dest(dirs.buildSrc));
});

/**
 * Building our own scripts
 */

gulp.task('scripts', function() {
  return gulp.src(paths.scripts)
    .pipe(uglify({mangle: true}))
    .pipe(concat('src.min.js'))
    .pipe(gulp.dest(dirs.buildSrc));
});

/**
 * Building all of the project
 */

gulp.task('build', ['jsqrcode', 'scripts'], function () {
  return gulp.src(paths.build)
    .pipe(concat('main.min.js'))
    .pipe(gulp.dest('build'));
});

/**
 * Auxiliary tasks
 */

gulp.task('clean', function () {
  rimraf(paths.buildSrc);
});

gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['build']);
});

gulp.task('default', ['build'])
