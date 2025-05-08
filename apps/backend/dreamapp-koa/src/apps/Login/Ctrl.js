/**
 * Created by liuke on 2020/3/31 11:08
 *
 * use to 控制器
 */
const model = require('./Model.js')
const { saveImageToMinIO, deleteImageInMinIO } = require('../../../minio/index')
class Controller {
  constructor() {

  }

  async queryUserByUserName(params) {
    let data = await model.queryUserByUserName(params)
    return data
  }

  async queryInvitation(params) {
    let data = await model.queryInvitation(params)
    return data
  }

  async loginVerifyCtrl(params) {
    let data = await model.loginVerifyModel(params)
    return data
  }

  async insertUseInfo(params) {
    let data = await model.insertUseInfo(params)
    return data
  }

  async updateUseInfo(ctx) {
    if (ctx.req.body && ctx.req.body.userid) {
      // 查询用户是否已经有头像，有的话要从minio中删除
      let userInfo = await model.getUserInfoByUserID(ctx.req.body.userid)
      if (ctx.req.file && ctx.req.file.length !==0 && userInfo && userInfo.length !== 0 && userInfo[0].userImg) {
        await deleteImageInMinIO(userInfo[0].userImg)
      }
      let filePath = ''
      if (ctx.req.file) {
        filePath = await saveImageToMinIO(ctx.req.file)
      }
      let postParam = {
        ...ctx.req.body,
        userImg: filePath
      }
      let data = await model.updateUseInfo(postParam)
      return data
    } else {
      let data = await model.updateUseInfo({'set_info':ctx.request.body.setInfo, userid: ctx.request.body.userid})
      return data
    }
  }

  async getUserInfoByUserID(params) {
    let data = await model.getUserInfoByUserID(params)
    return data
  }

  async getReadPasswordByUserID(params) {
    let data = await model.getReadPasswordByUserID(params)
    return data
  }

  async setReadPasswordByUserID(password, userid) {
    let data = await model.setReadPasswordByUserID(password, userid)
    return data
  }

  async getIsLockedLabels(userid) {
    let data = await model.getIsLockedLabels(userid)
    return data
  }

  async getUnLockLabels(params, userid) {
    let data = await model.getUnLockLabels(params, userid)
    return data
  }

  async setLockHomeList(labelid, userid, status) {
    let data = await model.setLockHomeList(labelid, userid, status)
    return data
  }
}

module.exports = new Controller()
