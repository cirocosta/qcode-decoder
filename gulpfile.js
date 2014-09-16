'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var csso = require('gulp-csso');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var livereoad = require('gulp-livereload');
var sourcemaps = require('gulp-sourcemaps');


gulp.task('build:html', function (argument) {
  return gulp.src(['**/*.html'])
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('dist'));
});

gulp.task('build:css', function () {
  return gulp.src(['**/*.scss'])
    .pipe(sourcemaps.init())
      .pipe(sass())
      .pipe(csso())
      .pipe(concat('main.css'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('build', ['buld:html', 'build:css']);

gulp.task('watch', function () {
  livereload.listen();

  gulp.watch(['**/*.html', '**/*.scss'],
             livereload.changed);
});
