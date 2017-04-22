function packRequest(body, header) { // 组装（返回Object）
	var jsonstr;
	var body = JSON.stringify(body);
	body = AES.encryptByDES(body, header.systemDate + "");
	jsonObj = {
		requestHeader: header,
		requestBody: body
	};
	return jsonObj;
}

function RequestHeader(options) { // 请求头
	this.serviceCode = options.serviceCode; // 接口类型

	if(options.transCode) {
		this.transCode = options.transCode || ""; // 交易码
	}

	this.softTerminalId = options.softTerminalId ? options.softTerminalId : "T-WEB";

	this.productId = options.productId ? options.productId : "CHARGE"; // 产品ID

	this.interfaceVersion = options.interfaceVersion ? options.interfaceVersion : "1.0.0"; // 接口版本

	this.softTerminalVersion = options.softTerminalVersion ? options.softTerminalVersion : "2.0.0"; //WEB版本号

	this.systemDate = getDateString(new Date()) // 时间
}

function getDateString(mydate, options) { // 格式化时间
	function adjust(num) {
		if(num < 10) {
			return "0" + num;
		}
		return "" + num;
	}
	if(!options) { // 表示如果没有写option则设置其为空；否则不写会报错；
		options = {};
	}
	var y = mydate.getFullYear();
	var m = adjust(mydate.getMonth() + 1);
	var d = adjust(mydate.getDate());
	var h = adjust(mydate.getHours());
	var min = adjust(mydate.getMinutes());
	var s = adjust(mydate.getSeconds());
	var ms = mydate.getMilliseconds();

	var tokenY = "-"; // 表示默认为 - 连接年月日；
	if(options.tokenY) { // 表示如果填写option则把填写的option 里的tokenY属性代替上面的默认tokenY;
		tokenY = options.tokenY;
	}
	var tokenH = ":"; // 表示默认为 ： 连接时分秒；
	if(options.tokenH) {
		tokenH = options.tokenH;
	}
	var str = y + m + d + h + min + s;
	return str;
}

function loadRequest(options) { // 拦截器 （调用组装）
	var headerOpt = options.header;
	var requestHeader = new RequestHeader(headerOpt);
	// 添加构造函数中不存在的键
	requestHeader = $.extend(true, {}, requestHeader, options.header);
	// 过滤空字符串的键
	for(var key in requestHeader) {
		if(requestHeader[key] === "") {
			delete requestHeader[key]
		}
	}
	var requestBody = options.body;
	var res = packRequest(requestBody || {}, requestHeader);
	return res;
}

function unAes(res) { // 解密（返回body）
	var key = res.response.responseHeader.systemDate;
	var bodyDate = res.response.responseBody; // responseBody
	var headerDate = res.response.responseHeader; //resonseHeader
	var returnStatus = headerDate.returnStatus;
	var str = bodyDate.replace(/\r*\n*/g, "")
	bodyDate = AES.decryptByDES(str, key + "");
	regexp = new RegExp(String.fromCharCode(9) + "|\t|\\t|\\\t|\\\\t", "g");
	bodyDate = JSON.parse(bodyDate && bodyDate.replace(regexp, " ")) || {};
//	console.log(res.response)

	if(returnStatus != 1) { // 异常判断
		var returnDesc = headerDate.returnDesc;
		mui.toast(returnDesc, {
			duration: 'short',
			type: 'div'
		})
	}

	if(serviceCode === "DMSInfoGetMessage") { // 根据接口类型 关闭蒙层
		hideLoading();
	}

	return bodyDate
}

var serviceCode;

function request(url,options, callback) {
	serviceCode = options.header.serviceCode // 获取接口 判断是否显示Loading
	if(serviceCode === "DMSInfoGetMessage") { //根据接口类型 显示蒙层
		var show = show
//		showLoading(show);
	}

	var request = loadRequest(options); // 通过拦截器 组合request请求的报文header+body（对象）
	//http://localhost:8080/gulp/service.json
	mui.ajax(url, {
		data: request,
		dataType: 'json', // 服务器返回json格式数据
		type: 'post', // HTTP请求类型
		timeout: 5000, // 超时时间设置为5秒；
		headers: {
			'Content-Type': 'application/json;charset=UTF-8'
		},
		success: function(back) {
//			back = unAes(back); // 调用解密 返回responseBody对象
			callback(back.response.responseBody);
		},
		error: function(xhr, type, errorThrown) { // 异常处理
			if(serviceCode === "DMSInfoGetMessage") { // 根据接口类型 关闭蒙层
				hideLoading();
			}
			mui.toast('数据获取失败', {
				duration: 'short',
				type: 'div'
			});
		}
	});

}

var mask;

function showLoading() {
	mask = mui.createMask();
	mask.show(); // 显示蒙层
	$(".mui-backdrop").html('<div id="loading"></div>');
}

function hideLoading() {
	mask.close();
}