// 使用 useNavigate 获取 navigate，并存储到全局变量
let globalNavigate: (path: string) => void;
export const setGlobalNavigate = (navigateFn: (path: string) => void) => {
  globalNavigate = navigateFn;
};
export const navigateTo = (path: string) => {
  if (globalNavigate) {
    globalNavigate(path);
  } else {
    console.error('navigate function is not initialized yet');
  }
};
