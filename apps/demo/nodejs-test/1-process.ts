// import * as process from "process";

/**
 *  学习path（进程）
 * **/
// process.argv
// console.log('获取命令行参数1', process.argv) // 例如node 1-process.ts --config
// console.log('获取命令行参数2', process.argv0) // 例如node 1-process.ts --config

// process.env：获取环境变量
// process.env.NODE_ENV = '你好'
// console.log('环境变量', process.env.NODE_ENV)

// process.exit:0表示正常退出，1表示异常退出
// console.log('111')
// process.exit(1)
// console.log('222')

// process.on


// console.log('memoryUsage', process.memoryUsage())

process.on('exit', (code) => {
    console.log(`exit:${code}`)
})
