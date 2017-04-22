/*引入所安装的各个包文件*/
var gulp = require("gulp");
var sass = require("gulp-sass");
var uglify = require("gulp-uglify");
var webServer = require("gulp-webserver");

/*建立css文件压缩*/
gulp.task("styles",function () { /*第一个参数问任务名*/
    gulp.src("src/sass/*.scss")  //一般在gulp文件夹下建立src文件放源文件，建立app文件放压缩后的文件，
        .pipe(sass())            //这里定位到src文件夹下的sass文件夹下的所有scss文件
        .pipe(gulp.dest("app/css")) /*将压缩好的文件输出到 app文件夹的css文件夹中*/
});

/*建立js文件压缩*/
gulp.task('js-min',function(){
	gulp.src('src/js/*.js')
		.pipe(uglify({
			mangle:true,
			compress:true,
			preserveComments:"license"
		}))
		.pipe(gulp.dest('app/js'))
})

/*复制html文件从src到app*/
gulp.task("copyHtml",function () { 
    gulp.src("src/*.html")
    .pipe(gulp.dest("app"))
});

/*开启有一个服务器*/
gulp.task("webserver",function(){  //webserver可以用于直接创建nodeJS服务器设置好端口，并可以监听所有文件
    gulp.src("./")               //不刷新页面自动更新,输入网址：localhost：端口号+文件路径 打开网页
    .pipe(webServer({
        livereload: true, /*修改文件自动刷新*/
        directoryListing: {  /*要不要显示目录，开发环境下可以显示*/
            enable:true,
            path: './'  /*有哪个目录下开始访问*/
        },
        port: 81, /*端口号*/
        host: 'localhost'
    }))
});
/*看守任务 看守sass*/
gulp.task("watch",function () {
    gulp.watch("src/sass/*.scss",["styles"]);  //看守css和html两个页面进行压缩任务
    gulp.watch("src/*.html",["copyHtml"]);
    gulp.watch("src/*.js",["js-min"]);
});
/*默认default任务，执行所有任务*/
gulp.task("default",["webserver","styles","copyHtml","watch","js-min"]); //设置默认执行所有任务