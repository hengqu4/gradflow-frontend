import request from './request';

export async function apiPrequalList(data) {
  return request
    .get<any>('api/prequalification/list', {
      params: data,
    })
    .then((res) => {
      const data = res.data;
      return data;
    });
}

export async function apiPrequalApprove(data) {
  return request.post<any>('api/prequalification/approve', data).then((res) => {
    const data = res.data;
    return data;
  });
}

export async function apiPrequalDisapprove(data) {
  return request
    .post<any>('api/prequalification/disapprove', data)
    .then((res) => {
      const data = res.data;
      return data;
    });
}

export async function apiPrequalComment(comment_id, data) {
  return request
    .post<any>(`api/prequalification/comment/${comment_id}`, {
      data: data,
    })
    .then((res) => {
      const data = res.data;
      return data;
    });
}

export async function apiPrequalDownload(id, fileName) {
  return request
    .get<any>(`api/prequalification/download/${id}/${fileName}`, {
      responseType: 'blob',
    })
    .then((res) => {
      return res;
    });
}
