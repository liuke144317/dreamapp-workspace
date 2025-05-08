const { createCanvas, loadImage } = require('canvas')
// 获取虚拟 DOM 的 document 对象
const canvasWidth = 200;
const canvasHeight = 200;
const canvas = createCanvas(canvasWidth, canvasHeight);
const ctx = canvas.getContext('2d');
function measureText(val,fontSize){
    const font = `${fontSize}px arial`;
    // const canvas = document.createElement("canvas");
    // const context = canvas.getContext("2d");
    ctx.font = font;
    // const { width } = context.measureText(state);
    const { width } = ctx.measureText(val);
    return width
}
module.exports = measureText
