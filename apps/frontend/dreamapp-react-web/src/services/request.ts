import axios from 'axios';
import type {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import type { RequestConfig, RequestInterceptors } from './types';

/*
 * 这里将其封装为一个类，而不是一个函数的原因是因为类可以创建多个实例，适用范围更广，封装性更强一些
 * */
class Request {
  instance: AxiosInstance;
  // 拦截器对象
  interceptorsObj?: RequestInterceptors;

  constructor(config?: RequestConfig) {
    this.instance = axios.create(config);
    // 类拦截器
    this.instance.interceptors.request.use(
      (request: InternalAxiosRequestConfig) => {
        console.log('全局请求拦截器');
        return request;
      },
      (error) => error,
    );
    /*
     * 实例拦截器是为了保证封装的灵活性，因为每一个实例中的拦截后处理的操作可能是不一样的，所以在定义实例时，允许我们传入拦截器。
     * */
    // 实例拦截器
    this.instance.interceptors.request.use(
      this.interceptorsObj?.requestInterceptors,
      this.interceptorsObj?.requestInterceptorsCatch,
    );
    // 实例拦截器
    this.instance.interceptors.response.use(
      this.interceptorsObj?.responseInterceptors,
      this.interceptorsObj?.responseInterceptorsCatch,
    );
    // 类拦截器,全局响应拦截器保证最后执行
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        console.log('全局响应拦截器');
        return response.data;
      },
      (error) => error,
    );
  }
  // request处可写三个泛型，响应数据的类型、响应对象的类型、请求体的类型
  request<T>(config: RequestConfig) {
    // 如果我们为单个请求设置拦截器，这里使用单个请求的拦截器
    return new Promise<T>((resolve, reject) => {
      if (config.interceptors?.requestInterceptors) {
        console.log('config.interceptors?.requestInterceptors');
        config = config.interceptors.requestInterceptors(
          config as InternalAxiosRequestConfig,
        );
      }
      this.instance
        .request<T, T>(config)
        .then((res) => {
          console.log('this.instance', res);
          // 如果我们为单个响应设置拦截器，这里使用单个响应的拦截器
          if (config.interceptors?.responseInterceptors) {
            res = config.interceptors.responseInterceptors<T>(res);
          }
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
    // return this.instance.request(config);
  }
}
export default Request;

// const index = axios.create({
//   baseURL: '',
//   timeout: 5000,
// });
// index.interceptors.request.use(
//   (config) => {
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   },
// );
// index.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     return Promise.reject(error);
//   },
// );
// export default index;
