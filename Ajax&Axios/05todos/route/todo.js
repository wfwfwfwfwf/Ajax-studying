// 引入express框架
const express = require('express');
// 工具库??
const _ = require('lodash');
// 对象校验??
const Joi = require('joi');
// 创建todo案例路由
const todoRouter = express.Router();
// 导入todo集合构造函数
const Task = require('../model/task');


// 获取任务列表
todoRouter.get('/task', async (req, res) => {
	//从数据库找任务
	//必须是async声明的函数,必须在函数里面await Promise对象★★★★
	const task = await Task.find();
	// 响应给C端
	res.send(task);

	/*  Task.find().then(function (data) {
			res.send(data);
	});*/
});

// 添加任务
todoRouter.post('/addTask', async (req, res) => {
	// 接收客户端传递过来的任务名称
	// ES6解构赋值
	const { title } = req.body;
	// console.log(title)
	// 验证规则
	const schema = {
		title: Joi.string().required().min(2).max(30)
	};
	// 验证客户端传递过来的请求参数 
	const { error } = Joi.validate(req.body, schema);
	// 验证失败
	if (error) {
		// 将错误信息响应给客户端
		return res.status(400).send({message: error.details[0].message})
	}
	// 创建任务实例(等价在数据库中创建对象)
	const task = new Task({title: title, completed: false});
	// 执行插入操作
	await task.save();
	// task.save().then();
	// 响应
	setTimeout(() => {
		res.send(task);
	}, 1000)
});

// 删除任务
todoRouter.get('/deleteTask', async (req, res) => {
	// 要删除的任务id
	const { _id } = req.query;
	// 验证规则
	const schema = {
		_id: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/)
	}
	// 验证客户端传递过来的请求参数 
	const { error } = Joi.validate(req.query, schema);
	// 验证失败
	if (error) {
		// 将错误信息响应给客户端
		return res.status(400).send({message: error.details[0].message})
	}
	// 删除任务
	const task = await Task.findOneAndDelete({_id: _id});
	// 响应回去一个对象
	//{ completed: false, _id: 5f9567c44ed2135d44565c8a, title: '吃饭' }
	// console.log(task);
	res.send(task);
});

// 清除已完成任务
todoRouter.get('/clearTask', async (req, res) => {
	// 执行清空操作
	const result = await Task.deleteMany({completed: true});
	// 返回清空数据
	// console.log(result)
	res.send(result);
});

// 修改任务
todoRouter.post('/modifyTask', async (req, res) => {
	// 执行修改操作？？？？？
	const task = await Task.findOneAndUpdate({_id: req.body._id}, _.pick(req.body, ['title', 'completed']),{new: true})
	// 响应{ n: 2, ok: 1, deletedCount: 删除数目}
	res.send(task);
});

// 查询未完成任务数量
todoRouter.get('/unCompletedTaskCount', async (req, res) => {
	// 执行查询操作
	const result = await Task.countDocuments({completed: false});
	// 响应
	res.send({num: result})
});

// 更改任务全部状态
todoRouter.get('/changeAllTasksComplete', async (req, res) => {
	// 状态
	const { status } = req.query;
	// 执行更改状态操作
	const result = await Task.updateMany({}, {completed: status});
	// 响应
	res.send(result);
});

// 将todo案例路由作为模块成员进行导出
module.exports = todoRouter;