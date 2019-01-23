
    // 因为ajax只能请求jsonp的跨域数据，所以此时会出现跨域问题
    // $.ajax("https://api.douban.com/v2/movie/top250")
    // .then(function(res){
    //     console.log(res);
    // })


    // 此时我们就用到代理服务器了
    // 什么是代理服务器：就是由服务器来请求数据，然后返回到web浏览器端
    $.ajax("http://localhost:8080/proxydouban/movie/top250")
    .then((res)=>{
        console.log(res);
    })
    

    



