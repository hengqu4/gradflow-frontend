import request from './request';
import qs from 'qs';

// 返回数据
// {
//   "msg": "登录成功",
//     "code": 0,
//     "data": {
//   "id": 4,
//       "password": "0192023a7bbd73250516f069df18b500",
//       "email": "admin3@qq.com",
//       "phone": null,
//       "institution": null,
//       "username": "admin",
//       "address": null,
//       "state": 0,
//       "avatar": null,
//       "cash": null,
//       "role": null,
//       "sex": 1,
//       "signature": "zzz"
// },
//   "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2ODQyMzEwMTAsInVzZXJJZCI6NH0.Hxo8kdrjRkCNt2wYOtFDGb9RVpdaUhkKldIC5XMzEmM"
// }

type CurrentUser = {
  msg: string;
  code: number;
  data: {
    email?: string;
    phone?: string;
    institution?: string;
    username?: string;
    address?: string;
    avatar?: string;
    role?: string;
    sex?: number;
    signature?: string;
  };
  token: string;
};

type logoutRes = {
  msg: string;
  code: number;
};

type resetPassRes = {
  msg: string;
  code: number;
};

type registerRes = {
  msg: string;
  code: number;
};

type userUpdateRes = {
  msg: string;
  code: number;
  data: {
    email: string;
    avatar: string;
    sex: number;
    signature: string;
    role: string;
    address: string;
    phone: string;
  };
};

export async function login(data) {
  return request.post<CurrentUser>('/api/user/login', data).then((res) => {
    const currentUser: CurrentUser = res.data;
    return currentUser;
  });
}

export async function logout(token) {
  console.log('23333');
  return request
    .get<logoutRes>('/api/user/logout', {
      headers: {
        token: token,
      },
    })
    .then((res) => {
      console.log('res', res);
      const data: logoutRes = res.data;
      return data;
    });
}

export async function resetPassword(email, password, token) {
  return request
    .post<resetPassRes>(
      '/api/user/resetPassword',
      qs.stringify({
        email: email,
        password: password,
      }),
      {
        headers: {
          token: token,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    )
    .then((res) => {
      const data: resetPassRes = res.data;
      return data;
    });
}

export async function userInfoUpdate(data, token) {
  return request
    .post<userUpdateRes>('/api/user/updateUser', data, {
      headers: {
        token: token,
      },
    })
    .then((res) => {
      const data: userUpdateRes = res.data;
      return data;
    });
}

export async function register(data) {
  return request.post<registerRes>('/api/user/signUp', data).then((res) => {
    const data: registerRes = res.data;
    return data;
  });
}
