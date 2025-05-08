/**
 * Created by liuke on 2020/3/31 10:21.
 *
 * use to 路由器-首页路由
 */
const ctrl = require('./Ctrl.js')
const multer = require('koa-multer')
var encode = require('hashcode').hashCode
const fs = require('fs')

module.exports = (router) => {
  //配置
  var storage = multer.diskStorage({
    // 文件保存路径
    destination: function (req, file, cb) {
      this.rename = Date.now().toString()
      const hash = encode().value(this.rename)
      const hash_abs = Math.abs(hash)
      const firstFlood = hash_abs & 0xf
      const secondFlood = (hash_abs & 0xf0) >> 4
      let pathHeader = ''
      if (req.body.type === 'push') {
        pathHeader = 'public/uploads/'
      } else if (req.body.type === 'user') {
        pathHeader = 'public/user/'
      }
      let dir = pathHeader + firstFlood
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir)
      }
      dir += '/' + secondFlood
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir)
      }
      cb(null, dir)

    },
    // 修改文件名称
    filename: function (req, file, cb) {
      let fileFormat = ''
      if (file.originalname.indexOf('.') === -1 && file.originalname.indexOf('file-') !== -1) {
        fileFormat = ['png'] // cavans 截图没有文件后缀特殊处理
      } else {
        fileFormat = (file.originalname).split(".");  //以点分割成数组，数组的最后一项就是后缀名
      }
      cb(null, this.rename + "." + fileFormat[fileFormat.length - 1]);
    }
  })
  //加载配置
  var upload = multer({storage: storage});
  router
    .post('/BLogs/upLoad/img', upload.single('file'), async (ctx, next) => {
      if (ctx.req.body.type && ctx.req.body.type === 'user' && ctx.req.body.userid) { // 用户上传头像类型，删除之前上传头像
        let res = await ctrl.getUserInfoByUserID(ctx.req.body.userid)
        if (res[0].userImg) {
          let imgPath = res[0].userImg
          fs.exists(imgPath.slice(imgPath.indexOf('/public') + 1, imgPath.length), function (exists) {
            if (exists) {
              fs.unlinkSync(imgPath.slice(imgPath.indexOf('/public') + 1, imgPath.length))
            }
          });
        }
      }
      ctx.body = {
        ...ctx.req.file
      }
    })
  // .get('/public/uploads',async (ctx) => {
  // 	let filePath = ctx.url //图片地址
  // 	let file = null;
  // 	try {
  // 		file = fs.readFileSync(filePath); //读取文件
  // 	} catch (error) {
  // 		//如果服务器不存在请求的图片，返回默认图片
  // 		filePath = path.join(__dirname, '/image/default.png'); //默认图片地址
  // 		file = fs.readFileSync(filePath); //读取文件
  // 	}
  // 	let mimeType = mime.lookup(filePath); //读取图片文件类型
  // 	ctx.set('content-type', mimeType);
  // 	ctx.body = file
  // })
}
