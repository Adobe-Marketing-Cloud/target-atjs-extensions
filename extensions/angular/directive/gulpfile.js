'use strict';
var gulp = require('gulp');
var gulpSequence = require('gulp-sequence');
var del = require('del');
var excludeGitignore = require('gulp-exclude-gitignore');
var eslint = require('gulp-eslint');
var eslintIfFixed = require('gulp-eslint-if-fixed');
var uglify = require('gulp-uglify');
var plumber = require('gulp-plumber');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var Server = require('karma').Server;

gulp.task('lint:src', () => {
	return gulp.src('src/*.js')
		.pipe(excludeGitignore())
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslintIfFixed('src'))
		.pipe(eslint.failAfterError());
});

gulp.task('lint:test', () => {
	return gulp.src('test/*.spec.js')
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslintIfFixed('test'))
		.pipe(eslint.failAfterError());
});

gulp.task('test:run', (done) => {
	new Server({
		configFile: __dirname + '/karma.conf.js'
	}, done).start();
});

gulp.task('clean', () => {
	return del(['dist/**/*']);
});

gulp.task('build:dist', () => {
	return gulp.src('src/**/!(*.testutil).js')
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(concat('at-angular-directive.js'))
    .pipe(gulp.dest('dist')) // save .js
    .pipe(uglify({ preserveComments: 'license' }))
    .pipe(rename({ extname: '.min.js' }))
    .pipe(sourcemaps.write('maps'))
    .pipe(gulp.dest('dist')) // save .min.js
});

gulp.task('watch', function() {
  gulp.watch('src/**/*.js', gulpSequence('lint:src', 'test:run'));
  gulp.watch('test/**/*.spec.js', gulpSequence('lint:test', 'test:run'));
});

gulp.task('lint', ['lint:src', 'lint:test']);

gulp.task('test', gulpSequence('lint', 'test:run'));

gulp.task('build', gulpSequence('clean', 'default', 'build:dist'));

gulp.task('default', ['test']);
