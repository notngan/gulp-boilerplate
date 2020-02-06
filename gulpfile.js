// plugins for development
const gulp = require('gulp')
const plumber = require('gulp-plumber')
const nunjucks = require('gulp-nunjucks')
const sass = require('gulp-sass')
const scssLint = require('gulp-scss-lint')
const autoprefixer = require('gulp-autoprefixer')
const sourceStream = require('vinyl-source-stream')
const buffer = require('vinyl-buffer')
const browserify = require('browserify')
const browserSync = require('browser-sync').create()
const babelify = require('babelify')

// plugins for build
const del = require('del')
const cleanCss = require('gulp-clean-css')
const sourcemaps = require('gulp-sourcemaps')
const uglify = require('gulp-uglify')
const imagemin = require('gulp-imagemin')
const pngquant = require('imagemin-pngquant')

// plugins for svg sprite
const svgSprite = require('gulp-svg-sprite')
const svgmin = require('gulp-svgmin')
const cheerio = require('gulp-cheerio')
const replace = require('gulp-replace')

const srcDir = 'src/'
const watchDir = 'dist/'
const publicDir = 'public/'

// *** COMPILING TASKS ***
const html = done => {
  gulp.src(`${srcDir}html/*.html`)
    .pipe(plumber())
    .pipe(nunjucks.compile())
    .pipe(gulp.dest(watchDir))
    .pipe(browserSync.stream({ once: true }))
  done()
}

const scss = done => {
  gulp.src(`${srcDir}scss/**/*.scss`)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(scssLint({ 'config': '.scss-lint.yml' }))
    .pipe(sass())
    .on('error', err => { console.log(err) })
    .pipe(autoprefixer())
    .pipe(gulp.dest(`${watchDir}css/`))
    .pipe(browserSync.stream({ match: '**/*.css' }))
  done()
}

const js = done => {
  browserify({ entries: `${srcDir}js/main.js`, debug: true })
    .transform(babelify, { 'presets': ['@babel/preset-env'] })
    .bundle().on('error', err => { console.log(err.message) })
    .pipe(sourceStream('main.js'))
    .pipe(buffer())
    .pipe(plumber())
    .pipe(gulp.dest(`${watchDir}js/`))
    .pipe(browserSync.stream({ once: true }));
  done()
}

const img = done => {
  gulp.src(`${srcDir}img/**/*`)
    .pipe(plumber())
    .pipe(gulp.dest(`${watchDir}img/`))
    .pipe(browserSync.stream({ once: true }));
  done()
}

// *** SVG SPRITE ***
const svgSpriteBuild = done => {
  const svgminConfig = {
    js2svg: {
      pretty: true
    }
  }
  const svgSpriteConfig = {
    mode: {
      symbol: {
        sprite: '../sprite.svg'
      }
    }
  }
  const cheerioConfig = {
    run: $ => {
      $('[fill]').removeAttr('fill')
      $('[stroke]').removeAttr('stroke')
      $('[style]').removeAttr('style')
    },
    parserOptions: {
      xmlMode: true
    }
  }

  gulp.src(`${srcDir}img/ico/*.svg`)
    // minify svg
    .pipe(svgmin(svgminConfig))
    // remove all fill, style and stroke declarations in out shapes
    .pipe(cheerio(cheerioConfig))
    // replace unnecessary string '&gt;' created by cheerio
		.pipe(replace('&gt;', '>'))
    // build svg sprite
    .pipe(svgSprite(svgSpriteConfig))
    .pipe(gulp.dest(`${srcDir}img/`))
  done()
}

// *** WATCH & RUN TASKS ***
const browserSyncInit = done => {
  browserSync.init({
    server: {
      baseDir: watchDir,
    },
    open: false,
    port: 1711
  })
  done()
}

const watchFiles = () => {
  gulp.watch([`${srcDir}html/**/*.html`], gulp.series(html))
  gulp.watch(`${srcDir}scss/**/*.scss`, gulp.series(scss))
  gulp.watch(`${srcDir}js/**/*.js`, gulp.series(js))
  gulp.watch(`${srcDir}img/**/*`, gulp.series(img))
  gulp.watch(`${srcDir}img/ico/*.svg`, gulp.series(svgSpriteBuild))
}

// *** BUILD FINAL PUBLIC ***
// clean public folder
const cleanPublicDir = done => {
  del(`${publicDir}*`)
  done()
}

//minify img
const imgBuild = done => {
  gulp.src([`${watchDir}img/**/**`, `!${watchDir}img/sprite.svg`])
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{ removeViewBox: false }],
      use: [pngquant()]
    }))
    .pipe(gulp.dest(`${publicDir}img/`))
  done()
}

// copy sprite
const copySprite = done => {
  gulp.src(`${watchDir}img/sprite.svg`)
    .pipe(plumber())
    .pipe(gulp.dest(`${publicDir}img/`))
  done()
}

// copy html
const htmlBuild = done => {
  gulp.src(`${watchDir}**/*.html`)
    .pipe(gulp.dest(publicDir))
  done()
}

// copy and minify js
const jsBuild = done => {
  gulp.src(`${watchDir}js/**/*.js`)
    .pipe(uglify())
    .pipe(gulp.dest(`${publicDir}js/`))
  done()
}

// copy and minify css
const cssBuild = done => {
  gulp.src(`${watchDir}css/**/*.css`)
    .pipe(cleanCss())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(`${publicDir}css/`))
  done()
}

exports.default = gulp.series(svgSpriteBuild, gulp.parallel(watchFiles, browserSyncInit))
exports.build = gulp.series(cleanPublicDir, gulp.parallel(imgBuild, htmlBuild, jsBuild, cssBuild, copySprite))
