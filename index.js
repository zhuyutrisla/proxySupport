var express = require('express')
var proxy = require('http-proxy-middleware')
var cookiejar = require('cookiejar')
var cors = require('cors');

const PROXY_TARGET_URL = "http://test.com"
const LISTEN_DEFAULT_PORT = 7777
const PROXY_URL_PORT = ""

const opts = {
  l: LISTEN_DEFAULT_PORT,
  p: PROXY_URL_PORT,
  u: PROXY_TARGET_URL
}


for (var i = process.argv.length - 1; i >= 2; --i) {
  var arg = process.argv[i];
	if (arg.indexOf("l=") > -1) {
		var portString = arg.substring(2);
    var portNumber = parseInt(portString, 10);
		if (portNumber === +portString) {
			opts.l = portNumber;
			process.argv.splice(i, 1);
		}
	}
	else if (arg.indexOf("p=") > -1) {
		var portString = arg.substring(2);
    var portNumber = parseInt(portString, 10);
		if (portNumber === +portString) {
			opts.p = portNumber;
			process.argv.splice(i, 1);
		}
	}
	else if (arg.indexOf("u=") > -1) {
		opts.u = arg.substring(2);
	}
}


var app = express()


const interfaces = require('os').networkInterfaces();
let IPAdress = '127.0.0.1';
for(var devName in interfaces){  
  var iface = interfaces[devName];  
  for(var i=0;i<iface.length;i++){  
        var alias = iface[i];  
        if(alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal){  
              IPAdress = alias.address;  
        }  
  }  
} 

app.all('*',function (req, res, next) {
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, DELETE, OPTIONS', "GET");
  res.header('Access-Control-Allow-Origin', `http://${IPAdress}:${opts.p}`);
  res.header("Access-Control-Allow-Headers", "*");
  if (req.method == 'OPTIONS') {
    res.send(200); /让options请求快速返回/
  }
  else {
    next();
  }
});

app.use(cors({
  credentials: true,

}));

app.use('/api', proxy({
  target: opts.u,
  changeOrigin: true,
  secure: false,
  pathRewrite: { '^/api': '' },
  onProxyReq: function (request, req, res) {
    request.setHeader('Access-Control-Allow-Credentials', 'true')
  },
  onProxyRes

}))

function onProxyRes(proxyRes, req, res) {
}

app.listen(opts.l)
console.log('服务启动🌟 🌟 🌟 🌟 🌟 🌟\n')
console.log(`🔥 🔥 代理网址为:  http://${IPAdress}:${opts.l}/api/\n`)
console.log(`💥 💥 允许跨域的网址为:  http://${IPAdress}:${opts.p}\n`)
console.log(`跨域的目标网址为: ${opts.u}`)
console.log("执行control+c 终止服务")