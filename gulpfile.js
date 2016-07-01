var gulp, sourcemaps, babel, concat;

gulp = require('gulp');
sourcemaps = require('gulp-sourcemaps');
babel = require('gulp-babel');
concat = require('gulp-concat');

const SRC_DIR = "src/**/*.js";
const DIST_DIR = "dist";

gulp.task('dist', () => {
    return gulp.src(SRC_DIR)
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(concat('all.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(DIST_DIR));
});