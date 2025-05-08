/**
 * Created by liuke on 2020/3/31 10:21.
 *
 * use to 路由器-首页路由
 */
const ctrl = require('./Ctrl.js');
const { minio } = require('../../../config');
const fs = require('fs');
const wordWrap = require('word-wrap');
const htmlparser = require('htmlparser2');
const multer = require('@koa/multer');
const encode = require('hashcode').hashCode;
const measureText = require('../../../utils/measureText');
function replaceSpace(match, p1, p2) {
  // p1匹配到的是标签内的内容，不做处理
  if (p1) {
    return p1;
  }
  // p2匹配到的是空格，将其替换为&nbsp;
  else if (p2) {
    return '&n-b-s-p;';
  }
}
function replaceNbspWithSpaces(htmlCode) {
  // 使用正则表达式匹配`&nbsp;`，全局匹配
  const pattern = /&n-b-s-p;/g;
  // 使用replace方法，将匹配到的`&nbsp;`替换为空格
  const result = htmlCode.replace(pattern, ' ');
  return result;
}
function replaceSpacesWithNbsp(inputString) {
  const regex = /\s/g;
  return inputString.replace(regex, '&n-b-s-p;');
}
function wrapHtmlWithMaxLinesAndLastLineLimit(
  html,
  width,
  maxLines,
  lastLineLimit,
  id,
  windowWidth,
) {
  const pattern = /(<.*?>)|(\s)/g;
  html = html.replace(pattern, replaceSpace);
  let text = '';
  let insideTag = false;
  let lineCount = 0;
  let currentLine = '';
  let wrapNumber = 0;
  let magnification = windowWidth / 750; // 在设备中真实宽度的比例
  let marginWidth = 40 * magnification;
  const parser = new htmlparser.Parser(
    {
      onopentag: (name, attribs) => {
        const attributes = Object.entries(attribs)
          .map(([key, value]) => `${key}="${value}"`)
          .join(' ');
        insideTag = true;
        currentLine += `<${name} ${attributes}>`;
      },
      ontext: (data) => {
        if (wrapNumber > 3) {
          return;
        }
        const words = data.split(/\s+/);
        for (let i = 0; i < words.length; i++) {
          let noNbspWord = replaceNbspWithSpaces(words[i]); // 所有的&n-b-s-p;替换成空格
          let wordsLen = noNbspWord.length;
          if (wordsLen > 110) {
            wrapNumber = 3; // 为3的时候添加...全文
            let wordSub = noNbspWord.substring(0, 110);
            wordSub = replaceSpacesWithNbsp(wordSub);
            words[i] = wordSub;
          }
          if (wrapNumber === 3) {
            currentLine +=
              words[i] +
              '<a data-expend="true" data-id="' +
              id +
              '" href="#" style="color: rgb(13, 142, 56)">...全文</a>';
            wrapNumber = 4; // 为4的时候不再做后续操作
          } else {
            currentLine += words[i];
          }
          if (wordsLen > 110) {
            wrapNumber = 4; // 为4的时候不再做后续操作
          }
        }
      },
      onclosetag: (name, a, v) => {
        if (name == 'p') {
          wrapNumber++;
        }
        insideTag = false;
        currentLine += `</${name}>`;
      },
      onend: () => {
        if (wrapNumber <= 4) {
          // 只有三行，移除全文展开标签
          const regex =
            /<a\b[^>]*\bdata-expend\s*=\s*["'][^"']*["'][^>]*>.*?<\/a>/gi;
          currentLine = currentLine.replace(regex, '');
        }
        // const regexFilter = /(<a[^>]+data-expend[^>]+>).*?<\/a>/g;
        currentLine = replaceNbspWithSpaces(currentLine);
      },
    },
    { decodeEntities: true },
  );
  parser.write(html);
  parser.end();
  // 将解析器自动处理br处理的标签还原
  currentLine = currentLine.replace(/<br\s*><\/br>|<br\s*\/>/gi, '<br>');
  if (currentLine.trim()) {
    text += currentLine.trim();
  }
  return text;
}
let uploadFields = [
  { name: 'file0', maxCount: 1 },
  { name: 'file1', maxCount: 1 },
  { name: 'file2', maxCount: 1 },
  { name: 'file3', maxCount: 1 },
  { name: 'file4', maxCount: 1 },
  { name: 'file5', maxCount: 1 },
  { name: 'file6', maxCount: 1 },
  { name: 'file7', maxCount: 1 },
  { name: 'file8', maxCount: 1 },
];
// 定义文本的宽度和限制的行数
const width = 3;
const maxLines = 3;
const lastLineLimit = 2;
module.exports = (router) => {
  let upload = multer();
  router
    .post('/DreamApp/BLogs/Home/showList', async (ctx, next) => {
      // 获取记录
      try {
        let postParam = ctx.request.body;
        let userid = ctx.req.decoded.userid;
        let data = await ctrl.queryList(minio, postParam, userid);
        data = data.map((item) => ({
          ...item,
          description: wrapHtmlWithMaxLinesAndLastLineLimit(
            item.description,
            width,
            maxLines,
            lastLineLimit,
            item.id,
            postParam.params.windowWidth,
          ),
        }));
        ctx.status = 200;
        ctx.body = {
          status: 200,
          message: '操作成功',
          data: data,
        };
      } catch (e) {
        console.log('获取失败:', e);
        ctx.body = {
          status: 500,
          message: e,
        };
      }
    })
    .get('/DreamApp/BLogs/Home/showItem', async (ctx, next) => {
      // 获取单个记录
      try {
        let itemId = ctx.query.id;
        let userid = ctx.req.decoded.userid;
        let data = await ctrl.queryItem(minio, itemId, userid);
        ctx.status = 200;
        ctx.body = {
          status: 200,
          message: '操作成功',
          data: data,
        };
      } catch (e) {
        console.log('获取失败:', e);
        ctx.body = {
          status: 500,
          message: e,
        };
      }
    })
    .get('/DreamApp/MinIO/ShowPath', async (ctx, next) => {
      // 获取minio.showPath
      try {
        ctx.status = 200;
        ctx.body = {
          status: 200,
          message: '操作成功',
          data: minio.showPath,
        };
      } catch (e) {
        console.log('获取失败:', e);
        ctx.body = {
          status: 500,
          message: e,
        };
      }
    })
    .post(
      '/DreamApp/BLogs/add',
      upload.fields(uploadFields),
      async (ctx, next) => {
        //插入记录
        try {
          let data = await ctrl.insertItem(ctx);
          ctx.status = 200;
          ctx.body = {
            status: 200,
            message: '操作成功',
            data: data,
          };
        } catch (e) {
          console.log('操作失败:', e);
          ctx.status = 400;
          ctx.body = {
            status: 500,
            message: e,
          };
        }
      },
    )
    .post(
      '/DreamApp/BLogs/add/noFile',
      upload.fields(uploadFields),
      async (ctx, next) => {
        //插入记录
        try {
          let userid = ctx.req.decoded.userid;
          let data = await ctrl.insertItem(ctx, userid);
          ctx.status = 200;
          ctx.body = {
            status: 200,
            message: '操作成功',
            data: data,
          };
        } catch (e) {
          console.log('操作失败:', e);
          ctx.status = 400;
          ctx.body = {
            status: 500,
            message: e,
          };
        }
      },
    )
    .post('/DreamApp/BLogs/Home/delete', async (ctx, next) => {
      //删除记录
      try {
        let data = await ctrl.deleteItem(ctx);
        ctx.status = 200;
        ctx.body = {
          status: 200,
          message: '操作成功',
          data: data,
        };
      } catch (e) {
        console.log('删除失败:', e);
        ctx.body = {
          status: 500,
          message: '删除失败',
          data: e,
        };
      }
    })
    .post(
      '/DreamApp/BLogs/Home/update',
      upload.fields(uploadFields),
      async (ctx, next) => {
        //修改记录
        try {
          let userid = ctx.req.decoded.userid;
          let data = await ctrl.updateItem(ctx, userid);
          ctx.status = 200;
          ctx.body = {
            status: 200,
            message: '操作成功',
            data: data,
          };
        } catch (e) {
          console.log('操作失败:', e);
          ctx.body = {
            status: 500,
            message: '操作失败',
            data: e,
          };
        }
      },
    )
    .post(
      '/DreamApp/BLogs/Home/update/noFile',
      upload.fields(uploadFields),
      async (ctx, next) => {
        //修改记录
        try {
          let userid = ctx.req.decoded.userid;
          let data = await ctrl.updateItem(ctx, userid);
          ctx.status = 200;
          ctx.body = {
            status: 200,
            message: '操作成功',
            data: data,
          };
        } catch (e) {
          console.log('操作失败:', e);
          ctx.body = {
            status: 500,
            message: '操作失败',
            data: e,
          };
        }
      },
    )
    .post('/DreamApp/BLogs/Tag/showList', async (ctx, next) => {
      //模糊查询tag,并返回在home_list中的关联数量
      try {
        let userid = ctx.req.decoded.userid;
        let data = await ctrl.queryTagList(ctx.request.body, userid);
        ctx.status = 200;
        ctx.body = {
          status: 200,
          message: '操作成功',
          data: data,
        };
      } catch (e) {
        console.log('查询失败:', e);
        ctx.body = {
          status: 500,
          message: '查询失败',
          data: e,
        };
      }
    })
    .post('/DreamApp/BLogs/normalUsedTag/showList', async (ctx, next) => {
      // 查询用户最常用的10个label并返回
      try {
        let userid = ctx.req.decoded.userid;
        let data = await ctrl.queryNormalUsedTagList(userid);
        ctx.status = 200;
        ctx.body = {
          status: 200,
          message: '操作成功',
          data: data,
        };
      } catch (e) {
        ctx.body = {
          status: 500,
          message: '删除失败',
          data: e,
        };
      }
    })
    .post('/DreamApp/BLogs/Home/changeToppingStatus', async (ctx, next) => {
      // 修改博客置顶状态
      try {
        let data = await ctrl.changeToppingStatus(ctx.request.body);
        ctx.status = 200;
        ctx.body = {
          status: 200,
          message: '操作成功',
          data: data,
        };
      } catch (e) {
        console.log('查询失败:', e);
        ctx.body = {
          status: 200,
          message: '查询失败',
          data: e,
        };
      }
    });
};
