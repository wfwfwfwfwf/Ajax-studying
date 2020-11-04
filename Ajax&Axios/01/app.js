// 引入express框架
const express = require('express');
// 路径处理模块
const path = require('path');
//post
const bodyParser = require('body-parser');
const fs = require('fs');
// 创建web服务器
const app = express();
//post
app.use(bodyParser.urlencoded({ extended: false }));
//解析json
app.use(bodyParser.json());

// 静态资源访问服务功能(用到了path模块)
//需要加上/public/
// app.use('/public/', express.static('./public/'));
app.use(express.static(path.join(__dirname, 'public')));
//render方法必备engine
app.engine("html",require("express-art-template"));
//设置默认读取的视图路径
app.set("views",path.join(__dirname,"./public/"));
// 01:第一个ajax请求
/*
	执行顺序:先执行C端html文件=>open url =>C端send请求=>
  S端获取C端的请求地址找到对应C端的请求路由=>S端返回数据=>C端接收数据 ★★★
  nodejs中可以在路由里面render间接执行html文件,所以不用在url里手动执行★★★
 */
//01   09
app.get('/first', (req, res) => {
	//返回的数据
	res.send('Hello,第一个ajax请求');
});

// 02:C端通过ajax获取json数据  (对象)
// 10
app.get('/responseData', (req, res) => {
	res.send({"name": "zs"});
});

// 03:传递get请求参数
app.get('/get', (req, res) => {
	//req.query get请求方式获取url?之后的参数
	res.send(req.query);
});


// 04★:传递post请求参数
app.post('/post', (req, res) => {
	res.send(req.body);
});

// 05todo:向S端发送json数据
app.post('/json', (req, res) => {
	res.send(req.body);
});

//06:获取S端响应数据方式2(了解) 可以直观看到ajax执行的流程★★★
app.get('/readystate', (req, res) => {
	res.send('hello');
});

// 07:ajax错误处理
app.get('/error', (req, res) => {
	//console.log(abc);
	res.status(400).send('not ok');
});

// 08:ajax的缓存问题
app.get('/cache', (req, res) => {
	fs.readFile('./test.txt', (err, result) => {
		res.send(result);
	});
});

// 监听端口
app.listen(3000);
// 控制台提示输出
console.log('服务器启动成功 端口:3000');