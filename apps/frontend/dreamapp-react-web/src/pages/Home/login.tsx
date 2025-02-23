import { Image } from 'antd';
import bg from '@/assets/image/bg.png';
import SvgIcon from '@/components/SvgIcon';
import { useReducer } from 'react';
import api from '@/services';
import { setUserInfo, setUserToken } from '@/store/modules/user.ts';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  setToken as setLocalToken,
  setUserInfo as setLocalUserInfo,
} from '@/utils/auth.ts';

function Login() {
  const navigate = useNavigate();
  const dispatchRedux = useDispatch();
  async function handleLogin() {
    const res = await api.request<API.UserInfo>({
      url: '/BLogs/Login',
      method: 'POST',
      data: {
        username: userInfo.username,
        password: userInfo.password,
      },
    });
    console.log('res', res);
    if (res.status === 200) {
      // 状态管理设置token和用户信息
      dispatchRedux(setUserInfo(res.data.user));
      dispatchRedux(setUserToken(res.data.token));
      // 本地设置token和用户信息
      setLocalToken(res.data.token);
      setLocalUserInfo(res.data.user);
      // 跳转路由
      navigate('/journal');
    }
  }
  const [userInfo, dispatch] = useReducer(reducer, {
    username: '',
    password: '',
  });
  type userType = {
    username: string;
    password: string;
  };
  type actionType = {
    type: string;
    value: string;
  };
  function reducer(state: userType, action: actionType) {
    if (action.type === 'username') {
      return {
        ...state,
        username: action.value,
      };
    } else {
      return {
        ...state,
        password: action.value,
      };
    }
  }
  // const [username, setUsername] = useState('');
  // const [password, setPassword] = useState('');
  return (
    <div className="h-full w-full flex justify-center items-center">
      <div className="w-[50%] h-[50%] bg-white/50 rounded-[10px] flex flex-col  items-center justify-end">
        <div className="h-[60px] bg-[#2B6C88] rounded-t-[10px] rounded-b-none flex justify-around items-center text-amber-100 text-[20px] font-bold w-full">
          <span>DreamApp</span>
        </div>
        <div className="bg-white/50 h-[40px] border-2 divide-solid mx-[20px] mt-20 rounded-[10px] w-[320px] flex items-center">
          <SvgIcon className="ml-2" name="username" size="24px" />
          <input
            className="inline-block h-[40px] w-full bg-transparent border-none indent-[40px] text-[#2B6C88] focus:outline-none"
            type="text"
            value={userInfo.username}
            onChange={(e) =>
              dispatch({ type: 'username', value: e.target.value })
            }
          ></input>
        </div>
        <div className="bg-white/50 h-[40px] border-2 divide-solid mx-[20px] mt-10 rounded-[10px] w-[320px] flex items-center">
          <SvgIcon className="ml-2" name="password" size="24px" />
          <input
            className="inline-block h-[40px] w-full bg-transparent border-none indent-[40px] text-[#2B6C88] focus:outline-none"
            type="password"
            value={userInfo.password}
            onChange={(e) =>
              dispatch({ type: 'password', value: e.target.value })
            }
          ></input>
        </div>
        <div
          className="w-[320px] bg-[#2B6C88] rounded-[10px] h-[40px] text-[#fff] flex justify-center items-center mx-[20px] my-auto cursor-pointer hover:bg-[#3484A6]"
          onClick={handleLogin}
        >
          登录
        </div>
        <Image
          className="fixed w-full h-full top-0 left-0 z-[-1]"
          src={bg}
        ></Image>
      </div>
    </div>
  );
}
export default Login;
