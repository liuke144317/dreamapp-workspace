/**
 * Created by liuke on 2020/3/31 11:08
 *
 * use to 控制器
 */
const model = require('./Model.js')

class Controller {
  constructor() {

  }

  async insertMusicInfo(params) {
    let data = await model.insertMusicInfo(params)
    return data
  }
  async updateMusicInfo(params) {
    let data = await model.updateMusicInfo(params)
    return data
  }
  async getMusicList(userid) {
    let data = await model.getMusicList(userid)
    return data
  }
  async getMusicItemInfo(id) {
    let data = await model.getMusicItemInfo(id)
    return data
  }
  async deleteMusicItem(id) {
    let data = await model.deleteMusicItem(id)
    return data
  }
}

module.exports = new Controller()
