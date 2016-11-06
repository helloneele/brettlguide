var gulp = require('gulp'),
watch = require('gulp-watch'),
sass = require('gulp-sass');

// define the default task and add the watch task to it
gulp.task('default', ['watch', 'copyfonts', 'copyimg']);

gulp.task('copyfonts', function() {
   gulp.src('./assets/fonts/**/*.{ttf,woff,eof,svg}')
   .pipe(gulp.dest('./build/assets/fonts'));
});

gulp.task('copyimg', function() {
   gulp.src('./assets/img/**/*.{png,jpg,gif,eps}')
   .pipe(gulp.dest('./build/assets/img'));
});

gulp.task('build:css', function () {
    var concat = require('gulp-concat')
    var postcss = require('gulp-postcss')
    var autoprefixer = require('autoprefixer')
    var customProperties = require('postcss-custom-properties')
    var Import = require('postcss-import')
    var styleGuide = require('postcss-style-guide')
    var nano = require('cssnano')

    return gulp.src('./assets/css/app.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([
            Import,
            customProperties({ preserve: true }),
            autoprefixer,
            styleGuide({
                project: 'brettlguide.at',
                dest: 'build/styleguide/index.html',
                showCode: false,
                themePath: './assets/styleguide'
            }),
            nano
        ]))
        .pipe(concat('app.min.css'))
        .pipe(gulp.dest('./build/styleguide/dist/css'))
})

gulp.task('watch', function() {
  gulp.watch('./assets/**/*.scss', ['build:css']);
});
