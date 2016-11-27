var gulp = require('gulp'),
watch = require('gulp-watch');

// define the default task and add the watch task to it
gulp.task('default', ['watch', 'copyfonts', 'copyimg']);

gulp.task('copyfonts', function() {
   gulp.src('./assets/fonts/**/*.{ttf,woff,eof,svg}')
   .pipe(gulp.dest('./build/assets/fonts'));
});

gulp.task('copyimg', function() {
   gulp.src('./assets/img/**/*.{png,jpg,gif,eps,svg}')
   .pipe(gulp.dest('./build/assets/img'));
});

gulp.task('build:css', function () {
    var concat = require('gulp-concat')
    var postcss = require('gulp-postcss')
    var sourcemaps = require('gulp-sourcemaps')
    var autoprefixer = require('autoprefixer')
    var lost = require('lost')
    var customProperties = require('postcss-custom-properties')
    var Import = require('postcss-import')
    var styleGuide = require('postcss-style-guide')
    var nano = require('cssnano')
    var nested = require('postcss-nested')

    return gulp.src('./assets/css/app.css')
        .pipe(sourcemaps.init())
        .pipe(postcss([
            Import,
            nested,
            customProperties({ preserve: true }),
            lost(),
            autoprefixer,
            styleGuide({
                project: 'brettlguide.at',
                dest: 'build/styleguide/index.html',
                showCode: false,
                themePath: './assets/styleguide'
            }),
            // nano
        ]))
        .pipe(sourcemaps.write('./'))
        .pipe(concat('app.min.css'))
        .pipe(gulp.dest('./build/assets/css'))
})

gulp.task('watch', function() {
  gulp.watch('./assets/**/*.css', ['build:css']);
});
