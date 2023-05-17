import request from './request';

export async function apiDegreeList(data) {
  return request
    .get<any>('/api/degree/degreeform/list', {
      params: data,
    })
    .then((res) => {
      const data = res.data;
      return data;
    });
}

export async function apiDegreeApprove(data) {
  return request
    .post<any>('/api/degree/degreeform/approve', data)
    .then((res) => {
      const data = res.data;
      return data;
    });
}

export async function apiDegreeDisapprove(data) {
  return request
    .post<any>('/api/degree/degreeform/disapprove', data)
    .then((res) => {
      const data = res.data;
      return data;
    });
}

export async function apiDegreeComment(data) {
  return request
    .post<any>(`/api/degree/degreedetail/comment/`, data)
    .then((res) => {
      const data = res.data;
      return data;
    });
}
