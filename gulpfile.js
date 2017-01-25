var gulp = require('gulp');
var less = require('gulp-less');
var path = require('path');
var del = require('del');
var mincss = require('gulp-clean-css');
var concat = require('gulp-concat');
var sync = require('browser-sync').create();
var markdown = require('gulp-remarkable');
var wrapper = require('gulp-wrapper');

gulp.task('md', ['clean'], function() {
    return gulp
    .src('src/partials/**/*.md') 
    .pipe(markdown())
    .pipe(gulp.dest('public/partials'));
})

gulp.task('copy.bootstrap', ['clean'], function () {
    return gulp
        .src('node_modules/bootstrap/dist/**/*', { base: 'node_modules/bootstrap/dist' })
        .pipe(gulp.dest('build/assets'));
})

gulp.task('copy.content', ['clean'], function () {
    return gulp
        .src('src/content/**/*', { base: 'src/content' })
        .pipe(gulp.dest('public'))
})

gulp.task('copy', ['copy.bootstrap', 'copy.content']);

gulp.task('clean', function () {
    return del([
        'build/**/*',
        'public/**/*'
    ]);
})

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
})

gulp.task('less', ['clean', 'md'], function () {
    return gulp
        .src('src/less/app.less')
        .pipe(less({
            paths: [path.join(__dirname, 'less', 'includes')]
        }))
        .pipe(gulp.dest('build/assets/css'));
});

gulp.task('serve', ['min.css'], function() {

    sync.init({
        server: "./public"
    });

    gulp.watch('src/less/**/*.less', ['less', 'min.css'])
    gulp.watch(['src/**/*.html', 'src/**/*.md'], ['reload']);
});

gulp.task('reload', ['min.css', 'md'], function (done) {
    sync.reload();
    done();
});

gulp.task('default', ['clean', 'copy', 'less', 'min.css', 'md']);