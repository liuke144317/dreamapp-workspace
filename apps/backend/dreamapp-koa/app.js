const Koa = require('koa')
const logger = require('koa-logger');
const sslify = require('koa-sslify').default;//http强制HTTPS
const https = require('https');//node内置https server
const fs = require('fs');
const path = require('path');
const serve = require('koa-static');//koa 静态资源插件
const InitManager = require('./core/init');
const checkToken = require('./utils/checkToken.js')

// const home = serve(path.resolve(__dirname, './dist'));
const app = new Koa()
app.use(checkToken) // 验证token的中间件函数
app.use(logger())
app.use(sslify())
// app.use(home)
InitManager.initCore(app);
// app.listen(3000)
// console.log('app start in 3000')
const options = {
    key: fs.readFileSync('./public/ca/liuke12355.top.key'),  //私钥文件路径
    cert: fs.readFileSync('./public/ca/liuke12355.top.cer')  //证书文件路径
};
let server = https.createServer(options, app.callback()).listen(3000, () => {
    console.log(`server running success at 3000`)
});
