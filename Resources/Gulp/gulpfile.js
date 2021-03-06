var gulp = require('gulp');
var mainBowerFiles = require('gulp-main-bower-files');
var concat = require('gulp-concat');
var gulpFilter = require('gulp-filter');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var rename = require("gulp-rename");
var watch = require('gulp-watch');

function handleError(err) {
    console.log(err.toString());
    this.emit('end');
}

gulp.task('uglify-bower-js', function () {
    var filterJS = gulpFilter('**/*.js', {restore: true});
    return gulp.src('./bower.json')
        .pipe(mainBowerFiles())
        .pipe(filterJS)
        .pipe(concat('vendor.min.js'))
        .pipe(uglify())
        .on('error', handleError)
        .pipe(gulp.dest('../Public/JavaScript/'));
});

gulp.task('uglify-main-js', function () {
    return gulp.src('../Public/JavaScript/config.js')
        .pipe(concat('config.min.js'))
        .pipe(uglify())
        .on('error', handleError)
        .pipe(gulp.dest('../Public/JavaScript/'));
});

gulp.task('minify-sass', function () {
    return gulp.src('../Public/Css/style.scss')
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sass({outputStyle: 'compressed'}))
        .on('error', handleError)
        .pipe(rename('style.min.css'))
        .pipe(sourcemaps.write('./', {addComment: true}))
        .pipe(gulp.dest('../Public/Css/'));
});

gulp.task('default', function () {
    gulp.start('uglify-bower-js');
    gulp.start('uglify-main-js');
    gulp.start('minify-sass');
});

gulp.task('watch', function () {
    gulp.watch('../Public/Css/**/*.scss', {debounceDelay: 2000}, ['minify-sass']);
    gulp.watch('../Public/JavaScript/main.js', {debounceDelay: 2000}, ['uglify-main-js']);
    gulp.watch('./bower.json', {debounceDelay: 2000}, ['uglify-bower-js']);
});
