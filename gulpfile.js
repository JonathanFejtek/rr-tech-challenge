const gulp = require('gulp');
const babel = require('babelify');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const browserSync = require('browser-sync');
const reload = browserSync.reload;
const notify = require('gulp-notify');
const sass = require('gulp-sass');
const plumber = require('gulp-plumber');
const concat = require('gulp-concat');
const connect = require('gulp-connect');
const open = require('gulp-open');
const os = require('os');

gulp.task('styles', () => {
	return gulp.src('./dev/styles/**/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(concat('style.css'))
		.pipe(gulp.dest('./public/styles'))
});

gulp.task('js', () => {
	return browserify('dev/scripts/app.js', {debug: true})
		.transform('babelify', {
			sourceMaps: true,
			presets: ['env','react']
		})
		.bundle()
		.on('error',notify.onError({
			message: "Error: <%= error.message %>",
			title: 'Error in JS 💀'
		}))
		.pipe(source('app.js'))
		.pipe(buffer())
		.pipe(gulp.dest('public/scripts'))
		.pipe(reload({stream:true}));
});

gulp.task('bs', () => {
	return browserSync.init({
		server: {
			baseDir: './',
		}
	});
});

gulp.task('serv1', function () {
	connect.server({
	  name: 'Test Instance 1',
	  root: './',
	  port : 8000,
	});
});

gulp.task('serv2', function () {
	connect.server({
	  name: 'Test Instance 2',
	  root: './',
	  port: 8001,
	});
});

gulp.task('serv3', function () {
	connect.server({
	  name: 'Test Instance 2',
	  root: './',
	  port: 8002,
	});
});

gulp.task('rr-test',['serv1','serv2','serv3'],()=>{});


gulp.task('default', ['bs','js','styles'], () => {
	gulp.watch('dev/**/*.js',['js']);
	gulp.watch('dev/**/*.scss',['styles']);
	gulp.watch('./public/styles/style.css',reload);
});
