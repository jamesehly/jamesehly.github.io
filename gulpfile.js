var gulp = require('gulp');
var less = require('gulp-less');
var path = require('path');
var del = require('del');
var mincss = require('gulp-clean-css');
var concat = require('gulp-concat');
var sync = require('browser-sync').create();
var markdown = require('gulp-remarkable');
var uglify = require('gulp-uglify');

/**
 * Create Markdown Files
 */
gulp.task('md', ['clean'], function() {
    return gulp
    .src('src/partials/**/*.md') 
    .pipe(markdown())
    .pipe(gulp.dest('public/partials'));
});

/**
 * Process JS Files to Public
 */
gulp.task('js.min', ['clean'], function() {
    return gulp
    .src('src/js/**/*.js')
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
        .src('src/content/**/*', { base: 'src/content' })
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
gulp.task('serve', ['default'], function() {

    sync.init({
        server: "./public",
        notify: false
    });

    gulp.watch('src/less/**/*.less', ['less', 'min.css']);
    gulp.watch(['src/**/*.html', 'src/**/*.md', 'src/**/*.js'], ['reload']);
});

/**
 * Browsersync reload
 */
gulp.task('reload', ['default'], function (done) {
    sync.reload();
    done();
});

gulp.task('default', ['build']);
gulp.task('build', ['clean', 'copy', 'less', 'min.css', 'js.min', 'md']);
gulp.task('copy', ['copy.bootstrap', 'copy.content']);