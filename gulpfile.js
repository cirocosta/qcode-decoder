'use strict';

var gulp = require('gulp')
  , sass = require('gulp-sass')
  , csso = require('gulp-csso')
  , concat = require('gulp-concat')
  , uglify = require('gulp-uglify')
  , htmlmin = require('gulp-htmlmin')
  , livereload = require('gulp-livereload')
  , sourcemaps = require('gulp-sourcemaps');


gulp.task('build:html', function (argument) {
  return gulp.src(['./index.html'])
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('dist'));
});

gulp.task('build:css', function () {
  return gulp.src(['style/**/*.scss'])
    .pipe(sourcemaps.init())
      .pipe(sass())
      // .pipe(csso())
      .pipe(concat('main.css'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('build', ['build:html', 'build:css']);

gulp.task('watch', function () {
  livereload.listen();

  gulp.watch(['./index.html', 'style/**/*.scss'],
             ['build'],
             livereload.changed);
});
