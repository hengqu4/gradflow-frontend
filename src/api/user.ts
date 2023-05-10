import request from './request';

export function login(data) {
  return request({
    url: '/gradflow/user/login',
    method: 'post',
    data,
  });
}
