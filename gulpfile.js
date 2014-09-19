'use strict';

var gulp = require('gulp')
  , sass = require('gulp-sass')
  , csso = require('gulp-csso')
  , concat = require('gulp-concat')
  , uglify = require('gulp-uglify')
  , rename = require('gulp-rename')
  , htmlmin = require('gulp-htmlmin')
  , imagemin = require('gulp-imagemin')
  , livereload = require('gulp-livereload')
  , sourcemaps = require('gulp-sourcemaps');


gulp.task('build:image', function () {
  return gulp.src(['./assets/*.png'])
    .pipe(imagemin({
      optimizationLevel: 7
    }))
    .pipe(gulp.dest('./dist/assets/'));
});

gulp.task('build:html', function () {
  return gulp.src(['./index-src.html'])
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(rename('./index.html'))
    .pipe(gulp.dest('./'));
});

gulp.task('build:js', function () {
  return gulp.src(['./src/main.js'])
    .pipe(sourcemaps.init())
      .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/js'));
});

gulp.task('build:css', function () {
  return gulp.src(['style/**/*.scss'])
    .pipe(sourcemaps.init())
      .pipe(sass())
      .pipe(csso())
      .pipe(concat('main.css'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('build', ['build:html', 'build:css', 'build:js', 'build:image']);

gulp.task('watch', function () {
  livereload.listen();

  gulp.watch(['./index-src.html', 'style/**/*.scss', 'src/main.js'],
             ['build:css', 'build:js', 'build:html'],
             livereload.changed);
});
