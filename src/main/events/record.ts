import request from '../axios'

// 识别记录分页
export function queryFacePageList(data) {
  return request({
    url: '/face/paging',
    method: 'post',
    data
  })
}
// 字典下拉
export function getDict(dictType) {
  return request({
    url: '/dict',
    method: 'get',
    params: { dictType }
  })
}
