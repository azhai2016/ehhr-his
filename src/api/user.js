import axios from '@/libs/api.request'


export const login = ({ userName, password }) => {
  const data = {
    u:userName,
    p:password
  }
  let url= '/api/applogin';
  return axios.request({
    url: url,
    method: 'GET',
    params: data,
    responseType: 'json'
  });

}

export const getUserInfo = (token) => {
  let url= '/api/userinfo';
  return axios.request({
    url: url,
    params: {
      token
    },
    method: 'get'
  })
}

export const logout = (token) => {

  return axios.request({
    url: '/api/applogout',
    method: 'post'
  })
}
