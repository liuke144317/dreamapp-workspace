/**
 * Created by liuke on 2020/3/31 11:07.
 *
 * use to 路由器-登陆页路由
 */
const ctrl = require('./Ctrl.js');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const multer = require('koa-multer');
let upload = multer();
module.exports = (router) => {
  router
    .post('/DreamApp/BLogs/Login', async (ctx, next) => {
      let data = await ctrl.loginVerifyCtrl(ctx.request.body);
      if (data && data.length !== 0) {
        // 返回token
        let payload = {
          password: ctx.request.body.password,
          time: new Date().getTime(),
          timeout: 1000 * 60 * 60 * 24 * 30,
          ...data[0],
        };
        let token = jwt.sign(payload, 'screct');
        ctx.status = 200;
        ctx.body = {
          status: 200,
          message: '登录成功',
          data: {
            token,
            user: data[0],
          },
        };
      } else {
        ctx.status = 400;
        ctx.body = {
          status: 500,
          message: '用户名或密码错误',
        };
      }
    })
    .post('/DreamApp/BLogs/Register', async (ctx, next) => {
      // 查找数据库中username是否存在
      let { username, password, invitation, phone } = ctx.request.body;
      let invitationList = await ctrl.queryInvitation(invitation);
      let userList = await ctrl.queryUserByUserName(username);
      if (!invitationList || invitationList.length == 0) {
        ctx.status = 400;
        ctx.body = {
          status: 500,
          message: '邀请码错误，请重新输入',
        };
      } else if (userList && userList.length !== 0) {
        // 不存在且用户名密码不为空进行后续操作
        ctx.status = 400;
        ctx.body = {
          status: 500,
          message: '该用户名已存在，请重新输入',
        };
      } else {
        // 将用户信息插入数据库
        let userid = uuidv4();
        await ctrl.insertUseInfo({
          userid,
          username,
          password,
          invitation,
          phone,
        });
        ctx.status = 200;
        ctx.body = {
          status: 200,
          message: '注册成功',
        };
      }
    })
    .post(
      '/DreamApp/UserInfo/Update',
      upload.single('file'),
      async (ctx, next) => {
        let data = await ctrl.updateUseInfo(ctx);
        ctx.response.status = 200;
        ctx.response.body = ctx.body = {
          status: 200,
          message: '用户信息修改成功',
          data,
        };
      },
    )
    .post('/DreamApp/UserInfo/Get', async (ctx, next) => {
      let data = await ctrl.getUserInfoByUserID(ctx.request.body.userid);
      ctx.response.status = 200;
      ctx.response.body = ctx.body = {
        status: 200,
        message: '操作成功',
        data,
      };
    })
    .post('/DreamApp/UserInfo/GetReadPassword', async (ctx, next) => {
      let userid = ctx.req.decoded.userid;
      let data = await ctrl.getReadPasswordByUserID(userid);
      ctx.response.status = 200;
      ctx.response.body = ctx.body = {
        status: 200,
        message: '操作成功',
        data: data[0],
      };
    })
    .get('/DreamApp/UserInfo/SetReadPassword', async (ctx, next) => {
      let userid = ctx.req.decoded.userid;
      let password = ctx.query.password;
      let data = await ctrl.setReadPasswordByUserID(password, userid);
      ctx.response.status = 200;
      ctx.response.body = ctx.body = {
        status: 200,
        message: '操作成功',
        data,
      };
    })
    .get('/DreamApp/UserInfo/hasReadPassword', async (ctx, next) => {
      let userid = ctx.req.decoded.userid;
      let data = await ctrl.getReadPasswordByUserID(userid);
      let flag = false;
      if (data[0].read_password) {
        flag = true;
      }
      ctx.response.status = 200;
      ctx.response.body = ctx.body = {
        status: 200,
        message: '操作成功',
        data: flag,
      };
    })
    .get('/DreamApp/UserInfo/verifyReadPassword', async (ctx, next) => {
      let userid = ctx.req.decoded.userid;
      let password = ctx.query.password;
      let data = await ctrl.getReadPasswordByUserID(userid);
      let read_password = data[0].read_password;
      let flag = false;
      if (password === read_password) {
        flag = true;
      }
      ctx.response.status = 200;
      ctx.response.body = ctx.body = {
        status: 200,
        message: '操作成功',
        data: flag,
      };
    })
    .post('/DreamApp/UserInfo/getIsLockedLabels', async (ctx, next) => {
      let userid = ctx.req.decoded.userid;
      let data = await ctrl.getIsLockedLabels(userid);
      ctx.response.status = 200;
      ctx.response.body = ctx.body = {
        status: 200,
        message: '操作成功',
        data,
      };
    })
    .post('/DreamApp/UserInfo/getUnLockLabels', async (ctx, next) => {
      let userid = ctx.req.decoded.userid;
      let params = ctx.request.body.labelName;
      let data = await ctrl.getUnLockLabels(params, userid);
      ctx.response.status = 200;
      ctx.response.body = ctx.body = {
        status: 200,
        message: '操作成功',
        data,
      };
    })
    .post('/DreamApp/UserInfo/setLockHomeList', async (ctx, next) => {
      let userid = ctx.req.decoded.userid;
      let labelid = ctx.request.body.labelid;
      let status = ctx.request.body.status;
      let data = await ctrl.setLockHomeList(labelid, userid, status);
      ctx.response.status = 200;
      ctx.response.body = ctx.body = {
        status: 200,
        message: '操作成功',
        data,
      };
    });
};
