"use strict";

let gulp = require('gulp');

gulp.task('build:supporting:routine', done => {
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

gulp.task('build:supporting:navigator', done => {
	gulp.src([
		'./projects/module-navigator/src/lib/*.d.ts',
	]).pipe(
		gulp.dest('dist/cxra/module-federation-navigator/lib/')
	);
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