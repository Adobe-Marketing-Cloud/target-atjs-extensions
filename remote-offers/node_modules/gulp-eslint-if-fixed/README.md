gulp-eslint-if-fixed
--------------------

usage:
```
var eslintIfFixed = require('gulp-eslint-if-fixed');

+gulp.task('lint-fix', function() {
  return gulp.src('src/*.js')
    .pipe(eslint({fix:true}))
    .pipe(eslint.format())
    .pipe(eslintIfFixed('src'));
});
```
