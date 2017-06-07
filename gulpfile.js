const gulp = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');

const src = './src/*.js';
const dest = './dist';
const renameConfig = (path) => {
  path.extname = '.min.js';
};

gulp.task('babel', () => {
  return gulp.src(src)
    .pipe(babel())
    .pipe(uglify())
    .pipe(rename(renameConfig))
    .pipe(gulp.dest(dest));
});

gulp.watch(src, ['babel'], (e) => {
  console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
});

gulp.task('default', ['babel']);
