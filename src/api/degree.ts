import request from './request';

export async function apiDegreeList(data) {
  return request
    .get<any>('/api/degree/defform/list', {
      params: data,
    })
    .then((res) => {
      const data = res.data;
      return data;
    });
}

export async function apiDegreeApprove(data) {
  return request.post<any>('/api/degree/defform/approve', data).then((res) => {
    const data = res.data;
    return data;
  });
}

export async function apiDegreeDisapprove(data) {
  return request
    .post<any>('/api/degree/defform/disapprove', data)
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
