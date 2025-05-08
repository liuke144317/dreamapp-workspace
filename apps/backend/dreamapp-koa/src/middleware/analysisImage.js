const path = require('path')
const mime = require('mime-types')
const fs = require('fs')
module.exports = (ctx) => {
  let filePath = path.resolve(__dirname, '../../' + ctx.url) //图片地址
  let file = null;
  try {
    file = fs.readFileSync(filePath); //读取文件
  } catch (error) {
    //如果服务器不存在请求的图片，返回默认图片
    filePath = path.resolve(__dirname, '../../src/apps/Upload/image/default.png'); //默认图片地址
    file = fs.readFileSync(filePath) //读取文件
  }
  let mimeType = mime.lookup(filePath) //读取图片文件类型
  ctx.set('content-type', mimeType)
  ctx.body = file
}
