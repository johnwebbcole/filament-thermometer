/* globals require */
var gulp = require('gulp');
var del = require('del');
var gulpLoadPlugins = require('gulp-load-plugins');
var plugins = gulpLoadPlugins();

gulp.task('clean', function (done) {
    del(['dist/*']).then(paths => {
        console.log('Deleted files and folders:\n', paths.join('\n')); // eslint-disable-line no-console, no-undef
        done();
    });
});

gulp.task('inject', ['src'], function () {
    return gulp.src('dist/main.jscad')
        .pipe(plugins.inject(gulp.src(['!dist/main.jscad', 'dist/*.js*']), {
            relative: true,
            starttag: '// include:js',
            endtag: '// endinject',
            transform: function (filepath) {
                return 'include(\'' + filepath + '\');';
            }
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('src', ['lib'], function () {
    return gulp.src(['!node_modules', '*.jscad'])
        .pipe(plugins.plumber())
        .pipe(gulp.dest('dist'));
});

gulp.task('lib', function () {
    return gulp.src('node_modules/**/jscad.json')
        .pipe(plugins.plumber())
        .pipe(plugins.jscadFiles())
        .pipe(plugins.flatten())
        .pipe(gulp.dest('dist'));
});

gulp.task('default', ['clean', 'lib', 'src', 'inject'], function () {
    plugins.watch(['!dist/*', '**/*.jscad', 'node_modules/'], {
        verbose: true,
        followSymlinks: true
    }, plugins.batch(function (events, done) {
        gulp.start('inject', done);
    }));
});
