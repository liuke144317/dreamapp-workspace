import Cookies from 'js-cookie';

const TokenKey = 'dream_app_react_web_token';

export function getToken() {
  return Cookies.get(TokenKey);
}

export function setToken(token: string) {
  return Cookies.set(TokenKey, token);
}
export function getUserInfo() {
  const res = window.localStorage.getItem('dream_app_react_web_userinfo');
  if (res) {
    return JSON.parse(res);
  } else {
    return {};
  }
}
export function setUserInfo(data: API.UserInfo['user']) {
  return window.localStorage.setItem(
    'dream_app_react_web_userinfo',
    JSON.stringify(data),
  );
}
