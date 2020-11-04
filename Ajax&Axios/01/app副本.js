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

app.set("views",path.join(__dirname,"./public/"));

//通过自己设置的url进入对应html,而不是每次都输入html名字★★★★
// 进入04
app.get('/get', (req, res) => {
	//req.query get请求方式获取url?之后的参数
	res.render('04传递post请求参数.html')
});

// 04★:传递post请求参数 处理请求
app.post('/post', (req, res) => {
	res.send(req.body);
});
//如果ajax也是get请求,此时需要/???进html,
//然后C端换一个路由地址发送ajax请求,S端对应url设置接收并回应即可

// 监听端口
app.listen(3000);
// 控制台提示输出
console.log('服务器启动成功 端口:3000');