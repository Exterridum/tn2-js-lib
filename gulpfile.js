var gulp, browserify, babelify, tsify, source;

gulp = require("gulp");
tsify = require("tsify");
babelify = require("babelify");
browserify = require("browserify");
source = require("vinyl-source-stream");

const SRC_DIR = "src/";
const DIST_DIR = "dist/";
const TEST_DIR = "test/";

gulp.task("js", () => {
    browserify({        
                 basedir: SRC_DIR,
                 entries: ['wot/lib.ts'],
                 standalone : "tno", 
                 debug: true,
            })
            .plugin(tsify)
            .transform(babelify, { presets: ["es2015"] })
            .bundle()
            .pipe(source('bundle.js'))
            .pipe(gulp.dest("test"));
});

gulp.task("dist", ["js"]);

gulp.task("dev", () => {
    gulp.watch(SRC_DIR, ["dist"])
});