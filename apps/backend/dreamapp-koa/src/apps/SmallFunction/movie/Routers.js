/**
 * Created by liuke on 2020/3/31 11:07.
 *
 * use to 爬虫
 */
const request = require('superagent')
const urlencode = require('urlencode')
require('superagent-charset')(request)
const puppeteer = require('puppeteer')
let browers
module.exports = (router) => {
  router
  /* 搜索 */
    .get('/movie/find/msg', async (ctx, next) => {
      browers = await puppeteerFactory(browers)
      let suffix = ctx.url.slice(ctx.url.indexOf('/find/msg?data=') + ('/find/msg?data=').length, ctx.url.length)
      try {
        let res1 = []
        let res2 = []
        let promise1 = search({
          browers,
          params: urlencode.decode(suffix),
          website: 'http://zhdy8.com',
          nodeSearchText: "#formsearch input[name='searchword']",
          nodeSearchbtn: "#formsearch input[class='ico imgbt1 png']",
          fun: async function (page, website) {
            let res = await page.$eval('#result', (el, website) => {
              let arr = []
              el.querySelectorAll('a').forEach(item => {
                arr.push({
                  title: item.getAttribute('title'),
                  url: item.getAttribute('href').indexOf('/') === 0 ? (website + item.getAttribute('href')) : item.getAttribute('href'),
                  thumb: item.querySelector('img').getAttribute('src'),
                  source: '速速看看',
                  lianzaijs: item.querySelector("p[class='bz']").innerText,
                  listType: 'independent'
                })
              })
              return arr
            }, website)
            return res
          }
        }).then((res) => {
          res1 = res
        })
        let promise2 = search({
          browers,
          params: urlencode.decode(suffix),
          website: 'http://www.digu66.com',
          nodeShowbtn: '#search_btn',
          nodeSearchText: "#search_pop input[name='wd']",
          nodeSearchbtn: "#search_pop input[class='cancel']",
          fun: async function (page, website) {
            let res = await page.$eval('.v_list', (el, website) => {
              let arr = []
              el.querySelectorAll('li .v_img a').forEach(item => {
                arr.push({
                  title: item.getAttribute('title'),
                  url: item.getAttribute('href').indexOf('/') === 0 ? (website + item.getAttribute('href')) : item.getAttribute('href'),
                  thumb: item.querySelector('img').getAttribute('src'),
                  source: '小嘀咕',
                  listType: 'combination'
                })
              })
              return arr
            }, website)
            return res
          }
        }).then(res => {
          res2 = res
        })
        await Promise.all([promise1, promise2])
        ctx.response.body = [...res1, ...res2];
      } catch (e) {
        console.log('获取列表失败', e)
      }
    })
    .post('/movie/find/msgDtl', async (ctx, next) => {
      browers = await puppeteerFactory(browers)
      const page = await browers.newPage()
      await page.setDefaultNavigationTimeout(20000)
      await Promise.all([
        page.setJavaScriptEnabled(true)
      ]);
      try {
        // let suffix = ctx.url.slice(ctx.url.indexOf('/find/msgDtl?data=') + ('/find/msgDtl?data=').length, ctx.url.length)
        let suffix = ctx.request.body.params
        let listType = ctx.request.body.listType
        await page.goto(suffix)
        let res
        if (listType === 'independent') {
          res = await getDataFromHtml1(page)
        } else {
          res = await getDataFromHtml2(page)
        }
        ctx.response.body = res
      } catch (e) {
        console.log('获取列表详情失败！', e)
      } finally {
        page.close()
      }
    })
    .get('/movie/find/play', async (ctx, next) => {
      browers = await puppeteerFactory(browers)
      const page = await browers.newPage()
      await page.setDefaultNavigationTimeout(20000)
      await Promise.all([
        page.setJavaScriptEnabled(true)
      ]);
      let suffix = ctx.url.slice(ctx.url.indexOf('/find/play?data=') + ('/find/play?data=').length, ctx.url.length)
      await page.setRequestInterception(true);
      let resource = ''
      try {
        let promise1 = new Promise((resolve, reject) => {
          page.on('request', req => {
            if (req.resourceType() === 'media') {
              resource = req.url()
              resolve()
              req.continue();
            } else {
              req.continue();
            }
          })
        })
        let promise2 = new Promise((resolve, reject) => {
          page.on('response', async response => {
            if (/(.m3u8)$/.test(resource)) {
              resolve()
            } else if (response.url() === resource) {
              try {
                let data = await response.text()
                resource = 'data:application/x-mpegurl;base64,' + Buffer.from(data).toString('base64')
              } catch (e) {
                console.log('响应数据非m3u8文本')
              } finally {
                resolve()
              }
            }
          })
        })
        await page.goto(suffix)
        // FIXME 过滤条件要再准确点，要的是下面有video的iframe
        const frame = page.frames().find(frame => frame.childFrames().length === 0 && frame.url() !== 'about:blank')
        await frame.waitForSelector("video")
        const video = await frame.$eval("video", element => element.getAttribute('src'))
        // await Promise.all([promise1,promise2])
        ctx.response.body = video
      } catch (e) {
        console.log('播放失败', e)
      } finally {
        page.close()
      }
    })
    .post('/movie/find/changePlayRoad', async (ctx, next) => {
      let res = await changePlayRoad1(ctx.request.body)
      ctx.response.body = res
    })
}

