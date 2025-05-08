/**
 * Created by liuke on 2020/3/31 10:19.
 *
 * use to 控制器（逻辑处理）
 */
const model = require('./Model.js');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

const {
  saveImageToMinIO,
  deleteImageInMinIO,
} = require('../../../minio/index');
class Controller {
  constructor() {}

  async queryList(minIOServer, postParam, userid) {
    let labelName = postParam.params.labelName;
    let id = postParam.params.id;
    let showSelf = false;
    let showLock = false;
    let label = null;
    if (!id && labelName) {
      let str = labelName.replace(/^#*|#+$/g, '');
      let res = await model.queryLabelByName(str);
      if (res && res.length !== 0) {
        label = res[0].id;
      }
    }
    if (postParam.params.self === 'self') {
      showSelf = true;
    }
    if (postParam.params.read_password) {
      // 传了用户阅读密码的话，验证是否正确，是的话showLock为true，否则为false
      let data = await model.getReadPasswordByUserID(userid);
      let read_password = data[0].read_password;
      if (read_password && read_password === postParam.params.read_password) {
        // 验证通过
        showLock = true;
      }
    }
    let data = await model.queryList(
      postParam,
      label,
      id,
      userid,
      showLock,
      showSelf,
    );
    let idArr = data && data.length !== 0 ? data.map((item) => item.id) : [];
    let imageData = [],
      labelData = [];
    if (idArr && idArr.length !== 0) {
      imageData = await model.queryImageList(idArr);
      labelData = await model.queryLabelList(idArr);
    }
    let finalData = data.map((item) => {
      let obj = {
        ...item,
        // description,
        imageArr:
          imageData
            .filter((citem) => citem['home_list_id'] == item.id)
            .map((citem) => ({
              id: citem.id,
              url: minIOServer.showPath + citem.url,
            })) || [],
        labelArr: labelData
          .filter((citem) => citem['listid'] == item.id)
          .map((citem) => ({
            id: citem.labelid,
            name: citem.label,
          })),
      };
      return obj;
    });
    return finalData;
  }
  // 查询单条记录详情
  async queryItem(minIOServer, itemId, userid) {
    let data = await model.queryItem(itemId, userid);
    let idArr = data && data.length !== 0 ? data.map((item) => item.id) : [];
    let imageData = [],
      labelData = [];
    if (idArr && idArr.length !== 0) {
      imageData = await model.queryImageList(idArr);
      labelData = await model.queryLabelList(idArr);
    }
    let finalData = data.map((item) => {
      let obj = {
        ...item,
        // description,
        imageArr:
          imageData
            .filter((citem) => citem['home_list_id'] == item.id)
            .map((citem) => ({
              id: citem.id,
              url: minIOServer.showPath + citem.url,
            })) || [],
        labelArr: labelData
          .filter((citem) => citem['listid'] == item.id)
          .map((citem) => ({
            id: citem.labelid,
            name: citem.label,
          })),
      };
      return obj;
    });
    return finalData && finalData.length !== 0 ? finalData[0] : {};
  }
  /*新增首页记录*/
  async insertItem(ctx, userid) {
    let files = [];
    for (let key in ctx.files) {
      files.push(ctx.files[key][0]);
    }
    let fileNameStr = '';
    if (files.length !== 0) {
      fileNameStr = await saveImageToMinIO(files);
    }
    let postParam = {
      ...ctx.request.body,
      image: fileNameStr,
    };
    // 如果有label，查询其中是否有该用户已经加锁的label，有的话那么插入数据的时候islock=1,否则islock=0
    let hsaLockLabels = [];
    let islock = 0;
    if (postParam.labels) {
      postParam.labels = JSON.parse(postParam.labels);
    }
    if (
      postParam.labels &&
      postParam.labels.length !== 0 &&
      postParam.labels.filter((item) => item.id).length !== 0
    ) {
      let str = postParam.labels
        .filter((item) => item.label)
        .map((item) => item.label)
        .toString();
      hsaLockLabels = await model.hasLockLabel(userid, str);
    }
    if (hsaLockLabels.length !== 0) {
      islock = 1;
    }
    let data = await model.insertItem(postParam, islock);
    data.islock = islock ? true : false;
    data.hasLockLabel = hsaLockLabels;
    if (postParam.image.length !== 0) {
      //存在图片文件
      let imageParams = postParam.image.map((item) => {
        let uuid = uuidv4();
        return [uuid, data.insertId, item];
      });
      // let imageParams = postParam.image.map(item => ([data.insertId, item]))
      await model.insertImageInfo(imageParams);
    }
    // 如果有提交tagList，那么将tag与home_list做关联
    if (postParam.labels && postParam.labels.length !== 0) {
      for (let i = 0; i < postParam.labels.length; i++) {
        if (postParam.labels[i].id) {
          // 如果taglist中id存在的话直接关联
          await model.insertTagRelationItem({
            labelid: postParam.labels[i].id,
            listid: data.insertId,
          });
        } else {
          // 否则先新增tag，然后关联
          let insertTagItem = await model.insertTagItem({
            label: postParam.labels[i].label,
          });
          await model.insertTagRelationItem({
            labelid: insertTagItem.insertId,
            listid: data.insertId,
          });
        }
      }
    }
    return data;
  }
  /*删除首页记录*/
  async deleteItem(ctx) {
    // 查询该记录下面有没有照片，有的话依次删除minio中的文件和user_list_image下的照片，然后删除该条记录
    let imageData = await model.queryImageList([ctx.request.body.id]);
    if (imageData && imageData.length !== 0) {
      let imageUrlData = imageData.map((item) => item.url);
      await deleteImageInMinIO(imageUrlData);
      await model.deleteImageList(ctx.request.body.id);
    }
    // 删除label关系表中的关系
    let willDeleteLabelRelation = await model.queryRelationList(
      ctx.request.body.id,
    );
    let res = await model.deleteLabelRelation(ctx.request.body.id);
    // 查询没有被使用的label，然后从label表中删除
    let labelIds = willDeleteLabelRelation.map((item) => item.labelid);
    for (let i = 0; i < labelIds.length; i++) {
      // 查询labelid在relation表中是否存在，不存在则删除label表中的相应字段
      let relationList = await model.findRelationListByLabelId(labelIds[i]);
      if (relationList.length === 0) {
        // 不存在了那么就在label表中删除该label
        await model.deleteTagList(labelIds[i]);
      }
    }
    let data = await model.deleteItem(ctx.request.body.id);
    return data;
  }
  /*更新首页记录*/
  async updateItem(ctx, userid) {
    let files = [];
    for (let key in ctx.files) {
      files.push(ctx.files[key][0]);
    }
    let fileNameStr = '';
    if (files.length !== 0) {
      fileNameStr = await saveImageToMinIO(files);
    }
    let postParam = {
      ...ctx.request.body,
      image: fileNameStr,
    };
    // 如果有label，查询其中是否有该用户已经加锁的label，有的话那么插入数据的时候islock=1,否则islock=0
    let hsaLockLabels = [];
    let islock = 0;
    if (postParam.labels) {
      postParam.labels = JSON.parse(postParam.labels);
    }
    // 通过label名称判断有没有用户加锁标签
    if (postParam.labels && postParam.labels.length !== 0) {
      let str = postParam.labels
        .filter((item) => item.label)
        .map((item) => item.label);
      hsaLockLabels = await model.hasLockLabel(userid, str);
    }
    if (hsaLockLabels.length !== 0) {
      islock = 1;
    }
    let data = await model.updateItem(postParam, islock);
    data.listid = postParam.id;
    data.islock = !!islock ? true : false;
    data.hasLockLabel = hsaLockLabels;
    if (postParam.image.length !== 0) {
      //存在图片文件
      let imageParams = postParam.image.map((item) => {
        let uuid = uuidv4();
        return [uuid, postParam.id, item];
      });
      await model.insertImageInfo(imageParams);
    }
    // 需要删除的图片
    if (postParam.deleteImageIds) {
      let deleteImageIdsArray = postParam.deleteImageIds.split(',');
      // 查询数据图片的集合
      let imageArray = await model.queryImageByIDs(deleteImageIdsArray);
      let imageUrlArray = imageArray.map((item) => item.url);
      await deleteImageInMinIO(imageUrlArray); // 删除minio中的图片文件
      await model.deleteImageListByImageID(deleteImageIdsArray); // 删除数据库中的图片记录
    }
    // 如果有提交tagList，那么将tag与home_list做关联
    let newLabels = postParam.labels ? postParam.labels : [];
    let oldLabels = await model.findHomeListItemLabels(postParam.id);
    // 比较label的名称，找出新增和删除的标签
    let addLabels = newLabels.filter(
      (item) =>
        oldLabels.map((citem) => citem.label).indexOf(item.label) === -1,
    ); //新标签中在旧标签中找不到的是新增的标签
    let removeLabels = oldLabels.filter(
      (item) =>
        newLabels.map((citem) => citem.label).indexOf(item.label) === -1,
    ); //旧标签中在新标签中找不到的是删除的标签
    if (addLabels.length !== 0) {
      for (let i = 0; i < addLabels.length; i++) {
        if (addLabels[i].id) {
          // 如果taglist中id存在的话直接关联
          await model.insertTagRelationItem({
            labelid: addLabels[i].id,
            listid: postParam.id,
          });
        } else {
          // 否则先新增tag，然后关联
          let insertTagItem = await model.insertTagItem({
            label: addLabels[i].label,
          });
          await model.insertTagRelationItem({
            labelid: insertTagItem.insertId,
            listid: postParam.id,
          });
        }
      }
    }
    if (removeLabels.length !== 0) {
      for (let i = 0; i < removeLabels.length; i++) {
        // 删除关系
        await model.deleteTagRelationItem({
          labelid: removeLabels[i].id,
          listid: postParam.id,
        });
        // 查询labelid在relation表中是否存在，不存在则删除label表中的相应字段
        let relationList = await model.findRelationListByLabelId(
          removeLabels[i].id,
        );
        if (relationList.length === 0) {
          // 不存在了那么就在label表中删除该label
          await model.deleteTagList(removeLabels[i].id);
        }
      }
    }
    return data;
  }
  extractSubstringWithKeyword(str, keyword) {
    // 查找关键字在字符串中的位置
    const index = str.indexOf(keyword);

    if (index === -1) {
      // 如果字符串中没有关键字，返回空字符串
      return '';
    } else {
      // 截取包含关键字的10个字符长度的内容
      const keywordStartIndex = index;
      const keywordEndIndex = index + keyword.length;
      const substringStartIndex = Math.max(0, keywordStartIndex - 5);
      const substringEndIndex = Math.min(str.length, keywordEndIndex + 5);
      return str.substring(substringStartIndex, substringEndIndex);
    }
  }
  async queryTagList(postParam, userid) {
    const limitSearchNum = 50;
    let data = await model.queryTagRelationList(postParam, limitSearchNum);
    console.log('data', data);
    let dataSelf = await model.queryTagRelationListSelf(
      postParam,
      limitSearchNum,
      userid,
    );
    data.forEach((item) => {
      let sameIdItem = dataSelf.filter((citem) => citem.id === item.id);
      item.countSelf = sameIdItem.length !== 0 ? sameIdItem[0].count : 0;
      item.islock = sameIdItem.length !== 0 ? sameIdItem[0].islock : 0;
    });
    if (postParam.allType && postParam.labelName) {
      let limitContent = 0;
      if (data.length < limitSearchNum) {
        limitContent = limitSearchNum - data.length;
      }
      let notLabelData = await model.queryHomeListSimpleInfo(
        postParam,
        limitContent,
        userid,
      );
      data = data.concat(
        notLabelData.map((item) => {
          // let noWellCharacter = item.description.replace(/#.*#/g, '')
          // let noTagStr = noWellCharacter.replace(/<[^>]+>/g, '')
          // let hasKeyword  = this.extractSubstringWithKeyword(noTagStr, postParam.labelName)
          // const description = '<p>' + hasKeyword.replace(new RegExp(postParam.labelName, 'g'), `<span style="color:#0d8e38">${postParam.labelName}</span>`) + '</p>'
          const description = item.description;
          let obj = {
            id: item.id,
            label: item.title,
            description,
            type: 'notLabelData',
          };
          return obj;
        }),
      );
    }
    return data;
  }
  async queryNormalUsedTagList(userid) {
    let data = await model.queryNormalUsedTagList(userid);
    return data;
  }
  async changeToppingStatus(data) {
    let timeStamp = null;
    if (data.topping) {
      timeStamp = new Date().getTime();
    }
    let res = await model.changeToppingStatus(data.id, timeStamp);
    return res;
  }
}

module.exports = new Controller();
