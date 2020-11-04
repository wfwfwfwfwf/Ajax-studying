// 引入express框架
const express = require('express');
// 路径处理模块
const path = require('path');
// 向其他服务器端请求数据的模块★★★★ npm request模块
const request = require('request');
// 创建web服务器
const app = express();
// 静态资源访问服务功能
app.use(express.static(path.join(__dirname, 'public')));

//ajax请求C端需要遵循同源政策,但是S端可以绕过这个限制★★★
//08:本质是让自己S端去请求别的S端的数据,层层返回
app.get('/server', (req, res) => {
	//调用request('url',callback)向3001请求数据
	request('http://localhost:3001/cross', (err, response, body) => {
		//response是S端响应信息,body是响应的内容
		// res.send(response);
		res.send(body);
	})
});

// 监听端口
app.listen(3000);
// 控制台提示输出
console.log('服务器启动成功,端口号:3000');