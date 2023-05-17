import request from './request';

export async function apiReviewList(data) {
  return request
    .get<any>('/api/paper-review/list', {
      params: data,
    })
    .then((res) => {
      const data = res.data;
      return data;
    });
}

export async function apiReviewApprove(data) {
  return request.post<any>('/api/paper-review/approve', data).then((res) => {
    const data = res.data;
    return data;
  });
}

export async function apiReviewDisapprove(data) {
  return request.post<any>('/api/paper-review/disapprove', data).then((res) => {
    const data = res.data;
    return data;
  });
}

export async function apiReviewComment(comment_id, data) {
  return request
    .post<any>(`/api/paper-review/comment/${comment_id}`, data)
    .then((res) => {
      const data = res.data;
      return data;
    });
}

export async function apiReviewDownload(id, fileName) {
  return request
    .get<any>(`/api/paper-review/download/${id}/${fileName}`, {
      responseType: 'blob',
    })
    .then((res) => {
      return res;
    });
}
