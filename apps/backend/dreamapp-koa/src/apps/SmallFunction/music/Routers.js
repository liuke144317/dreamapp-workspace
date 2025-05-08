/**
 * Created by liuke on 2020/3/31 11:07.
 *
 * use to 上传音乐
 */
const { createClient } = require("webdav")
const ctrl = require('./Ctrl.js')
const multer = require('@koa/multer')
const NodeID3 = require('node-id3')
let clients
module.exports = (router) => {
  let upload = multer();
  router
    /*上传音乐资源*/
    .post('/webDav/setMusic', upload.fields([{name: 'file', maxCount: 3}]), async (ctx, next) => {
      let data = await writeToQH(ctx)
      let music_position = ''
      let lyric_position = ''
      let post_position = ''
      if (ctx.files.file.length === 1) {
        music_position = ctx.files.file[0].path
      }
      if (ctx.files.file.length === 2) {
        music_position = ctx.files.file[0].path
        if (ctx.files.file[1].filename.match(/\.(png|jpg|gif)$/)) {
          post_position = ctx.files.file[1].path
        } else {
          lyric_position = ctx.files.file[1].path
        }
      }
      if (ctx.files.file.length === 3) {
        music_position = ctx.files.file[0].path
        lyric_position = ctx.files.file[1].path
        post_position = ctx.files.file[2].path
      }
      await ctrl.insertMusicInfo({
        ...ctx.request.body,
        name: ctx.request.body.name || data.name,
        author: ctx.request.body.author || data.author,
        music_position,
        post_position,
        lyric_position
      })
      ctx.response.body = 'success';
    })
    /*更新音乐资源*/
    .post('/webDav/updateMusic', upload.fields([{name: 'file', maxCount: 2}]), async (ctx, next) => {
      let item = await ctrl.getMusicItemInfo(ctx.request.body.id)
      await changeToQH(ctx, item[0])
      let lyric_position = item[0].lyric_position
      let post_position = item[0].post_position
      if (ctx.files.file.length === 1) {
        if (ctx.files.file[0].originalname.indexOf('.lrc') !== -1) {
          lyric_position = ctx.files.file[0].path
        } else {
          post_position = ctx.files.file[0].path
        }
      }
      if (ctx.files.file.length === 2) {
        lyric_position = ctx.files.file[0].path
        post_position = ctx.files.file[1].path
      }
      await ctrl.updateMusicInfo({
        ...ctx.request.body,
        post_position,
        lyric_position
      })
      ctx.response.body = 'success';
    })
    /* 获取播放列表 */
    .get('/music/getList', async (ctx, next) => {
      let userid = ctx.query.userid
      let music_list = await ctrl.getMusicList(userid)
      ctx.response.body = music_list;
    })
    /* 通过路径信息获取播放资源 */
    .post('/music/getSource', async (ctx, next) => {
      let path = ctx.request.body.path
      let client = webDavFactory()
      // let dataSource = await fs.readFileSync(path);
      // let data = await Buffer.from(dataSource).toString('base64')
      // let base64 = 'data:' + mineType.lookup(path) + ';base64,' + data
      // ctx.response.body = base64;
      const downloadLink = await client.getFileDownloadLink(path);
      ctx.response.body = downloadLink;
    })
    /* 通过路径信息获取播放资源 */
    .post('/music/getLyricSource', async (ctx, next) => {
      let path = ctx.request.body.path
      let client = webDavFactory()
      const downloadLink = await client.getFileContents(path, {format: 'text'});
      ctx.response.body = downloadLink;
    })
    /* 刪除歌曲 */
    .post('/webDav/deleteMusic', async (ctx, next) =>{
      let musicid = ctx.request.body.id
      let client = webDavFactory()
      /* 刪除文件服务器中歌曲文件 */
      if (ctx.request.body.music_position) {
        let fileExists = await client.exists(ctx.request.body.music_position)
        if (fileExists) {
          await client.deleteFile(ctx.request.body.music_position);
        }
      }
      if (ctx.request.body.post_position) {
        let fileExists = await client.exists(ctx.request.body.post_position)
        if (fileExists) {
          await client.deleteFile(ctx.request.body.post_position);
        }
      }
      if (ctx.request.body.lyric_position) {
        let fileExists = await client.exists(ctx.request.body.lyric_position)
        if (fileExists) {
          await client.deleteFile(ctx.request.body.lyric_position);
        }
      }
      /* 删除数据库记录 */
      let res = await ctrl.deleteMusicItem(musicid)
      ctx.response.body = res
    })
}
async function writeToQH(ctx) {
  let info = {
    name: '',
    author: ''
  }
  let client = webDavFactory()
  let prefixname = ctx.files.file[0].originalname.split(".")[0]
  let pathHeader = '/music/webDAV/'
  let dir = pathHeader
  for (let i = 0;i < ctx.files.file.length;i++) {
    let suffixname = ctx.files.file[i].originalname.split(".")[1]
    let filename = prefixname + '.' + suffixname
    let filepath = dir + filename
    await client.putFileContents(filepath, ctx.files.file[i].buffer)
    if (i === 0) {
      let res = await getInfo(ctx.files.file[i].buffer)
      info.name = res.name || prefixname
      info.author = res.author
    }
    ctx.files.file[i].filename = filename
    ctx.files.file[i].path = filepath
  }
  return info
}
function getInfo(source) {
  return new Promise((resolve) => {
    NodeID3.read(source, function(err, tags) {
      resolve({
        name: tags.title,
        author: tags.artist
      })
    })
  })
}
async function changeToQH(ctx, params) {
  let prefixname = params.music_position.replace(/(.*\/)*([^.]+).*/ig,"$2")
  let dir = '/music/webDAV/'
  let client = webDavFactory()
  if (ctx.files.file.length === 2) { // 歌词海报都上传
    if (params.lyric_position) {
      client.deleteFile(params.lyric_position)
    }
    if (params.post_position) {
      client.deleteFile(params.post_position)
    }
    for (let i = 0;i < ctx.files.file.length;i++) {
      let suffixname = ctx.files.file[i].originalname.split(".")[1]
      let filename = prefixname + '.' + suffixname
      let filepath = dir + filename
      await client.putFileContents(filepath, ctx.files.file[i].buffer)
      ctx.files.file[i].filename = filename
      ctx.files.file[i].path = filepath
    }
  }
  if (ctx.files.file.length === 1) {
    if (ctx.files.file[0].mimetype === 'text/html') {
      return
    }
    if (ctx.files.file[0].originalname.indexOf('.lrc') !== -1) {
      if (params.lyric_position) {
        client.deleteFile(params.lyric_position)
      }
    } else {
      if (params.post_position) {
        client.deleteFile(params.post_position)
      }
    }
    let suffixname = ctx.files.file[0].originalname.split(".")[1]
    let filename = prefixname + '.' + suffixname
    let filepath = dir + filename
    await client.putFileContents(filepath, ctx.files.file[0].buffer)
    ctx.files.file[0].filename = filename
    ctx.files.file[0].path = filepath
  }
}
function  webDavFactory() {
  if (!clients) {
    return createClient(
      "http://vip3.8x6x.com:8404",
      {
        username: "liuke123",
        password: "144317waesr",
        maxBodyLength: '1073741824'
      }
    )
  } else {
    return clients
  }
}
