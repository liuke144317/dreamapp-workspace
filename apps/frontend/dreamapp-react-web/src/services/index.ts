import Request from './request.ts';
const requestInstance = new Request({
  baseURL: '',
  timeout: 8000,
  interceptors: {
    requestInterceptors(config) {
      console.log('实例请求拦截器');
      return config;
    },
    responseInterceptors(res) {
      console.log('实例响应拦截器');
      return res;
    },
  },
});
export default requestInstance;