/* 电影搜索 */
async function search(obj) {
  const page = await obj.browers.newPage()
  await page.setDefaultNavigationTimeout(20000)
  await Promise.all([
    page.setJavaScriptEnabled(true)
  ]);
  await page.goto(obj.website)
  if (obj.nodeShowbtn) {
    await page.click(obj.nodeShowbtn)
  }
  await page.type(obj.nodeSearchText, obj.params, {delay: 20})
  await page.click(obj.nodeSearchbtn)
  await sleep(1500)
  let res = await obj.fun(page, obj.website)
  return res

}

/* 手动休眠 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/*速速看看详情页面解析*/
async function getDataFromHtml1(page) {
  let playroad = []
  let collection = await page.$eval("div[id='stab11']", el => {
    let arr = []
    el.querySelectorAll('li').forEach(item => {
      let text = item.innerText
      let url = 'http://zhdy8.com' + item.querySelector('a').getAttribute('href')
      arr.push({
        text,
        url
      })
    })
    return arr
  })
  if (collection.length !== 0) {
    const pageSec = await browers.newPage()
    await pageSec.setDefaultNavigationTimeout(20000)
    await Promise.all([
      pageSec.setJavaScriptEnabled(true)
    ]);
    await pageSec.goto(collection[0].url)
    try {
      const frame = pageSec.frames().find(frame => {
        let parentFrame = frame.parentFrame()
        if (parentFrame && parentFrame.url() === collection[0].url) {
          return true
        }
      })
      await frame.waitForSelector("#playroad")
      playroad = await frame.$eval("div[id='playroad']", el => {
        let arr = []
        el.querySelectorAll('a').forEach((item, index) => {
          if (item.getAttribute('style').indexOf('none') === -1) {
            arr.push({
              index,
              text: item.innerText
            })
          }
        })
        return arr
      })
    } catch (e) {
      console.log('集数路线获取失败', e)
    } finally {
      pageSec.close()
    }
  }
  return {
    collection,
    playroad,
    type: 'independent'
  }
}

async function getDataFromHtml2(page) {
  let res = await page.$eval("section[class='grid_box']", el => {
    let playroad = []
    let collection = []
    el.querySelectorAll('.play_from ul li').forEach((item, index) => {
      playroad.push({
        index,
        text: item.innerText
      })
    })
    el.querySelectorAll('.large_list li').forEach(item => {
      let arr = []
      item.querySelectorAll('a').forEach(citem => {
        arr.push({
          text: citem.innerText,
          url: 'http://www.digu66.com' + citem.getAttribute('href')
        })
      })
      collection.push(arr)
    })
    return {
      playroad,
      collection
    }
  })
  return {
    type: 'combination',
    playroad: res.playroad,
    collection: res.collection
  }
}

/*改变路线时，获取播放资源*/
async function changePlayRoad1(params) {
  browers = await puppeteerFactory(browers)
  const page = await browers.newPage()
  await page.setDefaultNavigationTimeout(20000)
  await Promise.all([
    page.setJavaScriptEnabled(true)
  ]);
  await page.goto(params.url)
  try {
    const frame = page.frames().find(frame => {
      let parentFrame = frame.parentFrame()
      if (parentFrame && parentFrame.url() === params.url) {
        return true
      }
    })
    await frame.waitForSelector("#playroad")
    let index = params.index + 2
    await frame.click("#playroad > a:nth-child(" + index + ")")
    await sleep(500)
    const frameSec = page.frames().find(frame => frame.childFrames().length === 0)
    await frameSec.waitForSelector("video")
    const video = await frameSec.$eval("video", element => element.getAttribute('src'))
    return video
  } catch (e) {
    console.log('路线获取失败', e)
  } finally {
    page.close()
  }
}

async function puppeteerFactory(browers) {
  if (!browers) {
    browers = await puppeteer.launch({
      headless: true,
      args: [
        '--disable-web-security',
        '--disable-features=IsolateOrigins,site-per-process' // 很关键...
      ]
    })
  }
  return browers
}
