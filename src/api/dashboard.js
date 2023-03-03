import request from '@/utils/request'

export function msgqtyofchatingchart(query) {
  return request({
    url: '/api/business/msgqtyofchatingchart',
    method: 'get',
    params: query
  })
}
export function numofchatingchart(query) {
  return request({
    url: '/api/business/numofchatingchart',
    method: 'get',
    params: query
  })
}
export function saleschart(query) {
  return request({
    url: '/api/business/saleschart',
    method: 'get',
    params: query
  })
}
export function statsreport(query) {
  return request({
    url: '/api/business/statsreport',
    method: 'get',
    params: query
  })
}

