/**
 *  学习path模块
 * **/
const path = require('path')
console.log("文件名", __filename) // 获取绝对路径文件名
console.log("目录名", __dirname)  // 获取绝对路径目录名
console.log("文件名", path.filename)
console.log("目录名", path.dirname())
