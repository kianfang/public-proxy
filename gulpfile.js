const gulp = require('gulp');
const zip = require('gulp-zip');
const uglify = require('gulp-uglify-es').default;
const add = require('gulp-add');
const addsrc = require('gulp-add-src');
const gutil = require('gulp-util');
const {pick} = require("lodash");
const pkg = require("./package.json");

gulp.task('zip', () =>
    gulp.src([
        './index.js',
        './App.js',
        './lib/*.js'
    ], {base: '.'})
        .on('error', (err) => {
            gutil.log(gutil.colors.red('[Error]'), err.toString());
        })
        .pipe(uglify())
        .pipe(addsrc([
            './bin/**',
            './node_modules/**'
        ], {base: '.'}))
        .pipe(add({'package.json': JSON.stringify(pick(pkg, ['name', 'version', 'scripts']))}))
        .pipe(zip(`${pkg.name}.zip`))
        .pipe(gulp.dest('./dist'))
);
