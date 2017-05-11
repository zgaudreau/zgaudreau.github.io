var gulp = require('gulp');
var pug = require('gulp-pug');
var sass = require('gulp-sass');

/* ##### pug to HTML ##### */

gulp.task('pug', function() {
  gulp.src('./src/*.pug')
    .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest('dist'))
});

gulp.task('pug:watch', function(){
  gulp.watch('./src/*.pug', ['pug'])
});

gulp.task('sass', function () {
  return gulp.src('./_sass/*.sass')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./css'));
});

gulp.task('sass:watch', function () {
  gulp.watch('./_sass/*', ['sass']);
});

gulp.task('default', ['pug', 'pug:watch', 'sass', 'sass:watch']);
