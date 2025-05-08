/**
 * Created by liuke on 2020/3/31 11:08
 *
 * use to 控制器
 */
// const model = require('./Model.js')
const lunar = require('chinese-lunar');

class Controller {
  constructor() {

  }

  async lunarToSolar(params) {

    // 阴历日期
    const y = 2023; // 阳历年
    const m = 3; // 阳历月
    const d = 18; // 阳历日
    const isLeap = false; // 是否是闰月
    let data = lunar.lunarToSolar(y, m, d)
    console.log('data', data)
    params = {
      values: [
        {
          file: {
            name: '刘宇虹1'
          },
          birthday: '2014-10-12T00:00:00.000+08:00',
          type: '农历',
          food: '鸡杂、青豆',
          group: null,
          phone: null,
          Hobbies: '拍照、演唱会、旅游',
          aliases: [Array],
          hobbies: '拍照、演唱会、旅游'
        },
        {
          file: {
            name: '刘宇虹2'
          },
          birthday: '1997-09-23T00:00:00.000+08:00',
          type: '农历',
          food: '鸡杂、青豆',
          group: null,
          phone: null,
          Hobbies: '拍照、演唱会、旅游',
          aliases: [Array],
          hobbies: '拍照、演唱会、旅游'
        },
      ]
    }
    let today = new Date()
    let userdata = params.values
    let sortData = userdata.map(item => ({
      name: item.file.name, // 姓名
      birthday: getBirthday(item.birthday, item.type, today), // 生日(阳历)
      countDown: getCountDown(item.birthday, item.type, today), // 倒计时
      age: getAge(item.birthday, item.type, today), // 年龄
    }))
    sortData.sort((a, b) => a.countDown - b.countDown)
    console.log('sortData', sortData)
    return sortData
  }
}
function getBirthday (birthday, type, today) {
  let date = new Date(birthday)
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()
  if (type !== '农历') {
    return `${month + '月' + day + '日'}`
  } else {
    let date2 = lunar.lunarToSolar(today.getFullYear(), month, day) // 今年的阳历生日
    let date3 = new Date(date2)
    if (today > date3) {
      date2 = lunar.lunarToSolar(today.getFullYear() + 1, month, day) // 明年的阳历生日
      date3 = new Date(date2)
    }
    let month2 = date3.getMonth() + 1
    return `${month2 + '月' + date3.getDate() + '日'}`
  }
}
function getCountDown (birthday, type, today) {
  let birthDate = new Date(birthday)
  if (type === '农历') {
    birthDate =  lunar.lunarToSolar(today.getFullYear(), birthDate.getMonth() + 1, birthDate.getDate())
  }
  // 下次过生日时间
  let nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
  // 如果今年的生日已经过去，则计算明年的生日
  if (today > nextBirthday) {
    nextBirthday.setFullYear(today.getFullYear() + 1);
  }
  // 计算倒计时的时间差，单位为毫秒
  const timeDiff = nextBirthday - today;
  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  // const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  // const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
  // const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
  return days
}
function getAge(birthday, type, today) {
  let birthDate = new Date(birthday)
  if (type === '农历') {
    birthDate =  lunar.lunarToSolar(birthDate.getFullYear(), birthDate.getMonth() + 1, birthDate.getDate())
  }
  // 计算年龄
  let age = today.getFullYear() - birthDate.getFullYear();
  // 如果今天的日期还没到今年的生日，则年龄减 1
  const currentMonth = today.getMonth();
  const currentDay = today.getDate();
  const birthMonth = birthDate.getMonth();
  const birthDay = birthDate.getDate();

  if (currentMonth < birthMonth || (currentMonth === birthMonth && currentDay < birthDay)) {
    age--;
  }
  return age;
}
module.exports = new Controller()
