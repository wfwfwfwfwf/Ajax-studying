// 引入express框架
const express = require('express');
// 路径处理模块
const path = require('path');
// 接收post请求参数
const formidable = require('formidable');
// 实现session功能
var session = require('express-session');
// 创建web服务器
const app = express();
// 接收post请求参数
// 实现session功能
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
}));

// 静态资源访问服务功能
app.use(express.static(path.join(__dirname, 'public')));

// 拦截所有请求
// app.use((req, res, next) => {
// 	// 1.允许哪些客户端访问我
// 	// * 代表允许所有的客户端访问我
// 	res.header('Access-Control-Allow-Origin', '*')
// 	// 2.允许客户端使用哪些请求方法访问我
// 	res.header('Access-Control-Allow-Methods', 'get,post')
// 	next();
// });

//s1: 01  测试非同源Ajax请求.html
app.get('/test1', (req, res) => {
	res.send('ok');
});
//s1:02
app.get('/test2', (req, res) => {
	//向C端返回一个字符串,这个字符串在script会被解析直接执行函数fn
	const result = 'fn({name: "张三"})';
	res.send(result);
});
//s1: 03  04★  05jsonp封装
app.get('/better', (req, res) => {
	// 接收客户端传递过来的函数的名称
	/*
	const fnName = req.query.callback;
	// 将函数名称对应的函数调用代码返回给客户端
	const data = JSON.stringify({name: "张三"});
	const result = fnName + '('+ data +')';
	setTimeout(() => {
		res.send(result);
	}, 1000)
  */
	//最终优化:上面的代码等价这一行代码★★★★
	//jsonp 是express框架的
	 res.jsonp({name: 'sss', age: 200});
});
//07访问非同源数据的S端解决方案
app.get('/cross', (req, res) => {
	// * 代表允许所有的客户端访问我
	// res.header('Access-Control-Allow-Origin', '*')
	// 2.允许客户端使用哪些请求方法访问我
	// res.header('Access-Control-Allow-Methods', 'get,post')
	// 允许客户端发送跨域请求时携带cookie信息
	res.send('访问成功')
});

// 07CORS跨域资源共享  允许ajax请求C端不遵循同源政策(修改配置)
// express中间件  拦截所有请求   app.use配置该服务端白名单
app.use((req, res, next) => {
	// 1.允许哪些客户端访问我
	// res.header第二个参数 if* 代表允许所有的客户端访问我
	// 注意：如果跨域请求中涉及到cookie信息传递，值不可以为*号 比如是具体的域名信息
	res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
	// 2.允许客户端使用哪些请求方法访问我
	res.header('Access-Control-Allow-Methods', 'get,post');
	// 09:允许客户端发送跨域请求时携带cookie信息
	res.header('Access-Control-Allow-Credentials', true);
	//不要忘记next
	next();
});
//09实现跨域登录
app.post('/login', (req, res) => {
	// 创建表单解析对象
	var form = formidable.IncomingForm();
	// 解析表单
	form.parse(req, (err, fields, file) => {
		// 接收客户端传递过来的用户名和密码(ES6解构赋值)
		//fields是C端发过来的{username:"xxx",password:"xxx"}
		const { username, password } = fields;
		// 用户名密码比对
		if (username == 'itheima' && password == '123456') {
			// 设置session
			req.session.isLogin = true;
			res.send({message: '登录成功'});
		} else {
			res.send({message: '登录失败, 用户名或密码错误'});
		}
	})
});
//09检测登录状态(不严谨)
app.get('/checkLogin', (req, res) => {
	// 判断用户是否处于登录状态
	if (req.session.isLogin) {
		res.send({message: '处于登录状态'})
	} else {
		res.send({message: '处于未登录状态'})
	}
});




// 监听端口
app.listen(3001);
// 控制台提示输出
console.log('服务器启动成功,端口号3001');