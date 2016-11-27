var gulp = require('gulp'),
watch = require('gulp-watch');

// define the default task and add the watch task to it
gulp.task('default', ['watch', 'copyfonts', 'copyimg']);

gulp.task('copyfonts', function() {
   gulp.src('./src/assets/fonts/**/*.{ttf,woff,eof,svg}')
   .pipe(gulp.dest('./build/assets/fonts'));
});

gulp.task('copyimg', function() {
   gulp.src('./src/assets/img/**/*.{png,jpg,gif,eps,svg}')
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

  return gulp.src('./src/assets/css/app.css')
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
          themePath: './src/assets/styleguide'
        }),
        // nano
    ]))
    .pipe(sourcemaps.write('./'))
    .pipe(concat('app.min.css'))
    .pipe(gulp.dest('./build/assets/css'))
})


gulp.task('scripts', () => {
  var babelify = require('babelify')
  var browserify = require('browserify')
  var source = require('vinyl-source-stream')
  var buffer = require('vinyl-buffer')

  browserify(['src/assets/js/app.js'])
  .transform(babelify)
  .bundle()
  .pipe(source('app.js'))
  .pipe(gulp.dest('build/assets/js'))
  .pipe(buffer())
});


// gulp.task('build:js', function () {
//   var babel = require('gulp-babel')
//   var sourcemaps = require('gulp-sourcemaps')
//   var concat = require('gulp-concat');
//
//   return gulp.src('./src/assets/js/app.js')
//   .pipe(sourcemaps.init())
//       .pipe(babel({
//       }))
//       .pipe(concat('app.js'))
//       .pipe(sourcemaps.write('.'))
//       .pipe(gulp.dest('./build/assets/js'));
// })

gulp.task('watch', function() {
  gulp.watch('./src/assets/**/*.css', ['build:css']);
});
