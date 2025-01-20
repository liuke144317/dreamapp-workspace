// src/index.ts
/**
 * 判断对象
 */
export const isObject = (value: any) =>{
    return typeof value === 'object' && value !== null
}
/**
 * 判断函数
 */
export const isFunction= (value: any) =>{
    return typeof value === 'function'
}
/**
 * 判断字符串
 */
export const isString = (value: any) => {
    return typeof value === 'string'
}
/**
 * 判断数字
 */
export const isNumber =(value: any)=>{
    return typeof value === 'number'
}
/**
 * 判断数组
 */
export const isArray = Array.isArray
