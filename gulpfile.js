var gulp = require('gulp');
var less = require('gulp-less');
var path = require('path');
var del = require('del');
var mincss = require('gulp-clean-css');
var concat = require('gulp-concat');
var sync = require('browser-sync').create();
var markdown = require('gulp-remarkable');
var uglify = require('gulp-uglify');
var frontMatter = require('gulp-front-matter');
var layout = require('gulp-layout');
var pug = require('gulp-pug');
var rename = require("gulp-rename");

/**
 * Create Markdown Files
 */
gulp.task('md', ['clean'], function () {
  return gulp
    .src('src/partials/resume/*.md')
    .pipe(markdown())
    .pipe(gulp.dest('public/partials'));
});

/**
 * Create HTML from Pug files
 */
gulp.task('pug', ['clean'], function () {
  return gulp
    .src('src/content/*.pug')
    .pipe(pug())
    .pipe(gulp.dest('public'));
});

/**
 * Create Posts via markdown and markdown layouts
 */
gulp.task('build.posts', function () {
  return gulp.src('./src/partials/posts/*.md')
    .pipe(frontMatter())
    .pipe(markdown())
    .pipe(layout(function (file) {
      return file.frontMatter;
    }))
    .pipe(gulp.dest('public/blog'));
});

/**
 * Process JS Files to Public
 */
gulp.task('js.min', ['clean'], function () {
  return gulp
    .src(['src/js/jquery-1.10.2.js', 'node_modules/outkit-animator/dist/outkit-animator.min.js', 'src/js/app.js'])
    .pipe(uglify())
    .pipe(concat('bundle.js'))
    .pipe(gulp.dest('public/assets/js'));
});

/**
 * Copy Boostrap Files to Build
 */
gulp.task('copy.bootstrap', ['clean'], function () {
  return gulp
    .src('node_modules/bootstrap/dist/**/*', { base: 'node_modules/bootstrap/dist' })
    .pipe(gulp.dest('build/assets'));
});

/**
 * Copy Content files to Public
 */
gulp.task('copy.content', ['clean'], function () {
  return gulp
    .src([
      'src/content/images/**/*',
      'src/content/**/*.html'
    ], { base: 'src/content' })
    .pipe(gulp.dest('public'))
});

/**
 * Clean Build and Public folders
 */
gulp.task('clean', function () {
  return del([
    'build/**/*',
    'public/**/*'
  ]);
});

/**
 * Minify CSS
 */
gulp.task('min.css', ['less', 'copy'], function () {
  return gulp
    .src([
      'build/assets/css/bootstrap.css',
      'build/assets/css/app.css'
    ])
    .pipe(mincss({ compatibility: 'ie8' }))
    .pipe(concat('bundle.css'))
    .pipe(gulp.dest('public/assets/css'))
    .pipe(sync.stream());
});

/**
 * Process LESS files into CSS in Build
 */
gulp.task('less', ['clean', 'md'], function () {
  return gulp
    .src('src/less/app.less')
    .pipe(less({
      paths: [path.join(__dirname, 'less', 'includes')]
    }))
    .pipe(gulp.dest('build/assets/css'));
});

/**
 * Serve using browsersync
 */
gulp.task('serve', ['default'], function () {

  sync.init({
    server: "./public",
    notify: false
  });

  gulp.watch('src/less/**/*.less', ['less', 'min.css']);
  gulp.watch(['src/**/*.html','src/**/*.pug', 'src/**/*.md', 'src/**/*.js'], ['reload']);
});

/**
 * Browsersync reload
 */
gulp.task('reload', ['default'], function (done) {
  sync.reload();
  done();
});

gulp.task('default', ['build']);
gulp.task('build', ['clean', 'copy', 'less', 'min.css', 'js.min', 'pug', 'md']);
gulp.task('copy', ['copy.bootstrap', 'copy.content']);