import gulp from "gulp";
import del from "del";
import browserify from "browserify";
import babelify from "babelify";
import source from "vinyl-source-stream";
import buffer from "vinyl-buffer";
import gutil from "gulp-util";
import plumber from "gulp-plumber";
import notify from "gulp-notify";
import sourcemaps from "gulp-sourcemaps";
import rename from "gulp-rename";
import flow from "gulp-flowtype";
import eslint from "gulp-eslint";
import uglify from "gulp-uglify";

const errorHandler = notify.onError("Error: <%= error.message %>");

gulp.task("flow", () =>
    gulp.src("src/**/*.js")
    .pipe(plumber({ errorHandler }))
    .pipe(flow({
        all: true,
        abort: true
    }))
);

gulp.task("lint", () =>
    gulp.src("src/**/*.js")
    .pipe(plumber({ errorHandler }))
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError())
);

gulp.task("bundle", () =>
    browserify({
        entries: "./src/uniq.js",
        debug: true,
        transform: [ babelify ]
    }).bundle()
    .on("error", function(error) {
        errorHandler(error);

        // End the stream to prevent gulp from crashing
        this.end();
    })
    .pipe(source("uniq.js"))
    .pipe(buffer())
    .pipe(plumber({ errorHandler }))
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(gutil.env.production ? uglify() : gutil.noop())
    .pipe(rename({ suffix: ".min" }))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("dist/"))
);

gulp.task("scripts", [ "bundle" ]);

// Delete generated files
gulp.task("clean", () => del([ "dist" ]));

// Watch for changes
gulp.task("watch", () => gulp.watch("src/**/*.js", [ "lint", "scripts" ]));

// Build files
gulp.task("build", [ "scripts" ]);

// Default Task
gulp.task("default", [ "lint", "clean" ], () => gulp.start("build"));
