var gulp, browserify, babelify, tsify, source;

gulp = require("gulp");
tsify = require("tsify");
babelify = require("babelify");
browserify = require("browserify");
source = require("vinyl-source-stream");

const SRC_DIR = "src/";

gulp.task("js", () => {
    browserify({        
                 basedir: SRC_DIR,
                 entries: ['lib/wot-browser.ts'],
                 standalone : "tno", 
                 debug: true
            })
            .plugin(tsify)
            .transform(babelify, { presets: ["es2015"] })
            .bundle()
            .pipe(source('bundle.js'))
            .pipe(gulp.dest("test/app"));
});

gulp.task("dist", ["js"]);

gulp.task("dev", () => {
    gulp.watch(SRC_DIR, ["dist"])
});