"use strict";

let gulp = require('gulp');

gulp.task('build:supporting', done => {
	gulp.src([
		'./LICENSE*',
	]).pipe(
		gulp.dest('dist/cxra/routine-assistance/')
	);
	gulp.src([
		'./README*',
	]).pipe(
		gulp.dest('dist/cxra/routine-assistance/')
	);
	done();
});