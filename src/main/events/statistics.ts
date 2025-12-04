import request from '../axios'

// 获取接口调用记录 分页
export function getTestList(params) {
  return request({
    url: '/api/facetest/getTestList',
    method: 'get',
    params
  })
}
// 近30日查询结果
export function get30DaysData() {
  return request({
    url: '/api/facetest/CallThirtyStatic',
    method: 'get'
  })
}
// 获取接口调用情况
export function getCallStatic(params) {
  return request({
    url: '/api/facetest/CallStatic',
    method: 'get',
    params
  })
}
