/**
 * Created by liuke on 2020/3/31 11:08
 *
 * use to 控制器
 */
const model = require('./Model.js')

class Controller {
  constructor() {

  }

  async loginVerifyCtrl(params) {
    let data = await model.loginVerifyModel(params)
    return data
  }

  async updateUseInfo(params) {
    let data = await model.updateUseInfo(params)
    return data
  }
}

module.exports = new Controller()
