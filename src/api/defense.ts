import request from './request';
import qs from 'qs';

export async function apiDefenseList(data) {
  return request
    .get<any>('/api/defense/defform/list', {
      params: data,
    })
    .then((res) => {
      const data = res.data;
      return data;
    });
}

export async function apiDefenseApprove(data) {
  return request.post<any>('/api/defense/defform/approve', qs.stringify({
    id: data,
  }),{
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  }).then((res) => {
    const data = res.data;
    return data;
  });
}

export async function apiDefenseDisapprove(data) {
  return request
    .post<any>('/api/defense/defform/disapprove', data)
    .then((res) => {
      const data = res.data;
      return data;
    });
}

export async function apiDefenseComment(comment_id, data) {
  return request
    .post<any>(`/api/defense/defform/comment/${comment_id}`, data)
    .then((res) => {
      const data = res.data;
      return data;
    });
}

export async function apiDefenseDownload(id, fileName) {
  return request
    .get<any>(`/api/defense/defform/download/${id}/${fileName}`, {
      responseType: 'blob',
    })
    .then((res) => {
      return res;
    });
}
