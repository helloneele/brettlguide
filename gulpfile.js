var gulp = require('gulp'),
    watch = require('gulp-watch'),
    handlebars = require('gulp-handlebars'),
    defineModule = require('gulp-define-module'),
    merge = require('merge-stream');

// define the default task and add the watch task to it
gulp.task('default', ['watch', 'scripts', 'copyfonts', 'copy']);

gulp.task('copyfonts', function() {
   var brettlFonts = gulp.src('./src/assets/fonts/**/*.{ttf,woff,eof,svg}')
   .pipe(gulp.dest('./build/assets/fonts'));
   var fontAwsmFonts = gulp.src('./node_modules/font-awesome/fonts/**/*.{ttf,woff,eof,svg,woff2,otf}')
   .pipe(gulp.dest('./build/assets/fonts'));

   return merge(brettlFonts, fontAwsmFonts);
});


gulp.task('copy', function() {
   var images = gulp.src('./src/assets/img/**/*.{png,jpg,gif,eps,svg}')
   .pipe(gulp.dest('./build/assets/img'));
   var fontAwesomeCSS = gulp.src('./node_modules/font-awesome/css/font-awesome.min.css')
   .pipe(gulp.dest('./build/assets/css'));

   return merge(images, fontAwesomeCSS);
});

gulp.task('templates', function(){
    gulp.src(['./src/assets/templates/*.hbs'])
        .pipe(handlebars())
        .pipe(defineModule('node',{
            require: {
                Handlebars: '../../../src/assets/js/handlebarHelpers'
            }
        }))
        .pipe(gulp.dest('./build/assets/templates/'));
});

gulp.task('precompile:css', function (){
  var fs = require("fs");
  var atImport = require("postcss-import");
  var sourcemaps = require('gulp-sourcemaps');
  var concat = require('gulp-concat');
  var postcss = require('gulp-postcss');
  var autoprefixer = require('autoprefixer');
  var lost = require('lost');
  var customProperties = require('postcss-custom-properties');
  var styleGuide = require('postcss-style-guide');
  var nano = require('cssnano');
  var nested = require('postcss-nested');

  var processors = [
    atImport({}),
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
    nano
  ]


  return gulp
  .src(['./src/assets/css/app.css'])
  .pipe(sourcemaps.init())
  .pipe(postcss(processors))
  .pipe(sourcemaps.write())
  .pipe(concat('app.min.css'))
  .pipe(gulp.dest('./build/assets/css'))
})

gulp.task('build:css', ['precompile:css'], function (){
  var concat = require('gulp-concat')

  return gulp
  .src(['./build/assets/css/app.min.css', './node_modules/mapbox-gl/dist/mapbox-gl.css'])
  .pipe(concat('app.min.css'))
  .pipe(gulp.dest('./build/assets/css'))
})


gulp.task('scripts', ['templates'], function() {
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


gulp.task('minify', function () {
  var gp = require('geojson-precision');
  var change = require('gulp-change');

  function performChange(content) {
    var top = JSON.parse(content)
    for(let object in top.features) {
      top.features[object] = gp.parse(top.features[object], 6)
    }
    top = JSON.stringify(top)
    return content.replace(content, top);
  }

    return gulp.src(['./src/assets/data_uncompressed/*.json'])
      .pipe(change(performChange))
      .pipe(gulp.dest('./src/assets/data'));
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
  gulp.watch('./src/assets/**/*.js', ['scripts']);
  gulp.watch('./src/assets/**/*.hbs', ['scripts'])
});
