const gulp = require('gulp')
const del = require('del')
const nunjucks = require('gulp-nunjucks')
const sass = require('gulp-sass')
const scssLint = require('gulp-scss-lint')
const autoprefixer = require('gulp-autoprefixer')
const cleanCss = require('gulp-clean-css')
const sourcemaps = require('gulp-sourcemaps')
const sourceStream = require('vinyl-source-stream')
const buffer = require('vinyl-buffer')
const uglify = require('gulp-uglify')
const browserSync = require('browser-sync').create()
const browserify = require('browserify')
const babelify = require('babelify')


const browserSyncInit = done => {
  browserSync.init({
    server: {
      baseDir: './public',
    }
  })
  done()
}

const browserSyncReload = done => {
  browserSync.reload()
  done()
}

const clean = done => {
  del('./public/*')
  done()
}

const html = done => {
  gulp.src('./src/html/*.html')
    .pipe(nunjucks.compile())
    .pipe(gulp.dest('./public'))
  done()
}

const css = done => {
  gulp.src(['./src/scss/**/*.scss'])
    .pipe(sourcemaps.init())
    .pipe(scssLint({ 'config': 'scss-lint.yml' }))
    .pipe(sass())
    .on('error', err => { console.log(err) })
    .pipe(autoprefixer())
    .pipe(cleanCss())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./public'))
    .pipe(browserSync.stream())
  done()
}

const js = done => {
  browserify({ entries: `./src/js/main.js` })
    .transform(babelify, { 'presets': ['@babel/preset-env'] })
    .bundle().on('error', err => { console.log(err) })
    .pipe(sourceStream('main.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest(`./public`))
  done()
}

const watchFiles = () => {
  gulp.watch('./src/scss/**/*.scss', gulp.series(css))
  gulp.watch('./src/html/**/*.html', gulp.series(html, browserSyncReload))
  gulp.watch('./src/js/**/*.js', gulp.series(js, browserSyncReload))
}

exports.html = html
exports.css = css
exports.js = js

exports.clean = clean
exports.build = gulp.series(clean, gulp.parallel(css, js, html))
exports.default = gulp.parallel(watchFiles, browserSyncInit)
