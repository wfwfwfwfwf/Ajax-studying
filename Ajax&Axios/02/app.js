// 引入express框架
const express = require('express');
// 路径处理模块
const path = require('path');
const formidable = require('formidable');
// 创建web服务器
const app = express();

// 静态资源访问服务功能
app.use(express.static(path.join(__dirname, 'public')));

// 02邮箱地址验证
app.get('/verifyEmailAdress', (req, res) => {
	//获取json文件对象
	const email = require('./db');
	//判断一个对象数组里是否包含另一个对象 some方法★★★
	var result =email.emails.some(item=>{
		if (item.email == req.query.email){
			return true
		}
	})
	 if (result){
		 res.status(400).send({message: '邮箱地址已经注册过了, 请更换其他邮箱地址'});
	 }else{
		 res.send({message: '恭喜, 邮箱地址可用'});
	 }
});

// 03输入框文字提示  (字符串包含)
app.get('/searchAutoPrompt', (req, res) => {
	// 搜索关键字
	const key = req.query.key;
	//key:黑马
	// console.log(key)
	const search = require('./db');
	 // console.log(search.list)
	//筛选出包含key...的对象
	let results = search.list.filter(item => item.listValue.includes(key))
	// console.log(results)
	let arr=[];
	for (let v of results){
		arr.push(v.listValue);
	}
	// console.log(arr)
	//最后发一个字符串数组过去
	res.send(arr)
});


//省市区三级联动案例
// 04获取省份
app.get('/province', (req, res) => {
	//这里是res.json★★★
	//发送一个json的响应。这个方法和将一个对象或者一个数组作为参数传递给C端,与res.send()方法的效果相同
	res.json([{
		id: '001',
		name: '黑龙江省'
	},{
		id: '002',
		name: '四川省'
	},{
		id: '003',
		name: '河北省'
	}
	]);
});

// 04根据省份id获取城市
app.get('/cities', (req, res) => {
	// 获取省份id
	const id = req.query.id;
	// 城市信息
	const cities = {
		'001': [{
			id: '300',
			name: '哈尔滨市'
		}, {
			id: '301',
			name: '齐齐哈尔市'
		}, {
			id: '302',
			name: '牡丹江市'
		}],
		'002': [{
			id: '400',
			name: '成都市'
		}, {
			id: '401',
			name: '绵阳市'
		}],
		'003': [
			{
			id: '500',
			name: '石家庄市'
			}, {
			id: '501',
			name: '唐山市'
		}]
	}
	// 响应
	res.send(cities[id]);
});

// 04根据城市id获取县城
app.get('/areas', (req, res) => {
	// 获取城市id
	const id = req.query.id;
	// 县城信息
	const areas = {
		'300': [{
			id: '20',
			name: '道里区',
		}, {
			id: '21',
			name: '南岗区'
		}, {
			id: '22',
			name: '平房区',
		}],
		'301': [{
			id: '30',
			name: '龙沙区'
		}, {
			id: '31',
			name: '铁锋区'
		}]
	};
	// 响应
	res.send(areas[id] || []);
});

//05todo,06:formData对象的使用(也是post)
app.post('/formData', (req, res) => {
	// 创建formidable表单解析对象(专门解析formData对象)
	const form = new formidable.IncomingForm();
	// 解析客户端传递过来的FormData对象
	//参数:{err:错误对象,fields:普通表单中的请求参数,files:文件上传相关}
	form.parse(req, (err, fields, files) => {
		//扔过去的是json字符串
		res.send(fields);
	});
});

// 07:实现文件上传的路由
app.post('/upload', (req, res) => {
	// 创建formidable表单解析对象(固定写法)
	const form = new formidable.IncomingForm();
	// 设置客户端上传文件的存储路径(拼接绝对路径)★★★
	//左边是方法,右边是路径
	form.uploadDir = path.join(__dirname, 'public', 'uploads');
	// 保留上传文件的后缀名字
	form.keepExtensions = true;
	// 解析客户端传递过来的FormData对象   上传的文件在files里★★★
	form.parse(req, (err, fields, files) => {
		// 将客户端传递过来的  文件地址  响应到客户端
		res.send({
			// files.attrName.path:文件绝对路径
			// files.attrName.path.split 字符串分割 变成数组["","xx"],要的是后面的值
			path: files.attrName.path.split('public')[1]
		});
	});
});

// 监听端口
app.listen(3000);
// 控制台提示输出
console.log('服务器启动成功');