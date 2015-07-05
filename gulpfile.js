var gulp = require("gulp"),
    del = require("del"),
    browserify = require("browserify"),
    babelify = require("babelify"),
    source = require("vinyl-source-stream"),
    buffer = require("vinyl-buffer"),
    gutil = require("gulp-util"),
    plumber = require("gulp-plumber"),
    notify = require("gulp-notify"),
    sourcemaps = require("gulp-sourcemaps"),
    rename = require("gulp-rename"),
    flow = require("gulp-flowtype"),
    eslint = require("gulp-eslint"),
    jscs = require("gulp-jscs"),
    uglify = require("gulp-uglify");

var onerror = notify.onError("Error: <%= error.message %>");

gulp.task("flow", function() {
    return gulp.src("src/**/*.js")
    .pipe(plumber({ errorHandler: onerror }))
    .pipe(flow({
        all: true,
        abort: true
    }));
});

gulp.task("lint", function() {
    return gulp.src("src/**/*.js")
    .pipe(plumber({ errorHandler: onerror }))
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError())
    .pipe(jscs());
});

gulp.task("bundle", function() {
    browserify({
        entries: "./src/main.es6",
        debug: true,
        transform: [ babelify ]
    }).bundle()
    .on("error", function(error) {
        onerror(error);

        // End the stream to prevent gulp from crashing
        this.end();
    })
    .pipe(source("main.js"))
    .pipe(buffer())
    .pipe(plumber({ errorHandler: onerror }))
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(gutil.env.production ? uglify() : gutil.noop())
    .pipe(rename({ suffix: ".min" }))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("dist/"));
});

gulp.task("scripts", [ "bundle" ]);

// Delete generated files
gulp.task("clean", function() {
    return del([ "dist" ]);
});

// Watch for changes
gulp.task("watch", function() {
    gulp.watch("src/**/*.js", [ "flow", "lint", "scripts" ]);
});

// Build files
gulp.task("build", [ "scripts" ]);

// Default Task
gulp.task("default", [ "flow", "lint", "clean" ], function() {
    gulp.start("build");
});
