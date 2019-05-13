var gulp = require('gulp'),
    del = require('del'),
    autoprefixer = require('gulp-autoprefixer'),
    browserSync = require('browser-sync'),
    less = require('gulp-less'),
    rename = require("gulp-rename"),
    imagemin = require('gulp-imagemin'),
    plumber = require('gulp-plumber');


var paths = {
    dirs: {
        build: './build'
    },
    html: {
        source: './source/pages/*.html',
        dest: './build',
        watch: ['./source/pages/*.html', './source/blocks/**/*.html']
    },
    css: {
        source: ['./source/less/style.less', './source/css/plugins/**/*.css'],
        dest: './build/css',
        watch: ['./source/less/**/*.less', './source/less/*.less']
    },
    js: {
        source: ['./source/js/plugins/**/*.js', './source/js/*.js'],
        dest: './build/js',
        watch: './source/js/*.js'
    },
    images: {
        source: './source/**/img/*',
        dest: './build/img',
        watch: './source/**/img/*'
    },
    fonts: {
        source: './source/fonts/*',
        dest: './build/fonts',
        watch: './source/fonts/*'
    }
};

gulp.task('clean', function () {
    return del(paths.dirs.build);
});

gulp.task('html', function () {
    return gulp.src(paths.html.source)
        .pipe(plumber())
        .pipe(gulp.dest(paths.html.dest))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('styles', function () {
    return gulp.src(paths.css.source)
        .pipe(plumber())
        .pipe(less())
        .pipe(autoprefixer({
            browsers: ['last 10 versions']
        }))
        .pipe(gulp.dest(paths.css.dest))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('js', function () {
    return gulp.src(paths.js.source)
        .pipe(gulp.dest(paths.js.dest))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('images', function () {
    return gulp.src(paths.images.source)
        .pipe(plumber())
        .pipe(imagemin())
        .pipe(rename({
            dirname: ''
        }))
        .pipe(gulp.dest(paths.images.dest));
});

gulp.task('fonts', function () {
    return gulp.src(paths.fonts.source)
        .pipe(plumber())
        .pipe(gulp.dest(paths.fonts.dest))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('server', function () {
    browserSync.init({
        server: {
            baseDir: paths.dirs.build
        },
        reloadOnRestart: true
    });
    gulp.watch(paths.html.watch, gulp.parallel('html'));
    gulp.watch(paths.css.watch, gulp.parallel('styles'));
    gulp.watch(paths.js.watch, gulp.parallel('js'));
    gulp.watch(paths.images.watch, gulp.parallel('images'));
    gulp.watch(paths.fonts.watch, gulp.parallel('fonts'));
});


gulp.task('build', gulp.series(
    'clean',
    'html',
    'styles',
    'js',
    'images',
    'fonts'
));

gulp.task('dev', gulp.series(
    'build',
    'server'
));