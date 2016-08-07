var gulp, sourcemaps, typescript, concat;

gulp = require('gulp');
sourcemaps = require('gulp-sourcemaps');
typescript = require("gulp-typescript");
concat = require('gulp-concat');

const SRC_DIR = "src/**/*.ts";
const DIST_DIR = "dist/";

gulp.task("ts", () => {
    var tsResult = gulp.src(SRC_DIR)
        .pipe(sourcemaps.init())
        .pipe(typescript({
            sortOutput: true,
            target: "ES2015"
        }));

    return tsResult.js
        .pipe(concat('output.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(DIST_DIR));
});

gulp.task("dist", ["ts"]);

gulp.task("dev", () => {
    gulp.watch(SRC_DIR, ["ts"])
});