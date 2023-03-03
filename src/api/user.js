import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/api/user/login?' + data,
    method: 'get'
  })
}
export function logout(data) {
  return request({
    url: '/api/User/LogOut?' + data,
    method: 'get'
  })
}
