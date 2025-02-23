import Request from './request.ts';
import { getToken } from '@/utils/auth.ts';
import store from '@/store';
// import { useNavigate } from 'react-router-dom';
import { notification } from 'antd';
import { navigateTo } from '@/utils/navigateUtils.ts';

// const navigate = useNavigate()
const requestInstance = new Request({
  baseURL: '/DreamApp',
  timeout: 8000,
  interceptors: {
    requestInterceptors(config) {
      console.log('实例请求拦截器');
      const state = store.getState();
      const token = state.user.token;
      console.log('token', token);
      if (token) {
        config.headers['authorization'] = 'Bearer ' + getToken();
      }
      return config;
    },
    responseInterceptors(res) {
      console.log('res.data.status', res);
      if (res.data.status === 405) {
        console.log('111');
        // 提示用户登录过期
        notification.error({
          message: '提示',
          description: '用户登录过期',
        });
        // 跳转至登录页
        navigateTo('login');
        // 清空用户本地信息
      }
      return res;
    },
  },
});
export default requestInstance;
