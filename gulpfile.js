// 引入模块
const gulp = require("gulp");
const connect = require("gulp-connect");
const proxy = require("proxy");
const uglify = require("gulp-uglify");
const pump = require('pump');
const babel = require('gulp-babel');
const cleanCSS = require('gulp-clean-css');
const imagemin = require('gulp-imagemin');
// 因为两个路径用的比较多，写起来比较麻烦，所以封装一个：
const srcList = {
    javascript : {
        src : "./src/javascript/*.js",
        dist : "./dist/javascript"
    },
    stylesheets : {
        src : "./src/stylesheets/*.css",
        dist : "./dist/stylesheets"
    },
    images : {
        src : "./src/images/*.jpg",
        dist : "./dist/images"
    }
}


// --------------配置服务器 start-------------------------------------

// 将代理服务器的返回值单独建立一个表，方便维护
// const proxyList = [
//                     // /proxydouban => web端发起请求时带有的一个小标记,这个标记是自定义的
//                     proxy('/proxydouban',  {
//                         // 由服务器发起请求的目标
//                         target: 'https://api.douban.comv2:443',
//                         // 是否重定向源, 默认一定为true;
//                         changeOrigin:true,
//                         // 此时报错：ReferenceError: proxy is not defined，所以我们就先安装这个proxy
//                         // 表示路径中的某些标记要清除掉。
//                         pathRewrite: {
//                             "/proxydouban" : ""
//                         }
//                     }),
//                 ]

// 链接服务器
gulp.task("connect",()=>{
    connect.server({
        port : 8080 ,
        root : "./dist",
        livereload : true,
        // middleware: function(connect, opt) {
        //     return proxy ;
        //   }
    })
});


// --------------配置服务器 end-------------------------------------


// ---------------------文件还是更新  start---------------

// 将html从开发区src转移到发布模式dist
gulp.task("html",()=>{
    return gulp.src("./src/html/*.html")
        .pipe(gulp.dest("./dist"))
        .pipe(connect.reload());
});

// 将js从开发区src转移到发布模式dist
gulp.task("js",()=>{
    return gulp.src("./src/javascript/index.js")
        .pipe(gulp.dest("./dist/javascript"))
        .pipe(connect.reload());
});

// 将css从开发区src转移到发布模式dist
gulp.task("css",()=>{
    return gulp.src(srcList.stylesheets.src)
        .pipe(gulp.dest(srcList.stylesheets.dist))
        .pipe(connect.reload());
});

// 将img从开发区src转移到发布模式dist
gulp.task("img",()=>{
    return gulp.src(srcList.images.src)
        .pipe(gulp.dest(srcList.images.dist))
        .pipe(connect.reload());
});

// 监听：当html发生变化时触发html指令
gulp.task("watch",()=>{
    gulp.watch(["./src/html/*.html"],["html"]);
    gulp.watch([srcList.javascript.src],["js"]);
    gulp.watch([srcList.stylesheets.src],["css"]);
    gulp.watch([srcList.images.src],["img"]);
});

// ---------------------文件还是更新  end---------------




// -------------------开发：start-----------------------------
// 一般讲耗性能较大的放在此处，一般单独触发


// JS压缩（因为比较耗性能，所以一般放在bulid里边手动控制） 
// 用到的工具是：gulp-uglify，步骤都是一样的，先下载安装，再引入，再使用
// 注意：此指令不支持ES6，所以需要先转码
gulp.task('compress', function (cb) {
            pump([
                gulp.src(srcList.javascript.src),
                // babel是转移ES6，工具名为gulp-babel
                babel({
                    presets: ['@babel/env']
                }),
                // 压缩
                uglify(),
                gulp.dest(srcList.javascript.dist)
            ],
            cb
            );
        });


// css压缩
// 用的是：gulp-clean-css
gulp.task('minify-css', () => {
    return gulp.src(srcList.stylesheets.src)
      .pipe(cleanCSS({compatibility: 'ie8'}))
      .pipe(gulp.dest(srcList.stylesheets.dist));
  });

// images压缩
// gulp-imagemin
gulp.task('imgCompress', () =>
    gulp.src(srcList.images.src)
        .pipe(imagemin())
        .pipe(gulp.dest(srcList.images.dist))
);

// 统一放到build里
gulp.task("build",["compress","minify-css","imgCompress"])

// -------------------开发：end-----------------------------


// 调试环境
gulp.task("default",["watch","connect"])
