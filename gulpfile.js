var gulp = require('gulp');
var browserSync = require('browser-sync');

var paths = {
  jade: './lib/**/*.jade',
  js: './public/js/*.js',
  css: './public/css/*.css'
}

gulp.task('browser-sync', function() {
  browserSync({
    files: [paths.jade, paths.js, paths.css],
    proxy: 'http://localhost:5000'
  });
});

gulp.task('default', ['browser-sync']);
