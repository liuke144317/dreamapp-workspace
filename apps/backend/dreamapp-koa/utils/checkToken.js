const jwt = require('jsonwebtoken');
const urls = require('url');
async function check(ctx, next) {
  // split('?')[0]把字符串分割成字符串数组——拿到url值
  let url = ctx.originalUrl;
  // 如果是登陆页面和注册页面就不需要验证token了
  console.log('ctx.req.url', ctx.req.url);
  let hasToken = urls.parse(ctx.req.url, true)?.query?.token;
  console.log('hasToken', hasToken);
  if (url === '/DreamApp/BLogs/Login' || url === '/DreamApp/BLogs/Register') {
    await next();
  } else if (hasToken && hasToken === '952306361') {
    // 免密登录
    await next();
  } else {
    try {
      //获取到token
      let token = ctx.req.headers['authorization'].split('Bearer ')[1];
      //  如果有token的话解析
      const tokenItem = jwt.verify(token, 'screct');
      //    把创建时间和过期时间析构出来
      const { time, timeout } = tokenItem;
      // 拿到当前时间
      let NewTime = new Date().getTime();
      if (NewTime - time <= timeout) {
        // 说明没过期
        ctx.req.decoded = tokenItem;
        await next();
      } else {
        ctx.body = {
          status: 405,
          message: 'token 已过期，请重新登陆',
        };
      }
    } catch (e) {
      console.log('e', e);
      ctx.body = {
        status: 405,
        message: '请带上token',
      };
    }
  }
}
module.exports = check;
