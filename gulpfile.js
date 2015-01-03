"use strict";

var gulp = require('gulp');
var react = require('gulp-react');

gulp.task('jsx', function () {
    return gulp.src('./app/jsx/*.jsx')
        .pipe(react())
        .on("error", function (e) {
            console.error(e);
            this.emit("end");
        })
        .pipe(gulp.dest('./dist'));
});

gulp.task("watch", function () {
    gulp.watch("./app/jsx/*.jsx", ["jsx"]);
});
