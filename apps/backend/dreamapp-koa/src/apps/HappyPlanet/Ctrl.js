/**
 * Created by liuke on 2020/3/31 11:08
 *
 * use to 控制器
 */
const model = require('./Model.js')

class Controller {
  constructor() {

  }

  async getHappyPlanetDataByUserID(params) {
    let NoteList = await model.getHappyPlanetNoteListByUserID(params)
    let TodoList = await model.getHappyPlanetTodoListByUserID(params)
    return {
      NoteList,TodoList
    }
  }

  async updateHappyPlanetData(params) {
    // 清空临时表
    // 先将前端数据存入空表
    // 然后通过 Union 返回结果对比两个表的数据 https://blog.csdn.net/usualheart/article/details/107403759
    // 将不同的找出来后再判断是修改，是删除了还是新增了
    let res1 = await model.deleteHappyPlanetData(params)
    let res2 = await model.addHappyPlanetData(params)
    return {
      res1, res2
    }
    
  }
}

module.exports = new Controller()
