declare namespace API {
  type MenuItem = {
    id: number;
    name: string;
    svgIcon: string;
    selected: boolean;
    path: string;
  };
  type UserInfo = {
    token: string;
    user: {
      address: null | string;
      age: null | string;
      birthday: null | string;
      email: null | string;
      nickname: null | string;
      phone: null | string;
      set_info: null | string;
      sex: null | string;
      userImg: null | string;
      userid: null | string;
      username: null | string;
    };
  };
}
