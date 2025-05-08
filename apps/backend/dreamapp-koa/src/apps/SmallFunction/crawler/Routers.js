/**
 * Created by liuke on 2020/3/31 11:07.
 *
 * use to 爬虫
 */
const cheerio = require('cheerio')
const request = require('superagent')
require('superagent-charset')(request)
const puppeteer = require('puppeteer')
const ctrl = require('./Ctrl.js')
const pool = require('../../../../utils/puppeteer-pool')
let browers = null
module.exports = (router) => {
  router
    .get('/DreamApp/weibo/getListTest', async (ctx, next) => {
      let promise = new Promise((resolve, reject) => {
        request.get('https://s.weibo.com/top/summary?cate=realtimehot')
            .buffer(true)
            .charset('utf-8') //当前页面编码格式
            .end((err, sres) => { //页面获取到的数据
              let html = sres.text,
                  $ = cheerio.load(html, {
                    decodeEntities: false
                  }), //用cheerio解析页面数据
                  obj = {};
              let arr = [];
              String.prototype.Trim = function () {
                return this.replace(/\s+/g, "");
              }
              //下面类似于jquery的操作，前端的小伙伴们肯定很熟悉啦
              $("#pl_top_realtimehot tbody tr").each((index, element) => {
                let classname = $(element).children().eq(0).attr("class")
                let stylename = $(element).children().eq(0).attr("style")
                if (classname.indexOf('ranktop') !== -1 && !stylename) {
                  let $text = $(element).children().eq(1).find('a').text()
                  let $href = $(element).children().eq(1).find('a').attr('href')
                  let $hot = $(element).children().eq(2).find('i').text()
                  $text = $text.trim()
                  arr.push({
                    text: $text,
                    href: $href,
                    hot: $hot
                  });
                }
              });
              resolve(arr)
            });
      })
      let arr = await promise
      ctx.response.body = arr;
    })
    .get('/DreamApp/weibo/getList', async (ctx, next) => {
      let a = ''
      const page1 = await pool.use(async instance=>{
        const page = await instance.newPage()
        await page.goto('https://s.weibo.com/top/summary?cate=realtimehot', { waitUntil: 'load', timeout: 0 })
        await page.waitForNavigation();
        const pushContentImg = await page.$eval("#pl_top_realtimehot tbody", el => {
          let arr = []
          el.querySelectorAll('tr').forEach(item => {
            // let id_str = item.getAttribute('action-data')
            // let pic_id = id_str.slice(id_str.indexOf('pic_id=') + ('pic_id=').length, id_str.length)
            // pic_id = 'https://ww3.sinaimg.cn/bmiddle/' + pic_id + '.jpg'
            // arr.push({
            //   pic_id,
            //   src: item.getAttribute('src')
            // })
            // let classname = item.children().eq(0).attr("class")
            let classname = item.childNodes[3].querySelector('a').innerText
            // item.children[0].querySelector('td i')
            // let stylename = $(element).children().eq(0).attr("style")
            // if (classname.indexOf('ranktop') !== -1 && !stylename) {
            //   let $text = $(element).children().eq(1).find('a').text()
            //   let $href = $(element).children().eq(1).find('a').attr('href')
            //   let $hot = $(element).children().eq(2).find('i').text()
            //   $text = $text.trim()
            //   arr.push({
            //     text: $text,
            //     href: $href,
            //     hot: $hot
            //   });
            // }
            arr.push(classname)
          })
          return arr
          // el.querySelectorAll('tr').forEach(item => {
          //   console.log('item', item)
          // })
        })
        return page
      })


      // if (!browers) {
      //   browers = await puppeteer.launch({headless: true})
      // }
      // const page = await browers.newPage()
      // await Promise.all([
      //   // 允许运行js
      //   page.setJavaScriptEnabled(true)
      // ]);
      // String.prototype.Trim = function () {
      //   return this.replace(/\s+/g, "");
      // }
      // await page.goto('https://s.weibo.com/top/summary?cate=realtimehot')
      // await page.waitForNavigation();
      // try {
      //   const pushContentImg = await page.$eval("#pl_top_realtimehot tbody", el => {
      //     let arr = []
      //     el.querySelectorAll(' .content .media-piclist li img').forEach(item => {
      //       let id_str = item.getAttribute('action-data')
      //       let pic_id = id_str.slice(id_str.indexOf('pic_id=') + ('pic_id=').length, id_str.length)
      //       pic_id = 'https://ww3.sinaimg.cn/bmiddle/' + pic_id + '.jpg'
      //       arr.push({
      //         pic_id,
      //         src: item.getAttribute('src')
      //       })
      //     })
      //     return arr
      //     ctx.response.body = [];
      //   })
      // } catch (e) {
      //   console.log('请求失败')
      // } finally {
      //   page.close()
      // }
      ctx.response.body = [];
    })
    .get('/DreamApp/weibo/getDetail', async (ctx, next) => {
      if (!browers) {
        browers = await puppeteer.launch({headless: true})
      }
      const page = await browers.newPage()
      await Promise.all([
        // page.setUserAgent(UA),
        // 允许运行js
        page.setJavaScriptEnabled(true)
        // 设置页面视口的大小
        // page.setViewport({width: 1100, height: 1080}),
      ]);
      String.prototype.Trim = function () {
        return this.replace(/\s+/g, "");
      }
      let suffix = ctx.url.slice(ctx.url.indexOf('/find/msgDtl?data=') + ('/find/msgDtl?data=').length, ctx.url.length)
      await page.goto('https://s.weibo.com' + suffix)
      try {
        const msgType = await page.$eval("div[action-type='feed_list_item'] .title", el => el.innerText) // 消息类型
        const pusherHeadImg = await page.$eval("div[action-type='feed_list_item'] .avator a img", el => el.getAttribute('src'))
        const pusherName = await page.$eval("div[action-type='feed_list_item'] .content .info", el => {
          return el.lastElementChild.innerText.trim()
        })
        let pushContentText = await page.$eval("div[action-type='feed_list_item'] .content", el => {
          let text;
          if (el.querySelector("p[node-type='feed_list_content_full']")) {
            text = el.querySelector("p[node-type='feed_list_content_full']").innerText
          } else {
            text = el.querySelector("p[node-type='feed_list_content']").innerText
          }
          text = text.replace(/(收起全文d)[\s\S]*$/g, '')
          return text
        })
        const pushContentImg = await page.$eval("div[action-type='feed_list_item']", el => {
          let arr = []
          el.querySelectorAll(' .content .media-piclist li img').forEach(item => {
            let id_str = item.getAttribute('action-data')
            let pic_id = id_str.slice(id_str.indexOf('pic_id=') + ('pic_id=').length, id_str.length)
            pic_id = 'https://ww3.sinaimg.cn/bmiddle/' + pic_id + '.jpg'
            arr.push({
              pic_id,
              src: item.getAttribute('src')
            })
          })
          return arr
        })
        const pushContentVideo = await page.$eval("div[action-type='feed_list_item']", el => {
          let arr = []
          el.querySelectorAll(' .content video').forEach(item => {
            arr.push(item.getAttribute('src'))
          })
          return arr
        })
        ctx.response.body = {
          msgType,
          pusherHeadImg,
          pusherName,
          pushContentText,
          pushContentImg,
          pushContentVideo
        }
      } catch (e) {
        console.log('请求失败')
      } finally {
        page.close()
      }
    })
}
