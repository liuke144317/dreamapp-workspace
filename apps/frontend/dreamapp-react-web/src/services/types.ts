import type {
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosRequestConfig,
  AxiosRequestHeaders,
} from 'axios';
export interface RequestInterceptors {
  // 请求拦截
  requestInterceptors?: (
    config: InternalAxiosRequestConfig,
  ) => InternalAxiosRequestConfig;
  requestInterceptorsCatch?: (err: AxiosError) => AxiosError;
  // 响应拦截
  responseInterceptors?: <T = AxiosResponse>(config: T) => T;
  responseInterceptorsCatch?: (err: AxiosError) => AxiosError;
}
// 自定义传入的参数
export interface RequestConfig extends AxiosRequestConfig {
  interceptors?: RequestInterceptors;
}
export interface RequestConfigWithHeaders extends InternalAxiosRequestConfig {
  interceptors?: RequestInterceptors;
}

export interface AdaptAxiosRequestConfig extends AxiosRequestConfig {
  interceptors?: RequestInterceptors;
  headers: AxiosRequestHeaders;
}
export interface requestType {
  [key: string]: string | number | boolean;
}
