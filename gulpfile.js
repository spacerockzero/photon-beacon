const gulp = require('gulp')
const babel = require('gulp-babel')
const uglify = require('uglify-es')
const composer = require('gulp-uglify/composer')
const minify = composer(uglify, console)
const rename = require('gulp-rename')

const src = './src/*.js'
const dest = './dist'
const renameConfig = (path) => {
  path.extname = '.min.js'
}

gulp.task('babel', () => {
  return gulp.src(src)
    .pipe(babel())
    .pipe(minify())
    .pipe(rename(renameConfig))
    .pipe(gulp.dest(dest))
})

gulp.task('watch', ['babel'], () => {
  gulp.watch(src, ['babel'], (event) => {
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...')
  })
})

gulp.task('build', ['babel'])
