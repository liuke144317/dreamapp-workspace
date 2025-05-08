const Minio = require('minio')
const encode = require('hashcode').hashCode
const {minio:minIOServer} = require('../config.js')

const clients  = new Minio.Client({
    endPoint: minIOServer.url, // 本机内网ip
    port: minIOServer.port,
    useSSL: false, // 不需要https
    accessKey: minIOServer.username,  // 账号
    secretKey: minIOServer.password // 密码
})

async function saveImageToMinIO(file, fileBeginName = 'image') {
    let files;
    let isObjectFlag = false
    let fileNameArr = []
    if (file.constructor === Object) {
        isObjectFlag = true
        files = [file]
    } else {
        files = file
    }
    let isExist = await clients.bucketExists(minIOServer.bucket);
    let err = '';
    let dir = getDir(fileBeginName)
    if(!isExist) {
        //创建桶后，需要在管理界面修改public访问权限，默认是private
        err = await clients.makeBucket(minIOServer.bucket, 'cn-north-1');
    }
    if(!err) {
        //上传文件
        for (let i = 0;i < files.length;i++) {
            if (files[i].mimetype === 'text/html') {
                break
            }
            let suffixname = files[i].originalname.split(".")[1]
            let filename = dir + (Date.now() + i).toString() + '.' + suffixname
            clients.putObject(minIOServer.bucket, filename, files[i].buffer, null, files[i].size, function (err, data) {
                if (err)
                    console.log(err)
                else
                    console.log("Successfully uploaded minio data");
            });
            fileNameArr.push(filename)
        }
    }
    return isObjectFlag ? fileNameArr.toString() : fileNameArr
}
async function deleteImageInMinIO(fileName) {
    let fileNames = []
    if (!(fileName instanceof Array)) {
        fileNames = [fileName]
    } else {
        fileNames = fileName
    }
    for (let i = 0; i < fileNames.length; i++) {
        clients.removeObject(minIOServer.bucket, fileNames[i], function (err, data) {
            if (err)
                console.log(err)
            else
                console.log("Successfully uploaded delete minio data");
        });
    }
}
function getDir(fileName) {
    const rename = Date.now().toString()
    const hash = encode().value(rename)
    const hash_abs = Math.abs(hash)
    const firstFlood = hash_abs & 0xf
    const secondFlood = (hash_abs & 0xf0) >> 4
    return fileName + '/' +firstFlood + '/' + secondFlood + '/'
}
module.exports = {saveImageToMinIO, deleteImageInMinIO}
