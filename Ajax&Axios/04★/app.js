// 引入express框架
const express = require('express');
// 路径处理模块
const path = require('path');
const bodyParser = require('body-parser');
// 创建web服务器
const app = express();
// 静态资源访问服务功能
app.use(express.static(path.join(__dirname, 'public')));
// 处理post请求参数
app.use(bodyParser.json()); 
// app.use(bodyParser.urlencoded({extended: false}));

//01$ajax的基本使用
app.get('/base', (req, res) => {
	res.send({
		name: 'zhangsan',
		age: 30
	})
});
//01$ajax的基本使用
app.post('/base', (req, res) => {
	//res.status(400).send触发失败的回调函数
	res.send({
		name: 'zhaoliu',
		age: 35
	})
});

//02$.ajax  get传参问题
app.get('/user', (req, res) => {
	res.send(req.query);
});

//02$.ajax  post传参问题  & 03演示beforeSend
app.post('/user', (req, res) => {
	res.send(req.body)
});

//05 $.ajax发送jsonp请求
app.get('/jsonp', (req, res) => {
	const cb = req.query.cb;
	const data = cb+"({name: 'zhaoliu'})";
	res.send(data);
/*	res.jsonp({
		name: 'lisi',
		age:50
	})*/
});

// 07restful获取用户列表信息
/*
app.get('/users', (req, res) => {
	res.send('当前是获取用户列表信息的路由');
});
*/

// 07restful获取某一个用户具体信息的路由
// req.params的使用★★★
app.get('/users/:id/:age/:sex', (req, res) => {
	// 获取客户端传递过来的用户id
	//req.params:{ id: '10', age: '20', sex: '男' }
	// console.log(req.param.id)
	// console.log(req.query)
	console.log(req.params)
	const id = req.params.id;
	const age = req.params.age;
	const sex = req.params.sex;
	// //${id}ES6模板字符串
	res.send(`当前我们是在获取id为${id},age:${age},sex:${sex}的用户信息`);
});

// 07restful删除某一个用户 :id类似占位作用(本质是个变量)★★★★★★★
app.delete('/users/:id', (req, res) => {
	// 获取客户端传递过来的用户id
	const id = req.params.id;
	//${id}ES6模板字符串
	res.send(`当前我们是在删除id为${id}用户信息`);
});

// 07restful修改某一个用户的信息
app.put('/users/:id', (req, res) => {
	// 获取客户端传递过来的用户id
	const id = req.params.id;
	//${id}ES6模板字符串
	res.send(`当前我们是在修改id为${id}用户信息`);
});


// 监听端口
app.listen(3000);
// 控制台提示输出
console.log('服务器启动成功');