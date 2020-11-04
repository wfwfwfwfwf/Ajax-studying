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

// 导入todo路由案例
const todoRouter = require('./route/todo')
// 当客户端的请求的url路径以/todo开头时★★★★★★  可以指定以什么路径开头
// app.use('/todo', todoRouter);
app.use(todoRouter);

// 监听端口
app.listen(3000,function () {
  console.log('服务器已启动:localhost:3000/todo/index.html');
});
