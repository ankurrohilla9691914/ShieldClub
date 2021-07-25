const gulp = require('gulp');
const cssnanno = require('gulp-cssnano');
const rev = require('gulp-rev');
const imagemin = require('gulp-imagemin');
const uglify = require('gulp-uglify-es').default;
const del = require('del');


gulp.task('css', function(done){
    gulp.src('./assets/**/*.css')
    .pipe(cssnanno())
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest({
        cwd: "public",
        merge: true
    }))
    .pipe(gulp.dest('./public/assets'));
    done();
});

gulp.task('js', function(done){
    gulp.src('./assets/**/*.js')
    .pipe(uglify())
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest({
        cwd: "public",
        merge: true
    }))
    .pipe(gulp.dest('./public/assets'));
    done();
});

// gulp.task('images', function(done){
//     gulp.src('./assets/**/*.+(png|jpg|gif|svg|jpeg)')
//     .pipe(imagemin())
//     .pipe(rev())
//     .pipe(gulp.dest('./public/assets'))
//     .pipe(rev.manifest({
//         cwd: "public/assets",
//         merge: true
//     }))
//     .pipe(gulp.dest('./public/assets'));
//     done();
// });



gulp.task('clean:assets', function(done){
    del.sync('./public');
    done();
});

gulp.task('build', gulp.series('clean:assets', 'css', 'js'), function(done){
    console.log('Building assets...');
    done();
})

