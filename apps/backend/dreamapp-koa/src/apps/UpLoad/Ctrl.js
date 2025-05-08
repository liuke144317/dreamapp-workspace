/**
 * Created by liuke on 2020/3/31 10:19.
 *
 * use to 控制器（逻辑处理）
 */
const model = require('./Model.js')

class Controller {
  constructor() {

  }

  async queryList() {
    let data = await model.queryList()
    return data
  }

  async getUserInfoByUserID(userID) {
    let data = await model.getUserInfoByUserID(userID)
    return data
  }
}

module.exports = new Controller()
